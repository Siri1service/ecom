"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, Loader2, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { formatCurrency } from "@/lib/utils";

type Category = { id: string; name: string; sku_prefix: string | null; is_active: boolean };
type ProductRow = { id: string; sku: string; title: string; slug: string; description: string | null; base_price: number; sale_price: number | null; stock_quantity: number; is_active: boolean; featured_image_url: string | null; category_id: string | null; categories: { name: string }[] | null };
const initialForm = { title: "", categoryId: "", description: "", basePrice: "", salePrice: "", stockQuantity: "0", imageUrl: "" };
const slugify = (value: string) => value.trim().toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState(initialForm);
  const [skuPreview, setSkuPreview] = useState("เลือกหมวดหมู่เพื่อสร้าง SKU");
  const [newCategory, setNewCategory] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const [productsResult, categoriesResult] = await Promise.all([
      supabase.from("products").select("id, sku, title, slug, description, base_price, sale_price, stock_quantity, is_active, featured_image_url, category_id, categories(name)").order("created_at", { ascending: false }),
      supabase.from("categories").select("id, name, sku_prefix, is_active").eq("is_active", true).order("name"),
    ]);
    if (productsResult.error || categoriesResult.error) setNotice({ type: "error", text: productsResult.error?.message ?? categoriesResult.error?.message ?? "โหลดข้อมูลไม่สำเร็จ" });
    else { setProducts((productsResult.data ?? []) as ProductRow[]); setCategories(categoriesResult.data ?? []); }
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadData(); }, 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const selectedCategory = useMemo(() => categories.find((category) => category.id === form.categoryId), [categories, form.categoryId]);
  const selectCategory = async (categoryId: string) => {
    setForm((previous) => ({ ...previous, categoryId }));
    const category = categories.find((item) => item.id === categoryId);
    setCategoryName(category?.name ?? "");
    if (!categoryId) { setSkuPreview("เลือกหมวดหมู่เพื่อสร้าง SKU"); return; }
    const { data, error } = await createClient().rpc("preview_product_sku", { p_category_id: categoryId });
    setSkuPreview(error ? "จะสร้าง SKU เมื่อบันทึกข้อมูล" : data);
  };
  const updateCategory = async () => {
    if (!selectedCategory || !categoryName.trim()) return;
    const { data, error } = await createClient().from("categories").update({ name: categoryName.trim() }).eq("id", selectedCategory.id).select("id, name, sku_prefix, is_active").single();
    if (error) { setNotice({ type: "error", text: error.message }); return; }
    setCategories((previous) => previous.map((category) => category.id === data.id ? data : category));
    setNotice({ type: "success", text: "แก้ไขชื่อหมวดหมู่แล้ว" });
  };
  const addCategory = async () => {
    const name = newCategory.trim(); if (!name) return;
    const slug = `${slugify(name) || "category"}-${Date.now().toString(36)}`;
    const { data, error } = await createClient().from("categories").insert({ name, slug, sku_prefix: slugify(name).slice(0, 12).toUpperCase() || "CAT", level: 1, is_active: true }).select("id, name, sku_prefix, is_active").single();
    if (error) { setNotice({ type: "error", text: error.message }); return; }
    setCategories((previous) => [...previous, data].sort((a, b) => a.name.localeCompare(b.name, "th"))); setCategoryName(data.name); setForm((previous) => ({ ...previous, categoryId: data.id })); void createClient().rpc("preview_product_sku", { p_category_id: data.id }).then(({ data: preview, error: previewError }) => setSkuPreview(previewError ? "จะสร้าง SKU เมื่อบันทึกข้อมูล" : preview)); setNewCategory("");
  };
  const removeCategory = async () => {
    if (!selectedCategory) return;
    if (products.some((product) => product.category_id === selectedCategory.id)) { setNotice({ type: "error", text: "หมวดหมู่นี้มีสินค้าที่เชื่อมโยงอยู่ จึงไม่สามารถลบได้" }); return; }
    const { error } = await createClient().from("categories").delete().eq("id", selectedCategory.id);
    if (error) { setNotice({ type: "error", text: error.message }); return; }
    setCategories((previous) => previous.filter((category) => category.id !== selectedCategory.id)); setCategoryName(""); await selectCategory("");
  };
  const saveProduct = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.categoryId || !form.title.trim() || form.basePrice === "") { setNotice({ type: "error", text: "กรุณากรอกชื่อสินค้า หมวดหมู่ และราคาทุน" }); return; }
    const basePrice = Number(form.basePrice), salePrice = form.salePrice === "" ? null : Number(form.salePrice), stock = Number(form.stockQuantity);
    if (![basePrice, stock, salePrice ?? 0].every(Number.isFinite) || basePrice < 0 || stock < 0 || (salePrice !== null && salePrice < 0)) { setNotice({ type: "error", text: "ราคาและจำนวนคงเหลือต้องเป็นเลขตั้งแต่ 0 ขึ้นไป" }); return; }
    setSaving(true); const slug = `${slugify(form.title) || "product"}-${Date.now().toString(36)}`;
    const { data, error } = await createClient().rpc("create_product_with_category_sku", { p_category_id: form.categoryId, p_title: form.title, p_slug: slug, p_description: form.description, p_base_price: basePrice, p_sale_price: salePrice, p_stock_quantity: stock, p_featured_image_url: form.imageUrl || null, p_is_active: true });
    setSaving(false);
    if (error) { setNotice({ type: "error", text: error.message }); return; }
    setNotice({ type: "success", text: `บันทึกสินค้าแล้ว — SKU ${data.sku}` }); setForm(initialForm); setIsOpen(false); await loadData();
  };

  return <div className="space-y-6">
    <div className="glass-panel rounded-3xl border border-white/50 p-6 shadow-xl dark:border-slate-800"><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div><h1 className="text-xl font-bold text-slate-900 dark:text-white">ข้อมูลสินค้าและคลังสินค้า</h1><p className="mt-1 text-xs text-slate-500">เชื่อมต่อ Supabase โดยตรง ไม่มีข้อมูลตัวอย่าง</p></div><div className="flex gap-2"><Button variant="outline" size="sm" onClick={() => void loadData()} disabled={loading}><RefreshCw className="mr-1.5 h-4 w-4" />รีเฟรช</Button><Button size="sm" className="bg-indigo-600" onClick={() => setIsOpen(true)}><Plus className="mr-1.5 h-4 w-4" />เพิ่มสินค้า / บริการ</Button></div></div>{notice && <div className={`mt-4 flex items-center gap-2 rounded-xl p-3 text-xs ${notice.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"}`}><CheckCircle2 className="h-4 w-4" />{notice.text}<button className="ml-auto" onClick={() => setNotice(null)}><X className="h-4 w-4" /></button></div>}</div>
    <div className="glass-panel overflow-x-auto rounded-3xl p-6 shadow-xl"><table className="w-full text-left text-xs"><thead><tr className="border-b text-slate-500"><th className="pb-3">สินค้า / SKU</th><th className="pb-3">หมวดหมู่</th><th className="pb-3">ราคา</th><th className="pb-3">คงเหลือ</th><th className="pb-3">สถานะ</th></tr></thead><tbody className="divide-y divide-slate-100">{loading ? <tr><td colSpan={5} className="py-10 text-center"><Loader2 className="mx-auto h-5 w-5 animate-spin" /></td></tr> : products.length === 0 ? <tr><td colSpan={5} className="py-10 text-center text-slate-500">ยังไม่มีสินค้าในฐานข้อมูล</td></tr> : products.map((product) => <tr key={product.id}><td className="py-3"><p className="font-semibold">{product.title}</p><p className="font-mono text-[10px] text-slate-400">{product.sku}</p></td><td>{product.categories?.[0]?.name ?? "ไม่ระบุ"}</td><td>{formatCurrency(product.sale_price ?? product.base_price)}</td><td>{product.stock_quantity}</td><td>{product.is_active ? "เปิดขาย" : "ปิดขาย"}</td></tr>)}</tbody></table></div>
    {isOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4"><form onSubmit={saveProduct} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-slate-900"><div className="mb-5 flex items-center justify-between"><div><h2 className="text-lg font-bold">เพิ่มสินค้า / บริการใหม่</h2><p className="text-xs text-slate-500">SKU สร้างเลขต่อเนื่องอัตโนมัติตามหมวดหมู่</p></div><button type="button" onClick={() => setIsOpen(false)}><X /></button></div><div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-medium">รหัสสินค้า (SKU)<Input value={skuPreview} disabled className="mt-1 font-mono" /></label><label className="text-xs font-medium">หมวดหมู่สินค้า<select required value={form.categoryId} onChange={(event) => void selectCategory(event.target.value)} className="mt-1 h-10 w-full rounded-md border bg-transparent px-3 text-sm"><option value="">เลือกหมวดหมู่</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name} ({category.sku_prefix || "CAT"})</option>)}</select></label><div className="sm:col-span-2 flex gap-2"><Input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="เพิ่มหมวดหมู่ใหม่" /><Button type="button" variant="outline" onClick={() => void addCategory()}>เพิ่มหมวดหมู่</Button></div>{selectedCategory && <div className="sm:col-span-2 flex gap-2"><Input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} placeholder="แก้ไขชื่อหมวดหมู่ที่เลือก" /><Button type="button" variant="outline" onClick={() => void updateCategory()}>บันทึกหมวดหมู่</Button><Button type="button" variant="outline" className="text-rose-600" onClick={() => void removeCategory()}><Trash2 className="h-4 w-4" /></Button></div>}<label className="sm:col-span-2 text-xs font-medium">ชื่อสินค้า / บริการ *<Input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="mt-1" /></label><label className="sm:col-span-2 text-xs font-medium">รายละเอียด<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} className="mt-1 min-h-20 w-full rounded-md border bg-transparent p-3 text-sm" /></label><label className="text-xs font-medium">ราคาทุน *<Input required type="number" min="0" step="0.01" value={form.basePrice} onChange={(event) => setForm({ ...form, basePrice: event.target.value })} className="mt-1" /></label><label className="text-xs font-medium">ราคาขาย<Input type="number" min="0" step="0.01" value={form.salePrice} onChange={(event) => setForm({ ...form, salePrice: event.target.value })} className="mt-1" /></label><label className="text-xs font-medium">จำนวนคงเหลือ<Input type="number" min="0" step="1" value={form.stockQuantity} onChange={(event) => setForm({ ...form, stockQuantity: event.target.value })} className="mt-1" /></label><label className="text-xs font-medium">URL รูปสินค้า<Input type="url" value={form.imageUrl} onChange={(event) => setForm({ ...form, imageUrl: event.target.value })} className="mt-1" /></label></div><div className="mt-6 flex justify-end gap-2"><Button type="button" variant="outline" onClick={() => setIsOpen(false)}>ยกเลิก</Button><Button type="submit" className="bg-indigo-600" disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}บันทึกข้อมูล</Button></div></form></div>}
  </div>;
}

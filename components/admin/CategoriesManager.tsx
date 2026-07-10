"use client";

import { useState } from "react";
import { FolderKanban, Edit2, Trash2, Plus, X, Upload, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
  icon: string;
  type: string;
  display_order: number;
  is_active: number;
}

interface CategoriesManagerProps {
  initialCategories: Category[];
}

export function CategoriesManager({ initialCategories }: CategoriesManagerProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [image, setImage] = useState("");
  const [icon, setIcon] = useState("ShieldCheck");
  const [type, setType] = useState("instant");
  const [isActive, setIsActive] = useState(1);

  const resetForm = () => {
    setName("");
    setSlug("");
    setImage("");
    setIcon("ShieldCheck");
    setType("instant");
    setIsActive(1);
    setEditingCategory(null);
    setShowAddForm(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const uploadData = new FormData();
      uploadData.append("file", file);

      try {
        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: uploadData,
        });

        if (!response.ok) throw new Error("Upload failed");

        const data = await response.json();
        setImage(data.url);
      } catch (err) {
        console.error(err);
        alert("Failed to upload image.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, image, icon, type }),
      });

      if (!response.ok) throw new Error("Failed to add category");

      const result = await response.json();
      
      const newCat: Category = {
        id: result.id,
        name,
        slug,
        image,
        icon,
        type,
        display_order: categories.length + 1,
        is_active: 1,
      };

      setCategories([...categories, newCat]);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create category");
    }
  };

  const handleEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;

    try {
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingCategory.id,
          name,
          slug,
          image,
          icon,
          type,
          is_active: isActive,
        }),
      });

      if (!response.ok) throw new Error("Failed to update category");

      const updated = categories.map((cat) =>
        cat.id === editingCategory.id
          ? { ...cat, name, slug, image, icon, type, is_active: isActive }
          : cat
      );

      setCategories(updated);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to update category");
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category? All services inside it will be deleted!")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete category");

      setCategories(categories.filter((cat) => cat.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete category");
    }
  };

  const startEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setImage(cat.image);
    setIcon(cat.icon);
    setType(cat.type);
    setIsActive(cat.is_active === undefined ? 1 : cat.is_active);
    setShowAddForm(false);
  };

  const moveCategory = async (index: number, direction: "up" | "down") => {
    const newCats = [...categories];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newCats.length) return;

    // Swap items
    const temp = newCats[index];
    newCats[index] = newCats[targetIdx];
    newCats[targetIdx] = temp;

    // Recalculate display order
    const updatedOrders = newCats.map((cat, idx) => ({
      id: cat.id,
      display_order: idx + 1
    }));

    // Update locally
    const savedCats = newCats.map((cat, idx) => ({
      ...cat,
      display_order: idx + 1
    }));
    setCategories(savedCats);

    // Save to database
    try {
      await fetch("/api/admin/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders: updatedOrders }),
      });
    } catch (err) {
      console.error(err);
      alert("Failed to save display order.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Category Management</h1>
          <p className="text-muted text-sm mt-1">Add, edit, or delete categories across Instant Services and Projects.</p>
        </div>
        {!showAddForm && !editingCategory && (
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Category
          </Button>
        )}
      </div>

      {/* Form Container (Add / Edit) */}
      {(showAddForm || editingCategory) && (
        <div className="bg-white border border-border p-6 rounded-3xl shadow-sm space-y-6 max-w-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-bold text-primary">
              {editingCategory ? `Edit Category: ${editingCategory.name}` : "Add New Category"}
            </h2>
            <button onClick={resetForm} className="text-muted hover:text-primary">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={editingCategory ? handleEditCategory : handleAddCategory} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrician"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (!editingCategory) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, "-"));
                    }
                  }}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Slug (URL Path)</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. electrician"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Category Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                >
                  <option value="instant">Instant Service (Hourly/Same-Day)</option>
                  <option value="quotation">Project Quotation (Multi-Day)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Icon Name (Lucide)</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                >
                  <option value="Zap">Zap (Electrician)</option>
                  <option value="AirVent">AirVent (AC Service)</option>
                  <option value="Wrench">Wrench (Plumber)</option>
                  <option value="Hammer">Hammer (Carpenter)</option>
                  <option value="Sparkles">Sparkles (Beauty)</option>
                  <option value="Paintbrush">Paintbrush (Painting)</option>
                  <option value="Droplets">Droplets (Waterproofing)</option>
                  <option value="Layers">Layers (POP Work)</option>
                  <option value="LayoutGrid">LayoutGrid (False Ceiling)</option>
                  <option value="Sofa">Sofa (Furniture)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Status Visibility</label>
              <select
                value={isActive}
                onChange={(e) => setIsActive(parseInt(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
              >
                <option value={1}>Active (Visible on Home Screen)</option>
                <option value={0}>Disabled (Hidden on Customer App)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Category Image URL or File Upload</label>
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
                <div className="relative shrink-0">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Button type="button" variant="outline" className="flex items-center gap-2 whitespace-nowrap text-sm h-10">
                    <Upload className="h-4 w-4" /> {isUploading ? "Uploading..." : "Upload File"}
                  </Button>
                </div>
              </div>
              {image && (
                <div className="mt-3 relative h-32 w-48 rounded-xl overflow-hidden border border-border bg-surface">
                  <img src={image} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="submit">
                {editingCategory ? "Save Changes" : "Create Category"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Grid of Existing Categories */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-surface">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted">
                    <FolderKanban className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-1.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    cat.type === "instant" 
                      ? "bg-green-500 text-white" 
                      : "bg-blue-500 text-white"
                  }`}>
                    {cat.type === "instant" ? "Instant" : "Quotation"}
                  </span>
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    cat.is_active === 1 
                      ? "bg-emerald-500 text-white" 
                      : "bg-red-500 text-white"
                  }`}>
                    {cat.is_active === 1 ? "Active" : "Disabled"}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary flex items-center gap-2">
                  {cat.name}
                </h3>
                <p className="text-xs text-muted mt-1">Slug: /services/{cat.slug}</p>
                <p className="text-xs text-muted mt-0.5">Icon: {cat.icon}</p>
                <p className="text-xs text-muted mt-0.5">Order: {cat.display_order}</p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-border flex flex-col gap-3 mt-auto">
              <div className="flex gap-2 w-full pt-3">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveCategory(idx, "up")}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-border hover:bg-surface disabled:opacity-40 transition-colors"
                >
                  Move Up
                </button>
                <button
                  type="button"
                  disabled={idx === categories.length - 1}
                  onClick={() => moveCategory(idx, "down")}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold border border-border hover:bg-surface disabled:opacity-40 transition-colors"
                >
                  Move Down
                </button>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => startEdit(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-semibold border border-border text-primary hover:bg-surface transition-colors"
                >
                  <Edit2 className="h-4 w-4" /> Edit
                </button>
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="flex items-center justify-center py-2 px-3 rounded-xl border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

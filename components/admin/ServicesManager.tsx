"use client";

import { useState } from "react";
import { Wrench, Edit2, Trash2, Plus, X, Upload, Star, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Service {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  is_active: number;
  is_featured: number;
  is_popular: number;
  display_order: number;
  arrival_time: string;
  is_recommended: number;
  features?: string | string[];
}

interface Category {
  id: number;
  name: string;
  slug: string;
  type: string;
}

interface ServicesManagerProps {
  initialServices: Service[];
  categories: Category[];
}

export function ServicesManager({ initialServices, categories }: ServicesManagerProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [features, setFeatures] = useState("");

  // Form states
  const [categoryId, setCategoryId] = useState(categories.filter(c => c.type === "instant")[0]?.id || "");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [image, setImage] = useState("");
  const [isActive, setIsActive] = useState(1);
  const [isFeatured, setIsFeatured] = useState(0);
  const [isPopular, setIsPopular] = useState(0);
  const [arrivalTime, setArrivalTime] = useState("30-45 mins");
  const [isRecommended, setIsRecommended] = useState(0);

  // Filter out quotation categories since services are only for instant categories
  const instantCategories = categories.filter((c) => c.type === "instant");

  const resetForm = () => {
    setCategoryId(instantCategories[0]?.id || "");
    setName("");
    setDescription("");
    setFeatures("");
    setPrice("");
    setDuration("");
    setImage("");
    setIsActive(1);
    setIsFeatured(0);
    setIsPopular(0);
    setArrivalTime("30-45 mins");
    setIsRecommended(0);
    setEditingService(null);
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

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();

    const parsedFeatures = features.split("\n").map(f => f.trim()).filter(Boolean);

    try {
      const response = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categoryId: parseInt(categoryId.toString()),
          name,
          description,
          price: parseFloat(price),
          duration,
          image,
          arrival_time: arrivalTime,
          is_recommended: isRecommended,
          features: JSON.stringify(parsedFeatures)
        }),
      });

      if (!response.ok) throw new Error("Failed to add service");

      const result = await response.json();
      const selectedCat = categories.find((c) => c.id === parseInt(categoryId.toString()));

      const newService: Service = {
        id: result.id,
        category_id: parseInt(categoryId.toString()),
        category_name: selectedCat?.name || "",
        name,
        description,
        price: parseFloat(price),
        duration,
        image,
        is_active: 1,
        is_featured: 0,
        is_popular: 0,
        display_order: services.length + 1,
        arrival_time: arrivalTime,
        is_recommended: isRecommended,
        features: parsedFeatures
      };

      setServices([...services, newService]);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to create service");
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const parsedFeatures = features.split("\n").map(f => f.trim()).filter(Boolean);

    try {
      const response = await fetch("/api/admin/services", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingService.id,
          categoryId: parseInt(categoryId.toString()),
          name,
          description,
          price: parseFloat(price),
          duration,
          image,
          is_active: isActive,
          is_featured: isFeatured,
          is_popular: isPopular,
          arrival_time: arrivalTime,
          is_recommended: isRecommended,
          features: JSON.stringify(parsedFeatures)
        }),
      });

      if (!response.ok) throw new Error("Failed to update service");

      const selectedCat = categories.find((c) => c.id === parseInt(categoryId.toString()));
      const updated = services.map((s) =>
        s.id === editingService.id
          ? {
              ...s,
              category_id: parseInt(categoryId.toString()),
              category_name: selectedCat?.name || "",
              name,
              description,
              price: parseFloat(price),
              duration,
              image,
              is_active: isActive,
              is_featured: isFeatured,
              is_popular: isPopular,
              arrival_time: arrivalTime,
              is_recommended: isRecommended,
              features: parsedFeatures
            }
          : s
      );

      setServices(updated);
      resetForm();
    } catch (err) {
      console.error(err);
      alert("Failed to update service");
    }
  };

  const handleDeleteService = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/services?id=${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete service");

      setServices(services.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete service");
    }
  };

  const startEdit = (s: Service) => {
    setEditingService(s);
    setCategoryId(s.category_id);
    setName(s.name);
    setDescription(s.description);
    setPrice(s.price.toString());
    setDuration(s.duration);
    setImage(s.image);
    setIsActive(s.is_active);
    setIsFeatured(s.is_featured);
    setIsPopular(s.is_popular);
    setArrivalTime(s.arrival_time || "30-45 mins");
    setIsRecommended(s.is_recommended || 0);
    
    // Parse features to string for textarea
    let parsedFeatures: string[] = [];
    if (s.features) {
      if (Array.isArray(s.features)) {
        parsedFeatures = s.features;
      } else {
        try {
          parsedFeatures = JSON.parse(s.features);
        } catch {
          parsedFeatures = s.features.split("\n").filter(Boolean);
        }
      }
    }
    setFeatures(Array.isArray(parsedFeatures) ? parsedFeatures.join("\n") : "");

    setShowAddForm(false);
  };

  const moveService = async (index: number, direction: "up" | "down") => {
    const newSvcs = [...services];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newSvcs.length) return;

    // Swap items
    const temp = newSvcs[index];
    newSvcs[index] = newSvcs[targetIdx];
    newSvcs[targetIdx] = temp;

    // Recalculate display order
    const updatedOrders = newSvcs.map((s, idx) => ({
      id: s.id,
      display_order: idx + 1
    }));

    // Update locally
    const savedSvcs = newSvcs.map((s, idx) => ({
      ...s,
      display_order: idx + 1
    }));
    setServices(savedSvcs);

    // Save to database
    try {
      await fetch("/api/admin/services", {
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
          <h1 className="text-3xl font-bold text-primary">Service Management</h1>
          <p className="text-muted text-sm mt-1">Manage individual service items, prices, durations, and status.</p>
        </div>
        {!showAddForm && !editingService && (
          <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Service
          </Button>
        )}
      </div>

      {/* Form Container (Add / Edit) */}
      {(showAddForm || editingService) && (
        <div className="bg-white border border-border p-6 rounded-3xl shadow-sm space-y-6 max-w-2xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <h2 className="text-xl font-bold text-primary">
              {editingService ? `Edit Service: ${editingService.name}` : "Add New Service"}
            </h2>
            <button onClick={resetForm} className="text-muted hover:text-primary">
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={editingService ? handleEditService : handleAddService} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Category</label>
                <select
                  required
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                >
                  <option value="">Select a category</option>
                  {instantCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fan Installation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Short Description</label>
              <textarea
                placeholder="Brief description of the service..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 rounded-xl border border-border text-sm outline-none focus:border-secondary resize-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Price (₹)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 299"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Duration</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30 mins, 1 hr"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">Estimated Arrival Time</label>
                <input
                  type="text"
                  placeholder="e.g. 30-45 mins, 45-60 mins"
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-primary mb-1.5">AI Recommended Pin</label>
                <select
                  value={isRecommended}
                  onChange={(e) => setIsRecommended(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-border text-sm outline-none focus:border-secondary bg-white"
                >
                  <option value={0}>Auto-sort (Standard)</option>
                  <option value={1}>Pin in &quot;Recommended Near You&quot;</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-primary mb-1.5">Service Image URL or File Upload</label>
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

            <div className="border-t border-border pt-4 mt-2 space-y-4">
              <h4 className="text-xs font-semibold text-primary uppercase tracking-wider">Service Flags</h4>
              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 text-sm font-medium text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive === 1}
                    onChange={(e) => setIsActive(e.target.checked ? 1 : 0)}
                    className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-secondary"
                  />
                  Enabled (Active)
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isFeatured === 1}
                    onChange={(e) => setIsFeatured(e.target.checked ? 1 : 0)}
                    className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-secondary"
                  />
                  Trending / Most Booked (Featured)
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-primary cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPopular === 1}
                    onChange={(e) => setIsPopular(e.target.checked ? 1 : 0)}
                    className="h-4.5 w-4.5 rounded border-border text-primary focus:ring-secondary"
                  />
                  Popular
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button type="submit">
                {editingService ? "Save Changes" : "Create Service"}
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Services Table List */}
      <div className="bg-white border border-border rounded-3xl shadow-sm overflow-hidden">
        {services.length === 0 ? (
          <div className="p-12 text-center text-muted text-sm">
            <Wrench className="h-12 w-12 mx-auto text-muted/30 mb-3" />
            No services registered in the database yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface text-xs font-semibold text-primary uppercase border-b border-border">
                  <th className="px-6 py-4">Image</th>
                  <th className="px-6 py-4">Service Details</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Arrival / Duration</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Status & Badges</th>
                  <th className="px-6 py-4">Reorder</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {services.map((s, idx) => (
                  <tr key={s.id} className="hover:bg-surface/50">
                    <td className="px-6 py-4">
                      <div className="h-12 w-16 rounded-lg overflow-hidden border border-border bg-surface shrink-0">
                        {s.image ? (
                          <img src={s.image} alt={s.name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex h-full items-center justify-center text-muted bg-surface/50">
                            <Wrench className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-primary block">{s.name}</span>
                      <span className="text-xs text-muted block truncate max-w-[250px]" title={s.description}>
                        {s.description || "No description provided."}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-primary">{s.category_name}</td>
                    <td className="px-6 py-4">
                      <span className="block text-primary font-semibold">{s.arrival_time || "30-45 mins"}</span>
                      <span className="text-xs text-muted block">Dur: {s.duration}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-[#20BD5A] block">₹{s.price}</span>
                    </td>
                    <td className="px-6 py-4 space-y-1">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
                        s.is_active === 1 
                          ? "bg-green-50 text-green-700 border border-green-250" 
                          : "bg-red-50 text-red-700 border border-red-250"
                      }`}>
                        {s.is_active === 1 ? "Active" : "Disabled"}
                      </span>
                      <div className="flex gap-1.5 flex-wrap">
                        {s.is_featured === 1 && (
                          <span className="bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5 text-[10px] font-bold">
                            Featured
                          </span>
                        )}
                        {s.is_popular === 1 && (
                          <span className="bg-secondary/15 text-secondary border border-secondary/25 rounded px-1.5 py-0.5 text-[10px] font-bold">
                            Popular
                          </span>
                        )}
                        {s.is_recommended === 1 && (
                          <span className="bg-blue-50 text-blue-700 border border-blue-150 rounded px-1.5 py-0.5 text-[10px] font-bold">
                            Recommended
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 max-w-[80px]">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => moveService(idx, "up")}
                          className="px-2 py-0.5 text-[10px] font-bold border border-border hover:bg-surface disabled:opacity-40 rounded transition-colors"
                        >
                          Up
                        </button>
                        <button
                          type="button"
                          disabled={idx === services.length - 1}
                          onClick={() => moveService(idx, "down")}
                          className="px-2 py-0.5 text-[10px] font-bold border border-border hover:bg-surface disabled:opacity-40 rounded transition-colors"
                        >
                          Down
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(s)}
                          className="p-1.5 rounded-lg border border-border text-primary hover:bg-surface transition-colors"
                          title="Edit Service"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteService(s.id)}
                          className="p-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete Service"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

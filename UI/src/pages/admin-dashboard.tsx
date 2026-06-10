import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, Edit, Trash2, CheckCircle, Package, ShoppingBag, 
  DollarSign, RefreshCw, Eye, ArrowRight, Star
} from "lucide-react";

export default function AdminDashboard() {
  const { user, token, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "orders">("overview");
  
  // Modals state
  const [productModal, setProductModal] = useState<{
    isOpen: boolean;
    mode: "add" | "edit";
    productData?: any;
  }>({ isOpen: false, mode: "add" });

  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "",
    isFeatured: false,
    inStock: true
  });

  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      setLocation("/admin/login");
    }
  }, [user, setLocation]);

  // Fetch Categories
  const { data: categories = [] } = useQuery<any[]>({
    queryKey: ["/api/categories"]
  });

  // Fetch Products
  const { data: products = [], refetch: refetchProducts } = useQuery<any[]>({
    queryKey: ["/api/products"]
  });

  // Fetch Orders
  const { data: orders = [], refetch: refetchOrders } = useQuery<any[]>({
    queryKey: ["/api/orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Failed to fetch orders");
      return res.json();
    },
    enabled: !!token
  });

  // Overview calculations
  const totalSales = orders
    .filter((o: any) => o.status !== "Cancelled")
    .reduce((sum: number, o: any) => sum + o.totalAmount, 0);
  const totalOrdersCount = orders.length;
  const totalProductsCount = products.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;

  // Add/Edit Product Mutation
  const saveProductMutation = useMutation({
    mutationFn: async () => {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      };
      const url = productModal.mode === "add" 
        ? "/api/products" 
        : `/api/products/${productModal.productData._id}`;
      const method = productModal.mode === "add" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers,
        body: JSON.stringify({
          ...newProduct,
          price: Number(newProduct.price)
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save product");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setProductModal({ isOpen: false, mode: "add" });
      resetProductForm();
      toast({
        title: productModal.mode === "add" ? "Product Created" : "Product Updated",
        description: "Your product database updates were committed successfully."
      });
    },
    onError: (err: any) => {
      toast({
        title: "Database Error",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  // Delete Product Mutation
  const deleteProductMutation = useMutation({
    mutationFn: async (prodId: string) => {
      const res = await fetch(`/api/products/${prodId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete product");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Deleted",
        description: "The dessert has been removed from the database."
      });
    },
    onError: (err: any) => {
      toast({
        title: "Deletion Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  // Update Order Status Mutation
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to update order status");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order Status Updated",
        description: "Customer status tracker refreshed in real-time."
      });
    },
    onError: (err: any) => {
      toast({
        title: "Status Update Failed",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  const openAddModal = () => {
    resetProductForm();
    if (categories.length > 0) {
      setNewProduct(prev => ({ ...prev, category: categories[0]._id }));
    }
    setProductModal({ isOpen: true, mode: "add" });
  };

  const openEditModal = (prod: any) => {
    setNewProduct({
      name: prod.name,
      description: prod.description,
      price: prod.price.toString(),
      image: prod.image,
      category: prod.category?._id || "",
      isFeatured: !!prod.isFeatured,
      inStock: !!prod.inStock
    });
    setProductModal({ isOpen: true, mode: "edit", productData: prod });
  };

  const resetProductForm = () => {
    setNewProduct({
      name: "",
      description: "",
      price: "",
      image: "",
      category: categories[0]?._id || "",
      isFeatured: false,
      inStock: true
    });
  };

  if (!user || !user.isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col justify-between animate-in fade-in duration-500">
      <Navbar />

      <div className="container mx-auto px-6 py-32 max-w-7xl flex-grow">
        
        {/* Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/40 pb-8 mb-12">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif font-bold text-accent">Management Dashboard</h1>
            <p className="text-muted-foreground text-sm">
              Welcome back, <span className="font-bold text-primary">{user.username}</span>. Monitor orders and update product catalogs.
            </p>
          </div>
          <div className="flex gap-4">
            <Button
              onClick={() => {
                refetchProducts();
                refetchOrders();
              }}
              variant="outline"
              className="rounded-xl border-border hover:border-primary hover:text-primary transition-all"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Sync Data
            </Button>
            <Button
              onClick={logout}
              variant="destructive"
              className="rounded-xl font-bold transition-all"
            >
              Log Out
            </Button>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-4 border-b border-border/40 pb-4 mb-8">
          {[
            { id: "overview", label: "Overview", icon: DollarSign },
            { id: "products", label: "Products DB", icon: Package },
            { id: "orders", label: "Customer Orders", icon: ShoppingBag }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-accent text-white shadow-sm"
                    : "text-muted-foreground hover:bg-secondary/40 hover:text-accent"
                }`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Contents */}

        {/* Tab 1: Overview */}
        {activeTab === "overview" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Gross Sales</p>
                <h3 className="text-3xl font-serif font-bold text-accent">${totalSales.toFixed(2)}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Volume Orders</p>
                <h3 className="text-3xl font-serif font-bold text-accent">{totalOrdersCount}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Database Products</p>
                <h3 className="text-3xl font-serif font-bold text-accent">{totalProductsCount}</h3>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-border/40 space-y-2">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Avg. Basket Size</p>
                <h3 className="text-3xl font-serif font-bold text-accent">${avgOrderValue.toFixed(2)}</h3>
              </div>
            </div>

            {/* Quick action list */}
            <div className="bg-white p-8 rounded-3xl border border-border/40 shadow-sm space-y-6">
              <h3 className="text-2xl font-serif font-bold text-accent">Quick Operations</h3>
              <div className="flex flex-wrap gap-4">
                <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 py-4 shadow-sm font-bold flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add New Dessert
                </Button>
                <Button onClick={() => setActiveTab("orders")} variant="outline" className="rounded-xl px-6 border-border hover:border-accent hover:text-accent font-bold">
                  View Placed Orders <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Manager */}
        {activeTab === "products" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-serif font-bold text-accent">Products Catalog</h3>
              <Button onClick={openAddModal} className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-sm font-bold flex items-center gap-2 cursor-pointer">
                <Plus className="w-4 h-4" /> Create Product
              </Button>
            </div>

            <div className="bg-white rounded-3xl border border-border/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/20 border-b border-border/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="p-5">Preview</th>
                      <th className="p-5">Name</th>
                      <th className="p-5">Category</th>
                      <th className="p-5">Price</th>
                      <th className="p-5">Featured</th>
                      <th className="p-5">Stock</th>
                      <th className="p-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {products.map((prod) => (
                      <tr key={prod._id} className="hover:bg-secondary/10 transition-colors text-sm text-foreground">
                        <td className="p-5">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            className="w-12 h-12 object-cover rounded-lg bg-secondary/30"
                          />
                        </td>
                        <td className="p-5 font-bold text-foreground">{prod.name}</td>
                        <td className="p-5 text-muted-foreground">{prod.category?.name || "Uncategorized"}</td>
                        <td className="p-5 font-bold text-accent">${prod.price.toFixed(2)}</td>
                        <td className="p-5">
                          {prod.isFeatured ? (
                            <span className="bg-primary/20 text-primary-foreground font-serif font-bold text-xs uppercase px-2.5 py-0.5 rounded-full">
                              Signature
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="p-5">
                          {prod.inStock ? (
                            <span className="text-green-600 font-bold text-xs">In Stock</span>
                          ) : (
                            <span className="text-red-500 font-bold text-xs">Sold Out</span>
                          )}
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openEditModal(prod)}
                              size="icon"
                              variant="ghost"
                              className="rounded-full hover:bg-secondary/40 text-muted-foreground hover:text-accent cursor-pointer"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => {
                                if (confirm(`Delete ${prod.name}?`)) {
                                  deleteProductMutation.mutate(prod._id);
                                }
                              }}
                              size="icon"
                              variant="ghost"
                              className="rounded-full hover:bg-red-50 text-red-500 hover:text-red-700 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Orders Manager */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className="text-2xl font-serif font-bold text-accent">Customer Invoices</h3>

            <div className="bg-white rounded-3xl border border-border/40 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-secondary/20 border-b border-border/40 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="p-5">Order ID</th>
                      <th className="p-5">Customer</th>
                      <th className="p-5">Purchases</th>
                      <th className="p-5">Grand Total</th>
                      <th className="p-5">Date</th>
                      <th className="p-5">Status</th>
                      <th className="p-5 text-right">Transition Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {orders.map((ord: any) => (
                      <tr key={ord._id} className="hover:bg-secondary/10 transition-colors text-sm text-foreground">
                        <td className="p-5 font-mono text-xs text-primary font-bold">{ord._id.slice(-6).toUpperCase()}</td>
                        <td className="p-5">
                          <p className="font-bold">{ord.shippingAddress.name}</p>
                          <p className="text-xs text-muted-foreground">{ord.shippingAddress.email}</p>
                        </td>
                        <td className="p-5">
                          <div className="max-w-[200px] text-xs space-y-1">
                            {ord.items.map((item: any, idx: number) => (
                              <p key={idx} className="line-clamp-1">
                                {item.product?.name || "Deleted Item"} x{item.quantity}
                              </p>
                            ))}
                          </div>
                        </td>
                        <td className="p-5 font-serif font-bold text-accent">${ord.totalAmount.toFixed(2)}</td>
                        <td className="p-5 text-muted-foreground text-xs">
                          {new Date(ord.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            ord.status === "Pending" ? "bg-amber-100 text-amber-700" :
                            ord.status === "Processing" ? "bg-blue-100 text-blue-700" :
                            ord.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                            ord.status === "Completed" ? "bg-green-100 text-green-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatusMutation.mutate({ orderId: ord._id, status: e.target.value })}
                            className="bg-background border border-border rounded-xl px-2 py-1 text-xs font-semibold focus:outline-none focus:border-primary"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Slide-out Overlay Modal for Add/Edit Product */}
      {productModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl max-w-xl w-full border border-border/40 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-350">
            <h3 className="text-3xl font-serif font-bold text-accent">
              {productModal.mode === "add" ? "Create New Dessert" : "Edit Dessert Details"}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prodName">Dessert Name</Label>
                  <Input
                    id="prodName"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Classic Scone"
                    className="rounded-xl border-border bg-background"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prodPrice">Price ($)</Label>
                  <Input
                    id="prodPrice"
                    type="number"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="4.99"
                    className="rounded-xl border-border bg-background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prodDesc">Description</Label>
                <Textarea
                  id="prodDesc"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Tell us about the ingredients and taste profile..."
                  className="rounded-xl border-border bg-background min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="prodCat">Category</Label>
                  <select
                    id="prodCat"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-background border border-border rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
                  >
                    {categories.map((cat: any) => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prodImg">Image URL</Label>
                  <Input
                    id="prodImg"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                    placeholder="/images/cake-strawberry.png"
                    className="rounded-xl border-border bg-background"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.isFeatured}
                    onChange={(e) => setNewProduct({ ...newProduct, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-primary border-border rounded"
                  />
                  Featured Masterpiece
                </label>

                <label className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProduct.inStock}
                    onChange={(e) => setNewProduct({ ...newProduct, inStock: e.target.checked })}
                    className="w-4 h-4 text-primary border-border rounded"
                  />
                  In Stock Availability
                </label>
              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-border/40 pt-4">
              <Button
                onClick={() => setProductModal({ isOpen: false, mode: "add" })}
                variant="outline"
                className="rounded-xl border-border cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                onClick={() => saveProductMutation.mutate()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl cursor-pointer"
                disabled={saveProductMutation.isPending}
              >
                {saveProductMutation.isPending ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

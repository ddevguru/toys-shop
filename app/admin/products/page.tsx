'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Upload, Download, Search } from 'lucide-react';
import Image from 'next/image';

export default function AdminProducts() {
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated || !isAdmin) {
        router.push('/');
        return;
      }
      loadProducts();
      loadCategories();
    }
  }, [isAuthenticated, isAdmin, loading]);

  const loadProducts = async () => {
    try {
      const response = await api.getProducts();
      if (response.success) {
        setProducts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const loadCategories = async () => {
    // Load categories - you might need to create this endpoint
    setCategories([
      { id: 1, name: 'Cartoon Characters' },
      { id: 2, name: 'Superheroes' },
      { id: 3, name: 'Creative' },
      { id: 4, name: 'Educational' },
      { id: 5, name: 'Plush Toys' },
    ]);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      await api.deleteProduct(id);
      loadProducts();
    } catch (error) {
      alert('Failed to delete product');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      name: formData.get('name'),
      price: parseFloat(formData.get('price') as string),
      stock_quantity: parseInt(formData.get('stock_quantity') as string),
      category_id: parseInt(formData.get('category_id') as string),
      description: formData.get('description'),
      discount_price: formData.get('discount_price') ? parseFloat(formData.get('discount_price') as string) : null,
      badge: formData.get('badge'),
      is_featured: formData.get('is_featured') === 'on',
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, data);
      } else {
        await api.createProduct(data);
      }
      setIsDialogOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error: any) {
      alert(error.message || 'Failed to save product');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await api.importProducts(file);
      alert('Products imported successfully!');
      loadProducts();
    } catch (error: any) {
      alert(error.message || 'Failed to import products');
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.exportProducts();
      if (response.success && response.file_url) {
        window.open(response.file_url, '_blank');
      }
    } catch (error) {
      alert('Failed to export products');
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Products</h1>
            <p className="text-foreground/70">Manage your product catalog</p>
          </div>
          <div className="flex gap-4">
            <Button onClick={handleExport} variant="outline">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <label>
              <Button variant="outline" asChild>
                <span>
                  <Upload className="mr-2 h-4 w-4" /> Import
                </span>
              </Button>
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleImport}
                className="hidden"
              />
            </label>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingProduct(null)}>
                  <Plus className="mr-2 h-4 w-4" /> Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input name="name" defaultValue={editingProduct?.name} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Price</Label>
                      <Input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required />
                    </div>
                    <div>
                      <Label>Discount Price (Optional)</Label>
                      <Input name="discount_price" type="number" step="0.01" defaultValue={editingProduct?.discount_price} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Stock Quantity</Label>
                      <Input name="stock_quantity" type="number" defaultValue={editingProduct?.stock_quantity} required />
                    </div>
                    <div>
                      <Label>Category</Label>
                      <Select name="category_id" defaultValue={editingProduct?.category_id?.toString()}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(cat => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea name="description" defaultValue={editingProduct?.description} rows={4} />
                  </div>
                  <div>
                    <Label>Badge (Optional)</Label>
                    <Input name="badge" defaultValue={editingProduct?.badge} placeholder="New, Best Seller, etc." />
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" name="is_featured" defaultChecked={editingProduct?.is_featured} />
                    <Label>Featured Product</Label>
                  </div>
                  <Button type="submit" className="w-full">
                    {editingProduct ? 'Update' : 'Create'} Product
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground/50 h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardHeader>
                {product.main_image && (
                  <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                    <Image
                      src={product.main_image}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm text-foreground/70">Price: ₹{product.price}</p>
                  {product.discount_price && (
                    <p className="text-sm text-foreground/70">Discount: ₹{product.discount_price}</p>
                  )}
                  <p className="text-sm text-foreground/70">Stock: {product.stock_quantity}</p>
                  <p className="text-sm text-foreground/70">Category: {product.category_name}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingProduct(product);
                      setIsDialogOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


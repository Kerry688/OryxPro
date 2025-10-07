'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Combobox } from '@/components/ui/combobox';
import { 
  Plus, 
  Search, 
  Trash2, 
  Save,
  ArrowLeft,
  Package,
  ShoppingCart,
  Calculator,
  FileText,
  AlertCircle,
  CheckCircle,
  Download,
  Upload,
  Trash,
  FileSpreadsheet,
  Hash
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { products, suppliers, branches, warehouses } from '@/lib/data';
import type { Product, Supplier, Branch, Warehouse } from '@/lib/data';

interface PurchaseOrderItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  receivedQuantity: number;
  notes: string;
}

interface PurchaseOrderFormData {
  poNumber: string;
  supplierId: string;
  branchId: string;
  warehouseId: string;
  expectedDeliveryDate: string;
  notes: string;
  status: string;
}

export default function CreatePurchaseOrderPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  // Generate PO number
  const generatePONumber = () => {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `PO-${year}${month}${day}-${random}`;
  };

  const [formData, setFormData] = useState<PurchaseOrderFormData>({
    poNumber: generatePONumber(),
    supplierId: '',
    branchId: '',
    warehouseId: '',
    expectedDeliveryDate: '',
    notes: '',
    status: 'draft'
  });

  const [items, setItems] = useState<PurchaseOrderItem[]>([
    {
      id: '1',
      productId: '',
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      receivedQuantity: 0,
      notes: ''
    }
  ]);

  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter products based on search
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(productSearchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(productSearchQuery.toLowerCase())
  );

  // Helper functions
  const getSupplier = (supplierId: string) => suppliers.find(s => s.id === supplierId);
  const getBranch = (branchId: string) => branches.find(b => b.id === branchId);
  const getWarehouse = (warehouseId: string) => warehouses.find(w => w.id === warehouseId);
  const getBranchWarehouses = (branchId: string) => warehouses.filter(w => w.branchId === branchId);

  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
  const tax = subtotal * 0.1; // 10% tax
  const grandTotal = subtotal + tax;

  // Item management functions
  const addItem = () => {
    const newItem: PurchaseOrderItem = {
      id: (items.length + 1).toString(),
      productId: '',
      quantity: 0,
      unitPrice: 0,
      totalPrice: 0,
      receivedQuantity: 0,
      notes: ''
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof PurchaseOrderItem, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-populate product details when product is selected
    if (field === 'productId' && value) {
      const product = products.find(p => p.id === value);
      if (product) {
        updatedItems[index].product = product;
        updatedItems[index].unitPrice = product.basePrice;
      }
    }
    
    // Recalculate total price
    if (field === 'quantity' || field === 'unitPrice') {
      updatedItems[index].totalPrice = updatedItems[index].quantity * updatedItems[index].unitPrice;
    }
    
    setItems(updatedItems);
  };

  const addProductToOrder = (product: Product) => {
    const existingItemIndex = items.findIndex(item => item.productId === product.id);
    
    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updateItem(existingItemIndex, 'quantity', items[existingItemIndex].quantity + 1);
    } else {
      // Add new item
      const newItem: PurchaseOrderItem = {
        id: (items.length + 1).toString(),
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.basePrice,
        totalPrice: product.basePrice,
        receivedQuantity: 0,
        notes: ''
      };
      setItems([...items, newItem]);
    }
    setProductSearchQuery('');
  };

  // Bulk action functions
  const deleteAllItems = () => {
    if (items.length > 0) {
      setItems([{
        id: '1',
        productId: '',
        quantity: 0,
        unitPrice: 0,
        totalPrice: 0,
        receivedQuantity: 0,
        notes: ''
      }]);
      toast({
        title: "All items deleted",
        description: "All products have been removed from the purchase order.",
      });
    }
  };

  const exportToExcel = () => {
    // Create CSV content
    const headers = ['Product', 'SKU', 'Quantity', 'Unit Price', 'Total Price', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...items
        .filter(item => item.productId)
        .map(item => {
          const product = getProduct(item.productId);
          return [
            product?.name || '',
            product?.sku || '',
            item.quantity,
            item.unitPrice,
            item.totalPrice,
            `"${item.notes.replace(/"/g, '""')}"` // Escape quotes in notes
          ].join(',');
        })
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `purchase-order-${formData.poNumber}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: "Purchase order items have been exported to CSV.",
    });
  };

  const importFromExcel = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',');
        
        // Skip header row and process data
        const importedItems = lines.slice(1)
          .filter(line => line.trim())
          .map((line, index) => {
            const values = line.split(',').map(v => v.replace(/"/g, ''));
            // Find product by name or SKU
            const productName = values[0];
            const product = products.find(p => p.name === productName || p.sku === values[1]);
            
            if (product) {
              return {
                id: (items.length + index + 1).toString(),
                productId: product.id,
                product: product,
                quantity: parseInt(values[2]) || 1,
                unitPrice: parseFloat(values[3]) || product.basePrice,
                totalPrice: parseFloat(values[4]) || (parseInt(values[2]) || 1) * (parseFloat(values[3]) || product.basePrice),
                receivedQuantity: 0,
                notes: values[5] || ''
              };
            }
            return null;
          })
          .filter(Boolean) as PurchaseOrderItem[];

        if (importedItems.length > 0) {
          setItems([...items.filter(item => item.productId), ...importedItems]);
          toast({
            title: "Import successful",
            description: `${importedItems.length} items imported successfully.`,
          });
        } else {
          toast({
            title: "Import failed",
            description: "No valid products found in the imported file.",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Error reading the file. Please check the format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.supplierId || !formData.branchId || !formData.expectedDeliveryDate) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields (Supplier, Branch, Expected Delivery Date)",
        variant: "destructive"
      });
      return;
    }

    if (items.every(item => item.productId === '' || item.quantity === 0)) {
      toast({
        title: "Validation Error", 
        description: "Please add at least one item to the purchase order",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Here you would typically save the purchase order to your API
      const purchaseOrderData = {
        ...formData,
        items: items.filter(item => item.productId && item.quantity > 0),
        subtotal,
        tax,
        total: grandTotal,
        createdAt: new Date().toISOString(),
        createdBy: 'current-user-id' // Replace with actual user ID
      };

      console.log('Creating Purchase Order:', purchaseOrderData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Purchase order created successfully!",
      });

      router.push('/warehouse/purchase-orders');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create purchase order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 no-scrollbar">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </Button>
          <div>
            <h1 className="text-3xl flex items-center space-x-2">
              <ShoppingCart className="h-8 w-8" />
              <span>Create Purchase Order</span>
            </h1>
            <div className="flex items-center space-x-4 mt-2">
              <p className="text-muted-foreground">Create a new purchase order with enhanced item management</p>
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Hash className="h-3 w-3" />
                <span>{formData.poNumber}</span>
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <FileText className="h-3 w-3" />
            <span>Draft</span>
          </Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader className="no-scrollbar">
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Purchase Order Information</span>
            </CardTitle>
            <CardDescription>
              Enter the basic information for the purchase order
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier *</Label>
                <Combobox
                  items={suppliers.map(s => ({ label: s.name, value: s.id }))}
                  placeholder="Search suppliers..."
                  noResultsText="No suppliers found."
                  selected={formData.supplierId}
                  onSelect={(value) => setFormData({ ...formData, supplierId: value || '' })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedDeliveryDate">Expected Delivery Date *</Label>
                <Input
                  id="expectedDeliveryDate"
                  type="date"
                  value={formData.expectedDeliveryDate}
                  onChange={(e) => setFormData({ ...formData, expectedDeliveryDate: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch *</Label>
                <Combobox
                  items={branches.map(b => ({ label: b.name, value: b.id }))}
                  placeholder="Search branches..."
                  noResultsText="No branches found."
                  selected={formData.branchId}
                  onSelect={(value) => setFormData({ ...formData, branchId: value || '', warehouseId: '' })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Combobox
                  items={formData.branchId ? getBranchWarehouses(formData.branchId).map(w => ({ label: w.name, value: w.id })) : []}
                  placeholder="Search warehouses..."
                  noResultsText="No warehouses found."
                  selected={formData.warehouseId}
                  onSelect={(value) => setFormData({ ...formData, warehouseId: value || '' })}
                  disabled={!formData.branchId}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes or special instructions..."
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Product Search & Add */}
        <Card>
          <CardHeader className="no-scrollbar">
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Add Products</span>
            </CardTitle>
            <CardDescription>
              Search and add products to the purchase order
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Combobox
                placeholder="Search products by name or SKU..."
                searchQuery={productSearchQuery}
                onSearchChange={setProductSearchQuery}
                onSelect={(product) => addProductToOrder(product)}
                items={filteredProducts.map(product => ({
                  value: product.id,
                  label: `${product.name} (${product.sku})`,
                  description: `$${product.basePrice.toFixed(2)} - ${product.category}`,
                  data: product
                }))}
                emptyMessage="No products found"
                className="w-full"
              />

              {/* Quick Add Popular Products */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {products.slice(0, 8).map(product => (
                  <Button
                    key={product.id}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addProductToOrder(product)}
                    className="justify-start text-left h-auto p-3"
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-sm">{product.name}</span>
                      <span className="text-xs text-muted-foreground">${product.basePrice.toFixed(2)}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Items Table */}
        <Card>
          <CardHeader className="no-scrollbar">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5" />
                  <span>Purchase Order Items ({items.filter(item => item.productId).length})</span>
                </CardTitle>
                <CardDescription>
                  Manage the items in your purchase order
                </CardDescription>
              </div>
              <div className="flex items-center space-x-2">
                <Button type="button" onClick={deleteAllItems} variant="outline" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete All
                </Button>
                <Button type="button" onClick={exportToExcel} variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <div className="relative">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    onChange={importFromExcel}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <Button type="button" variant="outline" size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Import
                  </Button>
                </div>
                <Button type="button" onClick={addItem} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[300px]">Product</TableHead>
                    <TableHead className="w-[100px]">Quantity</TableHead>
                    <TableHead className="w-[120px]">Unit Price</TableHead>
                    <TableHead className="w-[120px]">Total</TableHead>
                    <TableHead className="w-[200px]">Notes</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Select 
                          value={item.productId} 
                          onValueChange={(value) => updateItem(index, 'productId', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(product => (
                              <SelectItem key={product.id} value={product.id}>
                                <div className="flex flex-col">
                                  <span>{product.name}</span>
                                  <span className="text-xs text-muted-foreground">{product.sku}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calculator className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">${item.totalPrice.toFixed(2)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.notes}
                          onChange={(e) => updateItem(index, 'notes', e.target.value)}
                          placeholder="Item notes..."
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Button 
                          type="button"
                          variant="outline" 
                          size="sm"
                          onClick={() => removeItem(index)}
                          disabled={items.length === 1}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Totals */}
        <Card>
          <CardHeader className="no-scrollbar">
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5" />
              <span>Order Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-end">
              <div className="w-80 space-y-3">
                <div className="flex justify-between text-lg">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span>Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Grand Total:</span>
                    <span>${grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Purchase Order
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

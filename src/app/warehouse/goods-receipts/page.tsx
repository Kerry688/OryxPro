'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Truck, 
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  MoreHorizontal,
  Package,
  AlertTriangle
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { goodsReceipts, purchaseOrders, products, branches, warehouses } from '@/lib/data';
import type { GoodsReceipt, PurchaseOrder, Product, Branch, Warehouse } from '@/lib/data';

export default function GoodsReceiptsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedGR, setSelectedGR] = useState<GoodsReceipt | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Filter goods receipts
  const filteredGRs = goodsReceipts.filter(gr => {
    const po = purchaseOrders.find(p => p.id === gr.purchaseOrderId);
    const matchesSearch = gr.grNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po?.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gr.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || gr.status === selectedStatus;
    const matchesBranch = selectedBranch === 'all' || gr.branchId === selectedBranch;

    return matchesSearch && matchesStatus && matchesBranch;
  });

  // Helper functions
  const getPurchaseOrder = (poId: string) => purchaseOrders.find(p => p.id === poId);
  const getBranch = (branchId: string) => branches.find(b => b.id === branchId);
  const getWarehouse = (warehouseId: string) => warehouses.find(w => w.id === warehouseId);
  const getProduct = (productId: string) => products.find(p => p.id === productId);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'verified':
        return 'bg-blue-100 text-blue-800';
      case 'received':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'verified':
        return <CheckCircle className="h-4 w-4" />;
      case 'received':
        return <Clock className="h-4 w-4" />;
      case 'draft':
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Calculate metrics
  const totalGRs = goodsReceipts.length;
  const pendingGRs = goodsReceipts.filter(gr => gr.status !== 'completed').length;
  const completedGRs = goodsReceipts.filter(gr => gr.status === 'completed').length;
  const totalItemsReceived = goodsReceipts.reduce((sum, gr) => 
    sum + gr.items.reduce((itemSum, item) => itemSum + item.receivedQuantity, 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Goods Receipts</h1>
          <p className="text-muted-foreground">Process incoming deliveries and goods receipts</p>
        </div>
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create GR
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Create Goods Receipt</DialogTitle>
              <DialogDescription>
                Process incoming delivery and create goods receipt
              </DialogDescription>
            </DialogHeader>
            <GoodsReceiptForm 
              gr={selectedGR} 
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedGR(null);
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total GRs</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGRs}</div>
            <p className="text-xs text-muted-foreground">
              All goods receipts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending GRs</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingGRs}</div>
            <p className="text-xs text-muted-foreground">
              Need processing
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed GRs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedGRs}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Items Received</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalItemsReceived}</div>
            <p className="text-xs text-muted-foreground">
              Total items received
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="search">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search GRs or POs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>Status</Label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="received">Received</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Branch</Label>
              <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                <SelectTrigger>
                  <SelectValue placeholder="All Branches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Branches</SelectItem>
                  {branches.map(branch => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goods Receipts Table */}
      <Card>
        <CardHeader>
          <CardTitle>Goods Receipts ({filteredGRs.length})</CardTitle>
          <CardDescription>
            Process and manage goods receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>GR Number</TableHead>
                <TableHead>Purchase Order</TableHead>
                <TableHead>Branch</TableHead>
                <TableHead>Warehouse</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Received Date</TableHead>
                <TableHead>Received By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGRs.map(gr => {
                const po = getPurchaseOrder(gr.purchaseOrderId);
                const branch = getBranch(gr.branchId);
                const warehouse = getWarehouse(gr.warehouseId);
                
                return (
                  <TableRow key={gr.id}>
                    <TableCell className="font-medium">{gr.grNumber}</TableCell>
                    <TableCell>{po?.poNumber}</TableCell>
                    <TableCell>{branch?.name}</TableCell>
                    <TableCell>{warehouse?.name}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(gr.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(gr.status)}
                          {gr.status}
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell>{gr.items.length}</TableCell>
                    <TableCell>{new Date(gr.receivedDate).toLocaleDateString()}</TableCell>
                    <TableCell>{gr.receivedBy}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedGR(gr);
                            setIsEditDialogOpen(true);
                          }}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verify
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Package className="mr-2 h-4 w-4" />
                            Update Stock
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

// Goods Receipt Form Component
function GoodsReceiptForm({ gr, onClose }: { gr: GoodsReceipt | null; onClose: () => void }) {
  const [formData, setFormData] = useState({
    purchaseOrderId: gr?.purchaseOrderId || '',
    receivedDate: gr?.receivedDate || new Date().toISOString().split('T')[0],
    receivedBy: gr?.receivedBy || '',
    verifiedBy: gr?.verifiedBy || '',
    notes: gr?.notes || '',
  });

  const [items, setItems] = useState(gr?.items || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the goods receipt
    console.log('Saving GR:', { formData, items });
    onClose();
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);
  };

  const getSelectedPO = () => {
    return purchaseOrders.find(po => po.id === formData.purchaseOrderId);
  };

  const loadPOItems = () => {
    const po = getSelectedPO();
    if (po) {
      const grItems = po.items.map(poItem => ({
        id: poItem.id,
        productId: poItem.productId,
        orderedQuantity: poItem.quantity,
        receivedQuantity: 0,
        acceptedQuantity: 0,
        rejectedQuantity: 0,
        unitPrice: poItem.unitPrice,
        totalPrice: 0,
        notes: ''
      }));
      setItems(grItems);
    }
  };

  const totalReceived = items.reduce((sum, item) => sum + item.receivedQuantity, 0);
  const totalAccepted = items.reduce((sum, item) => sum + item.acceptedQuantity, 0);
  const totalRejected = items.reduce((sum, item) => sum + item.rejectedQuantity, 0);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Purchase Order</Label>
          <Select 
            value={formData.purchaseOrderId} 
            onValueChange={(value) => {
              setFormData({ ...formData, purchaseOrderId: value });
              // Load PO items when PO is selected
              setTimeout(() => loadPOItems(), 100);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select purchase order" />
            </SelectTrigger>
            <SelectContent>
              {purchaseOrders.map(po => (
                <SelectItem key={po.id} value={po.id}>
                  {po.poNumber} - {po.status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Received Date</Label>
          <Input
            type="date"
            value={formData.receivedDate}
            onChange={(e) => setFormData({ ...formData, receivedDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Received By</Label>
          <Input
            value={formData.receivedBy}
            onChange={(e) => setFormData({ ...formData, receivedBy: e.target.value })}
            placeholder="Staff member name"
            required
          />
        </div>
        <div>
          <Label>Verified By</Label>
          <Input
            value={formData.verifiedBy}
            onChange={(e) => setFormData({ ...formData, verifiedBy: e.target.value })}
            placeholder="Verifier name"
          />
        </div>
      </div>

      <div>
        <Label>Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes about the delivery..."
        />
      </div>

      {/* Items Section */}
      {items.length > 0 && (
        <div>
          <Label className="text-lg font-semibold">Received Items</Label>
          <div className="space-y-4 mt-4">
            {items.map((item, index) => {
              const product = products.find(p => p.id === item.productId);
              return (
                <div key={item.id} className="grid grid-cols-6 gap-4 p-4 border rounded-lg">
                  <div>
                    <Label>Product</Label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {product?.name} ({product?.sku})
                    </div>
                  </div>
                  <div>
                    <Label>Ordered</Label>
                    <div className="p-2 bg-muted rounded text-sm">
                      {item.orderedQuantity}
                    </div>
                  </div>
                  <div>
                    <Label>Received</Label>
                    <Input
                      type="number"
                      value={item.receivedQuantity}
                      onChange={(e) => updateItem(index, 'receivedQuantity', parseInt(e.target.value) || 0)}
                      min="0"
                      max={item.orderedQuantity}
                    />
                  </div>
                  <div>
                    <Label>Accepted</Label>
                    <Input
                      type="number"
                      value={item.acceptedQuantity}
                      onChange={(e) => updateItem(index, 'acceptedQuantity', parseInt(e.target.value) || 0)}
                      min="0"
                      max={item.receivedQuantity}
                    />
                  </div>
                  <div>
                    <Label>Rejected</Label>
                    <Input
                      type="number"
                      value={item.rejectedQuantity}
                      onChange={(e) => updateItem(index, 'rejectedQuantity', parseInt(e.target.value) || 0)}
                      min="0"
                      max={item.receivedQuantity}
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Input
                      value={item.notes}
                      onChange={(e) => updateItem(index, 'notes', e.target.value)}
                      placeholder="Item notes..."
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{totalReceived}</div>
                <div className="text-sm text-muted-foreground">Total Received</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{totalAccepted}</div>
                <div className="text-sm text-muted-foreground">Accepted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">{totalRejected}</div>
                <div className="text-sm text-muted-foreground">Rejected</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">
          {gr ? 'Update Goods Receipt' : 'Create Goods Receipt'}
        </Button>
      </div>
    </form>
  );
}

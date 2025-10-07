'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedCreateProductForm } from '@/components/features/EnhancedCreateProductForm';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Plus, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  MoreHorizontal,
  ArrowUpDown,
  Download,
  Upload,
  FileText,
  BarChart3,
  ShoppingCart,
  AlertTriangle,
  CheckCircle,
  Archive,
  Star,
  Calendar,
  RotateCcw,
  SortAsc,
  SortDesc,
  Check
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

// Add CSS override for large dialogs
const largeDialogStyles = `
  [data-radix-dialog-content].large-dialog {
    max-width: 95vw !important;
    width: min(1180px, 95vw) !important;
    height: min(800px, 95vh) !important;
  }
`;

// Inject the styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = largeDialogStyles;
  document.head.appendChild(styleElement);
}

interface Product {
  _id: string;
  name: string;
  sku: string;
  description: string;
  type: string;
  category: string;
  subcategory?: string;
  brand?: string;
  tags: string[];
  images: string[];
  slug: string;
  isService: boolean;
  warrantyPeriod?: number;
  trackingType: string;
  price?: number;
  cost?: number;
  stock?: number;
  minStock?: number;
  maxStock?: number;
  reorderPoint?: number;
  unit?: string;
  trackStock: boolean;
  allowBackorders: boolean;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function ProductsPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showInvalidOnly, setShowInvalidOnly] = useState(false);
  const [importResults, setImportResults] = useState<{
    success: number;
    errors: number;
    total: number;
    errorsList: string[];
  } | null>(null);

  // Edit product states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Filter and search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  
  // Filter options
  const [productTypes, setProductTypes] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  
  // Stats state - matching the screenshot
  const [stats, setStats] = useState({
    totalProducts: 0,
    publishedProducts: 0,
    draftProducts: 0,
    archivedProducts: 0,
    inStockProducts: 0,
    outOfStockProducts: 0,
    onSaleProducts: 0,
    averageRating: 0
  });

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
        sortBy,
        sortOrder,
        ...(searchQuery && { query: searchQuery }),
        ...(selectedType !== 'all' && { type: selectedType }),
        ...(selectedCategory !== 'all' && { category: selectedCategory }),
        ...(selectedStatus !== 'all' && { isActive: selectedStatus === 'active' ? 'true' : 'false' })
      });

      const response = await fetch(`/api/products?${params}`);
      if (response.ok) {
        const data: ProductsResponse = await response.json();
        setProducts(data.products);
        setTotalPages(data.pagination.pages);
        setTotalItems(data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await fetch('/api/products?limit=1000'); // Get all products for stats
      if (response.ok) {
        const data: ProductsResponse = await response.json();
        const allProducts = data.products;
        
        const calculatedStats = {
          totalProducts: allProducts.length,
          publishedProducts: allProducts.filter(p => p.isActive).length,
          draftProducts: allProducts.filter(p => !p.isActive).length,
          archivedProducts: 0, // No archived status in current Product interface
          inStockProducts: allProducts.filter(p => p.stock && p.stock > 0).length,
          outOfStockProducts: allProducts.filter(p => p.stock === 0).length,
          onSaleProducts: allProducts.filter(p => p.price && p.cost && p.price < p.cost).length, // Simplified sale logic
          averageRating: 3.2 // Mock rating for now
        };
        
        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Fetch filter options
  const fetchFilterOptions = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

        if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        const uniqueTypes = [...new Set(productsData.products.map((p: Product) => p.type))] as string[];
        setProductTypes(uniqueTypes);
      }

      if (categoriesResponse.ok) {
        const categoriesData = await categoriesResponse.json();
        if (categoriesData.success) {
          const uniqueCategories = [...new Set(categoriesData.categories.map((c: any) => c.name))] as string[];
          setCategories(uniqueCategories);
        }
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, itemsPerPage, searchQuery, selectedType, selectedCategory, selectedStatus, sortBy, sortOrder]);

  useEffect(() => {
    fetchFilterOptions();
    fetchStats();
  }, []);

  const handleCreateProduct = async (data: any) => {
    try {
      console.log('Creating product with data:', data);
      
      // Transform the form data to match the API expected format
      const productData = {
        name: data.productName,
        sku: data.sku,
        description: data.description,
        type: data.productType,
        category: data.category,
        subcategory: data.category,
        brand: data.brand,
        tags: data.tags,
        images: data.imageUrls || [],
        slug: data.slug,
        isService: data.isService,
        warrantyPeriod: data.warrantyPeriod,
        trackingType: data.trackingType,
        createdBy: '507f1f77bcf86cd799439011',
        status: data.status || 'active',
             virtualDigitalData: data.productType === 'virtual_digital' ? {
               price: data.masterPrice,
               cost: data.masterPrice * 0.6,
               stock: data.stock,
               minStock: data.lowStockThreshold,
               maxStock: data.stock * 2,
               reorderPoint: data.lowStockThreshold,
               unit: 'pcs',
               isDownloadable: true,
               downloadLimit: 1,
               downloadExpiry: 30,
               supportedFormats: ['PDF', 'ZIP'],
               licenseType: 'single_use',
               digitalDelivery: {
                 method: 'download_link',
                 automated: true
               }
             } : undefined,
             manufacturedData: data.productType === 'manufactured_product' ? {
               price: data.masterPrice,
               cost: data.masterPrice * 0.6,
               stock: data.stock,
               minStock: data.lowStockThreshold,
               maxStock: data.stock * 2,
               reorderPoint: data.lowStockThreshold,
               unit: 'pcs',
               manufacturing: {
                 productionTime: 8,
                 batchSize: 10,
                 productionCost: data.masterPrice * 0.4,
                 materialsUsed: [],
                 qualityControl: {
                   inspectionRequired: true,
                   inspectionSteps: ['Visual check', 'Function test'],
                   qualityStandards: ['ISO 9001']
                 }
               }
             } : undefined,
             salesData: data.productType === 'sales_product' ? {
               price: data.masterPrice,
               cost: data.masterPrice * 0.6,
               stock: data.stock,
               minStock: data.lowStockThreshold,
               maxStock: data.stock * 2,
               reorderPoint: data.lowStockThreshold,
               unit: 'pcs',
               trackStock: data.trackStock,
               allowBackorders: data.allowBackorders,
               dimensions: data.dimensions
             } : undefined,
             consumablesData: data.productType === 'consumables' ? {
               price: data.masterPrice,
               cost: data.masterPrice * 0.6,
               stock: data.stock,
               minStock: data.lowStockThreshold,
               maxStock: data.stock * 2,
               reorderPoint: data.lowStockThreshold,
               unit: 'pcs',
               consumptionRate: 1, // Default consumption rate
               shelfLife: 365, // Default 1 year shelf life
               storageRequirements: {
                 temperature: { min: 15, max: 25 },
                 humidity: { min: 30, max: 70 },
                 lightSensitive: false,
                 requiresRefrigeration: false
               },
               packaging: {
                 type: 'bottle',
                 size: '500ml',
                 unitsPerPackage: 1
               },
               usage: {
                 primaryUse: 'General use',
                 applicationMethod: 'Direct application'
               }
             } : undefined
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create product');
      }

      const result = await response.json();
      console.log('Product created successfully:', result);
      
    setIsCreateDialogOpen(false);
      toast({
        title: "Product Created",
        description: "Product created successfully!",
      });
      fetchProducts(); // Refresh the products list
      fetchStats(); // Refresh the stats
      
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Product Creation Error",
        description: `Error creating product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      toast({
        title: "Product Deleted",
        description: "Product deleted successfully!",
      });
      fetchProducts(); // Refresh the products list
      fetchStats(); // Refresh the stats
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Product Deletion Error",
        description: `Error deleting product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleUpdateProduct = async (updatedData: any) => {
    if (!editingProduct) return;

    try {
      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error('Failed to update product');
      
      toast({
        title: "Product Updated",
        description: "Product updated successfully!",
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      fetchProducts(); // Refresh the products list
      fetchStats(); // Refresh the stats
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Product Update Error",
        description: `Error updating product: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { label: 'Out of Stock', variant: 'destructive' as const };
    if (stock <= minStock) return { label: 'Low Stock', variant: 'secondary' as const };
    return { label: 'In Stock', variant: 'default' as const };
  };

  // Handle file upload and preview
  const handleFileUpload = async (file: File) => {
    if (!file) return;

    try {
      // Read file content
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast({
          title: "Invalid File",
          description: "File must contain at least a header row and one data row",
          variant: "destructive",
        });
        return;
      }

      // Parse CSV headers
      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
      const dataLines = lines.slice(1);

      // Validate required headers
      const requiredHeaders = ['name', 'sku', 'category', 'price'];
      const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
      
      if (missingHeaders.length > 0) {
        toast({
          title: "Missing Headers",
          description: `Missing required headers: ${missingHeaders.join(', ')}`,
          variant: "destructive",
        });
        return;
      }

      // Process and validate each row
      const processedData = [];
      const existingSkus = new Set(); // Track SKUs to detect duplicates

      for (let i = 0; i < dataLines.length; i++) {
        try {
          const values = dataLines[i].split(',').map(v => v.trim().replace(/"/g, ''));
          
          if (values.length !== headers.length) {
            processedData.push({
              id: i + 1,
              productName: '',
              sku: '',
              category: '',
              price: '',
              status: '',
              isValid: false,
              errors: [`Row ${i + 2}: Column count mismatch`]
            });
            continue;
          }

          // Create row data object
          const rowData: { [key: string]: string } = {};
          headers.forEach((header, index) => {
            rowData[header] = values[index];
          });

          const errors: string[] = [];
          let isValid = true;

          // Validate required fields
          if (!rowData.name || rowData.name.trim() === '') {
            errors.push('Product name is required');
            isValid = false;
          }

          if (!rowData.sku || rowData.sku.trim() === '') {
            errors.push('SKU is required');
            isValid = false;
          } else if (existingSkus.has(rowData.sku)) {
            errors.push('Duplicate SKU');
            isValid = false;
          } else {
            existingSkus.add(rowData.sku);
          }

          if (!rowData.category || rowData.category.trim() === '') {
            errors.push('Category is required');
            isValid = false;
          }

          if (!rowData.price || rowData.price.trim() === '') {
            errors.push('Price is required');
            isValid = false;
          } else {
            // Validate price format
            const priceValue = parseFloat(rowData.price.replace(/[^0-9.-]/g, ''));
            if (isNaN(priceValue) || priceValue < 0) {
              errors.push('Invalid price format');
              isValid = false;
            }
          }

          // Validate status if provided
          if (rowData.status && !['active', 'inactive', 'draft'].includes(rowData.status.toLowerCase())) {
            errors.push('Status must be active, inactive, or draft');
            isValid = false;
          }

          processedData.push({
            id: i + 1,
            productName: rowData.name || '',
            sku: rowData.sku || '',
            category: rowData.category || '',
            price: rowData.price ? `$${parseFloat(rowData.price.replace(/[^0-9.-]/g, '')).toFixed(2)}` : '',
            status: rowData.status || 'active',
            isValid,
            errors
          });

        } catch (error) {
          processedData.push({
            id: i + 1,
            productName: '',
            sku: '',
            category: '',
            price: '',
            status: '',
            isValid: false,
            errors: [`Row ${i + 2}: Error processing row`]
          });
        }
      }

      setPreviewData(processedData);
      setCurrentStep(2);
    } catch (error) {
      console.error('Error processing file:', error);
      toast({
        title: "File Processing Error",
        description: "Error processing file. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Bulk Import functionality
  const handleBulkImport = async () => {
    const validProducts = previewData.filter(item => item.isValid);
    
    if (validProducts.length === 0) {
      toast({
        title: "No Valid Products",
        description: "No valid products to import",
        variant: "destructive",
      });
      return;
    }

    try {
      setImportProgress(0);
      setImportResults(null);

      // Convert preview data to import format
      const productsToImport = validProducts.map(item => ({
        name: item.productName,
        sku: item.sku,
        description: `Imported product: ${item.productName}`,
        type: 'sales_product',
        category: item.category,
        brand: 'Imported',
        tags: ['imported'],
        price: parseFloat(item.price.replace(/[^0-9.-]/g, '')),
        cost: parseFloat(item.price.replace(/[^0-9.-]/g, '')) * 0.6, // 60% of price as cost
        stock: 100, // Default stock
        minStock: 10,
        maxStock: 500,
        unit: 'pcs',
        trackStock: true,
        allowBackorders: false,
        isActive: item.status === 'active',
        isService: false,
        warrantyPeriod: 365,
        trackingType: 'serial',
        createdBy: '507f1f77bcf86cd799439011',
        updatedBy: '507f1f77bcf86cd799439011'
      }));

      // Import products one by one
      let successCount = 0;
      let errorCount = 0;
      const errorsList: string[] = [];

      for (let i = 0; i < productsToImport.length; i++) {
        try {
          const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productsToImport[i])
          });

          if (response.ok) {
            successCount++;
          } else {
            const errorData = await response.json();
            errorCount++;
            errorsList.push(`Row ${validProducts[i].id}: ${errorData.error || 'Import failed'}`);
          }
        } catch (error) {
          errorCount++;
          errorsList.push(`Row ${validProducts[i].id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const results = {
        success: successCount,
        errors: errorCount,
        total: validProducts.length,
        errorsList
      };

      setImportResults(results);
      
      if (successCount > 0) {
        fetchProducts(); // Refresh the products list
        fetchStats(); // Refresh the stats
      }

      toast({
        title: "Import Completed",
        description: `${successCount} products imported successfully, ${errorCount} errors.`,
        variant: successCount > 0 ? "default" : "destructive",
      });
    } catch (error) {
      console.error('Error importing products:', error);
      toast({
        title: "Import Error",
        description: `Error importing products: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  // Download CSV template
  const downloadTemplate = () => {
    const templateHeaders = [
      'name',
      'sku',
      'description',
      'type',
      'category',
      'brand',
      'tags',
      'price',
      'cost',
      'stock',
      'minStock',
      'maxStock',
      'unit',
      'isActive',
      'isService',
      'warrantyPeriod',
      'trackingType',
      'trackStock',
      'allowBackorders'
    ];

    const sampleData = [
      [
        'Sample Product',
        'SKU-001',
        'This is a sample product description',
        'sales_product',
        'Electronics',
        'Sample Brand',
        'tag1;tag2;tag3',
        '99.99',
        '60.00',
        '100',
        '10',
        '500',
        'pcs',
        'true',
        'false',
        '365',
        'serial',
        'true',
        'false'
      ]
    ];

    const csvContent = [
      templateHeaders.join(','),
      ...sampleData.map(row => row.map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'products_import_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Export functionality
  const exportToCSV = async () => {
    try {
      // Fetch all products for export
      const response = await fetch('/api/products?limit=10000');
      if (!response.ok) throw new Error('Failed to fetch products for export');
      
      const data: ProductsResponse = await response.json();
      const allProducts = data.products;
      
      // Prepare CSV headers
      const headers = [
        'Name',
        'SKU',
        'Description',
        'Type',
        'Category',
        'Brand',
        'Price',
        'Cost',
        'Stock',
        'Min Stock',
        'Max Stock',
        'Unit',
        'Status',
        'Created Date',
        'Updated Date',
        'Tags',
        'Warranty Period',
        'Tracking Type',
        'Is Service'
      ];
      
      // Prepare CSV data
      const csvData = allProducts.map(product => [
        product.name || '',
        product.sku || '',
        product.description || '',
        product.type || '',
        product.category || '',
        product.brand || '',
        product.price || '',
        product.cost || '',
        product.stock || '',
        product.minStock || '',
        product.maxStock || '',
        product.unit || '',
        product.isActive ? 'Active' : 'Inactive',
        formatDate(product.createdAt),
        formatDate(product.updatedAt),
        product.tags.join('; ') || '',
        product.warrantyPeriod || '',
        product.trackingType || '',
        product.isService ? 'Yes' : 'No'
      ]);
      
      // Create CSV content
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: "Products exported to CSV successfully!",
      });
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      toast({
        title: "Export Error",
        description: `Error exporting to CSV: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Products</h1>
          <p className="text-muted-foreground">Manage your store's products and inventory</p>
        </div>
          <div className="flex gap-3">
            <Dialog open={isBulkImportDialogOpen} onOpenChange={setIsBulkImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Import
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-[50vw]">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Bulk Import Products</DialogTitle>
                  <DialogDescription className="text-base">
                    Import multiple products from an Excel file
                  </DialogDescription>
                </DialogHeader>
                
                {/* Stepper */}
                <div className="flex items-center justify-center space-x-8 py-6">
                  {/* Step 1 - Upload */}
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      currentStep >= 1 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {currentStep > 1 ? '✓' : '1'}
                    </div>
                    <span className={`ml-2 font-medium ${
                      currentStep === 1 
                        ? 'font-semibold text-primary' 
                        : currentStep > 1 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`}>
                      Upload
                    </span>
                  </div>
                  
                  {/* Connector Line */}
                  <div className={`flex-1 h-px ${
                    currentStep > 1 ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}></div>
                  
                  {/* Step 2 - Preview */}
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      currentStep >= 2 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      2
                    </div>
                    <span className={`ml-2 font-medium ${
                      currentStep === 2 
                        ? 'font-semibold text-primary' 
                        : currentStep > 2 
                        ? 'text-primary' 
                        : 'text-muted-foreground'
                    }`}>
                      Preview
                    </span>
                  </div>
                  
                  {/* Connector Line */}
                  <div className={`flex-1 h-px ${
                    currentStep > 2 ? 'bg-primary' : 'bg-muted-foreground/20'
                  }`}></div>
                  
                  {/* Step 3 - Import */}
                  <div className="flex items-center">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold ${
                      currentStep >= 3 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      3
                    </div>
                    <span className={`ml-2 font-medium ${
                      currentStep === 3 
                        ? 'font-semibold text-primary' 
                        : 'text-muted-foreground'
                    }`}>
                      Import
                    </span>
                  </div>
                </div>

                <div className="space-y-6 py-4">
                  {/* Step 1: Upload */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">Upload Excel File</h3>
                        <p className="text-sm text-muted-foreground">
                          Upload an Excel file with product information. Make sure your file includes the required columns.
                        </p>
                      </div>

                      {/* File Upload Zone */}
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                        <input
                          type="file"
                          accept=".xlsx,.xls,.csv"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setImportFile(file);
                            if (file) {
                              handleFileUpload(file);
                            }
                          }}
                          className="hidden"
                          id="import-file"
                        />
                        <label htmlFor="import-file" className="cursor-pointer block focus-within:border-2 focus-within:border-blue-500 focus-within:outline-none transition-all duration-200 rounded-lg">
                          <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                          <p className="text-lg font-medium mb-2">
                            {importFile ? importFile.name : 'Drop your Excel file here'}
                          </p>
                          <p className="text-sm text-muted-foreground mb-4">
                            {importFile ? 'File selected successfully' : 'or click to browse'}
                          </p>
                          {!importFile && (
                            <Button type="button" className="bg-primary hover:bg-primary/90 transition-all duration-200 rounded-lg">
                              Choose File
                            </Button>
                          )}
                        </label>
                      </div>

                      {/* Template Download */}
                      <div className="flex justify-start">
                        <Button variant="outline" onClick={downloadTemplate} className="transition-all duration-200 rounded-lg">
                          <Download className="h-4 w-4 mr-2" />
                          Download Template
                        </Button>
                      </div>

                      {/* Required Columns Info */}
                      <div className="flex items-start space-x-2 p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-semibold mt-0.5">
                          i
                        </div>
                        <div className="text-sm">
                          <p className="font-medium mb-1">Required columns: Product Name, SKU, Category, Price.</p>
                          <p className="text-muted-foreground">Optional: Details, Image URL, Status, Stock Status.</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Preview */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold">Preview Import Data</h3>
                        <p className="text-sm text-muted-foreground">
                          {previewData.filter(item => item.isValid).length} valid rows, {previewData.filter(item => !item.isValid).length} invalid rows
                        </p>
                      </div>

                      {/* Preview Actions */}
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowInvalidOnly(!showInvalidOnly)}
                          className="transition-all duration-200 rounded-lg"
                        >
                          {showInvalidOnly ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                          {showInvalidOnly ? 'Show All' : 'Show Invalid Only'}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            setCurrentStep(1);
                            setImportFile(null);
                            setPreviewData([]);
                          }}
                          className="transition-all duration-200 rounded-lg"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>

                      {/* Preview Table */}
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left p-3 font-medium">Product Name</th>
                              <th className="text-left p-3 font-medium">SKU</th>
                              <th className="text-left p-3 font-medium">Category</th>
                              <th className="text-left p-3 font-medium">Price</th>
                              <th className="text-left p-3 font-medium">Status</th>
                              <th className="text-left p-3 font-medium">Validation</th>
                            </tr>
                          </thead>
                          <tbody>
                            {previewData
                              .filter(item => showInvalidOnly ? !item.isValid : true)
                              .map((item) => (
                                <tr key={item.id} className="border-t">
                                  <td className="p-3">
                                    <div>
                                      <div>{item.productName}</div>
                                      {!item.isValid && item.errors.length > 0 && (
                                        <div className="text-xs text-red-500 mt-1">
                                          {item.errors[0]}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td className="p-3">{item.sku}</td>
                                  <td className="p-3">{item.category}</td>
                                  <td className="p-3">{item.price}</td>
                                  <td className="p-3">{item.status}</td>
                                  <td className="p-3">
                                    <Badge 
                                      variant={item.isValid ? "default" : "destructive"}
                                      className="flex items-center gap-1 w-fit"
                                    >
                                      <Check className="h-3 w-3" />
                                      {item.isValid ? 'Valid' : 'Invalid'}
                                    </Badge>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Import Results */}
                  {importResults && (
                    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-semibold">Import Results</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{importResults.success}</div>
                          <div className="text-sm text-muted-foreground">Successful</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-600">{importResults.errors}</div>
                          <div className="text-sm text-muted-foreground">Errors</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold">{importResults.total}</div>
                          <div className="text-sm text-muted-foreground">Total</div>
                        </div>
                      </div>
                      {importResults.errorsList.length > 0 && (
                        <div className="mt-4">
                          <h5 className="font-medium text-sm">Error Details:</h5>
                          <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                            {importResults.errorsList.slice(0, 5).map((error, index) => (
                              <li key={index}>• {error}</li>
                            ))}
                            {importResults.errorsList.length > 5 && (
                              <li>... and {importResults.errorsList.length - 5} more errors</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setIsBulkImportDialogOpen(false);
                        setImportFile(null);
                        setPreviewData([]);
                        setCurrentStep(1);
                        setImportResults(null);
                      }}
                    >
                      Cancel
                    </Button>
                    {currentStep === 2 && (
                      <Button 
                        onClick={() => {
                          setCurrentStep(3);
                          handleBulkImport();
                        }}
                        className="bg-primary hover:bg-primary/90"
                      >
                        Import {previewData.filter(item => item.isValid).length} Products
                      </Button>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Product
              </Button>
            </DialogTrigger>
              <DialogContent className="max-w-[95vw] max-h-[95vh] w-[1180px] h-[800px] p-0 overflow-hidden large-dialog">
                <div className="flex flex-col h-full">
                  <DialogHeader className="p-6 border-b bg-background flex-shrink-0">
                  <DialogTitle className="text-2xl font-bold">Create New Product</DialogTitle>
                  <DialogDescription className="text-base">
                    Create a comprehensive product with detailed information, pricing, and specifications
                  </DialogDescription>
                </DialogHeader>
                  <div className="flex-1 overflow-y-auto p-6">
                <EnhancedCreateProductForm 
                  onSubmit={handleCreateProduct}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </div>
                  <div className="p-6 border-t bg-background flex-shrink-0">
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    form="create-product-form"
                    className="px-6"
                  >
                    Create Product
                  </Button>
                    </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Product Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] w-[1180px] h-[800px] p-0 overflow-hidden large-dialog">
              <div className="flex flex-col h-full">
                <DialogHeader className="p-6 border-b bg-background flex-shrink-0">
                  <DialogTitle className="text-2xl font-bold">Edit Product</DialogTitle>
                  <DialogDescription className="text-base">
                    Update product information, pricing, and specifications
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto p-6">
                  {editingProduct && (
                    <EnhancedCreateProductForm 
                      onSubmit={handleUpdateProduct}
                      onCancel={() => {
                        setIsEditDialogOpen(false);
                        setEditingProduct(null);
                      }}
                      defaultProductType={editingProduct.type}
                      initialData={editingProduct}
                    />
                  )}
                </div>
                <div className="p-6 border-t bg-background flex-shrink-0">
                  <div className="flex justify-end space-x-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingProduct(null);
                      }}
                      className="px-6"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      form="edit-product-form"
                      className="px-6"
                    >
                      Update Product
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Stats Cards - Matching Screenshot */}
        <div className="grid grid-cols-8 gap-4 mb-8">
          {/* Total */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.totalProducts}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Published */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.publishedProducts}</p>
                <p className="text-sm text-muted-foreground">Published</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Draft */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.draftProducts}</p>
                <p className="text-sm text-muted-foreground">Draft</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Archived */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.archivedProducts}</p>
                <p className="text-sm text-muted-foreground">Archived</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center">
                <Archive className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>

          {/* In Stock */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.inStockProducts}</p>
                <p className="text-sm text-muted-foreground">In Stock</p>
              </div>
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Out of Stock */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.outOfStockProducts}</p>
                <p className="text-sm text-muted-foreground">Out of Stock</p>
              </div>
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* On Sale */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.onSaleProducts}</p>
                <p className="text-sm text-muted-foreground">On Sale</p>
              </div>
              <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          {/* Avg Rating */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-foreground">{stats.averageRating}</p>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
              </div>
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search Section - Matching Screenshot */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 mb-6">
          <div className="flex items-center gap-2 mb-6">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground">Filters & Search</h3>
          </div>
          
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 transition-all duration-200 rounded-lg"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="transition-all duration-200 rounded-lg">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="transition-all duration-200 rounded-lg">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="transition-all duration-200 rounded-lg">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {productTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="transition-all duration-200 rounded-lg">
                  <SelectValue placeholder="All Prices" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-50">$0 - $50</SelectItem>
                  <SelectItem value="50-100">$50 - $100</SelectItem>
                  <SelectItem value="100-500">$100 - $500</SelectItem>
                  <SelectItem value="500+">$500+</SelectItem>
                </SelectContent>
              </Select>

              <Select>
                <SelectTrigger className="transition-all duration-200 rounded-lg">
                  <SelectValue placeholder="All Brands" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Brands</SelectItem>
                  <SelectItem value="nike">Nike</SelectItem>
                  <SelectItem value="adidas">Adidas</SelectItem>
                  <SelectItem value="apple">Apple</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Date Created"
                  className="pl-10 transition-all duration-200 rounded-lg"
                  type="date"
                />
              </div>
            </div>

            {/* Product Count and Action Buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">{totalItems} of {totalItems} products</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={exportToCSV}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedCategory('all');
                  setSelectedStatus('all');
                  setSortBy('name');
                  setSortOrder('asc');
                }}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
                <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Table - Matching Screenshot */}
        <div className="bg-card rounded-lg shadow-sm border border-border">
          <div className="px-6 py-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Products ({totalItems} items)</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left p-4 font-medium text-muted-foreground">Image</th>
                  <th 
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center gap-2">
                      Name
                      {sortBy === 'name' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('sku')}
                  >
                    <div className="flex items-center gap-2">
                      SKU
                      {sortBy === 'sku' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center gap-2">
                      Type
                      {sortBy === 'type' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center gap-2">
                      Price
                      {sortBy === 'price' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      {sortBy === 'status' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('stock')}
                  >
                    <div className="flex items-center gap-2">
                      Stock
                      {sortBy === 'stock' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th 
                    className="text-left p-4 font-medium text-muted-foreground cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className="flex items-center gap-2">
                      Created At
                      {sortBy === 'createdAt' && (
                        sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="text-left p-4 font-medium text-muted-foreground"></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="text-center p-8">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <span className="ml-2">Loading products...</span>
                      </div>
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="text-center p-8 text-muted-foreground">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => {
                    const stockStatus = getStockStatus(product.stock || 0, product.minStock || 0);
                    return (
                      <tr key={product._id} className="border-b border-border hover:bg-muted/30">
                        {/* Image */}
                        <td className="p-4">
                          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-muted-foreground" />
                          </div>
                        </td>
                        
                        {/* Name */}
                        <td className="p-4">
                          <div>
                            <div className="font-medium text-foreground">{product.name}</div>
                            <div className="text-sm text-muted-foreground">{product.slug || product.name.toLowerCase().replace(/\s+/g, '-')}</div>
                          </div>
                        </td>
                        
                        {/* SKU */}
                        <td className="p-4">
                          <span className="text-blue-600 underline cursor-pointer">{product.sku}</span>
                        </td>
                        
                        {/* Type */}
                        <td className="p-4">
                          <span className="text-foreground">
                            {product.type === 'virtual_digital' ? 'Virtual / Digital Products' : 
                             product.type === 'manufactured_product' ? 'Manufactured Products' :
                             product.type === 'sales_product' ? 'Sales Products' :
                             product.type === 'consumables' ? 'Consumables' :
                             product.type === 'print_item' ? 'Print Only' :
                             product.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </td>
                        
                        {/* Price */}
                        <td className="p-4">
                          {product.price ? (
                            <div className="flex items-center gap-2">
                              <span className="font-medium">EGP{product.price.toFixed(2)}</span>
                              {product.cost && product.price < product.cost && (
                                <span className="text-sm text-muted-foreground line-through">EGP{product.cost.toFixed(2)}</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </td>
                        
                        {/* Status */}
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {product.isActive ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        
                        {/* Stock */}
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            product.stock && product.stock > 0 
                              ? 'bg-red-100 text-red-800' 
                              : product.stock === 0
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {product.stock && product.stock > 0 ? `In Stock (${product.stock})` : 
                             product.stock === 0 ? 'Out of Stock' : 'Not Tracked'}
                          </span>
                        </td>
                        
                        {/* Created At */}
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">{formatDate(product.createdAt)}</span>
                        </td>
                        
                        {/* Actions */}
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleEditProduct(product)}>
                              <Edit className="h-4 w-4 text-muted-foreground" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDeleteProduct(product._id)}>
                              <Trash2 className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination - Matching Screenshot */}
        <div className="flex items-center justify-between mt-6 bg-card rounded-lg border border-border px-6 py-4">
          <div className="text-sm text-muted-foreground">
            {totalItems} row(s).
          </div>
          
          <div className="flex items-center gap-4">
            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Rows per page</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20 h-8 transition-all duration-200 rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Page info */}
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            
            {/* Navigation buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
                <ChevronLeft className="h-4 w-4 -ml-1" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
                <ChevronRight className="h-4 w-4 -ml-1" />
              </Button>
            </div>
          </div>
        </div>
    </div>
  );
}

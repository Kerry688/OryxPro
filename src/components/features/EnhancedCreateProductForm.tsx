'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  X, 
  Plus, 
  Upload, 
  Image as ImageIcon,
  Package,
  DollarSign,
  Settings,
  Link as LinkIcon,
  Tag,
  Hash,
  FileText,
  AlertCircle,
  CheckCircle,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Quote,
  Link,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Trash2,
  Loader2,
  ZoomIn,
  Eye
} from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useToast } from '@/hooks/use-toast';

interface ProductFormData {
  // Basic Info
  productName: string;
  productType: string;
  status: string;
  category: string;
  brand: string;
  description: string;
  slug: string;
  sku: string;
  tags: string[];
  
  // Tracking & Service
  trackingType: 'none' | 'serial' | 'batch';
  isService: boolean;
  warrantyPeriod?: number;
  
  // Images
  images: File[];
  imageUrls: string[];
  uploadedImages: {
    originalName: string;
    filename: string;
    publicUrl: string;
    gcsPath: string;
    size: number;
    type: string;
    uploadedAt: string;
  }[];
  
  // Pricing
  masterPrice: number;
  trackStock: boolean;
  allowBackorders: boolean;
  lowStockThreshold: number;
  stock: number;
  
  // Advanced
  customAttributes: { key: string; value: string }[];
  specifications: { key: string; value: string }[];
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  relatedProducts: string[];
}

interface EnhancedCreateProductFormProps {
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
  defaultProductType?: string;
  initialData?: any; // For editing existing products
}

export function EnhancedCreateProductForm({ onSubmit, onCancel, defaultProductType, initialData }: EnhancedCreateProductFormProps) {
  const { uploadImages, isUploading } = useImageUpload();
  const { toast } = useToast();
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    productType: defaultProductType || 'sales_product',
    status: 'active',
    category: '',
    brand: '',
    description: '',
    slug: '',
    sku: '',
    tags: [],
    trackingType: 'none',
    isService: false,
    warrantyPeriod: undefined,
    images: [],
    imageUrls: [],
    uploadedImages: [],
    masterPrice: 0,
    trackStock: true,
    allowBackorders: false,
    lowStockThreshold: 10,
    stock: 0,
    customAttributes: [],
    specifications: [],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0
    },
    relatedProducts: []
  });

  const [newTag, setNewTag] = useState('');
  const [newAttribute, setNewAttribute] = useState({ key: '', value: '' });
  const [selectedImage, setSelectedImage] = useState<{url: string, name: string} | null>(null);
  const [deletingImages, setDeletingImages] = useState<Set<number>>(new Set());
  const [newSpecification, setNewSpecification] = useState({ key: '', value: '' });
  const [activeTab, setActiveTab] = useState('basic');
  
  // Data fetching states
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [productTypes, setProductTypes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on component mount
  useEffect(() => {
    fetchFormData();
  }, []);

  // Helper function to safely process image URLs
  const processImageUrls = (images: any): string[] => {
    if (!images || !Array.isArray(images)) return [];
    return images.filter(url => typeof url === 'string' && url.trim() !== '');
  };

  // Helper function to create uploaded image objects from URLs
  const createUploadedImageFromUrl = (url: string) => {
    try {
      return {
        originalName: url.split('/').pop() || 'image',
        filename: url,
        publicUrl: url,
        gcsPath: url,
        size: 0,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      };
    } catch (error) {
      console.warn('Error processing image URL:', url, error);
      return {
        originalName: 'image',
        filename: url,
        publicUrl: url,
        gcsPath: url,
        size: 0,
        type: 'image/jpeg',
        uploadedAt: new Date().toISOString()
      };
    }
  };

  // Populate form with initial data when editing
  useEffect(() => {
    if (initialData) {
      const processedImageUrls = processImageUrls(initialData.images);
      setFormData({
        productName: initialData.name || '',
        productType: initialData.type || defaultProductType || 'sales_product',
        status: initialData.isActive ? 'active' : 'inactive',
        category: initialData.category || '',
        brand: initialData.brand || '',
        description: initialData.description || '',
        slug: initialData.slug || '',
        sku: initialData.sku || '',
        tags: initialData.tags || [],
        trackingType: initialData.trackingType || 'none',
        isService: initialData.isService || false,
        warrantyPeriod: initialData.warrantyPeriod || undefined,
        images: [],
        imageUrls: processedImageUrls,
        uploadedImages: processedImageUrls.map(createUploadedImageFromUrl),
        masterPrice: initialData.price || 0,
        trackStock: initialData.trackStock !== undefined ? initialData.trackStock : true,
        allowBackorders: initialData.allowBackorders || false,
        lowStockThreshold: initialData.minStock || 10,
        stock: initialData.stock || 0,
        customAttributes: [],
        specifications: [],
        dimensions: initialData.dimensions || {
          length: 0,
          width: 0,
          height: 0,
          weight: 0
        },
        relatedProducts: []
      });
    }
  }, [initialData, defaultProductType]);

  const fetchFormData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setCategories(categoriesData.categories || []);
      }

      // Fetch brands
      const brandsResponse = await fetch('/api/brands');
      const brandsData = await brandsResponse.json();
      if (brandsData.brands) {
        setBrands(brandsData.brands || []);
      }

      // Set product types (static for now, can be fetched from API later)
      setProductTypes([
        { id: 'virtual_digital', name: 'Virtual / Digital Products', description: 'Digital products and downloadable content' },
        { id: 'manufactured_product', name: 'Manufactured Products (Finished Goods)', description: 'Finished goods from production' },
        { id: 'sales_product', name: 'Sales Product', description: 'Regular retail products' },
        { id: 'consumables', name: 'Consumables', description: 'Items that get used up or consumed' },
        { id: 'print_item', name: 'Print Item', description: 'Print-on-demand products' },
        { id: 'service', name: 'Service', description: 'Service offerings' },
        { id: 'raw_material', name: 'Raw Material', description: 'Materials and supplies' },
        { id: 'kit_bundle', name: 'Kit/Bundle', description: 'Product bundles and kits' },
        { id: 'asset', name: 'Asset', description: 'Company assets and equipment' }
      ]);

    } catch (error) {
      console.error('Error fetching form data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-generate slug from product name
  useEffect(() => {
    if (formData.productName) {
      const slug = formData.productName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.productName]);

  // Auto-generate SKU
  useEffect(() => {
    if (formData.productName && formData.category) {
      const categoryCode = formData.category.substring(0, 3).toUpperCase();
      const productCode = formData.productName.substring(0, 3).toUpperCase();
      const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      const sku = `${categoryCode}-${productCode}-${randomNum}`;
      setFormData(prev => ({ ...prev, sku }));
    }
  }, [formData.productName, formData.category]);

  const processFiles = async (files: File[]) => {
    if (files.length === 0) {
      console.log('No files selected');
      return;
    }

    try {
      // Upload images to Firebase Storage
      const uploadedImages = await uploadImages(files);
      
      setFormData(prev => ({
        ...prev,
        uploadedImages: [...prev.uploadedImages, ...uploadedImages]
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
      // Still add files to local state for preview even if upload fails
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    await processFiles(files);
    // Clear the input value to allow selecting the same files again
    e.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length > 0) {
      await processFiles(imageFiles);
    }
  };

  const removeImage = async (index: number, isUploaded: boolean = false) => {
    const imageName = isUploaded 
      ? formData.uploadedImages[index]?.originalName || 'image'
      : formData.images[index]?.name || 'image';
    
    // Set loading state
    setDeletingImages(prev => new Set([...prev, index]));
    
    try {
      // If it's an uploaded image, delete it from storage
      if (isUploaded) {
        const image = formData.uploadedImages[index];
        if (image?.filename) {
          try {
            const response = await fetch('/api/products/delete-image', {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ filename: image.filename }),
            });

            const result = await response.json();
            
            if (!result.success) {
              toast({
                title: "Delete Failed",
                description: `Failed to delete "${imageName}" from storage: ${result.error}`,
                variant: "destructive",
              });
              return;
            }
          } catch (error) {
            console.error('Error deleting image from storage:', error);
            toast({
              title: "Delete Failed",
              description: `Failed to delete "${imageName}" from storage. Please try again.`,
              variant: "destructive",
            });
            return;
          }
        }
      }
      
      // Remove from form data
      setFormData(prev => ({
        ...prev,
        images: isUploaded ? prev.images : prev.images.filter((_, i) => i !== index),
        uploadedImages: isUploaded ? prev.uploadedImages.filter((_, i) => i !== index) : prev.uploadedImages
      }));
      
      toast({
        title: "Image Removed",
        description: `"${imageName}" has been removed from the product${isUploaded ? ' and storage' : ''}.`,
        variant: "default",
      });
    } finally {
      // Clear loading state
      setDeletingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const addTag = () => {
    if (newTag.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const addCustomAttribute = () => {
    if (newAttribute.key.trim() && newAttribute.value.trim()) {
      setFormData(prev => ({
        ...prev,
        customAttributes: [...prev.customAttributes, { ...newAttribute }]
      }));
      setNewAttribute({ key: '', value: '' });
    }
  };

  const removeCustomAttribute = (index: number) => {
    setFormData(prev => ({
      ...prev,
      customAttributes: prev.customAttributes.filter((_, i) => i !== index)
    }));
  };

  const addSpecification = () => {
    if (newSpecification.key.trim() && newSpecification.value.trim()) {
      setFormData(prev => ({
        ...prev,
        specifications: [...prev.specifications, { ...newSpecification }]
      }));
      setNewSpecification({ key: '', value: '' });
    }
  };

  const removeSpecification = (index: number) => {
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      images: [
        ...formData.imageUrls,
        ...formData.uploadedImages.map(img => img.publicUrl)
      ]
    };

    onSubmit(submitData);
  };

  // Rich Text Editor Component
  const RichTextEditor = ({ value, onChange, placeholder }: { 
    value: string; 
    onChange: (value: string) => void; 
    placeholder?: string;
  }) => {
    const [isFocused, setIsFocused] = useState(false);

    const toggleFormat = (format: string) => {
      const textarea = document.getElementById('rich-text-editor') as HTMLTextAreaElement;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      
      let newText = '';
      let cursorOffset = 0;
      
      switch (format) {
        case 'bold':
          if (selectedText) {
            newText = `<strong>${selectedText}</strong>`;
            cursorOffset = newText.length;
          } else {
            newText = '<strong></strong>';
            cursorOffset = 8; // Position cursor between tags
          }
          break;
        case 'italic':
          if (selectedText) {
            newText = `<em>${selectedText}</em>`;
            cursorOffset = newText.length;
          } else {
            newText = '<em></em>';
            cursorOffset = 4; // Position cursor between tags
          }
          break;
        case 'underline':
          if (selectedText) {
            newText = `<u>${selectedText}</u>`;
            cursorOffset = newText.length;
          } else {
            newText = '<u></u>';
            cursorOffset = 3; // Position cursor between tags
          }
          break;
        case 'list':
          if (selectedText) {
            // Split selected text into lines and create list items
            const lines = selectedText.split('\n').filter(line => line.trim());
            newText = '<ul>\n' + lines.map(line => `  <li>${line.trim()}</li>`).join('\n') + '\n</ul>';
            cursorOffset = newText.length;
          } else {
            newText = '<ul>\n  <li></li>\n</ul>';
            cursorOffset = newText.length - 6; // Position cursor in the li tag
          }
          break;
        case 'ordered-list':
          if (selectedText) {
            // Split selected text into lines and create list items
            const lines = selectedText.split('\n').filter(line => line.trim());
            newText = '<ol>\n' + lines.map(line => `  <li>${line.trim()}</li>`).join('\n') + '\n</ol>';
            cursorOffset = newText.length;
          } else {
            newText = '<ol>\n  <li></li>\n</ol>';
            cursorOffset = newText.length - 6; // Position cursor in the li tag
          }
          break;
        case 'quote':
          if (selectedText) {
            newText = `<blockquote>${selectedText}</blockquote>`;
            cursorOffset = newText.length;
          } else {
            newText = '<blockquote></blockquote>';
            cursorOffset = 12; // Position cursor between tags
          }
          break;
        case 'link':
          const url = prompt('Enter URL:');
          if (url) {
            if (selectedText) {
              newText = `<a href="${url}">${selectedText}</a>`;
              cursorOffset = newText.length;
            } else {
              newText = `<a href="${url}">Link Text</a>`;
              cursorOffset = newText.length - 9; // Position cursor before "Link Text"
            }
          } else {
            return;
          }
          break;
        default:
          return;
      }

      const newValue = value.substring(0, start) + newText + value.substring(end);
      onChange(newValue);
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        const newCursorPos = start + cursorOffset;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    };

    return (
      <div className="border rounded-lg transition-all duration-200">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
          <button
            type="button"
            onClick={() => toggleFormat('bold')}
            className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('italic')}
            className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('underline')}
            className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => toggleFormat('list')}
            className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('ordered-list')}
            className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('quote')}
            className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
            title="Quote Block"
          >
            <Quote className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => toggleFormat('link')}
            className="p-1 hover:bg-gray-200 rounded transition-all duration-200"
            title="Add Link"
          >
            <Link className="h-4 w-4" />
          </button>
        </div>
        
        {/* Editor */}
        <Textarea
          id="rich-text-editor"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={(e) => {
            // Handle keyboard shortcuts
            if (e.ctrlKey || e.metaKey) {
              switch (e.key) {
                case 'b':
                  e.preventDefault();
                  toggleFormat('bold');
                  break;
                case 'i':
                  e.preventDefault();
                  toggleFormat('italic');
                  break;
                case 'u':
                  e.preventDefault();
                  toggleFormat('underline');
                  break;
              }
            }
          }}
          placeholder={placeholder}
          className="min-h-[200px] border-0 resize-none transition-all duration-200 rounded-lg"
        />
      </div>
    );
  };

  const renderBasicInfoTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Product Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="productName">Product Name *</Label>
              <Input
                id="productName"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <Label htmlFor="productType">Product Type *</Label>
              <Select value={formData.productType} onValueChange={(value) => setFormData({ ...formData, productType: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select product type" />
                </SelectTrigger>
                <SelectContent>
                  {productTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <SelectItem key={category._id || category.id} value={category._id || category.id}>
                        {category.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="loading" disabled>Loading categories...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="brand">Brand</Label>
            <Select value={formData.brand || 'none'} onValueChange={(value) => setFormData({ ...formData, brand: value === 'none' ? '' : value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Brand</SelectItem>
                {brands.length > 0 ? (
                  brands.map((brand) => (
                    <SelectItem key={brand._id || brand.id} value={brand._id || brand.id}>
                      {brand.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="loading" disabled>Loading brands...</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Product Description</Label>
            <RichTextEditor
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              placeholder="Enter detailed product description with rich formatting..."
            />
            <div className="mt-2 space-y-2">
              <p className="text-xs text-gray-500">
                Use the toolbar buttons or keyboard shortcuts (Ctrl+B, Ctrl+I, Ctrl+U) to format your text. 
                Select text and click formatting buttons, or click buttons to insert empty formatted elements.
              </p>
              {formData.description && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
                    Preview HTML Output
                  </summary>
                  <div className="mt-1 p-2 bg-gray-50 rounded border text-xs font-mono whitespace-pre-wrap">
                    {formData.description}
                  </div>
                </details>
              )}
            </div>
          </div>

          {/* Tracking & Service Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trackingType">Tracking Type</Label>
              <Select 
                value={formData.trackingType} 
                onValueChange={(value) => setFormData({ ...formData, trackingType: value as 'none' | 'serial' | 'batch' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tracking type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="serial">Serial Number</SelectItem>
                  <SelectItem value="batch">Batch/Lot Number</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="warrantyPeriod">Warranty Period (months)</Label>
              <Input
                id="warrantyPeriod"
                type="number"
                value={formData.warrantyPeriod || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  warrantyPeriod: e.target.value ? parseInt(e.target.value) : undefined 
                })}
                placeholder="Optional warranty period"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isService"
              checked={formData.isService}
              onCheckedChange={(checked) => setFormData({ ...formData, isService: checked })}
            />
            <Label htmlFor="isService">Is Service Item</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            Product Identifiers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="slug">Slug (Auto-generated)</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="product-slug"
              />
            </div>
            <div>
              <Label htmlFor="sku">SKU (Auto-generated)</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                placeholder="CAT-PRO-001"
              />
            </div>
          </div>
          
          {/* Product Status Indicators */}
          <div className="flex flex-wrap gap-2">
            <Badge variant={formData.trackingType === 'none' ? 'secondary' : 'default'}>
              {formData.trackingType === 'none' ? 'No Tracking' : 
               formData.trackingType === 'serial' ? 'Serial Tracking' : 'Batch Tracking'}
            </Badge>
            
            {formData.isService && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Package className="h-3 w-3" />
                Service Item
              </Badge>
            )}
            
            {formData.warrantyPeriod && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                {formData.warrantyPeriod} months warranty
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderImagesTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Product Images
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Upload product images</p>
            <p className="text-xs text-gray-500 mb-4">Drag and drop images here or click to browse</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
              disabled={isUploading}
            />
            <Button 
              type="button" 
              variant="outline" 
              disabled={isUploading}
              className="transition-all duration-200 rounded-lg"
              onClick={() => {
                document.getElementById('image-upload')?.click();
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Images
                </>
              )}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Supported formats: JPG, PNG, GIF, WebP (max 10MB each)
            </p>
          </div>


          {/* Uploaded Images */}
          {formData.uploadedImages.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Uploaded Images ({formData.uploadedImages.length})
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.uploadedImages.map((image, index) => (
                  <div key={`uploaded-${index}`} className="relative group">
                    {/* Square image container */}
                    <div 
                      className="aspect-square w-full bg-gray-100 rounded-lg border border-green-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-green-300 transition-colors"
                      onClick={() => setSelectedImage({url: image.publicUrl, name: image.originalName})}
                    >
                      <img
                        src={image.publicUrl}
                        alt={image.originalName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Image failed to load:', image.publicUrl, e);
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const fallback = target.parentElement?.querySelector('.image-fallback') as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div className="image-fallback hidden absolute inset-0 items-center justify-center bg-gray-100 text-gray-500 text-xs text-center p-2">
                        <div>
                          <div className="font-medium">Image Preview</div>
                          <div className="text-xs mt-1">{image.originalName}</div>
                        </div>
                      </div>
                      
                      {/* View overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImage({url: image.publicUrl, name: image.originalName});
                        }}
                        className="bg-blue-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity z-10 hover:bg-blue-600 shadow-lg"
                        title="View full size"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeImage(index, true);
                        }}
                        disabled={deletingImages.has(index)}
                        className="bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete image"
                      >
                        {deletingImages.has(index) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <Trash2 className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    
                    {/* Image info */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="truncate font-medium">{image.originalName}</div>
                      <div className="text-xs opacity-75">{(image.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Local Images (fallback for failed uploads) */}
          {formData.images.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-orange-600 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Local Images ({formData.images.length}) - Upload Failed
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {formData.images.map((image, index) => (
                  <div key={`local-${index}`} className="relative group">
                    {/* Square image container */}
                    <div 
                      className="aspect-square w-full bg-gray-100 rounded-lg border border-orange-200 flex items-center justify-center overflow-hidden cursor-pointer hover:border-orange-300 transition-colors"
                      onClick={() => setSelectedImage({url: URL.createObjectURL(image), name: image.name})}
                    >
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* View overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                        <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setSelectedImage({url: URL.createObjectURL(image), name: image.name});
                        }}
                        className="bg-blue-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity z-10 hover:bg-blue-600 shadow-lg"
                        title="View full size"
                      >
                        <ZoomIn className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          removeImage(index, false);
                        }}
                        disabled={deletingImages.has(index)}
                        className="bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100 transition-opacity z-10 hover:bg-red-600 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Delete image"
                      >
                        {deletingImages.has(index) ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : (
                          <X className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    
                    {/* Image info */}
                    <div className="absolute bottom-2 left-2 right-2 bg-black bg-opacity-75 text-white text-xs p-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="truncate font-medium">{image.name}</div>
                      <div className="text-xs opacity-75">{(image.size / 1024 / 1024).toFixed(1)} MB</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No images message */}
          {formData.uploadedImages.length === 0 && formData.images.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No images uploaded yet</p>
              <p className="text-sm">Upload images to showcase your product</p>
            </div>
          )}

          {/* Remove all images button */}
          {(formData.uploadedImages.length > 0 || formData.images.length > 0) && (
            <div className="flex justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (confirm('Are you sure you want to remove all images? This will also delete them from storage.')) {
                    // Delete uploaded images from storage
                    const deletePromises = formData.uploadedImages.map(async (image) => {
                      if (image.filename) {
                        try {
                          const response = await fetch('/api/products/delete-image', {
                            method: 'DELETE',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ filename: image.filename }),
                          });
                          return response.json();
                        } catch (error) {
                          console.error('Error deleting image:', error);
                          return { success: false, error: 'Network error' };
                        }
                      }
                      return { success: true };
                    });

                    const results = await Promise.all(deletePromises);
                    const failedDeletes = results.filter(result => !result.success);
                    
                    if (failedDeletes.length > 0) {
                      toast({
                        title: "Some Deletions Failed",
                        description: `${failedDeletes.length} image(s) could not be deleted from storage.`,
                        variant: "destructive",
                      });
                    }

                    // Remove from form data
                    setFormData(prev => ({
                      ...prev,
                      images: [],
                      uploadedImages: []
                    }));
                    
                    toast({
                      title: "All Images Removed",
                      description: "All product images have been removed from the form and storage.",
                      variant: "default",
                    });
                  }
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove All Images
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderPricingTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Pricing & Stock
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="masterPrice">Master Price *</Label>
            <Input
              id="masterPrice"
              type="number"
              step="0.01"
              value={formData.masterPrice}
              onChange={(e) => setFormData({ ...formData, masterPrice: parseFloat(e.target.value) || 0 })}
              placeholder="0.00"
              required
            />
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="trackStock">Track Stock</Label>
                <p className="text-sm text-gray-600">Enable inventory tracking for this product</p>
              </div>
              <Switch
                id="trackStock"
                checked={formData.trackStock}
                onCheckedChange={(checked) => setFormData({ ...formData, trackStock: checked })}
              />
            </div>

            {formData.trackStock && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Current Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="lowStockThreshold">Low Stock Threshold</Label>
                  <Input
                    id="lowStockThreshold"
                    type="number"
                    value={formData.lowStockThreshold}
                    onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value) || 0 })}
                    placeholder="10"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="allowBackorders">Allow Backorders</Label>
                <p className="text-sm text-gray-600">Allow customers to order when out of stock</p>
              </div>
              <Switch
                id="allowBackorders"
                checked={formData.allowBackorders}
                onCheckedChange={(checked) => setFormData({ ...formData, allowBackorders: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAdvancedTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Custom Attributes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newAttribute.key}
              onChange={(e) => setNewAttribute({ ...newAttribute, key: e.target.value })}
              placeholder="Attribute name"
            />
            <Input
              value={newAttribute.value}
              onChange={(e) => setNewAttribute({ ...newAttribute, value: e.target.value })}
              placeholder="Attribute value"
            />
            <Button type="button" onClick={addCustomAttribute} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.customAttributes.map((attr, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="font-medium">{attr.key}:</span>
                <span>{attr.value}</span>
                <button
                  type="button"
                  onClick={() => removeCustomAttribute(index)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Specifications & Dimensions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSpecification.key}
              onChange={(e) => setNewSpecification({ ...newSpecification, key: e.target.value })}
              placeholder="Specification name"
            />
            <Input
              value={newSpecification.value}
              onChange={(e) => setNewSpecification({ ...newSpecification, value: e.target.value })}
              placeholder="Specification value"
            />
            <Button type="button" onClick={addSpecification} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <span className="font-medium">{spec.key}:</span>
                <span>{spec.value}</span>
                <button
                  type="button"
                  onClick={() => removeSpecification(index)}
                  className="ml-auto text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="length">Length (cm)</Label>
              <Input
                id="length"
                type="number"
                step="0.1"
                value={formData.dimensions.length}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, length: parseFloat(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="width">Width (cm)</Label>
              <Input
                id="width"
                type="number"
                step="0.1"
                value={formData.dimensions.width}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, width: parseFloat(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.dimensions.height}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, height: parseFloat(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.dimensions.weight}
                onChange={(e) => setFormData({
                  ...formData,
                  dimensions: { ...formData.dimensions, weight: parseFloat(e.target.value) || 0 }
                })}
                placeholder="0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Related Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <LinkIcon className="h-8 w-8 mx-auto mb-2" />
            <p>Related products functionality will be implemented</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2">Loading form data...</span>
      </div>
    );
  }

  return (
    <form id={initialData ? "edit-product-form" : "create-product-form"} onSubmit={handleSubmit} className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="images" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Images
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="mt-6">
          {renderBasicInfoTab()}
        </TabsContent>

        <TabsContent value="images" className="mt-6">
          {renderImagesTab()}
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          {renderPricingTab()}
        </TabsContent>

        <TabsContent value="advanced" className="mt-6">
          {renderAdvancedTab()}
        </TabsContent>
      </Tabs>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">{selectedImage.name}</h3>
              <button
                onClick={() => setSelectedImage(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBMODAgMTUwSDEyMFY1MFoiIGZpbGw9IiM5Q0EzQUYiLz4KPHN2ZyB4PSI3NSIgeT0iNzUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiM5Q0EzQUYiIHN0cm9rZS13aWR0aD0iMiI+CjxwYXRoIGQ9Ik0yMSAxNlY4YTIgMiAwIDAgMC0yLTJIOGEyIDIgMCAwIDAtMiAydjgiLz4KPHBhdGggZD0iTTE5IDIxSDVhMiAyIDAgMCAxLTItMlYxNmwyLTIgMiAyIDQtNCA0IDQiLz4KPC9zdmc+Cjwvc3ZnPg==';
                }}
              />
            </div>
          </div>
        </div>
      )}

    </form>
  );
}

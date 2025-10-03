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
  AlignRight
} from 'lucide-react';

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
}

export function EnhancedCreateProductForm({ onSubmit, onCancel }: EnhancedCreateProductFormProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    productName: '',
    productType: 'physical',
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

  const fetchFormData = async () => {
    try {
      setLoading(true);
      
      // Fetch categories
      const categoriesResponse = await fetch('/api/categories');
      const categoriesData = await categoriesResponse.json();
      if (categoriesData.success) {
        setCategories(categoriesData.data || []);
      }

      // Fetch brands
      const brandsResponse = await fetch('/api/brands');
      const brandsData = await brandsResponse.json();
      if (brandsData.success) {
        setBrands(brandsData.data || []);
      }

      // Set product types (static for now, can be fetched from API later)
      setProductTypes([
        { id: 'physical', name: 'Physical Product', description: 'Tangible products' },
        { id: 'digital', name: 'Digital Product', description: 'Digital downloads' },
        { id: 'service', name: 'Service', description: 'Service offerings' },
        { id: 'subscription', name: 'Subscription', description: 'Recurring services' }
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
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
    onSubmit(formData);
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
      switch (format) {
        case 'bold':
          newText = `<strong>${selectedText}</strong>`;
          break;
        case 'italic':
          newText = `<em>${selectedText}</em>`;
          break;
        case 'underline':
          newText = `<u>${selectedText}</u>`;
          break;
        case 'list':
          newText = `<ul><li>${selectedText}</li></ul>`;
          break;
        case 'ordered-list':
          newText = `<ol><li>${selectedText}</li></ol>`;
          break;
        case 'quote':
          newText = `<blockquote>${selectedText}</blockquote>`;
          break;
        case 'link':
          const url = prompt('Enter URL:');
          if (url) {
            newText = `<a href="${url}">${selectedText}</a>`;
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
        textarea.setSelectionRange(start + newText.length, start + newText.length);
      }, 0);
    };

    return (
      <div className="border rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-0">
        {/* Toolbar */}
        <div className="flex items-center gap-1 p-2 border-b bg-gray-50">
          <button
            type="button"
            onClick={() => toggleFormat('bold')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('italic')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('underline')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => toggleFormat('list')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('ordered-list')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => toggleFormat('quote')}
            className="p-1 hover:bg-gray-200 rounded"
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          <button
            type="button"
            onClick={() => toggleFormat('link')}
            className="p-1 hover:bg-gray-200 rounded"
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
          placeholder={placeholder}
          className={`min-h-[200px] border-0 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset`}
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600 mb-2">Upload product images</p>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload">
              <Button type="button" variant="outline" asChild>
                <span>Choose Images</span>
              </Button>
            </label>
          </div>

          {formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={URL.createObjectURL(image)}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
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
    <form id="create-product-form" onSubmit={handleSubmit} className="space-y-6">
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

    </form>
  );
}

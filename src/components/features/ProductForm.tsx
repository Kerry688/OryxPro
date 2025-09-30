'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Combobox, ComboboxItem } from '@/components/ui/combobox';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { KitBundleManager } from './KitBundleManager';
import { Product, ProductType } from '@/lib/models/product';

interface ProductFormProps {
  product?: Product | null;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  productTypes: any[];
}

export function ProductForm({ product, onSubmit, onCancel, productTypes }: ProductFormProps) {
  const [brands, setBrands] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    // Basic fields
    sku: '',
    name: '',
    description: '',
    type: 'sales_product' as ProductType,
    category: '',
    subcategory: '',
    brand: 'none',
    images: [] as string[],
    tags: [] as string[],
    isActive: true,
    
    // Sales Product fields
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 0,
    maxStock: 0,
    reorderPoint: 0,
    unit: '',
    weight: 0,
    dimensions: { length: 0, width: 0, height: 0 },
    model: '',
    
    // Print Item fields
    basePrice: 0,
    costPrice: 0,
    markup: 0,
    isDigital: false,
    printComplexity: 'simple' as 'simple' | 'medium' | 'complex',
    printTime: 0,
    printMaterials: [] as string[],
    printSettings: {
      resolution: 300,
      colorMode: 'color' as 'color' | 'black_white' | 'grayscale',
      paperType: '',
      paperWeight: 0,
      finish: 'matte' as 'matte' | 'glossy' | 'satin'
    },
    
    // Service fields
    hourlyRate: 0,
    duration: 0,
    isRecurring: false,
    recurringInterval: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
    serviceCategory: 'consultation' as 'consultation' | 'design' | 'installation' | 'maintenance' | 'support' | 'other',
    requirements: [] as string[],
    deliverables: [] as string[],
    skillsRequired: [] as string[],
    
    // Raw Material fields
    supplier: '',
    materialType: 'paper' as 'paper' | 'ink' | 'toner' | 'fabric' | 'metal' | 'plastic' | 'chemical' | 'other',
    specifications: {} as any,
    storage: {
      temperature: { min: 0, max: 0 },
      humidity: { min: 0, max: 0 },
      requiresSpecialStorage: false,
      shelfLife: 0,
      batchTracking: false
    },
    
    // Kit/Bundle fields
    components: [] as any[],
    isConfigurable: false,
    packaging: {
      dimensions: { length: 0, width: 0, height: 0 },
      weight: 0,
      packagingType: 'box' as 'box' | 'envelope' | 'tube' | 'custom'
    },
    assemblyInstructions: '',
    
    // Asset fields
    purchasePrice: 0,
    currentValue: 0,
    depreciationMethod: 'straight_line' as 'straight_line' | 'declining_balance' | 'sum_of_years' | 'none',
    usefulLife: 0,
    depreciationRate: 0,
    location: {
      branch: '',
      department: '',
      room: '',
      assetTag: ''
    },
    specifications: {
      manufacturer: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyExpiry: '',
      condition: 'excellent' as 'excellent' | 'good' | 'fair' | 'poor' | 'needs_repair'
    }
  });

  const [newTag, setNewTag] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newRequirement, setNewRequirement] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newPrintMaterial, setNewPrintMaterial] = useState('');

  // Fetch brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/api/brands?limit=1000');
        if (response.ok) {
          const data = await response.json();
          setBrands(data.brands);
        }
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };
    fetchBrands();
  }, []);

  useEffect(() => {
    if (product) {
      setFormData({
        sku: product.sku,
        name: product.name,
        description: product.description,
        type: product.type,
        category: product.category,
        subcategory: product.subcategory || '',
        brand: (product as any).brand || 'none',
        images: product.images,
        tags: product.tags,
        isActive: product.isActive,
        
        // Type-specific data
        ...(product as any)
      });
    }
  }, [product]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      sku: formData.sku,
      name: formData.name,
      description: formData.description,
      type: formData.type,
      category: formData.category,
      subcategory: formData.subcategory,
      brand: formData.brand === 'none' ? '' : formData.brand,
      images: formData.images,
      tags: formData.tags,
      isActive: formData.isActive,
      
      // Type-specific data
      [getTypeSpecificKey(formData.type)]: getTypeSpecificData(formData)
    };

    onSubmit(submitData);
  };

  const getTypeSpecificKey = (type: ProductType): string => {
    const keys = {
      'sales_product': 'salesData',
      'print_item': 'printData',
      'service': 'serviceData',
      'raw_material': 'materialData',
      'kit_bundle': 'kitData',
      'asset': 'assetData'
    };
    return keys[type];
  };

  const getTypeSpecificData = (data: any) => {
    switch (data.type) {
      case 'sales_product':
        return {
          price: data.price,
          cost: data.cost,
          stock: data.stock,
          minStock: data.minStock,
          maxStock: data.maxStock,
          reorderPoint: data.reorderPoint,
          unit: data.unit,
          weight: data.weight,
          dimensions: data.dimensions,
          model: data.model
        };
      case 'print_item':
        return {
          basePrice: data.basePrice,
          costPrice: data.costPrice,
          markup: data.markup,
          isDigital: data.isDigital,
          printComplexity: data.printComplexity,
          printTime: data.printTime,
          printMaterials: data.printMaterials,
          printSettings: data.printSettings
        };
      case 'service':
        return {
          basePrice: data.basePrice,
          hourlyRate: data.hourlyRate,
          duration: data.duration,
          isRecurring: data.isRecurring,
          recurringInterval: data.recurringInterval,
          serviceCategory: data.serviceCategory,
          requirements: data.requirements,
          deliverables: data.deliverables,
          skillsRequired: data.skillsRequired
        };
      case 'raw_material':
        return {
          cost: data.cost,
          stock: data.stock,
          minStock: data.minStock,
          maxStock: data.maxStock,
          reorderPoint: data.reorderPoint,
          unit: data.unit,
          weight: data.weight,
          dimensions: data.dimensions,
          supplier: data.supplier,
          materialType: data.materialType,
          specifications: data.specifications,
          storage: data.storage
        };
      case 'kit_bundle':
        return {
          basePrice: data.basePrice,
          costPrice: data.costPrice,
          markup: data.markup,
          components: data.components,
          isConfigurable: data.isConfigurable,
          packaging: data.packaging
        };
      case 'asset':
        return {
          purchasePrice: data.purchasePrice,
          currentValue: data.currentValue,
          depreciationMethod: data.depreciationMethod,
          usefulLife: data.usefulLife,
          depreciationRate: data.depreciationRate,
          location: data.location,
          specifications: data.specifications
        };
      default:
        return {};
    }
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({ ...formData, tags: [...formData.tags, newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData({ ...formData, images: [...formData.images, newImage] });
      setNewImage('');
    }
  };

  const removeImage = (image: string) => {
    setFormData({ ...formData, images: formData.images.filter(i => i !== image) });
  };

  const addArrayItem = (field: string, value: string, setter: (value: string) => void) => {
    if (value && !formData[field as keyof typeof formData].includes(value)) {
      setFormData({ ...formData, [field]: [...(formData[field as keyof typeof formData] as string[]), value] });
      setter('');
    }
  };

  const removeArrayItem = (field: string, item: string) => {
    setFormData({ 
      ...formData, 
      [field]: (formData[field as keyof typeof formData] as string[]).filter(i => i !== item) 
    });
  };

  const renderBasicFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sku">SKU *</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="type">Product Type *</Label>
          <Combobox 
            value={formData.type} 
            onValueChange={(value) => setFormData({ ...formData, type: value as ProductType })}
            placeholder="Select product type"
            searchPlaceholder="Search product types..."
            emptyText="No product type found."
          >
            {productTypes.map((type) => (
              <ComboboxItem key={type.type} value={type.type}>
                {type.name}
              </ComboboxItem>
            ))}
          </Combobox>
        </div>
      </div>

      <div>
        <Label htmlFor="name">Product Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Category *</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="subcategory">Subcategory</Label>
          <Input
            id="subcategory"
            value={formData.subcategory}
            onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Combobox 
          value={formData.brand} 
          onValueChange={(value) => setFormData({ ...formData, brand: value })}
          placeholder="Select a brand"
          searchPlaceholder="Search brands..."
          emptyText="No brand found."
        >
          <ComboboxItem value="none">No Brand</ComboboxItem>
          {brands.map((brand) => (
            <ComboboxItem key={brand._id} value={brand._id}>
              {brand.name}
            </ComboboxItem>
          ))}
        </Combobox>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isActive"
          checked={formData.isActive}
          onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
        />
        <Label htmlFor="isActive">Active</Label>
      </div>

      {/* Tags */}
      <div>
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tag"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Images */}
      <div>
        <Label>Images</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.images.map((image) => (
            <Badge key={image} variant="outline" className="flex items-center gap-1">
              {image}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeImage(image)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="Image URL"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
          />
          <Button type="button" onClick={addImage}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSalesProductFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="cost">Cost</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="minStock">Min Stock</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="maxStock">Max Stock</Label>
          <Input
            id="maxStock"
            type="number"
            value={formData.maxStock}
            onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="unit">Unit</Label>
          <Input
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            placeholder="e.g., piece, kg, liter"
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight</Label>
          <Input
            id="weight"
            type="number"
            step="0.01"
            value={formData.weight}
            onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label>Dimensions (cm)</Label>
        <div className="grid grid-cols-3 gap-2">
          <Input
            placeholder="Length"
            type="number"
            value={formData.dimensions.length}
            onChange={(e) => setFormData({
              ...formData,
              dimensions: { ...formData.dimensions, length: parseFloat(e.target.value) || 0 }
            })}
          />
          <Input
            placeholder="Width"
            type="number"
            value={formData.dimensions.width}
            onChange={(e) => setFormData({
              ...formData,
              dimensions: { ...formData.dimensions, width: parseFloat(e.target.value) || 0 }
            })}
          />
          <Input
            placeholder="Height"
            type="number"
            value={formData.dimensions.height}
            onChange={(e) => setFormData({
              ...formData,
              dimensions: { ...formData.dimensions, height: parseFloat(e.target.value) || 0 }
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
        </div>
      </div>
    </div>
  );

  const renderPrintItemFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="basePrice">Base Price *</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="markup">Markup (%)</Label>
          <Input
            id="markup"
            type="number"
            step="0.01"
            value={formData.markup}
            onChange={(e) => setFormData({ ...formData, markup: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="printComplexity">Print Complexity</Label>
          <Combobox 
            value={formData.printComplexity} 
            onValueChange={(value) => setFormData({ ...formData, printComplexity: value as any })}
            placeholder="Select complexity"
            searchPlaceholder="Search complexity..."
            emptyText="No complexity found."
          >
            <ComboboxItem value="simple">Simple</ComboboxItem>
            <ComboboxItem value="medium">Medium</ComboboxItem>
            <ComboboxItem value="complex">Complex</ComboboxItem>
          </Combobox>
        </div>
        <div>
          <Label htmlFor="printTime">Print Time (minutes)</Label>
          <Input
            id="printTime"
            type="number"
            value={formData.printTime}
            onChange={(e) => setFormData({ ...formData, printTime: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label>Print Materials</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.printMaterials.map((material) => (
            <Badge key={material} variant="secondary" className="flex items-center gap-1">
              {material}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('printMaterials', material)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newPrintMaterial}
            onChange={(e) => setNewPrintMaterial(e.target.value)}
            placeholder="Add print material"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('printMaterials', newPrintMaterial, setNewPrintMaterial))}
          />
          <Button type="button" onClick={() => addArrayItem('printMaterials', newPrintMaterial, setNewPrintMaterial)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="resolution">Resolution (DPI)</Label>
          <Input
            id="resolution"
            type="number"
            value={formData.printSettings.resolution}
            onChange={(e) => setFormData({
              ...formData,
              printSettings: { ...formData.printSettings, resolution: parseInt(e.target.value) || 300 }
            })}
          />
        </div>
        <div>
          <Label htmlFor="colorMode">Color Mode</Label>
          <Combobox 
            value={formData.printSettings.colorMode} 
            onValueChange={(value) => setFormData({
              ...formData,
              printSettings: { ...formData.printSettings, colorMode: value as any }
            })}
            placeholder="Select color mode"
            searchPlaceholder="Search color modes..."
            emptyText="No color mode found."
          >
            <ComboboxItem value="color">Color</ComboboxItem>
            <ComboboxItem value="black_white">Black & White</ComboboxItem>
            <ComboboxItem value="grayscale">Grayscale</ComboboxItem>
          </Combobox>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isDigital"
          checked={formData.isDigital}
          onCheckedChange={(checked) => setFormData({ ...formData, isDigital: checked })}
        />
        <Label htmlFor="isDigital">Digital Product</Label>
      </div>
    </div>
  );

  const renderServiceFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="basePrice">Base Price *</Label>
          <Input
            id="basePrice"
            type="number"
            step="0.01"
            value={formData.basePrice}
            onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="hourlyRate">Hourly Rate</Label>
          <Input
            id="hourlyRate"
            type="number"
            step="0.01"
            value={formData.hourlyRate}
            onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="duration">Duration (hours) *</Label>
          <Input
            id="duration"
            type="number"
            step="0.5"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="serviceCategory">Service Category</Label>
          <Combobox 
            value={formData.serviceCategory} 
            onValueChange={(value) => setFormData({ ...formData, serviceCategory: value as any })}
            placeholder="Select service category"
            searchPlaceholder="Search service categories..."
            emptyText="No service category found."
          >
            <ComboboxItem value="consultation">Consultation</ComboboxItem>
            <ComboboxItem value="design">Design</ComboboxItem>
            <ComboboxItem value="installation">Installation</ComboboxItem>
            <ComboboxItem value="maintenance">Maintenance</ComboboxItem>
            <ComboboxItem value="support">Support</ComboboxItem>
            <ComboboxItem value="other">Other</ComboboxItem>
          </Combobox>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="isRecurring"
          checked={formData.isRecurring}
          onCheckedChange={(checked) => setFormData({ ...formData, isRecurring: checked })}
        />
        <Label htmlFor="isRecurring">Recurring Service</Label>
      </div>

      {formData.isRecurring && (
        <div>
          <Label htmlFor="recurringInterval">Recurring Interval</Label>
          <Select value={formData.recurringInterval} onValueChange={(value) => setFormData({ ...formData, recurringInterval: value as any })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Requirements */}
      <div>
        <Label>Requirements</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.requirements.map((req) => (
            <Badge key={req} variant="secondary" className="flex items-center gap-1">
              {req}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('requirements', req)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newRequirement}
            onChange={(e) => setNewRequirement(e.target.value)}
            placeholder="Add requirement"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('requirements', newRequirement, setNewRequirement))}
          />
          <Button type="button" onClick={() => addArrayItem('requirements', newRequirement, setNewRequirement)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Deliverables */}
      <div>
        <Label>Deliverables</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.deliverables.map((del) => (
            <Badge key={del} variant="secondary" className="flex items-center gap-1">
              {del}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('deliverables', del)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            placeholder="Add deliverable"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('deliverables', newDeliverable, setNewDeliverable))}
          />
          <Button type="button" onClick={() => addArrayItem('deliverables', newDeliverable, setNewDeliverable)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Skills Required */}
      <div>
        <Label>Skills Required</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.skillsRequired.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X className="h-3 w-3 cursor-pointer" onClick={() => removeArrayItem('skillsRequired', skill)} />
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add skill"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArrayItem('skillsRequired', newSkill, setNewSkill))}
          />
          <Button type="button" onClick={() => addArrayItem('skillsRequired', newSkill, setNewSkill)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderRawMaterialFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="cost">Cost *</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="supplier">Supplier *</Label>
          <Input
            id="supplier"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="minStock">Min Stock</Label>
          <Input
            id="minStock"
            type="number"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div>
          <Label htmlFor="maxStock">Max Stock</Label>
          <Input
            id="maxStock"
            type="number"
            value={formData.maxStock}
            onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="materialType">Material Type</Label>
        <Select value={formData.materialType} onValueChange={(value) => setFormData({ ...formData, materialType: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="paper">Paper</SelectItem>
            <SelectItem value="ink">Ink</SelectItem>
            <SelectItem value="toner">Toner</SelectItem>
            <SelectItem value="fabric">Fabric</SelectItem>
            <SelectItem value="metal">Metal</SelectItem>
            <SelectItem value="plastic">Plastic</SelectItem>
            <SelectItem value="chemical">Chemical</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="batchTracking"
          checked={formData.storage.batchTracking}
          onCheckedChange={(checked) => setFormData({
            ...formData,
            storage: { ...formData.storage, batchTracking: checked }
          })}
        />
        <Label htmlFor="batchTracking">Batch Tracking Required</Label>
      </div>
    </div>
  );

  const renderKitBundleFields = () => (
    <div className="space-y-6">
      <KitBundleManager
        components={formData.components || []}
        onComponentsChange={(components) => setFormData({ ...formData, components })}
        isConfigurable={formData.isConfigurable}
        onConfigurableChange={(isConfigurable) => setFormData({ ...formData, isConfigurable })}
        basePrice={formData.basePrice}
        onBasePriceChange={(basePrice) => setFormData({ ...formData, basePrice })}
        markup={formData.markup}
        onMarkupChange={(markup) => setFormData({ ...formData, markup })}
      />
      
      {/* Packaging Information */}
      <Card>
        <CardHeader>
          <CardTitle>Packaging Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Packaging Dimensions (cm)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Length"
                type="number"
                value={formData.packaging.dimensions.length}
                onChange={(e) => setFormData({
                  ...formData,
                  packaging: {
                    ...formData.packaging,
                    dimensions: { ...formData.packaging.dimensions, length: parseFloat(e.target.value) || 0 }
                  }
                })}
              />
              <Input
                placeholder="Width"
                type="number"
                value={formData.packaging.dimensions.width}
                onChange={(e) => setFormData({
                  ...formData,
                  packaging: {
                    ...formData.packaging,
                    dimensions: { ...formData.packaging.dimensions, width: parseFloat(e.target.value) || 0 }
                  }
                })}
              />
              <Input
                placeholder="Height"
                type="number"
                value={formData.packaging.dimensions.height}
                onChange={(e) => setFormData({
                  ...formData,
                  packaging: {
                    ...formData.packaging,
                    dimensions: { ...formData.packaging.dimensions, height: parseFloat(e.target.value) || 0 }
                  }
                })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="packagingWeight">Packaging Weight (kg)</Label>
              <Input
                id="packagingWeight"
                type="number"
                step="0.01"
                value={formData.packaging.weight}
                onChange={(e) => setFormData({
                  ...formData,
                  packaging: {
                    ...formData.packaging,
                    weight: parseFloat(e.target.value) || 0
                  }
                })}
              />
            </div>
            <div>
              <Label htmlFor="packagingType">Packaging Type</Label>
              <Combobox 
                value={formData.packaging.packagingType} 
                onValueChange={(value) => setFormData({
                  ...formData,
                  packaging: {
                    ...formData.packaging,
                    packagingType: value as any
                  }
                })}
                placeholder="Select packaging type"
                searchPlaceholder="Search packaging types..."
                emptyText="No packaging type found."
              >
                <ComboboxItem value="box">Box</ComboboxItem>
                <ComboboxItem value="envelope">Envelope</ComboboxItem>
                <ComboboxItem value="tube">Tube</ComboboxItem>
                <ComboboxItem value="custom">Custom</ComboboxItem>
              </Combobox>
            </div>
          </div>

          <div>
            <Label htmlFor="assemblyInstructions">Assembly Instructions</Label>
            <Textarea
              id="assemblyInstructions"
              value={formData.assemblyInstructions || ''}
              onChange={(e) => setFormData({ ...formData, assemblyInstructions: e.target.value })}
              placeholder="Instructions for assembling the kit/bundle..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAssetFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="purchasePrice">Purchase Price *</Label>
          <Input
            id="purchasePrice"
            type="number"
            step="0.01"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="currentValue">Current Value</Label>
          <Input
            id="currentValue"
            type="number"
            step="0.01"
            value={formData.currentValue}
            onChange={(e) => setFormData({ ...formData, currentValue: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="usefulLife">Useful Life (years) *</Label>
          <Input
            id="usefulLife"
            type="number"
            step="0.1"
            value={formData.usefulLife}
            onChange={(e) => setFormData({ ...formData, usefulLife: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <Label htmlFor="depreciationRate">Depreciation Rate (%)</Label>
          <Input
            id="depreciationRate"
            type="number"
            step="0.01"
            value={formData.depreciationRate}
            onChange={(e) => setFormData({ ...formData, depreciationRate: parseFloat(e.target.value) || 0 })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="depreciationMethod">Depreciation Method</Label>
        <Select value={formData.depreciationMethod} onValueChange={(value) => setFormData({ ...formData, depreciationMethod: value as any })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="straight_line">Straight Line</SelectItem>
            <SelectItem value="declining_balance">Declining Balance</SelectItem>
            <SelectItem value="sum_of_years">Sum of Years</SelectItem>
            <SelectItem value="none">None</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="manufacturer">Manufacturer</Label>
          <Input
            id="manufacturer"
            value={formData.specifications.manufacturer}
            onChange={(e) => setFormData({
              ...formData,
              specifications: { ...formData.specifications, manufacturer: e.target.value }
            })}
          />
        </div>
        <div>
          <Label htmlFor="serialNumber">Serial Number</Label>
          <Input
            id="serialNumber"
            value={formData.specifications.serialNumber}
            onChange={(e) => setFormData({
              ...formData,
              specifications: { ...formData.specifications, serialNumber: e.target.value }
            })}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="condition">Condition</Label>
        <Select value={formData.specifications.condition} onValueChange={(value) => setFormData({
          ...formData,
          specifications: { ...formData.specifications, condition: value as any }
        })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="excellent">Excellent</SelectItem>
            <SelectItem value="good">Good</SelectItem>
            <SelectItem value="fair">Fair</SelectItem>
            <SelectItem value="poor">Poor</SelectItem>
            <SelectItem value="needs_repair">Needs Repair</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="specific">Type-Specific Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent>
              {renderBasicFields()}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="specific" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>
                {productTypes.find(t => t.type === formData.type)?.name || 'Product'} Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {formData.type === 'sales_product' && renderSalesProductFields()}
              {formData.type === 'print_item' && renderPrintItemFields()}
              {formData.type === 'service' && renderServiceFields()}
              {formData.type === 'raw_material' && renderRawMaterialFields()}
              {formData.type === 'kit_bundle' && renderKitBundleFields()}
              {formData.type === 'asset' && renderAssetFields()}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

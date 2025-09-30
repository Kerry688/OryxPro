'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ShoppingCart,
  Printer,
  Wrench,
  Package2,
  Layers,
  Building2,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Calendar,
  User,
  MapPin
} from 'lucide-react';
import { ProductType } from '@/lib/models/product';

interface ProductWorkflowsProps {
  productType: ProductType;
  product?: any;
  onComplete?: (data: any) => void;
}

export function ProductWorkflows({ productType, product, onComplete }: ProductWorkflowsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [workflowData, setWorkflowData] = useState<any>({});

  const handleNext = () => {
    if (currentStep < getWorkflowSteps().length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(workflowData);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getWorkflowSteps = () => {
    const workflows = {
      'sales_product': [
        { title: 'Order Details', description: 'Basic order information' },
        { title: 'Customer Info', description: 'Customer details and preferences' },
        { title: 'Payment', description: 'Payment processing' },
        { title: 'Fulfillment', description: 'Shipping and delivery' }
      ],
      'print_item': [
        { title: 'Order Details', description: 'Print specifications and requirements' },
        { title: 'Design Upload', description: 'Upload design files and customization' },
        { title: 'Print Settings', description: 'Configure print parameters' },
        { title: 'Production', description: 'Print production and quality check' },
        { title: 'Delivery', description: 'Packaging and delivery' }
      ],
      'service': [
        { title: 'Service Request', description: 'Service requirements and scope' },
        { title: 'Scheduling', description: 'Schedule service appointment' },
        { title: 'Preparation', description: 'Prepare tools and materials' },
        { title: 'Service Delivery', description: 'Perform the service' },
        { title: 'Completion', description: 'Finalize and follow-up' }
      ],
      'raw_material': [
        { title: 'Material Request', description: 'Specify material requirements' },
        { title: 'Supplier Order', description: 'Place order with supplier' },
        { title: 'Receipt', description: 'Receive and inspect materials' },
        { title: 'Inventory Update', description: 'Update stock levels' }
      ],
      'kit_bundle': [
        { title: 'Kit Configuration', description: 'Select components and options' },
        { title: 'Assembly', description: 'Assemble kit components' },
        { title: 'Quality Check', description: 'Verify all components' },
        { title: 'Packaging', description: 'Package and label' },
        { title: 'Delivery', description: 'Ship to customer' }
      ],
      'asset': [
        { title: 'Asset Request', description: 'Asset requirements and approval' },
        { title: 'Procurement', description: 'Purchase or acquire asset' },
        { title: 'Installation', description: 'Install and configure' },
        { title: 'Registration', description: 'Register in asset management' },
        { title: 'Maintenance', description: 'Schedule maintenance' }
      ]
    };
    return workflows[productType] || [];
  };

  const getWorkflowIcon = () => {
    const icons = {
      'sales_product': ShoppingCart,
      'print_item': Printer,
      'service': Wrench,
      'raw_material': Package2,
      'kit_bundle': Layers,
      'asset': Building2
    };
    return icons[productType];
  };

  const renderStepContent = () => {
    const steps = getWorkflowSteps();
    const currentStepData = steps[currentStep];

    switch (productType) {
      case 'sales_product':
        return renderSalesProductStep(currentStep);
      case 'print_item':
        return renderPrintItemStep(currentStep);
      case 'service':
        return renderServiceStep(currentStep);
      case 'raw_material':
        return renderRawMaterialStep(currentStep);
      case 'kit_bundle':
        return renderKitBundleStep(currentStep);
      case 'asset':
        return renderAssetStep(currentStep);
      default:
        return <div>Unknown product type workflow</div>;
    }
  };

  const renderSalesProductStep = (step: number) => {
    switch (step) {
      case 0: // Order Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={workflowData.quantity || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, quantity: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="price">Unit Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={workflowData.price || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, price: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Order Notes</Label>
              <Textarea
                id="notes"
                value={workflowData.notes || ''}
                onChange={(e) => setWorkflowData({ ...workflowData, notes: e.target.value })}
                placeholder="Any special requirements or notes..."
              />
            </div>
          </div>
        );
      case 1: // Customer Info
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={workflowData.customerName || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, customerName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="customerEmail">Email</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={workflowData.customerEmail || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, customerEmail: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="shippingAddress">Shipping Address</Label>
              <Textarea
                id="shippingAddress"
                value={workflowData.shippingAddress || ''}
                onChange={(e) => setWorkflowData({ ...workflowData, shippingAddress: e.target.value })}
              />
            </div>
          </div>
        );
      case 2: // Payment
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paymentMethod">Payment Method</Label>
                <Select value={workflowData.paymentMethod || ''} onValueChange={(value) => setWorkflowData({ ...workflowData, paymentMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="totalAmount">Total Amount</Label>
                <Input
                  id="totalAmount"
                  type="number"
                  step="0.01"
                  value={workflowData.totalAmount || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, totalAmount: parseFloat(e.target.value) })}
                  readOnly
                />
              </div>
            </div>
          </div>
        );
      case 3: // Fulfillment
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="shippingMethod">Shipping Method</Label>
                <Select value={workflowData.shippingMethod || ''} onValueChange={(value) => setWorkflowData({ ...workflowData, shippingMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select shipping method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Shipping</SelectItem>
                    <SelectItem value="express">Express Shipping</SelectItem>
                    <SelectItem value="overnight">Overnight</SelectItem>
                    <SelectItem value="pickup">Store Pickup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="trackingNumber">Tracking Number</Label>
                <Input
                  id="trackingNumber"
                  value={workflowData.trackingNumber || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, trackingNumber: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="expectedDelivery">Expected Delivery Date</Label>
              <Input
                id="expectedDelivery"
                type="date"
                value={workflowData.expectedDelivery || ''}
                onChange={(e) => setWorkflowData({ ...workflowData, expectedDelivery: e.target.value })}
              />
            </div>
          </div>
        );
      default:
        return <div>Step not implemented</div>;
    }
  };

  const renderPrintItemStep = (step: number) => {
    switch (step) {
      case 0: // Order Details
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="printType">Print Type</Label>
                <Select value={workflowData.printType || ''} onValueChange={(value) => setWorkflowData({ ...workflowData, printType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select print type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="business_cards">Business Cards</SelectItem>
                    <SelectItem value="flyers">Flyers</SelectItem>
                    <SelectItem value="posters">Posters</SelectItem>
                    <SelectItem value="banners">Banners</SelectItem>
                    <SelectItem value="brochures">Brochures</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={workflowData.quantity || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, quantity: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="paperSize">Paper Size</Label>
                <Select value={workflowData.paperSize || ''} onValueChange={(value) => setWorkflowData({ ...workflowData, paperSize: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select paper size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A4">A4</SelectItem>
                    <SelectItem value="A3">A3</SelectItem>
                    <SelectItem value="Letter">Letter</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="paperType">Paper Type</Label>
                <Select value={workflowData.paperType || ''} onValueChange={(value) => setWorkflowData({ ...workflowData, paperType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select paper type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matte">Matte</SelectItem>
                    <SelectItem value="glossy">Glossy</SelectItem>
                    <SelectItem value="satin">Satin</SelectItem>
                    <SelectItem value="cardstock">Cardstock</SelectItem>
                    <SelectItem value="photo">Photo Paper</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );
      case 1: // Design Upload
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="designFiles">Upload Design Files</Label>
              <Input
                id="designFiles"
                type="file"
                multiple
                accept=".pdf,.jpg,.jpeg,.png,.ai,.psd,.eps"
                onChange={(e) => setWorkflowData({ ...workflowData, designFiles: e.target.files })}
              />
              <p className="text-sm text-muted-foreground mt-1">
                Supported formats: PDF, JPG, PNG, AI, PSD, EPS
              </p>
            </div>
            <div>
              <Label htmlFor="designNotes">Design Notes</Label>
              <Textarea
                id="designNotes"
                value={workflowData.designNotes || ''}
                onChange={(e) => setWorkflowData({ ...workflowData, designNotes: e.target.value })}
                placeholder="Any specific design requirements or modifications..."
              />
            </div>
          </div>
        );
      case 2: // Print Settings
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="colorMode">Color Mode</Label>
                <Select value={workflowData.colorMode || ''} onValueChange={(value) => setWorkflowData({ ...workflowData, colorMode: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select color mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Full Color</SelectItem>
                    <SelectItem value="black_white">Black & White</SelectItem>
                    <SelectItem value="grayscale">Grayscale</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="resolution">Resolution (DPI)</Label>
                <Select value={workflowData.resolution || '300'} onValueChange={(value) => setWorkflowData({ ...workflowData, resolution: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="150">150 DPI</SelectItem>
                    <SelectItem value="300">300 DPI</SelectItem>
                    <SelectItem value="600">600 DPI</SelectItem>
                    <SelectItem value="1200">1200 DPI</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="proofRequired"
                checked={workflowData.proofRequired || false}
                onChange={(e) => setWorkflowData({ ...workflowData, proofRequired: e.target.checked })}
              />
              <Label htmlFor="proofRequired">Require proof before printing</Label>
            </div>
          </div>
        );
      case 3: // Production
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="estimatedTime">Estimated Production Time</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={workflowData.estimatedTime || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, estimatedTime: parseInt(e.target.value) })}
                  placeholder="Minutes"
                />
              </div>
              <div>
                <Label htmlFor="productionStatus">Production Status</Label>
                <Select value={workflowData.productionStatus || 'pending'} onValueChange={(value) => setWorkflowData({ ...workflowData, productionStatus: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="quality_check">Quality Check</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="qualityNotes">Quality Check Notes</Label>
              <Textarea
                id="qualityNotes"
                value={workflowData.qualityNotes || ''}
                onChange={(e) => setWorkflowData({ ...workflowData, qualityNotes: e.target.value })}
                placeholder="Any quality issues or notes..."
              />
            </div>
          </div>
        );
      case 4: // Delivery
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deliveryMethod">Delivery Method</Label>
                <Select value={workflowData.deliveryMethod || ''} onValueChange={(value) => setWorkflowData({ ...workflowData, deliveryMethod: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select delivery method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pickup">Store Pickup</SelectItem>
                    <SelectItem value="delivery">Delivery</SelectItem>
                    <SelectItem value="shipping">Shipping</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="deliveryDate">Delivery Date</Label>
                <Input
                  id="deliveryDate"
                  type="date"
                  value={workflowData.deliveryDate || ''}
                  onChange={(e) => setWorkflowData({ ...workflowData, deliveryDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="packagingNotes">Packaging Notes</Label>
              <Textarea
                id="packagingNotes"
                value={workflowData.packagingNotes || ''}
                onChange={(e) => setWorkflowData({ ...workflowData, packagingNotes: e.target.value })}
                placeholder="Any special packaging requirements..."
              />
            </div>
          </div>
        );
      default:
        return <div>Step not implemented</div>;
    }
  };

  const renderServiceStep = (step: number) => {
    // Service workflow implementation
    return <div>Service workflow step {step}</div>;
  };

  const renderRawMaterialStep = (step: number) => {
    // Raw material workflow implementation
    return <div>Raw material workflow step {step}</div>;
  };

  const renderKitBundleStep = (step: number) => {
    // Kit bundle workflow implementation
    return <div>Kit bundle workflow step {step}</div>;
  };

  const renderAssetStep = (step: number) => {
    // Asset workflow implementation
    return <div>Asset workflow step {step}</div>;
  };

  const steps = getWorkflowSteps();
  const IconComponent = getWorkflowIcon();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <IconComponent className="h-5 w-5 mr-2" />
          {productType.replace('_', ' ').toUpperCase()} Workflow
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= currentStep 
                  ? 'bg-primary border-primary text-primary-foreground' 
                  : 'bg-muted border-muted-foreground text-muted-foreground'
              }`}>
                {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${
                  index <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="mb-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!workflowData}
          >
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

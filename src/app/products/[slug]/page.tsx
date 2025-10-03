import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import { products } from '@/lib/data';
import { getImagePlaceholder } from '@/lib/placeholder-images';
import { ProductCustomizer } from '@/components/features/ProductCustomizer';
import { RichTextDisplay } from '@/components/features/RichTextDisplay';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Package, 
  Calendar, 
  DollarSign, 
  Shield, 
  Star,
  Wrench,
  Settings,
  BarChart3
} from 'lucide-react';

type ProductPageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  const image = getImagePlaceholder(product.imageId);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/products">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <RichTextDisplay 
            content={product.description} 
            className="text-gray-600 mt-2"
          />
        </div>
      </div>

      {/* Product Information */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Product Details */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Product Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Product Name</p>
                  <p className="font-medium">{product.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Category</p>
                  <p className="font-medium">{product.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Price</p>
                  <p className="font-medium">${product.basePrice}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unit of Measure</p>
                  <p className="font-medium">{product.unitOfMeasure}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Tracking Type</p>
                  <Badge variant={product.trackingType === 'none' ? 'secondary' : 'default'}>
                    {product.trackingType === 'none' ? 'No Tracking' : 
                     product.trackingType === 'serial' ? 'Serial Number' : 'Batch/Lot'}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Warranty</p>
                  <p className="font-medium">
                    {product.warrantyPeriod ? `${product.warrantyPeriod} months` : 'No warranty'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Type</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{product.type}</Badge>
                    {product.isService && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Wrench className="h-3 w-3" />
                        Service
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <Badge variant={product.isActive ? 'default' : 'secondary'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Service Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/products/${product.slug}/service-history`}>
                <Button className="w-full" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Service History
                </Button>
              </Link>
              <Link href={`/products/${product.slug}/service-history`}>
                <Button className="w-full" variant="outline">
                  <Wrench className="h-4 w-4 mr-2" />
                  Add Service Record
                </Button>
              </Link>
              <Link href={`/products/${product.slug}/analytics`}>
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Service Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Product Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Package className="h-4 w-4 mr-2" />
                Manage Inventory
              </Button>
              <Button className="w-full" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Warranty Management
              </Button>
              <Button className="w-full" variant="outline">
                <Star className="h-4 w-4 mr-2" />
                Quality Control
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Product Customizer */}
      <Card>
        <CardHeader>
          <CardTitle>Product Customizer</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductCustomizer product={product} initialImage={image} />
        </CardContent>
      </Card>
    </div>
  );
}

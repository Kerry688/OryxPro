import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Package, Shield, Clock, Wrench } from 'lucide-react';
import { getImagePlaceholder } from '@/lib/placeholder-images';

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const image = getImagePlaceholder(product.imageId);

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader>
        <div className="relative aspect-[3/2] w-full rounded-md overflow-hidden">
          <Image
            src={image.imageUrl}
            alt={image.description}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            data-ai-hint={image.imageHint}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle className="text-xl font-headline">{product.name}</CardTitle>
        <CardDescription className="mt-2">{product.description}</CardDescription>
        
        {/* Product Details */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Price:</span>
            <span className="font-medium">${product.basePrice}</span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Unit:</span>
            <span className="font-medium">{product.unitOfMeasure}</span>
          </div>
          
          {product.warrantyPeriod && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Warranty:</span>
              <span className="font-medium">{product.warrantyPeriod} months</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={product.trackingType === 'none' ? 'secondary' : 'default'}>
              {product.trackingType === 'none' ? 'No Tracking' : 
               product.trackingType === 'serial' ? 'Serial' : 'Batch'}
            </Badge>
            
            {product.isService && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Wrench className="h-3 w-3" />
                Service
              </Badge>
            )}
            
            {product.warrantyPeriod && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Warranty
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href={`/products/${product.slug}`}>
            Customize
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

'use client';

import { useState } from 'react';
import { ProductCard } from '@/components/features/ProductCard';
import { products } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedCreateProductForm } from '@/components/features/EnhancedCreateProductForm';
import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function ProductsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const handleCreateProduct = (data: any) => {
    console.log('New product created:', data);
    // Here you would typically send the data to your API
    setIsCreateDialogOpen(false);
    alert('Product created successfully! (Check console for data)');
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold">Our Products</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          From business essentials to promotional materials, we have everything you need.
        </p>
        <div className="mt-6 flex gap-4 justify-center">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create New Product
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="w-[1180px] h-[800px] max-w-[95vw] max-h-[95vh] p-0 relative"
              style={{
                width: 'min(1180px, 95vw)',
                height: 'min(800px, 95vh)',
                maxWidth: '95vw',
                maxHeight: '95vh'
              }}
            >
              {/* Fixed Header */}
              <div className="absolute top-0 left-0 right-0 z-10 p-6 border-b bg-background">
                <DialogHeader className="space-y-2">
                  <DialogTitle className="text-2xl font-bold">Create New Product</DialogTitle>
                  <DialogDescription className="text-base">
                    Create a comprehensive product with detailed information, pricing, and specifications
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* Scrollable Content */}
              <div className="absolute top-[120px] left-0 right-0 bottom-[80px] overflow-y-auto p-6">
                <EnhancedCreateProductForm 
                  onSubmit={handleCreateProduct}
                  onCancel={() => setIsCreateDialogOpen(false)}
                />
              </div>

              {/* Fixed Footer */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-6 border-t bg-background">
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
            </DialogContent>
          </Dialog>
          <Link href="/products/create">
            <Button size="lg" variant="outline">
              <Plus className="h-5 w-5 mr-2" />
              Advanced Create
            </Button>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

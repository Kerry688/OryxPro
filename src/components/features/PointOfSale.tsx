'use client';

import { useState } from 'react';
import Image from 'next/image';
import { products, type Product } from '@/lib/data';
import { getImagePlaceholder } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle, MinusCircle, XCircle, ShoppingCart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type CartItem = {
  product: Product;
  quantity: number;
};

export default function PointOfSale() {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addToCart = (product: Product) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...currentCart, { product, quantity: 1 }];
    });
    toast({
        title: `${product.name} added to cart`,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCart((currentCart) => {
      if (newQuantity <= 0) {
        return currentCart.filter((item) => item.product.id !== productId);
      }
      return currentCart.map((item) =>
        item.product.id === productId ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((currentCart) => currentCart.filter((item) => item.product.id !== productId));
  };

  const subtotal = cart.reduce((acc, item) => acc + item.product.basePrice * item.quantity, 0);
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + tax;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCheckout = () => {
    if (cart.length === 0) {
        toast({
            variant: "destructive",
            title: "Cart is empty",
            description: "Please add products to your cart before checking out.",
        });
        return;
    }
    toast({
        title: "Checkout Successful!",
        description: `Total: ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}`,
    });
    setCart([]);
  }

  return (
    <div className="grid md:grid-cols-3 gap-8 h-[calc(100vh-10rem)]">
      <div className="md:col-span-2 flex flex-col">
        <h1 className="text-3xl font-headline font-bold mb-4">Point of Sale</h1>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <ScrollArea className="flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pr-4">
                {filteredProducts.map((product) => {
                const image = getImagePlaceholder(product.imageId);
                return (
                    <Card
                    key={product.id}
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => addToCart(product)}
                    >
                    <CardContent className="p-0">
                        <div className="relative aspect-square">
                        <Image
                            src={image.imageUrl}
                            alt={product.name}
                            fill
                            className="object-cover rounded-t-lg"
                            data-ai-hint={image.imageHint}
                        />
                        </div>
                        <div className="p-2 text-center">
                        <p className="font-semibold text-sm truncate">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(product.basePrice)}
                        </p>
                        </div>
                    </CardContent>
                    </Card>
                );
                })}
            </div>
        </ScrollArea>
      </div>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <ShoppingCart /> Cart
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          <ScrollArea className="flex-grow -mx-6 px-6">
            {cart.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Your cart is empty.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-4">
                    <div className="flex-grow">
                      <p className="font-semibold">{item.product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.product.basePrice)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <MinusCircle className="h-4 w-4" />
                        </Button>
                        <span>{item.quantity}</span>
                         <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <PlusCircle className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                        <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          {cart.length > 0 && (
            <div className="mt-auto pt-6">
                <Separator className="mb-4" />
                <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                        <span>Taxes (8%)</span>
                        <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tax)}</span>
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(total)}</span>
                </div>
                <Button size="lg" className="w-full mt-4" onClick={handleCheckout}>
                    Checkout
                </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

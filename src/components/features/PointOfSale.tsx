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
import {
  PlusCircle,
  MinusCircle,
  XCircle,
  ShoppingCart,
  Star,
  Scissors,
  Send,
  Printer,
  Info,
  Camera,
  Menu,
  Search,
  History,
  Heart,
  List,
  Save,
  X,
  Plus,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

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
      const existingItem = currentCart.find(
        (item) => item.product.id === product.id
      );
      if (existingItem) {
        return currentCart.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentCart, { product, quantity: 1 }];
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
    setCart((currentCart) =>
      currentCart.filter((item) => item.product.id !== productId)
    );
  };

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.basePrice * item.quantity,
    0
  );
  const discount = 0; // Placeholder
  const additional = 0; // Placeholder
  const totalBeforeDiscount = subtotal;
  const totalAfterDiscount = totalBeforeDiscount - discount + additional;
  const deposit = 0; // Placeholder
  const change = deposit - totalAfterDiscount;

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-background text-foreground text-sm">
      <header className="flex-shrink-0 border-b">
        <Tabs defaultValue="sales-bill" className="bg-card">
          <TabsList className="h-10 rounded-none border-b bg-transparent p-0">
            <TabsTrigger
              value="home"
              className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Home
            </TabsTrigger>
            <TabsTrigger
              value="sales-bill"
              className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
            >
              Sales Bill
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="p-2 bg-card border-b">
          <div className="flex justify-between items-center">
            <Tabs defaultValue="bill-details">
                <TabsList className="h-8 p-0.5">
                    <TabsTrigger value="all-bills" className="px-3 py-1 text-xs">All Bills</TabsTrigger>
                    <TabsTrigger value="bill-details" className="px-3 py-1 text-xs">Bill Details</TabsTrigger>
                </TabsList>
            </Tabs>
            <div className="flex items-center gap-1">
              {[Star, Scissors, Send, Printer, Info, Camera, Menu].map(
                (Icon, i) => (
                  <Button
                    key={i}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                )
              )}
              <Button variant="outline" className="h-8 text-xs">
                Open Drawer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-grow min-h-0">
        <main className="flex-grow flex flex-col p-2">
          {/* Bill Info */}
          <div className="flex-shrink-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
            <div className="space-y-1">
              <Label htmlFor="billcode">Billcode</Label>
              <Input id="billcode" className="h-8" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="customer">Customer</Label>
              <Input id="customer" className="h-8" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="shooting-date">Shooting Date</Label>
              <Input id="shooting-date" type="date" className="h-8" defaultValue="2025-09-15"/>
            </div>
            <div className="space-y-1">
              <Label htmlFor="deliver-date">Deliver Date</Label>
              <Input id="deliver-date" type="date" className="h-8" defaultValue="2025-09-15"/>
            </div>
          </div>

          {/* Items Table */}
          <div className="flex-grow flex flex-col border rounded-md bg-card">
            <Tabs defaultValue="items" className="flex-grow flex flex-col">
              <TabsList className="px-2 border-b rounded-none bg-transparent justify-start">
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="deposits">Deposits</TabsTrigger>
                <TabsTrigger value="flash-memory">Flash Memory</TabsTrigger>
                <TabsTrigger value="modifications">Modifications</TabsTrigger>
              </TabsList>
              <TabsContent value="items" className="flex-grow mt-0">
                <ScrollArea className="h-full">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[50px]">#</TableHead>
                        <TableHead>Item</TableHead>
                        <TableHead className="w-[100px]">Qty</TableHead>
                        <TableHead className="w-[120px]">Price</TableHead>
                        <TableHead className="w-[120px]">Total</TableHead>
                        <TableHead className="w-[50px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {cart.map((item, index) => (
                        <TableRow key={item.product.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>{item.product.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                                  <MinusCircle className="h-3 w-3" />
                              </Button>
                              <span>{item.quantity}</span>
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                                  <PlusCircle className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{item.product.basePrice.toFixed(2)}</TableCell>
                          <TableCell>{(item.product.basePrice * item.quantity).toFixed(2)}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeFromCart(item.product.id)}>
                                <XCircle className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {cart.length === 0 && <p className="text-center p-4 text-muted-foreground">No items added.</p>}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
          <div className="flex-shrink-0 flex justify-between items-center p-2 mt-2 border rounded-md bg-card">
            <div className="flex items-center space-x-2">
                <Checkbox id="express-order" />
                <Label htmlFor="express-order">Express Order</Label>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button size="sm"><Save className="mr-2 h-4 w-4"/>Save</Button>
            </div>
          </div>
        </main>

        <aside className="w-80 flex-shrink-0 border-l flex flex-col bg-card">
            <div className="p-2 border-b">
                 <div className="flex items-center gap-2">
                    <Input
                        placeholder="Search Item"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="h-8"
                    />
                    <Button variant="ghost" size="icon" className="h-8 w-8"><Plus/></Button>
                 </div>
                 <div className="flex items-center gap-2 mt-2">
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-7"><History className="h-3 w-3 mr-1"/>Top 20</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-7"><Heart className="h-3 w-3 mr-1"/>Favourite</Button>
                    <Button variant="outline" size="sm" className="flex-1 text-xs h-7"><List className="h-3 w-3 mr-1"/>All</Button>
                 </div>
            </div>
          <ScrollArea className="flex-grow">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredProducts.map((product) => (
                        <TableRow key={product.id} className="cursor-pointer" onClick={() => addToCart(product)}>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="text-right">{product.basePrice.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
          </ScrollArea>
           <div className="p-2 border-t mt-auto">
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span>Total Before Dis</span>
                        <span>{totalBeforeDiscount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Discount</span>
                        <span>{discount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Additional</span>
                        <span>{additional.toFixed(2)}</span>
                    </div>
                    <Separator className="my-1" />
                     <div className="flex justify-between font-bold">
                        <span>Total After Dis</span>
                        <span>{totalAfterDiscount.toFixed(2)}</span>
                    </div>
                     <div className="flex justify-between">
                        <span>Deposit</span>
                        <Input className="h-7 w-24 text-right" type="number" defaultValue="0.00" />
                    </div>
                     <div className="flex justify-between">
                        <span>Change</span>
                        <span className="font-bold text-lg">{change.toFixed(2)}</span>
                    </div>
                </div>
                 <Button className="w-full mt-2" size="sm">Post Bill (F3)</Button>
            </div>
        </aside>
      </div>
    </div>
  );
}

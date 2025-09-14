'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { sampleOrders, type Order } from '@/lib/data';
import OrderStatusTracker from '@/components/features/OrderStatusTracker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setFoundOrder(null);

    // Simulate API call
    setTimeout(() => {
      const order = sampleOrders.find((o) => o.id.toLowerCase() === orderId.toLowerCase());
      if (order) {
        setFoundOrder(order);
      } else {
        setError(`Order with ID "${orderId}" not found. Please check the ID and try again.`);
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 md:px-6 py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-headline">Track Your Order</CardTitle>
          <CardDescription>Enter your order ID to see the latest status of your print job.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTrackOrder} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-id">Order ID</Label>
              <Input
                id="order-id"
                placeholder="e.g., PP-12345"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Track Order'}
            </Button>
          </form>

          {error && (
            <Alert variant="destructive" className="mt-6">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

        </CardContent>
      </Card>

      {foundOrder && (
        <div className="mt-8">
            <OrderStatusTracker order={foundOrder} />
        </div>
      )}
    </div>
  );
}

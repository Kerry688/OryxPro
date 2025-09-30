'use client';

import { CheckCircle, Circle, CircleDot, Truck } from 'lucide-react';
import type { Order, LegacyOrderStatus } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { cn } from '@/lib/utils';
import { Separator } from '../ui/separator';

type OrderStatusTrackerProps = {
  order: Order;
};

// Define the order statuses array locally since it's not exported from data.ts
const orderStatuses: LegacyOrderStatus[] = [
  'Order Confirmed',
  'In Production', 
  'Shipped',
  'Delivered'
];

const statusIcons: Record<LegacyOrderStatus, JSX.Element> = {
    'Order Confirmed': <CheckCircle />,
    'In Production': <CircleDot />,
    'Shipped': <Truck />,
    'Delivered': <CheckCircle />,
}

export default function OrderStatusTracker({ order }: OrderStatusTrackerProps) {
  const currentStatusIndex = orderStatuses.indexOf(order.status);

  return (
    <Card className="w-full">
        <CardHeader>
            <CardTitle>Order Status for #{order.id}</CardTitle>
            <CardDescription>
                Hi {order.customerName}, here is the current status of your order.
                Estimated delivery: {order.estimatedDelivery}.
            </CardDescription>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between items-center">
                {orderStatuses.map((status, index) => {
                    const isCompleted = index < currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;

                    return (
                        <div key={status} className="flex-1 flex flex-col items-center relative">
                            <div className={cn(
                                "h-10 w-10 rounded-full flex items-center justify-center border-2 z-10",
                                isCompleted ? "bg-primary border-primary text-primary-foreground" : "bg-card",
                                isCurrent ? "border-primary text-primary" : "border-muted-foreground",
                            )}>
                                {isCompleted ? <CheckCircle /> : statusIcons[status] ? statusIcons[status] : <Circle />}
                            </div>
                            <p className={cn(
                                "text-xs md:text-sm text-center mt-2",
                                isCurrent && "font-bold text-primary"
                            )}>
                                {status}
                            </p>
                            {index < orderStatuses.length - 1 && (
                                <div className="absolute top-5 left-1/2 w-full h-0.5 bg-muted-foreground">
                                    <div 
                                        className="absolute top-0 left-0 h-full bg-primary"
                                        style={{ width: isCompleted ? '100%' : isCurrent ? '50%' : '0%'}}
                                    ></div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <Separator className="my-6" />
            <div>
                <h3 className="font-semibold mb-2">Order Summary</h3>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    {order.items.map((item, index) => (
                        <li key={index} className="flex justify-between">
                            <span>{item.productName}</span>
                            <span>Qty: {item.quantity}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </CardContent>
    </Card>
  );
}

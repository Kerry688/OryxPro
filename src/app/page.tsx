import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Package, Palette } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { products } from '@/lib/data';
import { ProductCard } from '@/components/features/ProductCard';
import { getImagePlaceholder } from '@/lib/placeholder-images';

export default function Home() {
  const featuredProducts = products.slice(0, 3);
  const heroImage = getImagePlaceholder('hero');

  const howItWorksSteps = [
    {
      icon: <Package className="h-10 w-10 text-primary" />,
      title: 'Choose Your Product',
      description: 'Browse our catalog of high-quality printing products and find what you need.',
    },
    {
      icon: <Palette className="h-10 w-10 text-primary" />,
      title: 'Customize & Design',
      description: 'Personalize your item with our easy-to-use options and upload your own design.',
    },
    {
      icon: <CheckCircle className="h-10 w-10 text-primary" />,
      title: 'Approve & Order',
      description: 'Review your creation, get an instant quote, and place your order securely.',
    },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative w-full py-20 md:py-32 lg:py-40 bg-card">
        <div className="container mx-auto px-4 md:px-6 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight text-primary-foreground-on-card">
              Quality Printing, <br />
              <span className="text-primary">Perfectly Delivered.</span>
            </h1>
            <p className="max-w-xl mx-auto md:mx-0 text-lg md:text-xl text-muted-foreground-on-card">
              From business cards to banners, PrintPoint is your trusted partner for all your printing needs. Get instant quotes, upload your designs, and track your order with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                <Link href="/products">
                  Explore Products <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/track-order">
                  Track Your Order
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-auto md:aspect-[4/3] rounded-lg overflow-hidden shadow-2xl">
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          </div>
        </div>
      </section>

      <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight">How It Works</h2>
            <p className="max-w-2xl text-muted-foreground md:text-xl">
              Ordering your custom prints is as easy as 1-2-3.
            </p>
          </div>
          <div className="mx-auto grid items-start gap-10 sm:grid-cols-2 md:grid-cols-3">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="relative flex flex-col items-center text-center gap-4 p-6 rounded-lg bg-card shadow-md transition-transform hover:scale-105">
                <div className="absolute -top-6 bg-background p-2 rounded-full border">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold mt-8">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="featured-products" className="w-full py-16 md:py-24 lg:py-32 bg-card">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-headline font-semibold tracking-tight">Featured Products</h2>
            <p className="max-w-2xl text-muted-foreground md:text-xl">
              Discover our most popular printing solutions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Button asChild size="lg" variant="link" className="text-primary text-lg">
              <Link href="/products">
                View All Products <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

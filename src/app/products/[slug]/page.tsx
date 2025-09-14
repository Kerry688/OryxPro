import { notFound } from 'next/navigation';
import Image from 'next/image';

import { products } from '@/lib/data';
import { getImagePlaceholder } from '@/lib/placeholder-images';
import { ProductCustomizer } from '@/components/features/ProductCustomizer';

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
        <ProductCustomizer product={product} initialImage={image} />
    </div>
  );
}

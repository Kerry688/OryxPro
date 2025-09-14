export type CustomizationChoice = {
  id: string;
  name: string;
  priceModifier: number; // can be positive or negative
};

export type CustomizationOption = {
  id: string;
  name: string;
  type: 'select' | 'quantity';
  defaultValue: string | number;
  choices?: CustomizationChoice[];
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription: string;
  imageId: string;
  basePrice: number; // Price for a single unit with default options
  options: CustomizationOption[];
};

export const products: Product[] = [
  {
    id: 'prod_001',
    slug: 'business-cards',
    name: 'Business Cards',
    description: 'Premium business cards to make a lasting impression.',
    longDescription:
      'Our business cards are printed on high-quality cardstock with a variety of finishes available. Perfect for networking and professional branding, they offer a crisp, clean look that stands out.',
    imageId: 'business-card',
    basePrice: 0.25,
    options: [
      {
        id: 'paper_type',
        name: 'Paper Type',
        type: 'select',
        defaultValue: 'standard_matte',
        choices: [
          { id: 'standard_matte', name: 'Standard Matte', priceModifier: 0 },
          { id: 'premium_glossy', name: 'Premium Glossy', priceModifier: 0.05 },
          { id: 'recycled_paper', name: 'Recycled Paper', priceModifier: 0.02 },
        ],
      },
      {
        id: 'corners',
        name: 'Corners',
        type: 'select',
        defaultValue: 'square',
        choices: [
            { id: 'square', name: 'Square', priceModifier: 0 },
            { id: 'rounded', name: 'Rounded', priceModifier: 0.03 },
        ]
      },
      {
        id: 'quantity',
        name: 'Quantity',
        type: 'quantity',
        defaultValue: 100,
      },
    ],
  },
  {
    id: 'prod_002',
    slug: 'flyers',
    name: 'Promotional Flyers',
    description: 'Vibrant flyers to promote your event or business.',
    longDescription:
      'Get the word out with our full-color flyers. Available in multiple sizes and paper options, they are perfect for handouts, mailers, and promotional events. High-resolution printing ensures your message is seen.',
    imageId: 'flyer',
    basePrice: 0.4,
    options: [
      {
        id: 'size',
        name: 'Size',
        type: 'select',
        defaultValue: 'a5',
        choices: [
          { id: 'a5', name: 'A5 (5.8 x 8.3 in)', priceModifier: 0 },
          { id: 'a4', name: 'A4 (8.3 x 11.7 in)', priceModifier: 0.15 },
          { id: 'letter', name: 'Letter (8.5 x 11 in)', priceModifier: 0.15 },
        ],
      },
      {
        id: 'paper_weight',
        name: 'Paper Weight',
        type: 'select',
        defaultValue: '130gsm',
        choices: [
            { id: '130gsm', name: '130gsm', priceModifier: 0 },
            { id: '170gsm', name: '170gsm', priceModifier: 0.05 },
        ]
      },
      {
        id: 'quantity',
        name: 'Quantity',
        type: 'quantity',
        defaultValue: 100,
      },
    ],
  },
  {
    id: 'prod_003',
    slug: 'banners',
    name: 'Vinyl Banners',
    description: 'Durable, high-quality banners for indoor or outdoor use.',
    longDescription:
      'Make a big statement with our durable vinyl banners. Weather-resistant and printed with UV-cured inks, they are ideal for storefronts, trade shows, and outdoor events. Grommets and reinforced edges included.',
    imageId: 'banner',
    basePrice: 25.0,
    options: [
      {
        id: 'size',
        name: 'Size (ft)',
        type: 'select',
        defaultValue: '2x4',
        choices: [
          { id: '2x4', name: '2ft x 4ft', priceModifier: 0 },
          { id: '3x6', name: '3ft x 6ft', priceModifier: 15.0 },
          { id: '4x8', name: '4ft x 8ft', priceModifier: 30.0 },
        ],
      },
      {
        id: 'quantity',
        name: 'Quantity',
        type: 'quantity',
        defaultValue: 1,
      },
    ],
  },
  {
    id: 'prod_004',
    slug: 'posters',
    name: 'Posters',
    description: 'Bright and colorful posters to grab attention.',
    longDescription: 'Our posters are printed on high-quality paper with a satin finish, ensuring your graphics look their best. Perfect for events, advertisements, or decoration.',
    imageId: 'poster',
    basePrice: 5.0,
    options: [
        {
            id: 'size',
            name: 'Size',
            type: 'select',
            defaultValue: '18x24',
            choices: [
                { id: '12x18', name: '12x18 inches', priceModifier: -1.0 },
                { id: '18x24', name: '18x24 inches', priceModifier: 0 },
                { id: '24x36', name: '24x36 inches', priceModifier: 4.0 },
            ],
        },
        {
            id: 'quantity',
            name: 'Quantity',
            type: 'quantity',
            defaultValue: 10,
        },
    ],
  },
];

export type OrderStatus = 'Order Confirmed' | 'In Production' | 'Shipped' | 'Delivered';

export const orderStatuses: OrderStatus[] = ['Order Confirmed', 'In Production', 'Shipped', 'Delivered'];

export type Order = {
    id: string;
    customerName: string;
    status: OrderStatus;
    items: {
        productName: string;
        quantity: number;
    }[];
    estimatedDelivery: string;
}

export const sampleOrders: Order[] = [
    {
        id: 'PP-12345',
        customerName: 'John Doe',
        status: 'In Production',
        items: [
            { productName: 'Business Cards', quantity: 250 },
            { productName: 'Promotional Flyers', quantity: 500 },
        ],
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
    },
    {
        id: 'PP-67890',
        customerName: 'Jane Smith',
        status: 'Delivered',
        items: [
            { productName: 'Vinyl Banners', quantity: 2 },
        ],
        estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toDateString(),
    }
]

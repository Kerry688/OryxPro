import { ProductCategory } from '@/lib/data';

// Demo Photography Categories Data
export const photographyCategories: Omit<ProductCategory, 'children'>[] = [
  // Root Categories
  {
    id: 'photo_cat_001',
    name: 'Cameras',
    description: 'Digital cameras for photography and videography',
    slug: 'cameras',
    isActive: true,
    sortOrder: 1,
    level: 0,
    path: 'Cameras',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_002',
    name: 'Lenses',
    description: 'Camera lenses for different photography needs',
    slug: 'lenses',
    isActive: true,
    sortOrder: 2,
    level: 0,
    path: 'Lenses',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_003',
    name: 'Lighting',
    description: 'Professional lighting equipment for photography',
    slug: 'lighting',
    isActive: true,
    sortOrder: 3,
    level: 0,
    path: 'Lighting',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_004',
    name: 'Support Systems',
    description: 'Tripods, monopods, and camera support equipment',
    slug: 'support-systems',
    isActive: true,
    sortOrder: 4,
    level: 0,
    path: 'Support Systems',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_005',
    name: 'Storage & Memory',
    description: 'Memory cards, storage devices, and data management',
    slug: 'storage-memory',
    isActive: true,
    sortOrder: 5,
    level: 0,
    path: 'Storage & Memory',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_006',
    name: 'Accessories',
    description: 'Camera bags, straps, filters, and photography accessories',
    slug: 'accessories',
    isActive: true,
    sortOrder: 6,
    level: 0,
    path: 'Accessories',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_007',
    name: 'Video Equipment',
    description: 'Professional video cameras and recording equipment',
    slug: 'video-equipment',
    isActive: true,
    sortOrder: 7,
    level: 0,
    path: 'Video Equipment',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Camera Subcategories
  {
    id: 'photo_cat_008',
    name: 'DSLR Cameras',
    description: 'Digital Single-Lens Reflex cameras for professional photography',
    slug: 'dslr-cameras',
    parentId: 'photo_cat_001',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Cameras > DSLR Cameras',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_009',
    name: 'Mirrorless Cameras',
    description: 'Compact mirrorless cameras with interchangeable lenses',
    slug: 'mirrorless-cameras',
    parentId: 'photo_cat_001',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Cameras > Mirrorless Cameras',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_010',
    name: 'Medium Format Cameras',
    description: 'High-resolution medium format cameras for professional work',
    slug: 'medium-format-cameras',
    parentId: 'photo_cat_001',
    isActive: true,
    sortOrder: 3,
    level: 1,
    path: 'Cameras > Medium Format Cameras',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_011',
    name: 'Point & Shoot Cameras',
    description: 'Compact cameras for everyday photography',
    slug: 'point-shoot-cameras',
    parentId: 'photo_cat_001',
    isActive: true,
    sortOrder: 4,
    level: 1,
    path: 'Cameras > Point & Shoot Cameras',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Lens Subcategories
  {
    id: 'photo_cat_012',
    name: 'Prime Lenses',
    description: 'Fixed focal length lenses for sharp, high-quality images',
    slug: 'prime-lenses',
    parentId: 'photo_cat_002',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Lenses > Prime Lenses',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_013',
    name: 'Zoom Lenses',
    description: 'Variable focal length lenses for versatile photography',
    slug: 'zoom-lenses',
    parentId: 'photo_cat_002',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Lenses > Zoom Lenses',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_014',
    name: 'Macro Lenses',
    description: 'Specialized lenses for close-up and macro photography',
    slug: 'macro-lenses',
    parentId: 'photo_cat_002',
    isActive: true,
    sortOrder: 3,
    level: 1,
    path: 'Lenses > Macro Lenses',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_015',
    name: 'Telephoto Lenses',
    description: 'Long focal length lenses for wildlife and sports photography',
    slug: 'telephoto-lenses',
    parentId: 'photo_cat_002',
    isActive: true,
    sortOrder: 4,
    level: 1,
    path: 'Lenses > Telephoto Lenses',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Lighting Subcategories
  {
    id: 'photo_cat_016',
    name: 'Studio Lights',
    description: 'Professional studio lighting equipment',
    slug: 'studio-lights',
    parentId: 'photo_cat_003',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Lighting > Studio Lights',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_017',
    name: 'Flash Units',
    description: 'On-camera and off-camera flash units',
    slug: 'flash-units',
    parentId: 'photo_cat_003',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Lighting > Flash Units',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_018',
    name: 'Light Modifiers',
    description: 'Softboxes, umbrellas, and other light-shaping tools',
    slug: 'light-modifiers',
    parentId: 'photo_cat_003',
    isActive: true,
    sortOrder: 3,
    level: 1,
    path: 'Lighting > Light Modifiers',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Support Systems Subcategories
  {
    id: 'photo_cat_019',
    name: 'Tripods',
    description: 'Camera tripods for stable shooting',
    slug: 'tripods',
    parentId: 'photo_cat_004',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Support Systems > Tripods',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_020',
    name: 'Monopods',
    description: 'Single-legged camera support for mobility',
    slug: 'monopods',
    parentId: 'photo_cat_004',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Support Systems > Monopods',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_021',
    name: 'Tripod Heads',
    description: 'Ball heads, pan-tilt heads, and other mounting systems',
    slug: 'tripod-heads',
    parentId: 'photo_cat_004',
    isActive: true,
    sortOrder: 3,
    level: 1,
    path: 'Support Systems > Tripod Heads',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Storage & Memory Subcategories
  {
    id: 'photo_cat_022',
    name: 'Memory Cards',
    description: 'SD cards, CF cards, and other storage media',
    slug: 'memory-cards',
    parentId: 'photo_cat_005',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Storage & Memory > Memory Cards',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_023',
    name: 'Card Readers',
    description: 'USB card readers for data transfer',
    slug: 'card-readers',
    parentId: 'photo_cat_005',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Storage & Memory > Card Readers',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_024',
    name: 'External Storage',
    description: 'Portable hard drives and SSDs for backup',
    slug: 'external-storage',
    parentId: 'photo_cat_005',
    isActive: true,
    sortOrder: 3,
    level: 1,
    path: 'Storage & Memory > External Storage',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Accessories Subcategories
  {
    id: 'photo_cat_025',
    name: 'Camera Bags',
    description: 'Professional camera bags and cases',
    slug: 'camera-bags',
    parentId: 'photo_cat_006',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Accessories > Camera Bags',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_026',
    name: 'Camera Straps',
    description: 'Neck straps, wrist straps, and harness systems',
    slug: 'camera-straps',
    parentId: 'photo_cat_006',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Accessories > Camera Straps',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_027',
    name: 'Filters',
    description: 'UV filters, polarizing filters, and ND filters',
    slug: 'filters',
    parentId: 'photo_cat_006',
    isActive: true,
    sortOrder: 3,
    level: 1,
    path: 'Accessories > Filters',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_028',
    name: 'Cleaning Kits',
    description: 'Camera and lens cleaning supplies',
    slug: 'cleaning-kits',
    parentId: 'photo_cat_006',
    isActive: true,
    sortOrder: 4,
    level: 1,
    path: 'Accessories > Cleaning Kits',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },

  // Video Equipment Subcategories
  {
    id: 'photo_cat_029',
    name: 'Video Cameras',
    description: 'Professional video cameras and camcorders',
    slug: 'video-cameras',
    parentId: 'photo_cat_007',
    isActive: true,
    sortOrder: 1,
    level: 1,
    path: 'Video Equipment > Video Cameras',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'photo_cat_030',
    name: 'Video Accessories',
    description: 'Microphones, monitors, and video recording accessories',
    slug: 'video-accessories',
    parentId: 'photo_cat_007',
    isActive: true,
    sortOrder: 2,
    level: 1,
    path: 'Video Equipment > Video Accessories',
    productCount: 0,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Helper functions
export const getPhotographyCategoriesByLevel = (level: number) => {
  return photographyCategories.filter(category => category.level === level);
};

export const getPhotographyCategoriesByParent = (parentId: string) => {
  return photographyCategories.filter(category => category.parentId === parentId);
};

export const getPhotographyCategoryTree = () => {
  const categoryMap = new Map<string, any>();
  const rootCategories: any[] = [];

  // Initialize all categories
  photographyCategories.forEach(category => {
    categoryMap.set(category.id, { ...category, children: [] });
  });

  // Build the tree structure
  photographyCategories.forEach(category => {
    const categoryWithChildren = categoryMap.get(category.id)!;
    
    if (category.parentId) {
      const parent = categoryMap.get(category.parentId);
      if (parent) {
        parent.children.push(categoryWithChildren);
      }
    } else {
      rootCategories.push(categoryWithChildren);
    }
  });

  return rootCategories;
};

import { Brand } from '@/lib/models/brand';

// Demo Photography Brands Data
export const photographyBrands: Omit<Brand, '_id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'updatedBy'>[] = [
  // Camera Brands
  {
    name: 'Canon',
    code: 'CANON',
    description: 'Leading manufacturer of cameras, lenses, and imaging equipment. Known for DSLR and mirrorless cameras.',
    website: 'https://www.canon.com',
    email: 'info@canon.com',
    phone: '+1-800-385-2155',
    address: {
      street: 'One Canon Park',
      city: 'Melville',
      state: 'NY',
      zipCode: '11747',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1937,
    countryOfOrigin: 'Japan',
    certifications: ['ISO 9001', 'ISO 14001'],
    socialMedia: {
      facebook: 'https://facebook.com/CanonUSA',
      instagram: 'https://instagram.com/canonusa',
      twitter: 'https://twitter.com/CanonUSA',
      youtube: 'https://youtube.com/CanonUSA'
    },
    contactPerson: {
      name: 'John Smith',
      email: 'john.smith@canon.com',
      phone: '+1-800-385-2155',
      position: 'Sales Manager'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: '1 year manufacturer warranty',
      minimumOrder: 1000
    },
    isActive: true
  },
  {
    name: 'Nikon',
    code: 'NIKON',
    description: 'Japanese multinational corporation specializing in optics and imaging products. Famous for DSLR cameras and lenses.',
    website: 'https://www.nikon.com',
    email: 'info@nikon.com',
    phone: '+1-800-645-6687',
    address: {
      street: '1300 Walt Whitman Road',
      city: 'Melville',
      state: 'NY',
      zipCode: '11747',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1917,
    countryOfOrigin: 'Japan',
    certifications: ['ISO 9001', 'ISO 14001', 'CE'],
    socialMedia: {
      facebook: 'https://facebook.com/NikonUSA',
      instagram: 'https://instagram.com/nikonusa',
      twitter: 'https://twitter.com/NikonUSA',
      youtube: 'https://youtube.com/NikonUSA'
    },
    contactPerson: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@nikon.com',
      phone: '+1-800-645-6687',
      position: 'Account Manager'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '45 days return policy',
      warrantyTerms: '2 year manufacturer warranty',
      minimumOrder: 1500
    },
    isActive: true
  },
  {
    name: 'Sony',
    code: 'SONY',
    description: 'Global technology company known for mirrorless cameras, professional video equipment, and imaging sensors.',
    website: 'https://www.sony.com',
    email: 'info@sony.com',
    phone: '+1-800-222-7669',
    address: {
      street: '16530 Via Esprillo',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92127',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1946,
    countryOfOrigin: 'Japan',
    certifications: ['ISO 9001', 'ISO 14001', 'RoHS'],
    socialMedia: {
      facebook: 'https://facebook.com/SonyElectronics',
      instagram: 'https://instagram.com/sonyalpha',
      twitter: 'https://twitter.com/SonyElectronics',
      youtube: 'https://youtube.com/SonyElectronics'
    },
    contactPerson: {
      name: 'Michael Chen',
      email: 'michael.chen@sony.com',
      phone: '+1-800-222-7669',
      position: 'Regional Sales Director'
    },
    terms: {
      paymentTerms: 'Net 45',
      returnPolicy: '30 days return policy',
      warrantyTerms: '1 year manufacturer warranty',
      minimumOrder: 2000
    },
    isActive: true
  },
  {
    name: 'Fujifilm',
    code: 'FUJI',
    description: 'Japanese multinational photography and imaging company. Known for medium format cameras and film simulation.',
    website: 'https://www.fujifilm.com',
    email: 'info@fujifilm.com',
    phone: '+1-800-800-3854',
    address: {
      street: '200 Summit Lake Drive',
      city: 'Valhalla',
      state: 'NY',
      zipCode: '10595',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1934,
    countryOfOrigin: 'Japan',
    certifications: ['ISO 9001', 'ISO 14001'],
    socialMedia: {
      facebook: 'https://facebook.com/FujifilmNorthAmerica',
      instagram: 'https://instagram.com/fujifilm_northamerica',
      twitter: 'https://twitter.com/Fujifilm_NA',
      youtube: 'https://youtube.com/FujifilmNorthAmerica'
    },
    contactPerson: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@fujifilm.com',
      phone: '+1-800-800-3854',
      position: 'Product Manager'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: '1 year manufacturer warranty',
      minimumOrder: 1200
    },
    isActive: true
  },

  // Lens Brands
  {
    name: 'Sigma',
    code: 'SIGMA',
    description: 'Japanese company specializing in camera lenses, flashes, and other photography accessories.',
    website: 'https://www.sigma-global.com',
    email: 'info@sigma-global.com',
    phone: '+1-631-585-1144',
    address: {
      street: '15 Fleetwood Court',
      city: 'Ronkonkoma',
      state: 'NY',
      zipCode: '11779',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1961,
    countryOfOrigin: 'Japan',
    certifications: ['ISO 9001'],
    socialMedia: {
      facebook: 'https://facebook.com/SigmaCorporation',
      instagram: 'https://instagram.com/sigma_corporation',
      twitter: 'https://twitter.com/SigmaCorp',
      youtube: 'https://youtube.com/SigmaCorporation'
    },
    contactPerson: {
      name: 'David Kim',
      email: 'david.kim@sigma-global.com',
      phone: '+1-631-585-1144',
      position: 'Sales Representative'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '45 days return policy',
      warrantyTerms: '3 year manufacturer warranty',
      minimumOrder: 800
    },
    isActive: true
  },
  {
    name: 'Tamron',
    code: 'TAMRON',
    description: 'Japanese optical equipment manufacturer specializing in camera lenses and optical components.',
    website: 'https://www.tamron.com',
    email: 'info@tamron.com',
    phone: '+1-631-858-8400',
    address: {
      street: '89 Corporate Drive',
      city: 'Hauppauge',
      state: 'NY',
      zipCode: '11788',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1950,
    countryOfOrigin: 'Japan',
    certifications: ['ISO 9001', 'ISO 14001'],
    socialMedia: {
      facebook: 'https://facebook.com/TamronUSA',
      instagram: 'https://instagram.com/tamronusa',
      twitter: 'https://twitter.com/TamronUSA',
      youtube: 'https://youtube.com/TamronUSA'
    },
    contactPerson: {
      name: 'Lisa Wang',
      email: 'lisa.wang@tamron.com',
      phone: '+1-631-858-8400',
      position: 'Marketing Manager'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: '6 year manufacturer warranty',
      minimumOrder: 1000
    },
    isActive: true
  },

  // Lighting Brands
  {
    name: 'Profoto',
    code: 'PROFOTO',
    description: 'Swedish manufacturer of professional lighting equipment for photography. Known for studio lights and modifiers.',
    website: 'https://www.profoto.com',
    email: 'info@profoto.com',
    phone: '+1-516-328-9000',
    address: {
      street: '1234 Main Street',
      city: 'Hempstead',
      state: 'NY',
      zipCode: '11550',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1968,
    countryOfOrigin: 'Sweden',
    certifications: ['CE', 'FCC'],
    socialMedia: {
      facebook: 'https://facebook.com/Profoto',
      instagram: 'https://instagram.com/profoto',
      twitter: 'https://twitter.com/Profoto',
      youtube: 'https://youtube.com/Profoto'
    },
    contactPerson: {
      name: 'Robert Anderson',
      email: 'robert.anderson@profoto.com',
      phone: '+1-516-328-9000',
      position: 'Sales Director'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '14 days return policy',
      warrantyTerms: '2 year manufacturer warranty',
      minimumOrder: 5000
    },
    isActive: true
  },
  {
    name: 'Godox',
    code: 'GODOX',
    description: 'Chinese manufacturer of photography lighting equipment, including studio lights, flashes, and modifiers.',
    website: 'https://www.godox.com',
    email: 'info@godox.com',
    phone: '+1-323-999-1234',
    address: {
      street: '456 Business Ave',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1993,
    countryOfOrigin: 'China',
    certifications: ['CE', 'FCC', 'RoHS'],
    socialMedia: {
      facebook: 'https://facebook.com/Godox',
      instagram: 'https://instagram.com/godox',
      twitter: 'https://twitter.com/Godox',
      youtube: 'https://youtube.com/Godox'
    },
    contactPerson: {
      name: 'Jennifer Liu',
      email: 'jennifer.liu@godox.com',
      phone: '+1-323-999-1234',
      position: 'Account Executive'
    },
    terms: {
      paymentTerms: 'Net 15',
      returnPolicy: '30 days return policy',
      warrantyTerms: '1 year manufacturer warranty',
      minimumOrder: 2000
    },
    isActive: true
  },

  // Tripod & Support Brands
  {
    name: 'Manfrotto',
    code: 'MANFROTTO',
    description: 'Italian manufacturer of professional camera support systems, including tripods, heads, and lighting stands.',
    website: 'https://www.manfrotto.com',
    email: 'info@manfrotto.com',
    phone: '+1-201-818-9500',
    address: {
      street: '10 Industrial Avenue',
      city: 'Paramus',
      state: 'NJ',
      zipCode: '07652',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1974,
    countryOfOrigin: 'Italy',
    certifications: ['ISO 9001', 'CE'],
    socialMedia: {
      facebook: 'https://facebook.com/Manfrotto',
      instagram: 'https://instagram.com/manfrotto',
      twitter: 'https://twitter.com/Manfrotto',
      youtube: 'https://youtube.com/Manfrotto'
    },
    contactPerson: {
      name: 'Marco Rossi',
      email: 'marco.rossi@manfrotto.com',
      phone: '+1-201-818-9500',
      position: 'Sales Manager'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: '2 year manufacturer warranty',
      minimumOrder: 1500
    },
    isActive: true
  },
  {
    name: 'Gitzo',
    code: 'GITZO',
    description: 'French manufacturer of high-end carbon fiber tripods and camera support systems for professional photographers.',
    website: 'https://www.gitzo.com',
    email: 'info@gitzo.com',
    phone: '+1-201-818-9500',
    address: {
      street: '10 Industrial Avenue',
      city: 'Paramus',
      state: 'NJ',
      zipCode: '07652',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1917,
    countryOfOrigin: 'France',
    certifications: ['ISO 9001', 'CE'],
    socialMedia: {
      facebook: 'https://facebook.com/Gitzo',
      instagram: 'https://instagram.com/gitzo',
      twitter: 'https://twitter.com/Gitzo',
      youtube: 'https://youtube.com/Gitzo'
    },
    contactPerson: {
      name: 'Pierre Dubois',
      email: 'pierre.dubois@gitzo.com',
      phone: '+1-201-818-9500',
      position: 'Product Specialist'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: '5 year manufacturer warranty',
      minimumOrder: 3000
    },
    isActive: true
  },

  // Memory Card & Storage Brands
  {
    name: 'SanDisk',
    code: 'SANDISK',
    description: 'American manufacturer of flash memory products, including SD cards, CF cards, and portable storage devices.',
    website: 'https://www.sandisk.com',
    email: 'info@sandisk.com',
    phone: '+1-408-801-1000',
    address: {
      street: '951 SanDisk Drive',
      city: 'Milpitas',
      state: 'CA',
      zipCode: '95035',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1988,
    countryOfOrigin: 'USA',
    certifications: ['ISO 9001', 'ISO 14001', 'RoHS'],
    socialMedia: {
      facebook: 'https://facebook.com/SanDisk',
      instagram: 'https://instagram.com/sandisk',
      twitter: 'https://twitter.com/SanDisk',
      youtube: 'https://youtube.com/SanDisk'
    },
    contactPerson: {
      name: 'Alex Thompson',
      email: 'alex.thompson@sandisk.com',
      phone: '+1-408-801-1000',
      position: 'Channel Manager'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: 'Lifetime warranty',
      minimumOrder: 5000
    },
    isActive: true
  },
  {
    name: 'Lexar',
    code: 'LEXAR',
    description: 'American manufacturer of memory cards, card readers, and digital storage solutions for photographers.',
    website: 'https://www.lexar.com',
    email: 'info@lexar.com',
    phone: '+1-408-752-0200',
    address: {
      street: '47800 Westinghouse Drive',
      city: 'Fremont',
      state: 'CA',
      zipCode: '94539',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 1996,
    countryOfOrigin: 'USA',
    certifications: ['ISO 9001', 'RoHS'],
    socialMedia: {
      facebook: 'https://facebook.com/Lexar',
      instagram: 'https://instagram.com/lexar',
      twitter: 'https://twitter.com/Lexar',
      youtube: 'https://youtube.com/Lexar'
    },
    contactPerson: {
      name: 'Michelle Davis',
      email: 'michelle.davis@lexar.com',
      phone: '+1-408-752-0200',
      position: 'Sales Representative'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: 'Limited lifetime warranty',
      minimumOrder: 3000
    },
    isActive: true
  },

  // Accessories Brands
  {
    name: 'Peak Design',
    code: 'PEAK',
    description: 'American company designing and manufacturing camera bags, straps, and accessories for photographers.',
    website: 'https://www.peakdesign.com',
    email: 'info@peakdesign.com',
    phone: '+1-415-829-9740',
    address: {
      street: '500 Treat Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94110',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 2010,
    countryOfOrigin: 'USA',
    certifications: ['ISO 9001'],
    socialMedia: {
      facebook: 'https://facebook.com/PeakDesign',
      instagram: 'https://instagram.com/peakdesign',
      twitter: 'https://twitter.com/PeakDesign',
      youtube: 'https://youtube.com/PeakDesign'
    },
    contactPerson: {
      name: 'Tom Smith',
      email: 'tom.smith@peakdesign.com',
      phone: '+1-415-829-9740',
      position: 'Business Development'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: 'Limited lifetime warranty',
      minimumOrder: 1000
    },
    isActive: true
  },
  {
    name: 'Think Tank Photo',
    code: 'THINKTANK',
    description: 'American manufacturer of professional camera bags, backpacks, and accessories for photographers.',
    website: 'https://www.thinktankphoto.com',
    email: 'info@thinktankphoto.com',
    phone: '+1-805-987-1188',
    address: {
      street: '1234 Industrial Way',
      city: 'Santa Barbara',
      state: 'CA',
      zipCode: '93101',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 2005,
    countryOfOrigin: 'USA',
    certifications: ['ISO 9001'],
    socialMedia: {
      facebook: 'https://facebook.com/ThinkTankPhoto',
      instagram: 'https://instagram.com/thinktankphoto',
      twitter: 'https://twitter.com/ThinkTankPhoto',
      youtube: 'https://youtube.com/ThinkTankPhoto'
    },
    contactPerson: {
      name: 'Rachel Green',
      email: 'rachel.green@thinktankphoto.com',
      phone: '+1-805-987-1188',
      position: 'Sales Manager'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: 'Limited lifetime warranty',
      minimumOrder: 800
    },
    isActive: true
  },

  // Video & Cinematography Brands
  {
    name: 'Blackmagic Design',
    code: 'BLACKMAGIC',
    description: 'Australian company specializing in digital film cameras, video editing software, and post-production equipment.',
    website: 'https://www.blackmagicdesign.com',
    email: 'info@blackmagicdesign.com',
    phone: '+1-415-558-8500',
    address: {
      street: '2255 Martin Avenue',
      city: 'Santa Clara',
      state: 'CA',
      zipCode: '95050',
      country: 'USA'
    },
    category: 'photography',
    status: 'active',
    establishedYear: 2001,
    countryOfOrigin: 'Australia',
    certifications: ['CE', 'FCC', 'RoHS'],
    socialMedia: {
      facebook: 'https://facebook.com/BlackmagicDesign',
      instagram: 'https://instagram.com/blackmagicdesign',
      twitter: 'https://twitter.com/BlackmagicNews',
      youtube: 'https://youtube.com/BlackmagicDesign'
    },
    contactPerson: {
      name: 'James Wilson',
      email: 'james.wilson@blackmagicdesign.com',
      phone: '+1-415-558-8500',
      position: 'Sales Director'
    },
    terms: {
      paymentTerms: 'Net 30',
      returnPolicy: '30 days return policy',
      warrantyTerms: '1 year manufacturer warranty',
      minimumOrder: 2500
    },
    isActive: true
  }
];

// Helper function to get brands by category
export const getPhotographyBrandsByCategory = (category: string) => {
  return photographyBrands.filter(brand => brand.category === category);
};

// Helper function to get active brands only
export const getActivePhotographyBrands = () => {
  return photographyBrands.filter(brand => brand.isActive && brand.status === 'active');
};

// Helper function to search brands
export const searchPhotographyBrands = (query: string) => {
  const lowercaseQuery = query.toLowerCase();
  return photographyBrands.filter(brand => 
    brand.name.toLowerCase().includes(lowercaseQuery) ||
    brand.description.toLowerCase().includes(lowercaseQuery) ||
    brand.code.toLowerCase().includes(lowercaseQuery)
  );
};

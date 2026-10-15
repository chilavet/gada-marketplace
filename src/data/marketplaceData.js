export const CATEGORIES = [
  { id: 'all', name: 'All', icon: '🍽️' },
  { id: 'rice', name: 'Rice', icon: '🍚' },
  { id: 'swallow', name: 'Swallow', icon: '🍲' },
  { id: 'snacks', name: 'Snacks', icon: '🥨' },
  { id: 'drinks', name: 'Drinks', icon: '🥤' },
  { id: 'bakery', name: 'Bakery', icon: '🧁' },
  { id: 'groceries', name: 'Groceries', icon: '🛒' },
  { id: 'pharmacy', name: 'Pharmacy', icon: '💊' },
  { id: 'market-run', name: 'Market Run', icon: '🛍️', badge: 'Popular' },
];

export const PROMO_BANNERS = [
  {
    id: 1,
    title: 'Market Run Errand Service',
    subtitle: 'We buy fresh items directly from Bodija & Dugbe Markets for you!',
    discount: '20% OFF Delivery',
    bgGradient: 'linear-gradient(135deg, #0B4FD8 0%, #1D4ED8 100%)',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80',
    tag: 'Gada Special'
  },
  {
    id: 2,
    title: 'Craving Hot Jollof & Suya?',
    subtitle: 'Get authentic local buka favorites delivered closest to your doorstep',
    discount: 'Free Delivery',
    bgGradient: 'linear-gradient(135deg, #FF6B00 0%, #FF8E53 100%)',
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=800&q=80',
    tag: 'Trending'
  },
  {
    id: 3,
    title: 'Hyperlocal Grocery Stockup',
    subtitle: 'Fresh produce, spices, meats & household essentials from nearest stores',
    discount: '₦1,500 Off Orders > ₦10k',
    bgGradient: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
    image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&w=800&q=80',
    tag: 'Fresh Market'
  }
];

export const POPULAR_ITEMS = [
  // --- SNACKS & FAST FOOD ---
  {
    id: 'pop-1',
    name: 'Special Chicken Shawarma',
    category: 'snacks',
    vendor: 'Chowdeck Kitchen - Bodija',
    vendorId: 'v1',
    locationName: 'Bodija Central Hub',
    lat: 7.4350,
    lng: 3.9050,
    price: 3500,
    rating: 4.8,
    reviewsCount: 320,
    image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=600&q=80',
    tag: 'Best Seller',
    description: 'Double sausage, grilled chicken breast, spicy mayo sauce, wrapped in soft warm pita bread.',
    addons: [
      { name: 'Extra Cheese', price: 500 },
      { name: 'Extra Sausage', price: 700 },
      { name: 'Extra Spicy Pepper', price: 200 }
    ]
  },
  {
    id: 'pop-3',
    name: 'Spicy Beef Suya Platter',
    category: 'snacks',
    vendor: 'Aboki Suya Spot - Ring Road',
    vendorId: 'v5',
    locationName: 'Ring Road / Mobil',
    lat: 7.3582,
    lng: 3.8643,
    price: 4500,
    rating: 4.9,
    reviewsCount: 640,
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
    tag: 'Local Favorite',
    description: 'Thinly sliced tender beef grilled over charcoal with authentic yaji spice, fresh onions, and cabbage.',
    addons: [
      { name: 'Extra Yaji Spice Cup', price: 200 },
      { name: 'Masa (Rice Cakes 4pcs)', price: 1000 },
      { name: 'Chilled Zobo Drink 50cl', price: 600 }
    ]
  },
  {
    id: 'pop-5',
    name: 'Crispy Fried Chicken & Chips Platter',
    category: 'snacks',
    vendor: 'Kilimanjaro Restaurant - Dugbe',
    vendorId: 'v1',
    locationName: 'Dugbe Commercial Central',
    lat: 7.3870,
    lng: 3.8820,
    price: 3800,
    rating: 4.7,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
    tag: 'Fast Food',
    description: 'Golden crispy chicken drumsticks seasoned with herbs, accompanied by French fries and ketchup.',
    addons: [
      { name: 'Extra Fries', price: 800 },
      { name: 'Coleslaw Cup', price: 500 }
    ]
  },
  {
    id: 'pop-15',
    name: 'Peppered Asun Goat Meat (Half Kilo)',
    category: 'snacks',
    vendor: 'Bodija Suya & Grills Hub',
    vendorId: 'v2',
    locationName: 'Bodija Central Hub',
    lat: 7.4350,
    lng: 3.9050,
    price: 4200,
    rating: 4.9,
    reviewsCount: 290,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80',
    tag: 'Hot & Spicy',
    description: 'Slow-smoked goat meat chunks sautéed in crushed red habanero peppers and sliced onions.',
    addons: [
      { name: 'Fried Yam Portion', price: 800 },
      { name: 'Extra Habanero Sauce', price: 300 }
    ]
  },

  // --- RICE DISHES ---
  {
    id: 'pop-2',
    name: 'Smokey Party Jollof & Fried Chicken',
    category: 'rice',
    vendor: 'Mama Buka Authentic Kitchen - Bodija',
    vendorId: 'v2',
    locationName: 'Bodija Market Junction',
    lat: 7.4390,
    lng: 3.9080,
    price: 4200,
    rating: 4.9,
    reviewsCount: 512,
    image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=600&q=80',
    tag: 'Top Rated',
    description: 'Smokey wood-fire jollof rice served with fried plantain (dodo), fried chicken piece, and moin moin.',
    addons: [
      { name: 'Fried Plantain (Dodo)', price: 600 },
      { name: 'Moin Moin', price: 800 },
      { name: 'Extra Chicken Piece', price: 1500 }
    ]
  },
  {
    id: 'pop-9',
    name: 'Authentic Ofada Rice & Designer Ayamase',
    category: 'rice',
    vendor: 'Mama Cass Local Kitchen - Ring Road',
    vendorId: 'v5',
    locationName: 'Ring Road, Ibadan',
    lat: 7.3582,
    lng: 3.8643,
    price: 4600,
    rating: 4.8,
    reviewsCount: 380,
    image: 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?auto=format&fit=crop&w=600&q=80',
    tag: 'Traditional',
    description: 'Aromatic unpolished Ofada rice served in broad leaves with spicy green pepper sauce, fried boiled egg, and beef bits.',
    addons: [
      { name: 'Assorted Meat Portion', price: 1200 },
      { name: 'Fried Plantain', price: 600 }
    ]
  },
  {
    id: 'pop-10',
    name: 'Special Fried Rice & Peppered Turkey',
    category: 'rice',
    vendor: 'Kilimanjaro Restaurant - Dugbe',
    vendorId: 'v1',
    locationName: 'Dugbe Commercial Central',
    lat: 7.3870,
    lng: 3.8820,
    price: 4800,
    rating: 4.7,
    reviewsCount: 410,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
    tag: 'Popular',
    description: 'Delicious fried rice packed with diced carrots, sweet corn, green peas, served with a big turkey cutlet.',
    addons: [
      { name: 'Extra Turkey Wing', price: 1800 },
      { name: 'Coleslaw Salad', price: 500 }
    ]
  },
  {
    id: 'pop-11',
    name: 'Native Village Coconut Rice & Croaker Fish',
    category: 'rice',
    vendor: 'Oluyole Barbecue & Lounge',
    vendorId: 'v7',
    locationName: 'Oluyole Estate',
    lat: 7.3510,
    lng: 3.8540,
    price: 4400,
    rating: 4.8,
    reviewsCount: 195,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    tag: 'Chef Special',
    description: 'Rice simmered in fresh coconut milk with dried crayfish, served with grilled croaker fish and spicy sauce.',
    addons: [
      { name: 'Fried Plantain (Dodo)', price: 600 }
    ]
  },

  // --- SWALLOW & TRADITIONAL SOUP ---
  {
    id: 'pop-12',
    name: 'Pounded Yam & Goat Meat Egusi Soup',
    category: 'swallow',
    vendor: 'Mama Buka Authentic Kitchen - Bodija',
    vendorId: 'v2',
    locationName: 'Bodija Market Junction',
    lat: 7.4390,
    lng: 3.9080,
    price: 5200,
    rating: 4.9,
    reviewsCount: 470,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    tag: 'Traditional',
    description: 'Fluffy warm pounded yam with thick leafy egusi soup prepared with stockfish, ponmo, and tender goat meat.',
    addons: [
      { name: 'Extra Goat Meat Cut', price: 1500 },
      { name: 'Extra Pounded Yam Wrap', price: 800 }
    ]
  },
  {
    id: 'pop-13',
    name: 'Hot Amala, Gbegiri & Ewedu Combo',
    category: 'swallow',
    vendor: 'Ose Olorun Amala Spot - Dugbe',
    vendorId: 'v1',
    locationName: 'Dugbe Central',
    lat: 7.3870,
    lng: 3.8820,
    price: 4500,
    rating: 4.9,
    reviewsCount: 710,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
    tag: 'Ibadan Classic',
    description: 'Authentic dark yam flour Amala paired with yellow gbegiri bean soup, green ewedu, and fried cow leg or beef.',
    addons: [
      { name: 'Ogunfe (Goat Meat)', price: 1600 },
      { name: 'Roundabout / Shaki', price: 1000 }
    ]
  },
  {
    id: 'pop-6',
    name: 'Hot Spicy Catfish Pepper Soup',
    category: 'swallow',
    vendor: 'Oluyole Barbecue & Lounge',
    vendorId: 'v7',
    locationName: 'Oluyole Estate',
    lat: 7.3510,
    lng: 3.8540,
    price: 5500,
    rating: 4.8,
    reviewsCount: 230,
    image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
    tag: 'Spicy Hot',
    description: 'Fresh point-and-kill catfish simmered in aromatic native spices, scent leaves, and peppers.',
    addons: [
      { name: 'Boiled White Rice Portion', price: 800 },
      { name: 'Boiled Yam Cubes', price: 900 }
    ]
  },

  // --- DRINKS & REFRESHMENTS ---
  {
    id: 'pop-4',
    name: 'Gourmet Fruit Parfait Large',
    category: 'drinks',
    vendor: 'Healthy Bites & Bowls - Jericho',
    vendorId: 'v4',
    locationName: 'Jericho GRA',
    lat: 7.3980,
    lng: 3.8590,
    price: 3000,
    rating: 4.7,
    reviewsCount: 180,
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
    tag: 'Healthy',
    description: 'Greek yogurt layered with fresh strawberries, blueberries, chia seeds, honey, and crunchy granola.',
    addons: [
      { name: 'Extra Honey Drizzle', price: 300 },
      { name: 'Extra Granola Crunch', price: 400 },
      { name: 'Protein Powder Scoop', price: 800 }
    ]
  },
  {
    id: 'pop-16',
    name: 'Cold Hibiscus Zobo Infusion (75cl)',
    category: 'drinks',
    vendor: 'Mama Cass Local Kitchen - Ring Road',
    vendorId: 'v5',
    locationName: 'Ring Road / Mobil',
    lat: 7.3582,
    lng: 3.8643,
    price: 900,
    rating: 4.8,
    reviewsCount: 220,
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=600&q=80',
    tag: 'Chilled',
    description: 'Real dried hibiscus leaves brewed with ginger, cloves, pineapple essence and honey. Served chilled.',
    addons: [
      { name: 'Fresh Lemon Slices', price: 200 }
    ]
  },
  {
    id: 'pop-17',
    name: 'Freshly Pressed Pineapple & Ginger Juice (1L)',
    category: 'drinks',
    vendor: 'Healthy Bites & Bowls - Jericho',
    vendorId: 'v4',
    locationName: 'Jericho GRA',
    lat: 7.3980,
    lng: 3.8590,
    price: 2400,
    rating: 4.9,
    reviewsCount: 160,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=600&q=80',
    tag: '100% Natural',
    description: 'Pure cold-pressed ripe pineapples blended with spicy ginger root. No added sugar or artificial preservatives.',
    addons: []
  },

  // --- BAKERY & PASTRIES ---
  {
    id: 'pop-7',
    name: 'Double Cheeseburger & Vanilla Shake',
    category: 'bakery',
    vendor: 'UI Varsity Cafe & Bakery',
    vendorId: 'v8',
    locationName: 'Samonda / UI Tech Park',
    lat: 7.4480,
    lng: 3.8990,
    price: 4000,
    rating: 4.8,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
    tag: 'Campus Hit',
    description: 'Double beef patties, melted cheddar, lettuce, pickles, and our signature sauce with a thick milkshake.',
    addons: [
      { name: 'Extra Bacon Rashers', price: 700 },
      { name: 'Cheese Dip Cup', price: 400 }
    ]
  },
  {
    id: 'pop-19',
    name: 'Jumbo Flaky Beef Meat Pies (2 Pack)',
    category: 'bakery',
    vendor: 'UI Varsity Cafe & Bakery',
    vendorId: 'v8',
    locationName: 'Samonda / UI Tech Park',
    lat: 7.4480,
    lng: 3.8990,
    price: 1800,
    rating: 4.7,
    reviewsCount: 240,
    image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=600&q=80',
    tag: 'Freshly Baked',
    description: 'Rich buttery pastry shells stuffed with seasoned minced beef, potatoes, and sweet carrots.',
    addons: [
      { name: 'Chilled Coke 50cl', price: 450 }
    ]
  },
  {
    id: 'pop-20',
    name: 'Warm Glazed Donuts Box (4 Pack)',
    category: 'bakery',
    vendor: 'Sweet Tooth Bakery - Ring Road',
    vendorId: 'v5',
    locationName: 'Ring Road, Ibadan',
    lat: 7.3582,
    lng: 3.8643,
    price: 2600,
    rating: 4.8,
    reviewsCount: 175,
    image: 'https://images.unsplash.com/photo-1527515862127-a4fc05baf7a5?auto=format&fit=crop&w=600&q=80',
    tag: 'Sweet Treat',
    description: 'Melt-in-your-mouth yeast ring donuts coated in sweet vanilla glaze and chocolate sprinkles.',
    addons: [
      { name: 'Extra Chocolate Dip', price: 400 }
    ]
  },

  // --- GROCERIES & MARKET ---
  {
    id: 'pop-8',
    name: 'Fresh Farmers Yam & Vegetable Basket',
    category: 'groceries',
    vendor: 'Bodija Fresh Farmers Market',
    vendorId: 'v3',
    locationName: 'Bodija Market Block B',
    lat: 7.4410,
    lng: 3.9120,
    price: 6500,
    rating: 4.9,
    reviewsCount: 890,
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
    tag: 'Farm Fresh',
    description: 'Freshly harvested Benue yam, bell peppers, tomatoes, and organic green vegetables.',
    addons: [
      { name: 'Pure Palm Oil (1L)', price: 1800 },
      { name: 'Ground Egusi Bag (1kg)', price: 2500 }
    ]
  },
  {
    id: 'pop-22',
    name: 'Fresh Farm Eggs Crate (30 Large Eggs)',
    category: 'groceries',
    vendor: 'Bodija Fresh Farmers Market',
    vendorId: 'v3',
    locationName: 'Bodija Market Block B',
    lat: 7.4410,
    lng: 3.9120,
    price: 4300,
    rating: 4.8,
    reviewsCount: 420,
    image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=600&q=80',
    tag: 'Pantry Staple',
    description: 'Fresh poultry farm-picked brown eggs, graded large with high yolk vibrancy.',
    addons: []
  },
  {
    id: 'pop-24',
    name: 'Pure Palm Oil Keg (2.5 Litres)',
    category: 'groceries',
    vendor: 'Bodija Fresh Farmers Market',
    vendorId: 'v3',
    locationName: 'Bodija Market Block B',
    lat: 7.4410,
    lng: 3.9120,
    price: 3900,
    rating: 4.9,
    reviewsCount: 310,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=600&q=80',
    tag: 'Unadulterated',
    description: 'Rich dark red palm oil without food coloring or additives, straight from Eastern farm press.',
    addons: []
  },

  // --- PHARMACY & WELLNESS ---
  {
    id: 'pop-25',
    name: 'First Aid Emergency Care Kit Box',
    category: 'pharmacy',
    vendor: 'MedPlus Health & Pharmacy - Ring Road',
    vendorId: 'v5',
    locationName: 'Ring Road, Ibadan',
    lat: 7.3582,
    lng: 3.8643,
    price: 5800,
    rating: 4.9,
    reviewsCount: 130,
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
    tag: 'Essential',
    description: 'Complete home kit with antiseptics, cotton wool, surgical bandages, shears, band-aids and burn ointment.',
    addons: []
  },
  {
    id: 'pop-26',
    name: 'Vitamin C 1000mg & Zinc Immune Tablets',
    category: 'pharmacy',
    vendor: 'MedPlus Health & Pharmacy - Ring Road',
    vendorId: 'v5',
    locationName: 'Ring Road, Ibadan',
    lat: 7.3582,
    lng: 3.8643,
    price: 3200,
    rating: 4.8,
    reviewsCount: 215,
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=600&q=80',
    tag: 'Wellness',
    description: 'Effervescent immune booster tablets with high bioavailability Vitamin C and Zinc.',
    addons: []
  }
];

export const VENDORS = [
  {
    id: 'v5',
    name: 'Aboki Suya Spot - Ring Road',
    category: 'Fast Food',
    rating: 4.9,
    reviews: '640 ratings',
    locationName: 'Ring Road / Mobil, Ibadan',
    lat: 7.3582,
    lng: 3.8643,
    minOrder: 1500,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=200&q=80',
    address: 'Near Mobil Filling Station, Ring Road, Ibadan',
    menu: [
      {
        id: 'suya-1',
        name: 'Spicy Beef Suya Platter',
        price: 4500,
        description: 'Tender charcoal-grilled beef suya with yaji spice and onions.',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
        category: 'Fast Food'
      },
      {
        id: 'suya-2',
        name: 'Chicken Suya Skewers (3pcs)',
        price: 3500,
        description: 'Juicy deboned chicken thigh skewers dusted in dry pepper spice.',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
        category: 'Fast Food'
      }
    ]
  },
  {
    id: 'v7',
    name: 'Oluyole Barbecue & Lounge',
    category: 'Fast Food',
    rating: 4.8,
    reviews: '230 ratings',
    locationName: 'Oluyole Estate, Ibadan',
    lat: 7.3510,
    lng: 3.8540,
    minOrder: 2000,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=200&q=80',
    address: 'Plot 12, Commercial Road, Oluyole Estate, Ibadan',
    menu: [
      {
        id: 'ol-1',
        name: 'Hot Spicy Catfish Pepper Soup',
        price: 5500,
        description: 'Whole catfish in spicy broth with fresh herbs.',
        image: 'https://images.unsplash.com/photo-1547496502-affa22d38842?auto=format&fit=crop&w=600&q=80',
        category: 'Fast Food'
      }
    ]
  },
  {
    id: 'v1',
    name: 'Kilimanjaro Restaurant - Dugbe',
    category: 'Fast Food',
    rating: 4.7,
    reviews: '1.2k ratings',
    locationName: 'Dugbe Commercial Central',
    lat: 7.3870,
    lng: 3.8820,
    minOrder: 1500,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
    address: 'Plot 4, Dugbe Commercial Avenue, Ibadan',
    menu: [
      {
        id: 'kili-1',
        name: 'Fried Rice & Grilled Turkey',
        price: 4800,
        description: 'Nigerian fried rice served with seasoned turkey.',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=600&q=80',
        category: 'Main Meals'
      },
      {
        id: 'kili-2',
        name: 'Crispy Fried Chicken & Chips',
        price: 3800,
        description: '2 pieces of golden drumsticks with seasoned French fries.',
        image: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=600&q=80',
        category: 'Fast Food'
      }
    ]
  },
  {
    id: 'v4',
    name: 'Healthy Bites & Bowls - Jericho',
    category: 'Groceries',
    rating: 4.7,
    reviews: '180 ratings',
    locationName: 'Jericho GRA, Ibadan',
    lat: 7.3980,
    lng: 3.8590,
    minOrder: 2000,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=200&q=80',
    address: 'Magazine Road, Jericho GRA, Ibadan',
    menu: [
      {
        id: 'hb-1',
        name: 'Gourmet Fruit Parfait Large',
        price: 3000,
        description: 'Layered granola, greek yogurt and mixed fresh berries.',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=600&q=80',
        category: 'Groceries'
      }
    ]
  },
  {
    id: 'v2',
    name: 'Mama Buka Authentic Kitchen',
    category: 'Local Buka',
    rating: 4.9,
    reviews: '850 ratings',
    locationName: 'Bodija Market Junction, Ibadan',
    lat: 7.4390,
    lng: 3.9080,
    minOrder: 2000,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=200&q=80',
    address: 'Bodija Market Junction, Ibadan North',
    menu: [
      {
        id: 'mb-1',
        name: 'Pounded Yam & Goat Meat Egusi',
        price: 5200,
        description: 'Smooth pounded yam with goat meat and rich egusi soup.',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
        category: 'Swallow'
      },
      {
        id: 'mb-2',
        name: 'Amala, Gbegiri & Ewedu Combo',
        price: 4500,
        description: 'Hot black Amala served with gbegiri, ewedu, and fried beef.',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        category: 'Swallow'
      }
    ]
  },
  {
    id: 'v3',
    name: 'Bodija Fresh Farmers Market',
    category: 'Groceries',
    rating: 4.8,
    reviews: '2.1k ratings',
    locationName: 'Bodija Market Block B, Ibadan',
    lat: 7.4410,
    lng: 3.9120,
    minOrder: 3000,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=200&q=80',
    address: 'Bodija Market Block B, Ibadan',
    menu: [
      {
        id: 'bf-1',
        name: 'Basket of Fresh Tomatoes & Peppers (5kg)',
        price: 6500,
        description: 'Fresh farm-picked Jos tomatoes and peppers.',
        image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
        category: 'Groceries'
      }
    ]
  },
  {
    id: 'v8',
    name: 'UI Varsity Cafe & Bakery',
    category: 'Bakery',
    rating: 4.8,
    reviews: '310 ratings',
    locationName: 'Samonda / UI Tech Park',
    lat: 7.4480,
    lng: 3.8990,
    minOrder: 1500,
    isVerified: true,
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80',
    logo: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=200&q=80',
    address: 'Samonda Express, near UI Second Gate, Ibadan',
    menu: [
      {
        id: 'ui-1',
        name: 'Double Cheeseburger & Vanilla Shake',
        price: 4000,
        description: 'Double beef patties, melted cheddar, lettuce, pickles.',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
        category: 'Fast Food'
      }
    ]
  }
];

export const MARKETS = [
  { id: 'm1', name: 'Bodija Market', location: 'Ibadan North', lat: 7.4410, lng: 3.9120, icon: '🧺' },
  { id: 'm2', name: 'Dugbe Commercial Market', location: 'Central Ibadan', lat: 7.3870, lng: 3.8820, icon: '🏬' },
  { id: 'm3', name: 'Ogunpa Textile & General Market', location: 'Central Ibadan', lat: 7.3840, lng: 3.8790, icon: '🛍️' },
  { id: 'm4', name: 'Aleshinloye International Market', location: 'Aleshinloye / Jericho', lat: 7.3680, lng: 3.8600, icon: '🛒' },
  { id: 'm5', name: 'Oja Oba Central Market', location: 'Ibadan South East', lat: 7.3760, lng: 3.8950, icon: '🌽' },
  { id: 'm6', name: 'Sango Food & Grain Market', location: 'Sango / UI Axis', lat: 7.4280, lng: 3.8880, icon: '🌾' },
  { id: 'm7', name: 'Mokola Market', location: 'Mokola / Central Ibadan', lat: 7.4080, lng: 3.8860, icon: '🥩' },
  { id: 'm8', name: 'Iwo Road Market & Interchange', location: 'Ibadan North East', lat: 7.4110, lng: 3.9390, icon: '🚚' },
  { id: 'm9', name: 'Oje Traditional & Produce Market', location: 'Ibadan North East', lat: 7.3990, lng: 3.9180, icon: '🌿' },
  { id: 'm10', name: 'Gbaremu / Eleyele Market', location: 'Eleyele / Poly Axis', lat: 7.4150, lng: 3.8580, icon: '🥬' },
  { id: 'm11', name: 'Challenge & Felele Market', location: 'Ibadan South', lat: 7.3450, lng: 3.8760, icon: '🥑' },
  { id: 'm12', name: 'Ojoo Food & Transit Terminal', location: 'Ojoo / Akinyele Axis', lat: 7.4660, lng: 3.9210, icon: '🍠' },
];

export const USER_PROFILE = {
  name: 'Gada Explorer',
  email: 'gadatechgroup@gmail.com',
  phone: '+234 812 345 6789',
  address: 'No 14, Ring Road, Ibadan, Oyo State',
  walletBalance: 24500,
  savedAddresses: [
    { id: 1, label: 'Home', address: 'No 14, Ring Road, Ibadan', icon: '🏠' },
    { id: 2, label: 'Office', address: 'Dugbe Tech Hub, Suite 3B, Ibadan', icon: '🏢' }
  ],
  transactions: [
    { id: 'tx-101', title: 'Wallet Topup via Card', date: 'Today, 10:14 AM', amount: 15000, type: 'credit' },
    { id: 'tx-100', title: 'Order #GADA-8492 - Chowdeck Kitchen', date: 'Yesterday, 6:30 PM', amount: -4100, type: 'debit' }
  ]
};

export const INITIAL_RIDER_DATA = {
  name: 'Babatunde Ogunlesi',
  rating: 4.95,
  completedDeliveries: 342,
  todayEarnings: 18500,
  weeklyEarnings: 94200,
  vehicle: 'TVS Neo Motorcycle (Red) - KJA 482 QX',
  status: 'Online',
  activeOrders: [
    {
      id: 'GADA-9104',
      customerName: 'Adewale Johnson',
      customerPhone: '+234 803 111 2233',
      vendorName: 'Mama Buka Kitchen',
      pickupAddress: 'Bodija Market Junction, Ibadan North',
      deliveryAddress: 'University of Ibadan Tech Park, Gate 2',
      items: ['2x Pounded Yam & Egusi', '1x Chilled Zobo'],
      amount: 6200,
      earnings: 1200,
      status: 'Out for Delivery',
      distance: '3.4 km'
    }
  ]
};

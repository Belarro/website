// Mock data for admin UI development
// Will be replaced with AWS API calls later

export const mockProducts = [
  // SHOOTS
  {
    id: '1',
    slug: 'pea-shoots',
    name: 'Pea Shoots',
    category: 'shoot',
    availability_status: 'available',
    sort_order: 1,
    facts: { harvest_window_days: '10-14', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Versatile garnish and salad component. Sweet, fresh pea flavor.',
    flavor_profile: 'Sweet, fresh, crunchy like snow peas.',
    description_chef: 'Our classic Pea Shoots are grown in organic soil for maximum sweetness and substantial texture. Perfect as a base for salads or a high-volume garnish.',
    photo: 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    slug: 'pea-salad',
    name: 'Peas Salad',
    category: 'shoot',
    availability_status: 'available',
    sort_order: 2,
    facts: { harvest_window_days: '12-16', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Larger leaves for salad base.',
    flavor_profile: 'Sweet, leafy, crisp.',
    description_chef: 'Grown longer than our shoots for developed leaves. Serves as a standalone salad green with distinct pea flavor.',
    photo: 'https://images.unsplash.com/photo-1540560799653-b09e075cd550?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    slug: 'sunflower',
    name: 'Sunflower',
    category: 'shoot',
    availability_status: 'available',
    sort_order: 3,
    facts: { harvest_window_days: '10-12', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Nutty crunch. Great for texture contrast.',
    flavor_profile: 'Rich, nutty, crunchy.',
    description_chef: 'Thick, substantial stems with a flavor reminiscent of raw sunflower seeds. Excellent texture contrast in sandwiches or salads.',
    photo: 'https://images.unsplash.com/photo-1695431327855-5c1264251173?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    slug: 'corn',
    name: 'Corn',
    category: 'shoot',
    availability_status: 'seasonal',
    sort_order: 4,
    facts: { harvest_window_days: '8-10', shelf_life_days: 7, grown_medium: 'soil', notes_optional: 'Grown in dark' },
    service_fit: 'Intense sweet corn flavor. Unique yellow garnish.',
    flavor_profile: 'Super sweet, like fresh corn juice.',
    description_chef: 'Grown in the dark to maintain the bright yellow color (`blanched`). Incredible sweetness that surprises diners.',
    photo: 'https://plus.unsplash.com/premium_photo-1664188611801-b26a629b3ae3?auto=format&fit=crop&q=80&w=800', // Placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '10',
    slug: 'wheat-grass',
    name: 'Wheat grass',
    category: 'shoot',
    availability_status: 'available',
    sort_order: 10,
    facts: { harvest_window_days: '10-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: 'Juicing only' },
    service_fit: 'Juice bars and health shots.',
    flavor_profile: 'Grassy, sweet, intense.',
    description_chef: 'Classic wheatgrass for extraction. Dense nutrient profile.',
    photo: 'https://images.unsplash.com/photo-1594459466380-0a2a466a9359?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // MICROGREENS
  {
    id: '11',
    slug: 'broccoli',
    name: 'Broccoli',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 11,
    facts: { harvest_window_days: '8-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Mild flavor. Nutrient dense garnish.',
    flavor_profile: 'Mild brassica, fresh cabbage.',
    description_chef: 'A health-forward microgreen with a mild flavor profile that doesn\'t overpower dishes.',
    photo: 'https://images.unsplash.com/photo-1628795908298-63a232f05786?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '12',
    slug: 'radish-daikon',
    name: 'Radish DAIKON',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 12,
    facts: { harvest_window_days: '6-8', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Spicy kick. Clean white stems.',
    flavor_profile: 'Spicy, crisp, peppery.',
    description_chef: 'Classic Daikon heat. White stems and green leaves make for a fresh appearance with a punch.',
    photo: 'https://images.unsplash.com/photo-1636149451954-46c592317be9?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '13',
    slug: 'redish-mix',
    name: 'Redish Mix',
    category: 'mix',
    availability_status: 'available',
    sort_order: 13,
    facts: { harvest_window_days: '6-8', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Colorful spicy garnish.',
    flavor_profile: 'Peppery blend, varies by bite.',
    description_chef: 'A blend of our radish varieties (Daikon, Rambo, Purple) for maximum visual impact and spice.',
    photo: 'https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=800', // Radish mix placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '14',
    slug: 'radish-red-rambo',
    name: 'Radish Red Rambo',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 14,
    facts: { harvest_window_days: '6-8', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Dark purple color. Spicy.',
    flavor_profile: 'Spicy, earthy.',
    description_chef: 'Stunning dark purple leaves and stems. Adds drama and heat to any plate.',
    photo: 'https://images.unsplash.com/photo-1636149451954-46c592317be9?auto=format&fit=crop&q=80&w=800', // Reusing radish
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '15',
    slug: 'amaranth',
    name: 'Amaranth',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 15,
    facts: { harvest_window_days: '14-18', shelf_life_days: 6, grown_medium: 'soil', notes_optional: 'Sensitive to cold' },
    service_fit: 'Neon pink color. Mild earthy flavor.',
    flavor_profile: 'Earthy, beet-like, mild.',
    description_chef: 'The most vibrant microgreen available. Neon fuchsia/red color that pops on dessert or savory dishes.',
    photo: 'https://images.unsplash.com/photo-1706692873105-06d9595822f7?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '6',
    slug: 'red-beet-bull',
    name: 'Red Beet Bull',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 16,
    facts: { harvest_window_days: '12-16', shelf_life_days: 10, grown_medium: 'soil', notes_optional: 'Husks often attached' },
    service_fit: 'Intense red stem. Earthy beet flavor.',
    flavor_profile: 'Sweet, earthy beet.',
    description_chef: 'Bulls Blood variety. Deep red leaves and stems.',
    photo: 'https://plus.unsplash.com/premium_photo-1669677353995-1f630560a9f5?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '7',
    slug: 'yellow-beet',
    name: 'Yellow Beet',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 17,
    facts: { harvest_window_days: '12-16', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Golden stem. Milder than red beet.',
    flavor_profile: 'Sweet, mild earthiness.',
    description_chef: 'Golden beet microgreens offer a stunning yellow/orange stem contrast.',
    photo: 'https://images.unsplash.com/photo-1515471209610-dae972acb12c?auto=format&fit=crop&q=80&w=800', // Placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '18',
    slug: 'red-kohlrabi',
    name: 'Red Kohlrabi',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 18,
    facts: { harvest_window_days: '8-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Purple stem, green leaf. Mild cabbage.',
    flavor_profile: 'Mild, sweet brassica.',
    description_chef: 'Beautiful purple stems with green leaves.',
    photo: 'https://images.unsplash.com/photo-1550953686-21aa542ce7bc?auto=format&fit=crop&q=80&w=800', // Placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '19',
    slug: 'red-cabbage',
    name: 'Red cabbage',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 19,
    facts: { harvest_window_days: '8-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Pink/purple stem. Common garnish.',
    flavor_profile: 'Mild cabbage.',
    description_chef: 'The standard for purple garnishes. Mild flavor, great color.',
    photo: 'https://images.unsplash.com/photo-1628795908298-63a232f05786?auto=format&fit=crop&q=80&w=800', // Reuse broccoli style
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '20',
    slug: 'kale-black-russian',
    name: 'Kale Black or Russian',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 20,
    facts: { harvest_window_days: '8-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Nutrient dense. Frilly leaf.',
    flavor_profile: 'Mild, slightly sweet kale.',
    description_chef: 'Less fibrous than mature kale, but packed with nutrients.',
    photo: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '24',
    slug: 'parkchoi',
    name: 'Parkchoi',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 24,
    facts: { harvest_window_days: '8-10', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Asian dishes. Mild flavor.',
    flavor_profile: 'Mild, clean.',
    description_chef: 'Pak Choi (Bok Choy) microgreens.',
    photo: 'https://images.unsplash.com/photo-1628795908298-63a232f05786?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '25',
    slug: 'mustard-white',
    name: 'Mustard white',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 25,
    facts: { harvest_window_days: '6-8', shelf_life_days: 7, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Spicy, wasabi-like kick.',
    flavor_profile: 'Spicy mustard.',
    description_chef: 'Tastes like mustard/horseradish. Great on beef.',
    photo: 'https://images.unsplash.com/photo-1596627685650-6a7516d2fa27?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '26',
    slug: 'spinach',
    name: 'Spinach',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 26,
    facts: { harvest_window_days: '12-16', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Mild. Classic.',
    flavor_profile: 'Mild spinach.',
    description_chef: 'Delicate spinach leaves.',
    photo: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },

  // HERBS & PETITE
  {
    id: '5',
    slug: 'green-basil',
    name: 'Green Basil',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 27,
    facts: { harvest_window_days: '18-24', shelf_life_days: 6, grown_medium: 'soil', notes_optional: 'Do not refrigerate' },
    service_fit: 'Classic pesto flavor. Fragrant.',
    flavor_profile: 'Sweet Genovese basil.',
    description_chef: 'Genovese basil grown to petite size. Intense aroma.',
    photo: 'https://images.unsplash.com/photo-1618331835717-801e976710b2?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '8',
    slug: 'coriander',
    name: 'Coriander',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 28,
    facts: { harvest_window_days: '18-24', shelf_life_days: 8, grown_medium: 'soil', notes_optional: 'Seed husks attached' },
    service_fit: 'Complex flavor. Mexican/Asian dishes.',
    flavor_profile: 'Citrus, cilantro.',
    description_chef: 'Cilantro/Coriander microgreens. The seed husk is often attached (split coriander) providing a burst of citrus flavor.',
    photo: 'https://images.unsplash.com/photo-1588879463760-466d338f0c2a?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '9',
    slug: 'dill',
    name: 'Dill',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 29,
    facts: { harvest_window_days: '16-20', shelf_life_days: 7, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Fish dishes. Delicate fronds.',
    flavor_profile: 'Fresh dill.',
    description_chef: 'Feathery dill fronds.',
    photo: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800', // Placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '16',
    slug: 'leek',
    name: 'Leek',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 30,
    facts: { harvest_window_days: '14-18', shelf_life_days: 8, grown_medium: 'soil', notes_optional: 'Seed husk attached' },
    service_fit: 'Onion/Garlic flavor. Thin black seed tip.',
    flavor_profile: 'Sweet onion.',
    description_chef: 'Look like blades of grass with the black seed husk on top. Intense onion/leek flavor.',
    photo: 'https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&q=80&w=800', // Onion placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '17',
    slug: 'garlic',
    name: 'Garlic',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 31,
    facts: { harvest_window_days: '14-18', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Garlic chives.',
    flavor_profile: 'Garlic.',
    description_chef: 'Garlic chives.',
    photo: 'https://images.unsplash.com/photo-1629856553856-42d4cfdd2813?auto=format&fit=crop&q=80&w=800', // Garlic placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '21',
    slug: 'fennel',
    name: 'Fennel',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 32,
    facts: { harvest_window_days: '16-20', shelf_life_days: 7, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Anise flavor. Delicate.',
    flavor_profile: 'Licorice, anise.',
    description_chef: 'Bronze or green fennel with sweet anise notes.',
    photo: 'https://images.unsplash.com/photo-1596386461350-326e97552906?auto=format&fit=crop&q=80&w=800', // Fennel placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '22',
    slug: 'rocket-rocula',
    name: 'Rocket / Rocula',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 33,
    facts: { harvest_window_days: '8-12', shelf_life_days: 7, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Peppery. Pizza/Pasta.',
    flavor_profile: 'Peppery arugula.',
    description_chef: 'Wild rocket.',
    photo: 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=800', // Reuse green placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '23',
    slug: 'nasturtium',
    name: 'Nasturtium',
    category: 'petite_herb',
    availability_status: 'seasonal',
    sort_order: 34,
    facts: { harvest_window_days: '14-21', shelf_life_days: 6, grown_medium: 'soil', notes_optional: 'Lily pad leaf' },
    service_fit: 'Peppery. Unique round leaf.',
    flavor_profile: 'Wasabi, pepper.',
    description_chef: 'One of the most requested chef items. Looks like a lily pad, tastes like pepper/wasabi.',
    photo: 'https://plus.unsplash.com/premium_photo-1675844878438-d621b1b0fe2e?auto=format&fit=crop&q=80&w=800', // Nasturtium placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '27',
    slug: 'lemon-balm',
    name: 'Lemon Balm',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 35,
    facts: { harvest_window_days: '20-30', shelf_life_days: 6, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Citrus aroma. Desserts.',
    flavor_profile: 'Lemon, mint.',
    description_chef: 'Lemon balm leaves.',
    photo: 'https://images.unsplash.com/photo-1515543237350-b3aea48d5276?auto=format&fit=crop&q=80&w=800', // Mint/Balm placeholder
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '28',
    slug: 'parsley',
    name: 'Parsley',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 36,
    facts: { harvest_window_days: '20-30', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Classic garnish.',
    flavor_profile: 'Parsley.',
    description_chef: 'Petite parsley.',
    photo: 'https://images.unsplash.com/photo-1606509927771-332eb3b604a8?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

export const mockKitchens = [
  {
    id: '1',
    kitchen_name: 'Restaurant Katz',
    delivery_day: 'tuesday',
    status: 'active',
    contacts: [
      { name: 'Thomas Weber', email: 'thomas@katz-berlin.de', phone: '+49 30 1234567' }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    kitchen_name: 'Café Mitte',
    delivery_day: 'wednesday',
    status: 'active',
    contacts: [
      { name: 'Anna Schmidt', email: 'anna@cafemitte.de', phone: '' }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    kitchen_name: 'Bistro Prenzlauer',
    delivery_day: 'friday',
    status: 'paused',
    contacts: [
      { name: 'Max Müller', email: 'max@bistro-p.de', phone: '+49 30 9876543' }
    ],
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  }
];

export const mockUsers = [
  {
    id: '1',
    email: 'admin@belarro.com',
    role: 'admin',
    kitchen_id: null,
    status: 'active',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'thomas@katz-berlin.de',
    role: 'chef',
    kitchen_id: '1',
    status: 'active',
    created_at: '2025-01-05T00:00:00Z'
  },
  {
    id: '3',
    email: 'anna@cafemitte.de',
    role: 'chef',
    kitchen_id: '2',
    status: 'active',
    created_at: '2025-01-05T00:00:00Z'
  },
  {
    id: '4',
    email: 'max@bistro-p.de',
    role: 'chef',
    kitchen_id: '3',
    status: 'disabled',
    created_at: '2025-01-05T00:00:00Z'
  }
];

export const categories = [
  { value: 'shoot', label: 'Shoot' },
  { value: 'microgreen', label: 'Microgreen' },
  { value: 'petite_herb', label: 'Petite Herb' },
  { value: 'mix', label: 'Mix' }
];

export const statusOptions = [
  { value: 'available', label: 'Available' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'paused', label: 'Paused' },
  { value: 'hidden', label: 'Hidden' }
];

export const deliveryDays = [
  { value: 'monday', label: 'Monday' },
  { value: 'tuesday', label: 'Tuesday' },
  { value: 'wednesday', label: 'Wednesday' },
  { value: 'thursday', label: 'Thursday' },
  { value: 'friday', label: 'Friday' }
];

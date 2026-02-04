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
    flavor_profile: 'Sweet, fresh, crunchy.',
    description_chef: 'Classic shoots grown in soil for clean sweetness and real texture. Reliable crunch with a clear pea finish.',
    photo: 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    slug: 'pea-salad',
    name: 'Pea Salad',
    category: 'shoot',
    availability_status: 'available',
    sort_order: 2,
    facts: { harvest_window_days: '12-16', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Larger leaves for salad base.',
    flavor_profile: 'Sweet, leafy, crisp.',
    description_chef: 'Grown longer for developed leaves and deeper pea flavor. More body than shoots, still clean and fresh.',
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
    description_chef: 'Thick stems with real bite and raw sunflower flavor. Adds weight and structure to the plate.',
    photo: 'https://images.unsplash.com/photo-1695431327855-5c1264251173?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    slug: 'corn',
    name: 'Popcorn (Corn)',
    category: 'shoot',
    availability_status: 'seasonal',
    sort_order: 4,
    facts: { harvest_window_days: '8-10', shelf_life_days: 7, grown_medium: 'soil', notes_optional: 'Grown in dark' },
    service_fit: 'Intense sweet corn flavor. Unique yellow garnish.',
    flavor_profile: 'Sweet, juicy, crisp.',
    description_chef: 'Young corn shoots with a clean sweetness and fresh crunch. Works raw where brightness matters.',
    photo: 'https://plus.unsplash.com/premium_photo-1664188611801-b26a629b3ae3?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '10',
    slug: 'wheat-grass',
    name: 'Wheatgrass',
    category: 'shoot',
    availability_status: 'available',
    sort_order: 10,
    facts: { harvest_window_days: '10-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: 'Juicing only' },
    service_fit: 'Juice bars and health shots.',
    flavor_profile: 'Green, clean, sharp.',
    description_chef: 'Straight, grassy flavor with tight structure. Used sparingly for freshness and contrast.',
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
    flavor_profile: 'Mild, green, crisp.',
    description_chef: 'Clean brassica flavor with light crunch. Neutral enough to support, fresh enough to stand alone.',
    photo: 'https://images.unsplash.com/photo-1628795908298-63a232f05786?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '12',
    slug: 'radish-daikon',
    name: 'Radish Daikon',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 12,
    facts: { harvest_window_days: '6-8', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Spicy kick. Clean white stems.',
    flavor_profile: 'Hot, clean, sharp.',
    description_chef: 'Fast heat with a fresh radish bite. Cuts richness and wakes up the plate.',
    photo: 'https://images.unsplash.com/photo-1636149451954-46c592317be9?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '13',
    slug: 'radish-mix',
    name: 'Radish Mix',
    category: 'mix',
    availability_status: 'available',
    sort_order: 13,
    facts: { harvest_window_days: '6-8', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Colorful spicy garnish.',
    flavor_profile: 'Hot, fresh, balanced.',
    description_chef: 'A mix of radishes with layered heat and texture. Flexible and easy to place.',
    photo: 'https://images.unsplash.com/photo-1534068590799-09895a701e3e?auto=format&fit=crop&q=80&w=800',
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
    flavor_profile: 'Hot, vivid, punchy.',
    description_chef: 'Intense radish heat with strong color. Small amount, clear impact.',
    photo: 'https://images.unsplash.com/photo-1636149451954-46c592317be9?auto=format&fit=crop&q=80&w=800',
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
    flavor_profile: 'Mild, tender, earthy.',
    description_chef: 'Soft leaves with gentle bitterness and fine texture. Adds color without overpowering the dish.',
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
    flavor_profile: 'Earthy, sweet, bold.',
    description_chef: 'Strong beet flavor with deep color and solid stems. Holds well and delivers intensity.',
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
    flavor_profile: 'Sweet, earthy, gentle.',
    description_chef: 'Milder than red beet, with clear sweetness. Brings color without dominance.',
    photo: 'https://images.unsplash.com/photo-1515471209610-dae972acb12c?auto=format&fit=crop&q=80&w=800',
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
    flavor_profile: 'Clean, juicy, crisp.',
    description_chef: 'Juicy stems with a mild kohlrabi sweetness. Adds freshness without heat.',
    photo: 'https://images.unsplash.com/photo-1550953686-21aa542ce7bc?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '19',
    slug: 'red-cabbage',
    name: 'Red Cabbage',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 19,
    facts: { harvest_window_days: '8-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Pink/purple stem. Common garnish.',
    flavor_profile: 'Fresh, mild, crunchy.',
    description_chef: 'Light cabbage flavor with bright purple color. Reliable crunch for finishing.',
    photo: 'https://images.unsplash.com/photo-1628795908298-63a232f05786?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '20',
    slug: 'kale-black-russian',
    name: 'Kale Black / Russian',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 20,
    facts: { harvest_window_days: '8-12', shelf_life_days: 10, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Nutrient dense. Frilly leaf.',
    flavor_profile: 'Earthy, robust, green.',
    description_chef: 'Sturdy leaves with deep vegetal flavor. Holds texture under pressure.',
    photo: 'https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '24',
    slug: 'pak-choi',
    name: 'Pak Choi',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 24,
    facts: { harvest_window_days: '8-10', shelf_life_days: 8, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Asian dishes. Mild flavor.',
    flavor_profile: 'Mild, juicy, clean.',
    description_chef: 'Soft leaves with gentle brassica flavor. Works raw or lightly finished.',
    photo: 'https://images.unsplash.com/photo-1628795908298-63a232f05786?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '25',
    slug: 'mustard-white',
    name: 'Mustard White',
    category: 'microgreen',
    availability_status: 'available',
    sort_order: 25,
    facts: { harvest_window_days: '6-8', shelf_life_days: 7, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Spicy, wasabi-like kick.',
    flavor_profile: 'Hot, sharp, aromatic.',
    description_chef: 'Immediate mustard heat with a clean finish. Use where tension is needed.',
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
    flavor_profile: 'Soft, green, clean.',
    description_chef: 'Tender leaves with a neutral spinach profile. Easy to pair, easy to use.',
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
    flavor_profile: 'Fresh, citrus, green.',
    description_chef: 'Classic coriander aroma with clean stems. Use where clarity matters.',
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
    flavor_profile: 'Fresh, aromatic, soft.',
    description_chef: 'Fine leaves with clean dill aroma. Works best raw and last-minute.',
    photo: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&q=80&w=800',
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
    flavor_profile: 'Mild, savory, green.',
    description_chef: 'Gentle onion character without aggression. Adds depth, not heat.',
    photo: 'https://images.unsplash.com/photo-1615485500704-8e99099928b3?auto=format&fit=crop&q=80&w=800',
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
    flavor_profile: 'Sharp, intense, direct.',
    description_chef: 'Pure garlic punch in micro form. Use carefully, it does not hide.',
    photo: 'https://images.unsplash.com/photo-1629856553856-42d4cfdd2813?auto=format&fit=crop&q=80&w=800',
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
    flavor_profile: 'Fresh, anise, clean.',
    description_chef: 'Clear fennel aroma with crisp texture. Lifts and opens the dish.',
    photo: 'https://images.unsplash.com/photo-1596386461350-326e97552906?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '22',
    slug: 'rocket-rucola',
    name: 'Rocket / Rucola',
    category: 'petite_herb',
    availability_status: 'available',
    sort_order: 33,
    facts: { harvest_window_days: '8-12', shelf_life_days: 7, grown_medium: 'soil', notes_optional: '' },
    service_fit: 'Peppery. Pizza/Pasta.',
    flavor_profile: 'Peppery, sharp, dry.',
    description_chef: 'Fast bitterness with a dry finish. Cuts through rich components.',
    photo: 'https://images.unsplash.com/photo-1599307409240-cf178b30d885?auto=format&fit=crop&q=80&w=800',
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '23',
    slug: 'nasturtium-alaska',
    name: 'Nasturtium Alaska',
    category: 'petite_herb',
    availability_status: 'seasonal',
    sort_order: 34,
    facts: { harvest_window_days: '14-21', shelf_life_days: 6, grown_medium: 'soil', notes_optional: 'Lily pad leaf' },
    service_fit: 'Peppery. Unique round leaf.',
    flavor_profile: 'Peppery, bright, bold.',
    description_chef: 'Sharp heat with strong leaf character. Small leaves, big statement.',
    photo: 'https://plus.unsplash.com/premium_photo-1675844878438-d621b1b0fe2e?auto=format&fit=crop&q=80&w=800',
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
    photo: 'https://images.unsplash.com/photo-1515543237350-b3aea48d5276?auto=format&fit=crop&q=80&w=800',
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
    flavor_profile: 'Green, clean, balanced.',
    description_chef: 'Straight herbal flavor without noise. Finishes the plate quietly.',
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

// Seed community posts and users. Replace with API responses once the backend exists.
export const seedPosts = [
  {
    id: 'c1', authorId: 'a1', tag: 'showcase', createdAt: '2026-11-14T09:20:00',
    text: 'Finished this Lakshmi after three weeks. The halo took the longest. Thank you to everyone who asked about the jewellery lines — I will post a short video on how I cut them.',
    art: { kind: 'deity', variant: 'lakshmi' }, tone: 'slate', image: null,
    likes: ['b1', 'b2', 'a2', 'a3'],
    comments: [
      { id: 'cc1', authorId: 'b1', text: 'The face is so calm. Is this one still available?', createdAt: '2026-11-14T11:05:00' },
      { id: 'cc2', authorId: 'a1', text: 'Yes, it is listed under Explore Crafts. You can send an enquiry there.', createdAt: '2026-11-14T12:30:00' },
    ],
  },
  {
    id: 'c2', authorId: 'a2', tag: 'tips', createdAt: '2026-11-12T16:40:00',
    text: 'Tip for new lamp makers: carve the wick groove before you polish. If the chisel slips after polishing, you lose the whole shine.',
    art: { kind: 'lamp', variant: 'stand' }, tone: 'sage', image: null,
    likes: ['a1', 'a4', 'a6', 'b2'],
    comments: [{ id: 'cc3', authorId: 'a6', text: 'Thank you amma, this will save me a lot of rework.', createdAt: '2026-11-12T18:10:00' }],
  },
  {
    id: 'c3', authorId: 'b2', tag: 'question', createdAt: '2026-11-10T08:15:00',
    text: 'I want a grinding stone for my mother in Hyderabad. How heavy are they and does it travel safely by courier?',
    art: null, tone: 'sand', image: null,
    likes: ['b1'],
    comments: [
      { id: 'cc4', authorId: 'a4', text: 'Ours weigh about 22 kg. We pack in a wooden crate with straw, so it arrives safely. Send me an enquiry and I will give you the courier cost.', createdAt: '2026-11-10T10:00:00' },
    ],
  },
  {
    id: 'c4', authorId: 'a6', tag: 'showcase', createdAt: '2026-11-08T13:00:00',
    text: 'New lotus coasters are ready. Four to a set, sealed so they wipe clean. Made them from the offcuts of a larger wall relief.',
    art: { kind: 'lotus', variant: 'coaster' }, tone: 'sage', image: null,
    likes: ['b1', 'b3', 'a1'],
    comments: [],
  },
  {
    id: 'c5', authorId: 'a3', tag: 'tips', createdAt: '2026-11-05T07:50:00',
    text: 'When a pillar is more than 3 feet, always rough it out lying down, then stand it up for the fine work. It saves your back and the stone.',
    art: { kind: 'pillar', variant: 'full' }, tone: 'sand', image: null,
    likes: ['a1', 'a5'],
    comments: [],
  },
  {
    id: 'c6', authorId: 'b1', tag: 'showcase', createdAt: '2026-11-02T19:30:00',
    text: 'Our Vinayaka arrived and looks even better in person. It sits at the front door and the whole street stops to look. Thank you Ramulu garu!',
    art: { kind: 'deity', variant: 'ganesha' }, tone: 'sage', image: null,
    likes: ['a1', 'a5', 'b2'],
    comments: [{ id: 'cc5', authorId: 'a1', text: 'Thank you, it was a pleasure to make.', createdAt: '2026-11-03T08:00:00' }],
  },
];

export const seedUsers = [
  { id: 'a1', name: 'Pasupuleti Ramulu', phone: '9000000001', password: 'craft123', role: 'artisan', blocked: false, createdAt: '2026-01-12' },
  { id: 'a2', name: 'Kandula Parvathamma', phone: '9000000002', password: 'craft123', role: 'artisan', blocked: false, createdAt: '2026-01-20' },
  { id: 'a3', name: 'Gadde Nageswara Rao', phone: '9000000003', password: 'craft123', role: 'artisan', blocked: false, createdAt: '2026-02-03' },
  { id: 'a4', name: 'Shaik Mastan Vali', phone: '9000000004', password: 'craft123', role: 'artisan', blocked: false, createdAt: '2026-02-15' },
  { id: 'a5', name: 'Bandi Lakshmi Narasimha', phone: '9000000005', password: 'craft123', role: 'artisan', blocked: false, createdAt: '2026-03-02' },
  { id: 'a6', name: 'Yarra Sireesha', phone: '9000000006', password: 'craft123', role: 'artisan', blocked: false, createdAt: '2026-03-18' },
  { id: 'b1', name: 'Anitha Reddy', phone: '9000000011', password: 'buyer123', role: 'buyer', city: 'Guntur', blocked: false, createdAt: '2026-04-05' },
  { id: 'b2', name: 'Karthik Menon', phone: '9000000012', password: 'buyer123', role: 'buyer', city: 'Hyderabad', blocked: false, createdAt: '2026-05-21' },
  { id: 'b3', name: 'Divya Sharma', phone: '9000000013', password: 'buyer123', role: 'buyer', city: 'Bengaluru', blocked: false, createdAt: '2026-07-09' },
  { id: 'admin', name: 'CraftConnect Admin', phone: '9000000099', password: 'admin123', role: 'admin', blocked: false, createdAt: '2026-01-01' },
];

export const seedRequests = [
  {
    id: 'r1', type: 'product', buyerId: 'b1', buyerName: 'Anitha Reddy', buyerPhone: '9000000011',
    artisanId: 'a1', productId: 'p1', title: 'Seated Lakshmi Devi', quantity: 1,
    message: 'Is this available? Can you deliver to Guntur and how much would transport cost?',
    details: {}, images: [], status: 'replied', createdAt: '2026-11-13T10:00:00',
    replies: [{ from: 'artisan', name: 'Pasupuleti Ramulu', text: 'Yes, it is ready. Delivery to Guntur is about ₹600 by our own vehicle. Please call me to confirm.', at: '2026-11-13T15:20:00' }],
  },
  {
    id: 'r2', type: 'custom', buyerId: 'b2', buyerName: 'Karthik Menon', buyerPhone: '9000000012',
    artisanId: 'a3', productId: null, title: 'Two entrance pillars for a farmhouse', quantity: 2,
    message: 'We need two matching pillars of about 5 feet for our farmhouse gate with a simple lotus base.',
    details: { craft: 'Temple pillars & panels', size: '5 ft tall, 10 in wide', stone: 'Sandstone shade', budget: '₹60,000 – ₹90,000', deadline: '2027-01-30' },
    images: [], status: 'quoted', createdAt: '2026-11-09T12:00:00',
    replies: [{ from: 'artisan', name: 'Gadde Nageswara Rao', text: 'We can make this. Price is for the pair, including loading.', at: '2026-11-10T09:00:00', quote: { price: 74000, days: 50 } }],
  },
  {
    id: 'r3', type: 'custom', buyerId: 'b3', buyerName: 'Divya Sharma', buyerPhone: '9000000013',
    artisanId: null, productId: null, title: 'Nameplate with a lotus border', quantity: 1,
    message: 'I would like a stone nameplate for our house with the name "Sharma Nilayam" and a lotus border.',
    details: { craft: 'Home décor', size: '18 × 8 in', stone: 'No preference', budget: '₹3,000 – ₹6,000', deadline: '2026-12-20' },
    images: [], status: 'new', createdAt: '2026-11-15T17:30:00', replies: [],
  },
];

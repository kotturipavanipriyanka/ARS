const fs = require('fs');
const path = require('path');

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

const categories = [
  'Electronics','Kitchen','Home','Apparel','Sports','Beauty','Toys','Books','Automotive','Garden'
];

const nouns = {
  Electronics: ['Headphones','Speaker','Camera','Smartphone','Charger','Bluetooth Earbuds','Monitor','Keyboard','Mouse','Router'],
  Kitchen: ['Pressure Cooker','Rice Cooker','Air Fryer','Blender','Coffee Maker','Cookware Set','Skillet','Dutch Oven','Toaster','Microwave'],
  Home: ['Throw Pillow','Bed Sheets','Lamp','Vacuum Cleaner','Water Dispenser','Curtains','Rug','Storage Box','Hanging Shelf','Wall Clock'],
  Apparel: ['Running Shoes','Jacket','T-Shirt','Jeans','Socks','Backpack','Hat','Sweater','Dress','Shorts'],
  Sports: ['Yoga Mat','Dumbbell Set','Tennis Racket','Football','Basketball','Cycling Helmet','Running Belt','Resistance Bands','Jump Rope','Golf Gloves'],
  Beauty: ['Facial Cleanser','Moisturizer','Shampoo','Conditioner','Hair Dryer','Makeup Kit','Perfume','Sunscreen','Face Mask','Nail Kit'],
  Toys: ['Building Blocks','Board Game','Action Figure','Doll','Puzzle','Remote Car','Plush Toy','Learning Tablet','Kaleidoscope','Science Kit'],
  Books: ['Mystery Novel','Science Fiction','Self-Help Guide','Cookbook','Children Book','Biography','Business Book','Romance Novel','History Book','Travel Guide'],
  Automotive: ['Car Charger','Car Vacuum','Dash Cam','Tire Inflator','Seat Cover','Car Freshener','Jump Starter','Engine Oil','Wiper Blades','Battery Conditioner'],
  Garden: ['Garden Hose','Pruner','Planter Pots','Lawn Mower','Garden Gloves','Fertilizer','Compost Bin','Outdoor Lights','Garden Fork','Watering Can']
};

const adjectives = ['Advanced','Portable','Premium','Eco','Smart','Wireless','Compact','Deluxe','Ultra','Classic','Pro','Essential','Multi','Performance','Quick'];

const total = 500; // number of synthetic products to generate
const products = [];

for (let i = 1; i <= total; i++) {
  const category = categories[i % categories.length];
  const nounList = nouns[category];
  const noun = nounList[i % nounList.length];
  const adj = adjectives[i % adjectives.length];
  const model = Math.floor(rand(100,9999));
  const title = `${adj} ${noun} Model ${model}`;
  const id = `p${i}`;
  const asin = `ASIN${String(i).padStart(6,'0')}`;
  const price = Number(rand(9.99, 499.99).toFixed(2));
  const rating = Number((rand(3.4, 5.0)).toFixed(1));
  const review_count = Math.floor(rand(0, 15000));
  const image_url = `https://via.placeholder.com/400x300?text=${encodeURIComponent(noun)}`;
  const description = `${adj} ${noun} designed for ${category.toLowerCase()} use. Model ${model} offers reliable performance and solid value.`;

  // build tags from title tokens and category
  const tokenize = (s) => String(s || '').toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  const tagsSet = new Set([...tokenize(title), ...tokenize(category), ...tokenize(noun), adj.toLowerCase()]);
  const tags = Array.from(tagsSet);

  const amazon_link = `https://www.amazon.com/dp/${asin}`;

  products.push({
    id,
    asin,
    title,
    category,
    price,
    rating,
    review_count,
    image_url,
    description,
    tags,
    amazon_link
  });
}

const outPath = path.join(__dirname, '..', 'data', 'products.json');

fs.writeFileSync(outPath, JSON.stringify(products, null, 2), 'utf8');
console.log(`Wrote ${products.length} products to ${outPath}`);

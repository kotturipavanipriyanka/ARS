/*
  # Seed Product Data

  Inserts sample product data for demonstration with realistic Amazon-style products
  across multiple categories with pricing, ratings, and features for the recommendation engine.
*/

INSERT INTO products (asin, title, category, price, rating, review_count, image_url, description)
VALUES
  ('B001', 'Wireless Noise-Cancelling Headphones', 'Electronics', 199.99, 4.7, 2543, 'https://images.pexels.com/photos/3661527/pexels-photo-3661527.jpeg', 'Premium wireless headphones with active noise cancellation and 30-hour battery life'),
  ('B002', 'Smart Watch Pro', 'Electronics', 299.99, 4.5, 1876, 'https://images.pexels.com/photos/3799831/pexels-photo-3799831.jpeg', 'Advanced fitness tracking smartwatch with heart rate monitor and water resistance'),
  ('B003', 'Ultra HD 4K Webcam', 'Electronics', 89.99, 4.6, 1234, 'https://images.pexels.com/photos/9072253/pexels-photo-9072253.jpeg', '4K resolution webcam perfect for streaming and video conferencing'),
  ('B004', 'Mechanical Gaming Keyboard', 'Electronics', 149.99, 4.8, 3421, 'https://images.pexels.com/photos/2833297/pexels-photo-2833297.jpeg', 'RGB backlit mechanical keyboard with customizable switches'),
  ('B005', '32" Gaming Monitor', 'Electronics', 399.99, 4.6, 2109, 'https://images.pexels.com/photos/3651655/pexels-photo-3651655.jpeg', '165Hz 4K gaming monitor with AMD FreeSync and HDR support'),
  ('B006', 'Portable SSD 2TB', 'Electronics', 249.99, 4.7, 1943, 'https://images.pexels.com/photos/220237/pexels-photo-220237.jpeg', 'Ultra-fast external SSD with USB-C connectivity for professionals'),
  ('B007', 'Ergonomic Office Chair', 'Furniture', 299.99, 4.4, 1654, 'https://images.pexels.com/photos/1350789/pexels-photo-1350789.jpeg', 'Premium ergonomic chair with lumbar support for long working hours'),
  ('B008', 'Standing Desk Converter', 'Furniture', 199.99, 4.5, 1201, 'https://images.pexels.com/photos/6147345/pexels-photo-6147345.jpeg', 'Adjustable standing desk converter for improved posture and health'),
  ('B009', 'Desk Lamp LED Smart', 'Furniture', 79.99, 4.6, 987, 'https://images.pexels.com/photos/3976424/pexels-photo-3976424.jpeg', 'Adjustable LED desk lamp with color temperature control and USB charging'),
  ('B010', 'Coffee Maker Pro', 'Kitchen', 129.99, 4.5, 2341, 'https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg', 'Programmable coffee maker with thermal carafe and built-in grinder'),
  ('B011', 'Air Fryer XL', 'Kitchen', 99.99, 4.7, 3102, 'https://images.pexels.com/photos/3601615/pexels-photo-3601615.jpeg', 'Large capacity air fryer with 8 cooking presets and digital controls'),
  ('B012', 'Blender Pro Series', 'Kitchen', 149.99, 4.6, 1876, 'https://images.pexels.com/photos/4210615/pexels-photo-4210615.jpeg', 'High-powered blender perfect for smoothies and frozen drinks'),
  ('B013', 'Running Shoes Pro', 'Sports', 129.99, 4.6, 2543, 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg', 'Lightweight running shoes with responsive cushioning for marathons'),
  ('B014', 'Yoga Mat Premium', 'Sports', 49.99, 4.5, 1203, 'https://images.pexels.com/photos/6289086/pexels-photo-6289086.jpeg', 'Non-slip yoga mat with carrying strap for gym and home use'),
  ('B015', 'Dumbbells Set', 'Sports', 199.99, 4.7, 1654, 'https://images.pexels.com/photos/4761769/pexels-photo-4761769.jpeg', 'Adjustable dumbbell set from 5 to 50 lbs with storage rack'),
  ('B016', 'Fiction Novel Bestseller', 'Books', 14.99, 4.6, 5342, 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg', 'Award-winning mystery novel by acclaimed author'),
  ('B017', 'Programming Guide Advanced', 'Books', 49.99, 4.8, 876, 'https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg', 'Comprehensive guide to advanced programming concepts'),
  ('B018', 'Graphic Design Fundamentals', 'Books', 39.99, 4.5, 654, 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg', 'Essential guide to graphic design principles and techniques');

INSERT INTO product_features (product_id, feature_name, feature_value)
SELECT p.id, 'battery_life', 30 FROM products p WHERE p.asin = 'B001'
UNION ALL
SELECT p.id, 'weight_oz', 8.5 FROM products p WHERE p.asin = 'B001'
UNION ALL
SELECT p.id, 'heart_monitor', 1 FROM products p WHERE p.asin = 'B002'
UNION ALL
SELECT p.id, 'water_resistant', 1 FROM products p WHERE p.asin = 'B002'
UNION ALL
SELECT p.id, 'resolution_4k', 1 FROM products p WHERE p.asin = 'B003'
UNION ALL
SELECT p.id, 'auto_focus', 1 FROM products p WHERE p.asin = 'B003'
UNION ALL
SELECT p.id, 'rgb_backlit', 1 FROM products p WHERE p.asin = 'B004'
UNION ALL
SELECT p.id, 'mechanical_switches', 1 FROM products p WHERE p.asin = 'B004'
UNION ALL
SELECT p.id, 'refresh_rate_hz', 165 FROM products p WHERE p.asin = 'B005'
UNION ALL
SELECT p.id, 'resolution_4k', 1 FROM products p WHERE p.asin = 'B005'
UNION ALL
SELECT p.id, 'storage_gb', 2000 FROM products p WHERE p.asin = 'B006'
UNION ALL
SELECT p.id, 'read_speed_mbps', 1050 FROM products p WHERE p.asin = 'B006'
UNION ALL
SELECT p.id, 'lumbar_support', 1 FROM products p WHERE p.asin = 'B007'
UNION ALL
SELECT p.id, 'max_weight_lbs', 300 FROM products p WHERE p.asin = 'B007'
UNION ALL
SELECT p.id, 'adjustable_height', 1 FROM products p WHERE p.asin = 'B008'
UNION ALL
SELECT p.id, 'memory_presets', 1 FROM products p WHERE p.asin = 'B010'
UNION ALL
SELECT p.id, 'capacity_quarts', 5 FROM products p WHERE p.asin = 'B011'
UNION ALL
SELECT p.id, 'temperature_presets', 8 FROM products p WHERE p.asin = 'B011'
UNION ALL
SELECT p.id, 'power_watts', 1200 FROM products p WHERE p.asin = 'B012'
UNION ALL
SELECT p.id, 'max_weight_lbs', 50 FROM products p WHERE p.asin = 'B015';

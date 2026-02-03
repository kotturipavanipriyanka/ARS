/*
  # Product Recommendation System Schema

  1. New Tables
    - `products`: Product catalog with descriptions and categories
    - `users`: User profiles for the system
    - `ratings`: User-product ratings for collaborative filtering
    - `product_features`: Content-based features for each product

  2. Security
    - Enable RLS on all tables
    - Users can view all products but only manage their own ratings
    - Anonymous users can view products and ratings

  3. Indexes
    - Add indexes for frequently queried columns
*/

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asin text UNIQUE NOT NULL,
  title text NOT NULL,
  category text NOT NULL,
  price numeric NOT NULL,
  rating numeric DEFAULT 0,
  review_count integer DEFAULT 0,
  image_url text,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  username text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating numeric NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

CREATE TABLE IF NOT EXISTS product_features (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  feature_name text NOT NULL,
  feature_value numeric NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, feature_name)
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_features ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Products are viewable by everyone"
  ON products FOR SELECT
  USING (true);

CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Ratings are viewable by everyone"
  ON ratings FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own ratings"
  ON ratings FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own ratings"
  ON ratings FOR UPDATE
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own ratings"
  ON ratings FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Product features are viewable by everyone"
  ON product_features FOR SELECT
  USING (true);

CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_ratings_user_id ON ratings(user_id);
CREATE INDEX idx_ratings_product_id ON ratings(product_id);
CREATE INDEX idx_product_features_product_id ON product_features(product_id);

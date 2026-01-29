-- Seed script to add all Portland pizzerias with placeholder data
-- Run this in the Supabase SQL Editor

-- First, ensure all pizza styles exist
INSERT INTO pizza_styles (name, slug, description) VALUES
  ('Neapolitan', 'neapolitan', 'Traditional Italian style with wood-fired oven, thin crust, and simple toppings'),
  ('New York', 'new-york', 'Large hand-tossed slices with crispy yet foldable crust'),
  ('Sicilian', 'sicilian', 'Thick, square-cut pizza with fluffy, focaccia-like crust'),
  ('Portland-Style', 'portland-style', 'Creative Pacific Northwest approach with local, seasonal ingredients'),
  ('Detroit', 'detroit', 'Rectangular deep-dish with crispy cheese edges and thick, airy crust'),
  ('New Haven', 'new-haven', 'Thin, charred "apizza" style originating from New Haven, CT'),
  ('Fusion', 'fusion', 'Creative combinations blending pizza with other cuisines')
ON CONFLICT (slug) DO UPDATE SET 
  description = EXCLUDED.description;

-- Get the city_id for Portland (assumes Portland already exists)
DO $$
DECLARE
  portland_id UUID;
  style_neapolitan UUID;
  style_ny UUID;
  style_sicilian UUID;
  style_portland UUID;
  style_detroit UUID;
  style_new_haven UUID;
  style_fusion UUID;
  new_pizzeria_id UUID;
BEGIN
  -- Get Portland city ID
  SELECT id INTO portland_id FROM cities WHERE slug = 'portland';
  
  -- Get style IDs
  SELECT id INTO style_neapolitan FROM pizza_styles WHERE slug = 'neapolitan';
  SELECT id INTO style_ny FROM pizza_styles WHERE slug = 'new-york';
  SELECT id INTO style_sicilian FROM pizza_styles WHERE slug = 'sicilian';
  SELECT id INTO style_portland FROM pizza_styles WHERE slug = 'portland-style';
  SELECT id INTO style_detroit FROM pizza_styles WHERE slug = 'detroit';
  SELECT id INTO style_new_haven FROM pizza_styles WHERE slug = 'new-haven';
  SELECT id INTO style_fusion FROM pizza_styles WHERE slug = 'fusion';

  -- ============================================
  -- TIER 1: NATIONALLY RECOGNIZED
  -- ============================================

  -- Ken's Artisan Pizza (likely exists, skip if so)
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Ken''s Artisan Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Ken''s Artisan Pizza', '304 SE 28th Ave, Portland, OR 97214', 45.5165, -122.6368, '(503) 517-9951', 'https://kensartisan.com/pizza',
      '{"tue": "5-9pm", "wed": "5-9pm", "thu": "5-9pm", "fri": "5-10pm", "sat": "5-10pm", "sun": "4:30-9pm"}',
      'Wood-fired Neapolitan pizzas ranked #27 globally by 50 Top Pizza (2024). James Beard award winner. No reservations.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_neapolitan, true);
  END IF;

  -- Grana Pizza Napoletana
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Grana Pizza Napoletana') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Grana Pizza Napoletana', '2811 E Burnside St, Portland, OR 97214', 45.5228, -122.6367, '--', '--',
      '{"mon": "5-9pm", "tue": "5-9pm", "wed": "5-9pm", "thu": "5-9pm", "fri": "5-9pm", "sat": "5-9pm", "sun": "5-9pm"}',
      'Featured in NYT top 22 US pizzerias. Opened late 2023. Traditional Neapolitan with high demand.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_neapolitan, true);
  END IF;

  -- Apizza Scholls
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Apizza Scholls') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Apizza Scholls', '4741 SE Hawthorne Blvd, Portland, OR 97215', 45.5118, -122.6149, '(503) 233-1286', 'https://www.apizzascholls.com',
      '{"mon": "5-9:30pm", "tue": "5-9:30pm", "wed": "5-9:30pm", "thu": "5-9:30pm", "fri": "5-9:30pm", "sat": "5-9:30pm", "sun": "5-9:30pm"}',
      '20-year Portland institution. Electric + wood-fired neo-Neapolitan. 50 Top Pizza ranked. First-come, first-served.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Lovely's Fifty Fifty
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Lovely''s Fifty Fifty') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Lovely''s Fifty Fifty', '4039 N Mississippi Ave, Portland, OR 97227', 45.5535, -122.6759, '(503) 281-4060', '--',
      '{"tue": "5-10pm", "wed": "5-10pm", "thu": "5-10pm", "fri": "5-10pm", "sat": "5-10pm", "sun": "5-10pm"}',
      'Featured on Netflix Chef''s Table: Pizza. Seasonal, farm-to-table Portland-style. Ice cream too!')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_portland, true);
  END IF;

  -- Nostrana
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Nostrana') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Nostrana', '1401 SE Morrison St, Portland, OR 97214', 45.5174, -122.6522, '(503) 234-2427', '--',
      '{"mon": "5-9pm", "tue": "5-9pm", "wed": "5-9pm", "thu": "5-9pm", "fri": "4:30-10pm", "sat": "4:30-10pm"}',
      '50 Top Pizza ranked. Chef Cathy Whims (6x James Beard nomination). Italian-style. Reservations accepted.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_neapolitan, true);
  END IF;

  -- ============================================
  -- TIER 2: STRONG REGIONAL REPUTATION
  -- ============================================

  -- Pizza Jerk
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Pizza Jerk') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Pizza Jerk', '5028 NE 42nd Ave, Portland, OR 97218', 45.5567, -122.6170, '(503) 284-9333', 'https://www.pizzajerkpdx.com',
      '{"mon": "11:30am-9:30pm", "tue": "11:30am-9:30pm", "wed": "11:30am-9:30pm", "thu": "11:30am-9:30pm", "fri": "11:30am-10pm", "sat": "11:30am-10pm", "sun": "11:30am-9:30pm"}',
      'Bon Appétit best new restaurants 2016. NY-style slices with creative toppings.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Baby Doll Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Baby Doll Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Baby Doll Pizza', '2835 SE Stark St, Portland, OR 97214', 45.5192, -122.6371, '--', '--',
      '{"wed": "4-9pm", "thu": "4-9pm", "fri": "4-9pm", "sat": "12-9pm", "sun": "12-9pm"}',
      'Hand-made everything. NY-style with meticulous attention to detail. Cult following.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Pizza Thief
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Pizza Thief') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Pizza Thief', '3822 N Williams Ave, Portland, OR 97227', 45.5501, -122.6667, '--', '--',
      '{"tue": "5-9pm", "wed": "5-9pm", "thu": "5-9pm", "fri": "5-10pm", "sat": "5-10pm", "sun": "5-9pm"}',
      'NY-style slices with two Portland locations. Known for quality ingredients.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Oven & Shaker
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Oven and Shaker') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Oven and Shaker', '1134 NW Everett St, Portland, OR 97209', 45.5249, -122.6831, '--', '--',
      '{"mon": "11:30am-10pm", "tue": "11:30am-10pm", "wed": "11:30am-10pm", "thu": "11:30am-10pm", "fri": "11:30am-11pm", "sat": "11:30am-11pm", "sun": "11:30am-10pm"}',
      'Wood-fired pizzas in the Pearl District. From the team behind Nostrana.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_neapolitan, true);
  END IF;

  -- East Glisan Pizza Lounge
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'East Glisan Pizza Lounge') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'East Glisan Pizza Lounge', '8001 NE Glisan St, Portland, OR 97213', 45.5267, -122.5773, '--', '--',
      '{"tue": "4-9pm", "wed": "4-9pm", "thu": "4-9pm", "fri": "4-10pm", "sat": "4-10pm", "sun": "4-9pm"}',
      'Neighborhood spot with NY and Detroit style options. Great cocktail program.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_detroit, true);
  END IF;

  -- Boxcar Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Boxcar Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Boxcar Pizza', '2903 SE Division St, Portland, OR 97202', 45.5048, -122.6385, '--', '--',
      '{"wed": "5-9pm", "thu": "5-9pm", "fri": "5-9pm", "sat": "5-9pm", "sun": "5-9pm"}',
      'Detroit-style vegan pizzeria. Crispy cheese edges and creative plant-based toppings.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_detroit, true);
  END IF;

  -- Dimo's Apizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Dimo''s Apizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Dimo''s Apizza', '1965 W Burnside St, Portland, OR 97209', 45.5225, -122.6943, '--', '--',
      '{"tue": "4-9pm", "wed": "4-9pm", "thu": "4-9pm", "fri": "4-10pm", "sat": "12-10pm", "sun": "12-9pm"}',
      'New Haven-style "apizza" with thin, charred crust. Coal-fired flavor.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_new_haven, true);
  END IF;

  -- Hapa Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Hapa Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Hapa Pizza', '4245 SE Belmont St, Portland, OR 97215', 45.5162, -122.6192, '--', '--',
      '{"wed": "5-9pm", "thu": "5-9pm", "fri": "5-9pm", "sat": "5-9pm", "sun": "5-9pm"}',
      'Neapolitan-style with Asian influences. Featured in NYT top 22 US pizzerias.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_neapolitan, true);
  END IF;

  -- ============================================
  -- TIER 3: NOTABLE
  -- ============================================

  -- Ranch Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Ranch Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Ranch Pizza', '3003 SE Division St, Portland, OR 97202', 45.5048, -122.6351, '--', '--',
      '{"thu": "5-9pm", "fri": "5-9pm", "sat": "5-9pm", "sun": "5-9pm"}',
      'Decadent Sicilian/Detroit style. Thick, fluffy crust with creative toppings.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_sicilian, true);
  END IF;

  -- Dove Vivi
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Dove Vivi') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Dove Vivi', '2727 NE Glisan St, Portland, OR 97232', 45.5267, -122.6394, '--', '--',
      '{"mon": "4-9pm", "tue": "4-9pm", "wed": "4-9pm", "thu": "4-9pm", "fri": "4-9pm", "sat": "12-9pm", "sun": "12-9pm"}',
      'Signature cornmeal-crust pizza. Portland original since 2007. Unique, crunchy texture.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_portland, true);
  END IF;

  -- Sizzle Pie
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Sizzle Pie') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Sizzle Pie', '624 E Burnside St, Portland, OR 97214', 45.5229, -122.6570, '--', '--',
      '{"mon": "11am-11pm", "tue": "11am-11pm", "wed": "11am-11pm", "thu": "11am-11pm", "fri": "11am-12am", "sat": "11am-12am", "sun": "11am-11pm"}',
      'Portland mini-chain with great vegan options. NY-style slices. Late night pizza.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Scottie's Pizza Parlor
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Scottie''s Pizza Parlor') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Scottie''s Pizza Parlor', '2128 SE Division St, Portland, OR 97202', 45.5048, -122.6466, '(971) 544-7878', 'https://www.scottiespizzaparlor.com',
      '{"wed": "12-8pm", "thu": "12-8pm", "fri": "12-8pm", "sat": "12-8pm"}',
      'Naturally-leavened dough, locally-sourced ingredients. Nostalgic parlor vibes.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Escape from New York Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Escape from New York Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Escape from New York Pizza', '622 NW 23rd Ave, Portland, OR 97210', 45.5282, -122.6982, '--', '--',
      '{"mon": "11am-10pm", "tue": "11am-10pm", "wed": "11am-10pm", "thu": "11am-10pm", "fri": "11am-11pm", "sat": "11am-11pm", "sun": "11am-10pm"}',
      'Portland''s original slice shop since 1983. Classic NY-style. A Portland institution.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Life of Pie Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Life of Pie Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Life of Pie Pizza', '3632 N Williams Ave, Portland, OR 97227', 45.5497, -122.6667, '(503) 820-0083', 'https://lifeofpiepizza.com',
      '{"mon": "11am-10pm", "tue": "11am-10pm", "wed": "11am-10pm", "thu": "11am-10pm", "fri": "11am-10pm", "sat": "11am-10pm", "sun": "11am-10pm"}',
      'Friendly neighborhood pizzeria with daily happy hour. Multiple locations.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Red Sauce Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Red Sauce Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Red Sauce Pizza', '4033 NE Fremont St, Portland, OR 97212', 45.5483, -122.6193, '--', '--',
      '{"tue": "4-9pm", "wed": "4-9pm", "thu": "4-9pm", "fri": "4-9pm", "sat": "12-9pm", "sun": "12-9pm"}',
      'Beaumont neighborhood gem. Quality NY-style with neighborhood charm.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Flying Pie Pizzeria
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Flying Pie Pizzeria') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Flying Pie Pizzeria', '7804 SE Stark St, Portland, OR 97215', 45.5192, -122.5823, '--', '--',
      '{"mon": "11am-9pm", "tue": "11am-9pm", "wed": "11am-9pm", "thu": "11am-9pm", "fri": "11am-10pm", "sat": "11am-10pm", "sun": "11am-9pm"}',
      'Long-standing Portland casual pizza spot. Family-friendly atmosphere.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- ============================================
  -- SPECIALTY/FUSION
  -- ============================================

  -- Pizza Creature
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Pizza Creature') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Pizza Creature', 'St. Johns neighborhood, Portland, OR', 45.5910, -122.7545, '--', '--',
      '{"fri": "5-9pm", "sat": "12-9pm", "sun": "12-6pm"}',
      'Food cart in St. Johns serving creative, seasonal pizza. Fusion approach.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_fusion, true);
  END IF;

  -- Fusion Indian Cuisine & Curry Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Fusion Indian Cuisine & Curry Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Fusion Indian Cuisine & Curry Pizza', '2028 SE 82nd Ave, Portland, OR 97216', 45.5048, -122.5783, '--', '--',
      '{"mon": "11am-9pm", "tue": "11am-9pm", "wed": "11am-9pm", "thu": "11am-9pm", "fri": "11am-10pm", "sat": "11am-10pm", "sun": "11am-9pm"}',
      'Indian fusion restaurant with curry-topped pizzas. Unique Portland experience.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_fusion, true);
  END IF;

  -- Lombardo's
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Lombardo''s') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Lombardo''s', '3939 N Mississippi Ave, Portland, OR 97227', 45.5521, -122.6759, '--', '--',
      '{"tue": "11:30am-9pm", "wed": "11:30am-9pm", "thu": "11:30am-9pm", "fri": "11:30am-10pm", "sat": "11:30am-10pm", "sun": "11:30am-9pm"}',
      'New Jersey-style tomato pie. Thin crust, tangy sauce on top. East coast transplant.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- ============================================
  -- ADDITIONAL NOTABLE SPOTS
  -- ============================================

  -- Secret Pizza Society
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Secret Pizza Society') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Secret Pizza Society', '3350 SE Division St, Portland, OR 97202', 45.5048, -122.6298, '--', '--',
      '{"wed": "5-9pm", "thu": "5-9pm", "fri": "5-10pm", "sat": "5-10pm", "sun": "5-9pm"}',
      'Underground pizza spot with creative Portland-style offerings.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_portland, true);
  END IF;

  -- Paladin Pie
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Paladin Pie') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Paladin Pie', '1336 SE Grand Ave, Portland, OR 97214', 45.5137, -122.6600, '--', '--',
      '{"wed": "4-9pm", "thu": "4-9pm", "fri": "4-10pm", "sat": "12-10pm", "sun": "12-9pm"}',
      'Creative Portland-style pizza with local ingredients.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_portland, true);
  END IF;

  -- Caro Amico
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Caro Amico') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Caro Amico', '3606 SW Barbur Blvd, Portland, OR 97239', 45.4842, -122.6946, '--', '--',
      '{"tue": "5-9pm", "wed": "5-9pm", "thu": "5-9pm", "fri": "5-10pm", "sat": "5-10pm", "sun": "4-9pm"}',
      'Traditional Neapolitan pizza with Italian imports. Cozy neighborhood spot.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_neapolitan, true);
  END IF;

  -- Old Town Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Old Town Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Old Town Pizza', '226 NW Davis St, Portland, OR 97209', 45.5250, -122.6723, '--', '--',
      '{"mon": "11:30am-9pm", "tue": "11:30am-9pm", "wed": "11:30am-9pm", "thu": "11:30am-9pm", "fri": "11:30am-10pm", "sat": "11:30am-10pm", "sun": "11:30am-9pm"}',
      'Historic Portland pizzeria in Old Town. Rumored to be haunted! Classic pies since 1974.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Gracie's Apizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Gracie''s Apizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Gracie''s Apizza', '7304 N Lombard St, Portland, OR 97203', 45.5832, -122.7323, '--', '--',
      '{"wed": "4-9pm", "thu": "4-9pm", "fri": "4-9pm", "sat": "4-9pm", "sun": "4-9pm"}',
      'St. Johns neighborhood pizza. NY-style with local character.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

  -- Atlas Pizza
  IF NOT EXISTS (SELECT 1 FROM pizzerias WHERE name = 'Atlas Pizza') THEN
    INSERT INTO pizzerias (city_id, name, address, lat, lng, phone, website, hours, description)
    VALUES (portland_id, 'Atlas Pizza', '1712 SE Hawthorne Blvd, Portland, OR 97214', 45.5118, -122.6508, '--', '--',
      '{"mon": "11am-10pm", "tue": "11am-10pm", "wed": "11am-10pm", "thu": "11am-10pm", "fri": "11am-11pm", "sat": "11am-11pm", "sun": "11am-10pm"}',
      'Hawthorne neighborhood pizzeria. NY-style slices and whole pies.')
    RETURNING id INTO new_pizzeria_id;
    INSERT INTO pizzeria_styles (pizzeria_id, style_id, is_primary) VALUES (new_pizzeria_id, style_ny, true);
  END IF;

END $$;

-- Verify the data
SELECT 
  p.name, 
  ps.name as style,
  p.address
FROM pizzerias p
LEFT JOIN pizzeria_styles pst ON p.id = pst.pizzeria_id
LEFT JOIN pizza_styles ps ON pst.style_id = ps.id
ORDER BY ps.name, p.name;

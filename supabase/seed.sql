-- Seed Initial System Templates
INSERT INTO templates (id, user_id, name, category, description, configuration)
VALUES 
(
  'a1111111-1111-1111-1111-111111111111',
  NULL,
  'Instant Price & Catalog Response',
  'PRICE_ENQUIRY',
  'Automatically replies when users ask for pricing, cost, or catalog details.',
  '{"trigger_keywords": ["price", "cost", "how much", "rate", "catalog"], "reply_text": "Hey! Thanks for reaching out. Here is our complete price guide and service menu: https://example.com/pricing Let us know if you need any custom options!", "action_type": "SEND_LINK", "link_url": "https://example.com/pricing", "link_label": "View Price List"}'::jsonb
),
(
  'b2222222-2222-2222-2222-222222222222',
  NULL,
  'Lead Capture & Free Consultation',
  'LEAD_ENQUIRY',
  'Captures prospective client contact info and schedules an introductory call.',
  '{"trigger_keywords": ["book", "call", "consult", "hire", "work together"], "reply_text": "We would love to collaborate! You can lock in a complimentary 15-minute discovery call directly on our calendar here: https://calendly.com/sample", "action_type": "SEND_LINK", "link_url": "https://calendly.com/sample", "link_label": "Schedule Discovery Call"}'::jsonb
),
(
  'c3333333-3333-3333-3333-333333333333',
  NULL,
  'Creator Freebie & Resource Drop',
  'CREATOR_RESOURCE',
  'Delivers your cheat sheet, Notion template, or preset pack when followers comment or DM.',
  '{"trigger_keywords": ["guide", "freebie", "template", "link", "resource", "download"], "reply_text": "Woohoo! Here is the direct access link to the resource you requested: https://example.com/freebie Enjoy it and drop a comment with your takeaways!", "action_type": "SEND_LINK", "link_url": "https://example.com/freebie", "link_label": "Download Free Resource"}'::jsonb
),
(
  'd4444444-4444-4444-4444-444444444444',
  NULL,
  'Operating Hours & Office Location',
  'BUSINESS_HOURS',
  'Shares current opening times, support email, and emergency contact details.',
  '{"trigger_keywords": ["hours", "open", "timing", "location", "address", "support"], "reply_text": "We are open Monday through Friday, 9:00 AM – 6:00 PM EST. Our studio is located at 100 Tech Plaza. For urgent support, email support@techiedmtool.com.", "action_type": "SEND_DM"}'::jsonb
),
(
  'e5555555-5555-5555-5555-555555555555',
  NULL,
  'VIP Discount Code Delivery',
  'PRODUCT_INFO',
  'Provides an exclusive welcome discount code to new followers and DM inquiries.',
  '{"trigger_keywords": ["coupon", "discount", "code", "deal", "promo"], "reply_text": "Thanks for being part of our community! Use code VIP20 at checkout for 20% off your first purchase: https://example.com/shop", "action_type": "SEND_LINK", "link_url": "https://example.com/shop", "link_label": "Claim 20% Off"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

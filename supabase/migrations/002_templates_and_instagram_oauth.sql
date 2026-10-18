-- =========================================================================
-- TechieDMTool — Supabase SQL Migration: Templates Full CRUD & Instagram Accounts
-- Run this script directly in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/graprhduilzulaagbhdx/sql/new
-- =========================================================================

-- 1. Ensure UUID Extension is Active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Templates Table with User-Specific & System Blueprints
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE, -- NULL for public system templates
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'PRICE_ENQUIRY', 
    'PRODUCT_INFO', 
    'LEAD_ENQUIRY', 
    'FAQ', 
    'BUSINESS_HOURS', 
    'CREATOR_RESOURCE'
  )),
  description TEXT,
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for speedy lookups by user and category
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON public.templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_category ON public.templates(category);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- 4. Clean up existing template policies to prevent conflicts
DROP POLICY IF EXISTS "Users can view system and their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can insert their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.templates;

-- 5. RLS Policies: View, Insert, Update, Delete
CREATE POLICY "Users can view system and their own templates"
  ON public.templates FOR SELECT
  USING (user_id IS NULL OR auth.uid() = user_id);

CREATE POLICY "Users can insert their own templates"
  ON public.templates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates"
  ON public.templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates"
  ON public.templates FOR DELETE
  USING (auth.uid() = user_id);

-- 6. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_templates_updated_at ON public.templates;
CREATE TRIGGER trigger_templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- 7. Seed Curated Starter Playbooks (System-wide templates where user_id IS NULL)
INSERT INTO public.templates (name, category, description, configuration)
VALUES
(
  'Instant Pricing & Package Guide',
  'PRICE_ENQUIRY',
  'Instantly shares your price list and booking page when customers ask how much you charge.',
  jsonb_build_object(
    'trigger_keywords', jsonb_build_array('price', 'pricing', 'rates', 'how much', 'cost'),
    'reply_text', 'Hey! Thanks for inquiring. Here is our up-to-date pricing guide and services overview: https://techiedmtool.com/pricing',
    'action_type', 'SEND_LINK',
    'link_url', 'https://techiedmtool.com/pricing',
    'link_label', 'View Rate Card'
  )
),
(
  'High-Value Lead & Discovery Call',
  'LEAD_ENQUIRY',
  'Prompts serious clients to book directly onto your calendar without back-and-forth messaging.',
  jsonb_build_object(
    'trigger_keywords', jsonb_build_array('call', 'consult', 'hire', 'work together', 'project'),
    'reply_text', 'We would love to talk about your project! Grab a spot for a free 15-minute strategy session here: https://calendly.com',
    'action_type', 'SEND_LINK',
    'link_url', 'https://calendly.com',
    'link_label', 'Schedule Call'
  )
),
(
  'Viral Freebie & Lead Magnet Dispatch',
  'CREATOR_RESOURCE',
  'The golden creator workflow: automated delivery of cheat sheets, Notion templates, and presets.',
  jsonb_build_object(
    'trigger_keywords', jsonb_build_array('guide', 'freebie', 'template', 'resource', 'ebook'),
    'reply_text', 'Here is your direct download access link! Enjoy it and tag me in your stories with what you build: https://techiedmtool.com/freebie',
    'action_type', 'SEND_LINK',
    'link_url', 'https://techiedmtool.com/freebie',
    'link_label', 'Download Playbook'
  )
),
(
  'Business Hours & Studio Location',
  'BUSINESS_HOURS',
  'Gives instant answers on store opening hours, location address, and emergency support.',
  jsonb_build_object(
    'trigger_keywords', jsonb_build_array('hours', 'open', 'timing', 'address', 'where are you'),
    'reply_text', 'We are open Monday to Friday from 9 AM to 6 PM EST. You can visit our studio at 450 Lexington Ave, Suite 1200.',
    'action_type', 'SEND_DM'
  )
)
ON CONFLICT DO NOTHING;

-- 8. Verify instagram_accounts table has encryption & expiry columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'instagram_accounts' AND column_name = 'encrypted_access_token_reference'
  ) THEN
    ALTER TABLE public.instagram_accounts ADD COLUMN encrypted_access_token_reference TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'instagram_accounts' AND column_name = 'token_expires_at'
  ) THEN
    ALTER TABLE public.instagram_accounts ADD COLUMN token_expires_at TIMESTAMPTZ;
  END IF;
END $$;

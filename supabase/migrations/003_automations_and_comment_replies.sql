-- =========================================================================
-- TechieDMTool — Supabase SQL Migration: Automations Full CRUD & Live Logging
-- Run this script directly in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/graprhduilzulaagbhdx/sql/new
-- =========================================================================

-- 1. Ensure UUID Extension is Active
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Make user_id nullable in automations table so system & template blueprints can be inserted
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'automations' 
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.automations ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

-- Also ensure instagram_account_id is nullable and can accept text / uuid
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' 
      AND table_name = 'automations' 
      AND column_name = 'instagram_account_id'
  ) THEN
    ALTER TABLE public.automations ALTER COLUMN instagram_account_id DROP NOT NULL;
  END IF;
END $$;

-- 3. Create Automations Table if it does not exist
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  instagram_account_id TEXT,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('INCOMING_MESSAGE', 'KEYWORD_MATCH', 'POST_COMMENT', 'STORY_REPLY')),
  configuration JSONB NOT NULL DEFAULT '{}'::jsonb,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('DRAFT', 'ACTIVE', 'PAUSED', 'ERROR')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for instant querying by user and trigger type
CREATE INDEX IF NOT EXISTS idx_automations_user_id ON public.automations(user_id);
CREATE INDEX IF NOT EXISTS idx_automations_status ON public.automations(status);
CREATE INDEX IF NOT EXISTS idx_automations_trigger_type ON public.automations(trigger_type);

-- 4. Automation Executions & Audit Log
CREATE TABLE IF NOT EXISTS public.automation_executions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_id UUID REFERENCES public.automations(id) ON DELETE CASCADE,
  trigger_source TEXT NOT NULL DEFAULT 'INSTAGRAM_COMMENT',
  comment_id TEXT,
  sender_id TEXT,
  sender_username TEXT,
  keyword_matched TEXT,
  reply_sent TEXT,
  status TEXT NOT NULL CHECK (status IN ('SUCCESS', 'FAILED', 'PENDING', 'RATE_LIMITED')),
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_executions_automation_id ON public.automation_executions(automation_id);
CREATE INDEX IF NOT EXISTS idx_executions_created_at ON public.automation_executions(created_at DESC);

-- 5. Enable Row Level Security (RLS)
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automation_executions ENABLE ROW LEVEL SECURITY;

-- 6. Clean up existing policies
DROP POLICY IF EXISTS "Users can view their own automations" ON public.automations;
DROP POLICY IF EXISTS "Users can insert their own automations" ON public.automations;
DROP POLICY IF EXISTS "Users can update their own automations" ON public.automations;
DROP POLICY IF EXISTS "Users can delete their own automations" ON public.automations;

DROP POLICY IF EXISTS "Users can view their automation executions" ON public.automation_executions;
DROP POLICY IF EXISTS "Anyone can insert automation executions" ON public.automation_executions;

-- 7. RLS Policies for automations table
CREATE POLICY "Users can view their own automations"
  ON public.automations FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert their own automations"
  ON public.automations FOR INSERT
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update their own automations"
  ON public.automations FOR UPDATE
  USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can delete their own automations"
  ON public.automations FOR DELETE
  USING (auth.uid() = user_id OR user_id IS NULL);

-- 8. RLS Policies for automation executions
CREATE POLICY "Users can view their automation executions"
  ON public.automation_executions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert automation executions"
  ON public.automation_executions FOR INSERT
  WITH CHECK (true);

-- 9. Auto-update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_automations_updated_at ON public.automations;
CREATE TRIGGER trigger_automations_updated_at
  BEFORE UPDATE ON public.automations
  FOR EACH ROW
  EXECUTE PROCEDURE public.handle_updated_at();

-- 10. Seed the active "INSTAGRAM AND YOUTUBE VIDEOS DOWNLOAD" automation
INSERT INTO public.automations (name, description, trigger_type, configuration, status)
VALUES (
  'INSTAGRAM AND YOUTUBE VIDEOS DOWNLOAD',
  'ENJOY...!',
  'POST_COMMENT',
  jsonb_build_object(
    'trigger', jsonb_build_object('type', 'POST_COMMENT'),
    'conditions', jsonb_build_array(
      jsonb_build_object(
        'id', 'cond_1',
        'type', 'KEYWORD',
        'matchType', 'CONTAINS',
        'keywords', jsonb_build_array('link', 'bot', 'LINK', 'BOT', 'Link', 'Bot', 'send link')
      )
    ),
    'actions', jsonb_build_array(
      jsonb_build_object(
        'id', 'act_1',
        'type', 'SEND_LINK',
        'content', 'Hey! Thanks for commenting on our post. Here is your direct access link: https://techiedmtool.com',
        'linkUrl', 'https://techiedmtool.com',
        'linkLabel', 'Download Link'
      )
    ),
    'stats', jsonb_build_object(
      'triggeredCount', 0,
      'repliedCount', 0,
      'failedCount', 0
    )
  ),
  'ACTIVE'
)
ON CONFLICT DO NOTHING;


-- Add missing columns to questions
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS intent jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS answerability_score integer DEFAULT 0;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS is_time_sensitive boolean DEFAULT false;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS ttl_hours integer;
ALTER TABLE public.questions ADD COLUMN IF NOT EXISTS canonical_id uuid REFERENCES public.questions(id);

-- Add missing columns to answers
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS version integer DEFAULT 1;
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS parent_version_id uuid;
ALTER TABLE public.answers ADD COLUMN IF NOT EXISTS references_used jsonb DEFAULT '[]'::jsonb;

-- Add UPDATE policy on questions for ai_status updates
CREATE POLICY "Anyone can update question status" ON public.questions FOR UPDATE TO public USING (true) WITH CHECK (true);

-- Full-text search index
CREATE INDEX IF NOT EXISTS idx_questions_fts ON public.questions USING gin (to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

-- Other useful indexes
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_ai_status ON public.questions(ai_status);

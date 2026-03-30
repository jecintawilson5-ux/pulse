
ALTER TABLE public.questions 
  ADD COLUMN IF NOT EXISTS ai_status text NOT NULL DEFAULT 'pending' CHECK (ai_status IN ('pending', 'completed', 'failed')),
  ADD COLUMN IF NOT EXISTS quality_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'merged', 'archived', 'flagged')),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

ALTER TABLE public.answers
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

CREATE TABLE IF NOT EXISTS public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL,
  content_type text NOT NULL CHECK (content_type IN ('question', 'answer')),
  reporter_session_id text NOT NULL,
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create reports" ON public.reports FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can view reports" ON public.reports FOR SELECT TO public USING (true);

CREATE TABLE IF NOT EXISTS public.activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  action text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert activity" ON public.activity_log FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Anyone can view activity" ON public.activity_log FOR SELECT TO public USING (true);

CREATE INDEX IF NOT EXISTS idx_questions_ai_status ON public.questions(ai_status);
CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_created_at ON public.questions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_session ON public.activity_log(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_created ON public.activity_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_questions_fts ON public.questions USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '')));

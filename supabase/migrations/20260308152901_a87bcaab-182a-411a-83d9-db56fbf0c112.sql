
-- Create contact_messages table
CREATE TABLE public.contact_messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL DEFAULT '',
  message text NOT NULL,
  source_page text NOT NULL DEFAULT '/contact',
  is_read boolean NOT NULL DEFAULT false,
  email_notified boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a contact message (public form)
CREATE POLICY "Public insert contact messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only authenticated users can read messages
CREATE POLICY "Auth read contact messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

-- Only authenticated users can update (mark as read)
CREATE POLICY "Auth update contact messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (true);

-- Only authenticated users can delete
CREATE POLICY "Auth delete contact messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (true);

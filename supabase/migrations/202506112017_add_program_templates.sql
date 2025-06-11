-- Create program_templates table
create table if not exists public.program_templates (
    id uuid primary key default gen_random_uuid(),
    title text not null,
    description text,
    exercises jsonb not null,
    created_at timestamp with time zone default now()
);

-- Enable RLS and allow read-only access
alter table public.program_templates enable row level security;
create policy "Public read program templates" on public.program_templates
    for select using (true);

-- Seed sample templates
insert into public.program_templates (title, description, exercises)
values
  ('Push-Pull-Legs', 'Classic 3-day split focusing on compound lifts.', '[]'::jsonb),
  ('5x5 Strength', 'Linear progression 5×5 program.', '[]'::jsonb),
  ('Full-Body Beginner', 'Three full-body sessions per week for novices.', '[]'::jsonb);

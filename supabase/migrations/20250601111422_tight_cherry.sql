-- Create tables first
create table public.users (
  id uuid references auth.users primary key,
  name text not null,
  email text not null,
  avatar text,
  role text not null default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table public.courses (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_by uuid references public.users(id) not null,
  enrolled_count integer default 0,
  image_url text
);

create table public.documents (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  type text not null,
  url text not null,
  content text,
  course_id uuid,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  uploaded_by uuid references public.users(id) not null,
  processed boolean default false,
  page_count integer,
  thumbnail text
);

create table public.calendar_events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  start_time timestamp with time zone not null,
  end_time timestamp with time zone not null,
  location text,
  type text not null,
  course_id uuid,
  created_by uuid references public.users(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;
alter table public.courses enable row level security;
alter table public.documents enable row level security;
alter table public.calendar_events enable row level security;

-- Create policies for users table
create policy "Users can view their own profile"
  on public.users
  for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on public.users
  for update
  using (auth.uid() = id);

-- Create policies for courses table
create policy "Anyone can view published courses"
  on public.courses
  for select
  using (true);

create policy "Users can create courses"
  on public.courses
  for insert
  with check (auth.uid() = created_by);

create policy "Course creators can update their courses"
  on public.courses
  for update
  using (auth.uid() = created_by);

create policy "Course creators can delete their courses"
  on public.courses
  for delete
  using (auth.uid() = created_by);

-- Create policies for documents table
create policy "Users can view their own documents"
  on public.documents
  for select
  using (auth.uid() = uploaded_by);

create policy "Users can upload documents"
  on public.documents
  for insert
  with check (auth.uid() = uploaded_by);

create policy "Document owners can update their documents"
  on public.documents
  for update
  using (auth.uid() = uploaded_by);

create policy "Document owners can delete their documents"
  on public.documents
  for delete
  using (auth.uid() = uploaded_by);

-- Create policies for calendar_events table
create policy "Users can view their own events"
  on public.calendar_events
  for select
  using (auth.uid() = created_by);

create policy "Users can create events"
  on public.calendar_events
  for insert
  with check (auth.uid() = created_by);

create policy "Event creators can update their events"
  on public.calendar_events
  for update
  using (auth.uid() = created_by);

create policy "Event creators can delete their events"
  on public.calendar_events
  for delete
  using (auth.uid() = created_by);

-- Create storage bucket policies
create policy "Users can upload their own documents"
  on storage.objects
  for insert
  with check (auth.uid() = owner);

create policy "Users can update their own documents"
  on storage.objects
  for update
  using (auth.uid() = owner);

create policy "Users can delete their own documents"
  on storage.objects
  for delete
  using (auth.uid() = owner);

create policy "Anyone can download documents"
  on storage.objects
  for select
  using (bucket_id = 'documents');

-- Create functions for data validation
create or replace function check_course_owner(course_id uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.courses
    where id = course_id and created_by = auth.uid()
  );
end;
$$ language plpgsql security definer;

-- Add check constraints
alter table public.users
  add constraint valid_email check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  add constraint valid_role check (role in ('user', 'admin', 'pro'));

alter table public.calendar_events
  add constraint valid_dates check (end_time > start_time),
  add constraint valid_event_type check (type in ('study', 'exam', 'meeting', 'deadline'));

alter table public.documents
  add constraint valid_document_type check (type in ('pdf', 'docx', 'pptx', 'image', 'text'));

-- Add foreign key relationships
alter table public.documents
  add constraint fk_course
  foreign key (course_id)
  references public.courses(id)
  on delete set null;

alter table public.calendar_events
  add constraint fk_course
  foreign key (course_id)
  references public.courses(id)
  on delete set null;

-- Create indexes for better performance
create index idx_courses_created_by on public.courses(created_by);
create index idx_documents_uploaded_by on public.documents(uploaded_by);
create index idx_calendar_events_created_by on public.calendar_events(created_by);
create index idx_calendar_events_start_time on public.calendar_events(start_time);
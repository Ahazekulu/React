-- ADD VIEWS COLUMN
ALTER TABLE public.connect_posts ADD COLUMN IF NOT EXISTS views_count BIGINT DEFAULT 0;

-- OPTIONAL: Increment function (safer for concurrency)
create or replace function increment_post_view(row_id uuid)
returns void as $$
begin
  update public.connect_posts
  set views_count = views_count + 1
  where id = row_id;
end;
$$ language plpgsql;

NOTIFY pgrst, 'reload schema';

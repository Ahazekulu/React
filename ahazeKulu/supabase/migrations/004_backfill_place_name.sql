-- Backfill place_name for posts and products from place_id
begin;

-- If place_name is NULL, set it to the place's `name` when place_id exists
update public.posts p
set place_name = coalesce((select pl.name from public.places pl where pl.id = p.place_id), p.place_name)
where p.place_name is null or p.place_name = '';

update public.products pr
set place_name = coalesce((select pl.name from public.places pl where pl.id = pr.place_id), pr.place_name)
where pr.place_name is null or pr.place_name = '';

commit;

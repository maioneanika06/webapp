-- Inventory slot rules for your existing public.inventory table.
-- This keeps your current column names:
-- assigned_role, stock_count, low_stock_threshold.

-- Normalize existing data first so constraints can be added safely.
update public.inventory
set stock_count = least(5, greatest(0, coalesce(stock_count, 5))),
    low_stock_threshold = 2,
    assigned_role = case
        when assigned_role in ('VIP', 'Speaker', 'Attendee') then assigned_role
        when lower(assigned_role) = 'vip' then 'VIP'
        when lower(assigned_role) = 'speaker' then 'Speaker'
        else 'Attendee'
    end;

alter table public.inventory
    alter column stock_count set default 5,
    alter column low_stock_threshold set default 2;

do $$
begin
    if not exists (
        select 1
        from pg_constraint
        where conname = 'inventory_event_id_fkey'
          and conrelid = 'public.inventory'::regclass
    ) then
        alter table public.inventory
            add constraint inventory_event_id_fkey
            foreign key (event_id)
            references public.events(id)
            on delete cascade;
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'inventory_slot_number_range'
          and conrelid = 'public.inventory'::regclass
    ) then
        alter table public.inventory
            add constraint inventory_slot_number_range
            check (slot_number between 1 and 6);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'inventory_assigned_role_allowed'
          and conrelid = 'public.inventory'::regclass
    ) then
        alter table public.inventory
            add constraint inventory_assigned_role_allowed
            check (assigned_role in ('VIP', 'Speaker', 'Attendee'));
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'inventory_stock_count_max_5'
          and conrelid = 'public.inventory'::regclass
    ) then
        alter table public.inventory
            add constraint inventory_stock_count_max_5
            check (stock_count between 0 and 5);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'inventory_low_stock_threshold_fixed_2'
          and conrelid = 'public.inventory'::regclass
    ) then
        alter table public.inventory
            add constraint inventory_low_stock_threshold_fixed_2
            check (low_stock_threshold = 2);
    end if;

    if not exists (
        select 1
        from pg_constraint
        where conname = 'inventory_event_slot_unique'
          and conrelid = 'public.inventory'::regclass
    ) then
        alter table public.inventory
            add constraint inventory_event_slot_unique
            unique (event_id, slot_number);
    end if;
end $$;

insert into categories (name, slug) values ('Cybersecurity', 'cybersecurity'), ('Traffic management', 'traffic-management');

with c as (select id, slug from categories)
insert into products (sku, slug, name, brand, category_id, summary, price, currency, warranty)
select v.sku, v.slug, v.name, v.brand, c.id, v.summary, v.price, 'USD', v.warranty
from (values
  ('AE-FW-X200',  'bastion-x200-enterprise-firewall', 'Bastion X200 Enterprise Firewall', 'AegisEdge', 'cybersecurity',      '12 Gbps firewall, 8 x GbE, 1U rack',   2499, '3-year warranty'),
  ('PL-SN-V120',  'pulse-v120-sensor',                'Pulse V120 Sensor',                'Pulse',     'traffic-management', 'Radar vehicle detection sensor',        619, '2-year warranty'),
  ('SH-IPS-N400', 'shield-n400-ips',                  'Shield N400 IPS',                  'Shield',    'cybersecurity',      'Intrusion prevention appliance',       3850, '3-year warranty'),
  ('AX-SC-T800',  'axis-t800-signal-controller',      'Axis T800 Signal Controller',      'Axis',      'traffic-management', 'Adaptive traffic signal controller',   8950, '5-year warranty')
) as v(sku, slug, name, brand, cat, summary, price, warranty)
join c on c.slug = v.cat;

insert into inventory (product_id, on_hand, reorder_level)
select id, case sku when 'AE-FW-X200' then 24 when 'PL-SN-V120' then 3 when 'SH-IPS-N400' then 12 else 6 end,
            case sku when 'AE-FW-X200' then 8 when 'PL-SN-V120' then 10 when 'SH-IPS-N400' then 5 else 4 end
from products;

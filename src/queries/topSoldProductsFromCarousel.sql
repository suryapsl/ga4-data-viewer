WITH top_sold_items AS (
  SELECT 
    item.item_id AS sold_item_id,
    ANY_VALUE(item.item_name) AS sold_item_name,
    ANY_VALUE(item.item_brand) AS sold_item_brand,
    ANY_VALUE(item.price) AS sold_item_price,
    ANY_VALUE(item.item_category) AS sold_item_category,
    ANY_VALUE(item.item_category2) AS sold_item_category2,
    COUNT(*) AS purchase_count,
    ROW_NUMBER() OVER (PARTITION BY item.item_category2 ORDER BY COUNT(*) DESC) AS item_rank
  FROM `ppus-web.analytics_313183936.events_*`,
    UNNEST(items) AS item
  WHERE event_name = 'purchase' AND ( item.item_category2 = 'more from brand' OR item.item_category2 = 'similar products' )
  GROUP BY item.item_id, item.item_category, item.item_category2
  QUALIFY item_rank <= 100
),

view_item_details AS (
  SELECT 
    item.item_id AS view_item_id,
    ANY_VALUE((SELECT param.value.string_value 
               FROM UNNEST(item.item_params) AS param 
               WHERE param.key = 'image_url' 
               LIMIT 1)) AS image_url,
    ANY_VALUE((SELECT param.value.string_value 
               FROM UNNEST(item.item_params) AS param 
               WHERE param.key = 'dimension1' 
               LIMIT 1)) AS page_location_from_param
  FROM `ppus-web.analytics_313183936.events_*`,
    UNNEST(items) AS item
  WHERE event_name = 'view_item'
  GROUP BY item.item_id
),

view_item_counts AS (
  SELECT 
    item.item_id AS viewed_item_id,
    ANY_VALUE(item.item_name) AS viewed_item_name, 
    ANY_VALUE(event_param.value.string_value) AS page_location,
    COUNT(*) AS view_count,
    ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS view_count_rank
  FROM `ppus-web.analytics_313183936.events_*`,
    UNNEST(items) AS item,
    UNNEST(event_params) AS event_param
  WHERE event_name = 'view_item' 
    AND event_param.key = 'page_location'
  GROUP BY item.item_id
),

select_item_counts AS (
  SELECT 
    item.item_id AS clicked_item_id,
    item.item_category,
    item.item_category2,
    ANY_VALUE(item.item_list_index) AS clicked_item_index,
    COUNT(*) AS select_item_count
  FROM `ppus-web.analytics_313183936.events_*`,
    UNNEST(items) AS item
  WHERE event_name = 'select_item'
  GROUP BY item.item_id, item.item_category, item.item_category2
),

add_to_cart_counts AS (
  SELECT
    item.item_id AS cart_item_id,
    item.item_category,
    item.item_category2,
    COUNT(*) AS add_to_cart_count
  FROM `ppus-web.analytics_313183936.events_*`,
    UNNEST(items) AS item
  WHERE event_name = 'add_to_cart'
  GROUP BY item.item_id, item.item_category, item.item_category2
)

SELECT 
  top.item_rank,
  top.sold_item_id AS sold_item_id,
  top.sold_item_name AS sold_item_name,
  top.sold_item_brand AS sold_item_brand,
  top.sold_item_price AS sold_item_price,
  top.sold_item_category AS sold_item_category,
  top.sold_item_category2 AS sold_item_category2,
  top.purchase_count,
  sold_details.page_location_from_param AS sold_item_page_location,
  sold_details.image_url AS sold_image_url,
  view.page_location AS parent_page_location,
  view.view_count AS parent_view_count,
  view.view_count_rank AS parent_view_count_rank,
  view.viewed_item_id AS parent_item_id,
  view.viewed_item_name AS parent_item_name,
  parent_details.image_url AS parent_image_url,
  select_counts.clicked_item_index,
  select_counts.select_item_count,
  IFNULL(cart.add_to_cart_count, 0) AS add_to_cart_count,
FROM top_sold_items top
LEFT JOIN view_item_details sold_details
  ON top.sold_item_id = sold_details.view_item_id
LEFT JOIN view_item_counts view
  ON view.page_location LIKE CONCAT('%', SAFE_CAST(top.sold_item_category AS STRING), '%')
LEFT JOIN view_item_details parent_details
  ON view.viewed_item_id = parent_details.view_item_id
LEFT JOIN select_item_counts select_counts
  ON top.sold_item_id = select_counts.clicked_item_id
  AND top.sold_item_category = select_counts.item_category
  AND top.sold_item_category2 = select_counts.item_category2
LEFT JOIN add_to_cart_counts cart
  ON top.sold_item_id = cart.cart_item_id
  AND top.sold_item_category = cart.item_category
  AND top.sold_item_category2 = cart.item_category2
ORDER BY top.item_rank, select_counts.select_item_count DESC;
WITH top_100_items AS (
 SELECT
   item.item_id AS parent_item_id,
   ANY_VALUE(item.item_name) AS parent_item_name,
   ANY_VALUE(item.item_brand) AS parent_item_brand,
   ANY_VALUE(item.price) AS parent_price,
   -- Extract image_url for view_item events
   ANY_VALUE((SELECT param.value.string_value
              FROM UNNEST(item.item_params) AS param
              WHERE param.key = 'image_url'
              LIMIT 1)) AS parent_image_url,
   ANY_VALUE(event_param.value.string_value) AS page_location,
   COUNT(*) AS parent_view_count,
   ROW_NUMBER() OVER (ORDER BY COUNT(*) DESC) AS parent_rank
 FROM `ppus-web.analytics_313183936.events_*`,
   UNNEST(items) AS item,
   UNNEST(event_params) AS event_param
 WHERE event_name = 'view_item'
   AND event_param.key = 'page_location'
   AND _TABLE_SUFFIX BETWEEN '20250408' AND '20250413'
 GROUP BY item.item_id
 LIMIT 100
),


view_item_images AS (
 -- Extract image_url from view_item events for later use in select_item
 SELECT
   item.item_id AS view_item_id,
   ANY_VALUE((SELECT param.value.string_value
              FROM UNNEST(item.item_params) AS param
              WHERE param.key = 'image_url'
              LIMIT 1)) AS image_url
 FROM `ppus-web.analytics_313183936.events_*`,
   UNNEST(items) AS item
 WHERE event_name = 'view_item'
    AND _TABLE_SUFFIX BETWEEN '20250408' AND '20250413'
 GROUP BY item.item_id
),


aggregated_select_items AS (
 SELECT
   item.item_id AS clicked_item_id,
   ANY_VALUE(item.item_name) AS clicked_item_name,
   ANY_VALUE(item.item_brand) AS clicked_item_brand,
   ANY_VALUE(item.price) AS clicked_item_price,
   ANY_VALUE(item.item_list_index) AS clicked_item_index,
   -- Join view_item_images to get image_url from view_item events
   ANY_VALUE(view_item_images.image_url) AS clicked_image_url,
   item.item_category,
   item.item_category2,
   COUNT(*) AS select_item_count
 FROM `ppus-web.analytics_313183936.events_*`,
   UNNEST(items) AS item
 LEFT JOIN view_item_images
   ON item.item_id = view_item_images.view_item_id  -- Get image_url from view_item
 WHERE event_name = 'select_item'
   AND SAFE_CAST(item.item_category AS STRING) LIKE '%.html'
   AND _TABLE_SUFFIX BETWEEN '20250408' AND '20250413'
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
   AND item.item_category IS NOT NULL
   AND item.item_category2 IS NOT NULL
   AND _TABLE_SUFFIX BETWEEN '20250408' AND '20250413'
 GROUP BY item.item_id, item.item_category, item.item_category2
),


purchase_counts AS (
 SELECT
   item.item_id AS purchase_item_id,
   item.item_category,
   item.item_category2,
   COUNT(*) AS purchase_count
 FROM `ppus-web.analytics_313183936.events_*`,
   UNNEST(items) AS item
 WHERE event_name = 'purchase'
   AND item.item_category IS NOT NULL
   AND item.item_category2 IS NOT NULL
   AND _TABLE_SUFFIX BETWEEN '20250408' AND '20250413'
 GROUP BY item.item_id, item.item_category, item.item_category2
)


SELECT
 top_items.parent_rank,
 top_items.parent_view_count,
 top_items.parent_item_id,
 top_items.parent_item_name,
 top_items.parent_item_brand,
 top_items.parent_price,
 top_items.parent_image_url,
 top_items.page_location,
 agg.clicked_item_id,
 agg.clicked_item_name,
 agg.clicked_item_brand,
 agg.clicked_item_price,
 agg.clicked_image_url,
 agg.clicked_item_index,
 agg.item_category,
 agg.item_category2,
 agg.select_item_count,
 IFNULL(cart.add_to_cart_count, 0) AS add_to_cart_count,
 IFNULL(purch.purchase_count, 0) AS purchase_count
FROM aggregated_select_items agg
INNER JOIN top_100_items top_items
 ON top_items.page_location LIKE CONCAT('%', SAFE_CAST(agg.item_category AS STRING), '%')
LEFT JOIN add_to_cart_counts cart
 ON agg.clicked_item_id = cart.cart_item_id
 AND agg.item_category = cart.item_category
 AND agg.item_category2 = cart.item_category2
LEFT JOIN purchase_counts purch
 ON agg.clicked_item_id = purch.purchase_item_id
 AND agg.item_category = purch.item_category
 AND agg.item_category2 = purch.item_category2
ORDER BY top_items.parent_rank, agg.select_item_count DESC;



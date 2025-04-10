export function scrollOnHtmlFast(offsetTop) {
  const htmlElement = document.querySelector('html');
  const bodyElement = document.querySelector('body'); // for safari browser
  htmlElement.scrollTop = offsetTop;
  bodyElement.scrollTop = offsetTop;
}

export const getItemCardData = (item, pageType) => {
  switch (pageType) {
    case 'more-from-brand':
    case 'similar-products':
      return {
        rank: item.item_rank,
        id: item.sold_item_id,
        name: item.sold_item_name,
        brand: item.sold_item_brand,
        price: item.sold_item_price,
        imageUrl: item.sold_image_url,
        //   category: item.sold_item_category2,
        purchaseCount: item.purchase_count,
        url: item.sold_item_page_location,
        // selectCount: item.select_item_count,
        index: item.clicked_item_index,
      };
    case 'top-viewed-detail-carousel':
      return {
        id: item.clicked_item_id,
        name: item.clicked_item_name,
        brand: item.clicked_item_brand,
        price: item.clicked_item_price,
        imageUrl: item.clicked_image_url,
        category: item.item_category2,
        selectCount: item.select_item_count,
        index: item.clicked_item_index,
        addToCartCount: item.add_to_cart_count,
        purchaseCount: item.purchase_count,
      };
    default:
      return {
        id: item.parent_item_id,
        name: item.parent_item_name,
        brand: item.parent_item_brand,
        price: item.parent_price,
        imageUrl: item.parent_image_url,
        rank: item.parent_rank,
        viewCount: item.parent_view_count,
      };
  }
};

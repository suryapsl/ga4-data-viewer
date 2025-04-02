export const processData = (jsonData) => {
    // Group by parent_rank
    const groupedByParent = jsonData.reduce((acc, item) => {
      const parentRank = item.parent_rank;
      if (!acc[parentRank]) {
        acc[parentRank] = [];
      }
      acc[parentRank].push(item);
      return acc;
    }, {});
  
    // For each parent group, further group by item_category2
    const fullyGroupedData = Object.keys(groupedByParent).reduce((acc, parentRank) => {
      const parentItems = groupedByParent[parentRank];
      
      // Take the first item for parent card info
      const parentInfo = parentItems[0];
      
      // Group children by item_category2
      const groupedByCategory = parentItems.reduce((catAcc, item) => {
        const category = item.item_category2;
        if (!catAcc[category]) {
          catAcc[category] = [];
        }
        catAcc[category].push(item);
        return catAcc;
      }, {});
      
      // Sort each category by select_item_count
      Object.keys(groupedByCategory).forEach(category => {
        groupedByCategory[category].sort((a, b) => {
          return parseInt(b.select_item_count) - parseInt(a.select_item_count);
        });
      });
      
      acc[parentRank] = {
        parentInfo,
        categories: groupedByCategory
      };
      
      return acc;
    }, {});
    
    return fullyGroupedData;
  };
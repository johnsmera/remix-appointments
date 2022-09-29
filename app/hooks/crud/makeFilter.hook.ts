import { useState } from "react";

export function useMakeFilter<TElement>(elements: TElement[]) {
  const [originalItems, setOriginalItems] = useState<TElement[]>(elements);
  const [filteredItems, setFilteredItems] = useState<TElement[]>(elements);

  const handleFilter = (param: keyof TElement, filter: string) => {
    if (filter) {
      setFilteredItems(
        originalItems.filter((item) =>
          String(item[param])
            .toLocaleLowerCase()
            ?.includes(filter.toLocaleLowerCase())
        )
      );
    }

    if (!filter || filter === "") {
      setFilteredItems(originalItems);
    }
  };

  const handleClean = () => {
    setFilteredItems(originalItems);
  };

  return {
    handleFilter,
    filteredItems,
    handleClean,
    setFilteredItems,
    setOriginalItems,
  };
}

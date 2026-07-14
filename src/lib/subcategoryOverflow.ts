export const MAX_VISIBLE_SUBCATEGORIES = 5;

export function splitSubcategories<T>(
  subcategories: readonly T[],
  maxVisible = MAX_VISIBLE_SUBCATEGORIES,
): {
  visible: T[];
  overflow: T[];
} {
  const visibleLimit = Math.max(0, maxVisible);

  return {
    visible: subcategories.slice(0, visibleLimit),
    overflow: subcategories.slice(visibleLimit),
  };
}

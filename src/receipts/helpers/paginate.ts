export interface PaginationParams {
  page?: number;
  perpage?: number;
}

export interface PaginationResult<T> {
  items: T[];
  total: number;
  page: number;
  perpage: number;
  totalPages: number;
}

export function paginate<T>(
  allItems: T[],
  total: number,
  { page = 1, perpage = 10 }: PaginationParams = {},
): PaginationResult<T> {
  const start = (page - 1) * perpage;
  const end = start + perpage;

  const paginatedItems = allItems.slice(start, end);
  const totalPages = Math.ceil(total / perpage);

  return {
    items: paginatedItems,
    total,
    page,
    perpage,
    totalPages,
  };
}

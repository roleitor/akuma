import { PAGINATION_DEFAULT_PAGE, PAGINATION_DEFAULT_LIMIT, PAGINATION_MAX_LIMIT } from '@shared/constants/app.constants';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class PaginationUtil {
  static normalizeParams(page?: number, limit?: number): PaginationParams {
    return {
      page: Math.max(1, page ?? PAGINATION_DEFAULT_PAGE),
      limit: Math.min(Math.max(1, limit ?? PAGINATION_DEFAULT_LIMIT), PAGINATION_MAX_LIMIT),
    };
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static toPaginatedResult<T>(items: T[], total: number, page: number, limit: number): PaginatedResult<T> {
    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export class PageResponseDto<T> {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: T[];

  constructor(page: number, limit: number, total: number, data: T[]) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = page === -1 ? 1 : Math.ceil(total / limit);
    this.data = data;
  }
}

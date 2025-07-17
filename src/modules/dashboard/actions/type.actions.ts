export interface UsersResponse {
  users: any[];
  pagination: {
    totalPages: number;
    currentPage: number;
    totalItems: number;
    perPage: number;
  };
}

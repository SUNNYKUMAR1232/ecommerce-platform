export type PaginationQuery = {
  page: number;
  size: number;
};

export type ApiErrorResponse = {
  status: 'error';
  code: string;
  message: string;
  requestId: string;
  correlationId: string;
};

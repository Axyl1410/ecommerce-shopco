export type ApiSuccessResponse<TData> = {
  result: "SUCCESS";
  data: TData;
  message: string;
};

export type ApiErrorResponse = {
  result: "ERROR";
  error: string;
  message?: string;
};

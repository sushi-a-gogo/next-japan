export interface ApiResult<T> {
  retVal?: T;
  hasError?: boolean;
  errorMessage?: string;
}

export function errorApiResult<T>(errorMessage: string): ApiResult<T> {
  return {
    hasError: true,
    errorMessage,
  } as ApiResult<T>;
}

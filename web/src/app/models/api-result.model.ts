export interface ApiResult {
  retVal?: any;
  hasError?: boolean;
  errorMessage?: string;
  errorDetail?: any;
  feedback?: string;
  href?: string;
  queryString?: string;
  method?: string;
  duration?: number;
}

export function errorApiResult(url: string): ApiResult {
  return {
    retVal: { message: `The request to '${url}' failed.` },
    hasError: true,
    errorMessage: 'API Request Error.',
  };
}

export function successApiResult(url: string): ApiResult {
  return {
    retVal: { message: `The request to '${url}' succeeded.` },
    hasError: false,
  };
}

import { AxiosResponse } from 'axios';
export namespace Basic {
  export interface BaseProps<T = any> {
    location: Location & { query: T };
  }
  export interface BaseResponse<T = any> {
    data: T;
    errorMessage: string;
    result: number;
  }

  export interface PaginationResponse {
    pageCount: number;
    pageNo: number;
    pageSize: number;
    totalNum: number;
  }
}

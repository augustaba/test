import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { message, Modal } from 'antd';
import { Basic } from '@/types';
axios.interceptors.request.use(
  req => {
    console.log(req.url, process.env, process.env.platform, '+++++++');
    if (
      req.url?.indexOf('blob') === -1 &&
      process.env.NODE_ENV === 'development'
    ) {
      req.url = req.url.replace(/^(api)*/, 'api');
    }
    return req;
  },
  error => {
    return Promise.resolve(error);
  },
);
axios.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (axios.isCancel(error)) {
      const response = {
        config: {},
        headers: {},
        status: -999,
        statusText: '中断请求',
        data: undefined,
      };
      return Promise.resolve(response);
    }
    return Promise.resolve(error.response);
  },
);
export enum Method {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}
export interface RequestParams {
  method: Method | string;
  url: string;
  payload?: any;
}
export function httpGet<T = any>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.GET,
    ...options,
  } as any);
}
export function httpPost<T>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.POST,
    ...options,
  } as any);
}
export function httpPut<T>(
  url: string,
  data?: any,
  options?: AxiosRequestConfig,
) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.PUT,
    ...options,
  });
}
export function httpDelete<T>(url: string, data?: any) {
  return httpRequest<T>({
    url,
    payload: data,
    method: Method.DELETE,
  });
}
export function httpRequest<T>(
  req: RequestParams,
): Promise<AxiosResponse<Basic.BaseResponse<T>>> {
  return request({
    ...req,
    [req.method === Method.GET || req.method === Method.DELETE
      ? 'params'
      : 'data']: req.payload,
  } as AxiosRequestConfig).then(errorProcess);
}
export default function request(options: AxiosRequestConfig) {
  return axios(options);
}
export function errorProcess(response: AxiosResponse<Basic.BaseResponse>) {
  const { status, data } = response ?? {};
  const tipStatus = [500, 400];
  if (tipStatus.includes(status)) {
    message.error('请确认您的操作或输入是否正确！');
    return response;
  } else if (status === 200) {
    if (data.result !== 100) {
      message.error(data.errorMessage);
      return response;
    }
    return response;
  }
  return response;
}

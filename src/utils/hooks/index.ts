import { ModalProps } from 'antd/lib/modal';
import { useState, useReducer, Reducer, useEffect } from 'react';
import { BaseIConfig } from 'umi';
import { Basic } from '@/types';
import { AxiosPromise, AxiosResponse } from 'axios';

export interface TabsOptions {}

export function useTabs(option: TabsOptions) {
  // const [tab]
}

interface Option {
  showConfirmLoading?: boolean;
  onOk: () => Promise<boolean>;
  onCancel?: () => void;
}

export function useModal({
  showConfirmLoading = false,
  onOk,
  onCancel,
}: Option) {
  const [confirmLoading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);

  const modalProps: ModalProps = {
    confirmLoading,
    visible,
    onCancel: () => {
      setVisible(false);
    },
    onOk: async () => {
      showConfirmLoading && setLoading(true);
      const flag = await onOk();
      showConfirmLoading && setLoading(false);
      if (flag) {
        setVisible(false);
      }
    },
    afterClose: () => {
      onCancel && onCancel();
    },
  };
  const handleVisible = (v: boolean) => {
    setVisible(v);
  };
  return [modalProps, handleVisible] as [ModalProps, (v: boolean) => void];
}

export function useReducerState<T = any>(initState: T) {
  type Dispatch = Partial<T>;
  const reducer = (state: T, action: Dispatch): T => {
    return { ...(state as any), ...(action as any) };
  };
  const [state, setState] = useReducer<Reducer<T, Dispatch>>(
    reducer,
    initState,
  );
  return [state, setState] as [T, (params: Dispatch) => void];
}

export function useRequest<R = any, P extends object = any>(
  p: (params?: P) => Promise<AxiosResponse<Basic.BaseResponse<R>>>,
  options?: {
    initialParams?: P;
    initialData?: R;
    adapterResponse?: (v: R) => any;
  },
) {
  const [_data, setData] = useState<R | undefined>(options?.initialData);
  const [_params, setParams] = useState<P | undefined>(options?.initialParams);
  const [loading, setLoading] = useState(false);
  const run = async (params?: P) => {
    const mergeParams = params ? { ..._params, ...params } : _params;
    setLoading(true);
    const {
      data: { data },
    } = await p(mergeParams);
    setLoading(false);
    setData(options?.adapterResponse?.(data) ?? data);
    setParams(params);
  };
  return {
    run,
    data: _data,
    loading,
  };
}

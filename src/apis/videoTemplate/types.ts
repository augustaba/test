import { Basic } from '@/types';

export namespace VideoTemplate {
  export type Filter = 'desc' | 'asc';
  export type Size = 'vertical' | 'horizontal' | 'square';
  export interface QueryProps {
    pageNo?: number;
    pageSize?: number;
  }
  export interface TemplateListRequestProps extends QueryProps {
    order: 'hotAsc' | 'hotDesc' | 'modifyTimeAsc' | 'modifyTimeDesc';
    size: Size;
    type: 'all' | 'eb';
  }

  export interface TemplateDetailRequestProps {
    id: string;
  }
  export interface AnimationDataProps {
    v: string;
    fr: number;
    ip: number;
    op: number;
    w: number;
    h: number;
    nm: any;
    ddd: number;
    assets: AnimationAssetsProps[];
    fonts?: object;
    layers: AnimationLayerProps[];
    markers: any[];
    chars?: any[];
  }

  export type AnimationTransformProps = {
    a: { a: number; k: number[] };
    p: { a: number; k: number[] };
    s: { a: number; k: number[] };
    r: { a: number; k: number };
    o: { a: number; k: number };
  };

  export type AnimationTextDocumentData = {
    d: {
      k: {
        t: number;
        s: {
          s: number; // font-size
          f: string; // font-family
          t: string; // text-string 文本
          j: number; // Text Justification
          tr: number; // Text Tracking
          lh: number;
          ls: 0;
          fc: number[]; // Text Font Color [0.224, 0.224, 0.224]
        };
      }[];
    };
    a: any[]; // Text animators;
    m: object; // more options
    p: {}; // text Path
  };

  export type AnimationLayerProps =
    | {
        ty: 0; // 预合成图层
        ip: number;
        op: number;
        st: number;
        nm: string;
        ks: AnimationTransformProps; // 旋转变换
        ao: number;
        bm: number;
        ddd: number;
        ind: number;
        cl?: string;
        ln: string;
        hasMask?: number;
        masksProperties?: any[];
        ef?: any[];
        sr: number;
        parent: number;
        refId: string;
        tm: number;
      }
    | {
        ty: 2; // 图片图层
        ks: AnimationTransformProps;
        ao: number;
        bm: number;
        ddd: number;
        ind: number;
        cl?: string;
        ln?: string;
        ip: number;
        op: number;
        st: number;
        nm: string;
        hasMask?: number;
        masksProperties?: any[];
        ef?: any[];
        sr: number;
        parent: number;
        refId: string;
      }
    | {
        ty: 5; // 文字图层
        ks: AnimationTransformProps;
        ao: number;
        bm: number;
        ddd: number;
        ind: number;
        cl: string;
        ln?: string;
        ip: number;
        op: number;
        st: number;
        nm: string;
        hasMask?: number;
        masksProperties?: any[];
        ef?: number;
        sr?: number;
        parent?: number;
        t: AnimationTextDocumentData;
      }
    | { ty: 1; ind: number }
    | { ty: 3; ind: number }
    | { ty: 4; ind: number };

  export type AnimationAssetsProps = {
    id: string;
    w?: number;
    h?: number;
    p?: string;
    u?: string;
    e?: number;
    layers?: AnimationLayerProps[];
  };
  export interface TemplateListResponse
    extends Partial<Basic.PaginationResponse> {
    tempList: RequestTemplateListResponse[];
  }

  export interface RequestTemplateListResponse {
    id: string;
    musicId: string;
    musicUrl: string;
    size: Size;
    templateInfo: string;
  }
  export interface TemplateListResponseProps {
    id: string;
    musicId: string;
    musicUrl: string;
    size: Size;
    templateInfo: AnimationDataProps;
  }

  export interface VideoListRequestProps extends QueryProps {
    order: 'newToOld' | 'oldToNew';
    size: Size;
  }
  export interface VideoDetailRequestProps {
    id: string;
  }
  export interface VideoListResponse extends Partial<Basic.PaginationResponse> {
    videoList: RequestVideoListResponseProps[];
  }

  export interface RequestVideoListResponseProps {
    url: string;
    status: 'loading' | 'fail' | 'success';
    id: string;
    size: Size;
    musicId: string;
    musicUrl: string;
    videoInfo: string;
  }
  export interface VideoListResponseProps {
    url: string;
    status: boolean;
    id: string;
    size: Size;
    musicId: string;
    musicUrl: string;
    videoInfo: AnimationDataProps;
  }

  export interface GetMusicListResponseProps {
    musicList: GetMusicListProps[];
  }

  export interface GetMusicListProps {
    id: string;
    musicUrl: string;
    name: string;
  }

  export interface GenerateVideoRequestProps {
    videoInfo: string;
    musicId: string;
    id?: string;
    size: Size;
    templateId?: string;
    musicUrl: string;
  }

  export interface DeleteVideoRequestProps {
    url: string;
    id: string;
  }
}

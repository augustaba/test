import { httpGet, httpPost, httpDelete } from '@/utils/request';
import { VideoTemplate } from './types';
import { Basic } from '@/types';
import { ImgItemProps } from '@/compoenents/ImagesSpace';
// 获取模板列表
export const chooseTemplateApi = (
  data?: Partial<VideoTemplate.TemplateListRequestProps>,
) => {
  return httpGet<VideoTemplate.TemplateListResponse>(
    '/videoTemplate/list',
    data,
  );
};
// 获取视频列表
export const getVideoListApi = (
  data?: Partial<VideoTemplate.VideoListRequestProps>,
) => {
  return httpGet<VideoTemplate.VideoListResponse>('/video/list', data);
};
// 获取模板详情
export const getTemplateInfoApi = (
  data?: VideoTemplate.TemplateDetailRequestProps,
) => {
  return httpGet<VideoTemplate.RequestTemplateListResponse>(
    '/videoTemplate/info',
    data,
  );
};
// 获取视频详情
export const getVideoDetailApi = (
  data?: VideoTemplate.VideoDetailRequestProps,
) => {
  return httpGet<VideoTemplate.RequestVideoListResponseProps>(
    '/video/info',
    data,
  );
};
// 获取音乐列表
export const getMusicListApi = () => {
  return httpGet<VideoTemplate.GetMusicListResponseProps>('/music/list');
};
// 获取音乐信息
export const getMusicInfoApi = (data: { id: string }) => {
  return httpGet<VideoTemplate.GetMusicListProps>('/music/info', data);
};
// 生成视频
export const generateVideoApi = (
  data?: VideoTemplate.GenerateVideoRequestProps,
) => {
  return httpPost('/video/videoPreview', data);
};
// 删除视频
export const deleteVideoApi = (
  data?: VideoTemplate.DeleteVideoRequestProps,
) => {
  return httpGet('/video/delete', data);
};
// 上传本地图片
export const UploadImages = (data: FormData) => {
  return httpPost('/upload/image', data);
};
// 展示图片空间目录
export const getPictureCategory = () => {
  return httpGet<any>('/picture/category');
};
// 当前目录下图片列表
export const getPictureList = (data?: {
  pageNo?: number;
  pageSize?: number;
  pictureCategoryId?: string;
}) => {
  return httpGet<{
    list: ImgItemProps[];
  }>('/picture/list', data);
};

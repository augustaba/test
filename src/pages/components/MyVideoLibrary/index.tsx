import React, { useState, ReactText, useEffect, useLayoutEffect } from 'react';
import {
  Row,
  Col,
  Divider,
  Table,
  Button,
  Card,
  message,
  Spin,
  Pagination,
  Empty,
  Popconfirm,
} from 'antd';
import TagComp from '../TagComp';
import VideoCard from '../VideoCard';
import Filters, { FiltersProps } from '../Filters';
import { useReducerState, useRequest } from '@/utils/hooks';
import styles from './index.less';
import { VideoTemplate } from '@/apis/videoTemplate/types';
import { getVideoListApi, deleteVideoApi } from '@/apis/videoTemplate';
import { httpGet } from '@/utils/request';
import { JumpToThisPage } from '@/pages/create';
import newInterceptTop from '@/utils/intercept';

export interface MyVideoLibraryProps {}

const defaultPageSize = 10;
const defaultPageNo = 1;

const Tags: {
  label: string;
  id: 'size';
  tags: { id: string; tag: string }[];
}[] = [
  {
    label: '视频尺寸',
    id: 'size',
    tags: [
      {
        id: 'square',
        tag: '方形',
      },
      {
        id: 'vertical',
        tag: '竖版',
      },
      {
        id: 'horizontal',
        tag: '横版',
      },
    ],
  },
];

const UseFilterMap = {
  desc: 'newToOld',
  asc: 'oldToNew',
  empty: '',
};

const filters: FiltersProps['filters'] = [
  {
    key: 'use',
    label: '最近更新',
  },
];

const MyVideoLibrary: React.FC<MyVideoLibraryProps> = props => {
  const [searchData, setSearchData] = useReducerState<
    VideoTemplate.VideoListRequestProps
  >({
    order: 'newToOld',
    size: 'square',
    pageSize: defaultPageSize,
    pageNo: defaultPageNo,
  });
  const [selectVideoIds, setSelectVideoIds] = useState<ReactText[]>([]);
  const [filterValue, setFilterValue] = useState<FiltersProps['value']>({
    key: 'use',
    value: 'desc',
  });
  const [batchStatus, setBatchStatus] = useState<
    'download' | 'delete' | undefined
  >();

  const { data, run, loading } = useRequest<
    VideoTemplate.VideoListResponse,
    VideoTemplate.VideoListRequestProps
  >(getVideoListApi, {
    initialData: {
      videoList: [],
      totalNum: 0,
    },
    adapterResponse: data => ({
      ...data,
      videoList:
        data?.videoList.map(item => ({
          ...item,
          videoInfo: JSON.parse(item.videoInfo),
        })) ?? [],
    }),
  });

  const handleFiltersChange = (v: FiltersProps['value']) => {
    setFilterValue(v);
  };
  useEffect(() => {
    if (filterValue.key === 'use' && [filterValue.value]) {
      setSearchData({
        order: UseFilterMap[
          filterValue.value
        ] as VideoTemplate.VideoListRequestProps['order'],
        pageSize: defaultPageSize,
        pageNo: defaultPageNo,
      });
    }
  }, [filterValue]);
  const handleTagChange = (tagId: ReactText) => (id: ReactText) => {
    setSearchData({
      [tagId]: id,
      pageNo: defaultPageNo,
      pageSize: defaultPageSize,
    });
  };
  const handleDownload = (item: VideoTemplate.VideoListResponseProps) => () => {
    window.open(item.url);
  };
  const handleEdit = (
    item: VideoTemplate.VideoListResponseProps,
  ) => async () => {
    try {
      await newInterceptTop('editVideo');
      JumpToThisPage({
        videoId: item.id,
        from: 'library',
      });
    } catch (e) {}
  };
  const handleDelete = async (item: VideoTemplate.VideoListResponseProps) => {
    const { status } = await deleteVideoApi({
      url: item.url,
      id: item.id,
    });
    if (status >= 200 && status < 300) {
      message.success('删除成功');
      run(searchData);
    }
  };
  const handleToBatchDownload = () => {
    setBatchStatus('download');
    console.log(!!'download');
  };
  const handleToBatchDelete = () => {
    setBatchStatus('delete');
  };
  const handleConfirmDownload = () => {};
  const handleConfirmDelete = () => {};
  const handleCancel = () => {
    setBatchStatus(undefined);
  };
  const handleSelectVideo = (id: string) => (checked?: boolean) => {
    console.log(id);
    setSelectVideoIds(prev => {
      return checked ? prev.concat(id) : prev.filter(item => id !== item);
    });
  };

  const handlePaginationChange = (page: number) => {
    setSearchData({
      pageNo: page,
    });
  };

  const handlePageSizeChange = (current: number, size: number) => {
    console.log(current, size);
    setSearchData({
      pageSize: size,
    });
  };

  useEffect(() => {
    run(searchData);
  }, [searchData]);

  useLayoutEffect(() => {
    // @ts-ignore
    window?.RayCloud?.util?.ap({ point: '18.24850.50934.50937' });
  }, []);

  return (
    <div>
      <Row className="mt20">
        {Tags.map(({ label, id, tags }) => (
          <Col key={id} span={24} className="mb12">
            <TagComp
              tagId={id}
              tags={tags}
              label={label}
              checkedTag={searchData[id]}
              onChange={handleTagChange(id)}
            />
          </Col>
        ))}
      </Row>
      <Divider type="horizontal" className="mt8 mb20" />
      <Filters
        filters={filters}
        value={filterValue}
        onChange={handleFiltersChange}
        className="mb16"
      />
      {/* <div className="mb16 flex-between">
        <div>
          <Filters
            filters={filters}
            value={filterValue}
            onChange={handleFiltersChange}
          />
        </div>
        <div className="">
          {batchStatus === 'download' ? (
            <>
              <Button
                type="primary"
                className="mr12"
                onClick={handleConfirmDownload}
              >
                确认下载
              </Button>
              <Button className="mr12" onClick={handleCancel}>
                取消
              </Button>
            </>
          ) : batchStatus === 'delete' ? (
            <>
              <Button
                type="primary"
                className="mr12"
                onClick={handleConfirmDelete}
              >
                确认删除
              </Button>
              <Button className="mr12" onClick={handleCancel}>
                取消
              </Button>
            </>
          ) : (
            <>
              <Button
                type="primary"
                className="mr12"
                onClick={handleToBatchDownload}
              >
                批量下载
              </Button>
              <Button className="mr12" onClick={handleToBatchDelete}>
                批量删除
              </Button>
            </>
          )}
        </div>
      </div> */}
      <Spin spinning={loading}>
        <Row gutter={24}>
          {data?.videoList.length ? (
            data?.videoList.map(item => (
              <Col key={item.id} className="mb16">
                <VideoCard
                  status={item.status}
                  animationData={{ ...item, templateInfo: item.videoInfo }}
                  key={item.id}
                  checkedStatus={!!batchStatus}
                  onSelect={handleSelectVideo(item.id)}
                  checked={selectVideoIds.includes(item.id)}
                >
                  <Button
                    type="primary"
                    className="mr12"
                    size="small"
                    onClick={handleDownload(item)}
                    disabled={item.status !== 'success'}
                  >
                    下载
                  </Button>
                  <Button
                    className="mr12"
                    size="small"
                    onClick={handleEdit(item)}
                    disabled={item.status === 'loading'}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="此操作不可撤销，确认删除？"
                    onConfirm={async () => {
                      handleDelete(item);
                    }}
                    disabled={item.status === 'loading'}
                  >
                    <Button size="small" disabled={item.status === 'loading'}>
                      删除
                    </Button>
                  </Popconfirm>
                </VideoCard>
              </Col>
            ))
          ) : (
            <Col span="24">
              <Empty />
            </Col>
          )}
        </Row>
        <Row justify="end">
          <Col>
            <Pagination
              showQuickJumper={true}
              current={searchData.pageNo}
              pageSize={searchData.pageSize}
              showSizeChanger
              onShowSizeChange={handlePageSizeChange}
              onChange={handlePaginationChange}
              total={data?.totalNum ?? 0}
            />
          </Col>
        </Row>
      </Spin>
    </div>
  );
};
export default MyVideoLibrary;

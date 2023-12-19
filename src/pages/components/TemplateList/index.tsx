import React, {
  useState,
  ReactText,
  useEffect,
  useReducer,
  useLayoutEffect,
} from 'react';
import VideoCard from '../VideoCard';
import TagComp from '../TagComp';
import { Row, Col, Divider, Button, Spin, Pagination, Empty } from 'antd';
import FilterComp, { Filter } from '../FilterComp';
import { useReducerState, useRequest } from '@/utils/hooks';
import { VideoTemplate } from '@/apis/videoTemplate/types';
import Filters, { FiltersProps } from '../Filters';
import { chooseTemplateApi } from '@/apis/videoTemplate';
import Cookies from 'js-cookie';
import newInterceptTop from '@/utils/intercept';

const defaultPageSize = 10;
const defaultPageNo = 1;

export interface TemplateListProps {
  onUse: (v: VideoTemplate.TemplateListResponseProps) => void;
}
const Tags: {
  label: string;
  id: 'type' | 'size';
  tags: {
    id: string;
    tag: string;
  }[];
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
  {
    label: '行业类型',
    id: 'type',
    tags: [
      {
        id: 'all',
        tag: '全部行业',
      },
      {
        id: 'eb',
        tag: '电商',
      },
    ],
  },
];

const filters: FiltersProps['filters'] = [
  {
    key: 'hot',
    label: '使用最多',
  },
  {
    key: 'modifyTime',
    label: '最近更新',
  },
];

const HotFilterMap = {
  desc: 'hotDesc',
  asc: 'hotAsc',
  empty: '',
};

const ModifyTimeMap = {
  desc: 'modifyTimeDesc',
  asc: 'modifyTimeAsc',
  empty: '',
};

const TemplateList: React.FC<TemplateListProps> = props => {
  const [searchData, setSearchData] = useReducerState<
    VideoTemplate.TemplateListRequestProps
  >({
    order: 'hotDesc',
    size: 'square',
    type: 'all',
    pageSize: 10,
    pageNo: 1,
  });
  const [filterValue, setFilterValue] = useState<FiltersProps['value']>({
    key: 'hot',
    value: 'desc',
  });
  const { data, run, loading } = useRequest<
    VideoTemplate.TemplateListResponse,
    VideoTemplate.TemplateListRequestProps
  >(chooseTemplateApi, {
    initialData: {
      tempList: [],
      totalNum: 2,
    },
    adapterResponse: data => ({
      ...data,
      tempList:
        data?.tempList.map(item => ({
          ...item,
          templateInfo: JSON.parse(item.templateInfo),
        })) ?? [],
    }),
  });
  const handleUse = (
    v: VideoTemplate.TemplateListResponseProps,
  ) => async () => {
    // if (Cookies.get('trueVersion') >= 4) {

    // } else {
    //   // @ts-ignore
    //   // window.upgradeDialog.create('makeVideoDemo');

    // }
    try {
      await newInterceptTop('makeVideoDemo');
      props.onUse && props.onUse(v);
    } catch (e) {}
  };
  const handleTagChange = (tagId: ReactText) => (id: ReactText) => {
    console.log(tagId, id);
    setSearchData({
      [tagId]: id,
      pageSize: defaultPageSize,
      pageNo: defaultPageNo,
    });
  };

  const handleFiltersChange = (v: FiltersProps['value']) => {
    setFilterValue(v);
  };

  const handlePaginationChange = (page: number) => {
    setSearchData({
      pageNo: page,
    });
  };

  const handlePageSizeChange = (current: number, size: number) => {
    setSearchData({
      pageSize: size,
    });
  };

  useEffect(() => {
    console.log(searchData);
    run(searchData);
  }, [searchData]);

  useEffect(() => {
    if (filterValue.key === 'hot' && HotFilterMap[filterValue.value]) {
      setSearchData({
        order: HotFilterMap[
          filterValue.value
        ] as VideoTemplate.TemplateListRequestProps['order'],
        pageNo: defaultPageNo,
        pageSize: defaultPageSize,
      });
      return;
    }
    if (filterValue.key === 'modifyTime' && ModifyTimeMap[filterValue.value]) {
      setSearchData({
        order: HotFilterMap[
          filterValue.value
        ] as VideoTemplate.TemplateListRequestProps['order'],
        pageNo: defaultPageNo,
        pageSize: defaultPageSize,
      });
      return;
    }
  }, [filterValue]);

  useLayoutEffect(() => {
    window.RayCloud?.util?.ap?.({ point: '18.24850.50934.50935' });
  }, []);

  return (
    <div>
      <Row className="mt20">
        {Tags.map(({ label, id, tags }) => (
          <Col key={id} span={24} className="mb12">
            <TagComp
              tags={tags}
              label={label}
              checkedTag={searchData[id]}
              onChange={handleTagChange(id)}
            />
          </Col>
        ))}
      </Row>
      <Divider type="horizontal" className="mt8 mb20" />
      <div className="mb16">
        <Filters
          filters={filters}
          value={filterValue}
          onChange={handleFiltersChange}
        />
      </div>
      <Spin spinning={loading}>
        <Row gutter={24}>
          {!!data?.tempList.length ? (
            data?.tempList.map(item => (
              <Col key={item.id} className="mb16">
                <VideoCard
                  animationData={item}
                  status={'success'}
                  key={item.id}
                >
                  <Button type="primary" onClick={handleUse(item)}>
                    开始制作
                  </Button>
                </VideoCard>
              </Col>
            ))
          ) : (
            <Col span="24">
              <Empty />
            </Col>
          )}
        </Row>
      </Spin>
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
    </div>
  );
};
export default TemplateList;

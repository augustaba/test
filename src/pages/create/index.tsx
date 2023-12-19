import React, {
  ReactText,
  useEffect,
  useState,
  ReactType,
  createContext,
  useRef,
  useContext,
  useCallback,
} from 'react';
import { Basic } from '@/types';
import { history } from 'umi';
import {
  Card,
  Row,
  Col,
  Select,
  Button,
  message,
  Spin,
  Modal,
  Popconfirm,
} from 'antd';
import styles from './index.less';
import { getAssetData } from '../components/LottieVideoComp';
import UploadImgItem from './components/UploadImgItem';
import PreviewLottie from './components/PreviewLottie';
import {
  LottieContext,
  VideoCardAnimationProps,
} from '../components/VideoCard';
import { useReducerState } from '@/utils/hooks';
import _ from 'lodash';
import { VideoTemplate } from '@/apis/videoTemplate/types';
import {
  getVideoDetailApi,
  getTemplateInfoApi,
  getMusicListApi,
  generateVideoApi,
} from '@/apis/videoTemplate';
import { CreateTabProps } from '../components/CreateTab';
import { JumpToThisPage as JumpToIndexPage } from '..';
import TextEditor from './components/TextEditor';
import { httpGet } from '@/utils/request';

enum LayerStatusEnum {
  'dz-wenzi1' = 5,
  'dz-tupian3' = 2,
}

type AssetSourceProps =
  | {
      ty: 5;
      ip: number;
      op: number;
      assetId: string;
      assetValue: VideoTemplate.AnimationTextDocumentData['d']['k'];
      in: 'layers' | 'assets';
      ind: number;
    }
  | {
      ty: 2;
      ip: number;
      op: number;
      assetId: string;
      assetValue: string;
      in: 'layers' | 'assets';
      ind?: number;
    };

interface Query {
  templateId?: string;
  videoId?: string;
  from?: CreateTabProps['activeTab'];
}

export interface CreatePageProps extends Basic.BaseProps<Query> {}

export const JumpToThisPage = (query: Query) => {
  history.push({
    pathname: '/create',
    query,
  });
};

export function getLayers(animationData: VideoTemplate.AnimationDataProps) {
  const { layers, assets } = animationData;
  return layers.reduce((prevVal, curVal, curIdx) => {
    if (curVal.ty === 1 || curVal.ty === 3 || curVal.ty === 4) {
      return prevVal;
    }
    if (curVal.ty === 5) {
      return prevVal.concat({
        ty: curVal.ty,
        ip: curVal.ip,
        op: curVal.op,
        assetId: `layer${curIdx}`,
        assetValue: curVal.t.d.k,
        ind: curVal.ind,
        in: 'layers',
      });
    } else {
      let r: AssetSourceProps[] = [];
      getComp(curVal.refId, r);
      const a = r.map(item => ({
        ...item,
        ip: curVal.ip,
        op: curVal.op,
      }));
      return prevVal.concat(...a);
    }
  }, [] as AssetSourceProps[]);

  function getComp(
    refId: string,
    assetList: Omit<AssetSourceProps, 'op' | 'ip'>[],
  ) {
    const asset = assets.find(item => item.id === refId);
    if (asset) {
      if (asset.p) {
        assetList.push({
          ty: 2,
          assetId: asset.id,
          assetValue: asset.p,
          in: 'assets',
        });
        return;
      }
      if (asset.layers) {
        for (let i = 0; i < asset.layers.length; i++) {
          const ele = asset.layers[i];
          if (ele.ty === 1 || ele.ty === 3 || ele.ty === 4) {
            continue;
          }
          if (ele.ty === 5) {
            assetList.push({
              ty: 5,
              assetId: asset.id,
              assetValue: ele.t.d.k,
              ind: ele.ind,
              in: 'assets',
            });
          } else {
            getComp(ele.refId, assetList);
          }
        }
      }
    }
  }
}

const CreatePage: React.FC<CreatePageProps> = props => {
  const [animationData, setAnimationData] = useReducerState<
    VideoCardAnimationProps | undefined
  >(undefined);
  const [images, setImages] = useState<
    ReturnType<typeof getAssetData>['images']
  >([]);
  const [musicList, setMusicList] = useState<VideoTemplate.GetMusicListProps[]>(
    [],
  );
  const LottieContextRef = useContext(LottieContext);
  const [assetSource, setAssetSource] = useState<AssetSourceProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleBack = () => {
    JumpToIndexPage({
      tab: props.location.query.from ?? 'template',
    });
  };

  const handleUploadChange = useCallback(
    (obj: { id: string; url: string }) => {
      console.log(obj.url, obj.id);
      updateAnimationDataByImages(obj.id, obj.url);
    },
    [animationData],
  );

  const handleTextChange = useCallback(
    (assetId: string, textIndex: number, inWhere: string, ind: number) => (
      v: VideoTemplate.AnimationTextDocumentData['d']['k'][0]['s'],
    ) => {
      console.log(assetId, textIndex, v, ind);
      updateAnimationDataByText(assetId, textIndex, inWhere, v, ind);
    },
    [animationData],
  );
  const updateAnimationDataByText = useCallback(
    (
      assetId: string,
      textIndex: number,
      inWhere: string,
      v: VideoTemplate.AnimationTextDocumentData['d']['k'][0]['s'],
      ind: number,
    ) => {
      const data = _.cloneDeep(animationData?.templateInfo);
      console.log(inWhere, ind, textIndex, JSON.stringify(v.t));
      if (data) {
        if (inWhere === 'assets') {
          const assets = data?.assets ?? [];
          for (let index = 0; index < assets.length; index++) {
            const element = assets[index];
            if (element.id === assetId) {
              for (let j = 0; j < element.layers!.length; j++) {
                const layer = element.layers![j];
                if (layer.ty === 5 && layer.ind === ind) {
                  layer.t.d.k[textIndex].s = v;
                  layer.t.d.k[textIndex].s.t = v.t.replace(/\n/g, '\r');
                  break;
                }
              }
            }
          }
        } else {
          // in layers
          const layers = data?.layers ?? [];
          for (let index = 0; index < layers.length; index++) {
            if (index === ind - 1) {
              const element = layers[index];
              console.log(element);
              if (element.ty === 5) {
                console.log(v);
                element.t.d.k[textIndex].s = v;
                element.t.d.k[textIndex].s.t = v.t.replace(/\n/g, '\r');
                break;
              }
            }
          }
        }
        console.log(JSON.parse(JSON.stringify(data)));
        setAnimationData({
          templateInfo: data,
        });
        handleLottieEndStop();
        handleSetAssetSource(data);
      }
    },
    [animationData],
  );
  const handleChangeOnMusic = (value, option) => {
    console.log(value, option);
    setAnimationData({
      musicId: value,
      musicUrl: option.key,
    });
    handleLottieEndStop();
  };
  const handleLottieEndStop = () => {
    LottieContextRef.current?.goEndStop();
  };
  const updateAnimationDataByImages = useCallback(
    (imgId: string, url: string) => {
      const data = _.cloneDeep(animationData?.templateInfo);
      if (data) {
        const assets = data?.assets ?? [];
        for (let index = 0; index < assets.length; index++) {
          const element = assets[index];
          if (element.id === imgId) {
            element.p = url;
            break;
          }
        }
        setAnimationData({
          templateInfo: data,
        });
        handleLottieEndStop();
        handleSetAssetSource(data);
      }
    },
    [animationData],
  );
  const handleComplete = async () => {
    if (!animationData?.templateInfo) {
      message.error('模板信息不完整');
      return;
    }
    if (!animationData?.musicId) {
      message.error('还未选择音乐哦');
      return;
    }
    setConfirmLoading(true);
    const { status, data } = await generateVideoApi({
      templateId: props.location.query.templateId ?? undefined,
      id: props.location.query.videoId ?? undefined,
      videoInfo: animationData?.templateInfo
        ? JSON.stringify(animationData?.templateInfo)
        : '',
      musicId: animationData?.musicId,
      size: animationData?.size,
      musicUrl: animationData?.musicUrl,
    });
    setConfirmLoading(false);
    if (status >= 200 && status < 300) {
      if (data.result === 100) {
        message.success('提交成功，请到我的视频库中查看视频生成状态');
        JumpToIndexPage({
          tab: 'library',
        });
      }
    }
  };
  const queryDetail = () => {
    setLoading(true);
    const { templateId, videoId } = props.location.query;
    videoId?.toString()
      ? getVideoDetailApi({ id: videoId }).then(res => {
          setLoading(false);
          console.log(
            'videoinfo-----------',
            JSON.parse(res.data.data?.videoInfo),
          );
          if (res.data.data) {
            handleSetAssetSource(JSON.parse(res.data.data?.videoInfo));
            setAnimationData({
              musicUrl: res.data.data.musicUrl,
              musicId: res.data.data.musicId,
              size: res.data.data.size,
              templateInfo: JSON.parse(res.data.data.videoInfo),
            });
          }
        })
      : templateId?.toString()
      ? getTemplateInfoApi({ id: templateId }).then(res => {
          setLoading(false);
          if (res.data.data) {
            console.log(
              'templateinfo-----------',
              JSON.parse(res.data.data?.templateInfo),
            );
            handleSetAssetSource(JSON.parse(res.data.data?.templateInfo));
            setAnimationData({
              musicUrl: res.data.data.musicUrl,
              musicId: res.data.data.musicId,
              size: res.data.data.size,
              templateInfo: JSON.parse(res.data.data?.templateInfo),
            });
          }
        })
      : '';
  };
  const queryMusicList = async () => {
    const { data } = await getMusicListApi();
    Array.isArray(data?.data?.musicList) && setMusicList(data?.data?.musicList);
  };

  const handleSetAssetSource = (v: VideoTemplate.AnimationDataProps) => {
    const source = getLayers(v);
    let sourceSort = _.cloneDeep(source).sort((a, b) => b.ty - a.ty);
    setAssetSource(sourceSort);
  };
  const renderSourceList = useCallback(() => {
    return assetSource.map(item => {
      return (
        <div className={styles.uploadItem} key={item.assetId}>
          <div className={styles.uploadItemLeft}>
            <span
              className={`${styles.icon} dz-iconfont ${
                LayerStatusEnum[item.ty]
              } ft16`}
            ></span>
            <div className={styles.line}></div>
          </div>
          <div className={styles.right}>
            {item.ty === 2 ? (
              <UploadImgItem
                key={item.assetId}
                curImgData={{ url: item.assetValue, id: item.assetId }}
                onChange={handleUploadChange}
              />
            ) : item.ty === 5 ? (
              <div key={item.assetId}>
                {item.assetValue.map((i, idx) => (
                  <TextEditor
                    key={idx}
                    text={i.s}
                    onChange={handleTextChange(
                      item.assetId,
                      idx,
                      item.in,
                      item.ind,
                    )}
                  />
                ))}
              </div>
            ) : (
              <div>未知类型</div>
            )}
          </div>
        </div>
      );
    });
  }, [assetSource, animationData]);
  useEffect(() => {
    queryDetail();
    // TODO: 以后可会加上 本期先写死
    queryMusicList();

    // @ts-ignore
    window?.RayCloud?.util?.ap({ point: '18.24850.50934.50936' });
  }, []);
  return (
    <Card size="small">
      <div className="flex-start ft14 mb20">
        <div
          className="flex-start ft14 mr16 pointer c-gray"
          onClick={handleBack}
        >
          <div className="dz-iconfont dz-arrow-left ft14 c-gray mr4"></div>
          <div>返回</div>
        </div>
        <div className="ft20" style={{ color: '#333' }}>
          视频设置
        </div>
      </div>
      <Spin spinning={loading}>
        <Row gutter={24}>
          <Col span="12">
            <div className={styles.left}>
              <div>
                <div className="c-3 ft14">1.上传素材</div>
                <div className="mb12 ft12 c-gray">
                  建议上传尺寸大于等于720*1280, JPG、PNG、JPEG等图片格式，3M以内
                </div>
                <div className={styles.uploadArea}>
                  <div className={styles.uploadList}>{renderSourceList()}</div>
                  {/* <div className={styles.uploadList}>
                    {images.map(item => (
                      <UploadImgItem
                        key={item.id}
                        curImgData={item}
                        onChange={handleUploadChange}
                      />
                    ))}
                  </div> */}
                </div>
                <div className="c-3 ft14 mt20 mb12">2.选择音乐</div>
                <Select
                  style={{ width: '100%' }}
                  onChange={handleChangeOnMusic}
                  value={animationData?.musicId}
                >
                  {musicList.map(item => (
                    <>
                      <Select.Option key={item.musicUrl} value={item.id}>
                        {item.name}
                      </Select.Option>
                    </>
                  ))}
                </Select>
              </div>
              <div className="flex-start mt20">
                <Popconfirm
                  title="返回后，当前页面的数据不会保存，是否返回？"
                  onConfirm={async () => {
                    handleBack();
                  }}
                >
                  <Button className="mr20">上一步</Button>
                </Popconfirm>
                <Button
                  loading={confirmLoading}
                  type="primary"
                  onClick={handleComplete}
                >
                  完成
                </Button>
              </div>
            </div>
          </Col>
          <Col span="12">
            <div style={{ marginTop: '56px' }}>
              <PreviewLottie animationData={animationData} />
            </div>
          </Col>
        </Row>
      </Spin>
    </Card>
  );
};
export default CreatePage;

import React, {
  useLayoutEffect,
  useRef,
  useState,
  createContext,
  useContext,
  MutableRefObject,
  ReactText,
  useEffect,
  useCallback,
} from 'react';
import { Card, Button } from 'antd';
import lottie, { AnimationItem } from 'lottie-web';
import styles from './index.less';
import LottieVideoComp, {
  AnimationDataChangeProps,
  LottieVideoRefProps,
  getAssetData,
} from '../LottieVideoComp';
import { VideoTemplate } from '@/apis/videoTemplate/types';
import { getMusicInfoApi } from '@/apis/videoTemplate';
import _ from 'lodash';

export interface VideoCardAnimationProps {
  size: VideoTemplate.Size;
  templateInfo: VideoTemplate.AnimationDataProps;
  musicId: string;
  musicUrl: string;
}

export interface VideoCardProps {
  animationData?: VideoCardAnimationProps;
  showFooter?: boolean;
  checkedStatus?: boolean;
  onSelect?: (v?: boolean) => void;
  checked?: boolean;
  status?: 'loading' | 'success' | 'fail'; // 是否加载完成
}

export const LottieContext = createContext<
  MutableRefObject<LottieVideoRefProps | null>
>({
  current: null,
});

const VideoCard: React.FC<VideoCardProps> = props => {
  const { showFooter = true } = props;
  const lottieVideoContainer = useRef<LottieVideoRefProps>(null);
  const [lottieAnimationData, setLottieAnimationData] = useState<
    AnimationDataChangeProps
  >({
    duration: 0,
    textCount: 0,
    images: [],
    imgCount: 0,
    isPaused: false,
  });
  const {
    duration,
    textCount,
    images,
    imgCount,
    isPaused,
  } = lottieAnimationData;
  const [isOver, serIsOver] = useState(false);
  const [musicUrl, setMusicUrl] = useState('');
  const [selectVideos, setSelectVideos] = useState<ReactText[]>([]);
  const LottieContextRef = useContext(LottieContext);
  LottieContextRef.current = lottieVideoContainer.current;

  const handlePlay = () => {
    lottieVideoContainer?.current?.play();
  };
  const handleAnimationDataChange = (data: AnimationDataChangeProps) => {
    setLottieAnimationData(data);
  };
  const handleMouseEnter = () => {
    console.log('enter');
    if (props.checkedStatus) {
      return;
    }
    serIsOver(true);
  };

  const handleSelect = () => {
    if (!props.checkedStatus) {
      return;
    }
    props.onSelect && props.onSelect(!props.checked);
  };
  const handleMouseLeave = () => {
    if (props.checkedStatus) {
      return;
    }
    serIsOver(false);
  };
  useEffect(() => {
    console.log(props.animationData);
    if (props.animationData) {
      const { duration, images, textCount } = getAssetData(
        props.animationData.templateInfo,
      );
      setLottieAnimationData({
        duration,
        imgCount: images.length,
        images,
        isPaused: true,
        textCount,
      });
    }
  }, [props.animationData]);
  return (
    <>
      <div
        className={`${styles.videoCardWrapper} ${
          props.checkedStatus ? styles.checked : props.checkedStatus
        } ${props.checked ? styles.activeChecked : ''}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleSelect}
      >
        <div
          className={`${styles.videoWrapper} ${
            styles[props.animationData?.size ?? styles.vertical]
          }`}
        >
          <div className="flex-center-column" style={{ height: '100%' }}>
            {props.animationData && props.status === 'success' && (
              <LottieVideoComp
                ref={lottieVideoContainer}
                musicUrl={props.animationData?.musicUrl}
                animationData={props.animationData?.templateInfo}
                onAnimationDataChange={handleAnimationDataChange}
              />
            )}
            {props.status === 'loading' && (
              <>
                <div
                  className={`dz-iconfont dz-play-circle ft40`}
                  style={{ color: '#eee' }}
                ></div>
                <div className="c-gray ft12">视频合成中，请稍后刷新查看</div>
              </>
            )}
            {props.status === 'fail' && (
              <>
                <div
                  className={`dz-iconfont dz-play-circle ft40`}
                  style={{ color: '#eee' }}
                ></div>
                <div className="c-gray ft12">视频合成失败</div>
              </>
            )}
          </div>
          {!props.checkedStatus && props.status === 'success' && (
            <div
              className={`${styles.maskWrapper} ${
                isPaused ? styles.show : styles.hide
              }`}
            >
              <div
                className={`dz-iconfont dz-play-circle ${styles.playIcon}`}
                onClick={handlePlay}
              ></div>
            </div>
          )}
          {props.checkedStatus && <div className={styles.checkedWrapper}></div>}
        </div>
        {showFooter && (
          <div className={styles.videoBottom}>
            {/* {!isOver ? ( */}
            <div
              className={`c-normal ft-14 flex-column ${styles.textBottom}`}
              style={{ display: !isOver ? 'flex' : 'none' }}
            >
              <div className="mb8 mt12">
                {props.animationData?.templateInfo.nm}
              </div>
              <div className="flex-between c-gray">
                <div className="flex-start">
                  <div className="mr6">时长</div>
                  <div>{duration}s</div>
                </div>
                <div className="flex-start">
                  <div className="flex-center mr16">
                    <div className="mr6 dz-iconfont dz-wenzi ft-16 c-gray"></div>
                    <div>{textCount}</div>
                  </div>
                  <div className="flex-center">
                    <div className="mr6 dz-iconfont dz-tupian3 ft-16 c-gray"></div>
                    <div>{imgCount}</div>
                  </div>
                </div>
              </div>
            </div>
            {/* ) : ( */}
            <div
              style={{ display: isOver ? 'flex' : 'none' }}
              className={styles.btnBottom}
            >
              {props.children}
            </div>
            {/* )} */}
          </div>
        )}
      </div>
    </>
  );
};
export default VideoCard;

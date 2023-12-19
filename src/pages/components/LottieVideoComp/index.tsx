import React, {
  useRef,
  useLayoutEffect,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
  useReducer,
  createContext,
  useContext,
  ReactText,
} from 'react';
import lottie, { AnimationItem } from 'lottie-web';
import { useReducerState } from '@/utils/hooks';
import { VideoTemplate } from '@/apis/videoTemplate/types';
import { LottieContext } from '../VideoCard';
import { getLayers } from '@/pages/create';
import _ from 'lodash';

export interface AnimationDataChangeProps {
  duration: number;
  textCount: number;
  imgCount: number;
  images: ReturnType<typeof getAssetData>['images'];
  isPaused: boolean;
}

export interface videoCompProps {
  musicUrl?: string;
  animationData?: VideoTemplate.AnimationDataProps;
  onAnimationDataChange: (v: AnimationDataChangeProps) => void;
}
export interface LottieVideoRefProps {
  play: () => void;
  goEndStop: () => void;
  getAllImages: () => void;
}

export function getAssetData(animationData: VideoTemplate.AnimationDataProps) {
  const { fr, op, assets } = animationData;
  const textCount = getLayers(animationData).reduce((prev, cur) => {
    if (cur.ty === 5) {
      // 5为文字图层
      prev += cur.assetValue.reduce((p, c) => {
        p += c.s.t?.replace(/\s+/g, '')?.length ?? 0;
        return p;
      }, 0);
    }
    return prev;
  }, 0);
  return {
    fps: fr,
    duration: op / fr,
    images: assets
      .filter(item => {
        if (item.p) {
          return true;
        }
      })
      .map(item => ({ id: item.id, url: item.p! })),
    textCount,
  };
}

const LottieVideoComp = forwardRef<LottieVideoRefProps, videoCompProps>(
  (props, ref) => {
    const [animationData, setAnimationData] = useReducerState<
      AnimationDataChangeProps
    >({
      duration: 0,
      textCount: 0,
      imgCount: 0,
      images: [],
      isPaused: true,
    });
    const videoContainer = useRef(null);
    const anim = useRef<AnimationItem>();
    const audio = useRef<HTMLAudioElement>(null);

    const handlePlay = () => {
      setAnimationData({
        isPaused: false,
      });
      anim?.current?.totalFrames &&
      anim?.current?.currentFrame === anim?.current?.totalFrames - 1
        ? (goToFirstPlay(), playFirstAudio())
        : (anim?.current?.play(), playAudio());
    };
    const goToFirstPlay = () => {
      anim?.current?.goToAndPlay(0, true);
    };
    const playToEndStop = () => {
      let frameNum = anim?.current?.getDuration(true);
      frameNum && anim?.current?.goToAndStop(frameNum - 1, true);
      setAnimationData({
        isPaused: true,
      });
      pauseOnFirstAudio();
    };

    const playAudio = () => {
      audio.current?.play();
    };

    const playFirstAudio = () => {
      audio.current && (audio.current.currentTime = 0);
      audio.current?.play();
    };

    const pauseAudio = () => {
      audio.current?.pause();
    };
    const pauseOnFirstAudio = () => {
      audio.current && (audio.current.currentTime = 0);
      audio.current?.pause();
    };

    const getAllImages = () => {};

    useImperativeHandle(ref, () => ({
      play: () => {
        handlePlay();
      },
      goEndStop: () => {
        playToEndStop();
      },
      getAllImages: () => {
        getAllImages();
      },
    }));

    useEffect(() => {
      if (props.animationData) {
        const { duration, images, textCount } = getAssetData(
          props.animationData,
        );
        setAnimationData({
          duration,
          imgCount: images.length,
          images,
          textCount,
        });
      }
    }, [props.animationData]);
    useEffect(() => {
      console.log(animationData);
      props.onAnimationDataChange(animationData);
    }, [animationData]);
    useLayoutEffect(() => {
      anim.current = lottie.loadAnimation({
        container: videoContainer.current!,
        animationData: _.cloneDeep(props.animationData),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        rendererSettings: {
          className: 'svg',
        },
      });
      anim?.current?.addEventListener('DOMLoaded', () => {
        console.log('DOMLoaded');
        playToEndStop();
      });
      anim?.current?.addEventListener('loaded_images', () => {
        console.log('loaded_images');
      });
      anim?.current?.addEventListener('complete', () => {
        // 播放完成
        console.log('complete');
        playToEndStop();
      });
      return () => {
        console.log('destroy');
        anim?.current?.removeEventListener('DOMLoaded');
        anim?.current?.removeEventListener('loaded_images');
        anim?.current?.removeEventListener('complete');
        anim?.current?.destroy();
      };
    }, [props.animationData]);

    return (
      <>
        <div ref={videoContainer}></div>
        <>
          {
            <audio ref={audio} controls loop src={props.musicUrl}>
              您的浏览器暂不支持
            </audio>
          }
        </>
      </>
    );
  },
);
export default LottieVideoComp;

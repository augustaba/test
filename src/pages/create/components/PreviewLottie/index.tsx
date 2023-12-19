import React, { useEffect } from 'react';
import styles from './index.less';
import VideoCard, {
  VideoCardAnimationProps,
} from '@/pages/components/VideoCard';

export interface PreviewLottieProps {
  animationData?: VideoCardAnimationProps;
}

const PreviewLottie: React.FC<PreviewLottieProps> = props => {
  return (
    <div className={styles.previewWrapper}>
      <div
        className={styles.previewContainer}
        style={{
          backgroundImage: `url('https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/shortVideoTemplate/src/public/iPhone.png')`,
          backgroundSize: '265.5px 516.4px',
        }}
      >
        <div className={styles.lottieView}>
          <VideoCard
            status={'success'}
            animationData={props.animationData}
            showFooter={false}
          />
        </div>
      </div>
      <div className={styles.right}>
        <img
          className={styles.tip}
          src={
            'https://raycloud-resources-zb.oss-cn-zhangjiakou.aliyuncs.com/shortVideoTemplate/src/public/mouse.png'
          }
          alt="图片"
        />
      </div>
    </div>
  );
};
export default PreviewLottie;

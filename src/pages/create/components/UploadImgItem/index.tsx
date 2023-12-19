import React, { useState, useCallback, useEffect } from 'react';
import styles from './index.less';
import { getAssetData } from '@/pages/components/LottieVideoComp';
import { Button } from 'antd';
import UploadModal from '@/compoenents/UploadModal';
import Axios from 'axios';
import { UploadImages } from '@/apis/videoTemplate';

export interface UploadImgItemProps {
  curImgData: { id: string; url: string };
  onChange: (v: { id: string; url: string }) => void;
}

const UploadImgItem: React.FC<UploadImgItemProps> = props => {
  const { curImgData, onChange } = props;
  const [isHover, setIsHover] = useState(false);
  const [aspect, setAspect] = useState(1);

  const handleMouseEnter = () => {
    setIsHover(true);
  };

  const handleMouseLeave = () => {
    setIsHover(false);
  };
  const handleUploadOk = (id: string) => (picturePath: Blob) => {
    console.log(picturePath);
    const formData = new FormData();
    formData.append(
      'imageFile',
      new File([picturePath], new Date().toString(), {
        type: 'image/png',
      }),
    );
    UploadImages(formData).then(img => {
      if (img.data.result === 100) {
        onChange({
          id,
          url: `https://video-template-dz.oss-cn-zhangjiakou.aliyuncs.com/${img.data.data.imageUrl}`,
        });
      }
    });
  };

  const getAspect = (url: string): Promise<number> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.onload = () => {
        console.log(img.width, img.height, img.naturalWidth, img.naturalHeight);
        resolve(img.width / img.height);
      };
      img.onerror = () => {
        reject();
      };
    });
  };
  useEffect(() => {
    if (curImgData.url) {
      getAspect(curImgData.url).then(res => {
        setAspect(res);
      });
    }
  }, [curImgData]);

  return (
    <>
      <div
        className={styles.wrapper}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img className={styles.img} src={curImgData.url} alt="图片" />
        <div
          className={`${styles.mask} ${isHover ? styles.show : styles.hide}`}
        >
          <UploadModal onOk={handleUploadOk(curImgData.id)} aspect={aspect}>
            <Button type="primary" size="small">
              上传
            </Button>
          </UploadModal>
        </div>
      </div>
    </>
  );
};
export default UploadImgItem;

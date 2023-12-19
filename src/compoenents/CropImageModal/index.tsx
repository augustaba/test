import React, { useEffect, useState, useRef } from 'react';
import { useModal } from '@/utils/hooks';
import { Modal } from 'antd';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

export interface CropImageModalProps {
  url: string;
  visible: boolean;
  onChange: (url: Blob) => void;
  onSetVisible: (v: boolean) => void;
  aspect: number;
}

const ImageWrapperHeight = 600;

const execImgWidth = (width: number, height: number) => {
  let nw, nh;
  if (width > height) {
    nw = ImageWrapperHeight;
    nh = (nw * height) / width;
  } else if (width < height) {
    nh = ImageWrapperHeight;
    nw = (nh * width) / height;
  } else {
    nw = ImageWrapperHeight;
    nh = ImageWrapperHeight;
  }
  return {
    width: nw,
    height: nh,
  };
};

const CropImageModal: React.FC<CropImageModalProps> = props => {
  const [croppedImageUrl, setCroppedImageUrl] = useState<Blob>();
  const [modalProps, setVisible] = useModal({
    onOk: async () => {
      croppedImageUrl && props.onChange(croppedImageUrl);
      return true;
    },
  });
  const [crop, setCrop] = useState<ReactCrop.Crop>({
    unit: '%',
    width: 30,
    aspect: 1 / 1,
  });
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const imageRef = useRef<HTMLImageElement>();

  const handleCropChange = (crop: ReactCrop.Crop) => {
    console.log(crop);
    setCrop(crop);
  };
  const handleComplete = (crop: ReactCrop.Crop) => {
    console.log('complete');
    makeClientCrop(crop);
  };
  const handleImageLoaded = (image: HTMLImageElement) => {
    imageRef.current = image;
  };
  const makeClientCrop = async (crop: ReactCrop.Crop) => {
    console.log(imageRef, crop);
    if (imageRef.current && crop.width && crop.height) {
      const croppedImageUrl = await getCroppedImg(
        imageRef.current,
        crop,
        imageRef.current.name || `${new Date()}`,
      );
      setCroppedImageUrl(croppedImageUrl);
    }
  };
  const getCroppedImg = (
    image: HTMLImageElement,
    crop: ReactCrop.Crop,
    fileName: string,
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      console.log(crop, image.naturalWidth, image.naturalHeight);
      const originWidth = crop.width! * scaleX;
      const originHeight = crop.height! * scaleY;
      canvas.width = originWidth ?? 0;
      canvas.height = originHeight ?? 0;
      console.log(
        crop.x! * scaleX,
        crop.y! * scaleY,
        crop.width! * scaleX,
        crop.height! * scaleY,
      );
      const ctx = canvas.getContext('2d');

      ctx!.drawImage(
        image,
        crop.x! * scaleX,
        crop.y! * scaleY,
        originWidth,
        originHeight,
        0,
        0,
        originWidth,
        originHeight,
      );
      canvas.toBlob(blob => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error('Canvas is empty');
          return;
        }
        // let url = window.URL.createObjectURL(blob);
        // console.log(url);
        resolve(blob);
      }, 'image/jpeg');
    });
  };
  useEffect(() => {
    console.log(props.visible);
    if (props.visible) {
      setVisible(true);
    }
  }, [props.visible]);
  useEffect(() => {
    const img = new Image();
    img.src = props.url;
    img.onload = function() {
      const { width, height } = execImgWidth(
        img.naturalWidth,
        img.naturalHeight,
      );
      console.log(width, height);
      setImgWidth(width);
      setImgHeight(height);
    };
  }, [props.url]);
  useEffect(() => {
    console.log('aspect,---------', props.aspect);
    setCrop(prev => ({
      ...prev,
      aspect: props.aspect ?? 1,
    }));
    return () => {};
  }, [props.aspect]);
  useEffect(() => {
    setCrop(prev => ({
      ...prev,
      ...(imgWidth > imgHeight ? { height: imgHeight } : { width: imgWidth }),
    }));
  }, [imgWidth, imgHeight]);
  return (
    <>
      <Modal
        {...modalProps}
        destroyOnClose
        title="图片编辑器"
        width={700}
        afterClose={() => {
          props.onSetVisible(false);
        }}
      >
        <div className="flex-center">
          <ReactCrop
            crossorigin="anonymous"
            imageStyle={{
              width: imgWidth,
              height: imgHeight,
              maxWidth: 'initial',
            }}
            ruleOfThirds
            src={props.url}
            crop={crop}
            onChange={handleCropChange}
            onComplete={handleComplete}
            onImageLoaded={handleImageLoaded}
          ></ReactCrop>
        </div>
      </Modal>
    </>
  );
};
export default CropImageModal;

import React, { useEffect, useState } from 'react';
import { Modal, Tabs, Upload, message } from 'antd';
import { useModal } from '@/utils/hooks';
import { DraggerProps, RcFile } from 'antd/lib/upload';
import ImageSpace from '../ImagesSpace';
import CropImageModal from '../CropImageModal';
import { checkFile } from './checkFile';
import { UploadFile } from 'antd/lib/upload/interface';
const { Dragger } = Upload;

export interface UploadModalProps {
  onOk: (picturePath: Blob) => void;
  aspect: number;
}
const tabs = [
  {
    tab: '本地上传',
    key: 'local',
  },
  {
    tab: '图片空间',
    key: 'space',
  },
];
const UploadModal: React.FC<UploadModalProps> = props => {
  const [activeKey, setActiveKey] = useState('local');
  const [picturePath, setPicturePath] = useState<string>();
  const [cropModalVisible, setCropModalVisible] = useState(false);
  const [file, setFile] = useState<UploadFile>();
  const [showPreviewModal, setPreviewModal] = useState(false);
  const [modalProps, setVisible] = useModal({
    showConfirmLoading: false,
    onOk: async () => {
      console.log(picturePath);
      if (!picturePath) {
        return false;
      }
      // props.onOk(picturePath)
      setCropModalVisible(true);
      return false;
    },
  });
  const [showCrop, seShowCrop] = useState(false);
  const handleSelectImg = (picturePath?: string) => {
    setPicturePath(picturePath);
  };
  const UploadProps: DraggerProps = {
    name: 'file',
    multiple: false,
    showUploadList: true,
    fileList: file ? [file] : [],
    accept: '.jpg,.png,.jpeg',
    beforeUpload(file) {
      return new Promise((resolve, reject) => {
        return checkFile({
          file,
          type: 'image',
          accept: 'jpg,png,jpeg',
        })
          .then(res => {
            if (res?.src) {
              setPicturePath(res.src);
              setCropModalVisible(true);
            }
            resolve();
          })
          .catch(() => {
            reject(false);
          });
      });
    },
    onChange({ file, fileList }) {
      file.url = picturePath;
      console.log(file, 'fffff');
      // return false;
      setFile(file);
    },
    onPreview() {
      file?.url && setPreviewModal(true);
    },
  };
  return (
    <>
      <span onClick={() => setVisible(true)}>{props.children}</span>
      <Modal
        {...modalProps}
        destroyOnClose
        okButtonProps={{ disabled: !picturePath }}
        width={600}
        bodyStyle={{ height: 500, display: 'flex', flexDirection: 'column' }}
      >
        <div>
          <Tabs activeKey={activeKey} onChange={setActiveKey}>
            {tabs.map(({ tab, key }) => (
              <Tabs.TabPane tab={tab} key={key}></Tabs.TabPane>
            ))}
          </Tabs>
        </div>
        <div style={{ flex: 1, overflowY: 'hidden' }}>
          {activeKey === 'local' && (
            <>
              <div style={{ height: '80%' }}>
                <Dragger {...UploadProps}>
                  <img src="https://img.alicdn.com/imgextra/i3/1881744325/O1CN01OHJ79Q1hotbY1BTET_!!1881744325.png" />
                  <div className="mt20 ft14 c-normal">
                    将图片拖入框内或者<a>点此上传</a>
                  </div>
                  <div className="ft12 c-gray mt4">
                    建议3M之内的jpg、png、jpeg格式的图片文件
                  </div>
                </Dragger>
              </div>
            </>
          )}
          {activeKey === 'space' && <ImageSpace onSelect={handleSelectImg} />}
        </div>
      </Modal>
      <Modal
        width={800}
        visible={showPreviewModal}
        footer={null}
        onCancel={() => setPreviewModal(false)}
        destroyOnClose
      >
        <img style={{ width: '100%' }} src={file?.url} />
      </Modal>
      {!!picturePath && cropModalVisible && (
        <CropImageModal
          aspect={props.aspect}
          visible={cropModalVisible}
          url={picturePath}
          onChange={url => {
            props.onOk(url);
            setVisible(false);
          }}
          onSetVisible={v => {
            setCropModalVisible(v);
          }}
        />
      )}
    </>
  );
};
export default UploadModal;

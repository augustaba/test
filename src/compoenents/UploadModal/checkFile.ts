import { message } from 'antd';
export interface CheckFileOption {
  length?: number;
  width?: number;
  height?: number;
  file?: File;
  accept?: string;
  /**
   * 单位兆M
   */
  size?: number;
  showName?: boolean;
  type: 'image';
}
export function checkFile({
  length,
  width,
  height,
  file,
  accept = '',
  size,
  type,
  showName = false,
}: CheckFileOption): Promise<
  | undefined
  | {
      src: string;
      width: number;
      height: number;
    }
> {
  if (!file) {
    message.error('file 不存在!');
    return new Promise((resolve, reject) => {
      reject();
    });
  }
  const fileName = showName ? ` " ${file.name} " ` : '';
  // 将兆转为字节单位
  const bSize = size ? size * 1024 * 1024 : 0;
  if (size && file.size > bSize) {
    message.warning(`${fileName}文件超出大小,无法上传!`);
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  // const acceptList = accept && accept.replace('.', '').split(',');
  // 转小写
  let fileType = file.type;
  // 判断文件  type 是否有 值，否则取 文件名后缀
  if ((!fileType || fileType.length == 0) && file.name.length > 0) {
    let pathAry = file.name.split('.');
    fileType = pathAry[pathAry.length - 1];
  }
  if (fileType && fileType.split('/').length > 1) {
    fileType = fileType.split('/')[1];
  }
  if (
    accept &&
    accept.length > 0 &&
    accept.toLowerCase().indexOf(fileType.toLowerCase()) === -1
  ) {
    message.error(`${fileName}文件类型错误，仅支持${accept}格式!`);
    return new Promise((resolve, reject) => {
      reject();
    });
  }

  const _w = width;
  const _h = height;
  /** 上传图片 */
  if (type.indexOf('image') !== -1) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const fileName2 = showName ? `${file.name} : ` : '';
        /** 验证宽度 */
        if (_w && img.width !== _w && _h === null) {
          message.error(`${fileName2}请上传图片宽度为 ${_w}`);
          reject();
        } else if (_h && img.height !== _h && _w === null) {
          /** 验证高度 */
          message.error(`${fileName2}请上传图片高度为 ${_h}`);
          reject();
        } else if (_w && img.width !== _w && _h && img.height !== _h) {
          message.error(`${fileName2}图片尺寸为 ${_w} * ${_h}`);
          reject();
        } else {
          resolve({
            src: img.src,
            width: img.width,
            height: img.height,
          });
        }
      };
      img.onerror = () => {
        reject();
      };
      img.src = window.URL.createObjectURL(file);
    });
  }
  return new Promise((resolve, reject) => {
    resolve();
  });
}

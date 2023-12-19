import React, { useEffect } from 'react';
import styles from './index.less';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';

export interface BasicLayoutProps {}

const BasicLayout: React.FC<BasicLayoutProps> = props => {
  useEffect(() => {
    // @ts-ignore
    window.leftMenu.renderCustoLetMenu(
      'mubanzhongxin',
      1214,
      $('.container'),
      'shortVideo',
    );
    // @ts-ignore
    document.getElementById('J_app-mask-app-load').style.display = 'none';
  }, []);
  return (
    <>
      <ConfigProvider locale={zhCN}>
        <div className={styles.wrapper}>{props.children}</div>
      </ConfigProvider>
    </>
  );
};
export default BasicLayout;

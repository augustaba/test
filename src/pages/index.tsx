import React, { useState, useRef } from 'react';
import { Tabs, Card } from 'antd';
import CreateTab, { CreateTabProps } from './components/CreateTab';
import { LottieContext } from './components/VideoCard';
import { LottieVideoRefProps } from './components/LottieVideoComp';
import { Basic } from '@/types';
import { history } from 'umi';

interface Query {
  tab?: CreateTabProps['activeTab'];
}
export interface IndexProps extends Basic.BaseProps<Query> {}

export const JumpToThisPage = (query: Query) => {
  history.push({
    pathname: '/',
    query,
  });
};
const Index: React.FC<IndexProps> = props => {
  const [activeTab, setActiveTab] = useState('create');
  const ref = useRef<LottieVideoRefProps | null>(null);

  const tabs = [
    {
      tab: '创建视频',
      key: 'create',
      comp: <CreateTab activeTab={props.location.query.tab} />,
    },
    // {
    //   tab: '我的素材库',
    //   key: 'library',
    //   comp: <MyVideoLibraryTab />
    // }
  ];
  const handleClickOnTab = (activeKey: string) => {
    console.log(activeKey);
    setActiveTab(activeKey);
  };
  return (
    <LottieContext.Provider value={ref}>
      <Card>
        <Tabs activeKey={activeTab} onChange={handleClickOnTab}>
          {tabs.map(({ tab, key, comp }) => (
            <Tabs.TabPane tab={tab} key={key}>
              {comp}
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Card>
    </LottieContext.Provider>
  );
};
export default Index;

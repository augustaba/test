import React, { useState, useEffect } from 'react';
import CreateVideo from '../CreateVideo';
import TemplateList from '../TemplateList';
import { Button, Space } from 'antd';
import { JumpToThisPage } from '@/pages/create';
import MyVideoLibrary from '../MyVideoLibrary';
import { VideoTemplate } from '@/apis/videoTemplate/types';

export interface CreateTabProps {
  activeTab?: 'template' | 'library';
}

const CreateTab: React.FC<CreateTabProps> = props => {
  const [activeButtonKey, setActiveButtonKey] = useState('template');
  const ButtonTabs = [
    {
      tab: '视频模板',
      key: 'template',
    },
    {
      tab: '我的视频',
      key: 'library',
    },
  ];
  const handleUse = (v: VideoTemplate.TemplateListResponseProps) => {
    JumpToThisPage({
      templateId: v.id,
    });
  };
  const handleClickOnButtonTab = (key: string) => () => {
    setActiveButtonKey(key);
  };
  useEffect(() => {
    if (props.activeTab) {
      setActiveButtonKey(props.activeTab);
    }
  }, [props.activeTab]);
  return (
    <>
      <Space size={-1} direction="horizontal">
        {ButtonTabs.map(({ tab, key }) => (
          <Button
            key={key}
            onClick={handleClickOnButtonTab(key)}
            type={key === activeButtonKey ? 'primary' : 'default'}
          >
            {tab}
          </Button>
        ))}
      </Space>
      {activeButtonKey === 'template' && <TemplateList onUse={handleUse} />}
      {activeButtonKey === 'library' && <MyVideoLibrary />}
    </>
  );
};
export default CreateTab;

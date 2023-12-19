import React, { useEffect, useState, ReactText } from 'react';
import { Tree, Input, Empty, Spin } from 'antd';
import { CarryOutOutlined, FormOutlined } from '@ant-design/icons';
import styles from './index.less';
import { DataNode } from 'antd/lib/tree';
import { MockData } from './mockData';
import { useRequest } from '@/utils/hooks';
import { getPictureCategory, getPictureList } from '@/apis/videoTemplate';

const mockImgs = [
  {
    pictureId: 1187806896266607000,
    picturePath:
      'https://gd2.alicdn.com/imgextra/i2/1585416841/O1CN01fbOtRE20PE60p5fWw_!!1585416841.jpg',
  },
  {
    pictureId: 1187806892014615800,
    picturePath:
      'https://gd3.alicdn.com/imgextra/i3/1585416841/O1CN01GJXtoA20PE5yvFclm_!!1585416841.jpg',
  },
  {
    pictureId: 1187806889296226300,
    picturePath:
      'https://gd4.alicdn.com/imgextra/i4/1585416841/O1CN01sHHfK720PE6sNKPoP_!!1585416841.jpg',
  },
  {
    pictureId: 11878878889296226800,
    picturePath:
      'https://gd2.alicdn.com/imgextra/i3/0/O1CN011u1IRz20PE79HPckr_!!0-item_pic.jpg',
  },
  {
    pictureId: 11868878889296226800,
    picturePath:
      'https://gd3.alicdn.com/imgextra/i3/1585416841/O1CN01L6nX9M20PE713vZdx_!!1585416841.jpg',
  },
  {
    pictureId: 11868878889996226800,
    picturePath:
      'https://img.alicdn.com/imgextra/i1/826052692/O1CN01gPsrI61VkyppiUGbR_!!826052692.jpg',
  },
];

export interface ImageSpaceProps {
  onSelect: (picturePath?: string) => void;
}

interface TreeDataProps {
  pictureCategoryId: string;
  parentId: string;
  pictureCategoryName: string;
  children: TreeDataProps[];
}

export interface ImgItemProps {
  pictureId: string;
  picturePath: string;
}

function transformTreeData(treeNodes: TreeDataProps[]): DataNode[] {
  return treeNodes.map(item => {
    let data: DataNode = {
      key: item.pictureCategoryId,
      title: item.pictureCategoryName.replace(/(^\s*)|(\s*$)/g, ''),
      icon: <CarryOutOutlined />,
      children: [],
    };
    if (!item.children || !item.children.length) {
      return data;
    }
    data.children = transformTreeData(item.children);
    return data;
  });
}

function findNode(
  treeNodes: DataNode[],
  categoryName: string,
  result: DataNode[],
) {
  treeNodes.forEach(item => {
    if ((item.title! as string).indexOf(categoryName) > -1) {
      result.push(item);
      return;
    }
    if (!item.children || !item.children.length) {
      return false;
    }
    console.log(item, (item.title! as string).indexOf(categoryName));

    findNode(item.children, categoryName, result);
  });
}

const ImageSpace: React.FC<ImageSpaceProps> = props => {
  const [totalTreeData, setTotalTreeData] = useState<DataNode[]>([]);
  const [treeData, setTreeData] = useState<DataNode[]>([]);
  const [selectedKeys, setSelectedKeys] = useState<(string | number)[]>([]);
  const [selectImgId, setSelectImgId] = useState<string>('-1');
  const [imgArray, setImgArray] = useState<ImgItemProps[]>([]);

  const handleSearch = (value: string) => {
    const result: DataNode[] = [];
    findNode(totalTreeData, value, result);
    setTreeData(result);
  };
  const { data: categoryData, run } = useRequest(getPictureCategory);
  const {
    data: currentPictureList,
    run: queryCurrentPictureList,
    loading: curPictureListLoading,
  } = useRequest(getPictureList, {
    initialParams: {
      pictureCategoryId: '-1',
    },
  });
  useEffect(() => {
    run();
  }, []);
  useEffect(() => {
    if (categoryData) {
      const data = transformTreeData([categoryData]);
      console.log(data);
      setTreeData(data);
      setTotalTreeData(data);
      setSelectedKeys([data[0]?.key ?? '0']);
      // setImgArray(mockImgs);
      queryCurrentPictureList({
        pictureCategoryId: (data[0]?.key ?? '0') as string,
      });
    }
  }, [categoryData]);
  useEffect(() => {
    if (currentPictureList) {
      setImgArray(currentPictureList.list);
    }
  }, [currentPictureList]);
  const onSelect = (selectedKeys: ReactText[]) => {
    console.log(selectedKeys);
    setSelectedKeys(selectedKeys);
    queryCurrentPictureList({
      pictureCategoryId: selectedKeys?.[0] as string,
    });
  };
  const handleSelect = (pictureId: string, picturePath: string) => () => {
    if (pictureId === selectImgId) {
      setSelectImgId('-1'); // 再次取消选中
      props.onSelect();
      return;
    }
    setSelectImgId(pictureId);
    props.onSelect(picturePath);
  };
  return (
    <div className={styles.imageSpace}>
      <div className={styles.left}>
        <Input.Search placeholder="请输入分类名称" onSearch={handleSearch} />
        <div className={styles.treeArea}>
          {treeData.length ? (
            <Tree
              showLine={true}
              showIcon={false}
              selectedKeys={selectedKeys}
              defaultExpandAll={true}
              onSelect={onSelect}
              treeData={treeData}
            />
          ) : (
            <div className="flex-center" style={{ height: '100%' }}>
              <Empty />
            </div>
          )}
        </div>
      </div>
      <div className={styles.right}>
        <Spin spinning={curPictureListLoading}>
          <div className={styles.imgList}>
            {!!imgArray.length ? (
              imgArray.map(({ pictureId, picturePath }) => (
                <div
                  key={pictureId}
                  className={`${styles.imgListItem} ${
                    selectImgId === pictureId ? styles.imgItemChecked : ''
                  }`}
                  onClick={handleSelect(pictureId, picturePath)}
                >
                  <img className={styles.img} src={picturePath} />
                  <span className="textOverFlow1">
                    WechatIMG71333dsa你家啊点
                  </span>
                </div>
              ))
            ) : (
              <div style={{ width: '100%' }} className="flex_center">
                <Empty />
              </div>
            )}
          </div>
        </Spin>
      </div>
    </div>
  );
};
export default ImageSpace;

import React from 'react'
import { Button } from 'antd'
import UploadModal from '@/compoenents/UploadModal'

export interface CreateVideoProps {
}

const CreateVideo:React.FC <CreateVideoProps>= props => {
  return <>
    <div>视频设置</div>
    <UploadModal>
      <Button>上传</Button>
    </UploadModal>
  </>
}
export default CreateVideo
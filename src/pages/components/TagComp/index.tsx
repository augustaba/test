import React, { useCallback, ReactText } from 'react'
import { Row, Col, Tag } from 'antd'
import styles from './index.less'

export interface TagCompProps {
  label: string;
  tagId?: ReactText;
  tags: { id: ReactText, tag: ReactText }[],
  checkedTag: ReactText;
  onChange: (id: ReactText, tag: { id: ReactText, tag: ReactText }) => void
}

const TagComp:React.FC <TagCompProps>= props => {
  const { label, tags, checkedTag, onChange } = props
  const handleClickOnTag = (tag: { id: ReactText, tag: ReactText  }) =>  () => { 
    if (tag.id === checkedTag) {
      return
    }
    onChange(tag.id, tag)
  }
  return <div className='c-normal ft-14'>
    <div className='flex-start'>
      <div className='mr24'>{label}:</div>
      <div>
      {tags.map(tag => (
        <div key={tag.id} onClick={handleClickOnTag(tag)} className={`mr28 ${styles.tag} ${tag.id === checkedTag ? styles.checked : ''
        }`}><span className={styles.tagLabel}>{tag.tag}</span></div>
      ))}
      </div>
    </div>
  </div>
}
export default TagComp
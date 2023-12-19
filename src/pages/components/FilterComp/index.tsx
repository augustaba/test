import React, { ReactText } from 'react'

export type Filter  =  'desc' | 'asc' | 'empty'

export interface FilterProps {
  text: string;
  activeValue: Filter;
  onChange: (v: Filter) => void
}

const FilterReverseMap:{ [key: string]: Filter } = {
  desc: 'asc',
  asc: 'desc',
  empty: 'desc'
}

const FilterComp:React.FC <FilterProps>= props => {
  const handleClick = (v: Filter) => () => {
    props.onChange(FilterReverseMap[v])
  }
  return <div className='flex-start ft14 c-normal pointer' onClick={handleClick(props.activeValue)}>
    <div className='mr5'>{ props.text || '占位文字' }</div>
    <div className='flex-center'>
      <div className={`dz-iconfont c-gray ft12 dz-shengxu flex-center ${props.activeValue === 'asc' && 'c-blue'}`}></div>
      <div className={`dz-iconfont c-gray ft12 dz-jiangxu flex-center ${props.activeValue === 'desc' && 'c-blue'}`} style={{marginLeft: '-11px'}}></div>
    </div>
  </div>
}
export default FilterComp
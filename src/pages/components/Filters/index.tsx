import React from 'react'
import FilterComp, { Filter } from '../FilterComp'
import { check } from 'prettier'
import { Divider } from 'antd'


export interface FiltersProps {
  filters: {
    key: string;
    label: string;
  }[],
  className?: string;
  value: {
    key: string;
    value: Filter
  }
  onChange: (value: FiltersProps['value']) => void
}

function Filters(props: FiltersProps) {
  const handleFilterChange = (key: string) => (val: Filter) => {
    props.onChange({
      key,
      value: val
    })
  }
  const render  = () => {
    return props.filters.reduce((prevTotal, current, currentIndex) => {
      const Comp = <FilterComp key={current.key} text={current.label} activeValue={props.value.key === current.key ? props.value.value : 'empty'} onChange={handleFilterChange(current.key)} />
      if (currentIndex === props.filters.length - 1) {
        return prevTotal.concat(Comp)
      }
      return prevTotal.concat(<>
        {Comp}
        <Divider type='vertical' />
      </>)
    }, [] as JSX.Element[])
  }
  return <div className={`flex-start ${props.className}`}>
    { render() }
  </div>
}
export default Filters
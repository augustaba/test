import React, { useState, useEffect } from 'react';
import { VideoTemplate } from '@/apis/videoTemplate/types';
import { Input, Select, Dropdown, Menu, Button } from 'antd';
// import { PhotoshopPicker, ColorResult, RGBColor } from 'react-color';
import ColorPicker from 'rc-color-picker';
import 'rc-color-picker/assets/index.css';
import { useReducerState } from '@/utils/hooks';

type ColorResult = {
  r: number;
  g: number;
  b: number;
};

function hexToRgb(hex): ColorResult {
  return {
    r: parseInt('0x' + hex.slice(1, 3)),
    g: parseInt('0x' + hex.slice(3, 5)),
    b: parseInt('0x' + hex.slice(5, 7)),
  };
}

const fonSize = [24, 30, 32, 36, 38, 48, 60, 72, 80, 88, 93, 100];

const FontSizeDataSource = fonSize.map(item => ({
  label: `${item}px`,
  value: item,
}));

export interface TextEditorProps {
  text: VideoTemplate.AnimationTextDocumentData['d']['k'][0]['s'];
  onChange: (
    v: VideoTemplate.AnimationTextDocumentData['d']['k'][0]['s'],
  ) => void;
}

const TextEditor: React.FC<TextEditorProps> = props => {
  // const [textState, setTextState] = useReducerState<
  //   VideoTemplate.AnimationTextDocumentData['d']['k'][0]['s']
  // >({
  //   s: 16,
  //   f: '默认字体',
  //   t: '默认文字',
  //   j: 1,
  //   tr: 0,
  //   lh: 0,
  //   ls: 0,
  //   fc: [1, 1, 1],
  // });
  const textState = props.text;
  const [color, setColor] = useState<ColorResult>({
    r: 255,
    g: 255,
    b: 255,
  });
  const handleSetTextState = (
    obj: Partial<VideoTemplate.AnimationTextDocumentData['d']['k'][0]['s']>,
  ) => {
    props.onChange({
      ...props.text,
      ...obj,
    });
  };
  const handleFontSizeSelectChange = (value: number) => {
    handleSetTextState({
      s: value,
    });
    // setTextState({
    //   s: value,
    // });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    handleSetTextState({
      t: e.target.value,
    });
  };
  const handleColorChange = (rgb: ColorResult) => {
    setColor(rgb);
    handleSetTextState({
      fc: [rgb.r / 255, rgb.g / 255, rgb.b / 255],
    });
  };
  useEffect(() => {
    setColor({
      r: props.text.fc?.[0] * 255 ?? 255,
      g: props.text.fc?.[1] * 255 ?? 255,
      b: props.text.fc?.[2] * 255 ?? 255,
    });
  }, [props.text]);
  return (
    <div>
      <Input.TextArea
        className="mb8"
        value={textState.t}
        onChange={handleInputChange}
      />
      <div className="flex">
        <div className="flex flex1" style={{ marginRight: '8px' }}>
          {/* <Dropdown
            visible={showColorPick}
            className="flex flex1"
            onVisibleChange={handleVisibleChange}
            overlay={
              <PhotoshopPicker
                color={color}
                onAccept={handleColorAccept}
                onCancel={handleColorCancel}
                onChangeComplete={handleColorChange}
              />
            }
          > */}
          <Button
            className="flex-between flex1"
            style={{ lineHeight: 0, display: 'flex' }}
          >
            <span className="mr2">颜色</span>
            <ColorPicker
              mode="RGB"
              className="flex"
              color={`rgb(${color.r},${color.g},${color.b})`}
              onChange={color => {
                handleColorChange(hexToRgb(color.color));
              }}
              placement="bottomRight"
            />
          </Button>

          {/* </Dropdown> */}
        </div>
        <Select
          className="flex flex1"
          value={textState.s}
          onChange={handleFontSizeSelectChange}
        >
          {FontSizeDataSource.map(item => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      </div>
    </div>
  );
};
export default TextEditor;

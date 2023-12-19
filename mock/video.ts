import { AnimationData11_1 } from './animation11-1';
import { AnimationData916_1 } from './animation916-1';
import { AnimationData916_2 } from './animation916-2';
import { AnimationData11_2 } from './animation11-2';
import { AnimationData169_1 } from './animation169-1';
import { AnimationData169_2 } from './animation169-2';
import { AnimationTest } from './test';
import { Animation916_2_2 } from './aniamtion9_16_2';
import { Animation916_2_2_2 } from './animatiom916_2_2_2';
import { Animation916_3 } from './animation916-3';

export default {
  'GET /video/list': {
    data: {
      total: 2,
      videoList: [
        {
          address: 'xxxxx',
          status: false,
          videoId: 1,
          size: 'vertical',
          musicUrl: '1.mp3',
          videoInfo: AnimationData169_1,
        },
        {
          address: 'xxxxx',
          status: true,
          videoId: 2,
          size: 'vertical',
          musicUrl: '1.mp3',
          videoInfo: AnimationData169_1,
        },
      ],
    },
  },
  'POST /videoTemplate/list': {
    data: {
      total: 2,
      tempList: [
        {
          templateId: 1,
          music: '1.mp3',
          size: 'horizontal',
          templateInfo: JSON.stringify(AnimationData11_1),
        },
        {
          templateId: 2,
          music: '2.mp3',
          size: 'horizontal',
          templateInfo: JSON.stringify(AnimationData11_1),
        },
        {
          templateId: 3,
          music: '3.mp3',
          size: 'vertical',
          templateInfo: JSON.stringify(AnimationData11_1),
        },
      ],
    },
  },
  'GET /videoTemplate/info': {
    data: {
      templateId: 1,
      musicUrl: '1.mp3',
      size: 'vertical',
      templateInfo: Animation916_2_2_2,
    },
  },
  'GET /video/info': {
    data: {
      address: 'xxxxx',
      status: false,
      videoId: 1,
      size: 'vertical',
      musicUrl: '1.mp3',
      videoInfo: AnimationData916_1,
    },
  },
};

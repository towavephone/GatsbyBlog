---
title: React 前端埋点选型
categories:
   - 前端
path: /react-frontend-tracking-selection/
tags: 前端, 埋点, 预研
date: 2025-10-27 11:17:30
---

# 背景

统计线上用户各个功能的使用情况，以便后续针对性的优化

# 实现

## 前端

1. 使用 https://github.com/nytimes/react-tracking 三方库埋点
2. 使用 sendBeacon 异步发送埋点信息
3. 埋点信息默认发送 location，type（默认为 enter，即进入页面类型），create_by（埋点触发人）

utils/sendReport.js

```js
function sendBeacon(url, data) {
   if (!navigator.sendBeacon) {
      return false;
   }

   return navigator.sendBeacon(url, data);
}

export default function sendReport(data) {
   const newData = new FormData();
   newData.append('data', JSON.stringify(data));
   return sendBeacon('/web_track/send/', newData);
}
```

index.js

```js
import { pick } from 'lodash'

import sendReport from './utils/sendReport';

const isProd = process.env.NODE_ENV === 'production';

const TrackHoc = ({ children }) => {
   const { Track } = useTracking(
      () => ({
         location: pick(window.location, ['origin', 'hash', 'href']),
         type: 'enter', // 默认值
         create_by: '当前登录用户或者不传根据 cookie 来判断用户'
      }),
      {
         dispatch: (data) => {
            console.log('tracking', data);
            // 不是正式环境不上传埋点数据
            if (!isProd) {
               return;
            }
            sendReport(data);
         }
      }
   );

   return <Track>{children}</Track>
};
```

## 后端

数据库表 web_track 记录了以下字段

1. 用户(create_by)
2. 访问信息(location)
3. 对应页面(page)
4. 对应功能(function)
5. 埋点类型(type，目前有 enter/click 两类，对应进入页面/事件点击)

# 使用方式

```js
import { useTracking } from 'react-tracking';

// 在函数组件使用，进入页面触发专用
useTracking({ page: 'human_driver_compare' }, { dispatchOnMount: true });

// 在函数组件使用，事件触发专用
const { trackEvent, Track } = useTracking({ page: 'job_detail' });
// 这里使用 Track 高阶组件包裹之后，孙子组件调用 trackEvent 时候就会合并父级 data（当然这里的 trackEvent 触发也会合并），即孙子组件不需要在重复 page: 'job_detail'，默认 type 为 enter
return <Track>{children}</Track>;

// 在类组件中使用，装饰器装饰之后 props 就带有 tracking 属性
@track()
export default class Statistic extends React.Component {
   handleShowSummaryClick = (e) => {
      const { checked } = e.target;
      this.setState({ show_summary: checked });
      if (checked) {
         // 事件触发
         this.props.tracking.trackEvent({ function: 'show_summary', type: 'click' });
      }
   };

   // 点击事件触发，即调用这个函数就触发，注意和上面的触发逻辑不同
   @track({ function: 'show_summary', type: 'click' })
   handleShowSummaryClick = (e) => {
      const { checked } = e.target;
      this.setState({ show_summary: checked });
   };
}
```

之后使用 redash 读取 mongo 数据库进行统计

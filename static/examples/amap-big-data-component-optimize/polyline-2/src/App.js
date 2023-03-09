import React, { } from 'react';
import { useRequest } from 'ahooks';
import simplify from 'simplify-js';

import { getAllCountryInfo } from './services';

import ReactAmap from './components/ReactAmap';

const Index = () => {
  const { data = [], loading } = useRequest(getAllCountryInfo);

  let total = 0;
  let optimizeTotal = 0;
  data.forEach((item) => {
    const { path } = item;
    total += path.length;
    item.path = simplify(path.map(([x, y]) => ({ x, y })), 0, true).map(({ x, y }) => [x, y]);
    optimizeTotal += item.path.length;
  });

  console.log('total', total, 'optimizeTotal', optimizeTotal);

  return <ReactAmap data={data} loading={loading} />;
};

export default Index;

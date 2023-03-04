import React from 'react';
import { useRequest } from 'ahooks';

import { getAllCountryInfo } from './services';

import ReactAmap from './components/ReactAmap';

const Index = () => {
  const { data = [], loading } = useRequest(getAllCountryInfo);

  return <ReactAmap data={data} loading={loading} />;
};

export default Index;

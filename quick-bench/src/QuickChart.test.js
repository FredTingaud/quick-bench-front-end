import React from 'react';
import QuickChart from './QuickChart.js';
import { shallow } from 'enzyme';

it('renders without crashing', () => {
    shallow(<QuickChart benchmarks={[]} id={"abcd"}/>);
  });
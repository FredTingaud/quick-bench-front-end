import React from 'react';
import ReactDOM from 'react-dom';
import Benchmark from './QuickBenchmark';

import Fetch from "components/Fetch.js";

jest.mock("react-monaco-editor", () => () => <div></div>);

var searchedId;

jest.mock("components/Fetch.js", () => {
    return {
        __esModule: true,
        default: {
            fetchContent: jest.fn(),
            fetchResults: jest.fn()
        }
    }
});

it('doesnt load when there is no id', () => {
      Fetch.fetchContent.mockClear(); 
      const div = document.createElement('div');
    ReactDOM.render(<Benchmark/>, div);
    expect(Fetch.fetchContent.mock.calls.length).toBe(0);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('loads passed ids', () => {
      Fetch.fetchContent.mockClear(); 
    const div = document.createElement('div');
    ReactDOM.render(<Benchmark id={'abcd'}/>, div);
    expect(Fetch.fetchContent.mock.calls.length).toBe(1);
    expect(Fetch.fetchContent.mock.calls[0][1]).toBe('abcd');
    let callback = Fetch.fetchContent.mock.calls[0][2];
   
    ReactDOM.unmountComponentAtNode(div);
  });

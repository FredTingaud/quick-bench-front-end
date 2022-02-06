import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Fetch from "components/Fetch.js";

jest.mock("react-monaco-editor", () => () => <div></div>);

jest.mock("components/Fetch.js", () => {
    return {
        __esModule: true,
        default: {
            fetch: jest.fn()
        }
    }
});

beforeEach(() => {
    Fetch.fetch.mockClear();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  expect(Fetch.fetch.mock.calls.length).toBe(1);
  ReactDOM.unmountComponentAtNode(div);
});

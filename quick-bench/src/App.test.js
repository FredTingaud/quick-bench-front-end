import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock("react-monaco-editor", () => () => <div></div>);

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

import React from 'react';
import { createRoot } from 'react-dom/client'

jest.mock("components/BashOutput.js", () => (props) => <mock-BashOutput {...props} />)

jest.mock('react-resize-detector', () => (props) => <mock-ResizeDetector {...props} />)

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
    const container = document.body.appendChild(document.createElement('div'));
    const div = createRoot(container);
    div.render(<React.StrictMode><App /></React.StrictMode>);
    setTimeout(() => {
        expect(Fetch.fetch.mock.calls.length).toBe(1);
        div.unmount();
    });
});

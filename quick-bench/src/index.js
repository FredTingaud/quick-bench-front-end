import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.scss';
import { unregister } from './registerServiceWorker';

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <React.StrictMode>
        <App className="full-size" />
    </React.StrictMode>
);

unregister();

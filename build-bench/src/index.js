import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { unregister } from './registerServiceWorker';

ReactDOM.render(
    <App className="full-size" />,
    document.getElementById('root')
);

unregister();

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <App className="full-size" />,
    document.getElementById('root')
);
registerServiceWorker();

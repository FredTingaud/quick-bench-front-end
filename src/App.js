import React, { Component } from 'react';
import Benchmark from './Benchmark.js';
import Header from './Header.js';
import './App.css';


const url = process.env.REACT_APP_SERVER + ':' + process.env.REACT_APP_PORT;

const maxCodeSize = 20000;

class App extends Component {
    render() {
        return (
            <div className="App">
                <Header />
                <Benchmark url={url} maxCodeSize={maxCodeSize} />
            </div>
        );
    }
}

export default App;

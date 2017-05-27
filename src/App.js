import React, { Component } from 'react';
import Benchmark from './Benchmark.js';
import './App.css';

const url = process.env.REACT_APP_SERVER + ':' + process.env.REACT_APP_PORT;

const maxCodeSize = 20000;

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    Quick C++ Benchmark
                </div>
                <div>
                    <Benchmark url={url} maxCodeSize={maxCodeSize} />
                </div>
                <div className="App-footer">
                    By Fred Tingaud <a href="mailto:ftingaud+quick-bench@gmail.com">Mail</a> - <a href="https://twitter.com/FredTingaudDev">Twitter</a><br />
                    Favicon <a href='http://www.freepik.com/free-vector/chronometer-timer-collection_717989.htm'>designed by Freepik</a>
                </div>
            </div>
        );
    }
}

export default App;

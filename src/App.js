import React, { Component } from 'react';
import Benchmark from './Benchmark.js';
import './App.css';

const url = process.env.REACT_APP_SERVER + ':3000';

class App extends Component {
    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <p>Quick Benchmark<br />
                        Fred Tingaud</p>
                </div>
                <div>
                    <Benchmark url={url} />
                </div>
                <div className="App-footer">
                    Favicon <a href='http://www.freepik.com/free-vector/chronometer-timer-collection_717989.htm'>designed by Freepik</a>
                </div>
            </div>
        );
    }
}

export default App;

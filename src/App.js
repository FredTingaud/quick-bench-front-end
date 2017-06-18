import React, { Component } from 'react';
import Benchmark from './Benchmark.js';
import Header from './Header.js';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom'

const url = process.env.REACT_APP_SERVER + ':' + process.env.REACT_APP_PORT;

const maxCodeSize = 20000;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            prevlocation: null
        }
    }
    componentDidMount() {
        var all = document.getElementsByClassName('whole-content');
        for (var i = 0; i < all.length; i++) {
            all[i].style.marginTop = this.header.clientHeight + 'px';
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (this.state.location !== this.state.prevlocation) {
            this.setState({
                prevlocation: this.state.location
            });
        }
    }
    redirect() {
        if (this.state.location !== this.state.prevlocation) {
            return (
                <Redirect push to={'/' + this.state.location} />
            );
        }
        return null;
    }

    Home = ({ match }) => (
        <Benchmark className="whole-content" id={match.params ? match.params.id : null} url={url} maxCodeSize={maxCodeSize} onLocationChange={(l) => this.setState({ location: l })} />
    )

    render() {
        return (
            <BrowserRouter history={this.state.location}>
                <div className="App full-size">
                    <div ref={div => { this.header = div; }}><Header /></div>
                        <Route exact path="/" component={this.Home} />
                        <Route exact path="/:id" component={this.Home} />
                        {this.redirect()}
                </div>
            </BrowserRouter>
        );
    }
}

export default App;
import React, { Component } from 'react';
import { DropdownItem } from 'react-bootstrap';
import Benchmark from './BuildBenchmark.js';
import Header from 'components/Header.js';
import 'components/resources/css/Shared.css';
import './App.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : window.location.origin;

const maxCodeSize = 20000;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            prevlocation: null,
            showAbout: false
        };
    }
    componentDidUpdate() {
        if (this.state.location !== this.state.prevlocation) {
            this.setState({
                prevlocation: this.state.location
            });
        }
    }
    redirect() {
        if (this.state.location !== this.state.prevlocation && this.state.location) {
            return (
                <Redirect push to={'/b/' + this.state.location} />
            );
        }
        return null;
    }

    openAbout() {
        this.setState({ showAbout: true });
    }
    closeAbout() {
        this.setState({ showAbout: false });
    }

    Home = ({ match }) => <Benchmark id={match.params ? match.params.id : null} url={url} maxCodeSize={maxCodeSize} onLocationChange={(l) => this.setState({ location: l })} />;

    render() {
        return (
            <BrowserRouter history={this.state.location}>
                <div className="one-page">
                    <div ref={div => { this.header = div; }}><Header brand="Benchmark C++ Builds" entries={() => (<><DropdownItem onClick={() => this.openAbout()}>About Build Bench</DropdownItem></>)} /></div>
                    <Route exact path={["/", "/b/:id"]} component={this.Home} />
                    {this.redirect()}
                </div>
                <AboutDialog show={this.state.showAbout} onHide={() => this.closeAbout()} />
            </BrowserRouter>
        );
    }
}

export default App;
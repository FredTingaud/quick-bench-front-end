import React, { Component } from 'react';
import { DropdownItem } from 'react-bootstrap';
import Benchmark from './QuickBenchmark.js';
import Header from 'components/Header.js';
import 'components/Shared.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';
import BenchmarkDialog from './dialogs/BenchmarkDialog.js';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : window.location.origin;

const maxCodeSize = 20000;

const DEFAULT_DESCRIPTION = 'Quick-Bench is an online tool to easily create and run C++ micro-benchmarks using Google Benchmark API.';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            prevlocation: null,
            description: DEFAULT_DESCRIPTION,
            showAbout: false,
            showBenchmark: false
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
                <Redirect push to={'/q/' + this.state.location} />
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

    openBenchmark() {
        this.setState({ showBenchmark: true });
    }
    closeBenchmark() {
        this.setState({ showBenchmark: false });
    }

    Home = ({ match }) => <Benchmark id={match.params ? match.params.id : null} url={url} maxCodeSize={maxCodeSize} onLocationChange={(l) => this.setState({ location: l })} onDescriptionChange={(d) => this.setState({ description: d ? d : DEFAULT_DESCRIPTION })} />;

    render() {
        return (
            <BrowserRouter history={this.state.location}>
                <div className="one-page">
                    <div className="fixed-content" ref={div => { this.header = div; }}><Header brand="Quick C++ Benchmark" entries={() => (<><DropdownItem onClick={() => this.openAbout()}>About Quick Bench</DropdownItem>
                        <DropdownItem onClick={() => this.openBenchmark()}>How to write my benchmarks</DropdownItem>
                    </>)} /></div>
                    <Route exact path={["/", "/q/:id"]} component={this.Home} />
                    {this.redirect()}
                </div>
                <AboutDialog show={this.state.showAbout} onHide={() => this.closeAbout()} />
                <BenchmarkDialog show={this.state.showBenchmark} onHide={() => this.closeBenchmark()} />

            </BrowserRouter>
        );
    }
}

export default App;
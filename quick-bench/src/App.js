import React, { Component } from 'react';
import { DropdownItem } from 'react-bootstrap';
import Benchmark from './QuickBenchmark.js';
import Header from 'components/Header.js';
import { Helmet } from "react-helmet";
import './App.css';
import 'components/Shared.css';
import Display from 'components/Display.js';
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
            stylePath: '',
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
    setStyle(css) {
        this.setState({ stylePath: css });
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

    Home = ({ match }) => <Benchmark id={match.params ? match.params.id : null} url={url} maxCodeSize={maxCodeSize} onLocationChange={(l) => this.setState({ location: l })} onDescriptionChange={(d) => this.setState({ description: d ? d : DEFAULT_DESCRIPTION })} specialPalette={this.state.stylePath !== ''} />;

    render() {
        return (
            <BrowserRouter history={this.state.location}>
                <div className="one-page">
                            <Helmet>
                                <meta name="twitter:card" content="summary" />
                                <meta name="twitter:site" content="@FredTingaudDev" />
                                <meta name="twitter:title" content="Quick C++ Benchmarks" />
                                <meta name="twitter:url" content="http://quick-bench.com/" />
                                <meta name="twitter:description" content={this.state.description} />
                                <meta property="og:type" content="website" />
                                <meta property="og:url" content="http://quick-bench.com/" />
                                <meta property="og:title" content="Quick C++ Benchmarks" />
                                <meta property="og:description" content={this.state.description} />
                                <Display when={this.state.stylePath}>
                                    <link rel="stylesheet" type="text/css" href={process.env.PUBLIC_URL + '/css/' + this.state.stylePath} />
                                </Display>
                            </Helmet>
                            <div className="fixed-content" ref={div => { this.header = div; }}><Header setStyle={css => this.setStyle(css)} brand="Quick C++ Benchmark" entries={() => (<><DropdownItem onClick={() => this.openAbout()}>About Quick Bench</DropdownItem>
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
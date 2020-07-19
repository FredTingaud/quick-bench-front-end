import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import Benchmark from './QuickBenchmark.js';
import Header from 'components/Header.js';
import 'components/resources/css/Shared.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';
import BenchmarkDialog from './dialogs/BenchmarkDialog.js';
import { ReactComponent as Logo } from './logo.svg';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : window.location.origin;

const maxCodeSize = 20000;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            prevlocation: null,
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

    Home = ({ match }) => <Benchmark id={match.params ? match.params.id : null} url={url} maxCodeSize={maxCodeSize} onLocationChange={(l) => this.setState({ location: l })} />;

    renderEntries() {
        return <><Dropdown.Item onClick={() => this.openAbout()}>About Quick Bench</Dropdown.Item>
            <Dropdown.Item onClick={() => this.openBenchmark()}>How to write my benchmarks</Dropdown.Item>
        </>;
    }
    render() {
        return (
            <BrowserRouter history={this.state.location}>
                <div className="one-page">
                    <div className="fixed-content" ref={div => { this.header = div; }}>
                        <Header brand={<><Logo className="line-img mr-2" style={{ fill: "#FFFFFF" }} title="logo" /> Quick C++ Benchmark</>} entries={() => this.renderEntries()} motd={{ url: "https://build-bench.com", text: "Discover Build Bench!" }} />
                    </div >
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
import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import Benchmark from './QuickBenchmark.js';
import Header from 'components/Header.js';
import 'components/resources/css/Shared.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';
import BenchmarkDialog from './dialogs/BenchmarkDialog.js';
import { ReactComponent as Logo } from './logo.svg';
import QuickFetch from './QuickFetch.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            prevlocation: null,
            showAbout: false,
            showBenchmark: false,
            maxCodeSize: 20000,
            timeout: 60
        };
    }
    componentDidUpdate() {
        if (this.state.location !== this.state.prevlocation) {
            this.setState({
                prevlocation: this.state.location
            });
        }
    }
    componentDidMount() {
        QuickFetch.fetchEnv(env => this.setState({
            timeout: env.timeout,
            maxCodeSize: env.maxCodeSize
        }));
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

    Home = ({ match }) => <Benchmark id={match.params ? match.params.id : null} maxCodeSize={this.state.maxCodeSize} timeout={this.state.timeout} onLocationChange={(l) => this.setState({ location: l })} />;

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
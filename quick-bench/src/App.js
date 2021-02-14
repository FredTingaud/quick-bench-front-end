import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import Benchmark from './QuickBenchmark.js';
import Header from 'components/Header.js';
import 'components/resources/css/Shared.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';
import BenchmarkDialog from './dialogs/BenchmarkDialog.js';
import { ReactComponent as Logo } from 'components/resources/ico/qb.svg';
import QuickFetch from './QuickFetch.js';
import DefaultSettings from 'components/DefaultSettings.js';
import ContainersDialog from 'components/dialogs/ContainersDialog.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            prevlocation: null,
            showAbout: false,
            showBenchmark: false,
            maxCodeSize: 20000,
            timeout: 60,
            downloadContainers: false,
            containers: DefaultSettings.allCompilers
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
        QuickFetch.fetchEnv(env => {
            if (!env)
                return;
            this.setState({
                timeout: env.timeout,
                maxCodeSize: env.maxCodeSize,
                containers: env.containers,
                downloadContainers: env.containerDl
            });
        });
        
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

    openContainers() {
        this.setState({ showContainers: true });
    }
    closeContainers() {
        this.setState({ showContainers: false });
    }
    pullContainer() {
        this.openContainers();
    }

    Home = ({ match }) => <Benchmark id={match.params ? match.params.id : null} maxCodeSize={this.state.maxCodeSize} timeout={this.state.timeout} containers={this.state.containers} pullContainer={this.state.downloadContainers ? (() => this.pullContainer()) : null} onLocationChange={(l) => this.setState({ location: l })} />;

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
                        <Header brand={<><Logo className="line-img mr-2" style={{ fill: "#FFFFFF" }} title="logo" /> Quick C++ Benchmark</>} entries={() => this.renderEntries()} motd={{ url: "https://github.com/FredTingaud/bench-runner", text: "Run Quick Bench locally" }} />
                    </div >
                    <Route exact path={["/", "/q/:id"]} component={this.Home} />
                    {this.redirect()}
                </div>
                <AboutDialog show={this.state.showAbout} onHide={() => this.closeAbout()} />
                <BenchmarkDialog show={this.state.showBenchmark} onHide={() => this.closeBenchmark()} />
                <ContainersDialog show={this.state.showContainers} onHide={() => this.closeContainers()} containers={this.state.containers} containersChanged={c => this.setState({ containers: c })} />
            </BrowserRouter>
        );
    }
}

export default App;
import React, { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import Benchmark from './BuildBenchmark.js';
import Header from 'components/Header.js';
import 'components/resources/css/Shared.css';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import AboutDialog from './dialogs/AboutDialog.js';
import { ReactComponent as Logo } from './logo.svg';
import BuildFetch from './BuildFetch.js';
import DefaultSettings from 'components/DefaultSettings.js';
import ContainersDialog from 'components/dialogs/ContainersDialog.js';

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : window.location.origin;

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            location: null,
            prevlocation: null,
            showAbout: false,
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
        BuildFetch.fetchEnv(env => {
            if (!env)
                return;
            this.setState({
                timeout: env.timeout,
                maxCodeSize: env.maxCodeSize,
                containers: env.containers,
                downloadContainers: env.containerDl
            })
        });
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

    openContainers() {
        this.setState({ showContainers: true });
    }
    closeContainers() {
        this.setState({ showContainers: false });
    }
    pullContainer() {
        this.openContainers();
    }

    Home = ({ match }) => <Benchmark id={match.params ? match.params.id : null} url={url} maxCodeSize={this.state.maxCodeSize} timeout={this.state.timeout} containers={this.state.containers} pullContainer={this.state.downloadContainers ? (() => this.pullContainer()) : null} onLocationChange={(l) => this.setState({ location: l })} />;

    renderEntries() {
        return <><Dropdown.Item onClick={() => this.openAbout()}>About Build Bench</Dropdown.Item></>;
    }

    render() {
        return (
            <BrowserRouter history={this.state.location}>
                <div className="one-page">
                    <div ref={div => { this.header = div; }}><Header brand={<><Logo className="line-img mr-2" style={{ fill: "#FFFFFF" }} title="logo" /> Compare C++ Builds</>} entries={() => this.renderEntries()} /></div>
                    <Route exact path={["/", "/b/:id"]} component={this.Home} />
                    {this.redirect()}
                </div>
                <AboutDialog show={this.state.showAbout} onHide={() => this.closeAbout()} />
                <ContainersDialog show={this.state.showContainers} onHide={() => this.closeContainers()} containers={this.state.containers} containersChanged={c => this.setState({ containers: c })} />
            </BrowserRouter>
        );
    }
}

export default App;
import React from 'react';
import { Navbar, Nav, NavDropdown, MenuItem } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import AboutDialog from './dialogs/AboutDialog.js';
import BenchmarkDialog from './dialogs/BenchmarkDialog.js';
import AuthorDialog from './dialogs/AuthorDialog.js';
import ThanksDialog from './dialogs/ThanksDialog.js';
import PrivacyDialog from './dialogs/PrivacyDialog.js';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAbout: false,
            showBenchmark: false,
            showAuthor: false,
            showThanks: false,
            showPrivacy: false
        };
    }
    openInfo(key) {
        if (key) {
            if (key === 'about') {
                this.openAbout();
            } else if (key === 'benchmark') {
                this.openBenchmark();
            } else if (key === 'author') {
                this.openAuthor();
            } else if (key === 'favicon') {
                this.openFavicon();
            } else if (key === 'privacy') {
                this.openPrivacy();
            }
        }
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
    openAuthor() {
        this.setState({ showAuthor: true });
    }
    closeAuthor() {
        this.setState({ showAuthor: false });
    }
    openFavicon() {
        this.setState({ showThanks: true });
    }
    closeFavicon() {
        this.setState({ showThanks: false });
    }
    openPrivacy() {
        this.setState({ showPrivacy: true });
    }
    closePrivacy() {
        this.setState({ showPrivacy: false });
    }

    render() {
        return (
            <Navbar inverse collapseOnSelect>
                <Navbar.Header>
                    <Navbar.Brand>
                        <Link to="/">Quick C++ Benchmark</Link>
                    </Navbar.Brand>
                    <Navbar.Toggle />
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav pullRight>
                        <NavDropdown title="Support Quick Bench" id="basic-nav-dropdown">
                            <MenuItem href="https://www.patreon.com/bePatron?u=8599781" target="_blank"><img src="ico/Patreon.svg" className="line-img" role="presentation" /> Support on Patreon</MenuItem>
                        </NavDropdown>
                        <NavDropdown title="More" id="basic-nav-dropdown" onSelect={this.openInfo.bind(this)}>
                            <MenuItem eventKey="about">About Quick-bench</MenuItem>
                            <MenuItem eventKey="benchmark">How to write my benchmarks</MenuItem>
                            <MenuItem divider />
                            <MenuItem href="https://github.com/FredTingaud/quick-bench-front-end" target="_blank">GitHub project - front-end</MenuItem>
                            <MenuItem href="https://github.com/FredTingaud/quick-bench-back-end" target="_blank">GitHub project - back-end</MenuItem>
                            <MenuItem divider />
                            <MenuItem eventKey="privacy">Privacy</MenuItem>
                            <MenuItem eventKey="favicon">Thanks</MenuItem>
                            <MenuItem eventKey="author">About the author</MenuItem>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
                <AboutDialog show={this.state.showAbout} onHide={() => this.closeAbout()} />
                <BenchmarkDialog show={this.state.showBenchmark} onHide={() => this.closeBenchmark()} />
                <AuthorDialog show={this.state.showAuthor} onHide={() => this.closeAuthor()} />
                <PrivacyDialog show={this.state.showPrivacy} onHide={() => this.closePrivacy()} />
                <ThanksDialog show={this.state.showThanks} onHide={() => this.closeFavicon()} />
            </Navbar>
        );
    }
}

export default Header;

import React from 'react';
import { Navbar, Nav, NavDropdown, DropdownItem, Dropdown, Form } from 'react-bootstrap';
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
            showPrivacy: false,
            showEasterEgg: this.shouldShowEasterEgg(),
            showingEasterEgg: false,
        };
    }
    shouldShowEasterEgg() {
        let currentTime = new Date();
        return currentTime.getMonth() === 11 && currentTime.getDate() < 27;
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
    easterEgg() {
        if (this.state.showingEasterEgg)
            this.props.setStyle('');
        else
            this.props.setStyle('Christmas.css');
        this.setState({ showingEasterEgg: !this.state.showingEasterEgg });
    }
    render() {
        return (
            <Navbar bg="dark" variant="dark" collapseOnSelect>
                <Nav className="mr-auto">
                    <Nav hidden={!this.state.showEasterEgg} onSelect={() => this.easterEgg()}>
                        <Nav.Link eventKey><img src="ico/christmas-tree.svg" className="line-img" alt="A surprise?" /></Nav.Link>
                    </Nav>
                    <Navbar.Brand>
                        Quick C++ Benchmark
                </Navbar.Brand>
                </Nav>
                <Form inline>
                    <Navbar.Collapse className="mr-sm-2">
                        <Nav>
                            <NavDropdown title="Support Quick Bench" id="basic-nav-dropdown" alignRight>
                                <DropdownItem href="https://www.patreon.com/bePatron?u=8599781" target="_blank"><img src="ico/Patreon.svg" className="line-img" alt="Patreon icon" /> Support on Patreon</DropdownItem>
                            </NavDropdown>
                            <NavDropdown title="More" id="basic-nav-dropdown" onSelect={this.openInfo.bind(this)} alignRight>
                                <DropdownItem eventKey="about">About Quick-bench</DropdownItem>
                                <DropdownItem eventKey="benchmark">How to write my benchmarks</DropdownItem>
                                <Dropdown.Divider />
                                <DropdownItem href="https://github.com/FredTingaud/quick-bench-front-end" target="_blank">GitHub project - front-end</DropdownItem>
                                <DropdownItem href="https://github.com/FredTingaud/quick-bench-back-end" target="_blank">GitHub project - back-end</DropdownItem>
                                <Dropdown.Divider />
                                <DropdownItem eventKey="privacy">Privacy</DropdownItem>
                                <DropdownItem eventKey="favicon">Thanks</DropdownItem>
                                <DropdownItem eventKey="author">About the author</DropdownItem>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Form>
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

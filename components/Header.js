import React, {Children, isValidElement, cloneElement} from 'react';
import { Navbar, Nav, NavDropdown, Dropdown, Form, Button } from 'react-bootstrap';
import AuthorDialog from './dialogs/AuthorDialog.js';
import ThanksDialog from './dialogs/ThanksDialog.js';
import PrivacyDialog from './dialogs/PrivacyDialog.js';
import patreon from 'components/resources/ico/Patreon.svg';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAuthor: false,
            showThanks: false,
            showPrivacy: false
        };
    }
    openInfo(key) {
        if (key) {
            if (key === 'author') {
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
        // const childrenWithProps = Children.map(this.props.children, child => {
        //     if (isValidElement(child)) {
        //         return cloneElement(child, {
        //             value: this.props.values[this.props.index],
        //             onChange: c => this.onChange(c)
        //         });
        //     }
        //     return child;
        // });
        return (
            <Navbar bg="dark" variant="dark" collapseOnSelect>
                <Nav className="me-auto">
                    <Navbar.Brand>
                        {this.props.brand}
                    </Navbar.Brand>
                </Nav>
                <Form>
                    <Navbar.Collapse className="me-sm-2">
                        <Nav>
                            {this.props.motd ? <Button href={this.props.motd.url} variant="secondary" className="mx-5" target="_blank">{this.props.motd.text}</Button> : null}
                            <NavDropdown title="Support Quick Bench Suite" id="basic-nav-dropdown" align="end">
                                <Dropdown.Item href="https://www.patreon.com/bePatron?u=8599781" target="_blank"><img src={patreon} className="line-img" alt="Patreon icon" /> Support on Patreon</Dropdown.Item>
                            </NavDropdown>
                            <NavDropdown title="More" id="basic-nav-dropdown" onSelect={this.openInfo.bind(this)} align="end">
                                {this.props.children}
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="https://github.com/FredTingaud/quick-bench-front-end" target="_blank">GitHub project - front-end</NavDropdown.Item>
                                <NavDropdown.Item href="https://github.com/FredTingaud/quick-bench-back-end" target="_blank">GitHub project - back-end</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item eventKey="privacy">Privacy Policy</NavDropdown.Item>
                                <NavDropdown.Item eventKey="favicon">Thanks</NavDropdown.Item>
                                <NavDropdown.Item eventKey="author">About the author</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Form>
                <AuthorDialog show={this.state.showAuthor} onHide={() => this.closeAuthor()} />
                <PrivacyDialog show={this.state.showPrivacy} onHide={() => this.closePrivacy()} />
                <ThanksDialog show={this.state.showThanks} onHide={() => this.closeFavicon()} />
            </Navbar>
        );
    }
}

export default Header;

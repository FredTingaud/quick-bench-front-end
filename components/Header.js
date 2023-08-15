import React, {useState} from 'react';
import { Navbar, Nav, NavDropdown, Dropdown, Form, Button } from 'react-bootstrap';
import AuthorDialog from './dialogs/AuthorDialog.js';
import ThanksDialog from './dialogs/ThanksDialog.js';
import PrivacyDialog from './dialogs/PrivacyDialog.js';
import patreon from 'components/resources/ico/Patreon.svg';

export default function Header(props) {
    const [showAuthor, setShowAuthor] = useState(false);
    const [showThanks, setShowThanks] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);

    return (
        <Navbar bg="dark" variant="dark" collapseOnSelect>
            <Nav className="me-auto">
                <Navbar.Brand>
                    {props.brand}
                </Navbar.Brand>
            </Nav>
            <Form>
                <Navbar.Collapse className="me-sm-2">
                    <Nav>
                        {props.motd ? <Button href={props.motd.url} variant="secondary" className="mx-5" target="_blank">{props.motd.text}</Button> : null}
                        <NavDropdown title="Support Quick Bench Suite" id="basic-nav-dropdown" align="end">
                            <Dropdown.Item href="https://www.patreon.com/bePatron?u=8599781" target="_blank"><img src={patreon} className="line-img" alt="Patreon icon" /> Support on Patreon</Dropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="More" id="basic-nav-dropdown" align="end">
                            {props.children}
                            <Dropdown.Divider />
                            <NavDropdown.Item href="https://github.com/FredTingaud/quick-bench-front-end" target="_blank">GitHub project - front-end</NavDropdown.Item>
                            <NavDropdown.Item href="https://github.com/FredTingaud/quick-bench-back-end" target="_blank">GitHub project - back-end</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <Dropdown.Item onClick={() => setShowPrivacy(true)}>Privacy Policy</Dropdown.Item>
                            <NavDropdown.Item onClick={() => setShowThanks(true)}>Thanks</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => setShowAuthor(true)}>About the author</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Form>
            <AuthorDialog show={showAuthor} onHide={() => setShowAuthor(false)} />
            <PrivacyDialog show={showPrivacy} onHide={() => setShowPrivacy(false)} />
            <ThanksDialog show={showThanks} onHide={() => setShowThanks(false)} />
        </Navbar>
    );
}

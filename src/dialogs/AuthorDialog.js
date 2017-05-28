import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class AboutDialog extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>About me</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    This website is created and maintained by Fred Tingaud.<br />
                    You can contact me:
                    <br />
                    <a href="mailto:ftingaud+quick-bench@gmail.com" target="_blank">By mail</a>
                    <br />
                    <a href="https://twitter.com/FredTingaudDev" target="_blank">On Twitter</a><br />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default AboutDialog;

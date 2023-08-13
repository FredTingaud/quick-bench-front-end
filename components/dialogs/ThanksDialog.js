import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class ThanksDialog extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>Thanks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The benchmark engine uses <a href='https://github.com/google/benchmark'>Google Benchmark</a>
                    <br />
                    Favicon designed by Oscar Larousse
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ThanksDialog;

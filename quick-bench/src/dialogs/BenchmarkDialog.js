import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class FaviconDialog extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} >
                <Modal.Header closeButton>
                    <Modal.Title>How to write benchmarks</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>Google Benchmark</h4>
                    <p>Quick Bench uses Google Benchmark. Thus, you can go on the project page for more information about how to write good benchmarks:<br />
                        <a href="https://github.com/google/benchmark" target="_blank" rel="noopener noreferrer">https://github.com/google/benchmark</a>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default FaviconDialog;

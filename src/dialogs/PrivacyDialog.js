import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class PrivacyDialog extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide}>
                <Modal.Header closeButton>
                    <Modal.Title>About Privacy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>I do not intend to read or analyze in any way the benchmarks written in Quick Bench.</p>
                    <p>However, please note that in order to provide permalinks automatically, <b>every benchmark that succeeds might be kept for an unlimited duration</b>.
                    Any person with the permalink of a successful benchmark can access both the code and the result of this benchmark.</p>
                    <p><b>Please do not use Quick Bench to run code that should remain confidential.</b> I shall not be liable if the content
                    or result of a benchmark run on Quick Bench is accessed against its author's will.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default PrivacyDialog;

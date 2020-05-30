import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class ConfirmOverwrite extends React.Component {
    handleClose = () => this.props.hide();

    proceed() {
        this.props.confirm();
        this.handleClose();
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Overwrite Other Tabs?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Wrapping will overwrite all tabs with the current code.
                    <br/>
                    This cannot be undone.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => this.proceed()}>Proceed</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ConfirmOverwrite;

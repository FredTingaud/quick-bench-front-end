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
                    Favicon <a href='http://www.freepik.com/free-vector/chronometer-timer-collection_717989.htm'>designed by Freepik</a>
                    <br />
                    Christmas icon: made by <a href="https://www.flaticon.com/authors/good-ware" title="Good Ware">Good Ware</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a> is licensed by <a href="http://creativecommons.org/licenses/by/3.0/" title="Creative Commons BY 3.0">CC 3.0 BY</a>

                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ThanksDialog;

import React from 'react';
import { Modal, Button, Form, Col } from 'react-bootstrap';
import Fetch from 'components/Fetch.js';

class ContainersDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            possibles: [],
            checked: [],
            pulling: false
        };
    }

    handleClose = () => this.props.onHide();

    prepare() {
        this.setState({
            checked: [],
            pulling: false
        });
        Fetch.fetchPossibleContainers(p => this.setState({ possibles: p.filter(c => !this.props.containers.includes(c)) }));
    }
    proceed() {
        this.setState({ pulling: true });
        Fetch.pullContainers(this.state.checked, e => {
            this.props.containersChanged(e);
            this.handleClose();
        });
    }

    changeDownloadList(k, name) {
        if (k.target.checked)
            this.setState({ checked: this.state.checked.concat([name]) });
        else
            this.setState({ checked: this.state.checked.filter(n => n !== name)});
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleClose} onShow={() => this.prepare()} dialogClassName="modal-60w">
                <Modal.Header closeButton>
                    <Modal.Title>Pull another compiler</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Choose which container to pull.
                    <br />
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="clangForm">
                                {this.state.possibles.filter(p => p.startsWith('clang')).map(p => <Form.Check type="checkbox" label={p} id={p} key={p} onChange={k => this.changeDownloadList(k, p)} />)}
                            </Form.Group>

                            <Form.Group as={Col} controlId="gccForm">
                                {this.state.possibles.filter(p => p.startsWith('gcc')).map(p => <Form.Check type="checkbox" label={p} id={p} key={p} onChange={k => this.changeDownloadList(k, p)} />)}
                            </Form.Group>
                        </Form.Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.proceed()} disabled={this.state.pulling}>Proceed</Button>
                    <Button variant="light" onClick={this.handleClose} disabled={this.state.pulling}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ContainersDialog;

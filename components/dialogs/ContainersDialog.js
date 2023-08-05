import React from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import Fetch from 'components/Fetch.js';

class ContainersDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            possibles: [],
            checked: [],
            pulling: false
        };

        this.waitAdd = false;
        this.waitRemove = false;
    }

    handleClose() {
        if (!this.waitAdd && !this.waitRemove)
            this.props.onHide();
    }

    prepare() {
        this.setState({
            checked: this.props.containers.map(c => c.name),
            pulling: false
        });
        this.waitAdd = false;
        this.waitRemove = false;
        Fetch.fetchPossibleContainers(p => this.setState({ possibles: p }));
    }

    proceed() {
        this.setState({ pulling: true });

        const added = this.state.checked.filter(c => !this.props.containers.some(cont => cont.name === c));
        if (added.length > 0) {
            this.waitAdd = true;
            Fetch.pullContainers(added, e => {
                this.waitAdd = false;
                this.props.containersChanged(e);
                this.handleClose();
            });
        }

        const removed = this.props.containers.filter(c => !this.state.checked.includes(c.name));
        if (removed.length > 0) {
            this.waitRemove = true;
            Fetch.deleteContainers(removed, e => {
                this.waitRemove = false;
                this.props.containersChanged(e);
                this.handleClose();
            });
        }

        this.handleClose();
    }

    changeDownloadList(k, name) {
        if (k.target.checked)
            this.setState({ checked: this.state.checked.concat([name]) });
        else
            this.setState({ checked: this.state.checked.filter(n => n !== name)});
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={() => this.handleClose()} onShow={() => this.prepare()} dialogClassName="modal-60w">
                <Modal.Header closeButton>
                    <Modal.Title>Choose your compilers</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Choose which compilers to handle.
                    <br />
                    <Form>
                        <Row>
                            <Form.Group as={Col} controlId="clangForm">
                                {this.state.possibles.filter(p => p.startsWith('clang')).map(p => <Form.Check type="checkbox" label={p} id={p} key={p} onChange={k => this.changeDownloadList(k, p)} defaultChecked={this.props.containers.some(c => c.name === p)} />)}
                            </Form.Group>

                            <Form.Group as={Col} controlId="gccForm">
                                {this.state.possibles.filter(p => p.startsWith('gcc')).map(p => <Form.Check type="checkbox" label={p} id={p} key={p} onChange={k => this.changeDownloadList(k, p)} defaultChecked={this.props.containers.some(c => c.name === p)}/>)}
                            </Form.Group>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={() => this.proceed()} disabled={this.state.pulling}>{this.state.pulling ? "Proceeding" : "Proceed"}</Button>
                    <Button variant="light" onClick={() => this.handleClose()} disabled={this.state.pulling}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ContainersDialog;

import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

class RenameInput extends React.Component {
    constructor(props) {
        super(props);
        this.innerRef = React.createRef();
    }

    componentDidMount() {
        this.innerRef.current.focus();
    }

    keyPressed(event) {
        if (event.key === 'Enter')
            this.props.validate();
    }

    render() {
        return (<Form.Control type="text" defaultValue={this.props.name} onChange={e => this.props.rename(e.target.value)} onKeyPress={e => this.keyPressed(e)} ref={this.innerRef} />);
    }
}
class RenameTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.name
        };
        this.innerRef = React.createRef();
    }

    handleClose = () => this.props.hide();

    proceed() {
        this.props.rename(this.state.name);
        this.handleClose();
    }

    render() {
        return (
            <Modal show={this.props.show} onHide={this.handleClose} animation={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Rename Tabs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <RenameInput name={this.props.name} rename={n => this.setState({ name: n })} validate={() => this.proceed()} />
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={() => this.proceed()} type="submit">Proceed</Button>
                    <Button variant="secondary" onClick={this.handleClose}>Cancel</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default RenameTab;

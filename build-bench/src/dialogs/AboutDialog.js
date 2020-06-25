import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class AboutDialog extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="modal-60w">
                <Modal.Header closeButton>
                    <Modal.Title>About Build Bench</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>What is Build Bench?</h4>
                    <p>Build Bench is a tool to quickly and simply compare the build time of code snippets with various compilers.</p>

                    <h4>How reliable is the result?</h4>
                    <p>The benchmark runs on a pool of AWS machines whose exact speed and load is unknown and potentialy next to multiple other benchmarks.
                       The absolute time taken by a single build is irrelevent by itself. But the comparison between two builds relative to each other is stable
                       and does bring useful information.</p>

                    <h4>Why is the website slow?</h4>
                    <p>This website is free and the costs are covered by myself and the patrons on Patreon. If enough patrons support the project, I will gladly use
                            more powerfull machines in the future. </p>

                    <h4>I found a bug!</h4>
                    <p><a href="https://github.com/FredTingaud/quick-bench-front-end/issues" target="_blank" rel="noopener noreferrer">Please report it here.</a></p>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default AboutDialog;

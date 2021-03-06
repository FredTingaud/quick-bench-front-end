import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class AboutDialog extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="modal-60w">
                <Modal.Header closeButton>
                    <Modal.Title>About Quick Bench</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4>What is Quick Bench?</h4>
                    <p>Quick Bench is a micro benchmarking tool intended to quickly and simply compare the performance of two or more code snippets.</p>

                    <h4>Why display a ratio of (CPU time / Noop time) instead of actual time?</h4>
                    <p>The benchmark runs on a pool of AWS machines whose load is unknown and potentialy next to multiple other benchmarks. Any duration it could
                        output would be meaningless. The fact that a snippet takes 100ms to run in Quick Bench at a given time gives no information whatsoever
                        about what time it will take to run in your application, with your given architecture.</p>
                    <p>Quick Bench can, however, give a reasonably good comparison between two snippets of code run in the same conditions. That is the purpose this tool
                        was created for; removing any units ensures only meaningful comparison.</p>
                    <p>Using a ratio over an empty function also has another advange: if one of your benchmarks runs as fast as Noop after optimisation, the
                        optimizer probably optimized your code away!</p>

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

import React from 'react';
import { Modal, Button } from 'react-bootstrap';

class PrivacyDialog extends React.Component {
    render() {
        return (
            <Modal show={this.props.show} onHide={this.props.onHide} dialogClassName="modal-90w">
                <Modal.Header closeButton>
                    <Modal.Title>Privacy Policy</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    The Quick Bench suite (quick-bench.com and Build-bench.com) is created and maintained by Fred Tingaud, with the occasional help of external contributors whose work is reviewed by Fred.

                    <h2>Topics:</h2>
                    <ul>
                        <li> Information we collect and how we use it?</li>
                        <ul>
                            <li>Your Code</li>
                            <li>Request logs</li>
                        </ul>
                        <li>Third-Party Disclosure</li>
                        <li>Your Rights</li>
                        <ul>
                            <li>The right to access</li>
                            <li>The right to rectification</li>
                            <li>The right to erasure</li>
                            <li>The right to restrict processing</li>
                            <li>The right to object to processing</li>
                            <li>The right to data portability</li>
                        </ul>
                        <li>How to manage cookies</li>
                        <li>Privacy policies of other websites</li>
                        <li>Changes to our privacy policy</li>
                        <li>How to contact us</li>
                    </ul>
                    <h3>Information we collect and how we use it?</h3>
                    This website may collect and process personal and non personal data that you provide to us. Personal data as defined by

                    <h4>Your code</h4>
                    In order to provide permalinks automatically, and to avoid unnecessary recompilation, every benchmark that succeeds might be kept for an unlimited duration.
                    <br />
                    Any person with the permalink of a successful benchmark can access both the code and the result of this benchmark. Thus, please do not use the Quick-Bench suite to run
                    code that should remain confidential.

                    <h4>Request logs</h4>
                    For debug and diagnosis of problems and attacks, every request for a benchmark sent to the backend is logged.
                    <br />
                    These logs contain the request header, which can contain IP address and the user browser settings.
                    <br />
                    These logs are kept at most one month.

                    <h3>Third-Party Disclosure</h3>
                    We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information. We may release information when its release is appropriate to comply with and forced by the law.

                    <h3>Your Rights</h3>

                    We would like to make sure you are fully aware of all of your data protection rights. Every user is entitled to the following:

                    <h4>The right to access</h4>

                    You have the right to request us for copies of your personal data. We may charge you a small fee for this service.

                    <h4>The right to rectification</h4>

                    You have the right to request that we correct any information you believe is inaccurate. You also have the right to request us to complete the information you believe is incomplete.
                    <h4>The right to erasure</h4>

                    You have the right to request that we erase your personal data, under certain conditions.
                    <h4>The right to restrict processing</h4>

                    You have the right to request that we restrict the processing of your personal data, under certain conditions.
                    <h4>The right to object to processing</h4>

                    You have the right to object to our processing of your personal data, under certain conditions.
                    <h4>The right to data portability</h4>
                    You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions.
                    <br />
                    If you make a request, we have one month to respond to you. If you would like to exercise any of these rights, please contact us at our email:
                    <br />
                    ftingaud+quick-bench@gmail.com

                    <h3>How to manage cookies</h3>

                    You can set your browser not to accept cookies, and the above website tells you how to remove cookies from your browser. However, in a few cases, some of our website features may not function as a result.
                    <h3>Privacy policies of other websites</h3>
                    The Quick Bench suite contains links to other websites. Our privacy policy applies only to our website, so if you click on a link to another website, you should read their privacy policy.

                    <h3>Changes to our privacy policy</h3>

                    We keeps our privacy policy under regular review and places any updates on this web page. This privacy policy was last updated on 2 November 2019.

                    <h3>How to contact us</h3>

                    If you have any questions about our privacy policy, the data we hold on you, or you would like to exercise one of your data protection rights, please do not hesitate to contact us.
                    <br />

                    Email us at:
                    <br />
                    quick-bench-privacy@tingaud.net
                    <br />

                    Or write to us at:
                    <br />
                    Fred Tingaud
                    <br />
                    20 Rue de la Folie Mericourt
                    <br />
                    75011 Paris
                    <br />
                    France
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onHide}>OK</Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default PrivacyDialog;

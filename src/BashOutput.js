import React from 'react';
import { Tab, Tabs, Row, Col } from 'react-bootstrap';
var AU = require('ansi_up');
var ansi_up = new AU.default();

class BashOutput extends React.Component {
    updateHTML(text) {
        return { __html: ansi_up.ansi_to_html(text.replace(/<br>/g, '\n')) };
    }

    renderTabs() {
        let tabsList = this.props.titles.map(function (name, i) {
            return <Tab title={name} eventKey={i} key={i} />
        });

        return (<Row>
            <Col xs={12}>
                <Tabs onSelect={(key) => this.props.setIndex(parseInt(key))} activeKey={this.props.index.toString()} id="bench-asm-selection" >
                    {tabsList}
                </Tabs>
            </Col>
        </Row>);
    }
    render() {
        if (this.props.texts && this.props.texts.length > 0 && this.props.texts.some(t => t !== '')) {
            return (<>{this.props.texts.length > 1 ? this.renderTabs() : null}
                <pre>
                    <div className="bash-output" dangerouslySetInnerHTML={this.updateHTML(this.props.texts.length > 1 ? this.props.texts[this.props.index] : this.props.texts[0])} />
                </pre>
            </>
            );
        } else {
            return (<div />);
        }
    }
}

export default BashOutput;

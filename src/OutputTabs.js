import React, { Children, isValidElement, cloneElement } from 'react';
import { Tab, Tabs, Row, Col } from 'react-bootstrap';

class OutputTabs extends React.Component {
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
        const childrenWithProps = Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                return cloneElement(child, { content: this.props.contents[this.props.index] })
            }
            return child;
        });
        if (this.props.contents && this.props.contents.length > 0 && this.props.contents.some(t => t)) {
            return (<>{this.props.contents.length > 1 ? this.renderTabs() : null}
                {childrenWithProps}
            </>
            );
        } else {
            return (< div />);
        }
    }
}

export default OutputTabs;

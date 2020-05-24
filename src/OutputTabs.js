import React, { Children, isValidElement, cloneElement } from 'react';
import { Nav, Tab, Row, Col } from 'react-bootstrap';

class OutputTabs extends React.Component {
    renderTabs() {
        let tabsList = this.props.titles.map(function (name, i) {
            return <Nav.Item key={i}>
                <Nav.Link eventKey={i}>{name}</Nav.Link>
            </Nav.Item>
        });

        return (<Row>
            <Col xs={12}>
                <Tab.Container activeKey={this.props.index.toString()}>
                    <Nav variant="tabs" onSelect={(key) => this.props.setIndex(parseInt(key))} id="bench-asm-selection" >
                        {tabsList}
                    </Nav>
                </Tab.Container>
            </Col>
        </Row>);
    }

    render() {
        const childrenWithProps = Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                return cloneElement(child, { value: this.props.values[this.props.index] })
            }
            return child;
        });
        if (this.props.values && this.props.values.length > 0 && this.props.values.some(t => t)) {
            return (<>{this.props.values.length > 1 ? this.renderTabs() : null}
                {childrenWithProps}
            </>
            );
        } else {
            return (< div />);
        }
    }
}

export default OutputTabs;

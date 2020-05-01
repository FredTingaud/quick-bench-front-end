import React from 'react';
import { Tab, Tabs, Row, Col, Button } from 'react-bootstrap';
import { MdClose } from "react-icons/md";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";

var closeTab;
var closable;
class WrappableTabs extends React.Component {
    constructor(props) {
        super(props);
        this.freezeTab = -1;

        // Binding here because at the call site, "this" is referring to the enclosing tab
        closeTab = this.closeTab.bind(this);
    }

    handleSelect(key) {
        if (this.freezeTab > -1) {
            this.freezeTab = -1;
            return;
        }
        if (key === "Merge") {
            this.props.wrap();
            return;
        }
        const index = parseInt(key);
        if (index === this.props.titles.length) {
            this.props.addTab();
        }
        this.props.setIndex(index);
    }
    closeTab(index) {
        const newIndex = this.props.index >= index ? Math.max(0, this.props.index - 1) : this.props.index;
        this.freezeTab = index;
        this.props.closeTab(index);
        this.props.setIndex(newIndex);
    }
    renderUnwrapButton() {
        return <Button onClick={() => this.props.unwrap()}> <AiOutlineSplitCells /></Button >;
    }
    renderTabs() {
        let tabsList = this.props.titles.map(function (name, i) {
            return <Tab title={
                <>
                    {name}<button className="close-button" onClick={() => closeTab(i)} disabled={closable}><MdClose /></button>
                </>} eventKey={i} key={i} />
        });

        return (<Tabs onSelect={(key) => this.handleSelect(key)} activeKey={this.props.index.toString()} id="bench-asm-selection">
            <Tab title={<AiOutlineMergeCells />} eventKey="Merge" key="Merge" disabled={closable} />
            {tabsList}
            <Tab title="+" eventKey={this.props.titles.length} key="+" />
        </Tabs>);
    }
    render() {
        closable = this.props.titles.length < 2;
        return (
            <Row>
                <Col xs={12}>
                    {this.props.wrapped ? this.renderUnwrapButton() : this.renderTabs()}
                </Col>
            </Row>
        );
    }
}

export default WrappableTabs;

import React, { Children, isValidElement, cloneElement } from 'react';
import { Tab, Tabs, Row, Col, Button, Card } from 'react-bootstrap';
import { MdClose, MdEdit } from "react-icons/md";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai";
import ConfirmOverwrite from './dialogs/ConfirmOverwrite.js';
import RenameTab from './dialogs/RenameTab.js';
import Palette from 'components/Palette.js';

class WrappableTabs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showTabRename: false
            , showConfirm: false
        };
        this.freezeTab = -1;
    }
    onChange(value) {
        let values = Array.from(this.props.values);
        if (this.props.wrapped) {
            values.fill(value);
        }
        else {
            values[this.props.index] = value;
        }
        this.props.onChange(values);
    }
    handleSelect(key) {
        if (this.freezeTab > -1) {
            this.freezeTab = -1;
            return;
        }
        if (key === "Merge") {
            this.wrap();
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
    renameTab() {
        this.setState({ showTabRename: true });
    }
    hideTabRename() {
        this.setState({ showTabRename: false });
    }
    renderUnwrapButton() {
        return <Button variant="outline-primary" onClick={() => this.unwrap()}> <AiOutlineSplitCells /> {this.props.unwrapText}</Button >;
    }
    rename(t) {
        let titles = Array.from(this.props.titles);
        titles[this.props.index] = t
        this.props.onTitlesChange(titles);
    }
    hideConfirm() {
        this.setState({ showConfirm: false });
    }
    confirmWrap() {
        // Wrap and overwrite with the text of the current tab
        this.props.changeWrapped(true, () => this.onChange(this.props.values[this.props.index]));
    }
    wrap() {
        if (this.props.confirm && this.props.values.some((v, i, a) => v !== a[0])) {
            this.setState({ showConfirm: true });
        }
        else {
            this.confirmWrap();
        }
    }
    unwrap() {
        this.props.changeWrapped(false);
    }
    renderTabs() {
        let closable = this.props.titles.length < 2;
        let selection = this.props.index;

        // Binding here because at the call site, "this" is referring to the enclosing tab
        let closeTab = this.closeTab.bind(this);
        let renameTab = this.renameTab.bind(this);
        let colors = this.props.titles.map((_, i) => Palette.pickBorderCSS(i, this.props.titles.length, this.props.palette));

        let tabsList = this.props.titles.map(function (name, i) {
            return <Tab title={
                <>
                    {name}
                    {selection === i ? (<button className="close-button" onClick={() => renameTab(i)} ><MdEdit /></button>) : null}
                    <button className="close-button" onClick={() => closeTab(i)} disabled={closable}><MdClose /></button>
                </>} eventKey={i} key={i} tabClassName={`out-tab ${colors[i]}`} />
        });

        return (<Tabs onSelect={(key) => this.handleSelect(key)} activeKey={this.props.index.toString()} id="bench-asm-selection" >
            <Tab title={<AiOutlineMergeCells />} eventKey="Merge" key="Merge" disabled={closable} />
            {tabsList}
            <Tab title="+" eventKey={this.props.titles.length} key="+" />
        </Tabs>);
    }
    render() {
        const childrenWithProps = Children.map(this.props.children, child => {
            if (isValidElement(child)) {
                return cloneElement(child, {
                    value: this.props.values[this.props.index],
                    onChange: c => this.onChange(c)
                });
            }
            return child;
        });
        return (
            <Card className="flex-container">
                <Card.Header>
                    <Row>
                        <ConfirmOverwrite confirm={() => this.confirmWrap()} show={this.state.showConfirm} hide={() => this.hideConfirm()} />

                        <RenameTab name={this.props.titles[this.props.index]} rename={e => this.rename(e)} show={this.state.showTabRename} hide={() => this.hideTabRename()} />

                        <Col xs={12}>
                            {this.props.wrapped ? this.renderUnwrapButton() : this.renderTabs()}
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body className={this.props.packed ? "packed-card" : ""}>
                    {childrenWithProps}
                </Card.Body>
            </Card>
        );
    }
}

export default WrappableTabs;

import React from 'react';
import { Tab, Tabs, Row, Col, Button } from 'react-bootstrap';
import MonacoEditor from 'react-monaco-editor';
import Palette from './Palette.js';
import ConfirmOverwrite from './dialogs/ConfirmOverwrite.js';
import elementResizeEvent from 'element-resize-event';
import unbind from 'element-resize-event';
import { MdClose } from "react-icons/md";
import { AiOutlineMergeCells, AiOutlineSplitCells } from "react-icons/ai"

var closeTab;

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
            , tab: "0"
            , wrapped: false
            , fullScreen: false
            , showConfirm: false
        }
        this.decorations = [];
        this.prevDecorations = [];
        this.dirty = false;
        this.freezeTab = false;

        // Binding here because at the call site, "this" is referring to the enclosing tab
        closeTab = this.closeTab.bind(this);
    }
    editorDidMount(editor, monaco) {
        editor.focus();
        this.editor = editor;
        this.monaco = monaco;

        if (this.props.names) {
            this.calculateDecorations(this.props.names);
        }
        var element = document.getElementById("codeContainer");
        elementResizeEvent(element, () => this.updateDimensions());
    }
    editorWillUnmount() {
        var element = document.getElementById("codeContainer");
        unbind(element);
    }
    updateDimensions() {
        this.editor.layout();
    }
    handleChange(value) {
        let texts = this.props.code;
        if (this.state.wrapped) {
            texts.fill(value);
        }
        else {
            texts[this.state.index] = value;
        }
        this.dirty = true;
        this.props.onChange(texts, this.props.titles);
    }
    updateDecorations() {
        this.prevDecorations = this.editor.deltaDecorations(
            this.prevDecorations, this.decorations);
    }
    addDecoration(name, i, max) {
        const re1 = new RegExp(`\\s${name}\\s*\\(\\s*benchmark\\s*\\:\\:\\s*State\\s*\\&`);
        const re2 = new RegExp(`BENCHMARK\\s*\\(\\s*${name}\\s*\\)\\s*`);
        const match1 = this.editor.getModel().findNextMatch(re1, {
            column: 1,
            lineNumber: 1
        }, true, true, null, false);
        const match2 = this.editor.getModel().findNextMatch(re2, {
            column: 1,
            lineNumber: 1
        }, true, true, null, false);

        if (match1 && match2) {
            this.decorations.push(
                {
                    range: match1.range.plusRange(match2.range),
                    options: {
                        linesDecorationsClassName: Palette.pickCSS(i, max)
                    }
                });
            const r1 = this.editor.getModel().findNextMatch(name, match1.range.getStartPosition(), false, true, null, false);
            this.decorations.push({
                range: r1.range,
                options: {
                    inlineClassName: Palette.pickCSS(i, max)
                }
            });
            const r2 = this.editor.getModel().findNextMatch(name, match2.range.getStartPosition(), false, true, null, false);
            this.decorations.push({
                range: r2.range,
                options: {
                    inlineClassName: Palette.pickCSS(i, max)
                }
            });
        }
    }
    addTypingDecoration() {
        const re = new RegExp(`#\\s*include\\s*<\\s*(C|c)\\+\\+\\s*>`);
        var match = this.editor.getModel().findNextMatch(re, {
            column: 1,
            lineNumber: 1
        }, true, true, null, false);
        if (match) {
            this.decorations.push({
                range: match.range,
                options: {
                    inlineClassName: 'rainbow-decoration'
                }
            });
        }
    }
    calculateDecorations(names) {
        this.decorations = [];
        const filtered = names.filter(n => n !== 'Noop');
        const max = filtered.length;
        filtered.map((name, i) => this.addDecoration(name, i, max));
        this.addTypingDecoration();
        this.updateDecorations();
        this.dirty = false;
    }
    componentWillReceiveProps(nextProps) {
        if (this.monaco && (this.dirty || this.props.names !== nextProps.names)) {
            this.calculateDecorations(nextProps.names);
        }
    }
    hideConfirm() {
        this.setState({ showConfirm: false });
    }
    confirmWrap() {
        // Wrap and overwrite with the text of the current tab
        this.setState({ wrapped: true }, () => this.handleChange(this.props.code[this.state.index]));
    }
    wrap() {
        if (this.props.code.some((v, i, a) => v !== a[0])) {
            this.setState({ showConfirm: true });
        }
        else {
            this.confirmWrap();
        }
    }
    unwrap() {
        this.setState({ wrapped: false });
    }
    handleSelect(key) {
        if (this.freezeTab && this.props.titles.length > 0)
            return;
        if (key === "Merge") {
            this.wrap();
            return;
        }
        const index = parseInt(key);
        if (index === this.props.titles.length) {
            this.props.onChange(this.props.code.concat(''), this.props.titles.concat(`Code ${index + 1}`));
        }
        this.setState({
            index: index,
            tab: index.toString()
        });
    }
    closeTab(index) {
        const newIndex = this.state.index >= index ? Math.max(0, this.state.index - 1) : this.state.index;
        this.freezeTab = true;

        let texts = this.props.code;
        texts.splice(index, 1);
        let titles = this.props.titles;
        titles.splice(index, 1);

        this.setState({
            index: newIndex,
            tab: newIndex.toString()
        }, () => {
            this.freezeTab = false;
            this.props.onChange(texts, titles);
        });

        this.dirty = true;
    }
    unwrapButton() {
        return <Button onClick={() => this.unwrap()}> <AiOutlineSplitCells /></Button>;
    }
    fillTabs() {
        let tabsList = this.props.titles.map(function (name, i) {
            return <Tab title={
                <>
                    {name}<button className="close-button" onClick={() => closeTab(i)} ><MdClose /></button>
                </>} eventKey={i} key={i}/>
        });

        return (<Tabs onSelect={(key) => this.handleSelect(key)} activeKey={this.state.tab} id="bench-asm-selection">
            {this.props.titles.length > 1 ? <Tab title={<AiOutlineMergeCells />} eventKey="Merge" key="Merge" /> : null}
            {tabsList}
            <Tab title="+" eventKey={this.props.titles.length} key="+" />
        </Tabs>);
    }
    renderHeader() {
        return (
            <Row>
                <Col xs={12}>
                    {this.state.wrapped ? this.unwrapButton() : this.fillTabs()}
                </Col>
            </Row>
        );
    }
    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <div className="full-size">
                <ConfirmOverwrite confirm={() => this.confirmWrap()} show={this.state.showConfirm} hide={() => this.hideConfirm()} />

                {this.renderHeader()}
                <div className="full-size" id="codeContainer">
                    <MonacoEditor
                        language="cpp"
                        options={options}
                        onChange={(newValue) => this.handleChange(newValue)}
                        editorDidMount={(e, m) => this.editorDidMount(e, m)}
                        value={this.props.code[this.state.index]}
                    />
                </div>
            </div>
        );
    }
}

export default CodeEditor;

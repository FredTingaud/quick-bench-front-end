import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import Palette from './Palette.js';
import ConfirmOverwrite from './dialogs/ConfirmOverwrite.js';
import WrappableTabs from './WrappableTabs.js';
import elementResizeEvent from 'element-resize-event';
import unbind from 'element-resize-event';
import ReactResizeDetector from 'react-resize-detector';

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fullScreen: false
            , showConfirm: false
        }
        this.decorations = [];
        this.prevDecorations = [];
        this.dirty = false;
        this.freezeTab = false;
    }
    editorDidMount(editor, monaco) {
        editor.focus();
        this.editor = editor;
        this.monaco = monaco;

        if (this.props.names) {
            this.calculateDecorations(this.props.names);
        }
        //var element = document.getElementById("codeContainer");
        //elementResizeEvent(element, () => this.updateDimensions());
    }
    editorWillUnmount() {
        //var element = document.getElementById("codeContainer");
        //unbind(element);
    }
    updateDimensions() {
        //this.editor.layout();
    }
    handleChange(value) {
        let texts = this.props.code;
        if (this.props.wrapped) {
            texts.fill(value);
        }
        else {
            texts[this.props.index] = value;
        }
        this.dirty = true;
        this.props.onChange(texts);
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
        this.props.changeWrapped(true, () => this.handleChange(this.props.code[this.props.index]));
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
        this.props.changeWrapped(false);
    }
    handle_rezise(width, height) {
        this.editor.layout({ height, width });
    }
    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <div className="full-size">
                <ConfirmOverwrite confirm={() => this.confirmWrap()} show={this.state.showConfirm} hide={() => this.hideConfirm()} />

                <WrappableTabs
                    titles={this.props.titles}
                    index={this.props.index}
                    setIndex={(i) => this.props.setIndex(i)}
                    wrap={() => this.wrap()}
                    unwrap={() => this.unwrap()}
                    wrapped={this.props.wrapped}
                    closeTab={(i) => this.props.closeTab(i)}
                    addTab={() => this.props.addTab()}
                    onTitlesChange={(t) => this.props.onTitlesChange(t)}
                />
                <div className="full-size">
                    <ReactResizeDetector
                        handleWidth
                        handleHeight
                        onResize={(w, h) => this.handle_rezise(w, h)}
                        refreshMode="debounce"
                        refreshRate={100} />
                    <MonacoEditor
                        language="cpp"
                        options={options}
                        onChange={(newValue) => this.handleChange(newValue)}
                        editorDidMount={(e, m) => this.editorDidMount(e, m)}
                        value={this.props.code[this.props.index]}
                    />
                </div>
            </div >
        );
    }
}

export default CodeEditor;

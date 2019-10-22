import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import Palette from './Palette.js';
import elementResizeEvent from 'element-resize-event';
import unbind from 'element-resize-event';

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.decorations = [];
        this.prevDecorations = [];
        this.text = props.code;
        this.dirty = false;
    }
    editorDidMount(editor, monaco) {
        editor.focus();
        this.editor = editor;
        this.monaco = monaco;

        //const model = monaco.editor.createModel(editor.value, "vs/basic-languages/cpp/cpp");

        //monaco.editor.setModelLanguage(monaco.editor.getModels()[0], "vs/basic-languages/cpp/cpp");
        //console.log(`${monaco.editor.getModels()[0].uri} ${Object.keys(monaco.editor)}`);

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
        this.text = value;
        this.dirty = true;
        this.props.onChange(value);
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
    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <div className="full-size" id="codeContainer">
                <MonacoEditor
                    language="cpp"
                    options={options}
                    onChange={(newValue) => this.handleChange(newValue)}
                    editorDidMount={(e, m) => this.editorDidMount(e, m)}
                    value={this.props.code}
                />
            </div>
        );
    }
}

export default CodeEditor;

import React from 'react';
import Editor from './Editor.js';
import Palette from 'components/Palette.js';

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.decorations = [];
        this.prevDecorations = [];
        this.dirty = false;
        this.freezeTab = false;
    }
    componentDidUpdate(prevProps) {
        if (this.monaco && (this.dirty || this.props.names !== prevProps.names)) {
            this.calculateDecorations(this.props.names);
        }
    }
    editorDidMount(editor, monaco) {
        editor.focus();
        this.editor = editor;
        this.monaco = monaco;

        if (this.props.names) {
            this.calculateDecorations(this.props.names);
        }
    }
    handleChange(value) {
        this.dirty = true;
        this.props.onChange(value);
    }
    updateDecorations() {
        this.prevDecorations = this.editor.deltaDecorations(
            this.prevDecorations, this.decorations);
    }
    addDecoration(name, i, max) {
        const re1 = new RegExp(`\\s${name}\\s*\\(\\s*benchmark\\s*::\\s*State\\s*&`);
        const re2 = new RegExp(`(BENCHMARK\\s*\\(\\s*)${name}\\s*\\)\\s*`);
        const model = this.editor.getModel();
        const match1 = model.findNextMatch(re1, {
            column: 1,
            lineNumber: 1
        }, true, true, null, false);
        const match2 = model.findNextMatch(re2, {
            column: 1,
            lineNumber: 1
        }, true, true, null, true);

        if (match1 && match2) {
            this.decorations.push(
                {
                    range: match1.range.plusRange(match2.range),
                    options: {
                        linesDecorationsClassName: Palette.pickCSS(i, max)
                    }
                });
            const r1 = model.findNextMatch(name, match1.range.getStartPosition(), false, true, null, false);
            this.decorations.push({
                range: r1.range,
                options: {
                    inlineClassName: Palette.pickCSS(i, max)
                }
            });
            const r2 = model.findNextMatch(name, model.modifyPosition(match2.range.getStartPosition(), match2.matches[1].length), false, true, null, false);
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
    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <Editor
                language="cpp"
                onChange={(newValue) => this.handleChange(newValue)}
                editorDidMount={(e, m) => this.editorDidMount(e, m)}
                value={this.props.value}
                options={options}
            />
        );
    }
}

export default CodeEditor;

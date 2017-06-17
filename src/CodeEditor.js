import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import Palette from './Palette.js';

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.decorations = [];
        this.prevDecorations = [];
        this.text = props.code;
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
        this.text = value;
        this.props.onChange(value);
    }
    updateDecorations() {
        this.prevDecorations = this.editor.deltaDecorations(
            this.prevDecorations, this.decorations);
    }
    addDecoration(name, i, max) {
        const re1 = new RegExp(`\\s${name}\\s*\\(\\s*benchmark\\s*\\:\\:\\s*State\\s*\\&`);
        const re2 = new RegExp(`BENCHMARK\\s*\\(\\s*${name}\\s*\\)\\s*`);
        const match1 = re1.exec(this.text);
        const match2 = re2.exec(this.text);
        if (match1 && match2) {
            const sub1 = this.text.substr(0, match1.index);
            const sub2 = this.text.substr(0, match2.index);
            const l1 = (sub1.match(/\n/g) || []).length + 1;
            const l2 = (sub2.match(/\n/g) || []).length + 1;
            this.decorations.push(
                {
                    range: new this.monaco.Range(l1, 1, l2, 1),
                    options: {
                        linesDecorationsClassName: Palette.pickCSS(i, max)
                    }
                });
            const c1 = this.text.indexOf(name, match1.index) - sub1.lastIndexOf('\n');
            this.decorations.push({
                range: new this.monaco.Range(l1, c1, l1, c1 + name.length),
                options: {
                    inlineClassName: Palette.pickCSS(i, max)
                }
            });
            const c2 = this.text.indexOf(name, match2.index) - sub2.lastIndexOf('\n');
            this.decorations.push({
                range: new this.monaco.Range(l2, c2, l2, c2 + name.length),
                options: {
                    inlineClassName: Palette.pickCSS(i, max)
                }
            });
        }
    }
    calculateDecorations(names) {
        this.decorations = [];
        const filtered = names.filter(n => n !== 'Noop');
        const max = filtered.length;
        filtered.map((name, i) => this.addDecoration(name, i, max));
        this.updateDecorations();
    }
    componentWillReceiveProps(nextProps) {
        this.text = nextProps.code;
        if (this.monaco && this.props.names !== nextProps.names) {
            this.calculateDecorations(nextProps.names);
        }
    }
    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <MonacoEditor ref="monaco"
                width="100%"
                height="600"
                language="cpp"
                options={options}
                onChange={(newValue) => this.handleChange(newValue)}
                editorDidMount={(e, m) => this.editorDidMount(e, m)}
                value={this.props.code}
            />
        );
    }
}

export default CodeEditor;

import React from 'react';
import MonacoEditor from 'react-monaco-editor';

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
    addDecoration(name, i) {
        const re1 = new RegExp(`\\s${name}\\s*\\(\\s*benchmark\\s*\\:\\:\\s*State\\s*\\&`);
        const re2 = new RegExp(`BENCHMARK\\s*\\(\\s*${name}\\s*\\)\\s*`);
        const match1 = re1.exec(this.text);
        const match2 = re2.exec(this.text);
        if (match1 && match2) {
            const l1 = (this.text.substr(0, match1.index).match(/\n/g) || []).length + 1;
            const l2 = (this.text.substr(0, match2.index).match(/\n/g) || []).length + 1;
            this.decorations.push(
                {
                    range: new this.monaco.Range(l1, 1, l2, 1),
                    options: {
                        isWholeLine: true,
                        inlineClassName: 'linked-code-decoration-inline-' + i
                    }
                });
        }
    }
    calculateDecorations(names) {
        this.prevDecorations = this.decorations;
        this.decorations = [];
        names.map((name, i) => this.addDecoration(name, i));
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

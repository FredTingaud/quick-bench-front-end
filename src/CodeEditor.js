import React from 'react';
import MonacoEditor from 'react-monaco-editor';

class CodeEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { text: "" };
    }

    editorDidMount(editor, monaco) {
        editor.focus();
    }

    render() {
        const options = {
            selectOnLineNumbers: true
        };
        return (
            <MonacoEditor
                width="800"
                height="600"
                language="cpp"
                options={options}
                onChange={(newValue) => this.props.onChange(newValue)}
                editorDidMount={this.editorDidMount}
                value={this.props.code}
            />
        );
    }
}

export default CodeEditor;

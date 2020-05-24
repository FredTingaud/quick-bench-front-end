import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import ReactResizeDetector from 'react-resize-detector';

class Editor extends React.Component {
    editorDidMount(editor, monaco) {
        this.editor = editor;
        editor.layout(300, 140);
    }

    render() {
        const options = {
            selectOnLineNumbers: true,
            readOnly: true
        };
        return (
            <div className="fixed-block">
                <ReactResizeDetector
                    handleWidth
                    handleHeight
                    onResize={(w, h) => this.editor.layout({ width: w, height: h })}
                    refreshMode="debounce"
                    refreshRate={100} />
                <MonacoEditor
                    language={this.props.language}
                    options={options}
                    value={this.props.content}
                    editorDidMount={(e, m) => this.editorDidMount(e, m)} />
            </div>
        );
    }
}

export default Editor;

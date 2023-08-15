import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import ReactResizeDetector from 'react-resize-detector';

class Editor extends React.Component {
    constructor(props) {
        super(props);
        this.resizeRef = React.createRef();
    }

    editorDidMount(editor, monaco, callback) {
        this.editor = editor;
        if (callback)
            callback(editor, monaco);
    }

    render() {
        const { editorDidMount, options, ...other } = this.props;
        return (
            <div className="flex-container" ref={this.resizeRef}>
                <ReactResizeDetector
                    handleWidth
                    handleHeight
                    onResize={(w, h) => this.editor.layout({ width: w, height: h })}
                    refreshMode="debounce"
                    refreshRate={100}
                    targetRef={this.resizeRef}
                />
                <MonacoEditor
                    {...other}
                    options={options}
                    editorDidMount={(e, m) => this.editorDidMount(e, m, editorDidMount)} />
            </div>
        );
    }
}

export default Editor;

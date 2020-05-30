import React from 'react';
import Editor from 'components/Editor.js';

class DisplayEditor extends React.Component {
    render() {
        const options = {
            selectOnLineNumbers: true,
            readOnly: true,
            tabSize: 2,
            showFoldingControls: "always",
            foldingStrategy: "indentation",
            minimap: {
                enabled: false
            }
        };
        return (
            <Editor {...this.props}
                options={options}
                language="none"
            />
        );
    }
}

export default DisplayEditor;
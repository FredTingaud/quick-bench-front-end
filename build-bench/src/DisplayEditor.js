import React from 'react';
import Editor from './Editor.js';

class DisplayEditor extends React.Component {

    render() {
        const options = {
            selectOnLineNumbers: true,
            readOnly: true
        };
        return (
            <Editor {...this.props}
                options={options}
            />
        );
    }
}

export default DisplayEditor;
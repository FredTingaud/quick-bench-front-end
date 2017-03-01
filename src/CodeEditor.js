import React from 'react';
import { FormControl } from 'react-bootstrap';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: "" };
    }
    render() {
        return (
            <FormControl componentClass="textarea" className="code-editor"
                onChange={(event) => this.props.onChange(event.target.value)}
                value={this.props.code} />
        );
    }
}

export default CodeEditor;

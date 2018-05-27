import React from 'react';
var AU = require('ansi_up');
var ansi_up = new AU.default;

class BashOutput extends React.Component {
    updateHTML(text) {
        return { __html: ansi_up.ansi_to_html(text) };
    }

    render() {
        if (this.props.text) {
            return (
                <pre>
                    <div className="bash-output" dangerouslySetInnerHTML={this.updateHTML(this.props.text)} />
                </pre>
            );
        } else {
            return (<div/>);
        }
    }
}

export default BashOutput;

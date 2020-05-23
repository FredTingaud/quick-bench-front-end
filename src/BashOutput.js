import React from 'react';
var AU = require('ansi_up');
var ansi_up = new AU.default();

class BashOutput extends React.Component {
    updateHTML(text) {
        if (text && typeof (text) === 'string')
            return { __html: ansi_up.ansi_to_html(text.replace(/<br>/g, '\n')) };
        return null;
    }

    render() {
        return (<pre>
            <div className="bash-output" dangerouslySetInnerHTML={this.updateHTML(this.props.content)} />
        </pre>);
    }
}

export default BashOutput;

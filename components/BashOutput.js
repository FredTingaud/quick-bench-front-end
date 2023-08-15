import React from 'react';
import {AnsiUp} from 'ansi_up';
const ansi_up = new AnsiUp();

class BashOutput extends React.Component {
    updateHTML(text) {
        if (text && typeof (text) === 'string')
            return { __html: ansi_up.ansi_to_html(text.replace(/<br>/g, '\n')) };
        return null;
    }

    render() {
        return (<pre>
            <div className="bash-output" dangerouslySetInnerHTML={this.updateHTML(this.props.value)} />
        </pre>);
    }
}

export default BashOutput;

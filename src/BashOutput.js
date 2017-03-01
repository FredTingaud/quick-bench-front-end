import React from 'react';
import AU from 'ansi_up';


class BashOutput extends React.Component {
    updateHTML(text) {
        return { __html: AU.ansi_to_html(text) };
    }

    render() {
        return (
            <pre>
                <div className="bash-output" dangerouslySetInnerHTML={this.updateHTML(this.props.text)} />
            </pre>
        );
    }
}

export default BashOutput;

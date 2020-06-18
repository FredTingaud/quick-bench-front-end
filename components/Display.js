import React from 'react';

class Display extends React.Component {
    render() {
        if (this.props.when) {
            return <>{this.props.children}</>;
        } else {
            return null;
        }
    }
}

export default Display;

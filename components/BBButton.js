import React from 'react';

import InteropHelper from 'components/InteropHelper';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import svg from 'components/resources/ico/bb.svg';

class BBButton extends React.Component {
    openCodeInBB(text, options) {
        let clientstate = { text: text };
        Object.assign(clientstate, options);
        console.log(JSON.stringify(clientstate));
        var link = window.location.protocol + '//build-bench.com/#' + InteropHelper.b64UTFEncode(JSON.stringify(clientstate));
        window.open(link, '_blank');
    }

    renderTooltip(props) {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Open in Build Bench
    </Tooltip>
        );
    }
    render() {
        return (
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 250, hide: 400 }}
                overlay={(p) => this.renderTooltip(p)}
            >
                <Button variant="outline-dark" onClick={() => this.openCodeInBB(this.props.text, this.props.options)} className="mr-2">
                    <img src={svg} className="line-img" alt="Open in Build Bench" />
                </Button>
            </OverlayTrigger>
        );
    }
}

export default BBButton;

import React from 'react';

import InteropHelper from 'components/InteropHelper';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import svg from 'components/resources/ico/qb.svg';

class QuickBenchButton extends React.Component {
    openCodeInQB(text, options) {
        let clientstate = { text: text };
        Object.assign(clientstate, options);
        console.log(JSON.stringify(clientstate));
        var link = window.location.protocol + '//quick-bench.com/#' + InteropHelper.b64UTFEncode(JSON.stringify(clientstate));
        window.open(link, '_blank');
    }

    renderTooltip(props) {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Open in Quick Bench
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
                <Button variant="outline-dark" onClick={() => this.openCodeInQB(this.props.text, this.props.options)} className="me-2">
                    <img src={svg} className="line-img" alt="Open in Quick Bench" />
                </Button>
            </OverlayTrigger>
        );
    }
}

export default QuickBenchButton;

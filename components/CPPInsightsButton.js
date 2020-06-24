import React from 'react';

import InteropHelper from 'components/InteropHelper';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import svg from 'components/resources/ico/cppinsights.svg';

class CPPInsightsButton extends React.Component {
    versionCPPI(opt) {
        switch (opt.cppVersion) {
            case '20':
                return 'cpp2a';
            default:
                return 'cpp' + opt.cppVersion;
        }
    }

    libCPPI(opt) {
        if (opt.lib === 'llvm') {
            return '&insightsOptions=use-libcpp';
        }
        return '';
    }

    openCodeInCPPInsights(text, options) {
        var link = window.location.protocol + '//cppinsights.io/lnk?code=' + InteropHelper.b64UTFEncode(text) + this.libCPPI(options) + '&std=' + this.versionCPPI(options) + '&rev=1.0';
        window.open(link, '_blank');
    }

    renderTooltip(props) {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Open in CPP Insights
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
                <Button variant="outline-dark" onClick={() => this.openCodeInCPPInsights(this.props.text, this.props.options)} className="mr-2">
                    <img src={svg} className="line-img" alt="Open in CPP Insights" />
                </Button>
            </OverlayTrigger>
        );
    }
}

export default CPPInsightsButton;

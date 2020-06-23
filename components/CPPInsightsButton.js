import React from 'react';

import InteropHelper from 'components/InteropHelper';
import { Button } from 'react-bootstrap';
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

    render() {
        return <Button variant="outline-dark" onClick={() => this.openCodeInCPPInsights(this.props.text, this.props.options)} className="mr-2">
            <img src={svg} style={{ height: "1.3em" }} alt="Open in CPP Insights" />
        </Button>;
    }
}

export default CPPInsightsButton;

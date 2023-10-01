import React from 'react';

import InteropHelper from 'components/InteropHelper';
import { Button, Tooltip, OverlayTrigger } from 'react-bootstrap';
import CompilerExplorerIcon from 'components/icons/CompilerExplorerIcon';

class CEButton extends React.Component {
    compilerCeId(opt) {
        if (opt.compiler.startsWith('clang'))
            return 'clang' + opt.compiler.substr(6).replace('.', '') + '0';
        return 'g' + opt.compiler.substr(4).replace('.', '');
    }

    optimCe(opt) {
        switch (opt.optim) {
            case 'G':
                return '-Og';
            case 'F':
                return '-Ofast';
            case 'S':
                return '-Os';
            default:
                return '-O' + opt.optim;
        }
    }

    versionCe(opt) {
        switch (opt.cppVersion) {
            case '20':
                return '2a';
            case '17':
                return '1z';
            default:
                return opt.cppVersion.startsWith('c++') ? opt.cppVersion.substr(3) : opt.cppVersion;
        }
    }

    optionsCe(opt) {
        const cppVersion = '-std=c++' + this.versionCe(opt);
        return cppVersion + ' ' + this.optimCe(opt);
    }

    openCodeInCE(texts, options) {
        let sessions = [].concat(texts).map((t, i) => ({
            "id": i,
            "language": "c++",
            "source": t,
            "compilers": [{
                "id": this.compilerCeId([].concat(options)[i]),
                "options": this.optionsCe([].concat(options)[i]),
                "libs": [{
                    "name": "benchmark",
                    "ver": "140"
                }]
            }]
        }));
        var clientstate = {
            "sessions": sessions
        };
        var link = window.location.protocol + '//godbolt.org/clientstate/' + InteropHelper.b64UTFEncode(JSON.stringify(clientstate));
        window.open(link, '_blank');
    }

    renderTooltip(props) {
        return (
            <Tooltip id="button-tooltip" {...props}>
                Open in Compiler Explorer
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
                <Button variant="outline-dark" onClick={() => this.openCodeInCE(this.props.texts, this.props.options)} className="me-2">
                    <CompilerExplorerIcon className="line-img" alt="Open in Compiler Explorer" />
                </Button>
            </OverlayTrigger>);
    }
}

export default CEButton;

import React from 'react';

import InteropHelper from 'components/InteropHelper';
import { Button } from 'react-bootstrap';
import svg from 'components/resources/ico/Compiler-Explorer.svg';

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
                return opt.cppVersion;
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

    render() {
        return <Button variant="outline-dark" onClick={() => this.openCodeInCE(this.props.texts, this.props.options)} className="mr-2">
            <img src={svg} style={{ height: "1.2em" }} alt="Open in Compiler Explorer" />
        </Button>;
    }
}

export default CEButton;

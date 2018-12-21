import React from 'react';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';

const o0Name = 'None';
const o1Name = 'O1';
const o2Name = 'O2';
const o3Name = 'O3';
const v11Name = 'c++11';
const v14Name = 'c++14';
const v17Name = 'c++17';
const v20Name = 'c++20';
const cc38Name = 'clang-3.8';
const cc39Name = 'clang-3.9';
const cc40Name = 'clang-4.0';
const cc50Name = 'clang-5.0';
const cc60Name = 'clang-6.0';
const cc70Name = 'clang-7.0';
const cg55Name = 'gcc-5.5';
const cg64Name = 'gcc-6.4';
const cg65Name = 'gcc-6.5';
const cg72Name = 'gcc-7.2';
const cg73Name = 'gcc-7.3';
const cg74Name = 'gcc-7.4';
const cg81Name = 'gcc-8.1';
const cg82Name = 'gcc-8.2';
const lGName = 'libstdc++(GNU)';
const lCName = 'libc++(LLVM)';

class CompileConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxVersion: 20
        };
    }
    componentDidMount() {
        this.changeCompiler(this.props.compiler);
        this.changeVersion(this.props.cppVersion);
        this.changeOptim(this.props.optim);
        this.changeLib(this.props.lib);
    }
    compilerTitle(key) {
        let compiler = cc38Name;
        if (key === 'clang-3.9') {
            compiler = cc39Name;
        } else if (key === 'clang-4.0') {
            compiler = cc40Name;
        } else if (key === 'clang-5.0') {
            compiler = cc50Name;
        } else if (key === 'clang-6.0') {
            compiler = cc60Name;
        } else if (key === 'clang-7.0') {
            compiler = cc70Name;
        } else if (key === 'gcc-5.5') {
            compiler = cg55Name;
        } else if (key === 'gcc-6.4') {
            compiler = cg64Name;
        } else if (key === 'gcc-6.5') {
            compiler = cg65Name;
        } else if (key === 'gcc-7.2') {
            compiler = cg72Name;
        } else if (key === 'gcc-7.3') {
            compiler = cg73Name;
        } else if (key === 'gcc-7.4') {
            compiler = cg74Name;
        } else if (key === 'gcc-8.1') {
            compiler = cg81Name;
        } else if (key === 'gcc-8.2') {
            compiler = cg82Name;
        }
        if (key.startsWith('gcc') && this.props.lib !== 'gnu') {
            this.changeLib('gnu');
        }
        return 'compiler = ' + compiler
    }
    versionTitle(key) {
        let vName = v11Name;
        if (key === '14') {
            vName = v14Name;
        } else if (key === '17') {
            vName = v17Name;
        } else if (key === '20') {
            vName = v20Name;
        }
        return 'std = ' + vName;
    }
    optimTitle(key) {
        let oName = o0Name;
        if (key === '1') {
            oName = o1Name;
        } else if (key === '2') {
            oName = o2Name;
        } else if (key === '3') {
            oName = o3Name;
        }
        return 'optim = ' + oName;
    }
    libTitle(key) {
        let lName = lGName;
        if (key === 'llvm') {
            lName = lCName;
        }
        return 'STL = ' + lName;
    }
    refreshMaxCppVersion(key) {
        let maxV;
        if (key.startsWith("clang-")) {
            maxV = (parseInt(key.charAt("clang-".length)) >= 6) ? 20 : 17;
        } else if (key.startsWith("gcc-")) {
            maxV = (parseInt(key.charAt("gcc-".length)) >= 8) ? 20 : 17;
        }
        this.setState({ maxVersion: maxV });
        if (this.props.cppVersion === "20" && maxV < 20) {
            this.changeVersion("17");
        }
    }
    changeCompiler(key) {
        this.refreshMaxCppVersion(key);
        this.props.onCompilerChange(key);
    }
    changeVersion(key) {
        this.props.onVersionChange(key);
    }
    changeOptim(key) {
        this.props.onOptimChange(key);
    }
    changeLib(key) {
        this.props.onLibChange(key);
    }
    render() {
        const compiler = this.props.compiler;
        const cppVersion = this.props.cppVersion;
        const optim = this.props.optim;
        const lib = this.props.lib;
        const maxVersion = this.state.maxVersion;
        return (
            <ButtonToolbar>
                <DropdownButton id="compiler" bsStyle="default" title={this.compilerTitle(compiler)} onSelect={key => this.changeCompiler(key)}>
                    <MenuItem eventKey="clang-3.8">{cc38Name}</MenuItem>
                    <MenuItem eventKey="clang-3.9">{cc39Name}</MenuItem>
                    <MenuItem eventKey="clang-4.0">{cc40Name}</MenuItem>
                    <MenuItem eventKey="clang-5.0">{cc50Name}</MenuItem>
                    <MenuItem eventKey="clang-6.0">{cc60Name}</MenuItem>
                    <MenuItem eventKey="clang-7.0">{cc70Name}</MenuItem>
                    <MenuItem eventKey="gcc-5.5" >{cg55Name}</MenuItem>
                    <MenuItem eventKey="gcc-6.4" >{cg64Name}</MenuItem>
                    <MenuItem eventKey="gcc-6.5" >{cg65Name}</MenuItem>
                    <MenuItem eventKey="gcc-7.2" >{cg72Name}</MenuItem>
                    <MenuItem eventKey="gcc-7.3" >{cg73Name}</MenuItem>
                    <MenuItem eventKey="gcc-7.4" >{cg74Name}</MenuItem>
                    <MenuItem eventKey="gcc-8.1" >{cg81Name}</MenuItem>
                    <MenuItem eventKey="gcc-8.2" >{cg82Name}</MenuItem>
                </DropdownButton>
                <DropdownButton id="language" bsStyle="default" title={this.versionTitle(cppVersion)} onSelect={key => this.changeVersion(key)}>
                    <MenuItem eventKey="11">{v11Name}</MenuItem>
                    <MenuItem eventKey="14">{v14Name}</MenuItem>
                    <MenuItem eventKey="17">{v17Name}</MenuItem>
                    <MenuItem eventKey="20" disabled={maxVersion < 20}>{v20Name}</MenuItem>
                </DropdownButton>
                <DropdownButton id="optim" bsStyle="default" title={this.optimTitle(optim)} onSelect={key => this.changeOptim(key)}>
                    <MenuItem eventKey="0">{o0Name}</MenuItem>
                    <MenuItem eventKey="1">{o1Name}</MenuItem>
                    <MenuItem eventKey="2">{o2Name}</MenuItem>
                    <MenuItem eventKey="3">{o3Name}</MenuItem>
                </DropdownButton>
                <DropdownButton id="libc" bsStyle="default" title={this.libTitle(lib)} onSelect={key => this.changeLib(key)} disabled={compiler.startsWith('gcc')} >
                    <MenuItem eventKey="gnu">{lGName}</MenuItem>
                    <MenuItem eventKey="llvm">{lCName}</MenuItem>
                </DropdownButton>
            </ButtonToolbar>
        );
    }
}

export default CompileConfig;

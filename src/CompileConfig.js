import React from 'react';
import { DropdownButton, ButtonToolbar, DropdownItem, Card } from 'react-bootstrap';
import WrappableTabs from './WrappableTabs.js'

const o0Name = 'None';
const oGName = 'Og';
const o1Name = 'O1';
const o2Name = 'O2';
const oSName = 'Os';
const o3Name = 'O3';
const oFName = 'OFast';
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
const cc71Name = 'clang-7.1';
const cc80Name = 'clang-8.0';
const cc90Name = 'clang-9.0';
const cg55Name = 'gcc-5.5';
const cg64Name = 'gcc-6.4';
const cg65Name = 'gcc-6.5';
const cg72Name = 'gcc-7.2';
const cg73Name = 'gcc-7.3';
const cg74Name = 'gcc-7.4';
const cg75Name = 'gcc-7.5';
const cg81Name = 'gcc-8.1';
const cg82Name = 'gcc-8.2';
const cg83Name = 'gcc-8.3';
const cg91Name = 'gcc-9.1';
const cg92Name = 'gcc-9.2';
const lGName = 'libstdc++(GNU)';
const lCName = 'libc++(LLVM)';

class CompileConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxVersion: 20
        };
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
        } else if (key === 'clang-7.1') {
            compiler = cc71Name;
        } else if (key === 'clang-8.0') {
            compiler = cc80Name;
        } else if (key === 'clang-9.0') {
            compiler = cc90Name;
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
        } else if (key === 'gcc-7.5') {
            compiler = cg75Name;
        } else if (key === 'gcc-8.1') {
            compiler = cg81Name;
        } else if (key === 'gcc-8.2') {
            compiler = cg82Name;
        } else if (key === 'gcc-8.3') {
            compiler = cg83Name;
        } else if (key === 'gcc-9.1') {
            compiler = cg91Name;
        } else if (key === 'gcc-9.2') {
            compiler = cg92Name;
        }
        if (key.startsWith('gcc') && this.props.options[this.props.index].lib !== 'gnu') {
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
        } else if (key === 'G') {
            oName = oGName;
        } else if (key === 'S') {
            oName = oSName;
        } else if (key === 'F') {
            oName = oFName;
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
    refreshMaxCppVersion(key, opts) {
        let maxV;
        if (key.startsWith("clang-")) {
            maxV = (parseInt(key.charAt("clang-".length)) >= 6) ? 20 : 17;
        } else if (key.startsWith("gcc-")) {
            maxV = (parseInt(key.charAt("gcc-".length)) >= 8) ? 20 : 17;
        }
        this.setState({ maxVersion: maxV });
        if (opts.cppVersion === "20" && maxV < 20) {
            opts.cppVersion = "17";
        }
    }
    changeCompiler(key) {
        let opts = this.props.options;
        this.refreshMaxCppVersion(key, opts);
        if (this.props.wrapped) {
            opts.map(o => o.compiler = key);
        } else {
            opts[this.props.index].compiler = key;
        }
        this.props.onOptionsChange(opts);
    }
    changeVersion(key) {
        let opts = this.props.options;

        if (this.props.wrapped)
            opts.map(o => o.cppVersion = key);
        else
            opts[this.props.index].cppVersion = key;
        this.props.onOptionsChange(opts);
    }
    changeOptim(key) {
        let opts = this.props.options;
        if (this.props.wrapped)
            opts.map(o => o.optim = key);
        else
            opts[this.props.index].optim = key;
        this.props.onOptionsChange(opts);
    }
    changeLib(key) {
        let opts = this.props.options;
        if (this.props.wrapped)
            opts.map(o => o.lib = key);
        else
            opts[this.props.index].lib = key;
        this.props.onOptionsChange(opts);
    }
    currentOptions() {
        return {
            compiler: this.props.options[this.props.index].compiler
            , cppVersion: this.props.options[this.props.index].cppVersion
            , optim: this.props.options[this.props.index].optim
            , lib: this.props.options[this.props.index].lib
        };
    }
    wrap() {
        let opts = this.props.options;
        opts.fill(this.currentOptions());
        this.props.changeWrapped(true, () => this.props.onOptionsChange(opts));
    }
    unwrap() {
        this.props.changeWrapped(false);
    }
    render() {
        const compiler = this.props.options[this.props.index].compiler;
        const cppVersion = this.props.options[this.props.index].cppVersion;
        const optim = this.props.options[this.props.index].optim;
        const lib = this.props.options[this.props.index].lib;
        const maxVersion = this.state.maxVersion;
        return (
            <Card>
                <Card.Header>
                    <WrappableTabs
                        titles={this.props.titles}
                        index={this.props.index}
                        setIndex={(i) => this.props.setIndex(i)}
                        wrap={() => this.wrap()}
                        unwrap={() => this.unwrap()}
                        wrapped={this.props.wrapped}
                        closeTab={(i) => this.props.closeTab(i)}
                        addTab={() => this.props.addTab()}
                        onTitlesChange={(t) => this.props.onTitlesChange(t)}
                    />
                </Card.Header>
                <Card.Body>
                    <ButtonToolbar>
                        <DropdownButton id="compiler" variant="outline-dark" title={this.compilerTitle(compiler)} onSelect={key => this.changeCompiler(key)} className="mr-2">
                            <DropdownItem eventKey="clang-3.8">{cc38Name}</DropdownItem>
                            <DropdownItem eventKey="clang-3.9">{cc39Name}</DropdownItem>
                            <DropdownItem eventKey="clang-4.0">{cc40Name}</DropdownItem>
                            <DropdownItem eventKey="clang-5.0">{cc50Name}</DropdownItem>
                            <DropdownItem eventKey="clang-6.0">{cc60Name}</DropdownItem>
                            <DropdownItem eventKey="clang-7.0">{cc70Name}</DropdownItem>
                            <DropdownItem eventKey="clang-7.1">{cc71Name}</DropdownItem>
                            <DropdownItem eventKey="clang-8.0">{cc80Name}</DropdownItem>
                            <DropdownItem eventKey="clang-9.0">{cc90Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-5.5" >{cg55Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-6.4" >{cg64Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-6.5" >{cg65Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-7.2" >{cg72Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-7.3" >{cg73Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-7.4" >{cg74Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-7.5" >{cg75Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-8.1" >{cg81Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-8.2" >{cg82Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-8.3" >{cg83Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-9.1" >{cg91Name}</DropdownItem>
                            <DropdownItem eventKey="gcc-9.2" >{cg92Name}</DropdownItem>
                        </DropdownButton>
                        <DropdownButton id="language" variant="outline-dark" title={this.versionTitle(cppVersion)} onSelect={key => this.changeVersion(key)} className="mr-2">
                            <DropdownItem eventKey="11">{v11Name}</DropdownItem>
                            <DropdownItem eventKey="14">{v14Name}</DropdownItem>
                            <DropdownItem eventKey="17">{v17Name}</DropdownItem>
                            <DropdownItem eventKey="20" disabled={maxVersion < 20}>{v20Name}</DropdownItem>
                        </DropdownButton>
                        <DropdownButton id="optim" variant="outline-dark" title={this.optimTitle(optim)} onSelect={key => this.changeOptim(key)} className="mr-2">
                            <DropdownItem eventKey="0">{o0Name}</DropdownItem>
                            <DropdownItem eventKey="G">{oGName}</DropdownItem>
                            <DropdownItem eventKey="1">{o1Name}</DropdownItem>
                            <DropdownItem eventKey="2">{o2Name}</DropdownItem>
                            <DropdownItem eventKey="S">{oSName}</DropdownItem>
                            <DropdownItem eventKey="3">{o3Name}</DropdownItem>
                            <DropdownItem eventKey="F">{oFName}</DropdownItem>
                        </DropdownButton>
                        <DropdownButton id="libc" variant="outline-dark" title={this.libTitle(lib)} onSelect={key => this.changeLib(key)} disabled={compiler.startsWith('gcc')} >
                            <DropdownItem eventKey="gnu">{lGName}</DropdownItem>
                            <DropdownItem eventKey="llvm">{lCName}</DropdownItem>
                        </DropdownButton>
                    </ButtonToolbar>
                </Card.Body>
            </Card>
        );
    }
}

export default CompileConfig;

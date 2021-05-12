import React from 'react';
import { Dropdown, ButtonToolbar, DropdownButton, Button } from 'react-bootstrap';
import { BsCloudDownload } from "react-icons/bs";

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
const lGName = 'libstdc++(GNU)';
const lCName = 'libc++(LLVM)';


function commonPrefixLength(s1, s2) {
    const L = s2.length;
    let i = 0;
    while (i < L && s1.charAt(i) === s2.charAt(i)) i++;
    return i;
}

class CompileConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maxVersion: 20
        };
    }
    componentDidUpdate(prevProps) {
        if (prevProps.compilers !== this.props.compilers) {
            this.changeCompiler(this.props.value.compiler);
        } else if (prevProps.value.compiler !== this.props.value.compiler) {
            let fixed = this.checkedCompiler(this.props.value.compiler);
            if (fixed !== this.props.value.compiler) {
                this.changeCompiler(fixed);
            }
        }
    }
    compilerName(name) {
        if (name.startsWith('gcc-')) {
            return "GCC " + name.substring(4);
        } else if (name.startsWith('clang-')) {
            return "Clang " + name.substring(6);
        } else {
            return name;
        }
    }
    compilerTitle(key) {
        if (key.startsWith('gcc-') && this.props.value.lib !== 'gnu') {
            this.changeLib('gnu');
        }
        return 'compiler = ' + this.compilerName(key);
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
            maxV = parseInt(key.substring("clang-".length)) >= 6 ? 20 : 17;
        } else if (key.startsWith("gcc-")) {
            maxV = parseInt(key.substring("gcc-".length)) >= 8 ? 20 : 17;
        }
        this.setState({ maxVersion: maxV });
        if (opts.cppVersion === "20" && maxV < 20) {
            opts.cppVersion = "17";
        }
    }
    checkedCompiler(comp) {
        if (!comp)
            return this.state.compiler;
        if (!this.props.compilers || this.props.compilers.length==0)
            return comp;
        if (this.props.compilers.indexOf(comp) > -1)
            return comp;
        // If we receive an unknown compiler version
        // We search the one that has the longest common prefix
        return this.props.compilers[this.props.compilers.reduce((best, x, i, arr) => commonPrefixLength(x, comp) >= commonPrefixLength(arr[best], comp) ? i : best, 0)];
    }
    changeCompiler(key) {
        if (key === "dl") {
            this.props.pullCompiler();
            return;
        }
        let opts = this.props.value;
        let comp = this.checkedCompiler(key);
        this.refreshMaxCppVersion(comp, opts);
        opts.compiler = comp;
        this.props.onChange(opts);
    }
    changeVersion(key) {
        let opts = this.props.value;
        opts.cppVersion = key;
        this.props.onChange(opts);
    }
    changeOptim(key) {
        let opts = this.props.value;
        opts.optim = key;
        this.props.onChange(opts);
    }
    changeLib(key) {
        let opts = this.props.value;
        opts.lib = key;
        this.props.onChange(opts);
    }
    render() {
        const compiler = this.props.value.compiler;
        const cppVersion = this.props.value.cppVersion;
        const optim = this.props.value.optim;
        const lib = this.props.value.lib;
        const maxVersion = this.state.maxVersion;
        return (
            <ButtonToolbar>
                {this.props.compilers && this.props.compilers.length > 0 ?
                    <DropdownButton id="compiler" variant="outline-dark" title={this.compilerTitle(compiler)} onSelect={key => this.changeCompiler(key)} className="mr-2">
                        {this.props.compilers.map((name) => <Dropdown.Item key={name} eventKey={name}>{this.compilerName(name)}</Dropdown.Item>)}
                        {this.props.pullCompiler ? <Dropdown.Item key="dl" eventKey="dl"><BsCloudDownload /> Pull other compiler</Dropdown.Item> : null}
                    </DropdownButton>
                    :
                    <Button onClick={() => this.props.pullCompiler()}><BsCloudDownload /> Pull compilers</Button>
                }
                <DropdownButton id="language" variant="outline-dark" title={this.versionTitle(cppVersion)} onSelect={key => this.changeVersion(key)} className="mr-2">
                    <Dropdown.Item eventKey="11">{v11Name}</Dropdown.Item>
                    <Dropdown.Item eventKey="14">{v14Name}</Dropdown.Item>
                    <Dropdown.Item eventKey="17">{v17Name}</Dropdown.Item>
                    <Dropdown.Item eventKey="20" disabled={maxVersion < 20}>{v20Name}</Dropdown.Item>
                </DropdownButton>
                <DropdownButton id="optim" variant="outline-dark" title={this.optimTitle(optim)} onSelect={key => this.changeOptim(key)} className="mr-2">
                    <Dropdown.Item eventKey="0">{o0Name}</Dropdown.Item>
                    <Dropdown.Item eventKey="G">{oGName}</Dropdown.Item>
                    <Dropdown.Item eventKey="1">{o1Name}</Dropdown.Item>
                    <Dropdown.Item eventKey="2">{o2Name}</Dropdown.Item>
                    <Dropdown.Item eventKey="S">{oSName}</Dropdown.Item>
                    <Dropdown.Item eventKey="3">{o3Name}</Dropdown.Item>
                    <Dropdown.Item eventKey="F">{oFName}</Dropdown.Item>
                </DropdownButton>
                <DropdownButton id="libc" variant="outline-dark" title={this.libTitle(lib)} onSelect={key => this.changeLib(key)} disabled={compiler.startsWith('gcc')} >
                    <Dropdown.Item eventKey="gnu">{lGName}</Dropdown.Item>
                    <Dropdown.Item eventKey="llvm">{lCName}</Dropdown.Item>
                </DropdownButton>
            </ButtonToolbar>
        );
    }
}

export default CompileConfig;

import React from 'react';
import { Dropdown, ButtonToolbar, DropdownButton, Button, Form } from 'react-bootstrap';
import { BsCloudDownload } from "react-icons/bs";

const o0Name = 'None';
const oGName = 'Og';
const o1Name = 'O1';
const o2Name = 'O2';
const oSName = 'Os';
const o3Name = 'O3';
const oFName = 'OFast';
const lGName = 'libstdc++(GNU)';
const lCName = 'libc++(LLVM)';
const equivalentVersions = [['1y', '14'], ['1z', '17'],['2a', '20'], ['2b', '23'], ['2c', '26']];


function commonPrefixLength(s1, s2) {
    const L = s2.length;
    let i = 0;
    while (i < L && s1.charAt(i) === s2.charAt(i)) i++;
    return i;
}

class CompileConfig extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidUpdate(prevProps) {
        if (this.props.compilers && this.props.compilers.length > 0) {
            if (prevProps.compilers !== this.props.compilers) {
                this.changeCompiler(this.props.value.compiler);
            } else if (prevProps.value.compiler !== this.props.value.compiler) {
                let fixed = this.checkedCompiler(this.props.value.compiler);
                if (fixed !== this.props.value.compiler) {
                    this.changeCompiler(fixed);
                }
            }
            if (prevProps.value.cppVersion !== this.props.value.cppVersion) {
                this.refreshCppVersion(this.props.value.compiler, this.props.value);
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
    equivalentCppVersion(v1, v2) {
        return equivalentVersions.some(ev => v1.replace(ev[0], ev[1]) === v2) ||
            equivalentVersions.some(ev => v2.replace(ev[0], ev[1]) === v1);
    }
    refreshCppVersion(key, opts) {
        const ind = this.index(key);
        if (ind === -1) {
            return;
        }
        const versions = this.props.compilers[ind].std;
        if (versions.includes(opts.cppVersion)) {
            return;
        }
        const vers = opts.cppVersion.length === 2 ? ('c++' + opts.cppVersion) : opts.cppVersion;
        const vIndex = versions.findIndex(v => this.equivalentCppVersion(v, vers));
        if (vIndex > -1) {
            this.changeVersion(versions[vIndex]);
        } else {
            this.changeVersion(versions[versions.length - 1]);
        }
    }
    checkedCompiler(comp) {
        if (!comp)
            return this.state.compiler;
        if (!this.props.compilers || this.props.compilers.length==0)
            return comp;
        if (this.index(comp) > -1)
            return comp;
        // If we receive an unknown compiler version
        // We search the one that has the longest common prefix
        return this.props.compilers[this.props.compilers.reduce((best, x, i, arr) => commonPrefixLength(x.name, comp) >= commonPrefixLength(arr[best].name, comp) ? i : best, 0)].name;
    }
    index(comp){
        return this.props.compilers.findIndex(c => c.name === comp);
    }
    changeCompiler(key) {
        if (key === "dl") {
            this.props.pullCompiler();
            return;
        }
        let opts = this.props.value;
        let comp = this.checkedCompiler(key);
        this.refreshCppVersion(comp, opts);
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
    changeExpFlag(active, flag) {
        let flags = this.props.value.flags;
        if (active){
            flags.push(flag);
        } else {
            flags = flags.filter(f => f !== flag);
        }
        this.props.value.flags = flags;
        this.props.onChange(this.props.value);
    }
    hasExpFlag(flag) {
        return this.props.value.flags.includes(flag);
    }
    render() {
        const compiler = this.props.value.compiler;
        const cppVersion = this.props.value.cppVersion;
        const optim = this.props.value.optim;
        const lib = this.props.value.lib;
        const index = Math.max(0, this.index(compiler));
        return (
            <ButtonToolbar>
                {this.props.compilers && this.props.compilers.length > 0 ?
                    <>
                        <DropdownButton id="compiler" variant="outline-dark" title={this.compilerTitle(compiler)} onSelect={key => this.changeCompiler(key)} className="me-2">
                            {this.props.compilers.map(c => <Dropdown.Item key={c.name} eventKey={c.name}>{this.compilerName(c.name)}</Dropdown.Item>)}
                            {this.props.pullCompiler ? <Dropdown.Item key="dl" eventKey="dl"><BsCloudDownload /> Pull other compiler</Dropdown.Item> : null}
                        </DropdownButton>
                        <DropdownButton id="language" variant="outline-dark" title={'std = ' + cppVersion} onSelect={key => this.changeVersion(key)} className="me-2">
                            {this.props.compilers[index].std.map(s => <Dropdown.Item key={s} eventKey={s}>{s}</Dropdown.Item>)}
                        </DropdownButton>
                        <DropdownButton id="optim" variant="outline-dark" title={this.optimTitle(optim)} onSelect={key => this.changeOptim(key)} className="me-2">
                            <Dropdown.Item eventKey="0">{o0Name}</Dropdown.Item>
                            <Dropdown.Item eventKey="G">{oGName}</Dropdown.Item>
                            <Dropdown.Item eventKey="1">{o1Name}</Dropdown.Item>
                            <Dropdown.Item eventKey="2">{o2Name}</Dropdown.Item>
                            <Dropdown.Item eventKey="S">{oSName}</Dropdown.Item>
                            <Dropdown.Item eventKey="3">{o3Name}</Dropdown.Item>
                            <Dropdown.Item eventKey="F">{oFName}</Dropdown.Item>
                        </DropdownButton>
                        <DropdownButton id="libc" variant="outline-dark" title={this.libTitle(lib)} onSelect={key => this.changeLib(key)} disabled={compiler.startsWith('gcc')} className="me-2">
                            <Dropdown.Item eventKey="gnu">{lGName}</Dropdown.Item>
                            <Dropdown.Item eventKey="llvm">{lCName}</Dropdown.Item>
                        </DropdownButton>
                        {this.props.compilers[index].experimental && this.props.compilers[index].experimental.length > 0 ?
                            <DropdownButton id="flags" variant="outline-dark" title="Other flags" className="me-2">
                                {this.props.compilers[index].experimental.map(s => <Form.Check type='checkbox' key={s} id={s} label={s} onChange={e => this.changeExpFlag(e.target.checked, s)} checked={this.hasExpFlag(s)} className="mx-3 my-2" style={{"white-space": "nowrap"}} />)}
                            </DropdownButton>
                            : < div />
                        }
                    </>
                    :
                    <Button onClick={() => this.props.pullCompiler()}><BsCloudDownload /> Pull compilers</Button>
                }
            </ButtonToolbar>
        );
    }
}

export default CompileConfig;

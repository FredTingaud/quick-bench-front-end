import React from 'react';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';

class CompileConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            o0Name: "None",
            o1Name: "O1",
            o2Name: "O2",
            o3Name: "O3",
            v0Name: "c++98",
            v11Name: "c++11",
            v14Name: "c++14",
            v17Name: "c++1z"
        };
    }
    componentDidMount() {
        this.changeCompiler(this.props.compiler);
        this.changeVersion(this.props.cppVersion);
        this.changeOptim(this.props.optim);
    }
    compilerTitle(key) {
        let compiler = "clang++-3.8";
        return "compiler = " + compiler
    }
    versionTitle(key) {
        let vName = this.state.v0Name;
        if (key === "11") {
            vName = this.state.v11Name;
        } else if (key === "14") {
            vName = this.state.v14Name;
        } else if (key === "17") {
            vName = this.state.v17Name;
        }
        return "std = " + vName;
    }
    optimTitle(key) {
        let oName = this.state.o0Name;
        if (key === "1") {
            oName = this.state.o1Name;
        } else if (key === "2") {
            oName = this.state.o2Name;
        } else if (key === "3") {
            oName = this.state.o3Name;
        }
        return "optim = " + oName;
    }
    changeCompiler(key) {
        this.props.onCompilerChange(key);
    }
    changeVersion(key) {
        this.props.onVersionChange(key);
    }
    changeOptim(key) {
        this.props.onOptimChange(key);
    }
    render() {
        const compiler = this.props.compiler;
        const cppVersion = this.props.cppVersion;
        const optim = this.props.optim;
        return (
            <ButtonToolbar>
                <DropdownButton id="compiler" bsStyle="default" title={this.compilerTitle(compiler)} onSelect={this.changeCompiler.bind(this)}>
                    <MenuItem eventKey="Clang38" >clang++ - 3.8</MenuItem>
                </DropdownButton>
                <DropdownButton id="language" bsStyle="default" title={this.versionTitle(cppVersion)} onSelect={this.changeVersion.bind(this)}>
                    <MenuItem eventKey="0">{this.state.v0Name}</MenuItem>
                    <MenuItem eventKey="11">{this.state.v11Name}</MenuItem>
                    <MenuItem eventKey="14">{this.state.v14Name}</MenuItem>
                    <MenuItem eventKey="17">{this.state.v17Name}</MenuItem>
                </DropdownButton>
                <DropdownButton id="optim" bsStyle="default" title={this.optimTitle(optim)} onSelect={this.changeOptim.bind(this)}>
                    <MenuItem eventKey="0">{this.state.o0Name}</MenuItem>
                    <MenuItem eventKey="1">{this.state.o1Name}</MenuItem>
                    <MenuItem eventKey="2">{this.state.o2Name}</MenuItem>
                    <MenuItem eventKey="3">{this.state.o3Name}</MenuItem>
                </DropdownButton>
            </ButtonToolbar>
        );
    }
}

export default CompileConfig;

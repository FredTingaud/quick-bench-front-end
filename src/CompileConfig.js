import React from 'react';
import { DropdownButton, ButtonToolbar, MenuItem } from 'react-bootstrap';

class CompileConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            compiler: this.props.compiler,
            cppVersion: this.props.cppVersion,
            optim: this.props.optim,
            compilerTitle: "",
            versionTitle: "",
            optimTitle: "",
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
    changeCompiler(key) {
        let compiler = "clang++-3.8";
        this.setState({ compiler: compiler })
        this.updateCompilerTitle();
        this.props.onCompilerChange(key);
    }
    changeVersion(key) {
        let vName = this.state.v0Name;
        if (key === "11") {
            vName = this.state.v11Name;
        } else if (key === "14") {
            vName = this.state.v14Name;
        } else if (key === "17") {
            vName = this.state.v17Name;
        }
        this.setState({ cppVersion: vName });
        this.updateVersionTitle();
        this.props.onVersionChange(key);
    }
    changeOptim(key) {
        let oName = this.state.o0Name;
        if (key === "1") {
            oName = this.state.o1Name;
        } else if (key === "2") {
            oName = this.state.o2Name;
        } else if (key === "3") {
            oName = this.state.o3Name;
        }
        this.setState({ optim: oName });
        this.updateOptimTitle();
        this.props.onOptimChange(key);
    }
    updateCompilerTitle() {
        this.setState((prevState, props) => ({
            compilerTitle: "compiler = " + prevState.compiler
        }));
    }
    updateVersionTitle() {
        this.setState((prevState, props) => ({
            versionTitle: "std = " + prevState.cppVersion
        }));
    }
    updateOptimTitle() {
        this.setState((prevState, props) => ({
            optimTitle: "optim = " + prevState.optim
        }));
    }
    render() {
        return (
            <ButtonToolbar>
                <DropdownButton id="compiler" bsStyle="default" title={this.state.compilerTitle} onSelect={(key) => this.changeCompiler(key)}>
                    <MenuItem eventKey="Clang38" >clang++ - 3.8</MenuItem>
                </DropdownButton>
                <DropdownButton id="language" bsStyle="default" title={this.state.versionTitle} onSelect={(key) => this.changeVersion(key)}>
                    <MenuItem eventKey="0">{this.state.v0Name}</MenuItem>
                    <MenuItem eventKey="11">{this.state.v11Name}</MenuItem>
                    <MenuItem eventKey="14">{this.state.v14Name}</MenuItem>
                    <MenuItem eventKey="17">{this.state.v17Name}</MenuItem>
                </DropdownButton>
                <DropdownButton id="optim" bsStyle="default" title={this.state.optimTitle} onSelect={(key) => this.changeOptim(key)}>
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

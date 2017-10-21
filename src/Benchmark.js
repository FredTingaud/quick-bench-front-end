import React from 'react';
import CodeEditor from './CodeEditor.js';
import BashOutput from './BashOutput.js';
import CompileConfig from './CompileConfig.js';
import TimeChart from './TimeChart.js';
import AssemblyEditor from './AssemblyEditor.js';
import { Button, Row, Col, Grid, Panel, Glyphicon, Checkbox } from 'react-bootstrap';

var request = require('request');
const protocolVersion = 2;

const startCode = `static void StringCreation(benchmark::State& state) {
  // Code inside this loop is measured repeatedly
  for (auto _ : state) {
    std::string created_string("hello");
    // Make sure the variable is not optimized away by compiler
    benchmark::DoNotOptimize(created_string);
  }
}
// Register the function as a benchmark
BENCHMARK(StringCreation);

static void StringCopy(benchmark::State& state) {
  // Code before the loop is not measured
  std::string x = "hello";
  for (auto _ : state) {
    std::string copy(x);
  }
}
BENCHMARK(StringCopy);
`
class Benchmark extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: startCode
            , graph: []
            , message: ''
            , sending: false
            , compiler: "clang++-3.8"
            , cppVersion: "17"
            , optim: "3"
            , clean: false
            , force: false
            , benchNames: []
            , location: props.id
            , annotation: ''
            , isAnnotated: true
        };
        this.graph = [];
        this.url = this.props.url;
        this.maxCodeSize = this.props.maxCodeSize;
    }
    componentDidMount() {
        if (this.props.id) {
            this.getCode(this.props.id);
        }
        this.props.onDisplay();
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.id !== nextProps.id && this.state.location !== nextProps.id) {
            this.getCode(nextProps.id);
        }
    }
    getCode(id) {
        this.setState({
            sending: true,
            graph: [],
            annotation: '',
            message: ''
        });
        request.get(this.url + '/get/' + id, (err, res, body) => {
            this.setState({
                sending: false,
                clean: true,
                force: false
            });
            if (body) {
                let result = JSON.parse(body);
                if (result) {
                    if (result.result) {
                        this.setState({
                            text: result.code
                            , graph: result.result.benchmarks
                            , compiler: result.compiler
                            , cppVersion: result.cppVersion
                            , optim: result.optim
                            , location: id
                        });
                    }
                    if (result.message) {
                        this.setState({
                            message: result.message
                        });
                    }
                    if (result.annotation) {
                        this.setState({
                            annotation: result.annotation
                            , isAnnotated: true
                        });
                    } else {
                        this.setState({ isAnnotated: false });
                    }
                }
            }
        });
    }
    sendCode() {
        if (this.state.text.length > this.maxCodeSize) {
            this.setState({
                graph: [],
                annotation: '',
                message: `Your code is ${this.state.text.length} characters long, while the maximum code size is ${this.maxCodeSize}.
If you think this limitation is stopping you in a legitimate usage of quick-bench, please contact me.`
            });
        } else {
            this.setState({
                sending: true,
                graph: [],
                annotation: '',
                message: ''
            });
            var obj = {
                "code": this.state.text,
                "compiler": this.state.compiler,
                "optim": this.state.optim,
                "cppVersion": this.state.cppVersion,
                "protocolVersion": protocolVersion,
                "force": this.state.clean && this.state.force,
                "isAnnotated": this.state.isAnnotated
            };
            request({
                url: this.url
                , method: "POST"
                , json: true
                , headers: {
                    "content-type": "application/json"
                }
                , body: obj
            }, (err, res, body) => {
                this.setState({
                    sending: false,
                    clean: true,
                    force: false
                });
                if (body.result) {
                    this.setState({
                        graph: body.result.benchmarks,
                        location: body.id
                    });
                    this.props.onLocationChange(body.id);
                }
                if (body.annotation) {
                    this.setState({ annotation: body.annotation });
                }
                if (body.message) {
                    this.setState({ message: body.message });
                }
            });
        }
    }
    setDirty() {
        this.setState({
            clean: false,
            force: false
        });
    }
    textChanged(text) {
        this.setState({ text: text });
        this.setDirty();
    }
    forceChanged(e) {
        this.setState({
            force: e.target.checked
        })
    }
    onCompilerChange(compiler) {
        this.setState({ compiler: compiler });
        this.setDirty();
    }
    onVersionChanged(version) {
        this.setState({ cppVersion: version });
        this.setDirty();
    }
    onOptimChange(optim) {
        this.setState({ optim: optim });
        this.setDirty();
    }
    toggleAnnotated(e) {
        this.setState({ isAnnotated: e.target.checked });
    }
    render() {
        return (
            <Grid fluid={true}>
                <Row className="full-size">
                    <Col sm={6} className="full-size">
                        <div className="code-editor">
                            <CodeEditor onChange={this.textChanged.bind(this)}
                                code={this.state.text}
                                names={this.state.benchNames} />
                        </div>
                    </Col>
                    <Col sm={6} className="right-block">
                        <div className="compilation">
                            <Panel >
                                <div className="compile-config">
                                    <CompileConfig compiler={this.state.compiler} cppVersion={this.state.cppVersion} optim={this.state.optim}
                                        onCompilerChange={this.onCompilerChange.bind(this)}
                                        onVersionChange={this.onVersionChanged.bind(this)}
                                        onOptimChange={this.onOptimChange.bind(this)}
                                    />
                                </div>
                                <hr className="config-separator" />
                                <div className="execute-button">
                                    <Button bsStyle="primary" onClick={() => this.sendCode()} disabled={this.state.sending} > <Glyphicon glyph="time" /> Run Benchmark</Button>
                                    <Checkbox className="force-cb" ref="force" inline={true} checked={this.state.isAnnotated} onChange={e => this.toggleAnnotated(e)} >Record disassembly</Checkbox>
                                    {this.state.clean ? <Checkbox className="force-cb" ref="force" inline={true} checked={this.state.force} onChange={this.forceChanged.bind(this)}>Clear cached results</Checkbox> : null}
                                </div>
                            </Panel>
                        </div>
                        <TimeChart benchmarks={this.state.graph} id={this.state.location} onNamesChange={n => this.setState({ benchNames: n })} />
                        <BashOutput text={this.state.message}></BashOutput>
                        <AssemblyEditor code={this.state.annotation} names={this.state.benchNames} />
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Benchmark;

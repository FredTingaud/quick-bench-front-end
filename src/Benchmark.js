import React from 'react';
import CodeEditor from './CodeEditor.js';
import BashOutput from './BashOutput.js';
import CompileConfig from './CompileConfig.js';
import TimeChart from './TimeChart.js';
import AssemblyEditor from './AssemblyEditor.js';
import { Button, Row, Col, Grid, Panel, Glyphicon, Checkbox } from 'react-bootstrap';

var request = require('request');
const protocolVersion = 2;

const startCode = `static void BM_StringCreation(benchmark::State& state) {
  while (state.KeepRunning())
    std::string empty_string;
}
// Register the function as a benchmark
BENCHMARK(BM_StringCreation);

static void BM_StringCopy(benchmark::State& state) {
  std::string x = "hello";
  while (state.KeepRunning())
    std::string copy(x);
}
BENCHMARK(BM_StringCopy);
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
            , optim: "1"
            , clean: false
            , force: false
            , benchNames: []
            , location: props.id
            , annotation: ''
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
    componentDidUpdate(prevProps, prevState) {
        if (this.state.location !== prevState.location) {
            this.props.onLocationChange(this.state.location);
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
                        this.setState({ annotation: result.annotation });
                    }
                }
            }
        });
    }
    sendCode(annotated) {
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
                "isAnnotated": annotated
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
                    <Col sm={6} className="full-size">
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
                                    <Button bsStyle="primary" onClick={() => this.sendCode(false)} disabled={this.state.sending} > <Glyphicon glyph="time" /> Run benchmark</Button>
                                    <Button bsStyle="success" onClick={() => this.sendCode(true)} disabled={this.state.sending} > <Glyphicon glyph="time" /> Run annotated benchmark</Button>
                                    {this.state.clean ? <Checkbox className="force-cb" ref="force" inline={true} checked={this.state.force} onChange={this.forceChanged.bind(this)}>Force full recalculation</Checkbox> : null}
                                </div>
                            </Panel>
                        </div>
                        <TimeChart benchmarks={this.state.graph} id={this.state.location} onNamesChange={n => this.setState({ benchNames: n })} />
                        <BashOutput text={this.state.message}></BashOutput>
                        <div className="code-editor">
                            <AssemblyEditor code={this.state.annotation} />
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Benchmark;

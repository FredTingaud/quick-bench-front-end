import React from 'react';
import CodeEditor from './CodeEditor.js';
import BashOutput from './BashOutput.js';
import CompileConfig from './CompileConfig.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, Row, Col, Grid, Panel, Glyphicon, Checkbox } from 'react-bootstrap';

var request = require('request');
const protocolVersion = 1;

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
        };
        this.graph = [];
        this.url = this.props.url;
        this.maxCodeSize = this.props.maxCodeSize;
    }
    sendCode() {
        if (this.state.text.length > this.maxCodeSize) {
            this.setState({
                graph: [],
                message: `Your code is ${this.state.text.length} characters long, while the maximum code size is ${this.maxCodeSize}.
If you think this limitation is stopping you in a legitimate usage of quick-bench, please contact me.`
            });
        } else {
            this.setState({
                sending: true,
                graph: [],
                message: ''
            });
            var obj = {
                "code": this.state.text,
                "compiler": this.state.compiler,
                "optim": this.state.optim,
                "cppVersion": this.state.cppVersion,
                "protocolVersion": protocolVersion,
                "force": this.state.clean && this.state.force
            };
            request({
                url: this.url
                , method: "POST"
                , json: true
                , headers: {
                    "content-type": "application/json"
                    ,
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
                        graph: body.result.benchmarks
                    });
                }
                if (body.message) {
                    this.setState({ message: body.message });
                }
            });
        }
    }
    textChanged(text) {
        this.setState({
            text: text,
            clean: false,
            force: false
        })
    }
    forceChanged(e) {
        this.setState({
            force: e.target.checked
        })
    }
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col sm={6} >
                        <div className="code-editor">
                            <CodeEditor onChange={this.textChanged.bind(this)}
                                code={this.state.text} />
                        </div>
                    </Col>
                    <Col sm={6} >
                        <div className="compilation">
                            <Panel >
                                <div className="compile-config">
                                    <CompileConfig compiler={this.state.compiler} cppVersion={this.state.cppVersion} optim={this.state.optim}
                                        onCompilerChange={(c) => this.setState({ compiler: c })}
                                        onVersionChange={(v) => this.setState({ cppVersion: v })}
                                        onOptimChange={(optim) => this.setState({ optim: optim })}
                                    />
                                </div>
                                <hr className="config-separator" />
                                <div className="execute-button">
                                    <Button bsStyle="primary" onClick={() => this.sendCode(this.state)} disabled={this.state.sending} > <Glyphicon glyph="time" /> Run benchmark</Button>
                                    {this.state.clean ? <Checkbox className="force-cb" ref="force" inline={true} checked={this.state.force} onChange={this.forceChanged.bind(this)}>Force full recalculation</Checkbox> : null}
                                </div>
                            </Panel>
                        </div>
                        <div className="result-chart">
                            <BarChart width={600} height={300} label="Benchmark Result" data={this.state.graph} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cpu_time" fill="#82ca9d" />
                            </BarChart>
                        </div>
                        <BashOutput text={this.state.message}></BashOutput>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

export default Benchmark;

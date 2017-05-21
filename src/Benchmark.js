import React from 'react';
import CodeEditor from './CodeEditor.js';
import BashOutput from './BashOutput.js';
import CompileConfig from './CompileConfig.js';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button, Row, Col, Grid, Panel, Glyphicon } from 'react-bootstrap';

var request = require('request');

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
            , version: "17"
            , optim: "1"
        };
        this.graph = [];
        this.url = this.props.url;
    }
    sendCode() {
        this.setState({
            sending: true,
            graph: [],
            message: ''
        });
        var obj = {
            "code": this.state.text,
            "compiler": this.state.compiler,
            "optim": this.state.optim,
            "version": this.state.version
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
                sending: false
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
    render() {
        return (
            <Grid fluid={true}>
                <Row>
                    <Col sm={6} >
                        <div className="code-editor">
                            <CodeEditor onChange={(text) => this.setState({ text: text })}
                                code={this.state.text} />
                        </div>
                    </Col>
                    <Col sm={6} >
                        <div className="compilation">
                            <Panel >
                                <div className="compile-config">
                                    <CompileConfig compiler={this.state.compiler} version={this.state.version} optim={this.state.optim}
                                        onCompilerChange={(c) => this.setState({ compiler: c })}
                                        onVersionChange={(v) => this.setState({ version: v })}
                                        onOptimChange={(optim) => this.setState({ optim: optim })}
                                    />
                                </div>
                                <hr className="config-separator" />
                                <div className="execute-button">
                                    <Button bsStyle="primary" onClick={() => this.sendCode(this.state)} disabled={this.state.sending} > <Glyphicon glyph="time" /> Run benchmark</Button>
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

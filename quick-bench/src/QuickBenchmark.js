import React from 'react';
import CodeEditor from 'components/CodeEditor.js';
import BashOutput from 'components/BashOutput.js';
import CompileConfig from 'components/CompileConfig.js';
import QuickChart from './QuickChart.js';
import { Button, ButtonToolbar, Container, Row, Col, Card, FormCheck, Form, ProgressBar, Nav, Tab } from 'react-bootstrap';
import { MdTimer } from "react-icons/md";
import AssemblyEditor from './AssemblyEditor.js';
import CEButton from 'components/CEButton.js';
import CPPInsightsButton from 'components/CPPInsightsButton.js';
import Display from 'components/Display.js';
import HashParser from 'components/HashParser.js';

var request = require('request');
const protocolVersion = 4;

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
`;
const includeStr = '#include <benchmark/benchmark.h>\n';
const mainStr = '\nBENCHMARK_MAIN();';
const compilers = ['clang-3.8', 'clang-3.9', 'clang-4.0', 'clang-5.0',
    'clang-6.0', 'clang-7.0', 'clang-7.1', 'clang-8.0', 'clang-9.0',
    'gcc-5.5', 'gcc-6.4', 'gcc-6.5', 'gcc-7.2', 'gcc-7.3', 'gcc-7.4',
    'gcc-7.5', 'gcc-8.1', 'gcc-8.2', 'gcc-8.3', 'gcc-9.1', 'gcc-9.2'];

const PALETTE = [
    "#5ed9cd",
    "#61d6eb",
    "#a1caf4",
    "#c7c0f4",
    "#eab3f4",
    "#f5b3d9",
    "#f5b5c0",
    "#f6b8a0",
    "#edc058",
    "#c4ce58",
    "#7ddc58",
    "#5bdca8"
];
class Benchmark extends React.Component {
    static initialState = {
        text: startCode
        , graph: []
        , message: ''
        , sending: false
        , progress: 0
        , options: {
            compiler: "clang-9.0"
            , cppVersion: "20"
            , optim: "3"
            , lib: "gnu"
        }
        , clean: false
        , force: false
        , benchNames: []
        , annotation: ''
        , isAnnotated: true
        , chartIndex: 0
        , displayTab: 'charts'
    };
    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(Benchmark.initialState));
        this.state.location = props.id;
        this.state.prevLocation = props.id;

        let stateFromHash = HashParser.getState(compilers, this.state.options);
        if (stateFromHash.length > 0) {
            this.state.text = this.importCode(stateFromHash[0].text);
            this.state.options = stateFromHash[0].options;

        }
    }
    initializeCode() {
        this.setState(Benchmark.initialState);
    }
    componentDidMount() {
        if (this.props.id) {
            this.setState({
                sending: true,
                graph: [],
                annotation: '',
                message: ''
            });
            this.getCode(this.props.id);
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.id !== this.props.id) {
            this.setState({
                prevLocation: this.props.id
            });
            if (this.props.id !== this.state.location) {
                this.setState({
                    location: this.props.id
                });
                if (this.props.id) {
                    this.getCode(this.props.id);
                } else {
                    this.initializeCode();
                    this.props.onLocationChange(undefined);
                }
            }
        }
    }
    static getDerivedStateFromProps(props, state) {
        if (props.id !== state.prevLocation && props.id !== state.location && props.id) {
            return {
                sending: true,
                graph: [],
                annotation: '',
                message: ''
            };
        }
        return null;
    }
    getCode(id) {
        request.get(this.props.url + '/quick/' + id, (err, res, body) => {
            this.setState({
                sending: false,
                clean: true,
                force: false
            });
            if (body) {
                let result = JSON.parse(body);
                if (result) {
                    if (result.result) {
                        let compiler = result.tab.compiler === 'clang++-3.8' ? 'clang-3.8' : result.tab.options.compiler;
                        let options = {
                            compiler: compiler
                            , cppVersion: result.tab.options.cppVersion
                            , optim: result.tab.options.optim
                            , lib: result.tab.options.lib
                        };
                        this.setState({
                            text: result.tab.code
                            , graph: result.result.benchmarks
                            , options: options
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
        if (this.state.text.length > this.props.maxCodeSize) {
            this.setState({
                graph: [],
                annotation: '',
                message: `Your code is ${this.state.text.length} characters long, while the maximum code size is ${this.props.maxCodeSize}.
If you think this limitation is stopping you in a legitimate usage of build-bench, please contact me.`
            });
        } else {
            this.setState({
                sending: true,
                graph: [],
                annotation: '',
                message: ''
            });
            this.setState({ progress: 0 });
            let interval = setInterval(() => {
                this.setState({ progress: this.state.progress + 100 / 120 });
            }, 1000);

            var obj = {
                "code": this.state.text,
                "options": this.state.options,
                "protocolVersion": protocolVersion,
                "force": this.state.clean && this.state.force,
                "isAnnotated": this.state.isAnnotated,
            };
            request({
                url: this.props.url + '/quick/'
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
                clearInterval(interval);
                if (body) {

                    if (body.result) {
                        this.setState({
                            graph: body.result.benchmarks || []
                        });
                    }
                    if (body.id) {
                        this.setState({ location: body.id }, () => this.props.onLocationChange(body.id));
                    }
                    if (body.annotation) {
                        this.setState({ annotation: body.annotation });
                    }
                    if (body.message) {
                        this.setState({ message: body.message });
                    }
                }
                else if (err) {
                    this.setState({ message: err });
                }
            });
        }
    }
    importCode(text) {
        return text.replace(includeStr, '').replace(mainStr, '');
    }
    setDirty() {
        this.setState({
            clean: false,
            force: false
        });
    }
    codeChanged(code) {
        this.setState({
            text: code
        });
        this.setDirty();
    }
    forceChanged(e) {
        this.setState({
            force: e.target.checked
        });
    }
    onOptionsChange(options) {
        this.setState({ options: options });
        this.setDirty();
    }
    toggleAnnotated(e) {
        this.setState({ isAnnotated: e.target.checked });
    }
    render() {
        return (
            <Container fluid className="fill-content">
                <Row className="fill-row">
                    <Col sm={6} className="full-size">
                        <div className="code-editor">
                            <CodeEditor onChange={c => this.codeChanged(c)}
                                value={this.state.text}
                                names={this.state.benchNames}
                            />
                        </div>
                    </Col>
                    <Col sm={6} className="flex-container">
                        <div className="fill-content">
                            <div className="fixed-content">
                                <Card body className="my-2">
                                    <CompileConfig compilers={compilers} value={this.state.options} onChange={c => this.onOptionsChange(c)} />
                                    <hr className="config-separator" />
                                    <ButtonToolbar className="justify-content-between">
                                        <Form inline>
                                            <Button variant="primary" onClick={() => this.sendCode()} disabled={this.state.sending} className="mr-2" id="Run"> <MdTimer /> Run Benchmark</Button>
                                            <FormCheck ref="force" checked={this.state.isAnnotated} custom type='checkbox' id="disassembly" onChange={e => this.toggleAnnotated(e)} label={"Record disassembly"} className="mr-2" />
                                            <Display when={this.state.clean}>
                                                <FormCheck ref="force" type="checkbox" custom checked={this.state.force} id="clean-cache" onChange={this.forceChanged.bind(this)} label="Clear cached results" />
                                            </Display>
                                        </Form>
                                        <Form inline>
                                            <CEButton className="float-right" texts={includeStr + this.state.text + mainStr} options={this.state.options} />
                                            <CPPInsightsButton className="float-right" text={includeStr + this.state.text + mainStr} options={this.state.options} />
                                        </Form>
                                    </ButtonToolbar>
                                    <Display when={this.state.sending}>
                                        <ProgressBar animated now={this.state.progress} />
                                    </Display>
                                </Card>
                            </div>
                            <Tab.Container activeKey={this.state.annotation ? this.state.displayTab : "charts"} onSelect={(k) => this.setState({ displayTab: k })}>
                                <Display when={this.state.graph.length > 0 && this.state.annotation}>
                                    <Nav variant="tabs">
                                        <Nav.Item>
                                            <Nav.Link eventKey="charts">Charts</ Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="asm">Assembly</ Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Display>
                                <Tab.Content className="fill-content">
                                    <Tab.Pane eventKey="charts" className="fill-content">
                                        <QuickChart benchmarks={this.state.graph}
                                            id={this.state.location}
                                            index={this.state.chartIndex}
                                            onNamesChange={n => this.setState({ benchNames: n })}
                                            palette={PALETTE}
                                            changeDisplay={d => this.setState({ chartIndex: d })}
                                        />
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="asm" className="fill-content">
                                        <AssemblyEditor code={this.state.annotation} names={this.state.benchNames} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Tab.Container>
                            <Display when={this.state.message.length > 0}>
                                <div className="fixed-content">
                                    <BashOutput value={this.state.message} />
                                </div>
                            </Display>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Benchmark;

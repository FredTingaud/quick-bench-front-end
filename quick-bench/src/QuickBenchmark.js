import React from 'react';
import CodeEditor from 'components/CodeEditor.js';
import BashOutput from 'components/BashOutput.js';
import CompileConfig from 'components/CompileConfig.js';
import QuickChart from './QuickChart.js';
import { Dropdown, Button, DropdownButton, Container, Row, Col, Card, FormCheck, ProgressBar, Nav, Tab } from 'react-bootstrap';
import { MdTimer } from "react-icons/md";
import AssemblyEditor from './AssemblyEditor.js';
import CEButton from 'components/CEButton.js';
import CPPInsightsButton from 'components/CPPInsightsButton.js';
import Display from 'components/Display.js';
import HashParser from 'components/HashParser.js';
import { ReactComponent as Logo } from 'components/resources/ico/qb.svg';
import QuickFetch from './QuickFetch.js';
import BBButton from 'components/BBButton';
import DefaultSettings from 'components/DefaultSettings';

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

const PALETTE = [
    "#005bbb",
    "#61d6eb",
    "#a1caf4",
    "#c7c0f4",
    "#eab3f4",
    "#f5b3d9",
    "#ffd500",
    "#f6b8a0",
    "#edc058",
    "#c4ce58",
    "#7ddc58",
    "#5bdca8"
];

const NONE_DISASSEMBLY_IDENTIFIER = "no"
const NONE_DISASSEMBLY_PRETTY_NAME = "None"
const DEFAULT_DISASSEMBLY_PRETTY_NAME = NONE_DISASSEMBLY_PRETTY_NAME
const ATT_DISASSEMBLY_IDENTIFIER = "att"
const ATT_DISASSEMBLY_PRETTY_NAME = "AT&T"
const INTEL_DISASSEMBLY_IDENTIFIER = "intel"
const INTEL_DISASSEMBLY_PRETTY_NAME = "Intel"

const disassembly_identifier_to_pretty_name = {
    [ATT_DISASSEMBLY_IDENTIFIER]: ATT_DISASSEMBLY_PRETTY_NAME
    , [INTEL_DISASSEMBLY_IDENTIFIER]: INTEL_DISASSEMBLY_PRETTY_NAME
    , [NONE_DISASSEMBLY_IDENTIFIER]: NONE_DISASSEMBLY_PRETTY_NAME
}

class QuickBenchmark extends React.Component {
    static initialState = {
        text: startCode
        , graph: []
        , message: ''
        , sending: false
        , progress: 0
        , options: {
            compiler: DefaultSettings.latestCompiler
            , cppVersion: "20"
            , optim: "3"
            , lib: "gnu"
            , flags: []
        }
        , clean: false
        , force: false
        , benchNames: []
        , annotation: ''
        , disassemblyOption: ATT_DISASSEMBLY_IDENTIFIER
        , chartIndex: 1
        , displayTab: 'charts'
    };
    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(QuickBenchmark.initialState));
        this.state.location = props.id;
        this.state.prevLocation = props.id;

        let stateFromHash = HashParser.getState(this.state.options);
        if (stateFromHash.length > 0) {
            this.state.text = this.importCode(stateFromHash[0].text);
            this.state.options = stateFromHash[0].options;

        }
    }
    initializeCode() {
        this.setState(QuickBenchmark.initialState);
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
        QuickFetch.fetchId(id, (result) => this.loadCode(result, id));
    }
    loadCode(result, id) {
        this.setState({
            sending: false,
            clean: true,
            force: false
        });
        if (result) {
            if (result.result) {
                let compiler = result.tab.compiler === 'clang++-3.8' ? 'clang-3.8' : result.tab.options.compiler;
                let options = {
                    compiler: compiler,
                    cppVersion: result.tab.options.cppVersion,
                    optim: result.tab.options.optim,
                    lib: result.tab.options.lib,
                    flags: result.tab.options.flags
                };
                this.setState({
                    text: result.tab.code,
                    graph: result.result.benchmarks,
                    options: options,
                    location: id
                });
            }
            if (result.message) {
                this.setState({
                    message: result.message
                });
            }
            if (result.annotation) {
                this.setState({
                    annotation: result.annotation,
                    disassemblyOption: result.disassemblyOption !== "" ? result.disassemblyOption : NONE_DISASSEMBLY_IDENTIFIER,
                });
            }
            else {
                this.setState({
                    annotation: '',
                    disassemblyOption: NONE_DISASSEMBLY_IDENTIFIER
                });
            }
        }
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

            const obj = {
                "code": this.state.text,
                "options": this.state.options,
                "protocolVersion": DefaultSettings.protocolVersion,
                "force": this.state.clean && this.state.force,
                "disassemblyOption": this.state.disassemblyOption,
            };
            QuickFetch.fetchResults(obj, this.props.timeout, (content, err) => this.receiveResults(content, err), (progress) => { this.setState({ progress: progress }); });
        }
    }
    receiveResults(body, err) {
        this.setState({
            sending: false,
            clean: true,
            force: false
        });
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
    changeDisassemblyOption(k) {
        this.setState({ disassemblyOption: k });
    }
    disassemblyOptionFormat(option) {
        if (option === undefined) {
          return DEFAULT_DISASSEMBLY_PRETTY_NAME;
        }
        if (!disassembly_identifier_to_pretty_name.hasOwnProperty(option)) {
            console.trace("Attempted to set an unsupported assembly format: " + option);
            return DEFAULT_DISASSEMBLY_PRETTY_NAME;
        }
        return disassembly_identifier_to_pretty_name[option];
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
                                    <CompileConfig compilers={this.props.containers} value={this.state.options} onChange={c => this.onOptionsChange(c)} pullCompiler={this.props.pullContainer} />
                                    <hr className="config-separator" />
                                    <Container fluid className="g-0">
                                        <Row className="align-items-center gx-2" xs="auto">
                                            <Col>
                                                <Button variant="primary" onClick={() => this.sendCode()} disabled={this.state.sending} className="me-2" id="Run"> <MdTimer /> Run Benchmark</Button>
                                            </Col>

                                            <Col>
                                                <DropdownButton id="disassembly-format" variant="outline-dark" title={"Disassembly = " + this.disassemblyOptionFormat(this.state.disassemblyOption)} onSelect={key => this.changeDisassemblyOption(key)} className="me-2">
                                                    <Dropdown.Item eventKey={NONE_DISASSEMBLY_IDENTIFIER}>{NONE_DISASSEMBLY_PRETTY_NAME}</Dropdown.Item>
                                                    <Dropdown.Item eventKey={ATT_DISASSEMBLY_IDENTIFIER}>{ATT_DISASSEMBLY_PRETTY_NAME}</Dropdown.Item>
                                                    <Dropdown.Item eventKey={INTEL_DISASSEMBLY_IDENTIFIER}>{INTEL_DISASSEMBLY_PRETTY_NAME}</Dropdown.Item>
                                                </DropdownButton>
                                            </Col>
                                            <Col>
                                                <Display when={this.state.clean}>
                                                    <FormCheck type="checkbox" checked={this.state.force} id="clean-cache" onChange={this.forceChanged.bind(this)} label="Clear cached results" />
                                                </Display>
                                            </Col>
                                            <Col xs="auto" className="ms-auto">
                                                <CEButton className="float-right" texts={includeStr + this.state.text + mainStr} options={this.state.options} />
                                                <CPPInsightsButton className="float-right" text={includeStr + this.state.text + mainStr} options={this.state.options} />
                                                <BBButton className="float-right" text={includeStr + this.state.text + mainStr} options={this.state.options} />
                                            </Col>
                                        </Row>
                                    </Container>
                                    <Display when={this.state.sending}>
                                        <ProgressBar animated now={this.state.progress} />
                                    </Display>
                                </Card>
                            </div>
                            <Tab.Container id="output-tabs" activeKey={this.state.annotation ? this.state.displayTab : "charts"} onSelect={(k) => this.setState({ displayTab: k })}>
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
                                <Display when={this.state.graph.length > 0}>
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
                                            <AssemblyEditor code={this.state.annotation} names={this.state.benchNames} palette={PALETTE} />
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Display>
                            </Tab.Container>
                            <Display when={this.state.graph.length === 0 && this.state.message.length === 0}>
                                <div className="watermark">
                                    <Logo className="watermark2" style={{ fill: "#26595430" }} title="Run with Quick Bench!" />
                                </div>
                            </Display>
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

export default QuickBenchmark;

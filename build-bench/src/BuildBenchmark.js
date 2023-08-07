import React from 'react';
import CodeEditor from 'components/CodeEditor.js';
import BashOutput from 'components/BashOutput.js';
import CompileConfig from 'components/CompileConfig.js';
import BuildChart from './BuildChart.js';
import { Button, Container, Row, Col, Card, FormCheck, ProgressBar, Nav, Tab } from 'react-bootstrap';
import { MdTimer } from "react-icons/md";
import OutputTabs from './OutputTabs.js';
import WrappableTabs from './WrappableTabs.js';
import DisplayEditor from './DisplayEditor.js';
import IncludesDisplay from './IncludesDisplay.js';
import Display from 'components/Display.js';
import HashParser from 'components/HashParser.js';
import CEButton from 'components/CEButton.js';
import CPPInsightsButton from 'components/CPPInsightsButton.js';
import QuickBenchButton from 'components/QuickBenchButton.js';
import { ReactComponent as Logo } from 'components/resources/ico/bb.svg';
import BuildFetch from './BuildFetch.js';
import DefaultSettings from 'components/DefaultSettings';

const startCode1 = `#include <cstdio>

int main() {
    puts("Hello World");
    return 0;
}
`;
const startCode2 = `#include <iostream>

int main() {
    std::cout << "Hello World\\n";
    return 0;
}
`;
const PALETTE = [
    "#e3a600",
    "#b8b600",
    "#75c500",
    "#00ca81",
    "#00c6b2",
    "#00c3d2",
    "#13bdff",
    "#a6a9ff",
    "#e390ff",
    "#ff86dc",
    "#ff8eaf",
    "#ff9470"
];

class BuildBenchmark extends React.Component {
    static initialState = {
        texts: [startCode1, startCode2]
        , titles: ['cstdio', 'iostream']
        , graph: []
        , messages: ['', '']
        , sending: false
        , progress: 0
        , index: 0
        , options: Array(2).fill().map(a => ({
            compiler: DefaultSettings.latestCompiler
            , cppVersion: "c++20"
            , optim: "3"
            , lib: "gnu"
            , flags: []
        }))
        , clean: false
        , force: false
        , chartIndex: 0
        , textsWrapped: false
        , optionsWrapped: true
        , includes: []
        , asm: []
        , pp: []
    }
    constructor(props) {
        super(props);
        this.state = JSON.parse(JSON.stringify(BuildBenchmark.initialState));
        this.state.location = props.id;
        this.state.prevLocation = props.id;

        let stateFromHash = HashParser.getState(this.state.options[0]);
        if (stateFromHash.length > 0) {
            this.state.titles = stateFromHash.map(s => s.title);
            this.state.texts = stateFromHash.map(s => s.text);
            this.state.options = stateFromHash.map(s => s.options);
            this.state.textsWrapped = this.state.texts.length > 1 && this.state.texts.every(t => t === this.state.texts[0])
            this.state.optionsWrapped = this.state.options.length > 1 && this.state.options.every(o => JSON.stringify(o) === JSON.stringify(this.state.options[0]))
        }
    }
    initializeCode() {
        this.setState(BuildBenchmark.initialState);
    }
    componentDidMount() {
        if (this.props.id) {
            this.clearResults();
            this.setState({
                sending: true,
                messages: []
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
                messages: []
            };
        }
        return null;
    }
    formatIncludes(includes) {
        return includes.map(s => s.split('\n').map(s => {
            let end = false;
            return [...s].map(c => {
                if (c === '.' && !end)
                    return '\t'
                end = true;
                return c;
            }).join('').replace('\t ', '');
        }).join('\n'));
    }
    clearResults() {
        this.setState({
            graph: [],
            includes: [],
            asm: [],
            pp: [],
            index: 0
        });
    }
    getCode(id) {
        this.clearResults();
        BuildFetch.fetchId(id, (result) => this.loadCode(result, id));
    }
    loadCode(result, id) {
        this.setState({
            sending: false,
            clean: true,
            force: false
        });
        if (result) {
            if (result.result) {
                let titles = result.tabs.map(t => t.title);
                let options = result.tabs.map(t => ({
                    compiler: t.compiler
                    , cppVersion: t.cppVersion
                    , optim: t.optim
                    , lib: t.lib
                    , flags: t.flags
                }));
                this.setState({
                    texts: result.tabs.map(t => t.code)
                    , titles: titles
                    , graph: result.result
                    , options: options
                    , location: id
                    , textsWrapped: result.tabs.every(v => v.code === result.tabs[0].code)
                    , optionsWrapped: options.every(o => JSON.stringify(o) === JSON.stringify(options[0]))
                    , includes: this.formatIncludes(result.includes)
                    , asm: result.asm
                    , pp: result.preprocessed
                });
            }
            if (result.messages) {
                this.setState({
                    messages: result.messages
                });
            }
        }
    }
    sendCode() {
        const bigger = this.state.texts.findIndex(t => t.length > this.props.maxCodeSize);
        this.clearResults();
        if (bigger > -1) {
            this.setState({
                messages: [`Your code in ${this.state.titles[bigger]} is ${this.state.texts[bigger].length} characters long, while the maximum code size is ${this.props.maxCodeSize}.
If you think this limitation is stopping you in a legitimate usage of build-bench, please contact me.`]
            });
        } else {
            this.setState({
                sending: true,
                messages: []
            });
            this.setState({ progress: 0 });

            var obj = {
                "tabs": this.state.texts.map((c, i) => ({
                    "code": c,
                    "title": this.state.titles[i],
                    "compiler": this.state.options[i].compiler,
                    "optim": this.state.options[i].optim,
                    "cppVersion": this.state.options[i].cppVersion,
                    "lib": this.state.options[i].lib
                    , "asm": 'att'
                    , "withPP": true
                    , "flags": this.state.options[i].flags
                })),
                "protocolVersion": DefaultSettings.protocolVersion,
                "force": this.state.clean && this.state.force,
            };
            BuildFetch.fetchResults(obj, this.props.timeout * this.state.titles.length, (content, err) => this.receiveResults(content, err), (progress) => { this.setState({ progress: progress }); });
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
                    graph: body.result,
                    location: body.id,
                    includes: this.formatIncludes(body.includes),
                    asm: body.asm,
                    pp: body.preprocessed
                });
                this.props.onLocationChange(body.id);
            }
            if (body.messages) {
                this.setState({ messages: body.messages });
            }
        }
        else if (err) {
            this.setState({ messages: [err] });
        }
    }
    setDirty() {
        this.setState({
            clean: false,
            force: false
        });
    }
    codeChanged(code) {
        this.setState({
            texts: code
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
    onTitlesChange(titles) {
        this.setState({ titles: titles });
        this.setDirty();
    }
    closeTab(removedIndex) {
        let texts = this.state.texts;
        texts.splice(removedIndex, 1);
        let titles = this.state.titles;
        titles.splice(removedIndex, 1);
        let opts = this.state.options;
        opts.splice(removedIndex, 1);
        let messages = this.state.messages;
        this.setState({
            texts: texts,
            titles: titles,
            options: opts,
            messages: messages
        });

        this.setDirty();
    }
    addTab() {
        let texts = this.state.texts.concat(this.state.texts[this.state.index]);
        let titles = this.state.titles.concat(this.state.titles[this.state.index] + '2');
        let opts = this.state.options.concat({ ...this.state.options[this.state.index] });
        let messages = this.state.messages.concat('');
        this.setState({
            texts: texts,
            titles: titles,
            options: opts,
            messages: messages
        });

        this.setDirty();
    }
    render() {
        return (
            <Container fluid className="fill-content">
                <Row className="fill-row">
                    <Col sm={6} className="full-size">
                        <div className="code-editor">
                            <WrappableTabs
                                titles={this.state.titles}
                                index={this.state.index}
                                setIndex={i => this.setState({ index: i })}
                                wrapped={this.state.textsWrapped}
                                changeWrapped={(w, c) => this.setState({ textsWrapped: w }, c)}
                                closeTab={(i) => this.closeTab(i)}
                                addTab={() => this.addTab()}
                                onTitlesChange={t => this.onTitlesChange(t)}
                                values={this.state.texts}
                                onChange={c => this.codeChanged(c)}
                                palette={PALETTE}
                                confirm
                                packed
                            >
                                <CodeEditor
                                    names={[]}
                                />
                            </WrappableTabs>
                        </div>
                    </Col>
                    <Col sm={6} className="flex-container">
                        <div className="fill-content">
                            <div className="fixed-content">
                                <Card body className="my-2">
                                    <WrappableTabs
                                        titles={this.state.titles}
                                        index={this.state.index}
                                        setIndex={i => this.setState({ index: i })}
                                        wrapped={this.state.optionsWrapped}
                                        changeWrapped={(w, c) => this.setState({ optionsWrapped: w }, c)}
                                        closeTab={(i) => this.closeTab(i)}
                                        addTab={() => this.addTab()}
                                        onTitlesChange={t => this.onTitlesChange(t)}
                                        values={this.state.options}
                                        onChange={c => this.onOptionsChange(c)}
                                        unwrapText="Configure Separately"
                                        palette={PALETTE}
                                    >
                                        <CompileConfig compilers={this.props.containers} pullCompiler={this.props.pullContainer} />
                                    </WrappableTabs>
                                    <hr className="config-separator" />
                                    <Container fluid className="g-0">
                                        <Row className="align-items-center gx-2" xs="auto">
                                            <Col>
                                            <Button variant="primary" onClick={() => this.sendCode()} disabled={this.state.sending} className="me-2" id="Run"> <MdTimer /> Build Time</Button>
                                            </Col>
                                            <Col>
                                            <Display when={this.state.clean}>
                                                <FormCheck ref="force" type="checkbox" checked={this.state.force} id="clean-cache" onChange={this.forceChanged.bind(this)} label="Clear cached results" />
                                            </Display>
                                            </Col>
                                            <Col className="ms-auto">
                                                <CEButton className="float-right" texts={this.state.texts} options={this.state.options} />
                                                <CPPInsightsButton className="float-right" text={this.state.texts[this.state.index]} options={this.state.options[this.state.index]} />
                                                <QuickBenchButton className="float-right" text={this.state.texts[this.state.index]} options={this.state.options[this.state.index]} />
                                            </Col>
                                        </Row>
                                        <Row className="gy-0">
                                            <Display when={this.state.sending}>
                                                <ProgressBar animated now={this.state.progress} />
                                            </Display>
                                        </Row>
                                    </Container>
                                </Card>
                            </div>
                            <Tab.Container defaultActiveKey="charts" id="visualization-tabs">
                                <Display when={this.state.graph.length > 0}>
                                    <Nav variant="tabs">
                                        <Nav.Item>
                                            <Nav.Link eventKey="charts">Charts</ Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="includes">Includes</ Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="asm">Assembly</ Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="pp">Preprocessed</ Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Tab.Content className="fill-content">
                                        <Tab.Pane eventKey="charts" className="fill-content">
                                            <BuildChart benchmarks={this.state.graph}
                                                id={this.state.location}
                                                titles={this.state.titles}
                                                index={this.state.chartIndex}
                                                palette={PALETTE}
                                                changeDisplay={d => this.setState({ chartIndex: d })}
                                            />
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="includes" className="fill-content" >
                                            <OutputTabs values={this.state.includes} index={this.state.index} setIndex={i => this.setState({ index: i })} palette={PALETTE} titles={this.state.titles}>
                                                <IncludesDisplay />
                                            </OutputTabs>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="asm" className="fill-content">
                                            <OutputTabs values={this.state.asm} index={this.state.index} setIndex={i => this.setState({ index: i })} palette={PALETTE} titles={this.state.titles}>
                                                <DisplayEditor language="asm" />
                                            </OutputTabs>
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="pp" className="fill-content">
                                            <OutputTabs values={this.state.pp} index={this.state.index} setIndex={i => this.setState({ index: i })} palette={PALETTE} titles={this.state.titles}>
                                                <DisplayEditor language="cpp" />
                                            </OutputTabs>
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Display>
                            </Tab.Container>
                            <Display when={this.state.graph.length === 0 && (this.state.messages.length === 0 || !this.state.messages.some(t => t))}>
                                <div className="watermark">
                                    <Logo className="watermark2" style={{ fill: "#3A0F9630" }} title="Build Bench" />
                                </div>
                            </Display>
                            <div className="fixed-content">
                                <OutputTabs values={this.state.messages} index={this.state.index} setIndex={i => this.setState({ index: i })} palette={PALETTE} titles={this.state.titles} >
                                    <BashOutput />
                                </OutputTabs>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default BuildBenchmark;

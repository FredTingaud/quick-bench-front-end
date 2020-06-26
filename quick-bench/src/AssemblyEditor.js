import React from 'react';
import Palette from 'components/Palette.js';
import { Tab, Tabs } from 'react-bootstrap';
import Editor from 'components/Editor';

const RE_CODE = /\s*([0-9\\.]+) +:\s+([0-9a-f]+):\s+(.*)/;
const RE_TITLE = /-{11} ([^\s]*)\s*/;
const RATIO_WIDTH = 7;
const COMMAND_WIDTH = 7;

class AssemblyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            index: 0
            , lines: []
            , models: []
            , titles: []
            , fullScreen: false
        }
        this.prevDecorations = [];
    }
    lineNumbersFunc(line) {
        if (this.state.lines.length === 0)
            return '';
        return this.state.lines[this.state.index][line - 1] || '';
    }
    editorDidMount(editor, monaco) {
        this.editor = editor;
        this.monaco = monaco;

        if (this.props.code) {
            this.makeCode(this.props.code);
        }
    }
    componentDidUpdate(prevProps) {
        if (this.editor && prevProps.code !== this.props.code) {
            this.makeCode(this.props.code);
        }
    }
    switchFullScreen() {
        let fullScreen = !this.state.fullScreen;
        this.props.setFullScreen(fullScreen);
        this.setState({ fullScreen: fullScreen });
    }
    splitLine(lines, codes, string, decorations, title) {
        let res = string.match(RE_CODE);
        if (res && res.length === 4) {
            let ratio = parseFloat(res[1]);
            let code = '';
            if (ratio > 0) {
                code = res[1] + '%';
                let i = this.props.names.indexOf(title);
                if (i > -1) {
                    const namesCount = this.props.names.filter(n => n !== 'Noop').length;
                    decorations.push(
                        {
                            range: new this.monaco.Range(lines.length + 1, 1, lines.length + 1, 1),
                            options: {
                                linesDecorationsClassName: Palette.pickCSS(i, namesCount)
                            }
                        });
                }
            }
            code = code + ' '.repeat(RATIO_WIDTH - code.length) + res[3];
            decorations.push({
                range: new this.monaco.Range(lines.length + 1, 1, lines.length + 1, RATIO_WIDTH),
                options: {
                    inlineClassName: 'ratio-line'
                }
            });
            lines.push(res[2]);
            codes.push(code);
            decorations.push({
                range: new this.monaco.Range(lines.length, RATIO_WIDTH + 1, lines.length, RATIO_WIDTH + COMMAND_WIDTH + 1),
                options: {
                    inlineClassName: 'asm-keyword'
                }
            });
        }
    }
    updateDecorations(model, decorations) {
        model.deltaDecorations(
            [], decorations);
    }
    makeCode(input) {
        let lines = [];
        let models = [];
        let titles = [];
        let states = [];

        let blocks = input.split(RE_TITLE);
        if (blocks[0] === '' && blocks.length % 2 === 1) {
            for (let i = 1; i < blocks.length; i++) {
                if (i % 2 === 1) {
                    titles.push(blocks[i]);
                } else {
                    lines.push([]);
                    states.push(null);
                    let decorations = [];
                    let index = lines.length - 1;
                    let rows = [];

                    blocks[i].split('\n').map(s => this.splitLine(lines[index], rows, s, decorations, titles[index]));
                    let e = this.monaco.editor;
                    let model = e.createModel(rows.join('\n'), 'asm');
                    models.push(model);
                    this.updateDecorations(model, decorations);
                }
            }
        }

        this.setState({
            index: 0
            , lines: lines
            , models: models
            , titles: titles
            , states: states
        });

        this.editor.setModel(models[0]);
    }
    handleSelect(key) {
        let newStates = [...this.state.states];
        newStates[this.state.index] = this.editor.saveViewState();
        this.setState({
            index: key
            , states: newStates
        });

        this.editor.setModel(this.state.models[key]);
        this.editor.restoreViewState(this.state.states[key]);
    }
    fillTabs() {
        let tabsList = this.state.titles.map(function (name, i) {
            return <Tab title={name} eventKey={i} key={name} tabClassName="small-tabs"/>
        });

        return (<Tabs onSelect={(key) => this.handleSelect(key)} defaultActiveKey={this.state.index} id="bench-asm-selection">
            {tabsList}
        </Tabs>);
    }
    render() {
        const options = {
            selectOnLineNumbers: true
            , readOnly: true
            , lineNumbers: (line) => this.lineNumbersFunc(line)
            , lineNumbersMinChars: 10
        };
        return (
            <>
                {this.fillTabs()}
                < Editor
                    language="asm"
                    options={options}
                    editorDidMount={(e, m) => this.editorDidMount(e, m)}
                />
            </>
        );
    }
}

export default AssemblyEditor;

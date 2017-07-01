import React from 'react';
import MonacoEditor from 'react-monaco-editor';
import Palette from './Palette.js';

const RE_CODE = /\s*([0-9\\.]+) +:\s+([0-9a-f]+):\s+(.*)/;
const RE_TITLE = /-{11} (.*)/;

class AssemblyEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ''
        }
        this.prevDecorations = [];
    }
    lineNumbersFunc(line) {
            return this.state.lines[line - 1] || '';
    }
    editorDidMount(editor, monaco) {
        editor.focus();
        this.editor = editor;
        this.monaco = monaco;
        window.addEventListener("resize", () => this.updateDimensions());
        this.makeCode(this.props.code);
    }
    editorWillUnmount() {
        window.removeEventListener("resize", () => this.updateDimensions());
    }
    updateDimensions() {
        this.editor.layout();
    }
    componentWillReceiveProps(nextProps) {
        if (this.editor && nextProps.code !== this.props.code) {
            this.makeCode(nextProps.code);
        }
    }
    splitLine(lines, codes, string, decorations) {
        let res = string.match(RE_CODE);
        if (res && res.length === 4) {
            let ratio = parseFloat(res[1]);
            let code = '';
            if (ratio > 0) {
                code = res[1] + '%';
                decorations.push({
                    range: new this.monaco.Range(lines.length + 1, 1, lines.length + 1, code.length + 1),
                    options: {
                        inlineClassName: 'ratio-line'
                    }
                });
            }
            code = code + ' '.repeat(7 - code.length) + res[3];
            lines.push(res[2]);
            codes.push(code);
            decorations.push({
                range: new this.monaco.Range(lines.length , 8, lines.length , 15),
                options: {
                    inlineClassName: 'asm-keyword'
                }
            });
        } else if (res = string.match(RE_TITLE)) {
            lines.push(null);
            codes.push(res[1]);
            decorations.push({
                range: new this.monaco.Range(lines.length, 1, lines.length, 6),
                options: {
                        isWholeLine: true,
                        inlineClassName: 'asm-title'
                }
            });
        }
    }
    updateDecorations(decorations) {
        this.prevDecorations = this.editor.deltaDecorations(
            this.prevDecorations, decorations);
    }
    makeCode(input) {
        let lines = [];
        let codes = [];
        let decorations = [];
        input.split('\n').map((s, i) => this.splitLine(lines, codes, s, decorations));

        this.setState({
            lines: lines
            , code: codes.join('\n')
        });

        this.updateDecorations(decorations);
    }
    render() {
        const options = {
            selectOnLineNumbers: true
            , readOnly: true
            , lineNumbers: (line) => this.lineNumbersFunc(line)
            , lineNumbersMinChars: 10
        };
        return (
            <MonacoEditor ref="monaco"
                language="asm"
                options={options}
                editorDidMount={(e, m) => this.editorDidMount(e, m)}
                value={this.state.code}
            />
        );
    }
}

export default AssemblyEditor;

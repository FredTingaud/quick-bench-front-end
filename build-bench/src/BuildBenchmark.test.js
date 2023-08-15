import React from 'react';
import {createRoot} from 'react-dom/client'
import DefaultSettings from 'components/DefaultSettings.js';

jest.mock("components/BashOutput.js", () => (props) => <mock-BashOutput {...props} />)

jest.mock('react-resize-detector', () => (props) => <mock-ResizeDetector {...props} />)

import Benchmark from './BuildBenchmark';

import Fetch from "components/Fetch.js";

import renderer from 'react-test-renderer';

jest.mock("react-monaco-editor", () => (props) => <mock-MonacoEditor {...props} />);

jest.mock('components/TimeChart.js', () => (props) => <mock-TimeChart {...props} />);

jest.mock("components/Fetch.js", () => {
    return {
        __esModule: true,
        default: {
            fetchId: jest.fn(),
            fetchResults: jest.fn()
        }
    }
});

const requestBody = JSON.parse("{\"tabs\":[{\"code\":\"int main() {\\n  return 1 + 2;\\n}\\n\",\"compiler\":\"clang-11.0\",\"optim\":\"3\",\"cppVersion\":\"20\",\"lib\":\"gnu\",\"protocolVersion\":3,\"title\":\"math\"},{\"code\":\"int main() {\\n  return 3;\\n}\\n\",\"compiler\":\"clang-11.0\",\"optim\":\"3\",\"cppVersion\":\"20\",\"lib\":\"gnu\",\"protocolVersion\":3,\"title\":\"nomath\"}],\"result\":[{\"times\":[{\"user\":\"0.03\",\"kernel\":\"0.02\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.01\",\"kernel\":\"0.04\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.04\",\"kernel\":\"0.01\"},{\"user\":\"0.01\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.03\",\"kernel\":\"0.02\"},{\"user\":\"0.01\",\"kernel\":\"0.04\"},{\"user\":\"0.03\",\"kernel\":\"0.01\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.04\",\"kernel\":\"0.00\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.01\",\"kernel\":\"0.03\"},{\"user\":\"0.03\",\"kernel\":\"0.02\"}],\"memories\":[\"68396\",\"68748\",\"69132\",\"68696\",\"68944\",\"68920\",\"68980\",\"69004\",\"68944\",\"68368\",\"68924\",\"68640\",\"68384\",\"68464\",\"68380\",\"68480\",\"69072\",\"68888\",\"69044\",\"69156\"],\"inputs\":[\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\"],\"outputs\":[\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\"],\"pagefaults\":[{\"major\":\"1\",\"minor\":\"8654\"},{\"major\":\"1\",\"minor\":\"8662\"},{\"major\":\"1\",\"minor\":\"8665\"},{\"major\":\"1\",\"minor\":\"8658\"},{\"major\":\"1\",\"minor\":\"8673\"},{\"major\":\"1\",\"minor\":\"8660\"},{\"major\":\"1\",\"minor\":\"8676\"},{\"major\":\"1\",\"minor\":\"8673\"},{\"major\":\"1\",\"minor\":\"8668\"},{\"major\":\"1\",\"minor\":\"8653\"},{\"major\":\"1\",\"minor\":\"8672\"},{\"major\":\"1\",\"minor\":\"8663\"},{\"major\":\"1\",\"minor\":\"8656\"},{\"major\":\"1\",\"minor\":\"8663\"},{\"major\":\"1\",\"minor\":\"8658\"},{\"major\":\"1\",\"minor\":\"8654\"},{\"major\":\"1\",\"minor\":\"8673\"},{\"major\":\"1\",\"minor\":\"8657\"},{\"major\":\"1\",\"minor\":\"8677\"},{\"major\":\"1\",\"minor\":\"8671\"}]},{\"times\":[{\"user\":\"0.03\",\"kernel\":\"0.02\"},{\"user\":\"0.00\",\"kernel\":\"0.05\"},{\"user\":\"0.01\",\"kernel\":\"0.04\"},{\"user\":\"0.03\",\"kernel\":\"0.02\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.03\",\"kernel\":\"0.02\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.03\",\"kernel\":\"0.01\"},{\"user\":\"0.04\",\"kernel\":\"0.01\"},{\"user\":\"0.01\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.03\",\"kernel\":\"0.01\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.03\"},{\"user\":\"0.02\",\"kernel\":\"0.02\"},{\"user\":\"0.03\",\"kernel\":\"0.01\"}],\"memories\":[\"68432\",\"68692\",\"68240\",\"68452\",\"67940\",\"67904\",\"68404\",\"68420\",\"68792\",\"68112\",\"68308\",\"68528\",\"68456\",\"67956\",\"68140\",\"68344\",\"68652\",\"68448\",\"67804\",\"68476\"],\"inputs\":[\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\",\"8\"],\"outputs\":[\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\",\"24\"],\"pagefaults\":[{\"major\":\"1\",\"minor\":\"8658\"},{\"major\":\"1\",\"minor\":\"8655\"},{\"major\":\"1\",\"minor\":\"8643\"},{\"major\":\"1\",\"minor\":\"8656\"},{\"major\":\"1\",\"minor\":\"8646\"},{\"major\":\"1\",\"minor\":\"8632\"},{\"major\":\"1\",\"minor\":\"8654\"},{\"major\":\"1\",\"minor\":\"8657\"},{\"major\":\"1\",\"minor\":\"8668\"},{\"major\":\"1\",\"minor\":\"8657\"},{\"major\":\"1\",\"minor\":\"8652\"},{\"major\":\"1\",\"minor\":\"8659\"},{\"major\":\"1\",\"minor\":\"8655\"},{\"major\":\"1\",\"minor\":\"8653\"},{\"major\":\"1\",\"minor\":\"8642\"},{\"major\":\"1\",\"minor\":\"8654\"},{\"major\":\"1\",\"minor\":\"8651\"},{\"major\":\"1\",\"minor\":\"8654\"},{\"major\":\"1\",\"minor\":\"8642\"},{\"major\":\"1\",\"minor\":\"8655\"}]}],\"messages\":[\"\",\"\"],\"includes\":[\"\",\"\"],\"asm\":[\"\\t.text\\n\\t.file\\t\\\"math.cpp\\\"\\n\\t.globl\\tmain                            # -- Begin function main\\n\\t.p2align\\t4, 0x90\\n\\t.type\\tmain,@function\\nmain:                                   # @main\\n\\t.cfi_startproc\\n# %bb.0:\\n\\tmovl\\t$3, %eax\\n\\tretq\\n.Lfunc_end0:\\n\\t.size\\tmain, .Lfunc_end0-main\\n\\t.cfi_endproc\\n                                        # -- End function\\n\\t.section\\t\\\".linker-options\\\",\\\"e\\\",@llvm_linker_options\\n\\t.ident\\t\\\"clang version 11.0.1 (https:\/\/github.com\/llvm\/llvm-project.git 43ff75f2c3feef64f9d73328230d34dac8832a91)\\\"\\n\\t.section\\t\\\".note.GNU-stack\\\",\\\"\\\",@progbits\\n\\t.addrsig\\n\",\"\\t.text\\n\\t.file\\t\\\"nomath.cpp\\\"\\n\\t.globl\\tmain                            # -- Begin function main\\n\\t.p2align\\t4, 0x90\\n\\t.type\\tmain,@function\\nmain:                                   # @main\\n\\t.cfi_startproc\\n# %bb.0:\\n\\tmovl\\t$3, %eax\\n\\tretq\\n.Lfunc_end0:\\n\\t.size\\tmain, .Lfunc_end0-main\\n\\t.cfi_endproc\\n                                        # -- End function\\n\\t.section\\t\\\".linker-options\\\",\\\"e\\\",@llvm_linker_options\\n\\t.ident\\t\\\"clang version 11.0.1 (https:\/\/github.com\/llvm\/llvm-project.git 43ff75f2c3feef64f9d73328230d34dac8832a91)\\\"\\n\\t.section\\t\\\".note.GNU-stack\\\",\\\"\\\",@progbits\\n\\t.addrsig\\n\"],\"preprocessed\":[\"# 1 \\\"math.cpp\\\"\\n# 1 \\\"<built-in>\\\" 1\\n# 1 \\\"<built-in>\\\" 3\\n# 408 \\\"<built-in>\\\" 3\\n# 1 \\\"<command line>\\\" 1\\n# 1 \\\"<built-in>\\\" 2\\n# 1 \\\"math.cpp\\\" 2\\nint main() {\\n  return 1 + 2;\\n}\\n\",\"# 1 \\\"nomath.cpp\\\"\\n# 1 \\\"<built-in>\\\" 1\\n# 1 \\\"<built-in>\\\" 3\\n# 408 \\\"<built-in>\\\" 3\\n# 1 \\\"<command line>\\\" 1\\n# 1 \\\"<built-in>\\\" 2\\n# 1 \\\"nomath.cpp\\\" 2\\nint main() {\\n  return 3;\\n}\\n\"],\"id\":\"rgNRzFkDbTnPZ7AWX7lu51IL5o4\"}");

const someCompilers = [{ name: 'gcc-8.3', 'std': ['c++11', 'c++14', 'c++17'] }, { name: 'clang-10.1', 'std': ['c++11', 'c++14', 'c++1z', 'c++2a', 'c++2b'] }]

beforeEach(() => {
    Fetch.fetchId.mockClear();
});

it('doesnt load when there is no id', () => {
    const container = document.body.appendChild(document.createElement('div'));
    const div = createRoot(container);
    div.render(<React.StrictMode><Benchmark containers={DefaultSettings.allCompilers} /></React.StrictMode>);
    setTimeout(() => {
        expect(Fetch.fetchId.mock.calls.length).toBe(0);
        div.unmount();
    });
});

it('loads passed ids', () => {
    const container = document.body.appendChild(document.createElement('div'));
    const div = createRoot(container);
    div.render(<React.StrictMode><Benchmark id={'abcd'} containers={someCompilers} /></React.StrictMode>);
    setTimeout(() => {
        expect(Fetch.fetchId.mock.calls.length).toBe(1);
        expect(Fetch.fetchId.mock.calls[0][1]).toBe('abcd');
        let callback = Fetch.fetchId.mock.calls[0][2];
        callback(requestBody);
        div.unmount();
    });
});

it('displays button when no container is available', () => {
    const tree = renderer.create(<Benchmark containers={[]} />);

    expect(tree.toJSON()).toMatchSnapshot();
});

it('displays id', () => {
    const tree = renderer.create(<Benchmark id={'abcd'} containers={someCompilers} />);
    expect(Fetch.fetchId.mock.calls.length).toBe(1);
    expect(Fetch.fetchId.mock.calls[0][1]).toBe('abcd');
    let callback = Fetch.fetchId.mock.calls[0][2];
    callback(requestBody);

    expect(tree.toJSON()).toMatchSnapshot();
});

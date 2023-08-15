import React from 'react';
import {createRoot} from 'react-dom/client'
import DefaultSettings from 'components/DefaultSettings.js';

jest.mock("components/BashOutput.js", () => (props) => <mock-BashOutput {...props} />)

jest.mock('react-resize-detector', () => (props) => <mock-ResizeDetector {...props} />)

import Benchmark from './QuickBenchmark';

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
const requestBody = JSON.parse("{\"tab\":{\"code\":\"static void StringCreation(benchmark::State& state) {\\n  // Code inside this loop is measured repeatedly\\n  for (auto _ : state) {\\n    std::string created_string(\\\"hello\\\");\\n    // Make sure the variable is not optimized away by compiler\\n    benchmark::DoNotOptimize(created_string);\\n  }\\n}\\n// Register the function as a benchmark\\nBENCHMARK(StringCreation);\\n\\nstatic void StringCopy(benchmark::State& state) {\\n  // Code before the loop is not measured\\n  std::string x = \\\"hello\\\";\\n  for (auto _ : state) {\\n    std::string copy(x);\\n  }\\n}\\nBENCHMARK(StringCopy);\\n\",\"options\":{\"compiler\":\"clang-10.0\",\"optim\":\"3\",\"cppVersion\":\"c++20\",\"lib\":\"gnu\"},\"isAnnotated\":true,\"protocolVersion\":4},\"result\":{\"context\":{\"date\":\"2020-07-28 20:49:21\",\"host_name\":\"767db83f0ac2\",\"executable\":\"./bench\",\"num_cpus\":1,\"mhz_per_cpu\":2400,\"cpu_scaling_enabled\":false,\"caches\":[{\"type\":\"Data\",\"level\":1,\"size\":32768,\"num_sharing\":1},{\"type\":\"Instruction\",\"level\":1,\"size\":32768,\"num_sharing\":1},{\"type\":\"Unified\",\"level\":2,\"size\":262144,\"num_sharing\":1},{\"type\":\"Unified\",\"level\":3,\"size\":31457280,\"num_sharing\":1}],\"load_avg\":[0,0,0],\"library_build_type\":\"release\"},\"benchmarks\":[{\"name\":\"StringCreation\",\"cpu_time\":4.977504785737881},{\"name\":\"StringCopy\",\"cpu_time\":14.969946162155678},{\"name\":\"Noop\",\"cpu_time\":1}]},\"message\":\"\",\"id\":\"eP40RY6zDK-eJFdSSPBINa0apTM\",\"annotation\":\"----------- StringCreation\\n Percent |\\tSource code & Disassembly of bench for cpu-clock:pppH (3649 samples, percent: local period)\\n-----------------------------------------------------------------------------------------------------------\\n         :\\n         :\\n         :\\n         :            Disassembly of section .text:\\n         :\\n         :            0000000000211150 <StringCreation(benchmark::State&)>:\\n         :            _ZL14StringCreationRN9benchmark5StateE():\\n    0.00 :   211150: push   %rbp\\n    0.00 :   211151: push   %r15\\n    0.00 :   211153: push   %r14\\n    0.00 :   211155: push   %rbx\\n    0.00 :   211156: sub    $0x28,%rsp\\n    0.00 :   21115a: mov    %rdi,%r14\\n    0.00 :   21115d: mov    0x1a(%rdi),%bpl\\n    0.00 :   211161: mov    0x10(%rdi),%rbx\\n    0.00 :   211165: callq  211a90 <benchmark::State::StartKeepRunning()>\\n    0.00 :   21116a: test   %rbx,%rbx\\n    0.00 :   21116d: je     2111b6 <StringCreation(benchmark::State&)+0x66>\\n    0.00 :   21116f: test   %bpl,%bpl\\n    0.00 :   211172: jne    2111b6 <StringCreation(benchmark::State&)+0x66>\\n    0.00 :   211174: lea    0x18(%rsp),%r15\\n    0.00 :   211179: jmp    211186 <StringCreation(benchmark::State&)+0x36>\\n    0.00 :   21117b: nopl   0x0(%rax,%rax,1)\\n    0.03 :   211180: add    $0xffffffffffffffff,%rbx\\n    0.00 :   211184: je     2111b6 <StringCreation(benchmark::State&)+0x66>\\n    0.03 :   211186: mov    %r15,0x8(%rsp)\\n   20.44 :   21118b: movb   $0x6f,0x4(%r15)\\n   17.95 :   211190: movl   $0x6c6c6568,(%r15)\\n   20.33 :   211197: movq   $0x5,0x10(%rsp)\\n   19.95 :   2111a0: movb   $0x0,0x1d(%rsp)\\n   21.24 :   2111a5: mov    0x8(%rsp),%rdi\\n    0.03 :   2111aa: cmp    %r15,%rdi\\n    0.00 :   2111ad: je     211180 <StringCreation(benchmark::State&)+0x30>\\n    0.00 :   2111af: callq  246ab0 <operator delete(void*)@plt>\\n    0.00 :   2111b4: jmp    211180 <StringCreation(benchmark::State&)+0x30>\\n    0.00 :   2111b6: mov    %r14,%rdi\\n    0.00 :   2111b9: callq  211b70 <benchmark::State::FinishKeepRunning()>\\n    0.00 :   2111be: add    $0x28,%rsp\\n    0.00 :   2111c2: pop    %rbx\\n    0.00 :   2111c3: pop    %r14\\n    0.00 :   2111c5: pop    %r15\\n    0.00 :   2111c7: pop    %rbp\\n    0.00 :   2111c8: retq\\n----------- StringCopy\\n Percent |\\tSource code & Disassembly of bench for cpu-clock:pppH (1475 samples, percent: local period)\\n-----------------------------------------------------------------------------------------------------------\\n         :\\n         :\\n         :\\n         :            Disassembly of section .text:\\n         :\\n         :            00000000002111d0 <StringCopy(benchmark::State&)>:\\n         :            _ZL10StringCopyRN9benchmark5StateE():\\n    0.00 :   2111d0: push   %rbp\\n    0.00 :   2111d1: push   %r15\\n    0.00 :   2111d3: push   %r14\\n    0.00 :   2111d5: push   %r13\\n    0.00 :   2111d7: push   %r12\\n    0.00 :   2111d9: push   %rbx\\n    0.00 :   2111da: sub    $0x48,%rsp\\n    0.00 :   2111de: mov    %rdi,%r14\\n    0.00 :   2111e1: lea    0x18(%rsp),%rax\\n    0.00 :   2111e6: mov    %rax,0x8(%rsp)\\n    0.00 :   2111eb: movl   $0x6c6c6568,0x18(%rsp)\\n    0.00 :   2111f3: movw   $0x6f,0x1c(%rsp)\\n    0.00 :   2111fa: movq   $0x5,0x10(%rsp)\\n    0.00 :   211203: mov    0x1a(%rdi),%bl\\n    0.00 :   211206: mov    0x10(%rdi),%rbp\\n    0.00 :   21120a: callq  211a90 <benchmark::State::StartKeepRunning()>\\n    0.00 :   21120f: test   %rbp,%rbp\\n    0.00 :   211212: je     2112d0 <StringCopy(benchmark::State&)+0x100>\\n    0.00 :   211218: test   %bl,%bl\\n    0.00 :   21121a: jne    2112d0 <StringCopy(benchmark::State&)+0x100>\\n    0.00 :   211220: lea    0x38(%rsp),%r13\\n    0.00 :   211225: jmp    21123a <StringCopy(benchmark::State&)+0x6a>\\n    0.00 :   211227: nopw   0x0(%rax,%rax,1)\\n   13.22 :   211230: add    $0xffffffffffffffff,%rbp\\n    0.00 :   211234: je     2112d0 <StringCopy(benchmark::State&)+0x100>\\n    0.00 :   21123a: mov    %r13,0x28(%rsp)\\n    7.59 :   21123f: mov    0x8(%rsp),%r15\\n    0.00 :   211244: mov    0x10(%rsp),%rbx\\n    6.10 :   211249: test   %r15,%r15\\n    0.00 :   21124c: jne    211257 <StringCopy(benchmark::State&)+0x87>\\n    0.00 :   21124e: test   %rbx,%rbx\\n    0.00 :   211251: jne    2112fb <StringCopy(benchmark::State&)+0x12b>\\n    0.00 :   211257: mov    %r13,%r12\\n    8.88 :   21125a: cmp    $0x10,%rbx\\n    0.00 :   21125e: jb     211283 <StringCopy(benchmark::State&)+0xb3>\\n    0.00 :   211260: mov    %rbx,%rax\\n    0.00 :   211263: shr    $0x3e,%rax\\n    0.00 :   211267: jne    211305 <StringCopy(benchmark::State&)+0x135>\\n    0.00 :   21126d: lea    0x1(%rbx),%rdi\\n    0.00 :   211271: callq  246ac0 <operator new(unsigned long)@plt>\\n    0.00 :   211276: mov    %rax,%r12\\n    0.00 :   211279: mov    %rax,0x28(%rsp)\\n    0.00 :   21127e: mov    %rbx,0x38(%rsp)\\n    5.76 :   211283: test   %rbx,%rbx\\n    0.00 :   211286: je     2112ae <StringCopy(benchmark::State&)+0xde>\\n    0.00 :   211288: cmp    $0x1,%rbx\\n    0.00 :   21128c: jne    2112a0 <StringCopy(benchmark::State&)+0xd0>\\n    0.00 :   21128e: movzbl (%r15),%eax\\n    0.00 :   211292: mov    %al,(%r12)\\n    0.00 :   211296: jmp    2112ae <StringCopy(benchmark::State&)+0xde>\\n    0.00 :   211298: nopl   0x0(%rax,%rax,1)\\n   13.22 :   2112a0: mov    %r12,%rdi\\n    0.00 :   2112a3: mov    %r15,%rsi\\n    0.00 :   2112a6: mov    %rbx,%rdx\\n    0.00 :   2112a9: callq  246ad0 <memcpy@plt>\\n    0.00 :   2112ae: mov    %rbx,0x30(%rsp)\\n   29.49 :   2112b3: movb   $0x0,(%r12,%rbx,1)\\n    0.00 :   2112b8: mov    0x28(%rsp),%rdi\\n    6.98 :   2112bd: cmp    %r13,%rdi\\n    8.75 :   2112c0: je     211230 <StringCopy(benchmark::State&)+0x60>\\n    0.00 :   2112c6: callq  246ab0 <operator delete(void*)@plt>\\n    0.00 :   2112cb: jmpq   211230 <StringCopy(benchmark::State&)+0x60>\\n    0.00 :   2112d0: mov    %r14,%rdi\\n    0.00 :   2112d3: callq  211b70 <benchmark::State::FinishKeepRunning()>\\n    0.00 :   2112d8: mov    0x8(%rsp),%rdi\\n    0.00 :   2112dd: lea    0x18(%rsp),%rax\\n    0.00 :   2112e2: cmp    %rax,%rdi\\n    0.00 :   2112e5: je     2112ec <StringCopy(benchmark::State&)+0x11c>\\n    0.00 :   2112e7: callq  246ab0 <operator delete(void*)@plt>\\n    0.00 :   2112ec: add    $0x48,%rsp\\n    0.00 :   2112f0: pop    %rbx\\n    0.00 :   2112f1: pop    %r12\\n    0.00 :   2112f3: pop    %r13\\n    0.00 :   2112f5: pop    %r14\\n    0.00 :   2112f7: pop    %r15\\n    0.00 :   2112f9: pop    %rbp\\n    0.00 :   2112fa: retq\\n    0.00 :   2112fb: mov    $0x203c16,%edi\\n    0.00 :   211300: callq  246ae0 <std::__throw_logic_error(char const*)@plt>\\n    0.00 :   211305: mov    $0x204f3a,%edi\\n    0.00 :   21130a: callq  246af0 <std::__throw_length_error(char const*)@plt>\\n    0.00 :   21130f: jmp    211313 <StringCopy(benchmark::State&)+0x143>\\n    0.00 :   211311: jmp    211313 <StringCopy(benchmark::State&)+0x143>\\n    0.00 :   211313: mov    %rax,%rbx\\n    0.00 :   211316: lea    0x18(%rsp),%rax\\n    0.00 :   21131b: mov    0x8(%rsp),%rdi\\n    0.00 :   211320: cmp    %rax,%rdi\\n    0.00 :   211323: je     21132a <StringCopy(benchmark::State&)+0x15a>\\n    0.00 :   211325: callq  246ab0 <operator delete(void*)@plt>\\n    0.00 :   21132a: mov    %rbx,%rdi\\n    0.00 :   21132d: callq  246b00 <_Unwind_Resume@plt>\\n\"}");

const requestBodyNoAnnotV4 = JSON.parse("{\"tab\":{\"code\":\"static void StringCreation(benchmark::State& state) {\\n  // Code inside this loop is measured repeatedly\\n  for (auto _ : state) {\\n    std::string created_string(\\\"hello\\\");\\n    // Make sure the variable is not optimized away by compiler\\n    benchmark::DoNotOptimize(created_string);\\n  }\\n}\\n// Register the function as a benchmark\\nBENCHMARK(StringCreation);\\n\\nstatic void StringCopy(benchmark::State& state) {\\n  // Code before the loop is not measured\\n  std::string x = \\\"hello\\\";\\n  for (auto _ : state) {\\n    std::string copy(x);\\n  }\\n}\\nBENCHMARK(StringCopy);\\n\",\"options\":{\"compiler\":\"gcc-8.3\",\"optim\":\"2\",\"cppVersion\":\"17\",\"lib\":\"gnu\"},\"isAnnotated\":false,\"protocolVersion\":4},\"result\":{\"context\":{\"date\":\"2020-07-28 20:49:21\",\"host_name\":\"767db83f0ac2\",\"executable\":\"./bench\",\"num_cpus\":1,\"mhz_per_cpu\":2400,\"cpu_scaling_enabled\":false,\"caches\":[{\"type\":\"Data\",\"level\":1,\"size\":32768,\"num_sharing\":1},{\"type\":\"Instruction\",\"level\":1,\"size\":32768,\"num_sharing\":1},{\"type\":\"Unified\",\"level\":2,\"size\":262144,\"num_sharing\":1},{\"type\":\"Unified\",\"level\":3,\"size\":31457280,\"num_sharing\":1}],\"load_avg\":[0,0,0],\"library_build_type\":\"release\"},\"benchmarks\":[{\"name\":\"StringCreation\",\"cpu_time\":4.977504785737881},{\"name\":\"StringCopy\",\"cpu_time\":14.969946162155678},{\"name\":\"Noop\",\"cpu_time\":1}]},\"message\":\"\",\"id\":\"eP40RY6zDK-eJFdSSPBINa0apTM\"}");

const requestBodyNoAnnotV5 = JSON.parse("{\"tab\":{\"code\":\"static void StringCreation(benchmark::State& state) {\\n  // Code inside this loop is measured repeatedly\\n  for (auto _ : state) {\\n    std::string created_string(\\\"hello\\\");\\n    // Make sure the variable is not optimized away by compiler\\n    benchmark::DoNotOptimize(created_string);\\n  }\\n}\\n// Register the function as a benchmark\\nBENCHMARK(StringCreation);\\n\\nstatic void StringCopy(benchmark::State& state) {\\n  // Code before the loop is not measured\\n  std::string x = \\\"hello\\\";\\n  for (auto _ : state) {\\n    std::string copy(x);\\n  }\\n}\\nBENCHMARK(StringCopy);\\n\",\"options\":{\"compiler\":\"gcc-8.3\",\"optim\":\"2\",\"cppVersion\":\"17\",\"lib\":\"gnu\",\"flags\":[\"-fexperimental\"]},\"isAnnotated\":false,\"protocolVersion\":4},\"result\":{\"context\":{\"date\":\"2020-07-28 20:49:21\",\"host_name\":\"767db83f0ac2\",\"executable\":\"./bench\",\"num_cpus\":1,\"mhz_per_cpu\":2400,\"cpu_scaling_enabled\":false,\"caches\":[{\"type\":\"Data\",\"level\":1,\"size\":32768,\"num_sharing\":1},{\"type\":\"Instruction\",\"level\":1,\"size\":32768,\"num_sharing\":1},{\"type\":\"Unified\",\"level\":2,\"size\":262144,\"num_sharing\":1},{\"type\":\"Unified\",\"level\":3,\"size\":31457280,\"num_sharing\":1}],\"load_avg\":[0,0,0],\"library_build_type\":\"release\"},\"benchmarks\":[{\"name\":\"StringCreation\",\"cpu_time\":4.977504785737881},{\"name\":\"StringCopy\",\"cpu_time\":14.969946162155678},{\"name\":\"Noop\",\"cpu_time\":1}]},\"message\":\"\",\"id\":\"eP40RY6zDK-eJFdSSPBINa0apTM\"}");

const someCompilers = [{name:'gcc-8.3', 'std':['c++11', 'c++14', 'c++17'], 'flags':['-fexperimental', '-fother']}, {name:'clang-10.1', 'std':['c++11', 'c++14', 'c++1z', 'c++2a', 'c++2b']}]

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

it('displays id with annotations', () => {
    const tree = renderer.create(<Benchmark id={'abcd'} containers={someCompilers} />);
    expect(Fetch.fetchId.mock.calls.length).toBe(1);
    expect(Fetch.fetchId.mock.calls[0][1]).toBe('abcd');
    let callback = Fetch.fetchId.mock.calls[0][2];
    callback(requestBody);

    expect(tree.toJSON()).toMatchSnapshot();
});

it('displays id without annotations using protocol v4', () => {
    const tree = renderer.create(<Benchmark id={'abcd'} containers={someCompilers} />);
    expect(Fetch.fetchId.mock.calls.length).toBe(1);
    expect(Fetch.fetchId.mock.calls[0][1]).toBe('abcd');
    let callback = Fetch.fetchId.mock.calls[0][2];
    callback(requestBodyNoAnnotV4);

    expect(tree.toJSON()).toMatchSnapshot();
});

it('displays id without annotations', () => {
    const tree = renderer.create(<Benchmark id={'abcd'} containers={someCompilers} />);
    expect(Fetch.fetchId.mock.calls.length).toBe(1);
    expect(Fetch.fetchId.mock.calls[0][1]).toBe('abcd');
    let callback = Fetch.fetchId.mock.calls[0][2];
    callback(requestBodyNoAnnotV5);

    expect(tree.toJSON()).toMatchSnapshot();
});
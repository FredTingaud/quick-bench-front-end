
function compilerCeId(opt) {
    if (opt.compiler.startsWith('clang'))
        return 'clang' + opt.compiler.substr(6).replace('.', '') + '0';
    return 'g' + opt.compiler.substr(4).replace('.', '');
}

function optimCe(opt) {
    switch (opt.optim) {
        case 'G':
            return '-Og';
        case 'F':
            return '-Ofast';
        case 'S':
            return '-Os';
        default:
            return '-O' + opt.optim;
    }
}

function versionCe(opt) {
    switch (opt.cppVersion) {
        case '20':
            return '2a';
        case '17':
            return '1z';
        default:
            return opt.cppVersion;
    }
}

function b64UTFEncode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, v) {
        return String.fromCharCode(parseInt(v, 16));
    }));
}

function optionsCe(opt) {
    const cppVersion = '-std=c++' + versionCe(opt);
    return cppVersion + ' ' + optimCe(opt);
}

function openCodeInCE(texts, options) {
    let sessions = [].concat(texts).map((t, i) => ({
        "id": i,
        "language": "c++",
        "source": t,
        "compilers": [{
            "id": compilerCeId([].concat(options)[i]),
            "options": optionsCe([].concat(options)[i]),
            "libs": [{
                "name": "benchmark",
                "ver": "140"
            }]
        }]
    }));
    var clientstate = {
        "sessions": sessions
    };
    var link = window.location.protocol + '//godbolt.org/clientstate/' + b64UTFEncode(JSON.stringify(clientstate));
    window.open(link, '_blank');
}

export default {
    openCodeInCE: openCodeInCE
};

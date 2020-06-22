
function commonPrefixLength(s1, s2) {
    const L = s2.length;
    let i = 0;
    while (i < L && s1.charAt(i) === s2.charAt(i)) i++;
    return i;
}

function checkedCompiler(comp, compilers, defaultOptions) {
    if (!comp)
        return defaultOptions.compiler;
    if (compilers.indexOf(comp) > -1)
        return comp;
    // If we receive an unknown compiler version
    // We search the one that has the longest common prefix
    return compilers[compilers.reduce((best, x, i, arr) => commonPrefixLength(x, comp) >= commonPrefixLength(arr[best], comp) ? i : best, 0)];
}

function decodeHash(str) {
    try {
        let base64ascii = str.substr(1);
        if (base64ascii) {
            return JSON.parse(atob(base64ascii));
        }
    } catch (err) {
        console.error(err);
    }
    return false;
}

function getState(compilers, defaultOptions) {
    if (window.location.hash) {
        let state = [].concat(decodeHash(window.location.hash));
        window.location.hash = "";

        return state.filter(s => s.text).map((s, i) => ({
            text: s.text,
            title: s.title || `code ${i + 1}`,
            options: {
                compiler: checkedCompiler(s.compiler, compilers, defaultOptions)
                , cppVersion: s.cppVersion || defaultOptions.cppVersion
                , optim: s.optim || defaultOptions.optim
                , lib: s.lib || defaultOptions.lib
            }
        }));
    }

    return [];
}
export default {
    getState: getState
};

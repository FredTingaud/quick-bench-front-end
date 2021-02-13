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

function getState(defaultOptions) {
    if (window.location.hash) {
        let state = [].concat(decodeHash(window.location.hash));
        window.location.hash = "";

        return state.filter(s => s.text).map((s, i) => ({
            text: s.text,
            title: s.title || `code ${i + 1}`,
            options: {
                compiler: s.compiler || defaultOptions.compiler
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



function b64UTFEncode(str) {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function (match, v) {
        return String.fromCharCode(parseInt(v, 16));
    }));
}

export default {
    b64UTFEncode: b64UTFEncode
};

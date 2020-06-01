
const CHRISTMAS_PALETTE = [
    '#A22C27',
    '#4F2621',
    '#9F8241',
    '#7B8055',
    '#929867',
    '#4AA7A7',
    '#93B849',
    '#50362A',
    '#A80030',
    '#DDDDC2',
    '#BFD4B7',
    '#CA7560',
    '#D6D68B'
];

function index(i, nbColors, max) {
    if (nbColors < 4) {
        return Math.round(i * max / nbColors);
    }
    const count = Math.min(nbColors, max);
    const offset = count / 3;
    const pos = (i * offset) % count + i * offset / count;
    return Math.round(pos * max / count) % max;
}

function lighten(color, percent) {
    // taken from https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = (f >> 8) & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

export default {
    pickColor(i, nbColors, palette) {
        return palette[index(i, nbColors, palette.length)];
    },
    pickCSS(i, nbColors) {
        return 'linked-code-decoration-inline-' + index(i, nbColors, 12);
    },
    lighten: lighten,
    CHRISTMAS_PALETTE: CHRISTMAS_PALETTE
};

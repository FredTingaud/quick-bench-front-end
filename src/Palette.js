
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
    '#D6D68B',
];

function index(i, length) {
    if (length < 4) {
        return Math.round(i * PALETTE.length / length)
    }
    const count = Math.min(length, PALETTE.length);
    const offset = count / 3;
    const pos = (i * offset) % count + i * offset / count;
    return Math.round(pos * PALETTE.length / count) % PALETTE.length;
}

function lighten(color, percent) {
    // taken from https://github.com/PimpTrizkit/PJs/wiki/12.-Shade,-Blend-and-Convert-a-Web-Color-(pSBC.js)
    var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = (f >> 8) & 0x00FF, B = f & 0x0000FF;
    return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

export default {
    pickColor(i, length, special) {
        return special ? CHRISTMAS_PALETTE[index(i, length)] : PALETTE[index(i, length)];
    },
    pickCSS(i, length) {
        return 'linked-code-decoration-inline-' + index(i, length);
    },
    lighten: lighten
};

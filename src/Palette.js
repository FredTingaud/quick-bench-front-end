
const PALETTE = [
    "#5ed9cd",
    "#61d6eb",
    "#a1caf4",
    "#c7c0f4",
    "#eab3f4",
    "#f5b3d9",
    "#f5b5c0",
    "#f6b8a0",
    "#edc058",
    "#c4ce58",
    "#7ddc58",
    "#5bdca8"
];

const CHRISTMAS_PALETTE = [
    '#A22C27',
    '#4F2621',
    '#9F8241',
    '#EBD592',
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

export default {
    pickColor(i, length, special) {
        return special ? CHRISTMAS_PALETTE[index(i, length)] : PALETTE[index(i, length)];
    },
    pickCSS(i, length) {
        return 'linked-code-decoration-inline-' + index(i, length);
    }
};

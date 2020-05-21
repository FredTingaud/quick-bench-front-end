import React from 'react';
import Chart from 'chart.js';
import Palette from './Palette.js';
import { Button, Card, OverlayTrigger, Tooltip, Form, FormControl } from 'react-bootstrap';
import fileDownload from 'js-file-download';
import { GoDesktopDownload } from "react-icons/go";

class TimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: props.benchmarks,
            showNoop: false,
            chartStyle: 'Line',
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.benchmarks.length === 0 && this.chart) {
            this.destroyChart();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (!this.arrayEquals(this.props.benchmarks, prevProps.benchmarks) || (this.props.benchmarks.length > 0 && this.props.specialPalette !== prevProps.specialPalette) || this.props.chartIndex !== prevProps.chartIndex) {
            if (prevProps.benchmarks.length === 0) {
                this.createChart();
            }
            this.setState({ chart: this.props.benchmarks }, () => this.showChart());
        }
    }
    arrayEquals(a1, a2) {
        return (a1 === a2) || (a1.length === a2.length && JSON.stringify(a1) === JSON.stringify(a2));
    }
    createChart() {
        const ctx = document.getElementById('result-chart');

        const chartOptions = {
            title: {
                display: true,
                position: 'bottom'
            },
            legend: {
                display: true
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            scales: {
                yAxes: [{
                    id: 'linear',
                    ticks: {
                        beginAtZero: true
                    }
                },
                {
                    id: 'ystacks',
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    id: 'bar',
                    ticks: {
                        autoSkip: false
                    }
                }, {
                    id: 'xstacks',
                    stacked: true,
                    offset: true,
                    gridLines: {
                        offsetGridLines: true
                    },
                    ticks: {
                        autoSkip: false
                    }
                }, {
                    id: 'line',
                    type: 'linear'
                }
                ]
            }
        };
        this.chart = new Chart(ctx, {
            type: 'bar',
            options: chartOptions
        });
    }
    destroyChart() {
        this.chart.destroy();
        this.chart = null;
    }
    filterNoop(v) {
        return this.state.showNoop || v.x !== 'Noop';
    }
    valueCount() {
        return this.state.chart.length - (this.state.chart.some(v => v.x === 'Noop') ? 1 : 0);
    }
    showChart() {
        const length = this.valueCount();
        if (length > 0) {
            const input = this.state.chart.filter((v) => this.filterNoop(v));
            if (input.find(v => v.x.indexOf('/') > -1) && this.state.chartStyle === 'Line') {
                this.drawLineChart(input);
            } else {
                this.drawBarChart(input);
            }
        }
    }
    lighten(colors, i) {
        if (i === 0)
            return colors
        return colors.map(c => Palette.lighten(c, Math.pow(0.3, i)));
    }
    drawBarChart(input) {
        const property = [].concat(this.props.dataChoices[this.props.chartIndex].property);
        const length = this.valueCount();
        const names = input.map(v => v.x);
        const colors = input.map((v, i) => v.x === 'Noop' ? '#000' : Palette.pickColor(i, length, this.props.specialPalette));
        this.chart.data.labels = names;
        this.chart.data.datasets = property.map((p, i) => ({
            data: input.map(v => v[p]),
            backgroundColor: this.lighten(colors, i),
            type: 'bar',
            label: p,
            xAxisID: this.props.dataChoices[this.props.chartIndex].xaxis,
            yAxisID: this.props.dataChoices[this.props.chartIndex].yaxis
        }));
        this.chart.options.legend.display = false;
        this.chart.options.scales.xAxes.map(a => a.display = a.id === this.props.dataChoices[this.props.chartIndex].xaxis);
        this.chart.options.scales.yAxes.map(a => a.display = a.id === this.props.dataChoices[this.props.chartIndex].yaxis);
        this.chart.options.tooltips.callbacks.beforeBody = property.length > 1 ? this.sumCallback(input) : () => '';
        this.chart.options.tooltips.callbacks.afterBody = this.nameCallback(input);
        this.chart.options.title.text = this.props.dataChoices[this.props.chartIndex].title;

        this.chart.update();
        this.props.onNamesChange(names);
        this.props.onDescriptionChange(this.makeDescription(input));
    }
    sum(point, properties) {
        return properties.reduce((p, v) => p + point[v], 0);
    }
    sumCallback(input) {
        return (tooltipItem, data) => {
            const index = tooltipItem[0].index;
            return `total: ${this.sum(input[index], this.props.dataChoices[this.props.chartIndex].property)}`;
        };
    }
    nameCallback(input) {
        return (tooltipItem, data) => {
            const index = tooltipItem[0].index;
            const val = this.sum(input[index], [].concat(this.props.dataChoices[this.props.chartIndex].property));
            return [''].concat(input.filter((v, i) => i !== index).map(v => this.describe(val, this.sum(v, [].concat(this.props.dataChoices[this.props.chartIndex].property)), v.x)));
        };
    }

    joinNames(names) {
        return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    }
    drawLineChart(input) {
        let max;
        let min;
        let chartData = [];
        const horizontals = input.filter(v => v.x.indexOf('/') === -1);
        let functionNames = input.filter(v => v.x.indexOf('/') > -1).map(v => v.x.substring(0, v.x.indexOf('/'))).filter((v, i, a) => a.indexOf(v) === i);
        let names = input.filter(v => v.x.indexOf('/') > -1).map(v => v.x.substring(0, v.x.lastIndexOf('/'))).filter((v, i, a) => a.indexOf(v) === i);
        for (let i = 0; i < names.length; ++i) {
            let n = names[i];
            const times = input.filter(v => v.x.indexOf('/') > -1 && v.x.startsWith(n + '/')).map(v => ({ x: parseInt(v.x.substring(v.x.lastIndexOf('/') + 1), 10), y: v[this.props.dataChoices[this.props.chartIndex].property] }));
            const color = n === 'Noop' ? '#000' : Palette.pickColor(functionNames.indexOf(n.split('/')[0]), functionNames.length + horizontals.length, this.props.specialPalette);
            chartData.push({
                data: times,
                backgroundColor: color,
                borderColor: color,
                type: 'line',
                label: n,
                fill: false,
                xAxisID: 'line'
            });

            max = Math.max(...times.map(elt => elt.x));
            min = Math.min(...times.map(elt => elt.x));
        }
        names = names.concat(horizontals.map(v => v.x));
        functionNames = functionNames.concat(horizontals.map(v => v.x));
        for (let i = 0; i < horizontals.length; ++i) {
            let v = horizontals[i];
            const times2 = [{ x: min, y: v[this.props.dataChoices[this.props.chartIndex].property] }, { x: max, y: v[this.props.dataChoices[this.props.chartIndex].property] }];
            const colors2 = v.x === 'Noop' ? '#000' : Palette.pickColor(functionNames.indexOf(v.x), functionNames.length, this.props.specialPalette);
            chartData.push({
                data: times2,
                backgroundColor: colors2,
                borderColor: colors2,
                type: 'line',
                label: v.x,
                fill: false,
                xAxisID: 'line'
            });
        }
        this.chart.data.labels = names;
        this.chart.data.datasets = chartData;
        this.chart.options.scales.xAxes[0].display = false;
        this.chart.options.scales.xAxes[1].display = true;
        this.chart.update();
        this.props.onNamesChange(functionNames);
        this.props.onDescriptionChange(`Parametrized performances comparison of ${this.joinNames(names)}`);
    }
    dataURItoBlob(dataURI, type) {
        var byteString = atob(dataURI.split(',')[1]);
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        var bb = new Blob([ab], { type: type });
        return bb;
    }
    extractOpaqueImage() {
        const canvas = document.getElementById('result-chart');
        const w = canvas.width;
        const h = canvas.height;
        const context = canvas.getContext('2d');

        const compositeOperation = context.globalCompositeOperation;
        const data = context.getImageData(0, 0, w, h);

        context.globalCompositeOperation = 'destination-over';
        context.fillStyle = '#fff';
        context.fillRect(0, 0, w, h);

        const image = canvas.toDataURL('image/png');

        context.globalCompositeOperation = compositeOperation;
        context.clearRect(0, 0, w, h);
        context.putImageData(data, 0, 0);

        return image;
    }
    saveChart() {
        fileDownload(this.dataURItoBlob(this.extractOpaqueImage(), 'image/png'), this.props.id + '.png');
    }
    toggleNoop(e) {
        this.setState({ showNoop: e.target.checked }, () => this.showChart());
    }
    changeChartStyle(e) {
        this.props.changeDisplay(e.target.value);
    }
    describe(v1, v2, name) {
        if (v1 / v2 > 0.99 && v1 / v2 < 1.01)
            return `equivalent to ${name}`;
        if (v1 > v2)
            return `${(v1 / v2).toLocaleString(undefined, { maximumSignificantDigits: 2 })} times ${this.props.dataChoices[this.props.chartIndex].more} than ${name}`;
        return `${(v2 / v1).toLocaleString(undefined, { maximumSignificantDigits: 2 })} times ${this.props.dataChoices[this.props.chartIndex].less} than ${name}`;
    }
    makeDescription(r) {
        let start = `${r[0].x} is `;
        let val = r[0][this.props.dataChoices[this.props.chartIndex].property];
        let res = r.slice(1).map(v => this.describe(val, v[this.props.dataChoices[this.props.chartIndex].property], v.x));
        return start + res.slice(0, -1).join(', ') + (res.length > 1 ? ' and ' : '') + res[res.length - 1];
    }
    renderDisplayTypes() {
        if (this.props.dataChoices.length > 1) {
            return <FormControl as="select" className="pull-right" onChange={(e) => this.changeChartStyle(e)} defaultValue={this.props.dataChoices[this.props.chartIndex].name}>
                {this.props.dataChoices.map((d, i) => {
                    return <option value={i} key={d.name}>{d.name}</option>
                })}
            </FormControl>;
        }
        return null;
    }
    renderIfVisible() {
        const tooltip = <Tooltip id="tooltip-save">Download chart</Tooltip>;
        if (this.props.benchmarks.length) {
            return (
                <Card body className="my-2" >
                    < canvas id='result-chart' />
                    <Form inline>
                        <OverlayTrigger placement='bottom' overlay={tooltip}>
                            <Button variant="default" onClick={() => this.saveChart()} className="mr-2">
                                <GoDesktopDownload />
                            </Button>
                        </OverlayTrigger>
                        {this.renderDisplayTypes()}
                    </Form>
                </Card>
            );
        }
        return null;
    }
    render() {
        return (
            <div>
                {this.renderIfVisible()}
            </div>
        );
    }
}

export default TimeChart;

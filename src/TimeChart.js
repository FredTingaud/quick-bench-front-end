import React from 'react';
import Chart from 'chart.js';
import Palette from './Palette.js';
import { Button, Glyphicon, Panel, Checkbox, OverlayTrigger, Tooltip, Form, FormControl } from 'react-bootstrap';
import fileDownload from 'js-file-download';

class TimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: props.benchmarks,
            showNoop: false,
            chartStyle: 'Line'
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.benchmarks.length === 0 && this.chart) {
            this.destroyChart();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (!this.arrayEquals(this.props.benchmarks, prevProps.benchmarks)) {
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
                text: ['ratio (CPU time / Noop time)', 'Lower is faster'],
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
                    id: 'line',
                    type: 'linear'
                }]
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
        return this.state.showNoop || v.name !== 'Noop';
    }
    showChart() {
        const length = this.state.chart.length - 1;
        if (length > 0) {
            const input = this.state.chart.filter((v) => this.filterNoop(v));
            if (input.find(v => v.name.indexOf('/') > -1) && this.state.chartStyle === 'Line') {
                this.drawLineChart(input);
            } else {
                this.drawBarChart(input);
            }
        }
    }
    drawBarChart(input) {
        const length = this.state.chart.length - 1;
        const names = input.map(v => v.name);
        const times = input.map(v => v.cpu_time);
        const colors = input.map((v, i) => v.name === 'Noop' ? '#000' : Palette.pickColor(i, length));
        const chartData = [{
            data: times,
            backgroundColor: colors,
            type: 'bar',
            xAxisID: 'bar'
        }];
        this.chart.data.labels = names;
        this.chart.data.datasets = chartData;
        this.chart.options.legend.display = false;
        this.chart.options.scales.xAxes[0].display = true;
        this.chart.options.scales.xAxes[1].display = false;
        this.chart.options.tooltips.callbacks.afterBody = this.nameCallback(input);
        this.chart.update();
        this.props.onNamesChange(names);
        this.props.onDescriptionChange(this.makeDescription(input));
    }
    nameCallback(input) {
        return (tooltipItem, data) => {
            const index = tooltipItem[0].index;
            const val = input[index].cpu_time;
            return [''].concat(input.filter((v, i) => i !== index).map(v => this.describe(val, v.cpu_time, v.name)));
        };
    }

    joinNames(names) {
        return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
    }
    drawLineChart(input) {
        let max;
        let min;
        let chartData = [];
        const horizontals = input.filter(v => v.name.indexOf('/') === -1);
        let functionNames = input.filter(v => v.name.indexOf('/') > -1).map(v => v.name.substring(0, v.name.indexOf('/'))).filter((v, i, a) => a.indexOf(v) === i);
        let names = input.filter(v => v.name.indexOf('/') > -1).map(v => v.name.substring(0, v.name.lastIndexOf('/'))).filter((v, i, a) => a.indexOf(v) === i);
        for (let i = 0; i < names.length; ++i) {
            let n = names[i];
            const times = input.filter(v => v.name.indexOf('/') > -1 && v.name.startsWith(n + '/')).map(v => ({ x: parseInt(v.name.substring(v.name.lastIndexOf('/') + 1), 10), y: v.cpu_time }));
            const color = n === 'Noop' ? '#000' : Palette.pickColor(functionNames.indexOf(n.split('/')[0]), functionNames.length + horizontals.length);
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
        names = names.concat(horizontals.map(v => v.name));
        functionNames = functionNames.concat(horizontals.map(v => v.name));
        for (let i = 0; i < horizontals.length; ++i) {
            let v = horizontals[i];
            const times2 = [{ x: min, y: v.cpu_time }, { x: max, y: v.cpu_time }];
            const colors2 = v.name === 'Noop' ? '#000' : Palette.pickColor(functionNames.indexOf(v.name), functionNames.length);
            chartData.push({
                data: times2,
                backgroundColor: colors2,
                borderColor: colors2,
                type: 'line',
                label: v.name,
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
        this.setState({ chartStyle: e.target.value }, () => this.showChart());
    }
    renderIfParametric() {
        if (this.state.chart.find(v => v.name.indexOf('/') > -1)) {
            return <FormControl componentClass="select" className="pull-right" onChange={(e) => this.changeChartStyle(e)} defaultValue={this.state.chartStyle}>
                <option value="Bar">Bar</option>
                <option value="Line">Line</option>
            </FormControl>;
        }
        return null;
    }
    describe(v1, v2, name) {
        if (v1 / v2 > 0.99 && v1 / v2 < 1.01)
            return `equivalent to ${name}`;
        if (v1 > v2)
            return `${(v1 / v2).toLocaleString(undefined, { maximumSignificantDigits: 2})} times slower than ${name}`;
        return `${(v2 / v1).toLocaleString(undefined, { maximumSignificantDigits: 2 })} times faster than ${name}`;
    }
    makeDescription(r) {
        let start = `${r[0].name} is `;
        let val = r[0].cpu_time;
        let res = r.slice(1).map(v => this.describe(val, v.cpu_time, v.name));
        return start + res.slice(0, -1).join(', ') + (res.length > 1 ? ' and ' : '') + res[res.length - 1];
    }
    renderIfVisible() {
        const tooltip = <Tooltip id="tooltip-save">Download chart</Tooltip>;
        if (this.props.benchmarks.length) {
            return (
                <Panel>
                    < canvas id='result-chart' />
                    <Form inline>
                        <OverlayTrigger placement='bottom' overlay={tooltip}>
                            <Button onClick={() => this.saveChart()}>
                                <Glyphicon glyph='floppy-save' />
                            </Button>
                        </OverlayTrigger>
                        <Checkbox className="force-cb" inline checked={this.state.showNoop} onChange={(e) => this.toggleNoop(e)}>
                            Show Noop bar
                        </Checkbox>
                        {this.renderIfParametric()}
                    </Form>
                </Panel>
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

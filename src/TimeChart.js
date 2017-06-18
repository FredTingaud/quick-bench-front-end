import React from 'react';
import Chart from 'chart.js';
import Palette from './Palette.js';
import { Button, Glyphicon, Panel, Checkbox, OverlayTrigger, Tooltip } from 'react-bootstrap';
import fileDownload from 'react-file-download';

class TimeChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: props.benchmarks,
            showNoop: false
        };
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.benchmarks.length === 0 && this.chart) {
            this.destroyChart();
        }
    }
    arrayEquals(a1, a2) {
        return (a1 === a2) || (a1.length === a2.length && JSON.stringify(a1) === JSON.stringify(a2));
    }
    componentDidUpdate(prevProps, prevState) {
        if (!this.arrayEquals(this.props.benchmarks, prevProps.benchmarks)) {
            if (prevProps.benchmarks.length === 0) {
                this.createChart();
            }
            this.setState({ chart: this.props.benchmarks }, () => this.showChart());
        }
    }
    createChart() {
        const ctx = document.getElementById('result-chart');

        const chartOptions = {
            title: {
                display: true,
                text: 'ratio (CPU time / Noop time)',
                position: 'bottom'
            },
            legend: {
                display: false
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
        const length = this.state.chart.length - 1
        if (length > 0) {
            const input = this.state.chart.filter((v) => this.filterNoop(v));
            const names = input.map(v => v.name);
            const times = input.map(v => v.cpu_time);
            const colors = input.map((v, i) => v.name === 'Noop' ? '#000' : Palette.pickColor(i, length));
            const chartData = [{
                data: times,
                backgroundColor: colors
            }];
            this.chart.data.labels = names;
            this.chart.data.datasets = chartData;
            this.chart.update();
            this.props.onNamesChange(names);
        }
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
    renderIfVisible() {
        const tooltip = (
            <Tooltip id="tooltip-save">Download chart</Tooltip>
        );
        if (this.props.benchmarks.length) {
            return (
                <Panel>
                    < canvas id='result-chart' />
                    <OverlayTrigger placement='bottom' overlay={tooltip}>
                        <Button onClick={() => this.saveChart()}>
                            <Glyphicon glyph='floppy-save' />
                        </Button>
                    </OverlayTrigger>
                    <Checkbox className="force-cb" inline={true} checked={this.state.showNoop} onChange={(e) => this.toggleNoop(e)}>
                        Show Noop bar
                    </Checkbox>
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

import React from 'react';
import { Chart, LinearScale, CategoryScale, Tooltip as TT, Legend, Title, BarElement, BarController, LineElement, LineController, PointElement, Filler } from 'chart.js';
import { Button, Card, OverlayTrigger, Tooltip, Container, Row } from 'react-bootstrap';
import fileDownload from 'js-file-download';
import { GoDesktopDownload } from "react-icons/go";

Chart.register(LinearScale, CategoryScale, TT, Legend, Title, BarElement, BarController, LineElement, LineController, PointElement, Filler);

class TimeChart extends React.Component {
    componentDidMount() {
        if (this.props.data.length > 0) {
            this.createChart();
            this.showChart();
        }
    }
    componentDidUpdate(prevProps) {
        if (!this.arrayEquals(this.props.data, prevProps.data) || (this.props.data.length > 0 && this.props.palette !== prevProps.palette) || this.props.chartIndex !== prevProps.chartIndex) {
            if (prevProps.data.length === 0) {
                this.createChart();
            }
            this.showChart();
        }
        if (this.props.data.length === 0 && this.chart) {
            this.destroyChart();
        }
    }
    arrayEquals(a1, a2) {
        return (a1 === a2) || (a1.length === a2.length && JSON.stringify(a1) === JSON.stringify(a2));
    }
    createChart() {
        const ctx = document.getElementById('result-chart');

        const chartOptions = {
            plugins: {
                title: {
                    display: true,
                    position: 'bottom'
                },
                legend: {
                    display: true
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                linear: {
                    ticks: {
                        beginAtZero: true
                    },
                    axis: 'y',
                    display: 'auto'
                },
                ystacks: {
                    stacked: true,
                    ticks: {
                        beginAtZero: true
                    },
                    axis: 'y',
                    display: 'auto'
                },
                bar: {
                    ticks: {
                        autoSkip: false
                    },
                    axis: 'x',
                    display: 'auto'
                },
                xstacks: {
                    stacked: true,
                    offset: true,
                    gridLines: {
                        offsetGridLines: true
                    },
                    ticks: {
                        autoSkip: false
                    },
                    axis: 'x',
                    display: 'auto'
                },
                line: {
                    type: 'linear',
                    axis: 'x',
                    display: 'auto'
                }
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
    showChart() {
        const length = this.props.data.length;
        if (length > 0) {
            this.drawChart(this.props.data);
        }
    }
    drawChart() {
        this.chart.data.labels = this.props.labels;
        this.chart.data.datasets = this.props.dataLabels.map((l, i) => ({
            data: this.props.data[i],
            backgroundColor: this.props.colors[i],
            borderColor: this.props.colors[i],
            fill: this.props.fill,
            type: this.props.type || 'bar',
            label: l,
            xAxisID: this.props.xaxis,
            yAxisID: this.props.yaxis,
            tension: 0.4
        }));
        this.chart.options.plugins.legend.display = this.props.legend;
        this.chart.options.plugins.tooltip.callbacks.beforeBody = this.props.beforeTooltip ? this.sumCallback() : () => '';
        this.chart.options.plugins.tooltip.callbacks.afterBody = this.props.afterTooltip ? this.nameCallback() : () => '';
        this.chart.options.plugins.title.text = this.props.title;

        this.chart.update();
    }
    sum(data, index) {
        return data.reduce((p, v) => p + v[index], 0);
    }
    sumCallback() {
        return (tooltipItem, data) => {
            const index = tooltipItem[0].dataIndex;
            return `total: ${this.sum(this.props.data, index)}`;
        };
    }
    nameCallback() {
        return (tooltipItem, data) => {
            const index = tooltipItem[0].dataIndex;
            const val = this.sum(this.props.data, index);
            return [''].concat(this.props.labels.map((n, i) => i === index ? '' : this.describe(val, this.sum(this.props.data, i), n)).filter(s => s !== ''));
        };
    }

    joinNames(names) {
        return names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1];
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
    describe(v1, v2, name) {
        if (v1 / v2 > 0.99 && v1 / v2 < 1.01)
            return `equivalent to ${name}`;
        if (v1 > v2)
            return `${(v1 / v2).toLocaleString(undefined, { maximumSignificantDigits: 2 })} times ${this.props.more} than ${name}`;
        return `${(v2 / v1).toLocaleString(undefined, { maximumSignificantDigits: 2 })} times ${this.props.less} than ${name}`;
    }
    renderIfVisible() {
        const tooltip = <Tooltip id="tooltip-save">Download chart</Tooltip>;
        if (this.props.data.length) {
            return (
                <Card body className="my-2" >
                    < canvas id='result-chart' />
                    <Container fluid>
                        <Row xs="auto" className="align-items-center">
                            <OverlayTrigger placement='bottom' overlay={tooltip}>
                                <Button variant="default" onClick={() => this.saveChart()} className="me-2">
                                    <GoDesktopDownload className="center-icon" />
                                </Button>
                            </OverlayTrigger>
                            {this.props.children}
                        </Row>
                    </Container>
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

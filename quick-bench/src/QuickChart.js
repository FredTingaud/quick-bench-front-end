import React from 'react';
import TimeChart from 'components/TimeChart.js';
import Palette from 'components/Palette.js';
import { FormControl, FormCheck } from 'react-bootstrap';

class QuickChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showNoop: false,
            data: [],
            labels: [],
            colors: []
        };
    }
    isParametric(input) {
        let parametrized = input.filter(v => v.name.indexOf('/') > -1 && !isNaN(parseInt(v.name.substring(v.name.lastIndexOf('/') + 1), 10))).map(v => v.name.substring(0, v.name.lastIndexOf('/')));
        return parametrized.length > 0 && new Set(parametrized).size < parametrized.length;
    }
    isLine(input) {
        return this.props.index === 1 && this.isParametric(input);
    }
    drawLineChart(input) {
        let max = -Infinity;
        let min = Infinity;
        let chartData = [];
        const horizontals = input.filter(v => v.x.indexOf('/') === -1);
        let functionNames = input.filter(v => v.x.indexOf('/') > -1).map(v => v.x.substring(0, v.x.indexOf('/'))).filter((v, i, a) => a.indexOf(v) === i);
        let names = input.filter(v => v.x.indexOf('/') > -1).map(v => v.x.substring(0, v.x.lastIndexOf('/'))).filter((v, i, a) => a.indexOf(v) === i);
        for (let n of names) {
            const times = input.filter(v => v.x.indexOf('/') > -1 && v.x.startsWith(n + '/')).map(v => ({ x: parseInt(v.x.substring(v.x.lastIndexOf('/') + 1), 10), y: v.cpu_time }));
            chartData.push(times);
            max = Math.max(max, ...times.map(elt => elt.x));
            min = Math.min(min, ...times.map(elt => elt.x));
        }
        names = names.concat(horizontals.map(v => v.x));
        functionNames = functionNames.concat(horizontals.map(v => v.x));
        for (let v of horizontals) {
            const times2 = [{ x: min, y: v.cpu_time }, { x: max, y: v.cpu_time }];
            chartData.push(times2);
        }
        this.props.onNamesChange(functionNames);
        return [names, chartData];
    }
    makeData(bench) {
        if (!bench || bench.length === 0)
            return [[], []];
        const input = bench.filter(b => this.state.showNoop || b.name !== 'Noop').map(b => ({ x: b.name, cpu_time: b.cpu_time }));

        if (this.isLine(bench)) {
            return this.drawLineChart(input);
        } else {
            const names = input.map(v => v.x);
            this.props.onNamesChange(names);
            return [names, [input.map(v => v.cpu_time)]];
        }
    }

    toggleNoop(e) {
        this.setState({ showNoop: e.target.checked }, () => this.refreshState());
    }

    changeDisplay(e) {
        const i = parseInt(e.target.value);
        this.props.changeDisplay(i);
        this.setState({ index: i });
    }
    renderIfParametric() {
        if (this.isParametric(this.props.benchmarks)) {
            return <FormControl as="select" className="pull-right" onChange={(e) => this.changeDisplay(e)} defaultValue={this.props.index}>
                <option value="0">Bar</option>
                <option value="1">Line</option>
            </FormControl>;
        }
        return null;
    }
    refreshState() {
        const [labels, data] = this.makeData(this.props.benchmarks, this.props.titles, this.props.index);
        const length = this.state.showNoop ? labels.length - 1 : labels.length;
        const colors = labels.map((l, i) => l === 'Noop' ? '#000' : Palette.pickColor(i, length, this.props.palette));
        this.setState({ labels: labels, data: data, colors: colors });
    }
    componentDidMount() {
        if (this.props.benchmarks.length > 0) {
            this.refreshState();
        }
    }
    componentDidUpdate(prevProps) {
        if (prevProps.benchmarks !== this.props.benchmarks || prevProps.titles !== this.props.titles || prevProps.index !== this.props.index) {
            this.refreshState();
        }
    }
    render() {
        const isLine = this.isLine(this.props.benchmarks);
        return (
            <TimeChart
                id={this.props.id}
                data={this.state.data}
                labels={this.state.labels}
                dataLabels={isLine ? this.state.labels : ['cpu_time']}
                colors={isLine ? this.state.colors : [this.state.colors]}
                title={['ratio (CPU time / Noop time)', 'Lower is faster']}
                more={'slower'}
                less={'faster'}
                type={isLine ? 'line' : 'bar'}
                fill={!isLine}
                legend={isLine}
                xaxis={isLine ? 'line' : 'bar'}
                yaxis={'linear'}
                afterTooltip={!isLine}
            >

                <FormCheck className="force-cb" id="Noop" checked={this.state.showNoop} type="checkbox" onChange={(e) => this.toggleNoop(e)} label="Show Noop bar" />
                {this.renderIfParametric()}
            </TimeChart>
        );
    }
}

export default QuickChart;
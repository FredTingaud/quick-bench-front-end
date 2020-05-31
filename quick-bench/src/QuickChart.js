import React from 'react';
import TimeChart from 'components/TimeChart.js';

class QuickChart extends React.Component {
    makeBenchmarks(bench) {
        return bench.map(b => ({ x: b.name, cpu_time: b.cpu_time }));
    }
    render() {
        return (
            <TimeChart benchmarks={this.makeBenchmarks(this.props.benchmarks)}
                id={this.props.id}
                chartIndex={this.props.chartIndex}
                onNamesChange={n => this.props.onNamesChange(n)}
                onDescriptionChange={d => this.props.onDescriptionChange(d)}
                specialPalette={this.props.specialPalette}
                dataChoices={this.props.dataChoices}
                changeDisplay={d => this.props.changeDisplay(d)}
            />
        );
    }
}

export default QuickChart;
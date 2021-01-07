import React from 'react'
import {Line} from 'react-chartjs-2';
import {Empty} from "antd";

// Task Summary Chart
export default class TasksSummaryChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasksData: this.props.tasksData
        }
    }

    render() {
        // Chart data
        const data = {
            datasets: this.props.tasksData
        };

        // Chart options
        const options = {
            tooltips: {
                mode: 'nearest',
                intersect: false
            },
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear',
                    time: {
                        unit: 'day'
                    }
                }]
            },
            maintainAspectRatio: false // Keep chart responsive
        }

        return (
            <div style={{height: 300}}>
                {this.props.tasksData ? <Line data={data} options={options}/> : <Empty/>}
            </div>
        )
    }
}
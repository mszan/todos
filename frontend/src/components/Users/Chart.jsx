import React from 'react'
import moment from "moment";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { Line } from 'react-chartjs-2';


export default class TasksSummaryChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tasksData: this.props.tasksData
        }
    }
    render() {
        const data = {
            datasets: this.props.tasksData
        };

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
                }],
                yAxes: [{
                }]
            }
        }

        return (
            // A react-chart hyper-responsively and continuously fills the available
            // space of its parent element automatically
            <div
                style={{
                    // width: '400px',
                    minHeight: '300px',
                    margin: 5
                }}
            >
                {this.props.tasksData ? <Line data={data} options={options}/> : null}
            </div>
        )
    }
}
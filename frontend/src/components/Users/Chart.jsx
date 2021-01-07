import React from 'react'
import { Chart } from 'react-charts'
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
            // labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            datasets:
                // {
                //     label: 'My First dataset',
                //     backgroundColor: 'rgba(75,192,192,0.4)',
                //     borderColor: 'rgba(75,192,192,1)',
                //     borderCapStyle: 'butt',
                //     borderDash: [],
                //     borderDashOffset: 0.0,
                //     borderJoinStyle: 'miter',
                //     pointBorderColor: 'rgba(75,192,192,1)',
                //     pointBackgroundColor: '#fff',
                //     pointBorderWidth: 1,
                //     pointHoverRadius: 5,
                //     pointHoverBackgroundColor: 'rgba(75,192,192,1)',
                //     pointHoverBorderColor: 'rgba(220,220,220,1)',
                //     pointHoverBorderWidth: 2,
                //     pointRadius: 1,
                //     pointHitRadius: 10,
                //     data: [{
                //         x: new Date(),
                //         y: 1
                //     }, {
                //         t: new Date(),
                //         y: 10
                //     }]
                // }

                this.props.tasksData

                // [{
                //     "label":"addDate",
                //     "data":[
                //         {
                //             x: "2021-01-07T16:13:20.000Z",
                //             y: 5
                //         },
                //         {
                //             x: "2021-01-08T16:13:20.000Z",
                //             y: 55
                //         },
                //     ]
                // },{
                //     "label":"completeDate",
                //     "data":[
                //         {
                //             x: "2021-01-07T16:13:20.000Z",
                //             y: 25
                //         },
                //         {
                //             x: "2021-01-08T16:13:20.000Z",
                //             y: 10
                //         },
                //     ]
                //
                // }],
        };

        const options = {
            scales: {
                xAxes: [{
                    type: 'time',
                    distribution: 'linear',
                    time: {
                        unit: 'day'
                    }
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
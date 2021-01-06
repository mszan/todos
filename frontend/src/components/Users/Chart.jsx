import React from 'react'
import { Chart } from 'react-charts'
import moment from "moment";
import axios from "axios";
import authHeader from "../../services/auth-header";

export default function TasksSummaryChart(props) {
    const [tasksData, setTasksData] = React.useState({'addDate': [], 'completeDate': []})

    React.useEffect( () => {

        console.log(getData())
    }, [])

    const data = React.useMemo(
        () => [
            {
                label: 'TASKS',
                data: tasksData['addDate']
                // data: [[0, 1], [1, 2]]
            },
        ],
        []
    )

    // Get time range for chart.
    async function getData() {
        const today = moment()
        let registerDate = moment(props.user.registerDate)

        let finalData = {
            'addDate': [],
            'completeDate': []
        }

        // Loop every day since user was registered
        for (registerDate; registerDate.isBefore(today); registerDate.add(1, "days")) {
            // Loop every dateType
            for (const item of Object.keys(finalData)) {
                // Get data for specific dateType from server
                await axios.get(process.env.REACT_APP_API_URL + `tasks?${item}=${registerDate.format("YYYY-MM-DD")}`, {headers: authHeader()})
                    .then(response => {
                        finalData[item].push([registerDate.format("YYYY-MM-DD"), response.data.length])
                    })
            }
        }
        await setTasksData(finalData)
    }

    const axes = React.useMemo(
        () => [
            {primary: true, type: 'time', position: 'bottom'},
            {type: 'linear', position: 'left'}
        ],
        []
    )

    const getSeriesStyle = React.useCallback(
        () => ({
            transition: 'all .3s ease'
        }),
        []
    )
    const getDatumStyle = React.useCallback(
        () => ({
            transition: 'all .3s ease'
        }),
        []
    )

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
            <Chart
                data={data}
                axes={axes}
                tooltip
                getSeriesStyle={getSeriesStyle}
                getDatumStyle={getDatumStyle}
            />
        </div>
    )
}
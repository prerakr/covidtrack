import React, {useState, useEffect} from 'react';
import {fetchDailyData} from '../../api';

import {Line} from 'react-chartjs-2';

import styles from './Chart.module.css';

const Chart = ({data : {confirmed, recovered, deaths}, country}) => {
    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        const fetchAPI = async(country)=>{
           setDailyData(await fetchDailyData(country));
        }
        fetchAPI(country);
    }, [country]);

    const lineChart = (
        dailyData && dailyData.length !==0 ?
        <Line
            data={{
                labels: dailyData.map(({date}) => date),
                datasets: [{
                    data: dailyData.map(({confirmed})=>confirmed),
                    label: 'Infected',
                    borderColor: '#3333ff',
                    fill: true,
                },{
                    data: dailyData.map(({deaths})=>deaths),
                    label: 'Deaths',
                    borderColor: 'red',
                    backgroundColor:'rgba(255,0,0,0.5)',
                    fill: true,
                }],
            }}
        /> : null
    );
    // The 'country' prop is still used by useEffect to fetch the correct historical data.

    return(
        <div className={styles.container}>
        {lineChart}
        </div>
    )
}

export default Chart;
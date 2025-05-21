import React, {useState, useEffect} from 'react';
import {fetchDailyData} from '../../api';

import {Line,Bar} from 'react-chartjs-2';

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
    // barChart removed as per requirement to always show lineChart for historical data.
    // The 'data' prop (confirmed, recovered, deaths) is no longer used by this simplified Chart component.
    // The 'country' prop is still used by useEffect to fetch the correct historical data.

    return(
        <div className={styles.container}>
        {lineChart}
        </div>
    )
}

export default Chart;
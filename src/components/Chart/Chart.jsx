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

    // Sample data to reduce chart points for better performance
    const sampleData = (data, maxPoints = 100) => {
        if (data.length <= maxPoints) return data;
        
        const step = Math.ceil(data.length / maxPoints);
        return data.filter((_, index) => index % step === 0);
    };

    const sampledData = sampleData(dailyData, 100);

    const lineChart = (
        dailyData && dailyData.length !==0 ?
        <Line
            data={{
                labels: sampledData.map(({date}) => date),
                datasets: [{
                    data: sampledData.map(({confirmed})=>confirmed),
                    label: 'Infected',
                    borderColor: '#3333ff',
                    backgroundColor: 'rgba(51, 51, 255, 0.1)',
                    fill: true,
                    pointRadius: 1,
                    pointHoverRadius: 4,
                },{
                    data: sampledData.map(({deaths})=>deaths),
                    label: 'Deaths',
                    borderColor: 'red',
                    backgroundColor:'rgba(255,0,0,0.1)',
                    fill: true,
                    pointRadius: 1,
                    pointHoverRadius: 4,
                }],
            }}
            options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        type: 'category',
                        ticks: {
                            maxTicksLimit: 10,
                            maxRotation: 45,
                            minRotation: 0,
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Date'
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            callback: function(value) {
                                // Format large numbers with K/M notation
                                if (value >= 1000000) {
                                    return (value / 1000000).toFixed(1) + 'M';
                                } else if (value >= 1000) {
                                    return (value / 1000).toFixed(0) + 'K';
                                }
                                return value;
                            }
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Cases'
                        }
                    }]
                },
                elements: {
                    line: {
                        tension: 0.1
                    }
                },
                animation: {
                    duration: 1000
                },
                legend: {
                    display: true,
                    position: 'top'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(tooltipItem, data) {
                            const label = data.datasets[tooltipItem.datasetIndex].label || '';
                            const value = tooltipItem.yLabel;
                            return label + ': ' + value.toLocaleString();
                        }
                    }
                }
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
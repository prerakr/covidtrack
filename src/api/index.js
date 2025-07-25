import axios from 'axios';

const url = 'https://disease.sh/v3/covid-19';

export const fetchData = async(country) => {
    let changeableUrl = `${url}/all`;

    if(country){
        changeableUrl = `${url}/countries/${country}`
    }

    try{

        const {data: {cases, recovered, deaths, updated: lastUpdate }} = await axios.get(changeableUrl);

        return {
            confirmed: { value: cases },
            recovered: { value: recovered },
            deaths: { value: deaths },
            lastUpdate,
        };
        
    } catch(error){
        console.log(error);
        return { confirmed: null, recovered: null, deaths: null, lastUpdate: null }; // Return default object
    }


}

export const fetchDailyData = async(country) =>{
    try{
        let historicalDataUrl = `${url}/historical/all?lastdays=all`;
        if (country) {
            historicalDataUrl = `${url}/historical/${country}?lastdays=all`;
        }

        const { data } = await axios.get(historicalDataUrl);
        
        let cases, deaths;
        if (data.timeline) { // Country-specific data has a 'timeline' object
            cases = data.timeline.cases;
            deaths = data.timeline.deaths;
            // recovered = data.timeline.recovered; // Removed as it's not used
        } else { // Global data
            cases = data.cases;
            deaths = data.deaths;
            // recovered = data.recovered; // Removed as it's not used
        }

        if (!cases) { // If cases is undefined (e.g. country not found or no data)
            return []; // Return empty array to prevent errors in chart component
        }

        const modifiedData = Object.keys(cases).sort().map((date) => ({
        confirmed: cases[date],
        deaths: deaths[date],
        date: date,
        }));

        return modifiedData;
    }catch(error){
        console.log(error);
        return []; // Return empty array on error
    }
}

export const fetchCountries = async() =>{
try{
    const {data} = await axios.get(`${url}/countries`);

    return data.map((country) => country.country);

}catch(error){
    console.log(error);

}

}

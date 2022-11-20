const axios = require("axios");
require("core-js/actual/array/group-by");

const baseOptions = {
    method: 'GET',
    headers: {
        'X-RapidAPI-Key': process.env.API_KEY,
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
    }
}

module.exports = {
    table: (req, res) => {
        res.render('../views/table.ejs')
    },

    stats: async (req, res) => {
        try {
            const options = {
                ...baseOptions,
                url: 'https://covid-193.p.rapidapi.com/statistics',
            }
            const response = await axios.request(options)
            res.json({ 'data': response.data.response })
        } catch (error) {
            res.status(500).json({ 'message': JSON.stringify(error) })
        }
    },

    history: async (req, res) => {
        try {
            const options = {
                ...baseOptions,
                url: 'https://covid-193.p.rapidapi.com/history',
                params: { country: req.query.country, day: req.query.day },
            }
            const response = await axios.request(options)


            //Transform data to get hours
            let data = response.data.response.map(element => {
                return { ...element, hour: new Date(element.time).getUTCHours() }
            }).groupBy(element => {
                return element.hour
            })

            const hours = Object.keys(data)
            const vals = Object.values(data)

            const cases = vals.map(element => {
                return element.reduce((a, e) => a + e.cases.total, 0)
            })

            const deaths = vals.map(element => {
                return element.reduce((a, e) => a + e.deaths.total, 0)
            })

            const tests = vals.map(element => {
                return element.reduce((a, e) => a + e.tests.total, 0)
            })


            res.json({ 'labels': hours, 'cases': cases, 'deaths': deaths, 'tests': tests })
        } catch (error) {
            res.status(500).json({ 'message': JSON.stringify(error)  })
        }
    },

    graph: async (req, res) => {
        try {
            const options = {
                ...baseOptions,
                url: 'https://covid-193.p.rapidapi.com/countries',
            }
            const response = await axios.request(options)
            res.render('../views/graph.ejs', { 'countries': response.data.response })
        } catch (error) {
            res.status(500).json({ 'message': JSON.stringify(error)  })
        }
    }
}
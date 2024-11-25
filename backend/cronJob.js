const cron = require('node-cron')
const { fetchNews } = require('./newsRoute')

require('dotenv').config();


const scheduleCronJobs = ()=>{
    cron.schedule('0 10,14,20 * * *',async ()=>{
        console.log('Fetching News everyday at 10AM,2pm and 8PM')
        await fetchNews()
    })
}

module.exports = {scheduleCronJobs};


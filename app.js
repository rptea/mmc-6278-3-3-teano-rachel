require('dotenv').config()
const express = require('express')
const app = express()
// TODO: import the getCityInfo and getJobs functions from util.js
const { getCityInfo, getJobs } = require('./util');
// TODO: Statically serve the public folder
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
// TODO: declare the GET route /api/city/:city
// This endpoint should call getCityInfo and getJobs and return
// the result as JSON.
// The returned JSON object should have two keys:
// cityInfo (with value of the getCityInfo function)
// jobs (with value of the getJobs function)
// If no city info or jobs are found,
// the endpoint should return a 404 status
app.get('/api/city/:city', async (req, res) => {
    const city = (req.params.city || '').trim();

    const [cityInfoResult, jobsResult] = await Promise.allSettled([
        getCityInfo(city),
        getJobs(city),
    ]);

    const cityInfo = 
        cityInfoResult.status === 'fulfilled' && cityInfoResult.value
            ? cityInfoResult.value
            : false;

    const jobs = 
        jobsResult.status === 'fulfilled' && jobsResult.value
            ? jobsResult.value
            : false;
    
    if (!cityInfo && !jobs) {
        const errorMsg =
            (cityInfoResult.status === 'rejected' && cityInfoResult.reason?.message) || (jobsResult.status === 'rejected' && jobsResult.reason?.message) || 'Not found';
        return res.status(404).json({ error: errorMsg });
    }

    return res.status(200).json({ cityInfo, jobs });   
});


module.exports = app;

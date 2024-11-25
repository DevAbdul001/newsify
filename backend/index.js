const express = require('express');
const cors = require('cors');
const errorHandler = require('./errorHandler.js');
const userRoutes = require('./userRoute.js');
const newsRoutes = require('./newsRoute.js');
const newsGet = require('./news.js')
const categories = require('./categories.js')
const { scheduleCronJobs } = require('./cronJob.js')
require('dotenv').config({path:'app.env'});

const app = express();
const port = 3000;


app.use(cors());
app.use(express.json());

scheduleCronJobs();

app.get('/',(req,res)=>{
  res.send('Welcome to the API')
})

//use routes 
app.use('/signup',userRoutes)
app.use('/signin', userRoutes)
app.use('/news',newsRoutes)
app.use('/news',newsGet)
app.use('/news/category',categories)


//use global error handler
app.use(errorHandler)


app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
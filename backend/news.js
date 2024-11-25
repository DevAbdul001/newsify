const express = require('express')
const db = require('./db')

const router = express.Router()

router.get('/',(req,res)=>{
    
    const query = 'SELECT * FROM news ORDER BY published_at DESC';

    db.query(query,(err,results)=>{
        if(err){
            console.error('Error fetching news', err)
            return res.status(400).json({message:'Error fetching news'})
        }
        
        res.status(200).json(results)
    })
})



module.exports = router;
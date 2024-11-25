const express = require('express')
const crypto = require ('crypto')



function generateCommentIds(input){
    const timeStamp = Date.now().toString()
    const data = input + timeStamp

    const hash = crypto.createHash('sha256').update(data).digest('hex')
    return hash.substring(0,16)
}



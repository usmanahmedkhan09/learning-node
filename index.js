const express = require('express');
const app = express()
const port = 3000


app.use((req, res, next) =>
{
    console.log("Time", Date.now())
    next()
})


app.listen(port)    
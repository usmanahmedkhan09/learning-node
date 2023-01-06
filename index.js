const express = require('express');
const app = express()
const port = 3000

const myLogger = function (req, res, next)
{
    console.log('LOGGED', req)
    next()
}

app.use(myLogger)

app.get('/', (req, res) =>
{
    res.send('hello from app')
})


app.listen(port)
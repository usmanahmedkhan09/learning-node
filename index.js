const express = require('express');
const app = express()
const port = 3000


app.use('/user/:id', (req, res, next) =>
{
    console.log('Time', req.method)
    next()
}, (req, res, next) =>
{
    console.log('Time from second', req.params)
    next()
})


app.get('/user/:id', (req, res, next) =>
{
    res.send('hello from user')
})

app.listen(port)    
const express = require('express');
const app = express()
const port = 3000
// const birds = require('./birds')

// app.use('/birds', birds)

app.get('/', (req, res, next) =>
{
    console.log('called from one function')
    next()
}, (req, res) =>
{
    res.send('hello from second')
})












app.listen(port, () =>
{
    console.log(`listening on port ${port}`)
})
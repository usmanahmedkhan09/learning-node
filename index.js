const express = require('express');
const app = express()
const router = express.Router();
const port = 3000


// router.use((req, res, next) =>
// {
//     // console.log('hererrerer', req)
//     next()
// })

app.use((err, req, res, next) =>
{
    console.error(err.stack)
})


app.get('/', (req, res, next) =>
{
    res.status(500).send('network error')

})
app.listen(port)    
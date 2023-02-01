const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient


let _db;

const MongoConnect = (callback) =>
{

    MongoClient.connect(`mongodb+srv://usmanahmed:usman123@cluster0.ozm2t4m.mongodb.net/shop`)
        .then((client) =>
        {
            _db = client.db()
            callback(client)
        })
        .catch((error) => console.log(error));
}

const getDb = () =>
{
    if (_db)
    {
        return _db
    }
}
exports.MongoConnect = MongoConnect
exports.getDb = getDb;

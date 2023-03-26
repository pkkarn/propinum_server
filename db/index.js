const mongoose = require('mongoose');
require('dotenv').config();

const mongoConnection = `${process.env.MONGO_CONNECTION.replace('<password>', encodeURIComponent(process.env.MONGO_PASSWORD))}`;
// const mongoConnection = process.env.MONGO_CONNECTION;
async function connectDB() {
    mongoose.set("strictQuery", false);
    mongoose
        .connect(mongoConnection, {
        })
        .then((client) => {
            console.log('MongoDB Database is connected.')
        })
        .catch((error) => {
            console.error(error);
            try {
                mongoose.connection.close();
            }
            catch (err) {
                console.error(err);
            }
        });
    
    // mongoose.set('useFindAndModify', false);
    // mongoose.set('useCreateIndex', true);
}

module.exports = connectDB;
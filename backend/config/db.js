const mongoose = require('mongoose');

const connect = async () => {
    const mongoUri = process.env.MONGO_URI;
    console.log(mongoUri);

    if (!mongoUri) {
        console.error('MONGO_URI is not defined in environment variables.');
        process.exit(1);
    }

    try{
        await mongoose.connect(mongoUri);
        console.log("MongoDB connected successfully");
        console.log("Database:", mongoose.connection.name);
    }
    catch(error){
        console.error("MongoDB connection failed", error);
    }
}

module.exports = connect;
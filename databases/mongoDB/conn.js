import mongoose from 'mongoose'
import { MONGO_CONN } from '../../config.js'

const connectMongo = async () => {
    return mongoose.connect(MONGO_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }, (err)=>{
        if(err){
            console.log("Connection refused MongoDB: ",err.message)
            return
        }

        console.log("Connected to MongoDB")
    })
}

export { connectMongo }
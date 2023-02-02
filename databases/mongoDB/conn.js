import mongoose from 'mongoose'
import { MONGO_CONN } from '../../config.js'

const connectMongo = async () => {
    return mongoose.connect(MONGO_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

export { connectMongo }
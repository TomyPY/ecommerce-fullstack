import mongoose from 'mongoose'
import {MONGO_CONN} from '../../config.js'

const connectDB = async () => {
    return mongoose.connect(MONGO_CONN, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
}

export default connectDB
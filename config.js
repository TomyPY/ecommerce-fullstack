import {config} from 'dotenv'
config()

const persistenceType = 'firebase'
const MONGO_CONN = process.env.MONGO_CONN
const admin = true

export {MONGO_CONN, persistenceType, admin}
import admin from 'firebase-admin'
import fs from 'fs'
const serviceAccount = JSON.parse(fs.readFileSync('databases/firebase/ecommerce-api-rest-daa9a-firebase-adminsdk-bpfk3-dd48347f14.json'))

const connectFirebase = async()=>{
    try{
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: 'https://ecommerce-api-rest-daa98a.firebaseio.com'
        })
        console.log('Firebase connected')
    }catch(err){
        console.log(err)
        return false
    }
}

export {connectFirebase}
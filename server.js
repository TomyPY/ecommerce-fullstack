import express, { urlencoded } from 'express'
import url from 'url'
import path from 'path'

import cartsRoute from './routers/carts.js'
import productsRoute from './routers/products.js'
import {connectMongo} from './databases/mongoDB/conn.js'

const __dirname = url.fileURLToPath(new URL('.', import.meta.url)) 

const app = express()

//VARIABLES
app.set('PORT', process.env.PORT || 8080)

//EXPRESS CONFIG
app.use(express.json())
app.use(express.urlencoded({'extended':true}))
app.use(express.static(path.join(__dirname, '/public')))

//ENGINE
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'ejs')

//ROUTES
app.use('/public', express.static(path.join(__dirname, '/public')))
app.use('/api/cart', cartsRoute)
app.use('/api/products', productsRoute)
app.get('*', function(req, res){
    res.status(404).json({error:404, url:req.url, method:'GET', description:'Not found'});
  });


//STARTING SERVER
app.listen(app.get('PORT'), (err) => {

    if(err){
        console.log(`Error en el inicio del servidor: ${err}`)
        return
    }

    console.log(`Servidor escuchando el puerto ${app.get('PORT')}`)
 
})
connectMongo()


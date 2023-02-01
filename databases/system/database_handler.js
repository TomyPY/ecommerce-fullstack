import { Console } from 'console'
import fs from 'fs'

class Contenedor{

    constructor(file){

        this.file = file
        this.fileRedeable = JSON.parse(fs.readFileSync(this.file,'utf8'))
        this.products = this.fileRedeable['products']
        this.carts = this.fileRedeable['carts']
        this.admin = this.fileRedeable['admin']

    }


    async save(obj){

        obj._id =  this.products.length + 1
        obj.timestamp = new Date().getDate()

        this.products.push(obj)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err =>{
            if(err){
                console.log(err)
            }
        })

        return obj
    
    }

    getById(_id){

        let obj=this.products.find(x => {return x._id == parseInt(_id)})

        return obj

    }

    getAll(){
        return this.products
    }

    async updateById(_id, obj){

        let objIndex = this.products.findIndex(x => {return x._id == parseInt(_id)})

        if (objIndex == -1){
            return undefined
        }

        let oldProduct = this.products.map(element=>{
            if(element._id == _id){
                return element
            }
        })
        
        obj._id = _id
        obj.timestamp = oldProduct.timestamp

        this.products[objIndex] = obj

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err =>{
            if(err){
                console.log(err)
            }})

        
        return obj
        

    }

    async deleteById(_id){

        let index=this.products.findIndex(x => {return x._id == parseInt(_id)})
        
        if(index==-1){
            return undefined
        }

        let product = this.products[index]

        this.products.splice(index,1)
        
        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err =>{
            if(err){
                console.log(err)
            }})

        return product
        
    }

    async deleteAll(){

        await fs.promises.writeFile(this.file, JSON.stringify([]), err =>{
            if(err){
                console.log(err)
            }else{
                console.log("Object has been added!")
            }})
    }

    getAdmin(){
        return this.admin
    }

    async createCart(){

        this.carritos.push({_id:1, products:[]})

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err =>{
            if(err){
                console.log(err)
            }})

    }

    getCart(){

        if(this.carts.length <= 0 ){
            this.carts.push({_id:1, products:[]})
        }

        return this.carts[0]
    }

    async addToCart(_id, productId){

        let product = this.getById(productId)

        if(!product){
            return {ok:false, error:"Product doesn't exist"}
        }

        this.getCart(_id).products.push(product)

        await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err =>{
            if(err){
                console.log(err)
            }})

        return {ok:true, error:false}
    }

    async deleteCart(_id){
       try{
            let index = this.fileRedeable.carts.findIndex(x => {return x._id == parseInt(_id)})
            this.carts.splice(index,1)

            await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err =>{
                if(err){
                    console.log(err)
                }})

            return {ok:true, error:false}

        }catch(err){
            return {ok:false, error:err}
        }

    }

    async deleteProductCart(_id, productId){
        try{

            let index = this.fileRedeable.carts.findIndex(x => {return x._id == parseInt(_id)})
            let cart = this.carts[index].products

            let productIndex = cart.findIndex(x => {return x._id == parseInt(productId)})

            cart.splice(productIndex, 1)
            await fs.promises.writeFile(this.file, JSON.stringify(this.fileRedeable), err =>{
                if(err){
                    console.log(err)
                }})

            return {ok:true, error:false}

        }catch(err){
            console.log(err)
            return {ok:false, error:err}
        }

    }

}

const database = new Contenedor('database/MyFile.json')

export default database
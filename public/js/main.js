let deleteButtons = document.querySelectorAll('.btn-delete')
let shoppingCart = document.getElementsByClassName('cart-icon-container')[0]
let addButton = document.querySelectorAll('.product-button')
let cartCounter = document.getElementsByClassName('circle-counter')[0]
let deleteAll = document.getElementsByClassName('delete-all')[0]
let removeProduct = document.querySelectorAll('.product-button-remove')

if(shoppingCart){
    shoppingCart.addEventListener('click', ()=>{

        window.location.href = 'cart/products'
    
    })
}

if(addButton){
    addButton.forEach(element=>{

        element.addEventListener('click', async (e)=>{
    
            //OBTENGO EL ID DEL PRODUCTO
            let productId = e.target.dataset.id
    
            //SOLICITO LA CREACION DE UN CARRITO, EN CASO DE QUE YA EXISTA ME DEVUELVE EL ID DEL CARRITO EXISTENTE
            let res = await fetch('http://localhost:8080/api/cart', {method:'POST'})
            
            if(!res.ok){
                Toastify({
                    text: "There was an error creating the cart",
                    className: "info",
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    style: {
                      background: "linear-gradient(90deg, #ff6666, #ff1a1a)",
                    }
                  }).showToast();
            }
            
            let data = await res.json()
            
            //ENVIO EL ID DEL PRODUCTO
            res = await fetch(`http://localhost:8080/api/cart/${data._id}/products`, {method:'POST', headers:{'Accept':'application/json', 'Content-type':'application/json'}, body:JSON.stringify({_id:productId})})
            
            if(!res.ok){
                Toastify({
                    text: "There was an error sending the product to the cart",
                    className: "info",
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    style: {
                      background: "linear-gradient(90deg, #ff6666, #ff1a1a)",
                    }
                  }).showToast();
            }
    
            data = await res.json()

            
            if(!cartCounter.innerHTML){
                cartCounter.innerHTML = 1
            }else{
                cartCounter.innerHTML++
            }

            if(!data.ok){
                Toastify({
                    text: "There was an error sending the product to the cart",
                    className: "info",
                    gravity: "top", // `top` or `bottom`
                    position: "center", // `left`, `center` or `right`
                    style: {
                      background: "linear-gradient(90deg, #ff6666, #ff1a1a)",
                    }
                  }).showToast();
            }

            Toastify({
                text: "Product has been added!",
                className: "info",
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                style: {
                  background: "linear-gradient(90deg, #6ffc6f, #01e74e)",
                }
              }).showToast();
            
        })
            
    })
}

if(deleteButtons){
    deleteButtons.forEach(element =>{

        element.addEventListener('click', (e)=>{
    
            let _id = e.target.dataset.id
    
            deleteProduct(_id)
    
            window.location.reload()
    
        })
    
    })
}

if(deleteAll){
    deleteAll.addEventListener('click', async()=>{

        let res = await fetch('http://localhost:8080/api/cart/1', {method:'DELETE'})

        if(!res.ok){
            Toastify({
                text: "There was an error deleting the cart",
                className: "info",
                gravity: "top", // `top` or `bottom`
                position: "center", // `left`, `center` or `right`
                style: {
                  background: "linear-gradient(90deg, #ff6666, #ff1a1a)",
                }
              }).showToast();
        }

        window.location.replace('http://localhost:8080/api/products')        

    })
}


if(removeProduct){
    removeProduct.forEach(element=>{
        element.addEventListener('click', async(e)=>{
            let productId = e.target.dataset.id

            let res = await fetch(`http://localhost:8080/api/cart/1/products/${productId}`, {method:'DELETE'})

            if(!res.ok){
                console.log('There was an error deleting the product')
            }

            window.location.reload()

        })
    })
}
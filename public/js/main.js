let deleteAdminButtons = document.querySelectorAll('.btn-delete')
let shoppingCart = document.getElementsByClassName('cart-icon-container')[0]
let addButtonCart = document.querySelectorAll('.product-button')
let cartCounter = document.getElementsByClassName('circle-counter')[0]
let deleteAllProductsCart = document.getElementsByClassName('delete-all')[0]
let removeProduct = document.querySelectorAll('.product-button-remove')

//SHOPPING CART BUTTON
if(shoppingCart){
    shoppingCart.addEventListener('click', ()=>{

        window.location.href = 'cart/1/products'
    
    })
}

//ADD PRODUCT TO CART BUTTON
if(addButtonCart){
    addButtonCart.forEach(element=>{

        element.addEventListener('click', async (e)=>{
    
            //GET PRODUCT ID
            let productId = e.target.dataset.id
    
            //CREATE/GET CARTID
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
                  return
            }
            
            let data = await res.json()
            
            //ENVIO EL ID DEL PRODUCTO
            res = await fetch(`http://localhost:8080/api/cart/${data.cartId}/products`, {method:'POST', headers:{'Accept':'application/json', 'Content-type':'application/json'}, body:JSON.stringify({_id:productId})})
            
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
                  return
            }
    
            data = await res.json()

            if(!cartCounter.innerHTML){
                cartCounter.innerHTML = 1
            }else{
                cartCounter.innerHTML++
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

//DELETE ALL PRODUCTS FROM CART
if(deleteAllProductsCart){
    deleteAllProductsCart.addEventListener('click', async()=>{

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

//DELETE PRODUCT FROM CART
if(deleteAdminButtons){
    deleteAdminButtons.forEach(element =>{

        element.addEventListener('click', (e)=>{
    
            let _id = e.target.dataset.id
    
            deleteProduct(_id)
    
            window.location.reload()
    
        })
    
    })
}

//DELETE PRODUCT ADMIN
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


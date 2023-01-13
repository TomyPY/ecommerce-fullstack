let deleteProduct = async (_id) => {

    await fetch('http://localhost:8080/api/products/delete/' + _id, {method:'delete'})

}

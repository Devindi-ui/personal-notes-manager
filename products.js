function initApp(){
    if(!localStorage.getItem('products')){
        localStorage.setItem('products', JSON.stringify());
    }
}

function addProduct(e){
    e.preventDefault();

    const name = document.getElementById('productName').value;
    const qty = document.getElementById('productQty').value;
    const price = document.getElementById('productPrice').value;

    //create new product object
    const newProduct = {
        
    }
}
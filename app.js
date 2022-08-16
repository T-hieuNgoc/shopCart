
const $ = document.querySelector.bind(document)

const cartContainer = $('.cart-container')
const cartBtn = $('#cart-btn')

const delCartBtn = $('.cart-item-del-btn')

const productList = $('.product-list')

const coverProduct = $('.cover-product')
const coverProductImg = $('.cover-productImg' )
const closeShow = $('.closeShow')


const cartCountInfo = $('#cart-count-info')
const cartList = $('.cart-list')
const cartTotalValue = $('.cart-total-value')


let cartItemId = 1


evenListener()

function evenListener(){
    
    window.addEventListener('DOMContentLoaded', ()=>{
        loadJSON()
        loadCart()
    })

    const navMenu = document.querySelector('.navbar-toggler')
    const navbarCollapse = document.querySelector('.navbar-collapse')

    navMenu.addEventListener('click', ()=>{
        navbarCollapse.classList.toggle('show-navbar')
    })

    cartBtn.addEventListener('click', ()=>{
        cartContainer.classList.toggle('show-cart-container')
    })

    //add to cart
    productList.addEventListener('click', purchaseProduc)

    // zoom img
    productList.addEventListener('click', showImgbig)

    //delete from cart
    cartList.addEventListener('click', deleteProduct)

}


// update money cart info
function updateCartInfo(){
    let cartInfo = findCartInfo()
    // console.log(cartInfo);
    // gán số sản phẩm trong localStorage ra ngoài cart
    cartCountInfo.innerText = cartInfo.productCount
    cartTotalValue.innerText = cartInfo.total
}
updateCartInfo()

// load product item content from json file
function loadJSON(){
    fetch('shoes.json')
        .then(response => response.json())
        .then(data =>{
            let html = ''
            data.forEach((product, index) =>{
                // console.log(index);
                html +=`
                <div class="product-item">
                <div class="product-img">
                    <img src="${product.imgSrc}" alt="" onclick=" showImg()">
                    <button class="add-to-cart-btn">
                        <i class='bx bx-cart-alt'></i>
                        add to cart
                    </button>
                </div>

                <div class="product-content">
                    <h3 class="product-name">
                    ${product.name}
                    </h3>
                    <span class="product-category">${product.category}</span>
                    <p class="product-price">$${product.price}</p>
                </div>
            </div>
                `
            })
            productList.innerHTML = html
        })

        .catch(error =>{
            alert(`error server`)
    })
}

// click img product show img bigger
function showImg(){
    coverProduct.style.display = 'block'
}

// bắt vào thằng cha của product img
function showImgbig(e){
    if(e.target.closest('.product-img img')){
        let parentImg = e.target.parentElement
        // console.log(parentImg);
        getShowProduct(parentImg)
    }
}

//tự tạo info khi click  để render img
function getShowProduct(parentImg){
    let showPro={
        id: cartItemId,
        imgSrc: parentImg.querySelector('.product-img img').src
    }
    cartItemId++
    // console.log(showPro);
    addToScreen(showPro)
}

// render ra vị trí dc chọn
function addToScreen(product){

   let showpd= document.querySelector('.cover-product')
   let html =`
   
        <div class="product">
            <span class="closeShow">
            <i class='bx bx-x' onclick = "closeShowBtn()"></i>
            </span>
            <img src="${product.imgSrc}" alt="">
        </div>
   `
   showpd.innerHTML = html
}

function closeShowBtn(){
    coverProduct.style.display = 'none'
}





// purchase Product from the product list
function purchaseProduc(e){
    if(e.target.classList.contains('add-to-cart-btn')){
        let product = e.target.parentElement.parentElement
        getProduct(product)
    }
    // console.log(e.target.parentElement.parentElement);
}


// get product info after click add to cart
function getProduct(product){
    let productInfo ={
        id: cartItemId,
        imgSrc: product.querySelector('.product-img img').src,
        name: product.querySelector('.product-name').innerText,
        category: product.querySelector('.product-category').innerText,
        price: product.querySelector('.product-price').innerText,
    }
    cartItemId++ // increasing id for cart item
    // console.log(productInfo);
     addToCartList(productInfo)
     saveProductInStorage(productInfo)
}


// add the selected product into the cart list
function addToCartList(product){
    let cartItem = document.createElement('div')
    cartItem.classList.add('cart-item')
    cartItem.setAttribute('data-id', `${product.id}`)
    cartItem.innerHTML =`
        <img src="${product.imgSrc}" alt="">
        <div class="cart-item-info">
            <h3 class="cart-item-name">
                ${product.name}
            </h3>
            <span class="cart-item-category">
                ${product.category}
            </span>
            <span class="cart-item-price">
                ${product.price}
            </span>
        </div>
        <button class="cart-item-del-btn">
            <i class='bx bx-x'></i>
        </button>
    `
    cartList.appendChild(cartItem)
}
 

// save the product ih the local storage
function saveProductInStorage(item){
    let products = getProductFromStorage()
    // console.log(products);
    products.push(item)
    localStorage.setItem('products', JSON.stringify(products))
    updateCartInfo()
}

// get all product info if there is any in the local
// storage
function getProductFromStorage(){
    return localStorage.getItem('products') 
    ? JSON.parse(localStorage.getItem('products'))
    : []
}

// load carts products
function loadCart(){
    let products = getProductFromStorage()
    if(products.length < 1 ){
        cartItemId = 1//if there is no any product 
        //in the local storage
    }else{
        cartItemId = products[products.length - 1].id
        cartItemId++
    }
    // console.log(cartItemId);
    // render trực tiếp từ thằng localStorage nên khi load lại
    // trang thì nó sẽ lấy data từ localStorage
    products.forEach(product => addToCartList(product))

    //calculate and update UI of cart info
    updateCartInfo()
}


// calculate total price of the cart and other info
function findCartInfo(){
    let products = getProductFromStorage()
    // console.log(products);
    let total = products.reduce((acc, product)=>{
        let price = parseFloat(product.price.substr(1))
        // remove dollar sign
        return acc+= price
    }, 0)
    // console.log(total);
    return{
        total: total.toFixed(2),
        productCount: products.length,
    }
}   
// findCartInfo()

//delete product from cart list and local storage
function deleteProduct(e){
    let cartItem;
    if(e.target.tagName === "BUTTON"){
        cartItem = e.target.parentElement;
        cartItem.remove(); // this removes from the DOM only
    } else if(e.target.tagName === "I"){
        cartItem = e.target.parentElement.parentElement;
        cartItem.remove(); // this removes from the DOM only
    }

    let products = getProductFromStorage();
    let updatedProducts = products.filter(product => {
        return product.id !== parseInt(cartItem.dataset.id);
    });
    //updating
    localStorage.setItem('products', JSON.stringify(updatedProducts))
    console.log(products);
    console.log(updatedProducts);
    updateCartInfo()
}
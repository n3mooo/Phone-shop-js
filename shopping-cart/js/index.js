$(".btn-cart").click(function () {
    // If the clicked element has the active class, remove the active class from EVERY .btn-cart>.state element
    if ($(".cart").hasClass("active")) {
        $(".cart").removeClass("active");
        $(".header-icon-cart").removeClass("fa-xmark-large");
        $(".header-icon-cart").addClass("fa-cart-shopping");
        getEle("quality").style.display = "inline-block";
        total();
    }
    // Else, the element doesn't have the active class, so we remove it from every element before applying it to the element that was clicked
    else {
        $(".cart").removeClass("active");
        $(".cart").addClass("active");
        $(".header-icon-cart").removeClass("fa-cart-shopping");
        $(".header-icon-cart").addClass("fa-xmark-large");
        getEle("quality").style.display = "none";
    }
});

var productList = [];
var cartList = [];

function getEle(id) {
    return document.getElementById(id);
}

function total() {
    if (cartList.length === 0) {
        getEle("quality").style.display = "none";
        getEle("totalCart").style.visibility = "hidden";
        getEle("cart-list").innerHTML = `
            <span class="text-center d-flex h-100 justify-content-center align-items-center">
                It's empty.<br>Let buy something for you!
            </span>
        `;
    } else {
        getEle("quality").style.display = "inline-block";
        getEle("totalCart").style.visibility = "visible";
        var amount = 0;
        var totalCart = 0;
        for (let i = 0; i < cartList.length; i++) {
            amount += +cartList[i].qty;
            totalCart += +(cartList[i].price * cartList[i].qty);
        }
        getEle("quality").innerHTML = amount;
        getEle("valueTotal").innerHTML = totalCart;
    }
}
total();

// ---------------------Product function---------------------
function getListProducts() {
    axios({
        url: "https://62caa3003e924a01285c6589.mockapi.io/products",
        method: "GET",
    })
        .then(function (result) {
            renderProducts(result.data);
            productList = result.data;
            console.log(productList);
        })
        .catch(function (error) {
            console.log(error);
        });
}
getListProducts();

function renderProducts(data) {
    var contentHTML = "";

    for (let i = 0; i < data.length; i++) {
        contentHTML += `
        <div id="product-${i}" class="col-lg-3 col-md-6 col-sm-12">
            <div class="item">
                <div class="box-img">
                    <img
                        class="img-product"
                        src="${data[i].img}"
                        alt="${data[i].name}"
                    />
                    <div class="info text-end">
                        <i
                            class="fa-regular fa-circle-info"
                        ></i>
                        <div class="text-info">
                            <p class="screen">Screen: ${data[i].screen}</p>
                            <p class="backCam">Back Camera: ${data[i].backCamera}</p>
                            <p class="frontCam">Front Camera: ${data[i].frontCamera}</p>
                        </div>
                    </div>
                </div>

                <div class="text">
                    <h4 class="name">${data[i].name}</h4>
                    <p class="desc">${data[i].desc}</p>
                    <div class="footer-item">
                        <span class="price">$${data[i].price}</span>
                        <button
                            type="button"
                            class="add-to-cart"
                            onclick="addToCart('${i}')"
                        >
                            <div class="icon-cart">
                                <svg viewBox="0 0 24 19">
                                    <path
                                        d="M11.25 17C11.25 17.6904 10.6904 18.25 10 18.25C9.30964 18.25 8.75 17.6904 8.75 17C8.75 16.3096 9.30964 15.75 10 15.75C10.6904 15.75 11.25 16.3096 11.25 17Z"
                                        stroke-width="1.5 "
                                    />
                                    <path
                                        d="M19.25 17C19.25 17.6904 18.6904 18.25 18 18.25C17.3096 18.25 16.75 17.6904 16.75 17C16.75 16.3096 17.3096 15.75 18 15.75C18.6904 15.75 19.25 16.3096 19.25 17Z"
                                        stroke-width="1.5 "
                                    />
                                    <path
                                        d="M1 1H5L5.91304 4M5.91304 4L8.06853 11.0823C8.32483 11.9245 9.10161 12.5 9.98188 12.5H18.585C19.4329 12.5 20.1887 11.9653 20.471 11.1656L23 4H5.91304Z"
                                        stroke-width="2"
                                    />
                                </svg>
                            </div>
                            <span>Add to cart</span>
                            <svg
                                class="background"
                                viewBox="0 0 142 46"
                            >
                                <path
                                    d="M0 19C0 10.7157 6.71573 4 15 4H41.4599C53.6032 4 62.4844 4 72.5547 4C82.6251 4 91.5063 4 103.65 4H137C139.761 4 142 6.23858 142 9V31C142 39.2843 135.284 46 127 46H5C2.23858 46 0 43.7614 0 41V19Z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
    getEle("product-item").innerHTML = contentHTML;
}

function filterProduct() {
    axios({
        url: "https://62caa3003e924a01285c6589.mockapi.io/products",
        method: "GET",
    })
        .then(function (result) {
            productList = result.data;

            var filterList = [];
            var valueFilter = getEle("type-product").value.toLowerCase().trim();

            for (let i = 0; i < productList.length; i++) {
                var type = productList[i].type.toLowerCase().trim();

                if (type === valueFilter) {
                    filterList.push(productList[i]);
                    renderProducts(filterList);
                    console.log(filterList);
                }

                if (valueFilter === "all") {
                    getListProducts();
                }
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

// -----------------------Local Storage----------------------
function saveLocalStorage() {
    var cartListJSON = JSON.stringify(cartList);
    localStorage.setItem("list", cartListJSON);
}

function getLocalStorage() {
    var cartListJSON = localStorage.getItem("list");
    if (!cartListJSON) return;

    cartList = JSON.parse(cartListJSON);

    renderCart(cartList);
    total();
}
getLocalStorage();

// ------------------------Cart function---------------------
function renderCart(cartList) {
    var contentHTML = "";

    for (let i = 0; i < cartList.length; i++) {
        contentHTML += `
        <div class="cart-product text-start">
            <div class="img-cart">
                <img
                    src="${cartList[i].img}"
                    alt=""
                />
            </div>
            <div class="text">
                <h5>${cartList[i].name}</h5>
                <div
                    class="d-flex flex-row align-items-center justify-content-between"
                >
                    <span>${cartList[i].price}$
                            <button type="button" class="btn" onclick="decrement('${i}')">-</button>
                            <input
                                id="totalProduct-${i}"
                                onchange="changeQty(${i})"
                                value="${cartList[i].qty}"
                            />
                            <button type="button" class="btn" onclick="increment('${i}')">+</button>
                    </span>
                    
                    <button
                        type="button"
                        class="btn btn-danger btn-delete text-end"
                        onclick="deleteCart('${i}')"
                    >
                        <i
                            class="fa-regular fa-trash"
                        ></i>
                    </button>
                </div>
            </div>
        </div>
        `;
    }
    getEle("cart-list").innerHTML = contentHTML;
}

function addToCart(index) {
    var search = cartList.find((x) => x.index === index);

    if (search === undefined) {
        cartList.push({
            index: index,
            name: productList[index].name,
            price: productList[index].price,
            img: productList[index].img,
            qty: 1,
        });
    } else {
        search.qty += 1;
    }

    renderCart(cartList);
    saveLocalStorage();
    total();

    $(".cart").hasClass("active") ? getEle("quality").style.display = "none" : getEle("quality").style.display = "inline-block";
}

function increment(index) {
    cartList[index].qty += 1;

    renderCart(cartList);
    saveLocalStorage();
    total();
    getEle("quality").style.display = "none";
}

function decrement(index) {
    if (cartList[index].qty === 1) {
        deleteCart(search.index);
    } else {
        cartList[index].qty -= 1;
    }

    renderCart(cartList);
    saveLocalStorage();
    total();
    getEle("quality").style.display = "none";
}

function changeQty(index) {
    var totalProduct = +getEle(`totalProduct-${index}`).value;

    cartList[index].qty = totalProduct;
    renderCart(cartList);
    saveLocalStorage();
    total();
    getEle("quality").style.display = "none";
}

function deleteCart(index) {
    cartList.splice(index, 1);
    renderCart(cartList);
    saveLocalStorage();
    total();
    getEle("quality").style.display = "none";
}

function purchaseCart() {
    cartList.length == 0
        ? alert("Your cart is empty")
        : alert("Your order has been placed");
    clearCart();
}

function clearCart() {
    cartList.length = 0;
    renderCart(cartList);
    total();
    saveLocalStorage();
}

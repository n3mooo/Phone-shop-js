function getEle(id) {
    return document.getElementById(id);
}

function getListProduct() {
    axios({
        url: "https://62caa3003e924a01285c6589.mockapi.io/products",
        method: "GET",
    })
        .then((result) => {
            renderProducts(result.data);
        })
        .catch((error) => {
            console.log(error);
        });
}
getListProduct();

function renderProducts(data) {
    var contentHTML = "";

    for (let i = 0; i < data.length; i++) {
        contentHTML += `
        <tr>
            <td class="text">${i + 1}</td>
            <td>
                <img
                    src="${data[i].img}"
                    class="avatar me-3"
                    alt="user1"
                />
            </td>
            <td>
                <h6 class="mb-0 text2">
                    ${data[i].name}
                </h6>
            </td>
            <td class="text">${data[i].price} $</td>
            <td class="text">${data[i].screen}</td>
            <td class="text" style="width: 15%;">
                ${data[i].backCamera}
            </td>
            <td class="text">${data[i].frontCamera}</td>
            <td class="text">
                ${data[i].desc}
            </td>
            <td class="text">${data[i].type}</td>
            <td class="text">
                <button
                    type="button"
                    class="btn-edit text"
                    onclick="getProduct(${data[i].id})"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="btn-delete text"
                    onclick="deleteProduct(${data[i].id})"
                >
                    Delete
                </button>
            </td>
        </tr>
        `;
    }
    getEle("productList").innerHTML = contentHTML;
}

function createProduct() {
    var isValid = validateForm();
    if (!isValid) return;

    var prodName = getEle("prodName").value;
    var prodPrice = getEle("prodPrice").value;
    var prodScreen = getEle("prodScreen").value;
    var prodBackCam = getEle("prodBackCam").value;
    var prodFrontCam = getEle("prodFrontCam").value;
    var prodImg = getEle("prodImg").value;
    var prodDesc = getEle("prodDesc").value;
    var prodType = getEle("prodType").value;

    var product = new Product(
        prodName,
        prodPrice,
        prodScreen,
        prodBackCam,
        prodFrontCam,
        prodImg,
        prodDesc,
        prodType
    );

    axios({
        url: "https://62caa3003e924a01285c6589.mockapi.io/products",
        method: "POST",
        data: product,
    })
        .then((result) => {
            console.log(result.data);
            getListProduct();
            getEle("btnCloseModal").click();
        })
        .catch((error) => {
            console.log(error);
        });
}

function deleteProduct(id) {
    axios({
        url: "https://62caa3003e924a01285c6589.mockapi.io/products/" + id,
        method: "DELETE",
    })
        .then(function (result) {
            console.log(result.data);
            alert("Delete Success");
            getListProduct();
        })
        .catch(function (error) {
            console.log(error);
        });
}

function getProduct(id) {
    axios({
        url: "https://62caa3003e924a01285c6589.mockapi.io/products/" + id,
        method: "GET",
    })
        .then(function (result) {
            getEle("btnAddProd").click();

            getEle("productId").value = result.data.id;
            getEle("prodName").value = result.data.name;
            getEle("prodPrice").value = result.data.price;
            getEle("prodScreen").value = result.data.screen;
            getEle("prodBackCam").value.value = result.data.backCamera;
            getEle("prodFrontCam").value = result.data.frontCamera;
            getEle("prodImg").value = result.data.img;
            getEle("prodDesc").value = result.data.desc;
            getEle("prodType").value = result.data.type;

            getEle("btnAdd").style.display = "none";
            getEle("btnUpdate").style.display = "block";
        })
        .catch(function (error) {
            console.log(error);
        });
}

function updateProduct() {
    var isValid = validateForm();
    if (!isValid) return;

    var prodId = getEle("productId").value;
    var prodName = getEle("prodName").value;
    var prodPrice = getEle("prodPrice").value;
    var prodScreen = getEle("prodScreen").value;
    var prodBackCam = getEle("prodBackCam").value;
    var prodFrontCam = getEle("prodFrontCam").value;
    var prodImg = getEle("prodImg").value;
    var prodDesc = getEle("prodDesc").value;
    var prodType = getEle("prodType").value;

    var product = new Product(prodName, prodPrice, prodScreen, prodBackCam, prodFrontCam, prodImg, prodDesc, prodType);

    axios({
        url:
            "https://62caa3003e924a01285c6589.mockapi.io/products/" + prodId,
        method: "PUT",
        data: product,
    })
        .then(function (result) {
            getEle("btnReset").click();
            getEle("btnAdd").style.display = "block";
            getEle("btnUpdate").style.display = "none";
            getEle("btnCloseModal").click();

            alert("Cập nhật thành công");
            getListProduct();
        })
        .catch(function (error) {
            console.log(error);
        });
}

// ---------------VALIDATION-----------------
function validateForm() {
    var isValid = true;

    var prodName = getEle("prodName").value;
    var prodPrice = getEle("prodPrice").value;
    var prodScreen = getEle("prodScreen").value;
    var prodBackCam = getEle("prodBackCam").value;
    var prodFrontCam = getEle("prodFrontCam").value;
    var prodImg = getEle("prodImg").value;
    var prodDesc = getEle("prodDesc").value;
    var prodType = getEle("prodType").value;

    isValid &= checkRequired(prodName, "spanName");
    isValid &= checkRequired(prodPrice, "spanPrice") && checkNumber(prodPrice, "spanPrice");
    isValid &= checkRequired(prodScreen, "spanScreen");
    isValid &= checkRequired(prodBackCam, "spanBackCam");
    isValid &= checkRequired(prodFrontCam, "spanFrontCam");
    isValid &= checkRequired(prodImg, "spanImg");
    isValid &= checkRequired(prodDesc, "spanDesc");
    isValid &= checkRequired(prodType, "spanType");

    return isValid;
}

function checkRequired(val, spanId) {
    if (val.length > 0) {
        document.getElementById(spanId).innerHTML = "";
        return true;
    }
    document.getElementById(spanId).innerHTML = "* This field is required";
    return false;
}

function checkNumber(val, spanId) {
    var letter = /^[0-9]+$/;
    if (val.match(letter)) {
        document.getElementById(spanId).innerHTML = "";
        return true;
    }
    document.getElementById(spanId).innerHTML = "* Please enter the correct format score";
    return false;
}

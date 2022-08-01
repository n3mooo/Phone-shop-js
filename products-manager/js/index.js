function getEle(id) {
    return document.getElementById(id);
}

function resetEle() {
    getEle("btnAdd").style.display = "block";
    getEle("btnUpdate").style.display = "none";
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
            <td class="text">
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
    var isOk = isValidate.find((x) => x === false);
    if (isOk === undefined) {
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
                getEle("btnReset").click();
                getEle("btnCloseModal").click();
                getListProduct();
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        alert("Please check the product information again !!");
    }
}

function deleteProduct(id) {
    if (confirm("Are you sure you want to delete this product?")) {
        axios({
            url: "https://62caa3003e924a01285c6589.mockapi.io/products/" + id,
            method: "DELETE",
        })
            .then(function (result) {
                getListProduct();
            })
            .catch(function (error) {
                alert("Delete failed");
                console.log(error);
            });
    }
}

function getProduct(id) {
    isValidate = [true, true, true, true, true, true, true, true];
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
            getEle("prodBackCam").value = result.data.backCamera;
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
    var isOk = isValidate.find((x) => x === false);
    if (isOk === undefined) {
        var prodId = getEle("productId").value;
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
            url: "https://62caa3003e924a01285c6589.mockapi.io/products/" + prodId,
            method: "PUT",
            data: product,
        })
            .then(function (result) {
                getEle("btnReset").click();
                getEle("btnAdd").style.display = "block";
                getEle("btnUpdate").style.display = "none";
                getEle("btnCloseModal").click();

                getListProduct();
            })
            .catch(function (error) {
                alert("Update failed");
                console.log(error);
            });
    } else {
        alert("Please check the product information again !!");
    }
}

// ----------- Validation---------------------
var isValidate = [false, false, false, false, false, false, false, false];

getEle("prodName").addEventListener("focusout", () => {
    if (getEle("prodName").value.length > 0) {
        getEle("spanName").innerHTML = "";
        isValidate[0] = true;
    } else {
        getEle("spanName").innerHTML = "* This field is required";
        isValidate[0] = false;
    }
});

getEle("prodPrice").addEventListener("focusout", () => {
    var letter = /^[0-9]+$/;
    if (getEle("prodPrice").value.length === 0) {
        getEle("spanPrice").innerHTML = "* This field is required";
        isValidate[1] = false;
    } else if (!getEle("prodPrice").value.match(letter)) {
        getEle("spanPrice").innerHTML = "* Please enter the correct format score";
        isValidate[1] = false;
    } else {
        getEle("spanPrice").innerHTML = "";
        isValidate[1] = true;
    }
});

getEle("prodScreen").addEventListener("focusout", () => {
    if (getEle("prodScreen").value.length > 0) {
        getEle("spanScreen").innerHTML = "";
        isValidate[2] = true;
    } else {
        getEle("spanScreen").innerHTML = "* This field is required";
        isValidate[2] = false;
    }
});

getEle("prodBackCam").addEventListener("focusout", () => {
    if (getEle("prodBackCam").value.length > 0) {
        getEle("spanBackCam").innerHTML = "";
        isValidate[3] = true;
    } else {
        getEle("spanBackCam").innerHTML = "* This field is required";
        isValidate[3] = false;
    }
});

getEle("prodFrontCam").addEventListener("focusout", () => {
    if (getEle("prodFrontCam").value.length > 0) {
        getEle("spanFrontCam").innerHTML = "";
        isValidate[4] = true;
    } else {
        getEle("spanFrontCam").innerHTML = "* This field is required";
        isValidate[4] = false;
    }
});

getEle("prodDesc").addEventListener("focusout", () => {
    if (getEle("prodDesc").value.length > 0) {
        getEle("spanDesc").innerHTML = "";
        isValidate[5] = true;
    } else {
        getEle("spanDesc").innerHTML = "* This field is required";
        isValidate[5] = false;
    }
});

getEle("prodImg").addEventListener("focusout", () => {
    if (getEle("prodImg").value.length > 0) {
        getEle("spanImg").innerHTML = "";
        isValidate[6] = true;
    } else {
        getEle("spanImg").innerHTML = "* This field is required";
        isValidate[6] = false;
    }
});

getEle("prodType").addEventListener("focusout", () => {
    if (getEle("prodType").value.length > 0) {
        getEle("spanType").innerHTML = "";
        isValidate[7] = true;
    } else {
        getEle("spanType").innerHTML = "* This field is required";
        isValidate[7] = false;
    }
});

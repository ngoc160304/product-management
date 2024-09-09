// Form delete cart
const buttonDeleteCarts = document.querySelectorAll("[btn-delete-cart]");
if (buttonDeleteCarts) {
    const formDelete = document.querySelector("[delete-cart]");
    buttonDeleteCarts.forEach(button => {
        button.addEventListener("click", () => {
            const productId = button.getAttribute("product-id");
            formDelete.action = formDelete.action + `/${productId}?_method=DELETE`;
            formDelete.submit()
        })
    })
}
// Form delete cart end

// Form update quantity product
const productsUpdateQuantity = document.querySelectorAll("[product-update-quantity]");
if (productsUpdateQuantity) {
    const formUpdate = document.querySelector("[update-quantity]");
    productsUpdateQuantity.forEach(product => {
        const buttonsUpdate = product.querySelectorAll("span");
        const inputQuantity = product.querySelector("input[product-id]");
        buttonsUpdate[0].addEventListener("click", () => {
            inputQuantity.value = parseInt(inputQuantity.value) - 1;
            if (parseInt(inputQuantity.value) >= 1) {
                const productId = inputQuantity.getAttribute("product-id");
                formUpdate.action = formUpdate.action + `/${productId}/${inputQuantity.value}?_method=PATCH`;
                formUpdate.submit()
            }
        })
        buttonsUpdate[1].addEventListener("click", () => {
            inputQuantity.value = parseInt(inputQuantity.value) + 1;
            if (parseInt(inputQuantity.value) <= parseInt(inputQuantity.max)) {
                const productId = inputQuantity.getAttribute("product-id");
                formUpdate.action = formUpdate.action + `/${productId}/${inputQuantity.value}?_method=PATCH`;
                formUpdate.submit()
            }
        })
    })
}
// Form update quantity product end

// Check input all
const inputsMulti = document.querySelectorAll("input[name='check-all']");
if (inputsMulti.length) {
    console.log(inputsMulti);

    inputsMulti.forEach(inputMulti => {
        inputMulti.addEventListener("change", () => {
            const idsInput = document.querySelectorAll("input[name='id']");
            idsInput.forEach(input => {
                if (inputMulti.checked == true) {
                    input.checked = true;
                } else {
                    input.checked = false;
                }
            });
            inputsMulti.forEach(input => {
                input.checked = inputMulti.checked;
            })
        })
    })
}
// Check input all end

// Check input item
const idsInput = document.querySelectorAll("input[name='id']");
let quantityProduct = 0;
let totalAmount = 0;
let resultCart = document.querySelector("[result-cart]");
resultCart.innerHTML = `Tổng thanh toán(${quantityProduct} Sản phẩm) <span class="ms-3">${(totalAmount).toFixed(2)}$</span>`
if (idsInput.length) {

    idsInput.forEach(input => {
        if (input.checked === true) {
            ++quantityProduct;
            totalAmount = totalAmount + parseFloat(input.getAttribute("quantity")) * parseFloat(input.getAttribute("amount"));
        }
        input.addEventListener("change", () => {
            const inputsChecked = document.querySelectorAll("input[name='id']:checked");
            console.log(inputsChecked);
            if (inputsChecked.length == idsInput.length) {
                inputsMulti.forEach(inputMulti => inputMulti.checked = true);
            } else {
                inputsMulti.forEach(inputMulti => inputMulti.checked = false);
            }
            if (input.checked == true) {
                totalAmount = totalAmount + parseFloat(input.getAttribute("quantity")) * parseFloat(input.getAttribute("amount"));
                ++quantityProduct;
                resultCart.innerHTML = `Tổng thanh toán(${quantityProduct} Sản phẩm) <span class="ms-3">${(totalAmount).toFixed(2)}$</span>`
            } else {
                totalAmount = totalAmount - parseFloat(input.getAttribute("quantity")) * parseFloat(input.getAttribute("amount"));
                --quantityProduct;
                resultCart.innerHTML = `Tổng thanh toán(${quantityProduct} Sản phẩm) <span class="ms-3">${(totalAmount).toFixed(2)}$</span>`
            }
        })
    })
    resultCart.innerHTML = `Tổng thanh toán(${quantityProduct} Sản phẩm) <span class="ms-3">${(totalAmount).toFixed(2)}$</span>`
}
// Check input item end

// Form delete all
const buttonDeleteAll = document.querySelector("button[delete-all]");
if (buttonDeleteAll) {
    const formDeleteAll = document.querySelector("[delete-all-cart]");
    buttonDeleteAll.addEventListener("click", () => {
        const inputsChecked = document.querySelectorAll("input[name='id']:checked");
        const ids = [];
        inputsChecked.forEach(input => {
            ids.push(input.getAttribute("product-id"));
        })
        console.log(ids);
        const inputDeleteAll = formDeleteAll.querySelector("input[name=ids]");
        inputDeleteAll.value = ids.join("-");
        formDeleteAll.submit();
    })
}
// Form delete all end

// form purchase multi
const buttonPurchaseMulti = document.querySelector("[btn-purchase-multi]");
if (buttonPurchaseMulti) {
    buttonPurchaseMulti.addEventListener("click", () => {
        const idsInputChecked = document.querySelectorAll("[name='id']:checked");
        if (idsInputChecked.length) {
            const products = [];
            idsInputChecked.forEach(input => {
                const product = {
                    product_id: input.getAttribute("product-id")
                }
                products.push(product);
            })
            const formSubmit = document.querySelector("[form-purchase-multi]");
            const inputSubmit = formSubmit.querySelector("input");
            inputSubmit.value = JSON.stringify(products);
            formSubmit.submit();
        }
    })
}
// form purchase multi end


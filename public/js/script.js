// Header list menu
const listMenu = document.querySelectorAll("[link-activce]");
if (listMenu.length) {
    const path = location.pathname;
    for (const item of listMenu) {
        if (item.pathname == path) {
            item.style.color = "#E72929";
        }
    }
}
// button quantity cart product 
const productQuantity = document.querySelector("[product-quantity]");
if (productQuantity) {
    const buttonsPaymentNumber = productQuantity.querySelectorAll("span");
    const inputNumber = productQuantity.querySelector("input");
    buttonsPaymentNumber[0].addEventListener("click", () => {
        if (inputNumber.value > inputNumber.min) {
            inputNumber.value = parseInt(inputNumber.value) - 1;
        }
    })
    buttonsPaymentNumber[1].addEventListener("click", () => {
        if (inputNumber.value < inputNumber.max) {
            inputNumber.value = parseInt(inputNumber.value) + 1;
        }
    })
}
// button quantity cart product end

// show alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("time"));
    console.log(time);
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)
}
// show alert end

// input otp
const inputsOTP = document.getElementById("inputs-otp");
if (inputsOTP) {
    inputsOTP.addEventListener("input", function (e) {
        const target = e.target;
        const val = target.value;

        if (isNaN(val)) {
            target.value = "";
            return;
        }

        if (val != "") {
            const next = target.nextElementSibling;
            if (next) {
                next.focus();
            }
        }
    });

    inputsOTP.addEventListener("keyup", function (e) {
        const target = e.target;
        const key = e.key.toLowerCase();

        if (key == "backspace" || key == "delete") {
            target.value = "";
            const prev = target.previousElementSibling;
            if (prev) {
                prev.focus();
            }
            return;
        }
    });
}
// input otp end

// buy now
const formBuyNow = document.querySelector("[form-buy-now]");
if (formBuyNow) {
    console.log(formBuyNow);
    const buttonBuyNow = document.querySelector("[buy-now]");
    console.log(buttonBuyNow);
    buttonBuyNow.addEventListener("click", () => {
        console.log("OK")
        location.href = buttonBuyNow.getAttribute("href");
    })
}
// buy now end
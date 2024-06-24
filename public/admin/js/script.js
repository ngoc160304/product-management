// Button status
const listStatus = document.querySelectorAll("[button-status]");
const inputSearch = document.querySelector("#form-search [form-search-input]");
if(listStatus.length) {
    const url = new URL(location.href);
    listStatus.forEach(item => {
        item.addEventListener("click", (e) => {
            const status = item.getAttribute("button-status")
            if(status) {
                url.searchParams.set("status", status);
                if(inputSearch.value == '') {
                    url.searchParams.delete("keyword")
                }
            }
            else {
                url.searchParams.delete("status");
                if(inputSearch.value == '') {
                    url.searchParams.delete("keyword")
                }
            }
            if(url.searchParams.get("page")) {
                // url.searchParams.set("page", 1);
                url.searchParams.delete("page");
            }
            location.href = url.href;
        })
    })
}
// Button status end

// Form search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    const url = new URL(location.href);
    const inputSearch = formSearch.querySelector("[type=text]");
    console.log(inputSearch.value);
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        const keyword = e.target[0].value;
        if(keyword) {
            url.searchParams.set("keyword", keyword);
        }
        else {
            url.searchParams.delete("keyword");
        }
        if(url.searchParams.get("page")) {
            url.searchParams.set("page", 1);
        }
        location.href = url.href;
    })
}
// Form search end

// Button pagination
const buttonPaginations = document.querySelectorAll("[button-pagination]");
if(buttonPaginations.length) {
    const url = new URL(location.href);
    buttonPaginations.forEach(button => {
        button.addEventListener("click", () => {
            const pageNumber = button.getAttribute("button-pagination");
            if(pageNumber == 1) {
                url.searchParams.delete("page");
            }
            else {
                url.searchParams.set("page", pageNumber);
            }
            location.href = url.href;
        })
    })
}
// Button pagination end

// Input checkbox 
const checkBoxAll = document.querySelector("[name='checkall']");
if(checkBoxAll) {
    const ids = document.querySelectorAll("[name='id']");
    checkBoxAll.addEventListener("click", () => {
        if(checkBoxAll.checked) {
            ids.forEach(button => {
                button.checked = true;
            })
        }
        else {
            ids.forEach(button => {
                button.checked = false;
            })
        }
    });
    ids.forEach(button => {
        button.addEventListener("click", () => {
            const countIds = document.querySelectorAll("[name='id']:checked").length;
            if(ids.length != countIds) {
                checkBoxAll.checked = false;
            }
            else {
                checkBoxAll.checked = true;
            }
        })
    })
}
// Input checkbox end

// Form change multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        const inputIds = document.querySelector("[name='ids']");
        const idsChecked = document.querySelectorAll("[name='id']:checked");
        const typeChange = e.target.elements.type.value;
        if(typeChange == "deleteall") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này ?");
            if(isConfirm == false) {
                return;
            }
        }
        let ids = "";
        idsChecked.forEach(item => {
            const posititon = item.closest("tr").querySelector("input[name='position']");
            if(typeChange == "change-position") {
                ids = ids + `${item.value}-${posititon.value}` + " ";
            }
            else {
                ids += item.value + " ";
            }
        })
        inputIds.value = ids.trim();
    })
}
// Form change multi end

// Show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("time"));
    
    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time)
}
// Show alert end 

// Preview img 
const thumbnailInput = document.querySelector("[upload-image-input]");
if(thumbnailInput) {
    thumbnailInput.addEventListener("change", (e) => {
        const [ file ] = thumbnailInput.files;
        if(file) {
            const imgUpload = document.querySelector("[upload-image-preview]");
            imgUpload.src = URL.createObjectURL(file);
        } 
    })
}
// Preview img end

// Delete preview img
const buttonDeleteImg = document.querySelector("[btn-delete-image-preview]");
if(buttonDeleteImg) {
    console.log(buttonDeleteImg)
    buttonDeleteImg.addEventListener("click", () => {
        const imgUpload = document.querySelector("[upload-image-preview]");
        const inputImg = document.querySelector("[upload-image-input]");
        imgUpload.src = "";
        inputImg.value = "";
    })
}
// Delete preview img end
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
                if(inputSearch && inputSearch.value == '') {
                    url.searchParams.delete("keyword")
                }
            }
            else {
                url.searchParams.delete("status");
                if(inputSearch && inputSearch.value == '') {
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
        if(file != null) {
            const imgUpload = document.querySelector("[upload-image-preview]");
            imgUpload.src = URL.createObjectURL(file);
        }
    })
}
// Preview img end

// Delete preview img
const buttonDeleteImg = document.querySelector("[btn-delete-image-preview]");
if(buttonDeleteImg) {
    buttonDeleteImg.addEventListener("click", () => {
        const imgUpload = document.querySelector("[upload-image-preview]");
        const inputImg = document.querySelector("[upload-image-input]");
        imgUpload.src = "";
        inputImg.value = "";
    })
}
// Delete preview img end

// Sort select
const sortSelect = document.querySelector("#select-sort");
if(sortSelect) {
    const url = new URL(location.href);
    sortSelect.addEventListener("change", (e) => {
        const [sortKey, sortValue] = e.target.value.split("-");
        console.log(sortKey);
        console.log(sortValue);
        if(sortKey === "position" && sortValue === "desc") {
            url.searchParams.delete("sort_key");
            url.searchParams.delete("sort_value");
        } else {
            url.searchParams.set("sort_key", sortKey);
            url.searchParams.set("sort_value", sortValue);
        }
        location.href = url.href;
    })
    if(url.searchParams.get("sort_key")) {
        const sortValue = url.searchParams.get('sort_key') + "-" + url.searchParams.get('sort_value');
        const sortSelected = sortSelect.querySelector(`option[value=${sortValue}]`);
        sortSelected.selected = true
    }
    // const sortSelected = sortSelect.querySelector("option[value='']")
}
// Sort select end

// Header img
const headerAvatar = document.querySelector("[header-avatar]");
if(headerAvatar) {
    const img = headerAvatar.querySelector("img");
    const menu = headerAvatar.querySelector("ul");
    console.log(img)
    console.log(menu)
    document.addEventListener("click", (e) => {
        if(headerAvatar.contains(e.target)) {
            menu.classList.toggle("d-block")
            const menuClass = menu.getAttribute("class")
            if(menuClass == "d-none" || menuClass == "d-none d-block") {
                menu.setAttribute("class", "d-block");
            } 
        } else {
            menu.setAttribute("class", "d-none");
        }
    })
   
    
}
// Header img end
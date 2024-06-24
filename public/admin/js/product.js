// Button change status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]");
if(buttonsChangeStatus.length) {
    const form = document.querySelector("#change-status");
    buttonsChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            let status = button.getAttribute("status");
            const id = button.getAttribute("id-item");
            status = status === "active" ? "inactive" : "active";
            const path = form.getAttribute("data-path");
            form.action = path + `/${status}/${id}?_method=PATCH`;
            form.submit();
        })
    })
}
// Button change status end

// Button delete product
const buttonsDelete = document.querySelectorAll("[data-id-delete-item");
if(buttonsDelete.length > 0) {
    const formDeleteItem = document.querySelector("#form-delete-item");
    const path = formDeleteItem.getAttribute("data-path");
    buttonsDelete.forEach(button => {
        button.addEventListener("click", () => {
            const id = button.getAttribute("data-id-delete-item");
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này ?");
            const action = `${path}/${id}?_method=DELETE`;
            if(isConfirm) {
                formDeleteItem.action = action;
                formDeleteItem.submit();
            }
        })
    })
}
// Button delete product end
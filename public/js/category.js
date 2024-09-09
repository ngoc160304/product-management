const categorys = document.querySelectorAll("[category]");
if(categorys) {
    categorys.forEach(button => {
        button.addEventListener("click", () => {
            const categoryName = button.getAttribute("category");
            const categoryChild = document.querySelector(`#${categoryName}`);
            categoryChild.classList.toggle("d-block")
        })
    })
}
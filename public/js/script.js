// Header list menu
const listMenu = document.querySelectorAll(".header .inner-menu li a");
if(listMenu.length) {
    const path = location.pathname;
    for (const item of listMenu) {
        if(item.pathname == path) {
            item.style.color = "#E72929";
            break;
        }
    }
}
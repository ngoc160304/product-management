module.exports = (query) => {
    const filterSearch = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Đang hoạt động",
            status: "active",
            class: ""
        },
        {
            name: "Dừng hoạt động",
            status: "inactive",
            class: ""
        }
    ]
    if(query.status) {
        const index = filterSearch.findIndex(item => item.status === query.status);
        filterSearch[index].class = "active";
    }
    else {
        filterSearch[0].class = "active";
    }
    return filterSearch;
}
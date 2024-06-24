module.exports = (objectPagination, query, totalPage) => {
    if(query.page) {
        objectPagination.currentPage = parseInt(query.page);
    }

    objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;
    objectPagination.totalPage = Math.ceil(totalPage / objectPagination.limitItems);
    return objectPagination;
}
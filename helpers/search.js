module.exports = (query) => {
    const objectSearch = {
        keyword: "",
    }
    if(query.keyword) {
        const regex = RegExp(query.keyword, "i");
        objectSearch.regex = regex;
        objectSearch.keyword = query.keyword;
    }
    return objectSearch;
}
function paginate(totalPosts, currentPage) {
  var pages = Math.ceil(parseInt(totalPosts) / 5);

  // 🚸 Should change this to use map
  var pagination = {};
  for (var i = 1; i <= pages; i++) {
    pagination[i] = {
      pageNumber: i
    }
    if (i === parseInt(currentPage)){
      pagination[i]["isCurrentPage"] = true;
    } else {
      pagination[i]["isCurrentPage"] = false;
    }
  }
  return pagination;
}

module.exports = {
  paginate: paginate
}

const dates = require("./dates");

function formatPost(post) {
  post.formatted_date = dates.formatDate(post.post_date);
  post.show_read_more = true;
  if (post.full_post_in_preview && post.summary === "") {
    post.show_read_more = false;
  }
  return post;
}

module.exports = {
  formatPost: formatPost
}

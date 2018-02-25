const blogName = process.env.BLOGNAME;

const hexcolors = require("./hexcolors");

function populate(user = false) {
  td = {
    mainTitle: blogName,
    hrBorderColors: hexcolors.hrBorderColor()
  }

  if (user) {
    td.username = user.username;
    td.userId = user.id;
    td.userType = user.type;
    td.admin = user.type === "admin" ? true : false;
  }
  return td;
}

module.exports = {
  populate: populate
}

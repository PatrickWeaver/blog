var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function formatDate(d) {
  var rawDate = new Date(d);
  var formattedDate = "";
  formattedDate +=
    monthNames[rawDate.getMonth()] +
    " " +
    rawDate.getDate() +
    ", " +
    rawDate.getFullYear();
  return formattedDate;
}

module.exports = {
  formatDate: formatDate
}

var exports = {};

exports.getColor = function (){
  var hexNumber = "";
  var number = Math.floor(Math.random() * 10)
  if (number < 7){
    var hexNumber = (number + 3).toString();
  } else {
    switch (number){
      case 7:
      hexNumber = "A";
      break;
      case 8:
      hexNumber = "B";
      break;
      case 9:
      hexNumber = "C";
      break;
    }
  }
  return hexNumber;
}

exports.hrBorderColor = function (){
  var getColor = exports.getColor;
  var hexes = {};
  var order = "ab";
  for (var i = 0; i < 2; i++){
    hexes[order[i]] = "#" + getColor() + getColor() + getColor();

  }
  return hexes;
}

module.exports = exports;

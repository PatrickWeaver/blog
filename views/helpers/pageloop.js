var forLoop = function(hbs){

  hbs.registerHelper('forLoop', function(start, stops, increment, options) {
    var loop = '';
    for(var i = start; i <= stops; i += increment)
        loop += options.fn(i);
    return loop;
  });

}

module.exports = forLoop;

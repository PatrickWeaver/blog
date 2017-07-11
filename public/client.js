$('document').ready(function(){

  $(function() {
    function postAPI(path) {
      apiUrl = $( "#apiUrl" ).html();
      alert(apiUrl);
    }

    postAPI("hi");



    $.post("", function() {

    });

    $.post( "ajax/test.html", function( data ) {
      $( ".result" ).html( data );
    });

  });


});

const $ = require("jquery");

$('document').ready(function(){

  var originalSlug = $( "#original-slug" ).text();

  //Client url is passed from environment variable to front end via local
  var clientUrl = $( "#clientUrl" ).html();

  // * * * * * * * * * *
  // Import Post:
  // * * * * * * * * * *
  $( "button#import-post-button" ).click(function() {
    $( "#import-post-form").show();
  });

  $( "button#submit-import-post" ).click(function(event) {
    event.preventDefault();

    importData = {
      url: $( "#import-post-url").val(),
      source: $( "#import-post-source :selected" ).val()
    }
    var path = "/import";

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: clientUrl + path,
      data: JSON.stringify(importData),
      success: function(data) {
        console.log("Success!");
        $( "#new-post-title" ).val(data.title);
        $( "#new-post-body").html(data.body);
        fillSlug(data.title);
        $('html, body').animate({
            scrollTop: $("#new-post-title").prev().offset().top
        }, 500);

      },
      error: function(xhr, status, err, a) {
        console.log("Error: " + err + " -- Status: " + status);
      }
    });

  });

  // * * * * * * * * * *
  // New Post:
  // * * * * * * * * * *

  // Autofill date:
  var d = new Date;
  $( "#new-post #post-date").val(formatDate(d));

  var autofillSlug = true;

  function formatDate(d) {
    return(
    d.getFullYear() + "-" + parseInt(d.getMonth() + 1) + "-" + d.getDate()
    + " " + d.getHours() + ":" + d.getMinutes())
  }


  // Generate slug
  // From: https://gist.github.com/mathewbyrne/1280286
  // Shortened to 1024 characters if if longer (it shouldn't be because the title is also 1024)
  function slugify(text) {
    slug = text.toString().toLowerCase()
      .replace(/\s+/g, '-')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '-')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
    slug = slug.substr(0, 1024);
    return slug;
  }

  function fillSlug(text) {
    $(  "#post-form #post-slug" ).val(slugify(text.substr(0, 1024)));
  }

  // Auto populate slug on writing in title field
  $( "#post-form #post-title" ).keyup(function() {
    if ( autofillSlug ) {
      fillSlug( $( this ).val() );
    }
    $( this ).val( $( this ).val().substr(0, 1024));
  });

  $( "#post-form #post-slug" ).focusin(function() {
    autofillSlug = false;
  });

  $( "#post-form #post-slug" ).focusout(function() {
    fillSlug( $( this ).val() );
    if ( $( this ).val() === slugify( $( "#post-form #post-title" ).val().substr(0, 1024)) ) {
      autofillSlug = true;
    }
  });

  $( "#post-form #post-body" ).keyup(function() {
    if (
          $( "#post-form #post-title" ).val() === ""
          &&
          $( "#post-form #post-slug" ).val() === ""
      )
   {
      fillSlug( $( this ).val() );
    }
  });

  $( "#post-form > .submit").click(function(event) {
    event.preventDefault();
    if ( $( "#post-form #post-body" ).val() != "") {
      var parentId = $( this ).closest(".post-form-parent").attr("id");
      if (parentId === "edit-post") {
        sendPost("/post/" + originalSlug + "/edit/" )
      } else if (parentId === "new-post") {
        sendPost("/new/");
      }
    } else {
      alert("Post must have body");
    }
  });

  function fillSlugFrom(){
    var fillButtonsHTML = "";
    var fillFromAreas = ["title", "summary", "body"];
    for (var i in fillFromAreas) {
      var value = $( "#new-post-" + fillFromAreas[i] ).val();
      if (value != "") {
        fillButtonsHTML += "<li><button type='button' class='fill-slug-from'>" + fillFromAreas[i] + "</button></li>";
      }
    }

    if (fillButtonsHTML != "") {
      if (fillButtonsHTML != ""){
        $( "#slug-fill > ul" ).html(fillButtonsHTML);
      } else {
        $( "#slug-fill > ul").hide();
      }
      $( "#slug-fill" ).show();
    }

    $( "body" ).on("click", ".fill-slug-from", function(event) {
      event.preventDefault();
      slug = slugify($( "#post-form #post-" + $( this ).html().toLowerCase() ).val().substr(0, 1024));
      $( "#post-form #post-slug" ).val(slug);
      $( "#slug-fill" ).hide();
    });


    $('html, body').animate({
        scrollTop: $("#post-form #post-slug").prev().offset().top
    }, 500);
  }

  $( ".close-status-modal" ).click(function() {
    $( "#post-status" ).hide();
    $( "#post-loading" ).hide();
    $( "#post-success" ).hide();
    $( "#post-failure" ).hide();
  });

  function sendPost(path) {

    // Grab post data from the form:
    var slug = slugify($( "#post-form #post-slug" ).val().substr(0, 1024));
    if (slug === "") {
      fillSlugFrom();
      return;
    }

    // Collect into postData object
    var postData = {
      title: $( "#post-form #post-title" ).val().substr(0, 1024),
      slug: slug,
      summary: $( "#post-form #post-summary" ).val(),
      post_date: $( "#post-form #post-date" ).val(),
      body: $( "#post-form #post-body" ).val()
    }

    $( "#post-status" ).show();
    $( "#post-loading" ).show();

    $.ajax({
      type: "POST",
      dataType: "json",
      contentType: "application/json",
      url: clientUrl + path,
      data: JSON.stringify(postData),
      success: function(data) {
        try {
          console.log(data);
          if (data.success) {
            setTimeout(function() {
              $( "#post-success" ).show();
              $( "#post-loading" ).hide();
            }, 500);
          } else {
            throw "Not posted";
          }
        }
        catch (err) {
          sendPostError(err);
        }
      },
      error: function(xhr, status, err, a) {
        console.log("Error: " + err + " -- Status: " + status);
        sendPostError(err);
      }
    });
    function sendPostError(e) {
      setTimeout(function() {
        $( "#post-failure" ).show();
        $( "#post-loading" ).hide();
      }, 500);
    }
  }

  $( ".delete-post").click(function() {
    $.ajax({
      type: "GET",
      url: clientUrl + "/post/" + originalSlug + "/delete/",
      success: function(data) {
        try {
          console.log(data);
          if (data[0].success) {
            setTimeout(function() {
              $( "#post-success" ).show();
              $( "#post-loading" ).hide();
            }, 500);
          } else {
            throw "Not posted";
          }
        }
        catch (err) {
          sendPostError(err);
        }
      },
      error: function(xhr, status, err, a) {
        console.log("Error: " + err + " -- Status: " + status);
        sendPostError(err);
      }
    });
  });

});

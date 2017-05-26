$(document).ready(function() {
  var el = {
    bagLetters:     $('.letter-color-letter'),
    letterImages:   $('.bag-letter-image'),
    input:          $('#letters-input'),
    letterTab1:     $('#letter1'),
    letterTab2:     $('#letter2'),
    lettersWrapper: $('.letters-wrapper'),
    
  }

  var letter1Choice = "black"
  var letter2Choice = "black"

  $(window).resize(function() {
    el.letters.height(
      el.lettersWrapper.height()
    )
  })

  el.bagLetters.on('click', function() {
    el.bagLetters.removeClass("active")
    $(this).addClass("active")
  })

  el.letterTab1.on('click', function() {
    $(".swatch-image-border.active").removeClass("active")
    $(".swatch-image-border").each(function() {
      if ($(this).data("material-swatch") == letter1Choice) {
          $(this).addClass("active")
      }
    })
  })

  el.letterTab2.on('click', function() {
    $(".swatch-image-border.active").removeClass("active")
    $(".swatch-image-border").each(function() {
      if ($(this).data("material-swatch") == letter2Choice) {
          $(this).addClass("active")
      }
    })
  })

  el.input.on("input", function() {
    var $inputText = $(this).val()
    var newHeight = $(".letters-wrapper ").height()

    if( $inputText.length > 0 ) {
      $("#bagLetter2").hide()

      var newLetter1Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + ".png"
      $("#letter1").css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
      $("#bagLetter1").attr("src", newLetter1Path)
      $("#bagLetter1").css({ display: "block", height: newHeight + "px" })
      $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice)
      if ($inputText.length > 1) {
          var newLetter2Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice + ".png"
          $("#bagLetter2").attr("src", newLetter2Path)
          $("#bagLetter2").show().css({ display: "block", height: newHeight + "px" })
          $("input").blur()
          $("#letter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
          $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + " / " + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice)
      }
    } else {
      $("#letter1").html("")
      $("#letter2").html("")
      $("#bagLetter1").css({ display: "none" })
      $("#bagLetter2").css({ display: "none" })
    }
  })

  $(".swatch-image-border").click(function() {
      var $inputText = $("#letters-input").val()
      $(".swatch-image-border.active").removeClass("active")
      $(this).addClass("active")
      if ($("#letter1").hasClass("active")) {
          letter1Choice = $(this).data("material-swatch")
          var newLetter1Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + ".png"
          $("#bagLetter1").attr("src", newLetter1Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
          $("#letter1").css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
          if ($inputText.length > 1) {
              $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + " / " + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice)

          } else {
              $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice)
          }
      } else if ($("#letter2").hasClass("active")) {
          letter2Choice = $(this).data("material-swatch")
          var newLetter2Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice + ".png"
          $("#bagLetter2").attr("src", newLetter2Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
              /* $("#bagLetter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
          $("#letter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "50%", backgroundPosition: "center" })
          $("#custombar-custom-info").val("Danny-Black / " + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + " / " + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice)
      }
  })

})

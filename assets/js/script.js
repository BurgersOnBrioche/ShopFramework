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

    if( $inputText.length > 0 ) {
      $("#bagLetter2").hide()
      renderLetter(1, $inputText.charAt(0), letter1Choice)
      if ($inputText.length > 1) {
        renderLetter(2, $inputText.charAt(1), letter2Choice)
        $("input").blur()
      }
      updateCustomInfo()
    } else {
      $("#letter1").html("")
      $("#letter2").html("")
      $("#bagLetter1").css({ display: "none" })
      $("#bagLetter2").css({ display: "none" })
    }
  })

  function renderLetter(index, letter, swatch) {
    var height     = $(".letters-wrapper").height()
    var letterPath = (window.baseUrl || "") + "assets/img/letters/" + letter.toUpperCase() + "-" + swatch + ".png"
    $("#letter"+index).css({ background: "url(" + letterPath + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
    $("#bagLetter"+index).attr("src", letterPath)
    $("#bagLetter"+index).show().css({ height: height })
  }

  function updateCustomInfo() {
    var text = el.input.val()

    if (text.length > 1) {
      $("#custombar-custom-info").val("Danny-Black / " + text[0].toUpperCase() + "-" + letter1Choice + " / " + text[1].toUpperCase() + "-" + letter2Choice)
    } else {
      $("#custombar-custom-info").val("Danny-Black / " + text[0].toUpperCase() + "-" + letter1Choice)
    }
  }

  $(".swatch-image-border").click(function() {
    $(".swatch-image-border.active").removeClass("active")
    $(this).addClass("active")
    var $inputText = el.input.val()

    if ($("#letter1").hasClass("active")) {
      letter1Choice = $(this).data("material-swatch")
      renderLetter(1, $inputText.charAt(0).toUpperCase(), letter1Choice)
    } else if ($("#letter2").hasClass("active")) {
      letter2Choice = $(this).data("material-swatch")
      renderLetter(2, $inputText.charAt(1).toUpperCase(), letter2Choice)
    } else {
      console.warn('Unknown letter active')
    }

    updateCustomInfo()
  })
})

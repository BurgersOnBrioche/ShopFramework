$(document).ready(function() {
    var letter1Choice = "black"
    var letter2Choice = "black"

    $(window).resize(function() {
        var newHeight = $(".letters-wrapper ").height()
        $("#bagLetter1").css({ display: "block", height: newHeight + "px" })
        $("#bagLetter2").css({ display: "block", height: newHeight + "px" })

    })

    $(".letter-color-letter").click(function() {
        $(".letter-color-letter.active").removeClass("active")
        $(this).addClass("active")
    })

    $("#letter1").click(function() {
        $(".swatch-image-border.active").removeClass("active")
        $(".swatch-image-border").each(function() {
            if ($(this).data("material-swatch") == letter1Choice) {
                $(this).addClass("active")
            }
        })
    })
    $("#letter2").click(function() {
        $(".swatch-image-border.active").removeClass("active")
        $(".swatch-image-border").each(function() {
            if ($(this).data("material-swatch") == letter2Choice) {

                $(this).addClass("active")
            }
        })
    })
    $("#letters-input").on("input", function() {


        var $inputText = $(this).val()
        var newHeight = $(".letters-wrapper ").height()

        switch (true) {
            case $inputText.length > 0:
                $("#bagLetter2").css({ display: "none" })
                $("#letter1").html($inputText.charAt(0).toUpperCase())
                var newLetter1Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(0).toUpperCase() + "-" + letter1Choice + ".png"
                $("#bagLetter1").attr("src", newLetter1Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
                $("#bagLetter1").css({ display: "block", height: newHeight + "px" })
                    /* $("#bagLetter1").css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
                     $("#bagLetter2").css({ background: "none" })*/

                if ($inputText.length > 1) {
                    $("#letter2").html($inputText.charAt(1).toUpperCase())
                    var newLetter2Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice + ".png"
                    $("#bagLetter2").attr("src", newLetter2Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
                    $("#bagLetter2").css({ display: "block", height: newHeight + "px" })
                    $("input").blur()
                }

                /*$("#bagLetter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/
                break;
            default:
                $("#letter1").html("")
                $("#letter2").html("")
                $("#bagLetter1").css({ display: "none" })
                $("#bagLetter2").css({ display: "none" })
                break;

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

        } else if ($("#letter2").hasClass("active")) {
            letter2Choice = $(this).data("material-swatch")
            var newLetter2Path = (window.baseUrl || "") + "assets/img/letters/" + $inputText.charAt(1).toUpperCase() + "-" + letter2Choice + ".png"
            $("#bagLetter2").attr("src", newLetter2Path) /*css({ background: "url(" + newLetter1Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/

            /* $("#bagLetter2").css({ background: "url(" + newLetter2Path + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })*/

        }
    })

})

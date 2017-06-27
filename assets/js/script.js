var isSale = true
var tutorial = true

var isIE = false
var swatchSets = {
  letters: {
    leather: ['black', 'white', 'hotpink', 'lightturquoise', 'silver-metallic', 'gold-metallic'],
    brush: ['brush-black', 'brush-white']
  },
  tassels: ['rickrack-blue', 'rickrack-orange', 'rickrack-pink', 'rickrack-red', 'white'],
  trims: ['batik-blue', 'rickrack-blue', 'rickrack-orange', 'rickrack-pink', 'rickrack-red', 'pompom-white']
}
$(document).ready(function() {

  //check if browser is IE
  var ua = window.navigator.userAgent;
  var trident = ua.indexOf("Trident/")
  var msie = ua.indexOf("MSIE ")
  if (msie > 0 || trident > 0) {
    isIE = true
  }

  // shows arrows for steps
  if (tutorial) {
    $(".fa.fa-arrow-right, .fa.fa-arrow-left").css({ display: "flex" })
  }
  // hide contact us form
  if (!window.location.href.match(/localhost/)) {
    var interval = setInterval(function() {
      var contactUs = $('body').find('img[src*="icf.improvely.com"]')
      if (!contactUs.length) { return; }
      contactUs.hide()
      clearInterval(interval)
    }, 200)
  }

  // fix odd safari bug where the delegated click is not being recognized, but only for the bag
  setTimeout(function() {
    $('.js-click').on('click', function() {})
  }, 1000)

  // get template html and embed it in the page

  fetch((window.baseUrl || '') + '/assets/html/custombar.html').then(function(response) {
    return response.text()
  }).then(function(html) {
    html = html.replace(/assets\/img\//g, (window.baseUrl || '') + 'assets/img/')
    $('#custombar').parent().css({ position: 'relative' })
    $('#custombar').before(html).remove()
  })
  fetch((window.baseUrl || '') + '/assets/html/custombar-beach.html').then(function(response) {
    return response.text()
  }).then(function(html) {
    html = html.replace(/assets\/img\//g, (window.baseUrl || '') + 'assets/img/')
    $('#custombarBeach').parent().css({ position: 'relative' })
    $('#custombarBeach').before(html).remove()
  })
})

var lastState = $.extend({}, state);

//
// EVENT HANDLING
//

// tap bag to modify
$(document).on('click', '.js-bag', function(evt) {
  setState({
    editing: true,
    editingBag: true,
  })

})


// input to change both letters
$(document).on('input', '.js-bag-input', function(evt) {
  if ($(this).val().match(/[^A-z]/)) { return $(this).val(state.letters) }
  var newState = {
    letters: $(this).val().toUpperCase(),
    arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 }
  }

  if (state.arrow.step2 == false) {
    newState.arrow.step2 = true
  }
  // reset active letter pointer if letters are deleted
  if ($(this).val().length < state.letters.length) {
    const letterIndexes = $(this).val().length - 1;
    newState.activeLetter = Math.min(letterIndexes, state.activeLetter);
  }

  setState(newState)
})
$(document).on('focus', '.js-bag-input', autoselect)
$(document).on('click', '.js-bag-input', autoselect)

$(document).on('click', '.js-letter-material', function(evt) {

  var material = $(this).data('material')
  var maxlen = productOptions.product["dani-beach"]["letterMaterials"][material]["maxlength"]
  var materials = []
  var letters = state.letters.substring(0, maxlen)
    //TODO: Change Letter names with leather
  if (material == 'brush') {
    $('.js-bag-input').attr('maxlength', maxlen)
    for (i = 0; i < maxlen; i++) {
      materials.push('brush-white')
    }
  } else {
    $('.js-bag-input').attr('maxlength', maxlen)
    for (i = 0; i < maxlen; i++) {
      materials.push('white')
    }


  }
  var newState = {
    letters: letters,
    materials: materials,
    letterMaterial: material,
    activeSwatchSet: swatchSets.letters[material],


  }
  setState(newState)
})

// select material swatch for individual letter
$(document).on('click', '.js-swatch-link', function(evt) {
  var materials = state.materials.concat([])
  var color = $(this).data('color')
  if (state.editingBag || state.activeLetter == -1) {
    materials = materials.map(function(m) { return color })
  } else if (state.activeLetter > -1) {
    materials[state.activeLetter] = $(this).data('color')
  } else if (state.activeLetter == -2) {
    state.tassel = color
  } else if (state.activeLetter == -3) {
    state.trim = color
  }


  var newState = {
    materials: materials,
    arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 }
  }
  if (state.arrow.step4 == false) {
    newState.arrow.step4 = true
  }
  setState(newState)
})


// select bag style
$(document).on('click', '.js-bag-style-link', function(evt) {
  setState({
    bag: {
      color: state.bag.color,
      style: $(this).data('style'),
      height: state.bag.height,
      width: state.bag.width,
      img: {
        height: state.bag.img.height,
        width: state.bag.img.width
      }
    }
  })

})

// select bag color
$(document).on('click', '.js-bag-color-link', function(evt) {
  var newState = {
    bag: {
      color: $(this).data('color'),
      style: state.bag.style,
      height: state.bag.height,
      width: state.bag.width,
      img: {
        height: state.bag.img.height,
        width: state.bag.img.width
      }
    },
    arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 }
  }
  if (state.arrow.step1 == false) {
    newState.arrow.step1 = true

  }
  setState(newState)
})

// show custom bar customization step

$(document).on('click', '.js-show-custom-bar', function(evt) {
  setState({
    step: "custom-bar"
  })

})

// show style selector step
$(document).on('click', '.js-back-to-bag-styles', function(evt) {
  setState({
    step: "style"
  })
})

// edit individual letter
$(document).on('click', '.js-letter', function(evt) {
  evt.stopPropagation()
  if ($(this).data('index') > -1) {
    setState({
      editing: true,
      editingBag: false,
      activeLetter: $(this).data('index'),
    })
  }
})

// select letter tab
$(document).on('click', '.js-tab-back', function(evt) {
  var tab = $(this).children('.js-tab')
  var newState = {}
  if (tab.data('index') > -1) {
    newState = {
      editing: true,
      editingBag: false,
      activeLetter: tab.data('index'),
      activeSwatchSet: swatchSets.letters[state.letterMaterial],
      arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 },

    }
  } else if (tab.data('index') == -1) {
    var swatchSet = []

    newState = {
      editing: false,
      editingBag: true,
      activeLetter: tab.data('index'),
      activeSwatchSet: swatchSets.letters[state.letterMaterial],
      arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 },
    }
  } else if (tab.data('index') == -2) {
    newState = {
      editing: false,
      editingBag: false,
      activeLetter: tab.data('index'),
      activeSwatchSet: swatchSets.tassels,
      arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 },
    }
  } else if (tab.data('index') == -3) {
    newState = {
      editing: false,
      editingBag: false,
      activeLetter: tab.data('index'),
      activeSwatchSet: swatchSets.trims,
      arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 },
    }
  }



  if (state.arrow.step3 == false) {
    newState.arrow.step3 = true
  }
  setState(newState)
})

function setState(newState) {
  lastState = $.extend({}, state)
  state = $.extend({}, state, newState)
  if (window.location.href.match(/localhost/)) {
    console.log('set', newState, 'state is now', state)
  }
  render()
}

function updateCustomInfo() {
  var productDescription = capitalize(state.bag.style) + " - " + capitalize(state.bag.color) + " Base" + '/ Tassel ' + state.tassel + ' / Trim ' + state.trim
  if (state.letters.length > 0) {
    productDescription += [' / ', state.letters[0].toUpperCase(), ' - ', materialName(state.materials[0])].join('')
  }
  if (state.letters.length > 1) {
    productDescription += [' / ', state.letters[1].toUpperCase(), ' - ', materialName(state.materials[1])].join('')
  }
  if (state.letters.length > 2) {
    productDescription += [' / ', state.letters[2].toUpperCase(), ' - ', materialName(state.materials[2])].join('')
  }
  if (state.letters.length > 3) {
    productDescription += [' / ', state.letters[3].toUpperCase(), ' - ', materialName(state.materials[2])].join('')
  }
  if (state.letters.length > 4) {
    productDescription += [' / ', state.letters[4].toUpperCase(), ' - ', materialName(state.materials[2])].join('')
  }
  if (state.letters.length > 5) {
    productDescription += [' / ', state.letters[5].toUpperCase(), ' - ', materialName(state.materials[2])].join('')
  }
  if (state.letters.length > 6) {
    productDescription += [' / ', state.letters[6].toUpperCase(), ' - ', materialName(state.materials[2])].join('')
  }
  $("#custombar-custom-info").val(productDescription);
}

function capitalize(string) {
  return string[0].toUpperCase() + string.substring(1)
}

function materialName(material) {
  switch (material) {
    case 'hotpink':
      return 'Hot Pink';
    case 'lightturquoise':
      return 'Light Turquoise';
    case 'silver-metallic':
      return 'Silver Metallic';
    case 'gold-metallic':
      return "Gold Metallic";
    default:
      return capitalize(material)
  }
}

function setImageLoaded(sender) {
  sender.setAttribute('data-loaded', true)
  resize()
}
//resize handler
var resizeInterval

function resize() {
  if ($("#customBarSectionMain").width() < (($(".js-swatch").height() * 8) + 20)) {
    $(".js-swatch>img").css({ maxHeight: ($(".js-swatches").width() / 8) + "px" })
  } else {
    $(".js-swatch>img").css({ maxHeight: ["calc(", $(".js-swatches").height(), "px - 30%)"].join('') })
  }


  $(".js-tab-back:not(.js-tab-back-all, .js-tab-back-tassel, .js-tab-back-trim)").width($(".js-tab-cnr").height())
  $(".js-tab-back-all").width($(".js-tab-cnr").height() * 2)
  $(".js-tab-back-tassel").width($(".js-tab-cnr").height() * 3)
  $(".js-tab-back-trim").width($(".js-tab-cnr").height() * 3)
  $(".js-tab-back-all").css({ fontSize: ($(".js-tab-back-all").height() * 0.75) + "px" })
  $(".js-tab-back-tassel").css({ fontSize: ($(".js-tab-back-tassel").height() * 0.75) + "px" })
  $(".js-tab-back-trim").css({ fontSize: ($(".js-tab-back-trim").height() * 0.75) + "px" })
  $(".js-letter-label").height($("js-bag-input").height())
  $(".js-bag-input").css({ fontSize: $(".j.js-bag-input").height() + "px" })
  $(".js-letters").height(($(".js-bag-custom").height() * state.letterAspectHeight) + "px").children("js-letter").width(25)
  $(".fa.fa-arrow-right,.fa.fa-arrow-left").css({ fontSize: $(".js-letter-label").height() + "px" })
  $(".js-bag-color-thumb").each(function() {
    $(this).width($(this).height() * (state.bag.img.width / state.bag.img.height))
  })

  $(".js-bag-color-thumb>img").each(function() {
    $(this).width($(this).parent().height() * (state.bag.img.width / state.bag.img.height))
  })
  $(".js-tab-back:not(.js-tab-back-all,.js-tab-back-tassel, .js-tab-back-trim)").each(function() {
    $(this).children(".js-tab").width($(this).children(".js-tab").height() * (letterSpacings[state.letterMaterial][state.letters[$(this).children(".js-tab").data("index")]]["img"].width / letterSpacings[state.letterMaterial][state.letters[$(this).children(".js-tab").data("index")]]["img"].height))
  })
  $("img.js-letter").each(function() {
    $(this).width($(this).height() * (letterSpacings[state.letterMaterial][state.letters[$(this).data("index")]]["img"].width / letterSpacings[state.letterMaterial][state.letters[$(this).data("index")]]["img"].height))
  })
  $("img.js-letter").each(function() {
    $(this).width($(this).height() * (letterSpacings[state.letterMaterial][state.letters[$(this).data("index")]]["img"].width / letterSpacings[state.letterMaterial][state.letters[$(this).data("index")]]["img"].height))
  })
  $(".js-bag-color-link").each(function() {
    if ($(this).attr('data-loaded')) {
      $(this).parents('.js-bag-color-thumb').width($(this).width())
    }
  })

  $(".js-bag-custom-trim").width($(".js-bag-custom").width())
  $(".js-bag-custom-trim").height($(".js-bag-custom").height())
  if (isIE == true) {
    clearInterval(resizeInterval)
    resizeInterval = setInterval(function() {
      render()
      clearInterval(resizeInterval)

    }, 750)

  }
}


function imgLoadedResize(sender) {
  $(".js-bag-color-thumb").width()

}
$(window).on('resize', resize)
var zoom = window.devicePixelRatio
setInterval(function() {
  if (window.devicePixelRatio != zoom) {
    resize();
    zoom = window.devicePixelRatio;
  }
}, 300)

function render() {
  if (state.step == "style") {
    // show style selector step
    $("#styleViewSection").css({ display: "block" })
    $("#customBarSectionMain").css({ display: "none" })
    $(".show-custom-bar").css({ display: "flex" })
    $(".back-to-bag-styles").css({ display: "none" })
    $(".check-my-custom-out").css({ display: "none" })
  }

  if (state.step == "custom-bar") {
    // reset
    $('.js-letters').find('.js-letter').remove()
    $('.js-tab-cnr').find('.js-tab:not([data-index=-1], [data-index=-2], [data-index=-3])').parents('.js-tab-back').remove()
    $('.js-tab').html('')
    $('.js-preview').html('')
    $('.js-tab').removeClass('active')
    $('.js-tab-back').removeClass('active')
    $('.js-swatch').removeClass('active')
    $('.js-loading').hide()
    $('.js-swatches').html('')

    // show custom-bar step
    $("#styleViewSection").css({ display: "none" })
    $("#customBarSectionMain").css({ display: "block" })
    if (state.navActive == true) {
      $(".show-custom-bar").css({ display: "none" })
      $(".back-to-bag-styles").css({ display: "flex" })
      $(".check-my-custom-out").css({ display: "flex" })
    }

    //sets step arrows
    if (state.arrow.step1) $(".js-bag-color>.fa.fa-arrow-right, .js-bag-color>.fa.fa-arrow-left").css({ display: "none" })
    if (state.arrow.step2) $(".js-letter-label>.fa.fa-arrow-right, .js-letter-label>.fa.fa-arrow-left").css({ display: "none" })
    if (state.arrow.step3) $(".js-tab-cnr>.fa.fa-arrow-right, .js-tab-cnr>.fa.fa-arrow-left").css({ display: "none" })
    if (state.arrow.step4) $(".js-swatches>.fa.fa-arrow-right, .js-swatches>.fa.fa-arrow-left").css({ display: "none" })

    // render bag color
    $('.js-bag-custom').css({ backgroundImage: "url(" + (window.baseUrl || '') + "assets/img/bags/" + state.bag.style + "-" + state.bag.color + ".png)" })

    //render tassel
    $('.js-bag-custom-trim').css({ backgroundImage: "url(" + (window.baseUrl || '') + "assets/img/trims/" + state.bag.style + "-trim-" + state.trim + ".png)" })

    //render trim
    $('.js-bag-custom-tassel').css({ backgroundImage: "url(" + (window.baseUrl || '') + "assets/img/tassels/" + state.bag.style + "-tassel-" + state.tassel + ".png)" })

    // render letters in bag and preview and adds tabs
    state.letters.split('').forEach(function(l, i) {

      var letter = Letter({ letter: l, material: state.materials[i], index: i })
      var tab = Tab({ letter: l, material: state.materials[i], index: i })
      $('.js-loading').show()
      $('.js-letters').append(letter)
      const tabSelector = ['.js-tab[data-index=', i - 1, ']'].join('')
      $(tabSelector).parents('.js-tab-back').after(tab)

      letter[0].onload = function() {
        letter.css({ marginLeft: letter.width() * letterSpacings[state.letterMaterial][l.toUpperCase()]["left"] + "px", marginRight: letter.width() * letterSpacings[state.letterMaterial][l.toUpperCase()]["right"] + "px" })
        $('.js-loading').hide()
        if (state.activeLetter === i) {
          $('.js-preview').append(letter.clone())
        }
      }
    })

    // render material selector
    if (state.bag.color == "burlap-base-natural") {
      if (state.activeLetter >= -1) {
        var materialSelector = MaterialSelector({})
        $(".js-swatches").append(materialSelector)
        var activeMaterialSelector = ['.js-letter-material[data-material=', state.letterMaterial, ']'].join('')
        $(activeMaterialSelector).addClass('active')
      }
    }

    state.activeSwatchSet.forEach(function(s, i) {
      var swatch = Swatch({ material: s })
      $(".js-swatches").append(swatch)
    })




    // render tabs
    $('.js-tab-tassel').html('TASSEL')
    $('.js-tab-trim').html('TRIM')
    $('.js-tab-all').html('ALL')


    // select input if we're showing a new input
    if (state.editing !== lastState.editing || (state.activeLetter !== lastState.activeLetter && state.activeLetter === state.letters.length)) {
      $('.js-input').select()
    }

    // render active tab
    const activeTabSelector = ['.js-tab[data-index=', state.activeLetter, ']'].join('')
    $(activeTabSelector).addClass('active').parents('.js-tab-back').addClass('active')


    // TODO: render swatch background 



    // render active swatch
    if (state.activeLetter > -1) {
      const activeSwatchSelector = ['.js-swatch[data-color=', state.materials[state.activeLetter], ']'].join('')
      $(activeSwatchSelector).addClass('active')
    } else if (state.activeLetter == -1) {
      const activeSwatchSelector = ['.js-swatch[data-color=', state.materials[state.activeLetter + 1], ']'].join('')
      $(activeSwatchSelector).addClass('active')
    } else if (state.activeLetter == -2) {
      const activeSwatchSelector = ['.js-swatch[data-color=', state.tassel, ']'].join('')
      $(activeSwatchSelector).addClass('active')
      console.log($(activeSwatchSelector).length)
    } else if (state.activeLetter == -3) {
      const activeSwatchSelector = ['.js-swatch[data-color=', state.trim, ']'].join('')
      $(activeSwatchSelector).addClass('active')
      console.log($(activeSwatchSelector).length)
    }

    // set value of inputs
    $('.js-bag-input').val(state.letters)
    $('.js-input').val(state.letters[state.activeLetter])
  }
  //update shopify variant
  if (state.hasVariants == true) {
    renderShopify()
  }

  // update shopify hidden input
  updateCustomInfo()
  resize()
}


function renderShopify() {
  var combo = 0
  if (state.letterMaterial == "brush" && state.letters.length > 0) {
    combo = 0
  } else if (state.letterMaterial == "leather" && state.letters.length > 0 && state.letters.length < 7) {
    combo = state.letters.length
  } else if (state.letters.length == 0) {
    combo = 7
  }
  var selectedOption = productOptions.product["dani-beach"]["variants"][combo]["sku"]
  optionSelectorPr.selectVariant(selectedOption)

}


function autoselect() {
  $(this).select()
}

function Letter(props) {
  var alt = [props.letter, ' in ', props.material].join('')
  var src = [window.baseUrl || '', 'assets/img/letters/', props.letter.toUpperCase(), '-', props.material, '.png'].join('')
  var html = ['<img src="', src, '" alt="', alt, '" class="letter js-letter" data-index="', props.index, '"/>'].join('')
  return $(html)
}

function Tab(props) {
  var alt = [props.letter, ' in ', props.material].join('')
  var src = [window.baseUrl || '', 'assets/img/letters/', props.letter.toUpperCase(), '-', props.material, '.png'].join('')
  var html = [
    '<div class="tab-back js-tab-back">',
    '<img src="', src, '" alt="', alt, '" class="tab js-tab" data-index="', props.index, '"/>',
    '</div>',
  ].join('')

  return $(html)
}

function Swatch(props) {
  var alt = props.material
  var src = [window.baseUrl || '', 'assets/img/material-swatches/swatch-', props.material, '.png'].join('')
  var html = [
    '<div class="swatch js-swatch" data-color="', props.material, '">',
    '<img src="', src, '" alt="', alt, '" class="js-swatch-link" data-color="', props.material, '">',
    '</div>'
  ].join('')
  return $(html)
}

function MaterialSelector(props) {
  var html = ['<div class="letter-material-cnr">',
    '<div class="letter-material js-letter-material" data-material="leather">',
    'LEATHER',
    '</div>',
    '<div class="letter-material js-letter-material" data-material="brush">',
    'STENCIL',
    '</div>',
    '</div>'
  ].join('')
  return $(html)
}

function downloadImage() {
  var node = document.getElementById('customBag');

  domtoimage.toPng(node)
    .then(function(dataUrl) {
      var img = new Image();
      img.src = dataUrl;
      document.body.appendChild(img);
    })
    .catch(function(error) {
      console.error('oops, something went wrong!', error);
    });
}
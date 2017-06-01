var isSale = true
var tutorial = true
var letterSpacings = {}

$(document).ready(function() {
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
})
fetch((window.baseUrl || '') + '/assets/js/letter-spacing.json').then(function(response) {
  response.json().then(function(json) {
    letterSpacings = json
  })
})
var state = {
  bag: {
    color: 'black',
    style: 'dani',
    height: 8.5,
    width: 12,
    img: {
      height: 1475,
      width: 1801
    }
  },
  letters: 'AZ',
  letterAspectHeight: 0.376,
  materials: ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
  positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  activeLetter: -1,
  editing: false,
  editingBag: true,
  step: "custom-bar",
  navActive: false,
  arrow: {
    step1: false,
    step2: false,
    step3: true,
    step4: true
  }
}

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

// select material swatch for individual letter
$(document).on('click', '.js-swatch-link', function(evt) {
  var materials = state.materials.concat([])
  var color = $(this).data('color')
  if (state.editingBag || state.activeLetter == -1) {
    materials = materials.map(function(m) { return color })
  } else {
    materials[state.activeLetter] = $(this).data('color')
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
    bag: { color: state.bag.color, style: $(this).data('style') }
  })

})

// select bag color
$(document).on('click', '.js-bag-color-link', function(evt) {
  var newState = {
    bag: { color: $(this).data('color'), style: state.bag.style },
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
      arrow: { step1: state.arrow.step1, step2: state.arrow.step2, step3: state.arrow.step3, step4: state.arrow.step4 },

    }
  } else {
    newState = {
      editing: false,
      editingBag: true,
      activeLetter: tab.data('index'),
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
  var productDescription = capitalize(state.bag.style) + " - " + capitalize(state.bag.color) + " Base"
  if (state.letters.length > 0) {
    productDescription += [' / ', state.letters[0].toUpperCase(), ' - ', materialName(state.materials[0])].join('')
  }
  if (state.letters.length > 1) {
    productDescription += [' / ', state.letters[1].toUpperCase(), ' - ', materialName(state.materials[1])].join('')
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
function resize() {

  console.log()
  if ($("#customBarSectionMain").width() / $("#customBarSectionMain").height() < 1.2) {
    $(".js-swatch").css({ maxHeight: ($(".js-swatches").width() / (($(".js-swatch").length - 1)) / 2) + "px" })
  } else {
    $(".js-swatch").css({ maxHeight: ["calc(", $(".js-swatches").height(), "px - 30%)"].join('') })
  }

  $(".js-tab-back:not(.js-tab-back-all)").width($(".js-tab-cnr").height())
  $(".js-tab-back-all").width($(".js-tab-cnr").height() * 2)
  $(".js-tab-back-all").css({ fontSize: ($(".js-tab-back-all").height() * 0.75) + "px" })
  $(".js-letter-label").height($("js-bag-input").height())
  $(".js-letters").height(($(".js-bag-custom").height() * state.letterAspectHeight) + "px").children("js-letter").width(25)
  $(".fa.fa-arrow-right,.fa.fa-arrow-left").css({ fontSize: $(".js-letter-label").height() + "px" })


  $(".js-tab-back:not(.js-tab-back-all)").each(function() {
    $(this).children(".js-tab").width($(this).children(".js-tab").height() * (letterSpacings[state.letters[$(this).children(".js-tab").data("index")]]["img"].width / letterSpacings[state.letters[$(this).children(".js-tab").data("index")]]["img"].height))
  })
  $("img.js-letter").each(function() {
    $(this).width($(this).height() * (letterSpacings[state.letters[$(this).data("index")]]["img"].width / letterSpacings[state.letters[$(this).data("index")]]["img"].height))
  })
  $("img.js-letter").each(function() {
    $(this).width($(this).height() * (letterSpacings[state.letters[$(this).data("index")]]["img"].width / letterSpacings[state.letters[$(this).data("index")]]["img"].height))
  })
  $(".js-bag-color-link").each(function() {
    if ($(this).attr('data-loaded')) {
      $(this).parents('.js-bag-color-thumb').width($(this).width())
    }
  })
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
    $('.js-tab-cnr').find('.js-tab:not([data-index=-1])').parents('.js-tab-back').remove()
    $('.js-tab').html('')
    $('.js-preview').html('')
    $('.js-tab').removeClass('active')
    $('.js-tab-back').removeClass('active')
    $('.js-swatch').removeClass('active')
    $('.js-loading').hide()

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

    // render letters in bag and preview and adds tabs
    state.letters.split('').forEach(function(l, i) {
      var letter = Letter({ letter: l, material: state.materials[i], index: i })
      var tab = Tab({ letter: l, material: state.materials[i], index: i })
      $('.js-loading').show()
      $('.js-letters').append(letter)
      const tabSelector = ['.js-tab[data-index=', i - 1, ']'].join('')
      $(tabSelector).parents('.js-tab-back').after(tab)

      letter[0].onload = function() {
        letter.css({ marginLeft: letter.width() * letterSpacings[l.toUpperCase()]["left"] + "px", marginRight: letter.width() * letterSpacings[l.toUpperCase()]["right"] + "px" })
        $('.js-loading').hide()
        if (state.activeLetter === i) {
          $('.js-preview').append(letter.clone())
        }
      }
    })

    // render tabs
    $('.js-tab-all').html('ALL')

    // select input if we're showing a new input
    if (state.editing !== lastState.editing || (state.activeLetter !== lastState.activeLetter && state.activeLetter === state.letters.length)) {
      $('.js-input').select()
    }

    // render active tab
    const activeTabSelector = ['.js-tab[data-index=', state.activeLetter, ']'].join('')
    $(activeTabSelector).addClass('active').parents('.js-tab-back').addClass('active')

    // render active swatch
    if (state.activeLetter > -1) {
      const activeSwatchSelector = ['.js-swatch[data-color=', state.materials[state.activeLetter], ']'].join('')
      $(activeSwatchSelector).addClass('active')
    } else {
      const activeSwatchSelector = ['.js-swatch[data-color=', state.materials[state.activeLetter + 1], ']'].join('')
      $(activeSwatchSelector).addClass('active')
    }

    // set value of inputs
    $('.js-bag-input').val(state.letters)
    $('.js-input').val(state.letters[state.activeLetter])
  }
  // update shopify hidden input
  updateCustomInfo()
  resize()
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
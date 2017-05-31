var isSale = true

$(document).ready(function() {
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
    $('#custombar').parent().css({ position: 'relative', overflow: 'hidden' })
    $('#custombar').before(html).remove()
    render()
    resize()
  })
})

var state = {
  bag: {
    color: 'black',
    style: 'danny',
    height: 8.5,
    width: 12
  },
  letters: 'AA',
  letterAspectHeight: 0.26,
  materials: ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
  positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  activeLetter: -1,
  editing: false,
  editingBag: false,
  step: "custom-bar",
  navActive: false
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

  var newState = { letters: $(this).val() }

  // reset active letter pointer if letters are deleted
  if( $(this).val().length < state.letters.length ) {
    const letterIndexes = $(this).val().length - 1;
    newState.activeLetter = Math.min(letterIndexes, state.activeLetter);
  }

  setState(newState)
})
$(document).on('focus', '.js-bag-input', autoselect)
$(document).on('click', '.js-bag-input', autoselect)

// input to change a single letter
$(document).on('input', '.js-input', function(evt) {
  var letters = state.letters.split('')
  letters.splice(state.activeLetter, 1, $(this).val())

  setState({
    letters: letters.join(''),
  })
})
$(document).on('focus', '.js-input', autoselect)
$(document).on('click', '.js-input', autoselect)

// select material swatch for individual letter
$(document).on('click', '.js-swatch-link', function(evt) {
  var materials = state.materials.concat([])
  var color = $(this).data('color')
  if (state.editingBag) {
    materials = materials.map(function(m) { return color })
  } else {
    materials[state.activeLetter] = $(this).data('color')
  }

  setState({
    materials: materials
  })
})


// select bag style
$(document).on('click', '.js-bag-style-link', function(evt) {
  setState({
    bag: { color: state.bag.color, style: $(this).data('style') }
  })

})

// select bag color
$(document).on('click', '.js-bag-color-link', function(evt) {
  setState({
    bag: { color: $(this).data('color'), style: state.bag.style }
  })
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

// remove individual letter from bag
$(document).on('click', '.js-remove-letter', function(evt) {
  var letters = state.letters.split('')
  letters.splice(state.activeLetter, 1)
  setState({
    letters: letters.join(''),
    editing: false,
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

$(document).on('click', '.js-tab', function(evt) {
  if ($(this).data('index') > -1) {
    setState({
      editing: true,
      editingBag: false,
      activeLetter: $(this).data('index'),
    })
  } else {
    setState({
      editing: false,
      editingBag: true,
      activeLetter: $(this).data('index'),
    })
  }


})

// stop editing
$(document).on('click', '.js-close-palette', function(evt) {
  setState({
    editing: false,
    editingBag: false
  })
})

$(window).on('resize', resize)

function setState(newState) {
  lastState = $.extend({}, state)
  state = $.extend({}, state, newState)
  if (window.location.href.match(/localhost/)) {
    console.log('set', newState, 'state is now', state)
  }
  render()
}

function updateCustomInfo() {
  var productDescription = state.bag.style + "-" + state.bag.color
  if (state.letters.length > 0) {
    productDescription += [' / ', state.letters[0].toUpperCase(), '-', state.materials[0]].join('')
  }
  if (state.letters.length > 1) {
    productDescription += [' / ', state.letters[1].toUpperCase(), '-', state.materials[1]].join('')
  }
  $("#custombar-custom-info").val(productDescription);
}

function resize() {
  $("#customBarSectionMain").height($("#customBarSectionMain").parent().height() + "px")
  $(".js-tab-cnr").height($(".js-tab-back:not(.js-tab-back-all)").width())
  $(".js-tab-back-all").css({ fontSize: ($(".js-tab-cnr").height() * 0.75) + "px" })
  $(".js-swatch").height(($(".js-palette").height() / 3) + "px")
  $(".js-letter-label").height($("js-bag-input").height())
  $(".js-letters").height(($(".js-bag-custom").height() * state.letterAspectHeight) + "px")
}


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


    // render bag color
    $('.js-bag-custom').css({ backgroundImage: "url(" + (window.baseUrl || '') + "assets/img/bags/" + state.bag.style + "-" + state.bag.color + ".png)" })


    // render letters in bag and preview and adds tabs

    state.letters.split('').forEach(function(l, i) {
      var letter = Letter({ letter: l, material: state.materials[i], index: i })
      var tab = Tab({ letter: l, material: state.materials[i], index: i })
      $('.js-loading').show()
      $('.js-letters').append(letter)
      const tabSelector = ['.js-tab[data-index=',i-1,']'].join('')
      $(tabSelector).parents('.js-tab-back').after(tab)
      letter[0].onload = function() {
        $('.js-loading').hide()
        if (state.activeLetter === i) {
          $('.js-preview').append(letter.clone())
        }
      }
    })

    // render tabs
    $('.js-tab').each(function() {
      if ($(this).data('index') == -1) {
        $(this).html('All')
      } else {
        var ind = $(this).data('index')
        var src = [window.baseUrl || '', 'assets/img/letters/', state.letters[ind].toUpperCase(), '-', state.materials[ind], '.png'].join('')
        $(this).css({ background: "url(" + (window.baseUrl || '') + src + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
      }
    })

    // select input if we're showing a new input
    if (state.editing !== lastState.editing || (state.activeLetter !== lastState.activeLetter && state.activeLetter === state.letters.length)) {
      $('.js-input').select()
    }

    // render active tab
    const activeTabSelector = ['.js-tab[data-index=',state.activeLetter,']'].join('')
    $(activeTabSelector).addClass('active').parents('.js-tab-back').addClass('active')

    // render active swatch
    if( state.activeLetter > -1 ) {
      const activeSwatchSelector = ['.js-swatch[data-color=',state.materials[state.activeLetter],']'].join('')
      $(activeSwatchSelector).addClass('active')
    }

    // set value of inputs
    $('.js-bag-input').val(state.letters)
    $('.js-input').val(state.letters[state.activeLetter])
  }
  // update shopify hidden input
  updateCustomInfo()
}



function autoselect() {
  $(this).select()
}

function Letter(props) {
  var alt = [props.letter,' in ',props.material].join('')
  var src = [window.baseUrl || '','assets/img/letters/',props.letter.toUpperCase(),'-',props.material,'.png'].join('')
  var html = ['<img src="',src,'" alt="',alt,'" class="js-letter" data-index="',props.index,'"/>'].join('')
  return $(html)
}

function Tab(props) {
  var alt = [props.letter,' in ', props.material].join('')
  var src = [window.baseUrl || '','assets/img/letters/',props.letter.toUpperCase(),'-',props.material,'.png'].join('')
  var html = [
    '<div class="tab-back js-tab-back">',
      '<img src="',src,'" alt="',alt,'" class="tab js-tab" data-index="',props.index,'"/>',
    '</div>',
  ].join('')

  return $(html)
}

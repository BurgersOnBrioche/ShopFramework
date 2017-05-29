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
      $('.js-bag').on('click', function() {})
    }, 1000)
    // get template html and embed it in the page
  fetch((window.baseUrl || '') + '/assets/html/custombar.html').then(function(response) {
    return response.text()
  }).then(function(html) {
    html = html.replace(/assets\/img\//g, (window.baseUrl || '') + 'assets/img/')
    $('#custombar').parent().css({ position: 'relative', overflow: 'hidden' })
    $('#custombar').before(html).remove()
    render()
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
  materials: ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'],
  positions: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
  activeLetter: 0,
  editing: true,
  editingBag: true,
}

var lastState = Object.assign({}, state);

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
  setState({
    letters: $(this).val()
  })
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

// select bag type
$(document).on('click', '.js-bag-link', function(evt) {
  setState({
    bag: { color: $(this).data('color'), style: $(this).data('style') }
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

function setState(newState) {
  lastState = Object.assign({}, state)
  state = Object.assign({}, state, newState)
  if (window.location.href.match(/localhost/)) {
    console.log('set', newState, 'state is now', state)
  }
  render()
}

function updateCustomInfo() {
  var productDescription = state.bag.style + "-" + state.bag.color
  if (state.letters.length > 0) {
    productDescription += ` / ${state.letters[0].toUpperCase()}-${state.materials[0]}`
  }
  if (state.letters.length > 1) {
    productDescription += ` / ${state.letters[1].toUpperCase()}-${state.materials[1]}`
  }
  $("#custombar-custom-info").val(productDescription);
}

function render() {
  // reset
  $('.js-letters').find('.js-letter').remove()
  $('.js-tab-cnr').find('.js-tab:not([data-index=-1])').parents('.js-tab-back').remove()
  $('.js-tab').html('')
  $('.js-preview').html('')
  $('.js-tab').removeClass('active')
  $('.js-tab-back').removeClass('active')
  $('.js-swatch').removeClass('active')
  $('.js-loading').hide()

  // render bag color
  $('.js-bag').css({ backgroundImage: "url(" + (window.baseUrl || '') + "assets/img/bags/" + state.bag.style + "-" + state.bag.color + ".png)" })


  // render letters in bag and preview and adds tabs

  state.letters.split('').forEach(function(l, i) {

      var letter = Letter({ letter: l, material: state.materials[i], index: i })
      var tab = Tab({ index: i })

      $('.js-loading').show()
      $('.js-letters').append(letter)
      $(`.js-tab[data-index=${i-1}]`).parents('.js-tab-back').after(tab)
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
        var src = `${window.baseUrl || ''}assets/img/letters/` + state.letters[ind].toUpperCase() + `-` + state.materials[ind] + `.png`;
        $(this).css({ background: "url(" + (window.baseUrl || '') + src + ") no-repeat", backgroundSize: "contain", backgroundPosition: "center" })
      }
    })
    // show editor palette

  /*
  if (state.editing) {
    $('.js-palette').show().removeClass('closed')

    if (state.editingBag) {
      $('.js-bag-editor').show()
      $('.js-letter-editor').hide()
    } else {
      $('.js-letter-editor').show()
      $('.js-bag-editor').hide()
    }
  } else if (lastState.editing) {
    $('.js-palette').addClass('closed')
    $('input').blur()
  }
  */

  // select input if we're showing a new input
  if (state.editing !== lastState.editing || (state.activeLetter !== lastState.activeLetter && state.activeLetter === state.letters.length)) {
    $('.js-input').select()
  }

  // render active tab

  $(`.js-tab[data-index=${state.activeLetter}]`).addClass('active')
  $(`.js-tab[data-index=${state.activeLetter}]`).parents('.js-tab-back').addClass('active')

  // render active swatch
  $(`.js-swatch[data-color=${state.materials[state.activeLetter]}]`).addClass('active')

  // set value of inputs
  $('.js-bag-input').val(state.letters)
  $('.js-input').val(state.letters[state.activeLetter])

  // update shopify hidden input
  updateCustomInfo()
}

function autoselect() {
  $(this).select()
}

function Letter(props) {
  var alt = `${props.letter} in ${props.material}`
  var src = `${window.baseUrl || ''}assets/img/letters/${props.letter.toUpperCase()}-${props.material}.png`;
  return $(`
    <img src="${src}" alt="${alt}" class="js-letter" data-index="${props.index}"/>
  `)
}

function Tab(props) {
  return $(`
    <div class="tab-back js-tab-back">
      <div class="tab js-tab" data-index="${props.index}"></div>
    </div>
  `)
}
var imageCache = {}

function loadImage(src, cb) {
  if (!imageCache[src]) {
    imageCache[src] = new Image
    imageCache[src].src = src
  }
  imageCache[src].onload = function() {
    imageCache[src].loaded = true
    cb()
  }
}
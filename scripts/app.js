'use strict';

var rainbow = new Pizazz({
  size: 20,
  buffer: 10,
  spacing: 20,
  speed: 1,
  strokeWidth: 2,
  stroke: '#FF356A'
});

var showT;

var showToaster = function(content, duration) {
  var toaster = document.querySelector('.toaster');
  clearTimeout(showT);
  toaster.innerText = content;
  toaster.classList.add('show');
  showT = setTimeout(function() {
    toaster.classList.remove('show');
  }, duration);
};

var copyToClipboard = function(content) {
  var getInput = function() {
    var input = document.querySelector('#copyInput');
    if(input === null) {
      input = document.createElement('textarea');
      input.setAttribute('id', 'copyInput');
      input.setAttribute('style', 'position: absolute; left: -999em;');
      document.body.appendChild(input);
    }
    else {
      input.style.position = 'absolute';
      input.style.left = '-999em';
    }
    return input;
  };
  var input = getInput();
  input.value = content;
  input.select();
  document.execCommand('copy');
};

var playRainbow = function(event) {
  rainbow.play(event.target);
};

var bindEvents = function() {
  document.querySelector('.email').onclick = function() {
    copyToClipboard('g.hastings3@gmail.com');
    showToaster('Copied to clipboard.', 3000);
    rainbow.play(this);
  };

  // var fauxLinks = document.querySelectorAll('a');
  // fauxLinks.forEach(function(link){
  //   link.onclick = fakeAjaxPageLoad;
  // });
};

var lazyLoadElements = function(direction, amt) {
  var itemsToRender = [...document.querySelectorAll('.lazy-load')];
  var delay = amt ? amt : 2000;
  setTimeout(function() {
    if(direction === 'in') {
      document.getElementById('move_text').classList.add('muted');
    }
    else{
      document.getElementById('move_text').classList.remove('muted');
    }
    for(var item of itemsToRender) {
      item.classList.add('show');
      if(direction === 'in') {
        item.classList.add('show');
      }
      else{
        item.classList.remove('show');
      }
    }
  }, delay);
};

var renderCopyrightYear = function() {
  var date = new Date();
  var year = date.getYear();
  document.getElementById('copyright').innerHTML = `${1900 + year}`;
};

var genRandomFloat = function(min, max) {
  return Math.random() * (max - min) + min;
};

var fakeAjaxPageLoad = function(e) {
  const link = e.target.getAttribute('href');
  e.preventDefault();
  playRainbow(e);
  setTimeout(function() {
    window.location = link;
  }, 500);
  return false;
};

var initMovingText = function() {
  var el = document.getElementById('move_text').querySelector('.nt-inner');
  var text = [...el.innerHTML.toString()];
  el.innerHTML = '';
  var frag = document.createDocumentFragment();
  text.forEach(function(char){
    const span = document.createElement('span');
    span.setAttribute('data-magnetic', genRandomFloat(-0.1, 0.1));
    if(char === '-') {
      char = document.createElement('img');
      char.setAttribute('src', 'assets/images/selfportrait.png');
      span.appendChild(char);
    }
    else {
      span.innerText = char;
    }
    frag.appendChild(span);
  });
  el.appendChild(frag);
  Magnetic.init({
    repel: false
  });
};

var init = function() {
  // lazyLoadElements('in', 0);
  initMovingText();
  // getBitcoinPrice();
  renderCopyrightYear();
  bindEvents();
};

init();

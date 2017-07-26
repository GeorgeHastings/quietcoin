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
  // initMovingText();
  // Magnetic.init({
  //   repel: false
  // });
  initCanvasJawn();
  renderCopyrightYear();
  bindEvents();
};

var initCanvasJawn = function() {
  const canvas = document.getElementById('jawn');
  const dpr = window.devicePixelRatio || 1;
  const ctx = canvas.getContext('2d');
  const fps = 60;
  const POLY = 45;
  const STEP = 2*Math.PI/POLY;
  const LENGTH = 2 * Math.PI;
  const CENTER = {
    x: canvas.width/4,
    y: canvas.height/4
  };
  let startingTheta = 0;
  let radius = 140;
  let count = 1000;
  let ampX = 1;
  let ampY = 1;

  ctx.scale(dpr,dpr);
  // let ij;
  //
  // document.body.onmousedown = function(e) {
  //   count = 2000;
  //   radius = 105;
  //   ampX = 3;
  //   ampY = 3;
  // };
  // document.body.onmouseup = function() {
  //   count = 2000;
  //   radius = 140;
  //   ampY = 1;
  //   ampX = 1;
  // };
  // document.body.onmousemove = function(e) {
  //   count += 1;
  // };

  var myGrad = ctx.createRadialGradient(canvas.height/4, canvas.height/4, canvas.height/4, canvas.height/4, canvas.height/1.5, 0);
  myGrad.addColorStop(1,'#6915EF');
  myGrad.addColorStop(0.33, '#FF356A');
  myGrad.addColorStop(0,'#F8D451');

  ctx.strokeStyle = 'transparent';

  var draw = function() {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.beginPath();

    for(let theta = startingTheta;  theta < LENGTH;  theta += STEP) {
      let x = CENTER.x + radius * Math.cos(theta) + (Math.sin((count)/(LENGTH + STEP*theta)))*ampX;
      let y = CENTER.y - radius * Math.sin(theta) + (Math.sin((count)/(LENGTH - STEP*theta)))*ampY;
      ctx.lineTo(x,y);
    }
    ctx.closePath();
    ctx.fillStyle = myGrad;
    ctx.fill();
  	ctx.stroke();
  };

  // var draw = function() {
  //   animate();
  //   count++;
  // };

  function resizeCanvas() {
  	// canvas.width = window.innerWidth;
  	// canvas.height = window.innerHeight
  }

  (function(){
  	var now;
  	var then = Date.now();
  	var interval = 1000/fps;
  	var delta;
  	function tick() {

  			now = Date.now();
  			delta = now - then;

  			if (delta > interval) {
  					then = now - (delta % interval);
            count++;
  					draw();
  			}
  			requestAnimationFrame(tick);
  	}
  	window.addEventListener('resize', resizeCanvas, false);
  	resizeCanvas();
  	tick();
  })();
};

init();

'use strict';

const height = 100;
const width = 300;
const $indicator = document.querySelector('.indicator');
const $tokenMultiplier = document.querySelector('.token-multiplier');
const $tokenRate = document.querySelector('.token-rate');
const $tokenAccrued = document.querySelector('.token-accrued');
const $connection = document.querySelector('.connection');

let showT;
let connection;
let tokenAccrued = 0;

class Stopwatch {
    constructor(display, results) {
        this.running = false;
        this.display = display;
        this.results = results;
        this.laps = [];
        this.reset();
        this.print(this.times);
    }

    reset() {
        this.times = [ 0, 0, 0 ];
    }

    start() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
    }

    lap() {
        let times = this.times;
        let li = document.createElement('li');
        li.innerText = this.format(times);
        this.results.appendChild(li);
    }

    stop() {
        this.running = false;
        this.time = null;
    }

    restart() {
        if (!this.time) this.time = performance.now();
        if (!this.running) {
            this.running = true;
            requestAnimationFrame(this.step.bind(this));
        }
        this.reset();
    }

    clear() {
        clearChildren(this.results);
    }

    step(timestamp) {
        if (!this.running) {
          return;
        }
        else {
          this.calculate(timestamp);
          this.time = timestamp;
          this.print();
          requestAnimationFrame(this.step.bind(this));
        }
    }

    calculate(timestamp) {
        var diff = timestamp - this.time;
        // Hundredths of a second are 100 ms
        this.times[2] += diff / 10;
        // Seconds are 100 hundredths of a second
        if (this.times[2] >= 100) {
            this.times[1] += 1;
            this.times[2] -= 100;
        }
        // Minutes are 60 seconds
        if (this.times[1] >= 60) {
            this.times[0] += 1;
            this.times[1] -= 60;
        }
    }

    print() {
        this.display.innerText = this.format(this.times);
    }

    format(times) {
        return `\
${pad0(times[0], 2)}:\
${pad0(times[1], 2)}:\
${pad0(Math.floor(times[2]), 2)}`;
    }
}

function pad0(value, count) {
    var result = value.toString();
    for (; result.length < count; --count)
        result = '0' + result;
    return result;
}

function clearChildren(node) {
    while (node.lastChild)
        node.removeChild(node.lastChild);
}

let stopwatch = new Stopwatch(
    document.querySelector('#timer'),
    document.querySelector('.results'));

var showToaster = function(content, duration, theme) {
  var toaster = document.querySelector('.toaster');
  clearTimeout(showT);
  toaster.innerText = content;
  toaster.classList.add('show', theme);
  showT = setTimeout(function() {
    toaster.classList.remove('show', theme);
  }, duration);
};

var predictRewardMultiplier = function(x) {
  let y = -2.498809734 * Math.pow(10, -6) * Math.pow(x, 8) + 1.232354114 * Math.pow(10, -4) * Math.pow(x, 7) - 2.425819332 * Math.pow(10, -3) * Math.pow(x, 6) + 2.412134725 * Math.pow(10, -2) * Math.pow(x, 5) - 1.256111626 * Math.pow(10, -1) * Math.pow(x, 4) + 3.167123624 * Math.pow(10, -1) * Math.pow(x, 3) - 3.225306339 * Math.pow(10, -1) * Math.pow(x, 2) + 3.548267264 * Math.pow(10, -1) * x - 5.693266219 * Math.pow(10, -4);
  return y;
};

var genPointsToNth = function(n) {
  let int = 12/n;
  const result = [];
  for(let i = 0; i < 12; i += int) {
    result.push(predictRewardMultiplier(i));
  }
  return result;
};

var checkConnection = function() {
  connection = window.navigator.onLine;
  if(!stopwatch.running && !connection) {
    showToaster('Offline', 4000, 'good');
    $connection.classList = 'connection on';
    $connection.innerText = 'Offline';
    document.body.classList = 'offline';
    stopwatch.start();
  }
  else if(stopwatch.running && connection) {
    showToaster('Online', 4000, 'bad');
    $connection.classList = 'connection off';
    $connection.innerText = 'Go offline to collect QIT';
    document.body.classList = 'online';
    stopwatch.stop();
  }
  requestAnimationFrame(checkConnection);
};

var getCurrentTime = function() {
  let now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let millis = now.getMilliseconds()/1000;
  let convertedTime = (hours - 8) + minutes/60 + millis;
  let inActiveHours = convertedTime >= 0 && convertedTime < 12;
  if(inActiveHours) {
    let progress = ((convertedTime/12)*100).toFixed(1);
    let tokenMultiplier = predictRewardMultiplier(convertedTime);
    $indicator.setAttribute('style', `left: ${progress}%; top: ${((1 - tokenMultiplier)*100).toFixed(1)}%`);
    minutes = minutes < 10 ? '0'+minutes : minutes;
    $indicator.setAttribute('data-time', `${hours}:${minutes}`);
    $tokenMultiplier.innerText = tokenMultiplier * 0.1;
    $tokenRate.innerText = tokenMultiplier *60 * 0.1;


    if(!connection) {
      tokenAccrued += tokenMultiplier;
      $tokenAccrued.innerText = tokenAccrued*0.1;
    }
  }
  else {
    showToaster('After hours', 4000, 'off');
    $connection.classList = 'connection off';
    $connection.innerText = 'After hours';
    $indicator.setAttribute('style', 'display: none;');
  }
};

var plot = function(key, values) {
  const graph = document.getElementById(key);
  const data = values;
  const dpr = window.devicePixelRatio || 1;
  var ctx = graph.getContext('2d'),
    total = data.length,
    range = Math.max(...data),
    xstep = width/(total - 1),
    ystep = range/height,
    x = 0,
    y = height - data[0]/ystep;
  graph.width = width;
  graph.height = height;
  ctx.clearRect(0,0,graph.width, graph.height);
  ctx.beginPath();
  ctx.strokeStyle = '#525568';
  ctx.moveTo(x, y);
  for (let i = 0; i < total; i++) {
    x = i * xstep;
    var adj = range < 0 ? data[i] : data[i] - Math.min(...data);
    y = height - adj/ystep;
    ctx.lineTo(x, y);
  }
  ctx.stroke();
  ctx.scale(dpr,dpr);
};

plot('plot', genPointsToNth(48));

(function() {
  if (!connection) {
    stopwatch.start();
  }
  checkConnection();
  getCurrentTime();
  setInterval(function() {
    getCurrentTime();
  }, 1000);
})();

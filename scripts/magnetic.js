'use strict';

let winWidth;
let winHeight;
let winScrollY = 0;

var Magnetic = {
  winWidth,
  winHeight,
  repel: false,
  getY: function(event) {
			var yPos = event.pageY - winHeight/2 - winScrollY;
			return yPos;
	},
  getX: function(event) {
    var xPos = event.pageX - winWidth/2;
    return xPos;
  },
  move: function(event) {
    for (var el of Magnetic.elements) {
      var speed = el.getAttribute('data-magnetic');
      speed = Magnetic.repel ? speed * -1 : speed;
      var adjusetedX = (speed*Magnetic.getX(event)).toFixed(0);
      var adjusetedY = (speed*Magnetic.getY(event)).toFixed(0);
      // var rotation = (adjusetedX * 0.1).toFixed(0);
      var opacity = 1 - (adjusetedY * 0.1).toFixed(0);
      var transform = `transform: translate3d(${adjusetedX}px,${adjusetedY}px,0)`;
      el.setAttribute('style', transform);
    }
  },
  bindEvents: function() {
    document.body.onmousemove = Magnetic.move;
    // window.scroll = function() {
    //   winScrollY = window.scrollY;
    // };

  },
  init: function(args) {
    this.repel = args && args.repel ? true : false;
    this.elements = [...document.querySelectorAll('[data-magnetic]')];
    winWidth = window.innerWidth;
    winHeight = window.innerHeight;
    this.bindEvents();
  }
};

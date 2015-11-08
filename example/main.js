'use strict';

var WebGLHeatmap = require('../index');
var fs = require('fs');

window.onload = function onload() {
    var canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    document.body.appendChild(canvas);
    var gradient = fs.readFileSync('./deep-sea-gradient.png', 'base64');
    var gradient = fs.readFileSync('./skyline-gradient.png', 'base64');
    var image = new Image();
    image.src = 'data:image/png;base64,' + gradient;
    var heatmap = new WebGLHeatmap({
        canvas: canvas,
        intensityToAlpha: true,
        alphaRange: [0, 1],
        // inverse transparency
        // alphaRange: [1, 0],
        // steep transparency
        // alphaRange: [0, 0.05],
        gradientTexture: image
    });

    document.body.appendChild(heatmap.canvas);

    var paintAtCoord = function paintAtCoord(x, y) {
        var count = 0;
        while(count < 200){
            var xoff = Math.random()*2-1;
            var yoff = Math.random()*2-1;
            var l = xoff*xoff + yoff*yoff;
            if(l > 1){
                continue;
            }
            var ls = Math.sqrt(l);
            xoff/=ls; yoff/=ls;
            xoff*=1-l; yoff*=1-l;
            count += 1;
            heatmap.addPoint(x+xoff*50, y+yoff*50, 30, 2/300);
        }
    }

    // event handling
    var onTouchMove = function(evt){
        evt.preventDefault();
        var touches = evt.changedTouches;
        for(var i=0; i<touches.length; i++){
            var touch = touches[i];
            paintAtCoord(touch.pageX, touch.pageY);
        }
    };
    canvas.addEventListener("touchmove", onTouchMove, false);

    canvas.onmousemove = function(event){
        var x = event.offsetX || event.clientX;
        var y = event.offsetY || event.clientY;

        paintAtCoord(x, y);
            
    }
    canvas.onclick = function(){
        heatmap.clear();
    }

    var raf = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                             window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

    var update = function(){
        //heatmap.addPoint(100, 100, 100, 10/255);
        heatmap.adjustSize(); // can be commented out for statically sized heatmaps, resize clears the map
        heatmap.update(); // adds the buffered points
        heatmap.display(); // adds the buffered points
        //heatmap.multiply(0.9995);
        //heatmap.blur();
        //heatmap.clamp(0.0, 1.0); // depending on usecase you might want to clamp it
        raf(update);
    }
    raf(update);
}

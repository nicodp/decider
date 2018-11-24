/*jslint for*/
/*global window, document, setInterval, Audio*/
(function () {
    'use strict';

    var canvas;
    var canvasContext;

    var candidates = [];
    var wheelSlices = [];
    var wheelSpeed = 1000;
    var wheelPosition = 0;
    var WHEEL_FRICTION = 5;

    var wheelRunning = false;

    var colors = ['purple', 'fuchsia', 'navy', 'blue', 'teal', 'aqua', 'green', 'lime', 'olive', 'yellow', 'maroon', 'red'];
    var currentWinner = '';

    function moveEverything() {
        if (!wheelRunning) {
            return;
        }

        wheelPosition = wheelPosition + wheelSpeed;
        wheelSpeed = wheelSpeed - WHEEL_FRICTION;
        if (wheelSpeed < 0) {
            wheelSpeed = 0;
            wheelRunning = false;
        }
    }

    function drawRect(leftX, topY, width, height, drawColor) {
        canvasContext.fillStyle = drawColor;
        canvasContext.fillRect(leftX, topY, width, height);
    }

    function drawArrow() {
        var centerY = canvas.height / 2;
        var edgeX = canvas.width / 2 + canvas.height / 3;

        canvasContext.fillStyle = 'black';
        canvasContext.beginPath();
        canvasContext.moveTo(edgeX + 20, centerY - 5);
        canvasContext.lineTo(edgeX + 20, centerY + 5);
        canvasContext.lineTo(edgeX - 10, centerY);
        canvasContext.fill();
    }

    function drawWheel() {
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;
        var radius = canvas.height / 3;

        var slice = (Math.PI * 2) / wheelSlices.length;
        var offset = (wheelPosition * (Math.PI / 8000)) % (Math.PI * 2);

        var i;
        for (i = 0; i < wheelSlices.length; i += 1) {
            // if the arrow points to this candidate
            if (offset + slice * i < Math.PI * 2 && offset + slice * (i + 1) > (Math.PI * 2)) {
                // and we are still playing
                if (wheelRunning) {
                    currentWinner = wheelSlices[i];
                }
            }
            canvasContext.fillStyle = colors[i % colors.length];
            canvasContext.beginPath();
            // piece of cake... I mean, draw a piece of cake
            canvasContext.moveTo(centerX, centerY);
            canvasContext.arc(centerX, centerY, radius, offset + slice * i, offset + slice * (i + 1), false);
            canvasContext.lineTo(centerX, centerY);
            canvasContext.fill();
            // label
            canvasContext.save();
            canvasContext.translate(canvas.width / 2, canvas.height / 2);
            canvasContext.rotate(offset + slice * (i + 0.5));
            canvasContext.fillStyle = 'black';
            canvasContext.fillText(wheelSlices[i], 100, 10);
            canvasContext.restore();
        }

        // mid circle
        canvasContext.fillStyle = 'black';
        canvasContext.beginPath();
        canvasContext.arc(centerX, centerY, 20, 0, Math.PI * 2, false);
        canvasContext.fill();
    }

    function drawEverything() {
        // background
        drawRect(0, 0, canvas.width, canvas.height, 'white');

        if (candidates.length > 0) {
            // draw wheel
            drawWheel();
            // draw arrow
            drawArrow();
        } else {
            canvasContext.fillStyle = 'black';
            canvasContext.fillText('Choose candidates', canvas.width / 2, canvas.height / 2);
        }

        if (!wheelRunning && currentWinner) {
            canvasContext.fillStyle = 'black';
            canvasContext.fillText('Congratulations to ' + currentWinner, 250, 50);
        }
    }

    window.onload = function () {
        canvas = document.getElementById('canvas');
        canvasContext = canvas.getContext('2d');
        canvasContext.font = "30px Arial";

        var framesPerSecond = 60;
        setInterval(function () {
            moveEverything();
            drawEverything();

        }, 1000 / framesPerSecond);

        canvas.addEventListener('mousedown', function () {
            wheelSpeed = 1000;
            wheelPosition = Math.random() * 30000;
            wheelRunning = true;
        });

        // add or remove candidates on button click
        document.getElementById('candidates').addEventListener('mousedown', function (event) {
            if (event.target.tagName === 'BUTTON') {
                event.target.classList.toggle('selected');
                // candidate list changed - don't show winner
                currentWinner = '';
                if (event.target.classList.contains('selected')) {
                    candidates.push(event.target.innerText);
                } else {
                    var idx = candidates.indexOf(event.target.innerText);
                    if (idx > -1) {
                        candidates.splice(idx, 1);
                    }
                }
                wheelSlices = [];
                while (wheelSlices.length < 8) {
                    wheelSlices = wheelSlices.concat(candidates);
                }
            }
        }, false);
    };

}());
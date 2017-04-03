var good = document.querySelector('#good');
var bad = document.querySelector('#bad');
var p_bar_left = document.querySelector('#progressbar-left');
var p_bar_right = document.querySelector('#progressbar-right');
var counter_left = 0;
var counter_right = 0;
var percent_left = 0;
var percent_right = 0;

var $ = document.querySelector.bind(document);

var blueAmount = $('#blue .percent-amount');
var redAmount = $('#red .percent-amount');
var percentLeft = $('#progressbar-left .percent-value');
var percentRight = $('#progressbar-right .percent-value');

function changePercent(increment, which) {
    if (which == 'left') {
        counter_left += increment;
    } else if (which == 'right') {
        counter_right += increment;
    } else {
        throw "Don't know which value to increase.";
    }
    percent_left = (counter_left / (counter_left + counter_right)) * 100;
    percent_right = (counter_right / (counter_left + counter_right)) * 100;
    p_bar_left.style.width = percent_left + '%';
    p_bar_right.style.width = percent_right + '%';
    document.querySelector('#total-amount').innerText = counter_right + counter_left;

    var updating = true;

    function updateWidth() {
        if (!updating) {
            //ensure the result is correct
            updatePercent(percent_left.toFixed(2) + '%', percent_right.toFixed(2) + '%');
            return;
        }

        function width(dom) {
            return parseInt(window.getComputedStyle(dom).getPropertyValue('width').replace(/px/i, ''))
        }

        var left = width(p_bar_left) / (width(p_bar_left) + width(p_bar_right)) * 100;
        var right = 100 - left;

        function updatePercent(left, right) {
            blueAmount.textContent = left;
            redAmount.textContent = right;
            percentLeft.textContent = leftFixed;
            percentRight.textContent = rightFixed;
        }
        var leftFixed = left.toFixed(2) + '%';
        var rightFixed = right.toFixed(2) + '%';
        updatePercent(leftFixed, rightFixed);

        requestAnimationFrame(updateWidth);
    }
    requestAnimationFrame(updateWidth);
    setTimeout(function () {
        updating = false;
    }, 2000);
    return function stop() {
        updating = false;
    }
}

var stop;
good.addEventListener('click', function () {
    stop && stop();
    stop = changePercent(1, 'left');
});
bad.addEventListener('click', function () {
    stop && stop();
    stop = changePercent(1, 'right');
});

var tooltip = document.querySelectorAll('.tooltip');
var tooltipelement = document.querySelectorAll('#progressbar-left, #progressbar-right');

for (var x = tooltipelement.length; x--;) {
    tooltipelement[x].addEventListener('mousemove', function (e) {
        for (var i = tooltip.length; i--;) {
            tooltip[i].style.left = e.pageX + 20 + 'px';
            tooltip[i].style.top = e.pageY + 'px';
        }
    });
}
var w = 600;
var h = 600;


var viz = d3.select("#viz")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(40,100)");


var patternsSvg = viz.append('g')
    .attr('class', 'patterns');

var labelholder = viz.append("g")
    .attr("class", "labelholder");

var treeholder = viz.append("g")
    .attr("class", "treeholder");


var userholder = viz.append("g")
    .attr("class", "userholder");


var data = [{
    "userName": "You",
    "userImage": "./1.jpg"
}, {
    "userName": "Johnny",
    "userImage": "./2.jpg"
}, {
    "userName": "Jeri",
    "userImage": "./3.png"
}, {
    "userName": "Charlize",
    "userImage": "./4.jpg"
}, {
    "userName": "Them",
    "userImage": "./5.png"
}]

var smallRadius = 20;
var bigRadius = 30;

var smallX = smallRadius + 15;
var bigX = bigRadius * 2 + 15;

var verticalGap = (bigRadius * 2) - 5;
var extendedY = 105; 
var arcRadiusLeft = 15;

$.each(data, function (index, value) {
    var defs = patternsSvg.append('svg:defs');

    //big design   
    defs.append('svg:pattern')
        .attr('id', index + "--" + value.userName.toLowerCase())
        .attr('width', 1)
        .attr('height', 1)
        .append('svg:image')
        .attr('xlink:href', value.userImage)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', bigRadius * 2)
        .attr('height', bigRadius * 2);

    //small design
    defs.append('svg:pattern')
        .attr('id', index + "-" + value.userName.toLowerCase())
        .attr('width', 1)
        .attr('height', 1)
        .append('svg:image')
        .attr('xlink:href', value.userImage)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', smallRadius * 2)
        .attr('height', smallRadius * 2);

});



var count = data.length;

//plot people circles
var circle = userholder.append("g").selectAll("circle")
    .data(data);

circle
    .enter()
    .append("svg:circle")
    .attr("id", function (d) {
        return d.userName.toLowerCase();
    })
    .attr("r", function (d, i) {
        var rad = smallRadius;

        //first and last items -- so you and them
        if (i == 0 || i == count - 1) {
            rad = bigRadius;
        }
        return rad;
    })
    .attr("cx", function (d, i) {
        var cx;
        if (i == 0) {
            cx = 0; //first one 
        } else if (i == count - 1) {
            cx = bigX; //last one
        } else {
            cx = smallX; //small ones
        }
        return cx;
    })
    .attr("cy", function (d, i) {
        var cy;
        if (i == 0) {
            cy = 0;
        } else if (i == count - 1) {
            cy = verticalGap * (i - 1) + extendedY;
        } else {
            cy = verticalGap * i
        }
        return cy;
    })
    .style("fill", function (d, i) {
        var id = i + "-" + d.userName.toLowerCase(); //small circles

        //large circles
        if (i == 0 || i == count - 1) {
            id = i + "--" + d.userName.toLowerCase();
        }
        return "url(#" + id + ")";
    });
//plot people circles



//__labels  
var labelholder = d3.select(".labelholder");

//__ enter
var labels = labelholder.selectAll("text")
    .data(data);

labels.enter()
    .append("text")
    .attr("text-anchor", "left")

//__ update            
labels
    .attr("x", function (d, i) {

        var displacement = 45;
        var cx = (smallRadius * 2);
        if (i == 0) {
            cx = bigRadius;
            displacement = 15;
        }
        if (i == count - 1) {
            cx = (bigRadius * 2) + bigRadius;
            displacement = 30;
        }

        cx += displacement;

        return cx;
    })
    .attr("y", function (d, i) {

        var cy = verticalGap * i;
        if (i == count - 1) {
            cy += extendedY;
        }

        return cy;
    })
    .text(function (d) {
        return d.userName;
    });
//__labels




var gx = 15;

var backbone = treeholder.append("g")
    .append("svg:path");

backbone.attr("d", function (d, i) {

    var sx = (bigRadius / 2) - gx;
    var tx = (bigRadius / 2) - gx;

    var r = smallRadius;
    if (i == 0 || i == count - 1) {
        r = bigRadius;
    }

    var sy = ((r / 2) * i) + (r);
//    var ty = (smallRadius * 2 * (count - 1));
    var ty = verticalGap * (count-2)-arcRadiusLeft;
    var dr = 0;

    return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0,1 " + tx + "," + ty;
});




var gx = 15;

var backbone = treeholder.append("g")
    .append("svg:path");

backbone.attr("d", function (d, i) {

    var sx = (bigRadius * 2) + gx;
    var tx = (bigRadius * 2) + gx;

    var r = smallRadius;
    if (i == 0 || i == count - 1) {
        r = bigRadius;
    }

    var sy = ((r / 2) * i) + (r) + smallRadius;
    var ty = (smallRadius * 2 * (count - 1)) + bigRadius + extendedY;

    var dr = 0;

    return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0,1 " + tx + "," + ty;
});


//branches on the left 
var leftpath = treeholder.append("g").selectAll("path.leftpath")
    .data(data)

leftpath
    .enter().append("svg:path")
    .attr("class", function (d) {
        return "leftpath";
    });

leftpath.attr("d", function (d, i) {
    var dist = bigRadius * 2;

    var sx = 0;
    var tx = arcRadiusLeft;

    var sy = verticalGap * i - arcRadiusLeft;
    var ty = verticalGap * i;

    if (i != 0 && i != count - 1) {
        return "M" + sx + "," + sy + "A" + arcRadiusLeft + "," + arcRadiusLeft + " 0 0,0 " + tx + "," + ty;
    }

});

//branches on the left 
var rightpath = treeholder.append("g").selectAll("path.rightpath")
    .data(data)

rightpath
    .enter().append("svg:path")
    .attr("class", function (d) {
        return "rightpath";
    });

rightpath.attr("d", function (d, i) {

    var dist = bigRadius * 2;

    var cy1 = (bigRadius * 2) * i - 15;
    var cy2 = (bigRadius * 2) * i;

    var sx = smallRadius * 2;
    var tx = smallRadius + 55;

    var sy = cy1;
    var ty = cy2;

    var dx = smallRadius,
        dy = (dist * i) + dist,
        dr = Math.sqrt(dx * dx + dy * dy);

    if (i != 0 && i != count - 1) {
        return "M" + sx + "," + sy + "A" + dr + "," + dr + " 0 0,0 " + tx + "," + ty;
    }

});
var data = [{
    "userName": "Rihanna",
    "userImage": "https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcSTzjaQlkAJswpiRZByvgsb3CVrfNNLLwjFHMrkZ_bzdPOWdxDE2Q",
    "userDetails": [{
        "Skills & Expertise": [{
            "id": 2,
            "tag": "Javascript"
    }, {
            "id": 3,
            "tag": "Design"
    }],
        "Location": [{
            "id": 0,
            "tag": "London"
    }, {
            "id": 1,
            "tag": "Germany"
    }],
        "Company": [{
            "id": 0,
            "tag": "The Old County"
    }]
  }]
}, {
    "userName": "Brad",
    "userImage": "https://lh3.googleusercontent.com/-XdASQvEzIzE/AAAAAAAAAAI/AAAAAAAAAls/5vbx7yVLDnc/photo.jpg",
    "userDetails": [{
        "Skills & Expertise": [{
            "id": 0,
            "tag": "JAVA"
    }, {
            "id": 1,
            "tag": "PHP"
    }, {
            "id": 2,
            "tag": "Javascript"
    }],
        "Location": [{
            "id": 0,
            "tag": "London"
    }],
        "Company": [{
            "id": 0,
            "tag": "The Old County"
    }, {
            "id": 1,
            "tag": "Bakerlight"
    }]
  }]
}]


const width=400;
const height=400;
var viz = d3.select("#viz")
    .append("svg")
    .attr("width", width+200)
    .attr("height", height+200)
    .append("g")
    .attr("transform", `translate(${100},${100})`)


var patternsSvg = viz
    .append('g')
    .attr('class', 'patterns');


function colores_google(n) {
    var colores_g = ["#f7b363", "#448875", "#c12f39", "#2b2d39", "#f8dd2f"];
    return colores_g[n % colores_g.length];
}


function getRadius(d) {
    var count = d.commonTags.split(",").length;
    var ratio = count * 2.3;

    if (count == 1) {
        ratio = 8;
    }

    return ratio;
}






//create patterns for user images
$.each(data, function (index, value) {
    var defs = patternsSvg.append('svg:defs');
    defs.append('svg:pattern')
        .attr('id', index + "-" + value.userName.toLowerCase())
        .attr('width', 1)
        .attr('height', 1)
        .append('svg:image')
        .attr('xlink:href', value.userImage)
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 75)
        .attr('height', 75);


    console.log(value.userDetails[0]);


});




//create common data assement


var data1 = [{
    "commonLabel": "Groups",
    "commonTags": "test1, test2, test3, test4, test5, test6, test7"
}, {
    "commonLabel": "Skills & Expertise",
    "commonTags": "test1, test2, test3, test1, test2, test3, test1, test2, test3, test1, test2"
}, {
    "commonLabel": "Location",
    "commonTags": "test1"
}, {
    "commonLabel": "Company",
    "commonTags": "test1"
}]



//add curved paths
var distanceBetween = height/(data1.length-1);

var pathStart = -400;

var path = viz.append("svg:g").selectAll("path")
    .data(data1)

path
    .enter().append("svg:path")
    .attr("class", function (d) {
        return "link "
    })

path.attr("d", function (d, i) {
    var sx = 0;    
    var sy = height/2;
    
    var tx = 235;
    var ty = 120;


    pathStart += 125;

    var dx = width/2;
    console.log("i",i);
    var dy = (1.5-i)*distanceBetween;
    var c = Math.sqrt(dx * dx + dy * dy);
    const a=width/2;
    const b=dy;
    console.log(a,b);
    var angle=Math.atan(a/b);
    var r=1/2*c/Math.cos(angle);
    console.log("dy", dy);

    return `M${sx},${sy} A${r},${r} 0 0,${dy>0?1:0} ${width},${height/2}`;
});
//add curved paths





//create circles to hold the user images
var circle = viz.append("svg:g").selectAll("circle")
    .data(data);

//enter
circle
    .enter()
    .append("svg:circle")
    .attr("id", function (d) {
        return d.userName;
    })
    .attr("r", function (d) {
        return "30";
    })
    .attr("cx", function (d, i) {
        return width * i;
    })
    .attr("cy", function (d, i) {
        return height/2;
    })
    .style("fill", function (d, i) {
        return "url(#" + i + "-" + d.userName.toLowerCase() + ")";
    })



var circle = viz.append("svg:g").selectAll("circle")
    .data(data1);

//enter
circle
    .enter()
    .append("svg:circle")
    .attr("id", function (d) {
        return d.commonLabel;
    })
    .attr("r", function (d) {
        return getRadius(d);
    })
    .attr("cx", function (d, i) {
        return width/2;
    })
    .attr("cy", function (d, i) {
        return distanceBetween * i;
    })
    .style("fill", function (d, i) {
        return colores_google(i);
    });



var text = viz.append("svg:g").selectAll("g")
    .data(data1)

text
    .enter().append("svg:g");

text.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", function (d, i) {
        return getRadius(d) + 15 + (distanceBetween * i);
    })
    .text(function (d) {
        return d.commonLabel;
    })
    .attr("id", function (d) {
        return "text" + d.commonLabel;
    });



var counters = viz.append("svg:g").selectAll("g")
    .data(data1)

counters
    .enter().append("svg:g");

counters.append("svg:text")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", function (d, i) {
        return ((getRadius(d) / 2) + (distanceBetween * i)) - 3;
    })
    .text(function (d) {
        var count = d.commonTags.split(",").length;
        if (count > 1) {
            return count;
        }
    })
    .attr("id", function (d) {
        return "textcount" + d.commonLabel;
    });
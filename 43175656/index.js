var $this = $("#progress");



var data = [{
    "group": "Chinese",
    "value": 22.6,
    "children": [{
        "growth": 1277.4
  }]
}, {
    "group": "Portuguese",
    "value": 4.2,
    "children": [{
        "growth": 989.6
  }]
}, {
    "group": "Spanish",
    "value": 7.8,
    "children": [{
        "growth": 743.2
  }]
}, {
    "group": "Rest",
    "value": 17.8,
    "children": [{
        "growth": 588.5
  }]
}, {
    "group": "French",
    "value": 3.0,
    "children": [{
        "growth": 398.2
  }]
}, {
    "group": "English",
    "value": 27.3,
    "children": [{
        "growth": 281.2
  }]
}, {
    "group": "German",
    "value": 3.8,
    "children": [{
        "growth": 173.1
  }]
}, {
    "group": "Japanese",
    "value": 5.0,
    "children": [{
        "growth": 110.6
  }]
}, {
    "group": "Korean",
    "value": 2.0,
    "children": [{
        "growth": 107.1
  }]
}, {
    "group": "Arabic",
    "value": 3.3,
    "children": [{
        "growth": 2501.2
  }]
}, {
    "group": "Russian",
    "value": 3.0,
    "children": [{
        "growth": 1825.8
  }]
}];


var w = 500;
var h = w;

var radius = Math.min(w, h) / 2 - 50;

var svg = d3.select($this[0])
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")


svg.append("g")
    .attr("class", "innerslices");
svg.append("g")
    .attr("class", "slices");
svg.append("g")
    .attr("class", "labels");
svg.append("g")
    .attr("class", "labelsvals");


var pie = d3.layout.pie()
    .sort(null)
    .value(function (d) {
        return d.value;
    });

const outerRadius=0.85;
const innerRadius=0.75;
const earthRadius=0.05;

const arc = d3.svg.arc()
    .outerRadius(radius * outerRadius)
    .innerRadius(radius * innerRadius);



const outerArc = d3.svg.arc()
    .innerRadius(radius - 20)
    .outerRadius(radius - 20);

const innerArc = d3.svg.arc()
    .innerRadius(radius - 55)
    .outerRadius(radius - 55);


svg.attr("transform", "translate(" + w / 2 + "," + h / 2 + ")");


function colores_google(n) {
    var colores_g = ["#e9168a", "#f8dd2f", "#448875", "#c3bd75", "#2b2d39", "#311854", "#553814", "#f7b363", "#89191d", "#c12f34", "#2b2a2c", "#c5b8a6", "#57585b"];
    return colores_g[n % colores_g.length];
}


var totalsArray = [];
$.each(data, function (index, value) {
    value["groupid"] = index;

    var total = 0;

    $.each(value.children, function (i, v) {
        v["groupid"] = index;
        total += v.growth;
    });

    value["total"] = total;
    totalsArray.push(total);
});

var maxTotal = Math.max.apply(Math, totalsArray);




//slices
var slice = svg.select(".slices").selectAll("path.slice")
    .data(pie(data))


slice.enter()
    .insert("path")
    .style("fill", function (d) {
        return "#3b453f"; //colores_google(d.data.groupid);
    })
    .attr("class", "slice");

slice
    .transition().duration(1000)
    .attr("d", function (d) {
        return arc(d);
    })

slice.exit()
    .remove();
//slices



//innerslices

var innerslice = svg.select(".innerslices").selectAll("path.innerslice")
    .data(pie(data));

innerslice.enter()
    .insert("path")
    .style("fill", function (d) {
        return "#8fdfff"; //colores_google(d.data.groupid);
    })
    .attr("class", "innerslice");


innerslice
    .transition().duration(1000)
    .attr("d", function (d) {

        var arc3 = d3.svg.arc()
            .outerRadius(radius * innerRadius)
            .innerRadius(radius * (innerRadius-(innerRadius-earthRadius) * (d.data.children[0].growth / maxTotal)));
        return arc3(d);
    })

innerslice.exit()
    .remove();
//innerslice


var pieData = pie(data);
var pieAngle = pieData.map(function (p) {
    return (p.startAngle + p.endAngle) / 2 / Math.PI * 180;
});



const labels = svg.append('g')
    .classed('labels', true);


//base on angle to change `text-anchor` and `transform(rotate)` to make the position of text correct
labels.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .style('text-anchor', function (d, i) { //important
        const p = pieData[i];
        const angle = pieAngle[i];
        if (angle > 0 && angle <= 180) { //text-anchor depends on the angle
            return "start"
        }
        return "end"
    })
    .attr("transform", function (d, i) { //important             
        const p = pieData[i];
        let angle = pieAngle[i];
        if (angle > 0 && angle <= 180) { //rotation depends on the angle
            angle = angle - 180;
        }
        return `translate(${outerArc.centroid(p)}) rotate(${angle+90} 0 0) `
    })
    .text(function (d) {
        return d.group;
    });

//similar with outer black text
labels.selectAll('text.inner')
    .data(data)
    .enter()
    .append('text')
    .attr("class","inner")
    .style('text-anchor', function (d, i) { //important
        const p = pieData[i];
        const angle = pieAngle[i];
        if (angle > 0 && angle <= 180) { //text-anchor depends on the angle
            return "end"
        }
        return "start"
    })
    .attr("transform", function (d, i) { //important             
        const p = pieData[i];
        let angle = pieAngle[i];
        if (angle > 0 && angle <= 180) { //rotation depends on the angle
            angle = angle - 180;
        }
        return `translate(${innerArc.centroid(p)}) rotate(${angle+90} 0 0) `
    })
    .text(function (d) {
        return d.children[0].growth+"%";
    });

const labelFontSize = 10;
const labelValRadius = (radius * 0.80 - labelFontSize * 0.35); //calculate correct radius
const labelValRadius1 = (radius * 0.80 + labelFontSize * 0.35); //why 0.35? I don't know. Try to google it.


const labelsVals = svg.append('g')
    .classed('labelsvals', true);

//define two paths to make the direction of labels correct
labelsVals.append('def')
    .append('path')
    .attr('id', 'label-path-1')
    .attr('d', `m0 ${-labelValRadius} a${labelValRadius} ${labelValRadius} 0 1,1 -0.01 0`);
labelsVals.append('def')
    .append('path')
    .attr('id', 'label-path-2')
    .attr('d', `m0 ${-labelValRadius1} a${labelValRadius1} ${labelValRadius1} 0 1,0 0.01 0`);

labelsVals.selectAll('text')
    .data(data)
    .enter()
    .append('text')
    .style('font-size', labelFontSize)
    .style('font-weight', "bold")
    .style('text-anchor', 'middle')
    .append('textPath')
    .attr('href', function (d, i) {
        const p = pieData[i];
        const angle = pieAngle[i];
        if (angle > 90 && angle <= 270) { //based on angle to choose the path
            return '#label-path-2';
        } else {
            return '#label-path-1';
        }
    })
    .attr('startOffset', function (d, i) {
        const p = pieData[i];
        const angle = pieAngle[i];
        let percent = (p.startAngle + p.endAngle) / 2 / 2 / Math.PI * 100;
        if (angle > 90 && angle <= 270) { //calculate the correct percent for each path respectively
            return 100 - percent + "%";
        }
        return percent + "%";
    })
    .text(function (d) {
        if (d.value > 2) {//according to the simple image, the percent less than 3% should only show int part
            return d.value.toFixed(1) + "%";
        } else {
            return d.value.toFixed(0) + "%";
        }

    });
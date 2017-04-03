var data = [{
    "country": "Greece",
    "Vodafone": 57,
    "Wind": 12,
    "Cosmote": 20
}, {
    "country": "Italy",
    "Vodafone": 40,
    "Wind": 24,
    "Cosmote": 35
}, {
    "country": "France",
    "Vodafone": 22,
    "Wind": 9,
    "Cosmote": 9
}]


margin = {
    top: 5, //top: 20,
    right: 20,
    bottom: 40,
    left: 50
};


var parentNode = d3.select('#chart-id').node(),
    parent = '#chart-id';

var containerwidth = parentNode.getBoundingClientRect().width,
    containerheight = parentNode.getBoundingClientRect().height,
    width = containerwidth - margin.left - margin.right,
    height = containerheight - margin.top - margin.bottom;

var dataset = data;

var svg = d3.select(parent)
    .append('svg')
    .attr('width', containerwidth)
    .attr('height', containerheight)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

/* Tooltip */

var tooltip = d3.select(parent)
    .append('div')
    .attr('class', 'd3-tooltip hidden');

var tooltipWidth, lastDate;
var mousemoveFunc = function (d, i) {
    var mouse = d3.mouse(svg.node()).map(function (d) {
        return parseInt(d);
    });
    var left = Math.min(containerwidth, mouse[0] + margin.left),
        top = Math.min(containerheight, mouse[1] + margin.top);

    tooltipWidth = d3.select(parent + ' .d3-tooltip').node().getBoundingClientRect().width;

    //console.log(dataset[i]); // i is passed from the .d3-group

    var ds = [];
    for (var k in dataset[i]) {
        ds.push(k + ": " + "<strong>" + dataset[i][k] + "</strong>"); // d[i] = value  // or dataset[i][k]
    }
    console.log(ds);
    nds = ds.slice(1, length - 1);

    tooltip
        .html(nds.join("<br/>"))
        .classed('hidden', false);

    tooltip.attr('style', 'left:' + (left) + 'px;top:' + (top - margin.top) + 'px;transform:translate(-50%,-100%);') // centered tooltip

};

var mouseoutFunc = function (d, i) {
    tooltip.classed('hidden', true);
};

/* Rectangle to receive user events */

var clipPath = svg.append("defs")
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("x", 0)
    .attr("y", 0);

var view = svg
    .append("rect")
    .attr("class", "view")
    .attr("x", 0)
    .attr("y", 0);


/* Zoom function */

var zoom = d3.zoom()
    .scaleExtent([1, 2])
    .translateExtent([
    [0, 0],
    [width, height]
  ])
    .extent([
    [0, 0],
    [width, height]
  ])
    .on("zoom", redraw);

svg.call(zoom); // Call zoom function


var transform = d3.zoomTransform(svg.node()); // Get svg transform properties to rescale Axes/redraw zoomed lines

var x = d3.scaleBand().padding(0.1), // No domains yet!
    y = d3.scaleLinear();

var xz = x,
    xy = y; // Used to store zoom scales        

var colorScale = d3.scaleOrdinal(d3.schemeCategory10);

var colorScale20 = d3.scaleOrdinal() // My color scales 
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20])
    .range(["#21569a", "#2d74d0", "#4196fe", "#80b8fd", "#7a2c99", "#ab2ecd", "#cf44fc", "#d883fc", "#a91c50", "#dd2170", "#ff3e9e", "#ff81be", "#b8370d", "#fa5802", "#ff753f", "#ff9f7f", "#9a9121", "#c8b331", "#fee041", "#f9df82"]);

var colorScale10 = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
    .range(["#2d74d0", "#80b8fd", "#ab2ecd", "#d883fc", "#dd2170", "#ff81be", "#fa5802", "#ff9f7f", "#c8b331", "#f9df82"]);

var colorScale5 = d3.scaleOrdinal()
    .domain([1, 2, 3, 4, 5])
    .range(["#2d74d0", "#ab2ecd", "#dd2170", "#fa5802", "#c8b331"]);

var keys = d3.keys(dataset[0]).slice(1);
//console.log(keys[2]);

// keys = d3.keys(dataset[0]).slice(2); // here is the key to remove stuff


dataset.forEach(function (d, i) {
    d.total = d3.sum(d3.values(d).slice(1));
});
//console.log(d3.max(total));
//console.log(dataset);


var fKeys = keys.slice();

var xAxis = d3.axisBottom(x).tickSizeInner(2).tickSizeOuter(0);
var yAxis = d3.axisLeft(y).ticks(5).tickSizeInner(-width).tickSizeOuter(0);
var xAxisGroup = svg.append('g').attr('class', 'x-axis-group').append('g').attr('class', 'x d3-axis').attr('transform', 'translate(0,' + height + ')');
var yAxisGroup = svg.append('g').attr('class', 'y d3-axis').attr('transform', 'translate(0,0)');

var g = svg.append('g').attr("class", "d3-group-wrap"); // keep d3 groups organized and used for correct clipping     

var yAxisLabel = svg.append('text')
    .attr('class', 'd3-chart-label label-y-axis')
    .text('Y Axis Units')
    .attr('transform', 'rotate(-90)')
    .attr('y', -margin.left / 2)
    .attr('dy', -5)
    .attr('text-anchor', 'middle');

//console.log(keys);

var legendItem = d3.select(".legend") // Create legend (not needed inside redraw function, renders only once)
    .selectAll("li")
    .data(keys)
    .enter()
    .append("li")
    .on('click', function (d) {
        if (fKeys.length < keys.length) {
            fKeys = keys.slice();
        } else {
            fKeys.splice(fKeys.findIndex(key => key === d), 1);
        }
        redraw();
    });

legendItem
    .append("span")
    .attr("class", "color-square")
    .style("background", function (d) {
        return colorScale5(d);
    });

legendItem
    .append("span")
    .text(function (d) {
        return (d)
    });

var tickArr = [];

redraw();

function redraw() {

    containerwidth = parentNode.getBoundingClientRect().width,
        containerheight = parentNode.getBoundingClientRect().height,
        width = containerwidth - margin.left - margin.right,
        height = containerheight - margin.top - margin.bottom;

    // Used for resize
    d3.select(parent + ' svg, ' + parent + ' svg g').attr('width', containerwidth).attr('height', containerheight);

    zoom
        .translateExtent([
      [0, 0],
      [width, height]
    ])
        .extent([
      [0, 0],
      [width, height]
    ])

    clipPath
        .attr("width", width)
        .attr("height", containerheight);

    view
        .attr("width", width)
        .attr("height", height);

    //tooltip.classed('hidden', true);

    transform = d3.zoomTransform(svg.node());

    y.domain([
    0,
    1.2 * d3.max(dataset, function (d) {
            return fKeys.reduce(function (pre, key) {
                return pre + d[key];
            }, 0);
        })
  ]).rangeRound([height, 0]);

    x.domain(data.map(function (d) {
        return d.country
    })).rangeRound([0, width]);


    xz = x.rangeRound([0, width * transform.k], .1 * transform.k);
    yz = transform.rescaleY(y);


    //xAxisLabel.attr('x', width).attr('y', containerheight-10)

    xAxisGroup
        .attr("transform", "translate(" + transform.x + "," + (height) + ")")
        .call(xAxis.scale(xz));

    //xAxisGroup.selectAll(".tick text")
    //.call(wrap, xz.bandwidth());


    // Auto rotate ticks 

    xTicks = d3.selectAll(".x.d3-axis .tick text");

    xTicks.each(function () {
        text = d3.select(this);
        textWidth = text.node().getComputedTextLength();
        tickArr.push(textWidth);

    });
    textWidthMax = d3.max(tickArr);

    if (textWidthMax > xz.bandwidth()) {
        xTicks
            .style("text-anchor", "middle")
            //.attr("x", textWidthMax/2)
            .attr("x", 0)
            .attr("y", 0)
            //.attr("dy", "1.5em")
            .attr("transform", "translate(0,15)rotate(-30)");
    } else {
        xTicks
        //.style("text-anchor", "middle")
            .attr("x", "0")
            .attr("y", 5)
            .attr("dy", "0.75em")
            .attr("transform", "rotate(0)");
    }



    yAxisLabel.attr('x', -containerheight / 2)
    yAxis.tickSizeInner(-width);
    yAxisGroup.call(yAxis.scale(yz))
        .selectAll("text")
        .attr("dx", "-0.5em");

    // update selection
    g.selectAll(".d3-group").remove();
    stackedBars = g
        .selectAll(".d3-group")
        .data(d3.stack().keys(fKeys)(dataset));

    //    console.log(d3.stack().keys(fKeys)(dataset))
    // exit the whole group
    stackedBars
        .exit()
        .remove();

    // enter selection
    stackedBarsEnter = stackedBars
        .enter()
        .append("g")
        .attr("fill", function (d) {
            return colorScale5(d.key);
        })
        .attr("class", function (d, i) {
            return "d3-group d3-group-" + i;
        });

    // add path on enter
    bars = stackedBarsEnter
        .selectAll('rect')
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr('class', 'd3-rect');


    // update + enter
    stackedBars = stackedBars.merge(stackedBarsEnter);

    stackedBars.selectAll('.d3-rect')
        .attr("x", function (d) {
            return xz(d.data.country);
        })
        .attr("y", function (d) {
            return yz(d[1]);
        })
        .attr("height", function (d) {
            return yz(d[0]) - yz(d[1]);
        })
        .attr("width", xz.bandwidth())
        .attr("transform", "translate(" + transform.x + ",0)")
        .on('mouseenter mousemove', mousemoveFunc)
        .on('mouseout', mouseoutFunc);



}
$(window).on('resize', function () {
    svg.call(zoom.transform, d3.zoomIdentity);
});
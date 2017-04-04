var csvData = `Associate,Manager
Matt Herman,John Smith
Jane Doe,John Smith
Adam Brown,John Smith
Susan Harris,John Smith
Mike Jones,John Smith
John Smith,Colin Krauss
Colin Krauss,Ashley Carlin
Ashley Carlin,Lia McDermott
Evan Park,Lia McDermott
Lauren Werner,Evan Park
Shane Waterson,Evan Park
Emma Smith,Evan Park
Mike Gregory,Evan Park
Jose Biggleman,Evan Park
Michelle Spektor,Evan Park
Juan Branch,Evan Park
John Orbase,Evan Park
Matt McCloud,Evan Park
Kelsey Carsen,Evan Park
Kelli Krazwinski,Colin Krauss
Stephanie Goldstien,Colin Krauss
Ryan Woolwine,Colin Krauss
Kyle Bohm,Colin Krauss
Sydney Yellen,Colin Krauss
Shankar Murjhree,Colin Krauss
Wayne Ellington,Colin Krauss
Dwight Folds,Colin Krauss
Ellen McGlynn,Colin Krauss
Nicolas Smith,Colin Krauss
Molly Ercole,Colin Krauss
Scott Hane,Colin Krauss
Regina McMahon,Colin Krauss
Skip Holden,Colin Krauss
Kadeem McPherson,Colin Krauss
Ray Ortiz,Colin Krauss
Janet Barnes,Colin Krauss
Holly Gold,Colin Krauss
Lance Martinez,Ashley Carlin
Mike Lubow,Ashley Carlin
Jordan Belsin,Ashley Carlin
Tom Strithers,Ashley Carlin
Jamie Raleigh,Ellen McGlynn
Joseph Bowman,Ellen McGlynn
Kylie Branch,Ellen McGlynn
Lars Randall,Ellen McGlynn
Carlos Barndt,Lia McDermott
Leo Hastings,Lia McDermott
Jaime Kellemen,Lia McDermott
Harvey Klien,Lia McDermott
Lia McDermott,Lia McDermott`;


var data = d3.csv.parse(csvData);

var height = document.getElementById("tree-container").offsetHeight;
var width = document.getElementById("tree-container").offsetWidth;
var avatarRadius = 20;
var translateOffset = 25;
var radius = d3.min([height, width]) / 2;
var cluster = d3.layout.cluster()
    .size([360, radius / 1.33])
    // .separation(function(a,b){return (a.parent == b.parent ? 1:2)/a.depth;});

var svg = d3.select("#tree-container").append("svg")
    .attr("width", radius * 2)
    .attr("height", radius * 2)
    .attr("id", "tree-container-svg")
    .append("g")
    .attr("transform", "translate(" + radius + "," + height / 2 + ")");

//Clip path needed for cicrular SVG avatars
var defs = svg.append('defs');
var clipPath = defs.append('clipPath')
    .attr('id', 'clip-circle')
    .append('circle')
    .attr('r', avatarRadius - 2.5);

var diagonal = d3.svg.diagonal.radial()
    .projection(function(d) {
        return [d.y, d.x / 180 * Math.PI];
    });

d3.selection.prototype.moveToFront = function() {
    return this.each(function() {
        this.parentNode.appendChild(this);
    });
};

d3.selection.prototype.moveToBack = function() {
    return this.each(function() {
        var firstChild = this.parentNode.firstChild;
        if (firstChild) {
            this.parentNode.insertBefore(this, firstChild);
        }
    });
};

//http://www.d3noob.org/2014/01/tree-diagrams-in-d3js_11.html
function treeify(list, callback) {

    var dataMap = list.reduce(function(map, node) {
        map[node.Associate] = node;
        return map;
    }, {});

    var treeData = [];
    list.forEach(function(node) {
        //Assuming the highest node is the last in the csv file
        if (node.Manager === node.Associate) {
            node.Manager = "Board of Directors"
            callback(node);
        }
        // add to parent
        var parent = dataMap[node.Manager];

        if (parent) {
            // create child array if it doesn't exist
            (parent.children || (parent.children = []))
            // add node to child array
            .push(node);
        } else {
            // parent is null or missing
            treeData.push(node);
        }
    });
};

function findItem(root, name, callback) {
    var stack = [];
    stack.push(root);
    while (stack.length !== 0) {
        var element = stack.pop();
        if (element.Associate === name) {
            callback(element);
            return;
        }
        //The up, uncompressed case
        else if (element.children !== undefined && element.children.length > 0) {
            for (var i = 0; i < element.children.length; i++) {
                stack.push(element.children[i]);
            }
        }
        //The down (compressed) case
        else if (element._children !== undefined && element._children.length > 0) {
            for (var j = 0; j < element._children.length; j++) {
                stack.push(element._children[j]);
            }
        }
    }
}

function defaultPlot(root, elem) {
    findItem(root, elem, function(d) {
        //Showing 1 up and below
        findItem(root, d.Manager, function(x) {
            (x.children) ? x.children.forEach(collapse): x.children = x._children;
            drawIt(x, root);
        })
    })
}

function collapse(d) {
    if (d.children) {
        d._children = d.children;
        d._children.forEach(collapse);
        d.children = undefined;
    }
}

//For the buggy transition interruption with many nodes
function showAllCurrentPathsAndNodes() {
    d3.selectAll(".link").style("opacity", 1);
    d3.selectAll(".node").style("opacity", 1);
}

// Toggle children on click.
function clickedNode(d, root) {
    //Accounting for the transition bug on the delay
    showAllCurrentPathsAndNodes();

    if (d.children) {
        d._children = d.children;
        d.children = undefined;
        drawIt(root)
    } else {
        d.children = d._children;
        d._children = undefined;
        drawIt(root)
    }
}

//http://bl.ocks.org/syntagmatic/4092944
function drawIt(root) {

    var nodes = cluster.nodes(root);
    var maxDepth = d3.max(nodes, function(d) {
        return d.depth
    });
    
    var link = svg.selectAll("path.link").data(cluster.links(nodes));
    //This nodes callback is SUPER important for the update pattern
    var node = svg.selectAll("g.node").data(nodes, function(d) {
        return d.Associate;
    });

    link.transition().duration(1000).attr("d", diagonal);

    d3.selectAll(".node-cicle").classed("highlight", false);

    showAllCurrentPathsAndNodes();

    link.enter().append("path")
        .attr("class", "link")
        .attr("d", diagonal)
        .attr("", function(d) {
            d3.select(this).moveToBack();
        })
        .style("opacity", 0)
        .transition()
        .duration(300)
        .delay(function(d, i) {
            return 28 * i;
        }).style("opacity", 1);

    node.transition().duration(800).attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
    });

    var g = node.enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) {
            return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
        })
        .style("opacity", 0)
        .style("cursor", function(d) {
            return ((d._children || d.children) && d.Manager !== "Board of Directors") ? "pointer" : "not-allowed";
        })
        .on("mouseover", function() {
            d3.select(this).moveToFront();
        })

    //Cant trust the enter append here, reassign the event listener for all nodes each draw
    d3.selectAll(".node")
        .on("click", function(d) {
            return ((d._children || d.children) && d.Manager !== "Board of Directors") ? clickedNode(d, root) : "";
        });


    g.transition().duration(300)
        .delay(function(d, i) {
            return 28 * i;
        })
        .style("opacity", 1);

    g.append("circle")
        .attr("r", avatarRadius)
        .attr("class", "circle-marker")
        .style("stroke", function(d) {
            return ((d._children || d.children) && d.Manager !== "Board of Directors") ? "steelblue" : "gray";
        })
        .style("fill", function(d) {
            return ((d._children || d.children) && d.Manager !== "Board of Directors") ? "steelblue" : "#fff";
        });

    g.append("svg:image")
        .attr("class", "node-avatar")
        .attr("xlink:href", "http://safariuganda.com/wp-content/uploads/2014/12/480px-Facebook-default-no-profile-pic.jpg")
        .attr("height", avatarRadius * 2)
        .attr("width", avatarRadius * 2)
        .attr("x", "-" + avatarRadius)
        .attr("y", "-" + avatarRadius)
        .attr('clip-path', 'url(#clip-circle)');

    //Might want to tween this?
    d3.selectAll(".node-avatar")
        .attr("transform", function(d) {
            return "rotate(" + (-1 * (d.x - 90)) + ")";
        });

    g.append("text")
        .attr("dy", ".31em")
        .attr("class", "label-text")
        .text(function(d) {
            return d.Associate;
        })

    //search all labels to ensure they are right side up (cant rely on the enter append here)
    d3.selectAll(".label-text")
        .attr("text-anchor", function(d) {
            return d.x < 180 ? "start" : "end";
        })
        .attr("transform", function(d) {
            return d.x < 180 ? "translate(" + translateOffset + ")" : "rotate(180)translate(-" + translateOffset + ")";
        })

    link.exit().transition().duration(0).style("opacity", 0).remove();
    node.exit().transition().duration(0).style("opactiy", 0).remove();

}

treeify(data, function(treeReturn) {
    var root = treeReturn;
    defaultPlot(root, root.children[0].Associate)
});

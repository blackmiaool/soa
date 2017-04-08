        var $this = $("#progress");


        var data = [{
            "group": "Chinese",
            "value": 20,
            "children": [{
                "growth": 1200
          }]
        }, {
            "group": "Portuguese",
            "value": 5,
            "children": [{
                "growth": 900
          }]
        }, {
            "group": "Spanish",
            "value": 10,
            "children": [{
                "growth": 700
          }]
        }, {
            "group": "Rest",
            "value": 20,
            "children": [{
                "growth": 500
          }]
        }, {
            "group": "French",
            "value": 5,
            "children": [{
                "growth": 300
          }]
        }, {
            "group": "English",
            "value": 30,
            "children": [{
                "growth": 260
          }]
        }, {
            "group": "German",
            "value": 2,
            "children": [{
                "growth": 100
          }]
        }, {
            "group": "Japanese",
            "value": 1,
            "children": [{
                "growth": 100
          }]
        }, {
            "group": "Korean",
            "value": 1,
            "children": [{
                "growth": 100
          }]
        }, {
            "group": "Arabic",
            "value": 3,
            "children": [{
                "growth": 1000
          }]
        }, {
            "group": "Russian",
            "value": 3,
            "children": [{
                "growth": 1000
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

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.85)
            .innerRadius(radius * 0.75);



        var outerArc = d3.svg.arc()
            .innerRadius(radius - 20)
            .outerRadius(radius - 20);

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
            .attr("class", "slice")
            .attr("data-name", function (d) {
                return d.data.group;
            });

        slice
            .transition().duration(1000)
            .attrTween("d", function (d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc(interpolate(t));
                };
            })

        slice.exit()
            .remove();
        //slices



        //innerslices
        var arc2 = d3.svg.arc()
            .outerRadius(radius * 0.75) //
            .innerRadius(radius * 0.25);

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
            .attrTween("d", function (d) {

                var arc3 = d3.svg.arc()
                    .outerRadius(radius * 0.75)
                    .innerRadius(radius * 0.25 * (d.data.children[0].growth / maxTotal));

                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function (t) {
                    return arc3(interpolate(t));
                };
            })

        innerslice.exit()
            .remove();
        //innerslice


        var pieData = pie(data);


        var numBars = data.length;

        // Labels
        var labels = svg.append('g')
            .classed('labels', true);


        labels.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .style('text-anchor', function (d, i) {
                var p = pieData[i];
                var angle = (p.startAngle + p.endAngle) / 2 / Math.PI * 180;
                if (angle > 0 && angle <= 180) {
                    return "start"
                }
                return "end"
            })
            .attr("transform", function (d, i) {
                var p = pieData[i];
                var angle = (p.startAngle + p.endAngle) / 2 / Math.PI * 180;
                console.log(angle)
                console.log(p)
                if (angle > 0 && angle <= 180) {
                    angle = angle - 180;
                }
                return `translate(${outerArc.centroid(p)}) rotate(${angle+90} 0 0) `
            })
            //            .attr('startOffset', function (d, i) {
            //                return i * 100 / numBars + 50 / numBars + '%';
            //            })
            .text(function (d) {
                return d.group;
            });

        const labelFontSize = 10;
        var labelValRadius = (radius * 0.81 - labelFontSize / 2);
        var numBars = data.length;

        // Labels
        var labelsVals = svg.append('g')
            .classed('labelsvals', true);

        labelsVals.append('def')
            .append('path')
            .attr('id', 'label-path2')
            .attr('d', 'm0 ' + -labelValRadius + ' a' + labelValRadius + ' ' + labelValRadius + ' 0 1,1 -0.01 0');
        labelsVals.append('def')
            .append('path')
            .attr('id', 'label-path3')
            .attr('d', 'm0 ' + -labelValRadius + ' a' + labelValRadius + ' ' + labelValRadius + ' 0 1,1 -0.01 0');

        labelsVals.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .style('font-size', labelFontSize)
            .style('font-weight', "bold")
            .style('text-anchor', 'middle')
            .append('textPath')
            .attr('xlink:href', '#label-path2')
            .attr('startOffset', function (d, i) {
                var p = pieData[i];
                const percent = (p.startAngle + p.endAngle) / 2 / 2 / Math.PI * 100;
                console.log("p", percent);
                return percent + "%";
                //                return i * 100;
                //return i * 100 / numBars + 50 / numBars + '%';
            })
//            .attr("transform",function(d,i){
//                var p = pieData[i];
//                var angle = (p.startAngle + p.endAngle) / 2 / Math.PI * 180;
//                if(angle>90&&angle<=270){
//                    angle-=180;
//                }
//                console.log(angle);
//                return `rotate(${angle} 0 0)`;
//            })
            .text(function (d) {

                return d.value + "%";
            });



        /*
        		//placeholder
        		var placeholders = svg.select(".placeholders").selectAll("g.placeholder")
        		  .data(pie(data));

        		placeholders.enter()
        		  .insert("g")
        		  .attr("class", function(d, i) {
        		    return "placeholder place" + i;
        		  });

        		placeholders
        		  .transition().duration(1000)
        		  .attr("transform", function(d) {
        		    return "translate(" + arc2.centroid(d) + ")";
        		  })

        		placeholders.exit()
        		  .remove();
        		//placeholder bubbles
        */
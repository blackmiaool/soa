function generateGraph(tooltip, data1, data2) {
    // if the data is same as before don't regenrate the graph - this avoids flicker
    if (tooltip.data1 &&
        (tooltip.data1.name === data1.name) && (tooltip.data1.value === data1.value) &&
        (tooltip.data2.name === data2.name) && (tooltip.data2.value === data2.value))
        return;

    tooltip.data1 = data1;
    tooltip.data2 = data2;

    // remove the existing chart
    if (tooltip.chart) {
        tooltip.chart = tooltip.chart.destroy();
        tooltip.selectAll('*').remove();
    }

    // create new chart
    tooltip.chart = c3.generate({
        bindto: tooltip,
        padding: {
            right: 15
        },
        size: {
            width: 200,
            height: 200
        },
        data: {
            columns: [
                ['data1', 30, 200, 100, 400, 150, 250, 160],
                ['data2', 50, 20, 10, 40, 15, 25, 34]
            ]
        },
        tooltip: {
            show: false
        }
    });

    // creating a chart on an element sets its position attribute to relative
    // reset it to absolute (the tooltip was absolute originally) for proper positioning
    tooltip.style('position', 'absolute');
    tooltip.style('background-color', 'white');
}

var chart = c3.generate({
    data: {
        columns: [
            ['x', 1000, 200, 150, 300, 200],
            ['data1', 1000, 200, 150, 300, 200],
            ['data2', 400, 500, 250, 700, 300], ],

        axes: {
            'data1': 'y2'
        },
        type: 'bar',
        types: {
            'data1': 'line'
        }
    },
    tooltip: {
        contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
            // this creates a chart inside the tooltips
            var content = generateGraph(this.tooltip, d[0], d[1])
                // we don't return anything - see .html function below
        }
    }
});

// MONKEY PATCHING (MAY break if library updates change the code that sets tooltip content)
// we override the html function for the tooltip to not do anything (since we've already created the tooltip content inside it)
chart.internal.tooltip.html = function () {
    // this needs to return the tooltip - it's used for positioning the tooltip
    return chart.internal.tooltip;
}
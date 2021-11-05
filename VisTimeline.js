function createVisTimeline(data, visualisation){

  // Year to Milliseconds
  function yearToMs(year){
    var d = new Date(Date.UTC(1990, 1, 1, 1, 1, 1, 0));
    return d.setUTCFullYear(year);
  }

  if (visualisation === 'horizontal') {
    var items = new vis.DataSet();
    var dates = []

    data.features.forEach(function(feature, i){
      var item = {};

      if (feature.when) {
        if (feature.when.timespans && feature.when.timespans.length) {
           var spans = feature.when.timespans
           if (spans[0].start.in) item['start'] = yearToMs(spans[0].start.in)
           if (spans[0].end.in) item['end'] = yearToMs(spans[0].end.in)
           if (spans[0].start.earliest) item['start'] = yearToMs(spans[0].start.earliest)
           if (spans[0].end.latest) item['end'] = yearToMs(spans[0].end.latest)
           if (typeof spans[0].start === 'string') item['start'] = yearToMs(spans[0].start)
           if (typeof spans[0].end === 'string') item['end'] = yearToMs(spans[0].end)
        }
        if (feature.when.start && feature.when.end) {
          item['start'] = yearToMs(feature.when.start)
          item['end'] = yearToMs(feature.when.end)
        }
      }

      item['id'] = feature.properties.name + i
      item['content'] = feature.properties.name + i

      dates.push(item['end'])
      dates.push(item['start'])
      items.add(item);
    });

    dates.sort(function(a, b){return a-b});
    var options = {
      stack: true,
      horizontalScroll: true,
      zoomKey: 'ctrlKey',
      maxHeight: 500,
      start: new Date(dates[0]),
      end: new Date(dates[dates.length - 1]),
      editable: true,
      margin: {
        item: 10, // minimal margin between items
        axis: 5   // minimal margin between items and the axis
      },
      orientation: 'top'
    };

    var container = document.getElementById('vis-timeline');
    timeline = new vis.Timeline(container, items, options);
  }

  if (visualisation === 'histogram') {
    // {x: '2014-06-16', y: 30}
    bin = {}
    function addDateBin (date){
      date = parseInt(date)
      if (!bin[date]) {
        bin[date] = 1
      } else {
        bin[date] += 1
      }
    }

    data.features.forEach(function(feature, i){
      if (feature.when) {
        if (feature.when.timespans && feature.when.timespans.length) {
           var spans = feature.when.timespans
           if (spans[0].start) {
             // Works for years only
             cY = yearToMs(spans[0].start)
             addDateBin(cY);
           }
        } else if (feature.when.start) {
          cY = yearToMs(feature.when.start)
          addDateBin(cY)
        }
      }
    })

    var items = Object.keys(bin).map(function(date, i) {
      visdate = new Date()
      xdate = visdate.setMilliseconds(date)
      end = visdate.setUTCFullYear(visdate.getUTCFullYear() + 1)

      item = {
        x: xdate,
        end: end,
        y: bin[date]
      }

      return item;
    });

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
            var x = a.x
            var y = b.x
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    items = sortByKey(items, 'x')

    var options = {
        style:'bar',
        // barChart: {width:50, align:'center'}, // align: left, center, right
        drawPoints: false,
        maxHeight: 300,
        width: '100%',
        // dataAxis: {
        //     icons:true
        // },
        // orientation:'top',
        start: items[0].x,
        end: items[items.length - 1].end
    };

    var container = document.getElementById('vis-timeline');
    timeline = new vis.Graph2d(container, items, options);
  }
  if (visualisation === 'mg_histogram') {
    bin = {}
    function addDateBin (date){
      date = parseInt(date)
      if (!bin[date]) {
        bin[date] = 1
      } else {
        bin[date] += 1
      }
    }

    data.features.forEach(function(feature, i){
      if (feature.when) {
        if (feature.when.timespans && feature.when.timespans.length) {
           var spans = feature.when.timespans
           if (spans[0].start) {
             // Works for years only
             cY = yearToMs(spans[0].start)
             addDateBin(cY);
           }
        } else if (feature.when.start) {
          cY = yearToMs(feature.when.start)
          addDateBin(cY)
        }
      }
    })

    function sortByKey(array) {
      return array.sort(function(x, y) {
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    var items = sortByKey(Object.keys(bin), 'x')

    var items = items.map(function(date, i) {
      visdate = new Date()
      xdate = visdate.setMilliseconds(date)
      // end = visdate.setUTCFullYear(visdate.getUTCFullYear() + 1)

      item = {
        date: new Date(xdate),
        // end: end,
        // date: visdate.getUTCFullYear(xdate),
        value: bin[date]
      }

      return item;
    });

    // items = data.features.map(function(feature, i){
    //   if (feature.when) {
    //     if (feature.when.timespans && feature.when.timespans.length) {
    //        var spans = feature.when.timespans
    //        if (spans[0].start) {
    //          // Works for years only
    //          cY = yearToMs(spans[0].start)
    //          visdate = new Date()
    //          xdate = visdate.setMilliseconds(cY)
    //          return visdate.getUTCFullYear(xdate)
    //        }
    //     } else if (feature.when.start) {
    //       cY = yearToMs(feature.when.start)
    //       visdate = new Date()
    //       xdate = visdate.setMilliseconds(cY)
    //       return visdate.getUTCFullYear(xdate)
    //     }
    //   }
    // })
    var isEmpty   = d3.selectAll('#vis-timeline').empty();
    console.log(items);

    var mgOptions = {
        // title: "",
        data: items,
        target: '#vis-timeline',
        // chart_type: 'histogram',
        // chart_type: 'line',
        full_width: true,
        top: 0,
        bottom: 40,
        // x_axis: true,
        // y_axis: true,
        x_accessor: 'date',
        y_accessor: 'value',
        height: 150,
        area: false,
        buffer: 0
        // binned: false,
        // bins: 300
        // bins: 50,
        // bar_margin: 50,
        // show_secondary_x_label: false
        // axes_not_compact: true,
        // show_year_markers: true
        // full_height: true
        // small_height_threshold: 15
        // missing_is_zero: true
    }

    if (isEmpty) {
      var lcc = d3.select('.leaflet-control-container')
           .append('div')
               .attr('id','vis-timeline')
               .style('position', 'absolute')
               .style('z-index', '1000')
               .append('button')
                   .attr('id', 'remove-slider')
                       .style('position', 'absolute')

      // mgOptions['target'] = ''
      MG.data_graphic(mgOptions);
    } else {
      MG.data_graphic(mgOptions);

      var elementRect = d3.select('.mg-rollover-rect').node().getBoundingClientRect();
      viewportHeight = document.documentElement.clientHeight;
      viewportWidth = document.documentElement.clientWidth;
      var width = elementRect.width;
      var bottom = viewportHeight - elementRect.bottom - (elementRect.bottom / 16);
      console.log(elementRect.bottom);
      var right = viewportWidth - elementRect.right;
      right = right + right * 0.1
      d3.select(".time-slider").style("width", width + 'px').style('bottom', bottom).style('right', right)
    }
  }
}

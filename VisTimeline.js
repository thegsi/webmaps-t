function createVisTimeline(data, visualisation){

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
      maxHeight: 400,
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
        barChart: {width:50, align:'center'}, // align: left, center, right
        drawPoints: false,
        // maxHeight: 300,
        height: '300px',
        width: '100%',
        // dataAxis: {
        //     icons:true
        // },
        orientation:'top',
        start: items[0].x,
        end: items[items.length - 1].end
    };

    var container = document.getElementById('vis-timeline');
    timeline = new vis.Graph2d(container, items, options);
  }
}

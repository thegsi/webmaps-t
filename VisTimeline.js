function createVisTimeline(data, visualisation){

  // item = {
  //   id: i,
  //   start: start,
  //   end: end,
  //   content: ''
  // };

  if (visualisation === 'horizontal') {
    var items = new vis.DataSet();
    var dates = []

    data.features.forEach(function(feature, i){
      var item = {};

      if (feature.when) {
        if (feature.when.timespans && feature.when.timespans.length) {
           var spans = feature.when.timespans
           if (spans[0].start.in) item['start'] = new Date().setYear(spans[0].start.in)
           if (spans[0].end.in) item['end'] = new Date().setYear(spans[0].end.in)
           if (spans[0].start.earliest) item['start'] = new Date().setYear(spans[0].start.earliest)
           if (spans[0].end.latest) item['end'] = new Date().setYear(spans[0].end.latest)
           if (typeof spans[0].start === 'string') item['start'] = new Date().setYear(spans[0].start)
           if (typeof spans[0].end === 'string') item['end'] = new Date().setYear(spans[0].end)
        }
        if (feature.when.start && feature.when.end) {
          item['start'] = new Date().setYear(feature.when.start)
          item['end'] = new Date().setYear(feature.when.end)
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
      if (!bin[date]) {
        bin[date] = 1
      } else {
        bin[date] += 1
      }
    }
    function cleanYear (year){
      var d = new Date(Date.UTC(1990, 1, 1, 1, 1, 1, 0));
      d.setUTCFullYear(year);
      // return moment(d).year(); for integer
      return moment(d).format('YYYY');
    }

    data.features.forEach(function(feature, i){
      if (feature.when) {
        if (feature.when.timespans && feature.when.timespans.length) {
           var spans = feature.when.timespans
           if (spans[0].start) {
             // Works for years only
             cY = cleanYear(spans[0].start)
             addDateBin(cY);
           }
        } else if (feature.when.start) {
          cY = cleanYear(feature.when.start)
          addDateBin(cY)
        }
      }
    })

    var items = Object.keys(bin).map(function(date, i) {
      cYx = cleanYear(date)
      cYend = cleanYear(parseInt(date) + 1)

      item = {
        x: cYx,
        end: cYend,
        y: bin[date]
      }

      return item;
    });

    function sortByKey(array, key) {
      if (String(array[0][key]).length > 3) {
        // georeferencer
        return array.sort(function(a, b) {
            var x = moment(a[key]).format('YYYY');
            var y = moment(b[key]).format('YYYY');
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      } else if (String(array[0][key]).length < 4) {
        // nomisma
        return array.sort(function(a, b) {
            var x = parseInt(a[key])
            var y = parseInt(b[key])
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
      }
    }

    items = sortByKey(items, 'x')

    startDate = new Date(Date.UTC(1990, 1, 1, 1, 1, 1, 0));
    endDate = new Date(Date.UTC(1990, 1, 1, 1, 1, 1, 0));

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
        start: startDate.setUTCFullYear(items[0].x),
        end: endDate.setUTCFullYear(items[items.length - 1].end)
    };
    console.log(items);

    var container = document.getElementById('vis-timeline');
    timeline = new vis.Graph2d(container, items, options);
  }
}

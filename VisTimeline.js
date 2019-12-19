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

      if (feature.properties.when && feature.properties.when.timespans.length) {
         var spans = feature.properties.when.timespans
         if (spans[0].start.in) item['start'] = new Date().setYear(spans[0].start.in)
         if (spans[0].end.in) item['end'] = new Date().setYear(spans[0].end.in)
         if (spans[0].start.earliest) item['start'] = new Date().setYear(spans[0].start.earliest)
         if (spans[0].end.latest) item['end'] = new Date().setYear(spans[0].end.latest)
         if (typeof spans[0].start === 'string') item['start'] = new Date().setYear(spans[0].start)
         if (typeof spans[0].end === 'string') item['end'] = new Date().setYear(spans[0].end)
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

    data.features.forEach(function(feature, i){
      if (feature.properties.when && feature.properties.when.timespans.length) {
         var spans = feature.properties.when.timespans
         if (spans[0].start) {
           // Works for years only
           formatDate = moment(spans[0].start).format('YYYY');
           if (!bin[formatDate]) {
             bin[formatDate] = 1
           } else {
             bin[formatDate] += 1
           }
         }
      }
    })

    var items = Object.keys(bin).map(function(date, i) {
      return {
        x: date,
        end: String(parseInt(date) + 1),
        y: bin[date]
      }
    });

    function sortByKey(array, key) {
      return array.sort(function(a, b) {
          var x = moment(a[key]).format('YYYY');
          var y = moment(b[key]).format('YYYY');
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
      });
    }

    var sortItems = sortByKey(items, 'x')

    var options = {
        style:'bar',
        // barChart: {width:50, align:'center'}, // align: left, center, right
        drawPoints: false,
        // maxHeight: 300,
        height: '200px',
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

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

    data.features.forEach(function(feature, i){
      if (feature.when) {
        if (feature.when.timespans && feature.when.timespans.length) {
           var spans = feature.when.timespans
           if (spans[0].start) {
             // Works for years only
             formatDate = moment(spans[0].start).format('YYYY');
             addDateBin(formatDate);
           }
        }
        if (feature.when.start) {
          var formatDate = String(feature.when.start);

          if (formatDate.length > 6) {
            var date = new Date()
            date.setYear(feature.when.start);
            formatDate = moment(feature.when.start).format('YYYY');
          }
          // else if (formatDate.length < 6) {
          //   // formatDate = String(parseInt(formatDate))
          // }
          addDateBin(formatDate)
        }
      }
    })

    var items = Object.keys(bin).map(function(date, i) {
      // console.log(String(parseInt(date) + 1));
      item = {
        x: date,
        end: String(parseInt(date) + 1),
        y: bin[date]
      }
      if (item.end.length === 3) item.end = '0'+ item.end
      if (item.end.length === 2) item.end = '00'+ item.end
      if (item.end.length === 1) item.end = '000'+ item.end
      return item;
    });

    // function sortByKey(array, key) {
    //   return array.sort(function(a, b) {
    //       var x = moment(a[key]).format('YYYY');
    //       var y = moment(b[key]).format('YYYY');
    //       return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    //   });
    // }
    //
    // var sortItems = sortByKey(items, 'x')

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
    d3.select('.vis-t')
        // .style('width', function() { return 1 / length * 100 + "%"; })
        .style('margin-left', '-40px')
        .style('background-color', 'white')
  }


}

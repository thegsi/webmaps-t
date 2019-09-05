function createVisTimeline(data){

  // item = {
  //   id: i,
  //   start: start,
  //   end: end,
  //   content: ''
  // };

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

  // create a Timeline
  var container = document.getElementById('vis-timeline');
  timeline = new vis.Timeline(container, items, options);
}

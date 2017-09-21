// ==============================================
//            ScrollTrack by Matis
// ==============================================

var ScrollTrack = (function ($window, $document){
  var options = {
    triggerEventsFraction: 25
  }

  var $documentElement;
  var documentHeight, windowHeight, scrollableHeight,
    eventsPercentages = [],
    triggeredEvents = [],
    subscribedCallbacks = {};

  var cacheDom = function (){
    $documentElement = $document.documentElement;
  }

  var calculateHeights = function (){
    documentHeight = Math.max(
      $documentElement.scrollHeight, $documentElement.offsetHeight,
      $documentElement.clientHeight, $documentElement.scrollHeight,
      $documentElement.offsetHeight
    );

    windowHeight = $window.innerHeight;
    scrollableHeight = documentHeight - windowHeight;
  }

  var createEventsPercentagesByFraction = function (){
    var totalEventsPercentages =
      parseInt(100 / options.triggerEventsFraction);

    for(var i = 1; i <= totalEventsPercentages; i++) {
      eventsPercentages.push(i * options.triggerEventsFraction)
    }
  }

  var scrolledPercentage = function (){
    var scrollTop = $window.pageYOffset ||
      $documentElement.scrollTop ||
      document.body.scrollTop || 0;
    return (scrollTop * 100) / scrollableHeight;
  }

  var triggerEvents = function (){
    var freezedScrolledPercentage = scrolledPercentage();
    var totalEventsPercentages = eventsPercentages.length;

    for (var i = 0; i < totalEventsPercentages; i ++) {
      var percentage = eventsPercentages[i];

      if (
        freezedScrolledPercentage >= percentage &&
        eventNotFiredYet(percentage)
      ) {
        triggerEvent(percentage);
      }
    }
  }

  var triggerEvent = function(percentage) {
    triggeredEvents.push(percentage);
    runCallbacks(percentage);
  }

  var bindEvents = function (){
    $window.addEventListener('scroll', triggerEvents);
  }

  var eventNotFiredYet = function (percentage) {
    var totalTriggeredEvents = triggeredEvents.length;

    for (var i = 0; i < totalTriggeredEvents; i++ ) {
      if (triggeredEvents[i] == percentage) { return false }
    }

    return true;
  }

  var setTriggerEventsFraction = function (value){
    options.triggerEventsFraction = parseInt(value * 100);
  }

  var subscribeCallback = function (percentage, callback){
    var percentageString = parseInt(percentage * 100).toString();

    if (typeof(subscribedCallbacks[percentageString]) === 'undefined') {
      subscribedCallbacks[percentageString] = [];
    }

    subscribedCallbacks[percentageString].push(callback);
  }

  var runCallbacks = function (percentage) {
    var percentageString = percentage.toString();
    if (typeof(subscribedCallbacks[percentageString]) !== 'undefined') {
      var percentageCallbacks = subscribedCallbacks[percentageString],
        totalCallbacks = percentageCallbacks.length;

      for (var i = 0; i < totalCallbacks; i++) {
        var callback = percentageCallbacks[i];
        callback(percentage);
      }
    }
  }

  // initializers
  cacheDom();
  calculateHeights();
  createEventsPercentagesByFraction();

  return {
    setTriggerEventsFraction: setTriggerEventsFraction,
    bindEvents: bindEvents,
    subscribeCallback: subscribeCallback
  }
})(window, document)

// ==============================================
// Basic config
// ==============================================

ScrollTrack.bindEvents();

ScrollTrack.subscribeCallback(0.25, function (){
  dataLayer.push({
    'event': 'scroll_track',
    'value': 25
  });
})

ScrollTrack.subscribeCallback(0.50, function (){
  dataLayer.push({
    'event': 'scroll_track',
    'value': 50
  });
})

ScrollTrack.subscribeCallback(0.75, function (){
  dataLayer.push({
    'event': 'scroll_track',
    'value': 75
  });
})

ScrollTrack.subscribeCallback(1.0, function (){
  dataLayer.push({
    'event': 'scroll_track',
    'value': 100
  });
})

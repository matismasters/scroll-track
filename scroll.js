var ScrollTrack = (function ($window, $document){
  var options = {
    triggerEventsFraction: 25
  }

  var $body, $html;
  var documentHeight, windowHeight, scrollableHeight,
    eventsPercentages = [],
    triggeredEvents = [],
    subscribedCallbacks = {};

  var cacheDom = function (){
    $body = $document.body,
    $html = $document.documentElement;
  }

  var calculateHeights = function (){
    documentHeight = Math.max(
      $body.scrollHeight, $body.offsetHeight,
      $html.clientHeight, $html.scrollHeight, $html.offsetHeight
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
    return ($body.scrollTop * 100) / scrollableHeight;
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

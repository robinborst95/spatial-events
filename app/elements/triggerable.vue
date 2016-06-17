<template>
  <div></div>
</template>
<script>
export default {
  props: {
    // Set the names of the broadcast events that must trigger the top item's action
    "triggerEvents": {
      type: Array,
      required: false,
      default: function() { return []; }
    },
    // Set the name of the event that passes the elements
    "setElementsEvent": {
      type: String,
      required: false,
      default: null
    }
  },

  data: function() {
    return {
      elements: []
    }
  },

  ready: function() {
    _.forEach(this.triggerEvents, function(event) {
      this.$on(event, this.trigger);
    }.bind(this));

    if (this.setElementsEvent !== null) {
      this.$on(this.setElementsEvent, this.setElements);
    }
  },

  methods: {

    // Attach the elements
    setElements: function(elements) {
      this.elements = elements;
      this.trigger();
    },

    // Perform the top item's actions
    trigger: function() {
      var firstElement = this.elements[0];

      if (firstElement.triggerActions) {
        // Initialize an empty function in the end
        var nextActionsFunc = function() {};

        // Create a chain of actions
        for (var i = firstElement.triggerActions.length-1; i >= 0; i--) {
          nextActionsFunc = this.getAction(firstElement.triggerActions[i], nextActionsFunc);
        }

        nextActionsFunc();
      }
    },

    // Returns the function to execute for the specified action.
    // nextActions specifies the function(s) to execute afterwards.
    getAction: function(action, nextActionsFunc) {
      switch (action.name) {
        // This action sets the map to a specified center and zoom level
        case "setView":
          var lat = action.value.lat;
          var lon = action.value.lon;
          var zoom = action.value.zoom;

          var curCenter = map.getCenter();
          var curZoom = map.getZoom();

          // If the map is already at the wanted view,
          // just execute the next actions.
          if (curCenter.lat == lat && curCenter.lng == lon && curZoom == zoom) {
            return nextActionsFunc;
          }

          return function() {
            // When the map is done moving, remove listener and execute next actions
            var afterSetView = function() {
              map.off("moveend", afterSetView);
              nextActionsFunc();
            };
            map.on("moveend", afterSetView);

            map.setView([lat, lon], zoom);
            console.log("Set view to [" + lat + ", " + lon + "], zoom " + zoom);
          };
        // This action just waits for the specified timeout value
        case "wait":
          var timeout = action.value;

          return function() {
            console.log("Wait for " + timeout + " milliseconds");
            window.setTimeout(function() {
              nextActionsFunc();
            }, timeout);
          };
      }
    }
  }
}
</script>
<style>
</style>

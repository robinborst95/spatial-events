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
        // This action sets the view to fit the bounds given
        case "fitBounds":
          return this.getActionFitBounds(action, nextActionsFunc);

        // This action just waits for the specified timeout value
        case "wait":
          return this.getActionWait(action, nextActionsFunc);

        default:
          return nextActionsFunc;
      }
    },

    getActionFitBounds: function(action, nextActionsFunc) {
      var points = [];

      for (var idx = 0; idx < action.value.length; idx++) {
        var point = action.value[idx];
        points.push([point.lat, point.lon]);
      }

      var bounds = L.latLngBounds(points);

      // If the map is already at the wanted view,
      // just execute the next actions.
      var curCenterLat = parseFloat(map.getCenter().lat);
      var curCenterLon = parseFloat(map.getCenter().lng);
      var newCenterLat = parseFloat(bounds.getCenter().lat);
      var newCenterLon = parseFloat(bounds.getCenter().lng);
      console.log("curLat: " + curCenterLat + ", newLat: " + newCenterLat);
      console.log("curLon: " + curCenterLon + ", newLon: " + newCenterLon);
      if (Math.abs(curCenterLat - newCenterLat) < 0.01 && Math.abs(curCenterLon - newCenterLon) < 0.01) {
        return nextActionsFunc;
      }

      return function() {
        // When the map is done moving, remove listener and execute next actions
        var afterSetView = function() {
          console.log("Set view to [" + map.getCenter().lat + ", " + map.getCenter().lng + "], zoom " + map.getZoom());
          map.off("moveend", afterSetView);

          if (action.actionAfter) {
            this.getActionWait(action.actionAfter, nextActionsFunc)();
          } else {
            nextActionsFunc();
          }
        }.bind(this);
        map.on("moveend", afterSetView);

        map.fitBounds(bounds);
      }.bind(this);
    },

    getActionWait: function(action, nextActionsFunc) {
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
</script>
<style>
</style>

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
  },

  events: {
    // Trigger the initial state
    "elements-found": function(elements) {
      this.elements = elements;
      this.trigger();
    }
  },

  methods: {
    // Perform the top item's action
    trigger: function() {
      var firstElement = this.elements[0];

      if (firstElement.triggerActions) {
        var actions = [];

        for (var i = 0; i < firstElement.triggerActions.length; i++) {
          var action = this.getAction(firstElement.triggerActions[i]);

          if (action !== null) {
            actions.push(action);
          }
        }

        console.log(actions);

        var nextFunc = function() {
          map.off("moveend", nextFunc);

          if (actions[1]) {
            window.setTimeout(function() {
              actions[1]();
            }, 1000);
          }
        };
        map.on("moveend", nextFunc);
        actions[0]();
      }
    },

    getAction: function(action) {
      switch (action.name) {
        case "setView":
          var lat = action.value.lat;
          var lon = action.value.lon;
          var zoom = action.value.zoom;

          var center = map.getCenter();
          var curZoom = map.getZoom();

          // console.log("Current:", center.lat, center.lon, curZoom);
          if (center.lat == lat && center.lng == lon && curZoom == zoom) {
            return null;
          }

          return function() {
            map.setView([lat, lon], zoom);
            console.log("Set view");
          };
        case "wait":
          return null;
      }
    }
  }
}
</script>
<style>
</style>

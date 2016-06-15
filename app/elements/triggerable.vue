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

      if (firstElement.trigger) {
        map.setZoom(firstElement.trigger.zoomLevel);
      }
    }
  }
}
</script>
<style>
</style>

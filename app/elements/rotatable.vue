<template>
  <div></div>
</template>
<script>
export default {
  props: {
    // The rotatable div's must have the same class
    "rotatableClass": {
      type: String,
      required: true
    },

    // Defines when to rotate
    "interval": {
      type: Number,
      required: false,
      default: 2000
    },

    // Set whether to move down or up
    "direction": {
      type: String,
      required: false,
      default: "toTop",
      validator: function (value) {
        return value === "secondToTop" || value === "lastToTop"
      }
    }
  },

  data: function() {
    return {
      elements: []
    }
  },

  events: {
    "elements-found": function(elements) {
      this.elements = elements;

      if (this.direction === "secondToTop") {
        window.setInterval(this.moveFirstToEnd, this.interval);
      } else if (this.direction === "lastToTop") {
        window.setInterval(this.moveLastToBegin, this.interval);
      }
    }
  },

  methods: {

    // Method that moves the top element to the bottom
    moveFirstToEnd: function() {
      if (!this.elements || this.elements.length < 2)
        return;

      var firstItem = this.elements[0];
      var firstElement = $("." + this.rotatableClass)[0];
      var firstElemHeight = firstElement.clientHeight;

      // Translate all div's up
      $("." + this.rotatableClass).addClass("translate");
      $("." + this.rotatableClass).css("transform", "translate(0, -" + firstElemHeight + "px)");

      // Function that is executed after the transition
      // Here the first element is added to the end
      var addToEnd = function() {
        this.elements.push(firstItem);
        firstElement.removeEventListener("transitionend", addToEnd);
        $("." + this.rotatableClass).removeClass("translate");
        $("." + this.rotatableClass).css("transform", "");

        this.notifyRotationEnd();
      }.bind(this);
      firstElement.addEventListener("transitionend", addToEnd, false);

      // Removing the first element starts the transition
      this.elements.shift();
    },

    // Method that moves the bottom element to the top
    moveLastToBegin: function() {
      if (!this.elements || this.elements.length < 2)
        return;

      var lastItem = this.elements[this.elements.length-1];
      var lastElement = $("." + this.rotatableClass)[this.elements.length-1];
      var lastElemHeight = lastElement.clientHeight;

      // Translate all div's down
      $("." + this.rotatableClass).addClass("translate");
      $("." + this.rotatableClass).css("transform", "translate(0, " + lastElemHeight + "px)");

      // Function that is executed after the transition
      // Here the last element is added to the begin
      var addToBegin = function() {
        this.elements.unshift(lastItem);
        lastElement.removeEventListener("transitionend", addToBegin);
        $("." + this.rotatableClass).removeClass("translate");
        $("." + this.rotatableClass).css("transform", "");

        this.notifyRotationEnd();
      }.bind(this);
      lastElement.addEventListener("transitionend", addToBegin, false);

      // Removing the last element starts the transition
      this.elements.pop();
    },

    // Notify the parent and its children that a rotation is done.
    notifyRotationEnd: function() {
      this.$parent.$broadcast("rotation-end");
    }
  }
}
</script>
<style>
</style>

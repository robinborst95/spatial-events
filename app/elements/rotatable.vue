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
      elements: [],
      afterTransitionFunc: null,
      intervalVar: null
    }
  },

  ready: function() {
    if (this.setElementsEvent !== null) {
      this.$on(this.setElementsEvent, this.setElements);
    }

    // The transitionend event is not fired when the document becomes invisible,
    // so we need to call that function to prevent items to be removed permanently.
    document.addEventListener("visibilitychange", function() {
      // The page is hidden, but a transition is in progress
      if (document.visibilityState === "hidden") {
        console.log("Page becomes hidden");

        if (this.afterTransitionFunc !== null) {
          console.log("Perform after transition");

          this.afterTransitionFunc();
          this.afterTransitionFunc = null;

          // Somehow, at this point the removed div is not removed yet, so remove it
          if (this.direction === "secondToTop")
            $("." + this.rotatableClass + ":first").remove();
          else if (this.direction === "lastToTop")
            $("." + this.rotatableClass + ":last").remove();
        }

        if (this.intervalVar !== null) {
          console.log("Clear interval");

          this.clearInterval();
        }
      } else {
        console.log("Page becomes visible");
        console.log("Start interval");

        this.startInterval();
      }
    }.bind(this));
  },

  methods: {
    clearInterval: function() {
      window.clearInterval(this.intervalVar);
      this.intervalVar = null;
    },

    // Attach the elements
    setElements: function(elements) {
      this.elements = elements;
      this.startInterval();
    },

    startInterval: function() {
      var moveFunc = null;
      if (this.direction === "secondToTop")
        moveFunc = this.moveFirstToEnd
      else if (this.direction === "lastToTop")
        moveFunc = this.moveLastToBegin

      this.intervalVar = window.setInterval(moveFunc, this.interval);
    },

    // Method that moves the top element to the bottom
    moveFirstToEnd: function() {
      if (!this.elements || this.elements.length < 2) {
        console.log("Too few elements to animate.");
        return;
      }

      if (!$("." + this.rotatableClass).hasClass("expand-transition")) {
        console.log("The rotatable div's should have transition expand.");
        return;
      }

      var firstItem = this.elements[0];
      var firstElement = $("." + this.rotatableClass)[0];
      var firstElemHeight = $("." + this.rotatableClass + ":first").outerHeight(true);

      // Translate all div's up
      $("." + this.rotatableClass).addClass("translate");
      $("." + this.rotatableClass).css("transform", "translate(0, -" + firstElemHeight + "px)");

      var afterTransition = function() {
        this.addElement(function() {
          this.elements.push(firstItem);
        }.bind(this), firstElement, afterTransition);
      }.bind(this);
      firstElement.addEventListener("transitionend", afterTransition, false);

      // Remember the function that readds the removed item
      this.afterTransitionFunc = afterTransition;

      this.elements.shift();
    },

    // Method that moves the bottom element to the top
    moveLastToBegin: function() {
      if (!this.elements || this.elements.length < 2) {
        console.log("Too few elements to animate.");
        return;
      }

      if (!$("." + this.rotatableClass).hasClass("expand-transition")) {
        console.log("The rotatable div's should have transition expand.");
        return;
      }

      var lastItem = this.elements[this.elements.length-1];
      var lastElement = $("." + this.rotatableClass)[this.elements.length-1];
      var lastElemHeight = $("." + this.rotatableClass + ":last").outerHeight(true);

      // Translate all div's down
      $("." + this.rotatableClass).addClass("translate");
      $("." + this.rotatableClass).css("transform", "translate(0, " + lastElemHeight + "px)");

      // Function that is executed after the transition
      // Here the last element is added to the begin
      var afterTransition = function() {
        this.addElement(function() {
          this.elements.unshift(lastItem);
        }.bind(this), lastElement, afterTransition);
      }.bind(this);
      lastElement.addEventListener("transitionend", afterTransition, false);

      // Remember the function that readds the removed item
      this.afterTransitionFunc = afterTransition;

      // Removing the last element starts the transition
      this.elements.pop();
    },

    // Function that is executed after the transition
    addElement: function(addFunc, removedElement, listenerFunc) {
      addFunc();
      removedElement.removeEventListener("transitionend", listenerFunc);
      $("." + this.rotatableClass).removeClass("translate");
      $("." + this.rotatableClass).css("transform", "");

      this.notifyRotationEnd();

      this.afterTransitionFunc = null;
    },

    // Notify the parent and its children that a rotation is done.
    notifyRotationEnd: function() {
      this.$parent.$broadcast("rotation-end");
    }
  }
}
</script>
<style>
.translate {
  transition: transform .6s linear;
}
</style>

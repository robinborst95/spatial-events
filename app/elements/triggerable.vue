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
      elements: [],
      cannotEndZoom: false,
      cachedTiles: {},
    	curTilePoint: null
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
      // To set the zoom duration, we need a work-around.
      this.setZoomWorkAround();
      // To Cache the background when zooming out, we need a work-around.
      this.setCacheBgWorkAround();

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
      var southWest = L.latLng(action.value.sw.lat, action.value.sw.lon);
      var northEast = L.latLng(action.value.ne.lat, action.value.ne.lon);
      var bounds = L.latLngBounds(southWest, northEast);

      // If the map is already at the wanted view,
      // just execute the next actions.
      var curCenterLat = parseFloat(map.getCenter().lat);
      var curCenterLon = parseFloat(map.getCenter().lng);
      var newCenterLat = parseFloat(bounds.getCenter().lat);
      var newCenterLon = parseFloat(bounds.getCenter().lng);
      if (Math.abs(curCenterLat - newCenterLat) < 0.01 && Math.abs(curCenterLon - newCenterLon) < 0.01) {
        return nextActionsFunc;
      }

      return function() {
        // When the map is done moving, remove listener and execute next actions
        var afterSetView = function() {
          // console.log("Set view to [" + map.getCenter().lat + ", " + map.getCenter().lng + "], zoom " + map.getZoom());
          map.off("moveend", afterSetView);

          if (action.actionAfter) {
            this.getActionWait(action.actionAfter, nextActionsFunc)();
          } else {
            nextActionsFunc();
          }
        }.bind(this);
        map.on("moveend", afterSetView);

        map.fitBounds(bounds);
        this.setZoomTimeout();
      }.bind(this);
    },

    getActionWait: function(action, nextActionsFunc) {
      var timeout = action.value;

      return function() {
        // console.log("Wait for " + timeout + " milliseconds");
        window.setTimeout(function() {
          nextActionsFunc();
        }, timeout);
      };
    },

    // Mapbox uses a timeout function to fire the zoomend event. To declare our own
    // duration we need to intercept the zoom end function and check whether we the
    // animation actually ended. If the zoom cannot be ended, we ignore the call,
    // otherwise we just call the zoomend function of mapbox.
    setZoomWorkAround: function() {
      var zoomendFunc = map._onZoomTransitionEnd;

      map._onZoomTransitionEnd = function() {
        if (this.cannotEndZoom) {
          return;
        }
        zoomendFunc.bind(map)();
      }.bind(this);
    },

    // To set the zoom duration we need to set an interval greater than 250 ms
    // (the default zoom duration of mapbox) to catch that timeout call and
    // less than the wanted duration. Then we set a timeout for our wanted
    // duration, like mapbox did it. (Also set the duration in the css!)
    setZoomTimeout: function() {
      this.cannotEndZoom = true;
      window.setTimeout(function() {
        this.cannotEndZoom = false;
      }.bind(this), 500);
      window.setTimeout(function() {
        map._onZoomTransitionEnd();
      }, 1500);
    },

    // In mapbox, the view is updated when the zoom is finished, so while
    // zooming, the background is white. To prevent this, we need to make
    // the cached background visible while zooming.
    // To prevent the screen from flickering when the zoom has ended (the
    // view is reloaded then), we cache the tiles so that they can be reloaded.
    setCacheBgWorkAround: function() {
      var _this = this;

      // To prevent the background buffer from being cleared, we ignore clearing.
  		map.tileLayer._clearBgBuffer = function() {	};

      // When mapbox wants a tile, it calls _getTile, in which a new tile is
      // created. Since we don't want reloading to prevent flickering, we cache
      // the created tiles and return a cached tile if the tile at that position
      // has already been seen.
  		var getTileFunc = map.tileLayer._getTile;
  		map.tileLayer._getTile = function() {
  			var key = _this.curTilePoint.x + ":" + _this.curTilePoint.y;
  			if (_this.cachedTiles[key]) {
  				return _this.cachedTiles[key];
  			}

  			var tile = getTileFunc.bind(this)();
  			_this.cachedTiles[key] = tile;
  			return tile;
  		}.bind(map.tileLayer);

      // In _getTile the current position is not passed, so we save it here.
  		var addTileFunc = map.tileLayer._addTile;
  		map.tileLayer._addTile = function(tilePoint, container) {
  			_this.curTilePoint = tilePoint;
  			addTileFunc.bind(this)(tilePoint, container);
  		}.bind(map.tileLayer);

      // In _prepareBgBuffer the background is set invisible,
      // so we remove that style property so make it visible.
  		var prepareBgBufferFunc = map.tileLayer._prepareBgBuffer;
  		map.tileLayer._prepareBgBuffer = function() {
  			prepareBgBufferFunc.bind(this)();
  			this._tileContainer.style.visibility = "";
  		}.bind(map.tileLayer);
    }
  }
}
</script>
<style>
.leaflet-zoom-anim .leaflet-zoom-animated {
  transition: transform 1.5s cubic-bezier(0,0,0.25,1);
}
</style>

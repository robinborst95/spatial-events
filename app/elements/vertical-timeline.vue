<template>
  <div class="vertical-timeline">
    <div transition="expand" @click="clickEvent(event, $event)"  v-for="event in events.items" class="timeline-block rotatable">
      <!-- <div class="timeline-img">
        <img :src="event.image" alt="" />
      </div> -->
      <div class="timeline-content">
        <img class="timeline-img" :src="event.image" alt="" />
        <h4>{{ event.name }}</h4>
        <p>
          {{ event.description }}
        </p>
      </div>
    </div>

    <rotatable
      rotatable-class="rotatable"
      set-elements-event="elements-found"
      :interval="5000"
      direction="secondToTop"></rotatable>
    <triggerable
      :trigger-events="['rotation-end']"
      set-elements-event="elements-found"></triggerable>
  </div>
</template>
<script>
import rotatable from "./rotatable.vue";
import triggerable from "./triggerable.vue";

export default {
  ready() {
    fetch("data/wadden.json")
      .then((data) => { return data.json(); })
      .then((data) => {
        console.log("Found wadden data");
        this.$data.events = data;
        this.$broadcast("elements-found", data.items);
      });
  },
  // new instance data
  data() {
    return {
      events: {
        items: []
      }
    };
  },

  components: {
    "rotatable": rotatable,
    "triggerable": triggerable
  },

  methods: {
    // Don"t use arrow function, otherwise we don"t have this
    clickEvent: function(item, evt) {
      console.log(item, evt,  this);
    }
  },
  filters: {
    "date-fmt": (x) => { return moment(x).fromNow(); }
  }
}
</script>
<style>
.vertical-timeline::before {
 /* this is the vertical line */
 /*content: "";
 position: absolute;
 top: 0;
 left: 0px;
 height: 100%;
 width: 2px;
 background: #aeaeae;*/
}

.timeline-content {
  text-align: justify;
}

.timeline-img {
 float:left;
 filter: saturate(20%);
 border-radius: 50%;
 width: 40px ;
 height: 40px;
 margin-right: 10px;
}

.timeline-block {
  padding: 10px;
  border-color: #AEAEAE;
  border-radius: 10px;
  border-width: thin;
  border-style: solid;
  margin: 5px 5px 5px 5px;
  flex: 1 100%;
  cursor: pointer;
}

.timeline-block img {
  border-color: #AEAEAE;
  border-radius: 10px;
  border-width: thin;
  border-style: solid;
  flex: 1 100%;
}

.timeline-block:hover {
  box-shadow: 0 0 3px 1px hsl(0, 0%, 80%);
}

.timeline-content h4 {
  line-height: 40px;
  margin-top: 0px;
}

.vertical-timeline h1, h2, h3, h4, h5, h6 {
  font-weight: 300;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.vertical-timeline {
  font-weight: 300;
  height: 100vh;
  padding: 0;
  margin: 0;
  color: #AEAEAE;
  background-color: #1E1E1E;
  display: flex;
  flex-flow: row wrap;
  overflow-y: scroll;
}

</style>

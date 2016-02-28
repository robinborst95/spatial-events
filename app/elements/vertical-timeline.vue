<template>
  <div class="vertical-timeline">
    <div transition="fade" @click="clickEvent(event, $event)"  v-for="event in events.items" class="timeline-block">
      <div class="timeline-img">
        <img :src="event.snippet.thumbnails.high.url" alt="" />
      </div>
      <div class="timeline-content">
        <h4><span class="event-source"><i class="fa fa-youtube"></i></span> {{ event.snippet.title }} </h4>
        <p>
          {{ event.snippet.description }}
        </p>
        <a href="{{ event.url }}" class="timeline-details" v-if="event.url">details</a>
        <span class="timeline-date" >{{ event.snippet.publishedAt | date-fmt}}</span>

      </div>
    </div>
  </div>
</template>
<script>
  export default {
    ready() {
      fetch("data/videos.json")
        .then((data) => { return data.json(); })
        .then((data) => {
          console.log('video data', this, data, this.data);
          this.$data.events = data;
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
    methods: {
      // Don't use arrow function, otherwise we don't have this
      clickEvent: function(item, evt) {
        console.log(item, evt,  this);
      }
    },
    filters: {
      'date-fmt': (x) => { return moment(x).fromNow(); }
    }
  }
</script>
<style>
.fade-transition {
 transition: opacity .3s ease;
}

/* .expand-enter defines the starting state for entering */
/* .expand-leave defines the ending state for leaving */
.fade-enter, .fade-leave {
 opacity: 0;
}
 .vertical-timeline::before {
   /* this is the vertical line */
   /*content: '';
   position: absolute;
   top: 0;
   left: 25px;
   height: 100%;
   width: 4px;
   background: #aeaeae;*/
 }
 .timeline-img {
   float:left;
   filter: saturate(20%);
   border-radius: 50%;
   width: 50px ;
   height: 50px;
   margin-top: 10px;
   margin-left: -65px;
 }
.timeline-img img {

   width: 50px;
   height: 50px;
   border-radius: 50%;

 }
  .timeline-block {
    padding: 10px;
    border-color: #AEAEAE;
    border-radius: 10px;
    border-width: thin;
    border-style: solid;
    margin: 5px 0px 5px 60px;
    flex: 1 100%;
    cursor: pointer;
    max-width: calc(100% - 65px);
  }
  .timeline-block:hover {
    box-shadow: 0 0 3px 1px hsl(0, 0%, 80%);
  }
  .timeline-block:hover .timeline-img {
    box-shadow: 0 0 3px 1px hsl(0, 0%, 80%);
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
    overflow: scroll;

  }

</style>

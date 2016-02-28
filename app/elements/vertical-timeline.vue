<template>
  <div class="vertical-timeline">
    <div v-for="event in events.items" class="timeline-block">
      <div class="timeline-img">
        <img :src="event.snippet.thumbnails.high.url" alt="" />
      </div>
      <div class="timeline-content">
        <h4>{{ event.snippet.title }}</h4>
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

    filters: {
      'date-fmt': (x) => { return moment(x).fromNow(); }
    }
  }
</script>
<style>
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
   // position: absolute;
   // left: -27px;
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
  }

  .vertical-timeline {
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

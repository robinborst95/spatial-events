import Vue from 'vue';
import eventEditor from './event-editor.vue';
import verticalTimeline from './vertical-timeline.vue';

new Vue({
  el: 'body',
  components: {
    'event-editor': eventEditor,
    'vertical-timeline': verticalTimeline
  }
});

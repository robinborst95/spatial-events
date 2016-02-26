<template>
  <div class="modal fade" id="modal-form">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
          <h4 class="modal-title">Event properties</h4>
        </div>
        <div class="modal-body">
          <form class="form-horizontal">
            <div class="form-group">
              <label class="col-sm-2 control-label">start date</label>
              <div class="col-sm-10">
                <div class="input-group date" id="startDate">
                  <input type="text" class="form-control"/>
                  <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                  </span>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">end date</label>
              <div class="col-sm-10">
                <div class="input-group date" id="endDate">
                  <input type="text" class="form-control"/>
                  <span class="input-group-addon">
                    <span class="glyphicon glyphicon-calendar"></span>
                  </span>

                </div>
              </div>
            </div>
            <div class="form-group">
              <label class="col-sm-2 control-label">tags</label>
              <div class="col-sm-10">
                <input   id="tags" data-role="tagsinput" />
              </div>
            </div>
          </form>
        </div><!-- /.modal-body -->
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-primary" id="save" >Save changes</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal  -->
</template>


<script>
  export default {
    ready () {
      console.log('ready', this, 'we should now bind', $(this.$el).modal, 'to an event');
      /* $('#startDate').data('DateTimePicker').date(moment(layer.feature.properties.startDate));
         $('#endDate').data('DateTimePicker').date(moment(layer.feature.properties.endDate));
         $('#modal-form').data(layer); */

    },
    methods: {
      show () {
        /* show the form */
        $(this.$el).modal({});
      }
    },
    data () {
      return {
        startDate: new Date()
      }
    }
  }
</script>

<style>
</style>

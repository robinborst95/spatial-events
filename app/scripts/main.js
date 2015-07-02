/* global addMap */
/* jshint devel:true */
'use strict';

addMap();
$(function () {
    $('#startDate').datetimepicker();
    $('#endDate').datetimepicker();
    $("#save").click(function(e){
        // store data
        $("#modal-form").modal('hide');
        // get variables from the form
        var layer = $('#modal-form').data();
        var properties =  layer.feature.properties;
        properties.startDate = $('#startDate').data("DateTimePicker").date().toJSON();
        properties.endDate = $('#endDate').data("DateTimePicker").date().toJSON();
        properties.tags = $('#tags').val();
        console.log('geojson', layer.toGeoJSON());
    });
});

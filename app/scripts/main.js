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
        var properties =  $('#modal-form').data().feature.properties;
        properties.startDate = $('#startDate').data("DateTimePicker").date().toJSON();
        properties.endDate = $('#endDate').data("DateTimePicker").date().toJSON();

    });
});
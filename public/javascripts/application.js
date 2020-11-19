$(document).ready(function() {
  
  /* CHARGES */
  $('#charge_customer_id').focus();

  $('.new_charge #charge_customer_id').change(function() {
    $.getJSON('/customers/' + $(this).val(), function(data) {
  		$('#customer-notes').html(data.customer.notes);
  		$('#charge_total').val(data.customer.rate);
  	});
  });
  
  $('.edit_charge #charge_customer_id').change(function() {
    $.getJSON('/customers/' + $(this).val(), function(data) {
  		$('#customer-notes').html(data.customer.notes);
  	});
  });
  
  /* VEHICLE ISSUES */
  $('#all').click(function(event) { 
    $("#vehicle_issues input[type=checkbox]").attr("checked", true);
    event.preventDefault();
  });
  
  $('#none').click(function(event) { 
    $("#vehicle_issues input[type=checkbox]").attr("checked", false);
    event.preventDefault();
  });
});

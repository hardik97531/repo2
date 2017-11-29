var table = $('#dataTable').DataTable({
	"order":['1','asc'],
	"ajax": "get-data.php",
	"processing": true,
	"columns": [
		{ "data": "id" },
        { "data": "firstname" },
        { "data": "lastname" },
        { "data": "email" },
        { "data": "action","className" : "text-center" }
    ],		        
	"columnDefs": [
		{"targets": [0], "visible": false, "orderable": false, "searchable": false},
        {"targets": [-1], "orderable": false, "searchable": false},
        {"targets": '_all', "visible": true }
    ],
    "sPaginationType": "full_numbers",
    "language": {
    	"sEmptyTable": "No users available",
    	"loadingRecords": "Please wait - loading...",
    	"processing": "<img src='images/ajax-loader2.gif' />",
	    "paginate": {
	    	"previous"	: 	'<span class="glyphicon glyphicon-chevron-left"></span>&nbsp;Previous',
	      	"next"		: 	'<span class="glyphicon glyphicon-chevron-right"></span>&nbsp;Next',
	      	"first"		: 	'<span class="glyphicon glyphicon-backward"></span>&nbsp;First',
	      	"last"		: 	'<span class="glyphicon glyphicon-forward"></span>&nbsp;Last',
	    }
	},
	'createdRow': function(row,data,dataIndex){
		var id = $('td',row).eq(3).find('span').text();
      	$(row).attr('id','tr_'+id);
  	}
});
$('select').select2();
$('*[data-toggle="tooltip"]').tooltip();
function confirm_delete(id){
	swal({
		title: "Are you sure you want to delete this user?",
        text: "You will not be able to recover this user!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, I am sure!',
        cancelButtonText: "No, cancel it!",
        closeOnConfirm: false,
        closeOnCancel: false,
        showLoaderOnConfirm: true,
    },
    function(isConfirm){
        if(isConfirm){
            $.ajax({
                type: "POST",
                url: "delete.php?id="+id,
                data: {id:id},
                success: function(data){
                    var res = $.parseJSON(data);
                    if(res != false) {
                    	var tr = $('#tr_'+id);
                    	tr.hide("slow", function(){ table.row(tr).remove(); table.ajax.reload(); });
                        swal("Deleted","User deleted successfully", "", "success");
                    }
                }
            });
        }else{
            swal("Cancelled", "Your user is safe :)", "error");
        }
    });
}
$('#Submit').click(function(){
	$('#add-user-form').validate({
		rules:{
			"firstname":{
				required:true
			},
			"lastname":{
				required:true
			},
			"email":{
				required:true,
				email:true
			}
		},
		messages:{
			"firstname":{
				required:"Please enter firstname"
			},
			"lastname":{
				required:"Please enter lastname"
			},
			"email":{
				required:"Please enter email",
				email:"Please enter valid email"
			}
		},
		submitHandler:function(form){
			$.ajax({
				url:'add-action.php',
				data:$(form).serialize(),
				type:'POST',
				success:function(response){
					$('#AddModal').modal('hide');
					$('#AddModal #firstname,#AddModal #lastname,#AddModal #email').val('');
					table.ajax.reload();
					swal("Added","User added successfully","success");
				}
			});
		}
	});
});
function get_details(id){
	$.ajax({
		url:'get-details.php',
		type:'GET',
		data:'id='+id,
		success:function(response){
			var result = JSON.parse(response);
			if(result.status==100){
				$('#EditModal input[id="id"]').val(id);
				$('#EditModal input[id="firstname"]').val(result.data.firstname);
				$('#EditModal input[id="lastname"]').val(result.data['lastname']);
				$('#EditModal input[id="email"]').val(result.data.email);
			}else{
				toastr.error("Something went wrong");
			}
		}
	});
}
function view_details(id){
	$.ajax({
		url:'view-details.php',
		type:'GET',
		data:'id='+id,
		success:function(response){
			var result = JSON.parse(response);
			if(result.status==100){
				$('#ViewModal a[id="full-name"]').html(result.data.fullname);
				$('#ViewModal a[id="view-email"]').html(result.data['email']).attr('href','mailto:'+result.data['email']);
			}else{
				toastr.error("Something went wrong");
			}
		}
	});
}
$('#Update').click(function(){
	$('#edit-user-form').validate({
		rules:{
			"firstname":{
				required:true
			},
			"lastname":{
				required:true
			},
			"email":{
				required:true,
				email:true
			}
		},
		messages:{
			"firstname":{
				required:"Please enter firstname"
			},
			"lastname":{
				required:"Please enter lastname"
			},
			"email":{
				required:"Please enter email",
				email:"Please enter valid email"
			}
		},
		submitHandler:function(form){
			$.ajax({
				url:'edit-action.php',
				data:$(form).serialize(),
				type:'POST',
				success:function(response){
					$('#EditModal').modal('hide');
					table.ajax.reload();
					swal("Updated","User updated successfully","success");
				}
			});
		}
	});
});
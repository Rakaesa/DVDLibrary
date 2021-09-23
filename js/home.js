$(document).ready(function () {
    loadDvds();
	$('#addDiv').hide();
	$('#editDiv').hide();
	toggleForm();
	addDvd();
	searchForm();
});


function loadDvds() {
    clearDvdTable();
    var contentRows = $('#contentRows');
    
    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
        success: function(dvdArray) {
            $.each(dvdArray, function(index, dvd){
				var id = dvd.id;
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
				var rating = dvd.rating;
                
                var row = '<tr>';
                    row += '<td>' + title + '</td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating +'</td>';
					row += '<td><a href="javascript:editDvd('+id+')" onclick="javascript:toggleEdit('+id+')">Edit</a> | <a id="'+id+'" href="javascript:deleteDvd('+id+')">Delete</a></td>';
                    row += '</tr>';
                
                contentRows.append(row);
            })
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
    }); 
}

function clearDvdTable() {
    $('#contentRows').empty();
}

function toggleForm(){
	
	$('#createDvdBtn').click(function(){
		if($('#addDiv').is(":hidden"))
			$('#addDiv').show();
		else
			$('#addDiv').hide();
	});		
}

function searchForm(){
	
	$('#searchBtn').click(function(){
		var term = $('#searchTerm').val();
		var searchCat = $('#categories option:selected').val();
		
		clearDvdTable();
		$.ajax({
			type: 'GET',
			url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/'+searchCat+'/'+term,
			success: function(dvdArray) {
            $.each(dvdArray, function(index, dvd){
				var id = dvd.id;
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
				var rating = dvd.rating;
                
                var row = '<tr>';
                    row += '<td>' + title + '</td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating +'</td>';
					row += '<td><a href="javascript:editDvd('+id+')" onclick="javascript:toggleEdit('+id+')">Edit</a> | <a id="'+id+'" href="javascript:deleteDvd('+id+')">Delete</a></td>';
                    row += '</tr>';
                
                contentRows.append(row);
            })
        },
        error: function() {
            $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.'));
        }
		});
		
	});	
	
}

function toggleEdit(dvdId){
	
		$('#editDiv').show();	
		$('#errorMessages').empty();
			
		$.ajax({
			type: 'GET',
			url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
			success: function(dvd, status) {
				$('#editTitle').val(dvd.title);
				$('#editReleaseYear').val(dvd.releaseYear);
				$('#editDirector').val(dvd.director);
				$('#editRating').val(dvd.rating);
				$('#editNotes').val(dvd.notes);
				
			},
			error: function() {
				$('#errorMessages')
				.append($('<li>')
				.attr({class: 'list-group-item list-group-item-danger'})
				.text('Error calling web service. Please try again later.')); 
			}
		})	
}

function addDvd() {
    $('#addButton').click(function (event) {
		var haveValidationErrors = checkAndDisplayValidationErrors($('#addForm').find('input'));
        
        if(haveValidationErrors) {
            return false;
        }
        $.ajax({
           type: 'POST',
           url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd',
           data: JSON.stringify({
                title: $('#addTitle').val(),
                releaseYear: $('#addReleaseYear').val(),
                director: $('#addDirector').val(),
                rating: $('#addRating option:selected').val(),
                notes: $('#addNotes').val()
           }),
           headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
           },
           'dataType': 'json',
           success: function() {
               $('#errorMessages').empty();
               $('#addTitle').val('');
               $('#addReleaseYear').val('');
               $('#addDirector').val('');
               $('#addRating option:selected').val('');
               $('#addNotes').val('');
			   $('#addForm').hide();
               loadDvds();
           },
           error: function () {
               $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('Error calling web service. Please try again later.')); 
           }
        })
    });
}

function editDvd(dvdId) {
    $('#editBtn').click(function(event) {
		var haveValidationErrors = checkAndDisplayValidationErrors($('#editForm').find('input'));
        
        if(haveValidationErrors) {
            return false;
        }
        $.ajax({
            type: 'PUT',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
            data: JSON.stringify({
                title: $('#editTitle').val(),
                releaseYear: $('#editReleaseYear').val(),
                director: $('#editDirector').val(),
                rating: $('#editRating option:selected').val(),
                notes: $('#editNotes').val()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            success: function() {
                $('#errorMessage').empty();
				$('#editDiv').hide();
				loadDvds();
            },
            error: function() {
                $('#errorMessages')
                .append($('<li>')
                .attr({class: 'list-group-item list-group-item-danger'})
                .text('HOW????')); 
				
            }
        });
    });
}

function checkAndDisplayValidationErrors(input) {
    $('#errorMessages').empty();
    
    var errorMessages = [];
    
    input.each(function() {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }  
    });
    
    if (errorMessages.length > 0){
        $.each(errorMessages,function(index,message) {
            $('#errorMessages').append($('<li>').attr({class: 'list-group-item list-group-item-danger'}).text(message));
        });
        // return true, indicating that there were errors
        return true;
    } else {
        // return false, indicating that there were no errors
        return false;
    }
}

function deleteDvd(dvdId) {
    $.ajax({
        type: 'DELETE',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + dvdId,
        success: function() {
            loadDvds();
        }
    });
}
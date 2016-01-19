var name,data,crimDisp,blurb,address,caseNum,dob,docLink,mediaLink,isFeat,age
var today = new Date();


function readMore() {

	// Grab all the excerpt class
	$('.excerpt').each(function () {
  		//console.log("Here");

		// Run formatWord function and specify the length of words display to viewer
		$(this).html(formatWords($(this).html(), 50));
	//	console.log($(this).html(formatWords($(this).html(), 30)));
		// Hide the extra words
		$(this).children('span').hide();
	
	// Apply click event to read more link
	}).click(function () {

		// Grab the hidden span and anchor
		var more_text = $(this).children('span.more_text');
		var ellipsis = $(this).children('span.ellipsis');
		var more_link = $(this).children('a.more_link');
			
		// Toggle visibility using hasClass
		// I know you can use is(':visible') but it doesn't work in IE8 somehow...
		if (more_text.hasClass('hide')) {
			more_text.show();
			ellipsis.hide();
			more_link.html(' Read less');		
			more_text.removeClass('hide');
		} else {
			more_text.hide();
			ellipsis.show();
			more_link.html(' Read more');			
			more_text.addClass('hide');
		}

		return false;
	
	});
}

// Accept a paragraph and return a formatted paragraph with additional html tags
function formatWords(sentence, show) {

	// split all the words and store it in an array
	var words = sentence.split(' ');
	var new_sentence = '';

	// loop through each word
	for (i = 0; i < words.length; i++) {

		// process words that will visible to viewer
		if (i <= show) {
			new_sentence += words[i] + ' ';
			
		// process the rest of the words
		} else {
	
			// add a span at start
			if (i == (show + 1)) new_sentence += '<span class="ellipsis">... </span><span class="more_text hide">';		

			new_sentence += words[i] + ' ';
		
			// close the span tag and add read more link in the very end
			if (words[i+1] == null) new_sentence += '</span><a href="#" class="more_link"> Read more</a>';
		} 		
	} 

	return new_sentence;

}	

function loadData(filter){
  $('#main_content').empty();
  $.getJSON('data/'+filter+'.json', function(data) { //grab json file which is built via the database
    
    $('#main_content').append("<div class='row'>");
    
  			$.each(data, function(i, item) {
    			
    			isFeat = item.featured;
    			name = item.data[0]['name'];
    			dob = item.data[0]['dob'];
    			year = "19"+dob.split("/")[2];
    			age = today.getFullYear()-year;
    			crimDisp = item.data[0]['crim_disp'];
    			address = item.address;
    			blurb = item.blurb;
    			
    			if(isFeat == "Y"){
      			
  				  $("#main_content").append("<div class='col-sm-12'><div class='panel panel-default'><div class='panel-body'><div class='col-sm-3 col-xs-3'><img src='images/example_pic.png' class='img-responsive' alt='photo' /></div><div class='feat_name'>"+name+"</div><div class='feat_age'>Age: "+age+"</div><div class='feat_crim_disp'>"+crimDisp+"</div><br /><div class='feat_address'>"+address+"</div><br /><div class='excerpt'>"+blurb+"</div></div></div></div></div>");
  				  
  				}else{
    				
    				if(item.data.length > 1){
      				
      				  $("#main_content").append("<div class='col-sm-6'><div class='panel panel-default'><div class='panel-body'><div id='nf_names_"+i+"' class='row'></div><br /><div class='nf_address'>"+address+"</div><br /><div class='excerpt'>"+blurb+"</div></div></div></div></div>");	
      				  
    			    for (var j = 0; j <= item.data.length-1; j++){
      			    
      			    dob = item.data[j]['dob'];
      			    year = "19"+dob.split("/")[2];
      			    age = today.getFullYear()-year;
      			                     
                $('#nf_names_'+i).append("<div class='col-sm-3'><div class='nf_name '>"+item.data[j].name+"</div><div>Age: "+age+"</div><div class='nf_crim_disp'>"+item.data[j].crim_disp+"</div></div>");     			      
      			    
    			    }
    			    
    			  }else{
      			  
      			  $("#main_content").append("<div class='col-sm-6'><div class='panel panel-default'><div class='panel-body'><div class='nf_name'>"+name+"</div><div class='nf_age'>Age: "+age+"</div><div class='nf_crim_disp'>"+crimDisp+"</div><br /><div class='nf_address'>"+address+"</div><br /><div class='excerpt'>"+blurb+"</div></div></div></div></div>");
      			  
    			  }
    			  
  				}
  				
        })
        readMore();
       $('.ellipsis').show();
       $('#main_content').append("</div>");
        
       
    })
    
   
}


$(document).ready(function(){
  
    loadData("all");
    
  $(".read_more").bind( "click", function() {
    
    $(".blurb_more").show();
    
  })
  
  
  $('.btn').on('click', function (e) {
    
    var filter = $(this).html().split('<br>')[1];
    loadData(filter);

     //your awesome code here

  })
  
  var loadMap = function () {
    var map = L.map("map-container",{
        scrollWheelZoom: true
    }).setView([40.815639, -73.957344], 12);
    L.tileLayer('https://api.tiles.mapbox.com/v4/mapbox.dark/{z}/{x}/{y}.png?access_token=pk.eyJ1Ijoibnlkbm1hcHMiLCJhIjoiM1dZem9aWSJ9.x22rTAWkRpNy2bOTlVe1jg', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 14,
        minZoom: 6
    }).addTo(map);

    var geojsonMarkerOptions = {
    radius: 4,
    fillColor: "#F78181",
    color: "#F78181",
    weight: 2,
    opacity: 1,
    fillOpacity: 0.8
    };

    L.geoJson(evict_data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, geojsonMarkerOptions);
        }, onEachFeature: onEachFeature
    }).addTo(map);
    
     };

    loadMap();
  
})
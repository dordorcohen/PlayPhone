var rows = 3;
var playback = "Off";
var playback_file;
playing = true;
last = '';
first_load=true;

window.onload = function(){
	// should remain in this order!
	sounder = new Sounder('Major','C',rows);
	sounder.choose_scale('Major');
	sounder.choose_root('C');
	//this.choose_playback('None');
	load_buttons();

	document.addEventListener("pause", onPause, false);
	document.addEventListener("resume",onResume,false);
}

function onPause() {
	// Handle the pause event
	try {
		playback_file.pause();
	} catch (err) { }
}

function onResume() {
	try {
                playback_file.play();
        } catch (err) { }
}

function get_settings_td(index,color,text,onclick){
	tmp = "";
	tmp += "<td id = 'td_settings_"+index+"' style = 'position: relative;'>";
	tmp += "<div id = 'inner_settings_"+index+"' class = 'inner_settings' style = 'background-color: "+color+"' onclick = '"+onclick+"'>"+text+"</div>";
	tmp += "</td>";
	return tmp;
}

function load_buttons() {
	var instrument="Piano";
	var root="C";
	var scale="Major";
	var playback="Off";

	if (!first_load){
		instrument=document.getElementById('inner_settings_0').innerText;
		root=document.getElementById('inner_settings_1').innerText;
		scale=document.getElementById('inner_settings_2').innerText;
		playback=document.getElementById('inner_settings_3').innerText;
	}
	first_load=false;

	// add settings bar
	var settings_bar="";
	
	settings_bar += get_settings_td(0,"#ffff00",instrument,"next_instrument()"); // instrument
	settings_bar += get_settings_td(1,"#00ff00",root,"next_root()"); // key
	settings_bar += get_settings_td(2,"cyan",scale,"next_scale()"); // scale
	settings_bar += get_settings_td(3,"pink",playback,"next_playback()"); // playback

	document.getElementById("settings_table").innerHTML = settings_bar;

	// generating main table
	var table = "";
	
	// notes
	for (var row=0; row<rows; row++){
		table += "<tr>";
		for (var col=0; col<sounder.getScaleSize(); col++){
			table += "<td id = 'td_"+row+"_"+col+"'  style = 'position: relative'>";
			table += "<div id = 'outer_"+row+"_"+col+"' class = 'outer_circle'></div>";
			table += "<div id = 'inner_"+row+"_"+col+"' class = 'inner_circle'></div>";
			table += "</td>";
		}
		table += "</tr>";
	}
	document.getElementById("notes_table").innerHTML = table;
	//document.getElementById("inner_0_"+(sounder.getScaleSize()-1)).innerHTML="<img id = 'gear' src = 'img/gear.png' class = 'gear'>";

	// wait for DOM to load
	setTimeout(function(){ // wait until dom has been updated 
		
		// set touchmove event for playing
		document.addEventListener('touchmove', function(e) {
			if (playing){
				try{
					for (var i=0; i<e.touches.length; i++){
						e.preventDefault();
						var touch = e.touches[i];
						var td=find_td(touch.pageX,touch.pageY,rows, sounder.getScaleSize());
						if ((!sounder.isPlaying(td[0],td[1])) || last!=td[0]+'_'+td[1] ){ // to avoid multiple calls
							sounder.play(td[0],td[1]);
							last=td[0]+'_'+td[1];
						}
					}
				} catch (err) {
					/*console.log('############# #1 ####################');
					console.log(err);
					console.log('#####################################');*/
				}
			}
		}, false);

		// set touch startevent for playing
		document.addEventListener('touchstart', function(e) {
			if (playing){
				try{
					for (var i=0; i<e.touches.length; i++){
						e.preventDefault();
						var touch = e.touches[i];
						var td=find_td(touch.pageX,touch.pageY,rows, sounder.getScaleSize());
						sounder.play(td[0],td[1]);
						last=td[0]+'_'+td[1];
					}
				} catch (err) {
					/*console.log('############# #2 ####################');
					console.log(err);
					console.log('#####################################');*/
				}
			}
		}, false);
		
		// loading animation
		for (var col=0; col<sounder.getScaleSize(); col++){
			setTimeout(function(col){ // show column after column
				for (var row=0; row<rows; row++){
						// circles animation
						var midX=$("#outer_"+row+"_"+col).parent().width();
						var midY=$("#outer_"+row+"_"+col).parent().height();

						document.getElementById("outer_"+row+"_"+col).style.transform = "translateY("+(midY/2-25+1)+"px)";
						document.getElementById("inner_"+row+"_"+col).style.transform = "translateY("+(midY/2-20+1)+"px)";
				}
			}, 150*col,col);
		}


		// place text over circles
		for (var row=0; row<rows; row++)
			for (var col=0; col<sounder.getScaleSize(); col++)
				document.getElementById("inner_"+row+"_"+col).innerText=col+1;

		setTimeout(function(){
			for (var row=0; row<rows; row++)
				for (var col=0; col<sounder.getScaleSize(); col++)
					document.getElementById("inner_"+row+"_"+col).style.color = "#000";
		}, 3200);
	}, 100);
}

function next_instrument(){
	var instrument_cell=document.getElementById('inner_settings_0');
	var new_instrument = getNextInstrument(instrument_cell.innerText);
	instrument_cell.innerText=new_instrument;
	sounder.choose_instrument(new_instrument);
}

function next_root(){
	var root_cell=document.getElementById('inner_settings_1');
	var new_root = getNextNote(root_cell.innerText);
	root_cell.innerText=new_root;
	sounder.choose_root(new_root);
}

function next_scale(){
	var scale_cell=document.getElementById('inner_settings_2');
	var new_scale = getNextScale(scale_cell.innerText);
	scale_cell.innerText=new_scale;
	sounder.choose_scale(new_scale);
	load_buttons();
}

function next_playback(){
	var playback_cell=document.getElementById('inner_settings_3');
	var new_playback = getNextPlayback(playback_cell.innerText);
	playback_cell.innerText=new_playback;

	/*try {
		playback_file.pause();
		delete playback_file;
	} catch (err) { }
	playback_file = "";
	
	if (new_playback!='Off'){
		playback_file = new Audio("sound/playbacks/" + new_playback.replace(' ','') + ".mp3");
		playback_file.play();
	}*/
}

/******************************** Helper Functions **************************/

function find_td(x,y,rows, keys){
	for (var row=0; row<rows; row++){
		for (var col=0; col<keys; col++){
			var ele = document.getElementById("td_"+row+"_"+col);
			if (x>=ele.offsetLeft && x<ele.offsetLeft+ele.offsetWidth)
				if (y>=ele.offsetTop && y<ele.offsetTop+ele.offsetHeight)
					return [row,col];
		}
	}
}

function getNextNote(note){
	var notes = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#'];
	var i=0;
	while (notes[i]!=note){
		i++;
		if (i==notes.length){
			console.log("ERROR, couldnt find key");
			break;
		}
	}
	return notes[(i+1)%notes.length];
}

function getNextScale(scale){
	var scales = ['Major','Minor','Pentatonic','Chromatic'];
	var i=0;
	while (scales[i]!=scale){
		i++;
		if (i==scales.length){
			console.log("ERROR, couldnt find scale");
			break;
		}
	}
	return scales[(i+1)%scales.length];
}

function getNextInstrument(instrument){
	var instruments = ['Piano','Organ','Guitar','EDM'];
	var i=0;
	while (instruments[i]!=instrument){
		i++;
		if (i==instruments.length){
			console.log("ERROR, couldnt find instrument");
			break;
		}
	}
	return instruments[(i+1)%instruments.length];
}

function getNextPlayback(playback){
	//var playbacks = ['Off','80 BPM','100 BPM','120 BPM'];
	var playbacks = ['Playback','Coming','Soon'];
	var i=0;
	while (playbacks[i]!=playback){
		i++;
		if (i==playbacks.length){
			console.log("ERROR, couldnt find playback");
			break;
		}
	}
	return playbacks[(i+1)%playbacks.length];
}

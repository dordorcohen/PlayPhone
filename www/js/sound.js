
function Sounder(scale,root,octaves, instrument){
	this.root = 1; // first number
	this.scale = [0,2,4,5,7,9,11]; // scale array
	this.root_name = "C"; // C,C#,D,...
	this.scale_name = "Major"; // Major, Minor, Pentatonic, Chromatic...
	this.octaves=octaves;
	this.instrument = "Piano";
	this.instrument_offset = 12;
	this.sound_files = [];
	this.sound_files_counters = [];
 
	this.choose_instrument('Piano');
	this.choose_scale(scale);
	this.choose_root(root);
}

Sounder.prototype.choose_instrument = function(s) {
	this.instrument = s;
	switch(s){
		case "Piano":
			this.instrument_offset=12;
			break;
		case "Organ":
			this.instrument_offset=12;
			break;
		case "Guitar":
			this.instrument_offset=12;
			break;
		case "EDM":
			this.instrument_offset=0;
			break;
	}

	this.load_sound_files();
};

Sounder.prototype.choose_scale = function(s) {
	this.scale_name = s;
	switch(s){
		case "Major":
			this.scale=[0,2,4,5,7,9,11];
			break;
		case "Minor":
			this.scale=[0,2,3,5,7,8,10];
			break;
		case "Pentatonic":
			this.scale=[0,3,5,7,10];
			break;
		case "Chromatic":
			this.scale=[0,1,2,3,4,5,6,7,8,9,10,11];
			break;
	}
	this.load_sound_files();
};

Sounder.prototype.choose_root = function(r) {
	root_name = r;
	switch(r){
		case "C":
			this.root=1;
			break;
		case "C#":
			this.root=2;
			break;
		case "D":
			this.root=3;
			break;
		case "D#":
			this.root=4;
			break;
		case "E":
			this.root=5;
			break;
		case "F":
			this.root=6;
			break;
		case "F#":
			this.root=7;
			break;
		case "G":
			this.root=8;
			break;
		case "G#":
			this.root=9;
			break;
		case "A":
			this.root=10;
			break;
		case "A#":
			this.root=11;
			break;
		case "B":
			this.root=12;
			break;
	}

	this.load_sound_files();
};

Sounder.prototype.load_sound_files = function() {
	this.sound_files=[];
	for (var oct=0; oct<this.octaves; oct++){
		var tmp=[];
		var tmp_counters=[];
		for (var note=0; note<this.getScaleSize(); note++){
			tmp.push(new Audio("sound/instruments/" + this.instrument + "/" + this.instrument + "_"+ (this.instrument_offset+this.root+(2-oct)*12+this.scale[note]) +".wav"));
			tmp_counters.push(0);
		}
		this.sound_files.push(tmp)
		this.sound_files_counters.push(tmp_counters);
	}
};

Sounder.prototype.play = function(oct,note) {
	try{
		// restart audio object after every 15 plays
		this.sound_files_counters[oct][note]+=1;
		if (this.sound_files_counters[oct][note]>10){
			this.sound_files[oct][note]=new Audio("sound/instruments/" + this.instrument + "/" + this.instrument + "_"+ (this.instrument_offset+this.root+(2-oct)*12+this.scale[note]) +".wav");
			this.sound_files_counters[oct][note]=0;
			//console.log('Regeneration');
		}
		
		// play some music, baby
		this.sound_files[oct][note].currentTime=0;
		if (this.sound_files[oct][note].paused)
			this.sound_files[oct][note].play();

	} catch(err){
		this.sound_files[oct][note]=new Audio("sound/instruments/" + this.instrument + "/" + this.instrument + "_"+ (this.instrument_offset+this.root+(2-oct)*12+this.scale[note]) +".wav");
	}
};

Sounder.prototype.isPlaying = function(oct,note) {

	return !(this.sound_files[oct][note].paused);

};

Sounder.prototype.getScaleSize = function() {
	return this.scale.length;
};

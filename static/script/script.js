//=================================
//========Global Variables=========
//=================================
var current_beat = 0; //Zero-indexed from 0-15 denoting 16 beats
var next_beat = 1; //Zero-indexed from 0-15 denoting 16 beats
var intervalID;
var speedFactor = 800;
var currentMode = 0;

//Volume levels range from 0 - 14 for each 0th to 15th beat
var volumes = new Array(8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8);

//Note possibilities are 0 - 5 with 0 being first note and 5 == inactive
var current_note = new Array(5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5);
                            
//Speed values range from 1 - 5
var speed = 3;

//Bools
var is_playing = true;
var in_reverse = false;  
var pending = false;
var soundReady = false;
var mouseDown = false;

//Mode setup
// var modeColors = [
//     ['#22D8CF', '#2286D8', '#223DD8', '#BDA7D7', '#D7A8A8'],
//     ['#F685A8', '#F69B85', '#F6C885', '#EDF7C6', '#C7F7EB'],
//     ['#98ED8E', '#8EEDB4', '#8EEDDA', '#D0E1ED', '#ECD0ED'],
//     ['#BCEAA5', '#BCBEB3', '#BC99B3', '#FFD0B1', '#FFD089']
// ];

var modeSounds = [
    ['0mode0', '1mode0', '2mode0', '3mode0', '4mode0'],
    ['0mode1', '1mode1', '2mode1', '3mode1', '4mode1'],
    ['0mode2', '1mode2', '2mode2', '3mode2', '4mode2'],
    ['0mode3', '1mode3', '2mode3', '3mode3', '4mode3']
];

//Sound Setup
soundManager.url = './static/script/swf/'; // SM2 .SWFs
soundManager.flashVersion = 9;
soundManager.debugMode = true;  //In debug mode for dev/testing
soundManager.useHighPerformance = true;
soundManager.useHTML5Audio = true
var sounds = new Array();

soundManager.onready(function(){
    //Create the sounds
    var soundsPath = './static/sounds/'; 
    for(var i = modeSounds.length - 1; i >= 0; i--){
        for (var q = modeSounds[i].length - 1; q >= 0; q--){
          soundManager.createSound({
                id: modeSounds[i][q],
                url: soundsPath + modeSounds[i][q] + '.mp3',
                multiShot: true,
                autoLoad: true,
                volume: 50
            });
        };
    };
    
    //Ready to go
    soundReady = true;

});



                                          
//=================================
//=========Helper Functions========
//=================================  
//Disable selection jquery extension
jQuery.fn.extend({ 
        disableSelection : function() { 
                return this.each(function() { 
                        this.onselectstart = function() { return false; }; 
                        this.unselectable = "on"; 
                        jQuery(this).css('user-select', 'none'); 
                        jQuery(this).css('-o-user-select', 'none'); 
                        jQuery(this).css('-moz-user-select', 'none'); 
                        jQuery(this).css('-khtml-user-select', 'none'); 
                        jQuery(this).css('-webkit-user-select', 'none'); 
                }); 
        } 
});

function bindClickHandlers(){
	//Play / Pause
    $('#play').bind('click', function(event){playPause(event)});
    $('#pause').bind('click', function(event){playPause(event)});   
	
	//Reverse
	$('#reverse').bind('click', function(event){reverse(event)});
    
	//Change Speed
	$('#speed1,'+
	   '#speed2,'+
	   '#speed3,'+
	   '#speed4,'+
	   '#speed5').bind('click', function(event){changeSpeed(event)});
	
	//Change beat
	$('.meterContainer').bind('click', function(event){changeBeat(event)});
	
	//Change note
	$('.note').bind('mouseover mouseup', function(){
	    changeNote($(this));
	});
	
	//Change volume
    $('.barMark').bind('mouseover mouseup', function(){
        changeVolume($(this));
    });
    $('.barMarkCapped').bind('mouseover mouseup', function(){
        changeVolume($(this));
    });	
    
    //Change Modes
    $('#mode0Button,' +
      '#mode1Button,' +
      '#mode2Button,' +
      '#mode3Button').bind('click', function(){
        changeMode($(this));
    });
    
    //Keep track of mouse
    window.addEventListener("mousedown", function(){
       mouseDown = true; 
       printState();
    });
    window.addEventListener("mouseup", function(){
       mouseDown = false; 
       printState();     
    });
}
         
function printState(){
    //Mouse Down?
    if(mouseDown){
        $('#testMouseDown').html('true');
    }else{
        $('#testMouseDown').html('false');
    }
    
    //Playing, Reverse, Current Beat, Next Beat, Speed, Pending
    if(is_playing){
        $('#testPlaying').html('true');
    }else{
        $('#testPlaying').html('false');
    }
    if(in_reverse){
        $('#testReverse').html('true');
    }else{
        $('#testReverse').html('false');
    }
    if(pending){
        $('#testPending').html('true');
    }else{
        $('#testPending').html('false');
    }
    $('#testSpeed').html(speed);
    $('#testCurrentBeat').html(current_beat);
    $('#testNextBeat').html(next_beat)
    
    //Notes and Volumes
    $('#testColumn1Note').html(current_note[0]);
    $('#testColumn2Note').html(current_note[1]);
    $('#testColumn3Note').html(current_note[2]);
    $('#testColumn4Note').html(current_note[3]);
    $('#testColumn5Note').html(current_note[4]);
    $('#testColumn6Note').html(current_note[5]);
    $('#testColumn7Note').html(current_note[6]);
    $('#testColumn8Note').html(current_note[7]);
    $('#testColumn9Note').html(current_note[8]);
    $('#testColumn10Note').html(current_note[9]);
    $('#testColumn11Note').html(current_note[10]);
    $('#testColumn12Note').html(current_note[11]);
    $('#testColumn13Note').html(current_note[12]);
    $('#testColumn14Note').html(current_note[13]);
    $('#testColumn15Note').html(current_note[14]);
    $('#testColumn16Note').html(current_note[15]);
    
    $('#testColumn1Volume').html(volumes[0]);
    $('#testColumn2Volume').html(volumes[1]);
    $('#testColumn3Volume').html(volumes[2]);
    $('#testColumn4Volume').html(volumes[3]);
    $('#testColumn5Volume').html(volumes[4]);
    $('#testColumn6Volume').html(volumes[5]);
    $('#testColumn7Volume').html(volumes[6]);
    $('#testColumn8Volume').html(volumes[7]);
    $('#testColumn9Volume').html(volumes[8]);
    $('#testColumn10Volume').html(volumes[9]);
    $('#testColumn11Volume').html(volumes[10]);
    $('#testColumn12Volume').html(volumes[11]);
    $('#testColumn13Volume').html(volumes[12]);
    $('#testColumn14Volume').html(volumes[13]);
    $('#testColumn15Volume').html(volumes[14]);
    $('#testColumn16Volume').html(volumes[15]);
}

//=================================
//========Click Based Events=======
//=================================

function playPause(event){
    
    if(event.target.id == 'pause'){
        $('#play').removeClass('set');
        $('#pause').addClass('set');
        is_playing = false;
    }
    else if(event.target.id == 'play'){
        $('#pause').removeClass('set');
        $('#play').addClass('set');
        is_playing = true;
    } 
    
    //Output values to Test Box
    printState();
}

function reverse(event){
    //Change reverse toggle styling
    if(in_reverse){
        in_reverse = false;
        $('#reverse').removeClass('set');
    }
    else if(!in_reverse){
        in_reverse = true;
        $('#reverse').addClass('set');
    }
    
    if(!pending){
        //Reverse beats
        if(!in_reverse){
               next_beat = (current_beat + 1);
               if(next_beat == 16){
                   next_beat = 0;
               }
           }
        else if(in_reverse){        
            next_beat = (current_beat - 1);
            if(next_beat == -1){
                next_beat = 15;
            }
        }        
    }
    
    //Output values to Test Box
    printState();
    
}

function changeSpeed(event){
    $('#speed' + speed).removeClass("set");
    $('#' + event.target.id).addClass("set");
    speed = event.target.id.substr(5);
    
    window.clearInterval(intervalID);
    intervalID = setInterval('cycle()', speedFactor / speed);
    
    //Output values to Test Box
    printState();
}

function changeBeat(event){
    var new_beat_object = $('#' + event.target.id);    

    //Remove pending style if it exists anywhere else
    $('.meterContainerPending').removeClass('meterContainerPending');

    //Add pending styling to new beat
    new_beat_object.addClass('meterContainerPending');

    //Adjust nextBeat counter
    next_beat = new_beat_object.index();
    pending = true;
    
    //Output values to Test Box
    printState();
}        


function changeNote(new_note_object){  
    if(!mouseDown) return;
    
    var parent_index = new_note_object.parent().index();
    var note_index = new_note_object.index();
    
    //Remove selected style from currently selected note
    new_note_object.parent().children('.noteSelected')
                   .removeClass('noteSelected');
    
    //Add selected style to newly selected note
    new_note_object.addClass('noteSelected');
    
    var bar = $('.bar:eq(' + parent_index + ')');
    
    //Remove Old Bar Color
    if(current_note[parent_index] == 0){
        bar.removeClass('i');
    }else if(current_note[parent_index] == 1){
        bar.removeClass('ii');
    }else if(current_note[parent_index] == 2){
        bar.removeClass('iii');
    }else if(current_note[parent_index] == 3){
        bar.removeClass('iv');
    }else if(current_note[parent_index] == 4){
        bar.removeClass('v');
    }else if(current_note[parent_index] == 5){
        bar.removeClass('inactive');    
    }else{
        alert("Error Changing Bar Color");
    }

    //Add new Bar color
    if(note_index == 0){
        bar.addClass('i');
    }else if(note_index == 1){
        bar.addClass('ii');
    }else if(note_index == 2){
        bar.addClass('iii');
    }else if(note_index == 3){
        bar.addClass('iv');
    }else if(note_index == 4){
        bar.addClass('v');
    }else if(note_index == 5){
        bar.addClass('inactive');    
    }else{
        alert("Error Changing Bar Color");
    }
    
    //Adjust program state
    current_note[new_note_object.parent().index()] = 
                new_note_object.index();
                
    //Output values to Test Box
    printState();
}

function changeVolume(new_volume_object){
    if(!mouseDown) return;
    
    var parent = new_volume_object.parent();
    var new_volume = new_volume_object.index();
    
    
    //Move the volume cap
    parent.children('.barMarkCapped')
          .removeClass('barMarkCapped')
          .addClass('barMark');
    new_volume_object.removeClass('barMark').addClass('barMarkCapped');
    // parent.children('.barCap').remove();    
    // new_volume_object.after('<div class="barCap"></div>')
    
    
    //Change program state
    volumes[parent.index()] = 15 - new_volume;
   
    //Output values to Test Box
    printState();
}

function changeMode(mode_object){
    var mode = mode_object.index();
        
    //Change colors
    $('#modeStylesheet').attr('href', 'style/mode'+ mode +'.css');
    
    //Change mode button selected
    $('#mode' + currentMode + 'Button').removeClass('modeSelected');
    $('#mode' + mode + 'Button').addClass('modeSelected');
    
    //Change mode #
    currentMode = mode;
    
}



//=================================
//=========Time Based Events=======
//=================================
function cycle(){    
    //If not playing or sound not ready then there's nothing to do so return
    if(!is_playing || !soundReady){
        return;
    }

    //Change beat visual 
    pending = false;      
    var current_id_number = current_beat + 1;
    var next_id_number = next_beat + 1;
    var current_id_name = '#meterContainer' + current_id_number;
    var next_id_name = '#meterContainer' + next_id_number;
    $(current_id_name).removeClass('meterContainerSelected');
    $(next_id_name).addClass('meterContainerSelected');
    $(next_id_name).removeClass('meterContainerPending');


    //Increment beats
    current_beat = next_beat;
    if(!in_reverse){
        next_beat = (current_beat + 1);
        if(next_beat == 16){
            next_beat = 0;
        }
    }
    else if(in_reverse){        
        next_beat = (current_beat - 1);
        if(next_beat == -1){
            next_beat = 15;
        }
    }
    
    //If the note is not 'none'
    if(current_note[current_beat] != 5){ 
        //Play appropriate sound file
        var play_volume = volumes[current_beat];        
        soundManager.play(modeSounds[currentMode][current_note[current_beat]],
                          {volume:100*play_volume/14});
        
        //Glow effect on beat
            
        //Animate bar                                           
        var newHeight = 9 + 11 * (volumes[current_beat]);
        $('.bar:eq(' + current_beat + ')').animate({
            height: newHeight,
            easing: 'swing'
          }, 'fast');
        $('.bar:eq(' + current_beat + ')').animate({
          height: 10,
          easing: 'swing'
        }, 'slow');
                                                   
    }
    
    //Output values to Test Box
    printState();
}

//=================================
//========Initiate and Run=========
//=================================
$(function() {
 //Make things not selectable
 $('html').disableSelection();
 
 //Animate bars down
 $('.bar').animate({
     height: 10,
     easing: 'swing'
 }, 'slow');  

 
 bindClickHandlers();
 printState();
 
 
 intervalID = setInterval('cycle()', speedFactor / speed);
});
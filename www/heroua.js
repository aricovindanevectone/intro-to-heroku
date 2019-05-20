window.MediaStreams = [];
var tocall = '0857959';

var userid = $("#accountId").val();
var userpass = $("#secret").val();
var calling_number = $("#displayName").val();
function _timer(callback)
{
    var time = 0;     //  The default time of the timer
    var mode = 1;     //    Mode: count up or count down
    var status = 0;    //    Status: timer is running or stoped
    var timer_id;    //    This is used by setInterval function
    
    // this will start the timer ex. start the timer with 1 second interval timer.start(1000) 
    this.start = function(interval)
    {
        interval = (typeof(interval) !== 'undefined') ? interval : 1000;
 
        if(status == 0)
        {
            status = 1;
            timer_id = setInterval(function()
            {
                switch(mode)
                {
                    default:
                    if(time)
                    {
                        time--;
                        generateTime();
                        if(typeof(callback) === 'function') callback(time);
                    }
                    break;
                    
                    case 1:
                    if(time < 86400)
                    {
                        time++;
                        generateTime();
                        if(typeof(callback) === 'function') callback(time);
                    }
                    break;
                }
            }, interval);
        }
    }
    
    //  Same as the name, this will stop or pause the timer ex. timer.stop()
    this.stop =  function()
    {
        if(status == 1)
        {
            status = 0;
            clearInterval(timer_id);
        }
    }
    
    // Reset the timer to zero or reset it to your own custom time ex. reset to zero second timer.reset(0)
    this.reset =  function(sec)
    {
        sec = (typeof(sec) !== 'undefined') ? sec : 0;
        time = sec;
        generateTime(time);
    }
    
    // Change the mode of the timer, count-up (1) or countdown (0)
    this.mode = function(tmode)
    {
        mode = tmode;
    }
    
    // This methode return the current value of the timer
    this.getTime = function()
    {
        return time;
    }
    
    // This methode return the current mode of the timer count-up (1) or countdown (0)
    this.getMode = function()
    {
        return mode;
    }
    
    // This methode return the status of the timer running (1) or stoped (1)
    this.getStatus
    {
        return status;
    }
    
    // This methode will render the time variable to hour:minute:second format
    function generateTime()
    {
        var second = time % 60;
        var minute = Math.floor(time / 60) % 60;
        var hour = Math.floor(time / 3600) % 60;
        
        second = (second < 10) ? '0'+second : second;
        minute = (minute < 10) ? '0'+minute : minute;
        hour = (hour < 10) ? '0'+hour : hour;
        
        $('div.timer span.second').html('<b><font>'+second+'</font></b>');
        $('div.timer span.minute').html('<b><font>'+minute+':</font></b>');
        $('div.timer span.hour').html('<b><font>'+hour+':</font></b>');
    }
}

var timer = new _timer;

var GrpConfig = {
    localip: $("#LocalIP").val(),
    uri: userid + "@ucwebrtc.vectone.com",
    userAgentString: 'SIP.js/0.7.0 BB',
	register:true,
	traceSip: true,
    authorizationUser: userid,
    password: userpass,
    wsServers: ["wss://ucwebrtc.vectone.com:7443"],
    register: true,
	host:$("#LocalIP").val(),
    authorizationUser: userid,
    password: userpass,
    turnServers: {
        urls: "turn:stun02.mundio.com:3478",
        username: "admin",
        password: "system123"
    },
    displayName: "Admin",
}


var RegisterCallEvents = function(){
		$("#TransferCall").show();
		$("#EndCall").unbind().click(function() {
			console.log('end call');
			window.session.bye();
			resetall();
		});		

		$("#HoldCall").unbind().click(function() {
			console.log('Holding');
			session.hold();
			$("#UnHoldCall").show();
			$("#HoldCall").hide();
			$("#UnHoldCall").unbind().click(function() {
				console.log('Un Holding');
				session.unhold();
				$("#UnHoldCall").hide();
				$("#HoldCall").show();
			});		
		});		
		$("#HoldCall").show();$("#UnHoldCall").hide();
		$("#UnHoldCall").unbind();

		$("#MuteCall").unbind().click(function() {
			console.log('Muteing');
			session.mute();
			$("#UnMuteCall").show();
			$("#MuteCall").hide();
			$("#UnMuteCall").unbind().click(function() {
				console.log('Un Muteing');
				session.unmute();
				$("#UnMuteCall").hide();
				$("#MuteCall").show();
			});		
		});		
		$("#MuteCall").show();$("#UnMuteCall").hide();
		$("#UnMuteCall").unbind();
	
};
var ua = "";
if (userid.length>1 && userid.length<10){
	ua = new SIP.UA(GrpConfig);
	ua.on('cancel', function(lsession){
		document.getElementById('ringback').pause();
		$('#showring').hide();
		console.log('Cancelled');
		document.title = "Cancelled";
		window.parent.postMessage(01234, '*');
	});
	ua.on('invite', function (lsession) {
		console.log("Received Invite");
		document.title = "Call";
		window.parent.postMessage(01234, '*');

		$('#call').unbind().click(function(){
			Accept();
		});

		document.getElementById('ringback').play();
		$('#showring').show();

		window.session = lsession;
		$('.calling').fadeIn('slow');
		$('.userName').show().html(session.remoteIdentity.displayName);
		document.title = "Call From " + session.remoteIdentity.displayName;
		window.parent.postMessage(01234, '*');

		$('.userMobile').show().html(session.remoteIdentity.displayName);
		$("#EndCall").show();
		var options = {
			media: {
				constraints: {
					audio: true,
					video: false,
				},
				render: {
					remote: document.getElementById('BigVideo'),
					local: document.getElementById('localVideo')
				},
				extraHeaders: ['X-webcall: audio'],
			}, 
			params: {
				//from_displayName: '919444622122'
				from_displayName: calling_number
			}
		};

		window.Accept = function() {
			console.log('Call Accepted');
			document.getElementById('ringback').pause();
			$('#showring').hide();

			window.session.accept(options);
			document.title = "Talking";
		window.parent.postMessage(01234, '*');

			RegisterCallEvents();
		};		

	});
}

var session  = null;
function pstn_call(MobileNo,contactname=""){
	document.title = "Dialling " + contactname;
		window.parent.postMessage(01234, '*');

	$('.userName').show().html(contactname);
	$('.userMobile').show().html(MobileNo);
	$('.cstatus').hide().html('');
	$('.calling').fadeIn('slow');
	$("#userAccept").hide();
		var options = {
			media: {
				constraints: {
					audio: true,
					video: false,
				},
				render: {
					remote: document.getElementById('BigVideo'),
					local: document.getElementById('localVideo')
				},
				extraHeaders: ['X-webcall: audio'],
			}, 
			params: {
				from_displayName: contactname
			}
		};

	window.session  = ua.invite('sip:' + MobileNo + '@ucwebrtc.vectone.com', options);
	window.parent.postMessage(01234, '*');
	$("#EndCall").show();
	session.on('bye', function() {
		document.title = "Bye";
		window.parent.postMessage(01234, '*');

		console.log('bye bye..');	
		window.speechSynthesis.speak((new SpeechSynthesisUtterance('bye bye')));	
		timer.stop();
 		timer.reset(0);
		$('.calling').removeAttr("style");
		document.getElementById('ringback').pause();
		$('#showring').hide();
		document.getElementById('linebusy').pause(); 
		$("#EndCall").hide();
		resetall();
		document.title = "Ready";
		window.parent.postMessage(01234, '*');

		//alert('bye');
	});
	$("#TransferCall").click(function(){
		session.refer('sip:' + $("#internalagents").val() +'@ucwebrtc.vectone.com');
	});
	session.on('accepted', function(e) {
		document.getElementById('ringback').pause();
		$('#showring').hide();
		document.title = "Talking";
		window.parent.postMessage(01234, '*');
		$('.cstatus').show().html('<div class="timer"><span class="hour">00:</span><span class="minute">00:</span><span class="second">00</span></div>');
		timer.reset(0);
		timer.start(1000);

		console.log('Accepted...Please talk');
		window.speechSynthesis.speak((new SpeechSynthesisUtterance('Please talk')));
		document.getElementById('ringback').pause();
		$("#ringing").hide();
		$("#userAccept").fadeIn('slow');
		RegisterCallEvents();

	});

	session.on('progress', function() {
		document.title = "Dialing " + ToCall.caller_id;
		//console.log('Ringing');
		$("#ringing").show();
		window.speechSynthesis.speak((new SpeechSynthesisUtterance('Dialing')));
		document.getElementById('ringback').play();
		$('#showring').show();
	});
	session.on('reject', function() {
		document.title = "Cancelled";
		console.log('bye bye..');	
		window.speechSynthesis.speak((new SpeechSynthesisUtterance('Customer has Rejected your call')));		
		//alert('rejected');
		resetall();
	});
	session.on('failed', function(e) {
		document.title = "Cancelled";
		console.log('bye bye..');
		window.speechSynthesis.speak((new SpeechSynthesisUtterance('Could not connect. Please try later')));		
		//alert('Failed');
		resetall();
	});
	session.on('cancel', function() {
		document.title = "Cancelled";
		console.log('bye bye..');
		window.speechSynthesis.speak((new SpeechSynthesisUtterance('Customer has Cancelled your call')));		
		//alert('Cancelled');
		resetall();
	});	
	$("#EndCall").unbind().click(function() {
		document.title = "Cancelled";
		console.log('end call...2');
		session.cancel();
		resetall();
	});

}

function checkExtension(GivenUser) {
  return GivenUser.ext ==  18;
}

function CallNow(gNumber){
	gNumber = parseInt(gNumber);
	window.ToCall = {'sip_login_id':''};
	var i = 0;
	console.log(ToCall);
    if (ToCall.sip_login_id>0){
		pstn_call(ToCall.sip_login_id,ToCall.caller_id,'audio',false);
	}
};

function EndNow(){
	try{
		document.getElementById('ringback').pause();
				$('#showring').hide();

	}
	catch(er) {
		
	}
	if (document.title.startsWith("Call"))
	{
		try{
			session.reject();
		}
		catch(er) {
			
		}
	}
	else {
				
			try{
				session.bye();
			}
			catch(er) {
				
			}
			try{
				session.cancel();
			}
			catch(er) {
				
			}
	}
	resetall();
	document.title = "Ready";
}
function resetall(){
		$('#call').unbind().click(function(){
			CallNow( $('#output').html() );
		});

		document.getElementById('ringback').pause();
		$('#showring').hide();
		document.getElementById('linebusy').pause(); 
		$("#EndCall").hide();
		$("#ringing").hide();
		$("#MuteCall").hide();
		$("#UnMuteCall").hide();
		$("#HoldCall").hide();
		$("#UnHoldCall").hide();
		$('.calling').removeAttr("style");
		$("#TransferCall").hide();
}
$(document).ready(function(){
	$('#allextensions').empty();
	
	$('#allextensions').on('change', function() {
		$('#output').html(this.value)
	});
	$('#call').unbind().click(function(){
		CallNow( $('#output').html() );
	});
	$('#cut').click(function(){
		EndNow();
	});
	document.getElementById('ringback').pause();
		$('#showring').hide();
	if ($('#dir_user_id').length<1){
		document.title = "Login";
			setInterval(function(){
				document.title = "Login";
			},1000);
	}
	else 
		document.title = "Ready";
});
 resetall();
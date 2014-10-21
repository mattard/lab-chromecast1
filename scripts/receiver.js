$(document.ready(function() {
	cast.receiver.logger.setLevelValue(0);
	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
	log('Starting Receiver Manager');
	
	// handler for the 'ready' event
	castReceiverManager.onReady = function(event) {
	  log('Received Ready event: ' + JSON.stringify(event.data));
	  window.castReceiverManager.setApplicationState("Application status is ready...");
	};
	
	// handler for 'senderconnected' event
	castReceiverManager.onSenderConnected = function(event) {
	  log('Received Sender Connected event: ' + event.data);
	  log(window.castReceiverManager.getSender(event.data).userAgent);
	};
	
	// handler for 'senderdisconnected' event
	castReceiverManager.onSenderDisconnected = function(event) {
	  log('Received Sender Disconnected event: ' + event.data);
	  if (window.castReceiverManager.getSenders().length == 0) {
		window.close();
	  }
	};
	
	// handler for 'systemvolumechanged' event
	castReceiverManager.onSystemVolumeChanged = function(event) {
	  log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
		  event.data['muted']);
	};

	// create a CastMessageBus to handle messages for a custom namespace
	window.messageBus =
	  window.castReceiverManager.getCastMessageBus('urn:x-cast:bccom.chromcast.innovationday');

	// handler for the CastMessageBus message event
	window.messageBus.onMessage = function(event) {
	  log('Message [' + event.senderId + ']: ' + event.data);
	  // display the message from the sender
	  displayText(event.data);
	  // inform all senders on the CastMessageBus of the incoming message event
	  // sender message listener will be invoked
	  window.messageBus.send(event.senderId, event.data);
	}

	// initialize the CastReceiverManager with an application status message
	window.castReceiverManager.start({statusText: "Application is starting"});
	log('Receiver Manager started');
  };

function log(text) {
	$('#console').html($('#console').html() + text);
}
  
// utility function to display the text message in the input field
function displayText(text) {
	log(text);
	document.getElementById("message").innerHTML=text;
	window.castReceiverManager.setApplicationState(text);
};
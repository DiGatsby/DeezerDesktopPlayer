var backButton = document.createElement('button');
backButton.id = 'previous-page-button';
backButton.onclick = window.history.back;
backButton.appendChild(document.createTextNode('⬅'));

var sidebarContainer = document.getElementsByClassName('sidebar-container')[0];
sidebarContainer.insertBefore(backButton, sidebarContainer.firstChild);

var notifications = [];
function previousTrack() {
	$('.control-prev').trigger('click');
	setTimeout(function() {
		notifications.forEach(function(n) {
			n.close()
		});

		var title = document.getElementsByClassName("player-track-link")[0].innerHTML;
		var _body = document.getElementsByClassName("player-track-link")[1].innerHTML;

		var nNotification = new Notification(title, {
				body: 'by ' + _body,
				silent: true
		});

		notifications.push(nNotification)
	}, 100);
}

function pauseUnpauseTrack() {
	$('.control-play').trigger('click');
}

function nextTrack() {
	$('.control-next').trigger('click');
	setTimeout(function() {
		if ('${process.platform}' != 'darwin') {
			notifications.forEach(function(n) {
				n.close()
			});
		}

		var title = document.getElementsByClassName("player-track-link")[0].innerHTML;
		var _body = document.getElementsByClassName("player-track-link")[1].innerHTML;

		var nNotification = new Notification(title, {
				body: 'by ' + _body,
				silent: true
		});

		if ('${process.platform}' != 'darwin') {
			notifications.push(nNotification)
		}
	}, 100);
}
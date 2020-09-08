import {Common} from './common.js';

(function () {
	// we don't want to run in iframe
	if (window.top !== window.self) return;

	chrome.storage.local.get(null, function (data) {
		// automatically fill login info and submit
		if (data.hostname === location.hostname) {
			let now = Date.now();
			let lastAttempt = data.lastAttempt;

			if (lastAttempt !== undefined && now - lastAttempt < 5000) {
				// less than 10 seconds between 2 login attempts
				// probably the wrong password, clear everything

				alert(
					'Login timeout, perhaps your password is wrong?\nCleared all saved information.'
				);

				chrome.storage.local.clear();
			} else {
				Common.displayNothing();
				data.lastAttempt = now;
				chrome.storage.local.set(data);

				console.log('Logging in...');
				data.content.k = Common.getK();
				let form = $('form');
				Common.deserializeForm(form, data.content);
				console.log(data.content);
				form.submit();
				return;
			}
		}

		// capture login info otherwise
		console.log('We\'re on login page, record login info');
		data.hostname = location.hostname;
		document.forms[0].onsubmit = function () {
			data.content = Common.serializeForm($('form'));
			delete data.content['k'];
			chrome.storage.local.set(data);
		};
	});
})();

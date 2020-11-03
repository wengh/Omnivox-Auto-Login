import {Common} from './common';

async function autoLogin() {
	const data = await browser.storage.local.get();
	if (data.content === undefined) {
		console.log('Login info not registered, please log out and log in again');
		return;
	}

	console.log('Logged in at ' + Common.getDateString());

	data.content.k = Common.getK();

	// now POST to omnivox the login form to hopefully stay logged in
	fetch(
		`https://${data.hostname}/intr/Module/Identification/Login/Login.aspx`,
		{
			method: 'POST',
			body: $.param(data.content),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		}
	);
}

const interval = 600000;
let lastUpdateTime = 0;

(function () {
	// setup automatic login
	// we want real time to correctly behave when the computer goes to sleep
	// so do a check every second and use Date.now() which returns millis since epoch
	setInterval(async function () {
		const data = await browser.storage.local.get();
		let now = Date.now();
		if ((now - lastUpdateTime > interval) && (now - data.time < 60000)) {
			lastUpdateTime = now;
			await autoLogin();
		}
	}, 1000);
})();

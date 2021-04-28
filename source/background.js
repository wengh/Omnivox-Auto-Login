import {Common} from './common';

async function autoLogin() {
	const data = await browser.storage.local.get();
	if (data.content === undefined) {
		console.log('Login info not registered, please log out and log in again');
		return;
	}

	data.content.k = Common.getK();

	// now POST to omnivox the login form to hopefully stay logged in
	const response = await fetch(
		`https://${data.hostname}/intr/Module/Identification/Login/Login.aspx`,
		{
			method: 'POST',
			body: $.param(data.content),
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			credentials: 'same-origin',
		}
	);

	let loggedIn = false;
	if (response.ok) {
		const body = await response.text();
		loggedIn = body.includes("My Services");
	}
	console.log(`Attempted to log in at ${Common.getDateString()}. Status: ${response.status}; Logged in: ${loggedIn}`);
}

const interval = 600000;
let lastUpdateTime = 0;

browser.runtime.onMessage.addListener(() => {
	const now = Date.now();
	if (now - lastUpdateTime > interval) {
		lastUpdateTime = now;
		autoLogin();
	}
});

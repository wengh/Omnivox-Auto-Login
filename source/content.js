import {Common} from './common';

async function weAreAlive() {
	await browser.storage.local.set({time: Date.now()});
}

(async function () {
	// we don't want to run in iframe
	if (window.top !== window.self) return;

	if (!location.href.includes("/Login/Account/Login")) {
		// we are not on the login page
		await weAreAlive();
		setInterval(weAreAlive, 60000); // tell the background script that we are alive once every minute
		return;
	}

	// get all data
	let data = await browser.storage.local.get();
	// automatically fill login info and submit
	const form = $('form');
	if (data.hostname === location.hostname) {
		const now = Date.now();
		const lastAttempt = data.lastAttempt;

		if (lastAttempt !== undefined && now - lastAttempt < 5000) {
			// less than 10 seconds between 2 login attempts
			// probably the wrong password, clear everything

			alert(
				'Login timeout, perhaps your password is wrong?\nCleared all saved information.'
			);

			await browser.storage.local.clear();
		} else {
			Common.displayNothing();
			data.lastAttempt = now;
			await browser.storage.local.set(data);

			console.log('Logging in...');
			data.content.k = Common.getK();
			Common.deserializeForm(form, data.content);
			console.log(data.content);
			form.submit();
			return;
		}
	}

	// capture login info if timeout or no data recorded
	console.log('We\'re on login page, record login info');
	data.hostname = location.hostname;
	form.submit(async function () {
		data.content = Common.serializeForm($('form'));
		delete data.content['k'];
		await browser.storage.local.set(data);
	});
})();

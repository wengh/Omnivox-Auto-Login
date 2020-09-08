import {Common} from './common.js';

function autoLogin() {
	chrome.storage.local.get(null, function (data) {
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
	});
}

const interval = 600000;
let lastUpdateTime = 0;
let ovxTabs = new Set();

function setupTabChecks() {
	// first find all omnivox tabs and add them to the set
	chrome.tabs.query(
		{
			url: '*://*.omnivox.ca/*'
		},
		function (tabs) {
			tabs.forEach(function (tab) {
				ovxTabs.add(tab.id);
			});
		}
	);

	// login if there's at least 1 omnivox tab
	if (ovxTabs.size > 0) {
		autoLogin();
		lastUpdateTime = Date.now();
	}

	// check for changed tabs
	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
		if (changeInfo.url === undefined) {
			// do nothing
		} else if (new URL(changeInfo.url).hostname.includes('omnivox.ca')) {
			// it is a omnivox tab
			// login if there was no omnivox tab
			if (ovxTabs.size === 0) {
				autoLogin();
				lastUpdateTime = Date.now();
			}
			ovxTabs.add(tabId);
		} else if (ovxTabs.has(tabId)) {
			// it is no longer a omnivox tab
			ovxTabs.delete(tabId);
		}
	});

	// check deleted tabs
	chrome.tabs.onRemoved.addListener(function (tabId) {
		ovxTabs.delete(tabId);
	});
}

(function () {
	// setup automatic login

	setupTabChecks();

	// we want real time to correctly behave when the computer goes to sleep
	// so do a check every second and use Date.now() which returns millis since epoch
	setInterval(function () {
		let now = Date.now();
		if (now - lastUpdateTime > interval && ovxTabs.size > 0) {
			lastUpdateTime = now;
			autoLogin();
		}
	}, 1000);
})();

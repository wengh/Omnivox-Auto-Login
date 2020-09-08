import {Common} from './common.js';

function autoLogin() {
	chrome.storage.local.get(null, function (data) {
		if (data.content === undefined) {
			console.log('Login info not registered, please log out and log in again');
			return;
		}

		console.log('Logged in at ' + getDateString());

		data.content.k = Common.getK();

		fetch(
			'https://' +
			data.hostname +
			'/intr/Module/Identification/Login/Login.aspx',
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

(function () {
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

	if (ovxTabs.size > 0) {
		autoLogin();
		lastUpdateTime = Date.now();
	}

	chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
		if (changeInfo.url === undefined) {
			// do nothing
		} else if (new URL(changeInfo.url).hostname.includes('omnivox.ca')) {
			if (ovxTabs.size === 0) {
				autoLogin();
				lastUpdateTime = Date.now();
			}
			ovxTabs.add(tabId);
		} else if (ovxTabs.has(tabId)) {
			ovxTabs.delete(tabId);
		}
	});

	chrome.tabs.onRemoved.addListener(function (tabId) {
		ovxTabs.delete(tabId);
	});

	setInterval(function () {
		let now = Date.now();
		if (now - lastUpdateTime > interval && ovxTabs.size > 0) {
			lastUpdateTime = now;
			autoLogin();
		}
	}, 1000);
})();

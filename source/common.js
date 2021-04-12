export class Common {

	static getDateString(date = new Date()) {
		// sv-SE seems to be similar to ISO 8601
		return date.toLocaleString('sv-SE');
	}

	// "k" in login form seems to be an integer related to the current time
	// m and b are extrapolated from 2 requests to the login page with a long enough interval
	static getK(t2, k2) {
		const t1=1599507599000, k1=637350917992510779
		const m = (k2 - k1) / (t2 - t1);
		const b = k2 - (m * t2);
		return Math.round(Date.now() * m + b);
	}

	// f is $('form')
	// return the form values as json
	static serializeForm(f) {
		const array = f.serializeArray();
		const map = {};
		array.forEach(function (item) {
			map[item.name] = item.value;
		});
		return map;
	}

	// fill the form with serialized json
	static deserializeForm(f, map) {
		for (const key in map) {
			if (!map.hasOwnProperty(key)) continue;
			$('[name="' + key + '"]').val(map[key]);
		}
	}

	// make the page show nothing
	static displayNothing() {
		const style = document.createElement('style');
		style.innerHTML = 'body { display:none !important; }';
		document.getElementsByTagName('HEAD')[0].appendChild(style);
	}
}

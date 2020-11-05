export class Common {

	static getDateString(date = new Date()) {
		// sv-SE seems to be similar to ISO 8601
		return date.toLocaleString('sv-SE');
	}

	// "k" in login form seems to be an integer related to the current time
	// m and k are calculated from 2 requests to the login page with 2 hours interval
	// should be accurate enough
	static getK() {
		//t1=1599507599, k1=637350917992510779
		//t2=1604365152, k2=637399457523063487

		const m = 9992.587977788404;
		const k = 621367697593190000;
		return Math.round(Date.now() * m) + k;
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

export class Common {

	static getDateString(date = new Date()) {
		// sv-SE seems to be similar to ISO 8601
		return date.toLocaleString('sv-SE');
	}

	// "k" in login form seems to be an integer related to the current time
	// a and b are calculated from 2 requests to the login page with 2 hours interval
	// should be accurate enough
	static getK() {
		//t1=1599507598.515297, k1=637350917992510779

		const a = 10000;
		const b = 621355842007357696;
		return Date.now() * a + b;
	}

	// f is $('form')
	// return the form values as json
	static serializeForm(f) {
		let array = f.serializeArray();
		let map = {};
		array.forEach(function (item) {
			map[item.name] = item.value;
		});
		return map;
	}

	// fill the form with serialized json
	static deserializeForm(f, map) {
		for (var key in map) {
			if (!map.hasOwnProperty(key)) continue;
			$('[name="' + key + '"]').val(map[key]);
		}
	}

	// make the page show nothing
	static displayNothing() {
		var style = document.createElement('style');
		style.innerHTML = 'body { display:none !important; }';
		document.getElementsByTagName('HEAD')[0].appendChild(style);
	}
}

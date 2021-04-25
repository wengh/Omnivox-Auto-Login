export class Common {

	static getDateString(date = new Date()) {
		// sv-SE seems to be similar to ISO 8601
		return date.toLocaleString('sv-SE');
	}

	static getMontrealTimezoneOffsetMs(date = new Date()) {
		return Date.parse(date.toLocaleString('sv-SE', {timeZone: 'America/Montreal'}))
			 - Date.parse(date.toLocaleString('sv-SE', {timeZone: 'UTC'}));
	}

	// "k" in login form is a timestamp proportional to the time since year 0001
	static getK(date = new Date) {
		const ms_from_0001_to_1975 = 62135596800000;
		const ms_timezone_offset = Common.getMontrealTimezoneOffsetMs(date);
		const ms_extra_offset = 1800000; // determined experimentally
		const m = 10000;
		const b = (ms_from_0001_to_1975 + ms_timezone_offset + ms_extra_offset) * m;
		return Math.round(m * date.getTime() + b);
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

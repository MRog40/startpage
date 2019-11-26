//
// Michael Rogers
//
// When the window loads
window.onload = function() {
  Clock();
  Weather();
  // Listen for keypresses
  document.addEventListener('keydown', SearchVisibility);
  // Call clock every half second
  setInterval(Clock, 500);
  setInterval(Weather, 60000);
};
// Ignore arrow key scroll on the page with this script
window.onkeydown = function(e) {
  if (e.keyCode === 188) {
    e.view.event.preventDefault();
  }
};

// Some global "enums"
let month = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
'september', 'october', 'november', 'december'];
let day = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function SearchVisibility(key) {
  if (key.keyCode === 188) {
    if (document.getElementById('search').style.display == 'flex') {
      document.getElementById('search').style.display = 'none';
      document.getElementById('search-field').value = '';
    } else {
      document.getElementById('search').style.display = 'flex';
      document.getElementById('search-field').select();
    }
  }
	else if (
    key.keyCode === 13 && document.getElementById('search').style.display == 'flex') {
    window.open('https://google.com/search?q=' + document.getElementById('search-field').value);
    document.getElementById('search').style.display = 'none';
    document.getElementById('search-field').value = '';
  }
}
function Weather() {
  let xhr = new XMLHttpRequest();
  // Request to open weather map
  xhr.open(
    'GET',
    'https://api.openweathermap.org/data/2.5/group?id=5768233,4276873&units=imperial&appid=e5b292ae2f9dae5f29e11499c2d82ece'
  );
  xhr.onload = () => {
    if (xhr.readyState === 4 && xhr.status === 200) {
			let json = JSON.parse(xhr.responseText);

			let txt = json.list[0].name + ' has ' + WeathDesc(json.list[0]) + '. It\'s '
				+ json.list[0].main.temp.toFixed(1) + '\u00b0F with ' + json.list[0].main.humidity + '% humidity.'
				+ '<br>' + json.list[1].name + ' has ' + WeathDesc(json.list[1]) + '. It\'s '
				+ json.list[1].main.temp.toFixed(1) + '\u00b0F with ' + json.list[1].main.humidity + '% humidity.' 
			document.getElementById('weather-block').innerHTML = txt;
    }
  };
  xhr.send();
}

function WeathDesc(data) {
	if(data.weather.length === 1) {
		return data.weather[0].description;	
	}
	else if(data.weather.length === 2) {
		return data.weather[0].description + ' and ' + data.weather[1].description;
	}
	else {
		let desc = '';
		for(weath of data.weather) {
			desc += weath.description + ', ';
		}
		desc = desc.slice(0, -2);
		let n = desc.lastIndexOf(', ');
		desc = desc.slice(0, n) + ', and ' + desc.slice(n+2);
		return desc;
	}
}

function Clock() {
	let date = new Date();

	document.getElementById('clock').innerHTML = TimeFormat(date);
	
	let ds = day[date.getDay()] + ' ' + month[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
	document.getElementById('date').innerHTML = ds;
}

function TimeFormat(date, format='hms') {
  let min = date.getMinutes(),
    sec = date.getSeconds(),
    hour = date.getHours();
  hour = hour > 12 ? hour - 12 : hour;
  let time =
    '' +
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (min < 10 ? '0' + min : min) +
    ':' +
		(sec < 10 ? '0' + sec : sec);

	if(format == 'hms')
		return time;
	else if(format == 'hm')
		return time.slice(0, -3);
	else 
		return time.slice(0,-5);
}

document.addEventListener('keydown', event => {
  if (event.keyCode == 32) {
    document.getElementById('search').style.display = 'flex';
    document.getElementById('search-field').focus();
  } else if (event.keyCode == 27) {
    document.getElementById('search-field').value = '';
    document.getElementById('search-field').blur();
    document.getElementById('search').style.display = 'none';
  }
});

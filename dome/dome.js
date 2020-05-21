// ---------- CONFIGURATION ----------
// DOME
var sites = {
"Access" : {
    "Github"              : "https://github.com/MRog40?tab=repositories",
    "Email"               : "https://mail.google.com/mail/u/0/#inbox",
    "School Email"        : "https://mail.google.com/mail/u/1/#inbox",
},
"Docs" : {
    "Hugo"                : "https://gohugo.io/documentation/",
    "KaTeX"               : "https://katex.org/docs/supported.html",
    "LTSpice Wiki"        : "http://ltwiki.org/index.php?title=Main_Page",
    "AHK Docs"            : "https://www.autohotkey.com/docs/AutoHotkey.htm",
    "DevDocs"             : "https://devdocs.io",
},
"Tools" : {
    "OptionsPC"           : "https://www.optionsprofitcalculator.com/calculator/covered-call.html",
    "Smith Chart"         : "https://www.will-kelsey.com/smith_chart/#",
    "SnapEDA"             : "https://www.snapeda.com/home/",
    "Weather"             : "https://weather.com/weather/today/",
    "VPN Test"            : "http://ipmagnet.services.cbcdn.com/",
    "Router"              : "http://router.asus.com",
},
"Social" : {
    "Youtube"             : "https://www.youtube.com/",
    "Twitch"              : "https://twitch.tv/",
    "/r/WSB"              : "https://www.reddit.com/r/wallstreetbets",
    "/r/HWS"              : "https://www.reddit.com/r/hardwareswap",
    "/r/UnixPorn"         : "https://www.reddit.com/r/unixporn",
},
"Info" : {
    "hackr.io"            : "https://hackr.io/",
    "Antennas"            : "http://montoya.sdsmt.edu/ee483/spring2020/ee483_spring2020.htm",
},
"Other" : {
    "Lofi"                : "https://www.youtube.com/results?search_query=lofi",
    "Xim"                 : "https://community.xim.tech/index.php",
    "UMG"                 : "https://umggaming.com/tournaments",
    "CMG"                 : "https://www.checkmategaming.com/bank"
    "GB"                  : "http://profile.majorleaguegaming.com/MRog40/",
}
};

var search = {
    "default"             : "https://duckduckgo.com/?q=",
    "d"                   : "https://duckduckgo.com/?q=",
    "g"                   : "https://google.com/search?q=",
    "r"                   : "https://www.reddit.com/search?q=",
    "a"                   : "https://www.amazon.com/s?k=",
    "y"                   : "https://www.youtube.com/results?search_query=",
    "s"                   : "https://open.spotify.com/search/",
    "k"                   : "https://www.digikey.com/products/en?keywords=",
    "t"                   : "https://www.twitch.tv/search?term="
};

// ---------- BUILD PAGE ----------
var pivotmatch = 0;
var totallinks = 0;
var prevregexp = "";

// Some global "enums"
let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
'Sep', 'Oct', 'Nov', 'Dec'];
let day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function matchLinks(regex = prevregexp)
{
    totallinks = 0;
    pivotmatch = regex == prevregexp ? pivotmatch : 0;
    prevregexp = regex;
    pivotbuffer = pivotmatch;

    p = document.getElementById("links");
    while (p.firstChild)
        p.removeChild(p.firstChild);

    // If second char is a space, and the first character is included in the
    // search key-value object
    if (regex.charAt(1) == ' ' && search.hasOwnProperty(regex.charAt(0)))
    {
        document.getElementById("action").action = search[regex.charAt(0)];

        if( regex.charAt(0) == 's' ) // Special case for spotify which has a weird query
            document.getElementById("action").children[0].name = "";
        else
            document.getElementById("action").children[0].name = search[regex.charAt(0)].slice( search[regex.charAt(0)].indexOf("?") + 1, -1 );
    }
    else
    {
        // Add all the links that match the current search
        match = new RegExp(regex ? regex : ".", "i");
        gmatches = false;

        for (i = 0; i < Object.keys(sites).length; i++)
        {
            matches = false;
            sn = Object.keys(sites)[i];
            section = document.createElement("div");
            section.id = sn;
            section.innerHTML = sn;
            section.className = "section";
            inner = document.createElement("div");

            for (l = 0; l < Object.keys(sites[sn]).length; l++)
            {
                ln = Object.keys(sites[sn])[l];
                if (match.test(ln))
                {
                    link = document.createElement("a");
                    link.href = sites[sn][ln];
                    link.innerHTML = ln;

                    if (!pivotbuffer++ && regex != "")
                    {
                        link.className = "selected";
                        document.getElementById("action").action = sites[sn][ln];
                        document.getElementById("action").children[0].removeAttribute("name");
                    }

                    inner.appendChild(link);
                    matches = true;
                    gmatches = true;
                    totallinks++;
                }
            }

            section.appendChild(inner);
            if( matches )
            {
                p.appendChild(section);
            }
        }

        if (!gmatches || regex == "")
        {
            document.getElementById("action").action = search["default"];
            document.getElementById("action").children[0].name = "q";
        }
    }
    document.getElementById("main").style.height = 
    document.getElementById("main").children[0].offsetHeight+"px";
}

document.onkeydown = function(e)
{
    switch (e.keyCode) {
        case 38:
            pivotmatch = pivotmatch >= 0 ? 0 : pivotmatch + 1;
            matchLinks();
            break;
        case 40:
            pivotmatch = pivotmatch <= -totallinks + 1 ? -totallinks + 1 : pivotmatch - 1;
            matchLinks();
            break;
        default:
            break;
    }
    document.getElementById("action").children[0].focus();
}

document.getElementById("action").children[0].onkeypress = function(e)
{
    if (e.key == "ArrowDown" || e.key == "ArrowUp")
    {
        return false;
    }
}

function displayClock()
{
    let date = new Date();

    let ds = day[date.getDay()] + ' ' + month[date.getMonth()] + ' ' + date.getDate()
        + ', ' + date.getFullYear();

    document.getElementById("clock").innerHTML = ds + " " + TimeFormat(date);
}

function TimeFormat( date )
{
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

    return time;
}

window.onload = matchLinks();

document.getElementById("action").onsubmit = function()
{
    svalue = document.getElementById("action").children[0].value;

    if (svalue.charAt(1) == ' ' && search.hasOwnProperty(svalue.charAt(0)))
    {
        document.getElementById("action").children[0].value = svalue.substring(2);
    }

    return true;
}

displayClock();
setInterval(displayClock, 1000);


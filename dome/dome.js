// ---------- CONFIGURATION ----------
// DOME
var sites = {
            "Sch" : {
                "D2L Embedded" : "https://d2l.sdbor.edu/d2l/le/content/1333664/Home",
                "D2L Stats" : "https://d2l.sdbor.edu/d2l/le/content/1333634/Home",
                "D2L Radar" : "https://d2l.sdbor.edu/d2l/le/content/1333485/Home",
                "D2L SrDesign" : "https://d2l.sdbor.edu/d2l/home/1330854",
                "Antennas"  : "http://montoya.sdsmt.edu/ee483/spring2020/ee483_spring2020.htm",
            },
            "Sch2" : {
                "Github"                  : "https://github.com/MRog40?tab=repositories",
                "Email"                   : "https://mail.google.com/mail/u/0/#inbox",
                "School Email"            : "https://mail.google.com/mail/u/1/#inbox",
                "DevDocs"                 : "https://devdocs.io",
                "AsciiDocs"               : "https://asciidoctor.org/docs/user-manual/",
                "AsciiMath"               : "http://asciimath.org",
            },
            "Tools" : {
                "Calendar"                : "https://calendar.google.com/calendar/r",
                "Messenger"               : "https://messages.android.com",
                "Keep"                    : "https://keep.google.com/u/0/",
                "Weather"                 : "https://weather.com/weather/today/",
                "VPN Test"                : "http://ipleak.net",
                "Router"                  : "router.asus.com"
            },
            "Social" : {
                "Youtube"                 : "https://www.youtube.com/",
                "Reddit"                  : "https://www.reddit.com/",
                "Gamebattles"             : "http://profile.majorleaguegaming.com/MRog40/",
                "Twitch"                  : "https://twitch.tv/",
                "/r/modernwarfare"        : "https://www.reddit.com/r/modernwarfare",
                "/r/UnixPorn"             : "https://www.reddit.com/r/unixporn"
            },
            "Other" : {
                    "Senior Design Drive" : "https://drive.google.com/drive/u/1/folders/0AAUPGjODjDkxUk9PVA",
                    "CDR Slides"          : "https://docs.google.com/presentation/d/1CJn0WJyT7w2tJa-K_2CKDlGqUGjZkFxVBNXVcDddyro/edit",
                    "Log Book"            : "file:///C:/Users/7258163/Documents/School/Senior_Design_1/LogBook.html",
                    "CSC215 Notes"        : "file:///C:/Users/7258163/Documents/School/Programming_Techniques/Notes",
                    "LTSpice Wiki"        : "http://ltwiki.org/index.php?title=Main_Page",
                    "AHK Docs"            : "https://www.autohotkey.com/docs/AutoHotkey.htm"
                },
            "Other 2" : {
                    "Spotify Web"         : "https://open.spotify.com/browse/featured",
                    "Chilled Cow"         : "https://www.youtube.com/watch?v=hHW1oY26kxQ",
                    "Xim"                 : "https://community.xim.tech/index.php",
                    "SnapEDA"             : "https://www.snapeda.com/home/",
                    "UMG"                 : "https://umggaming.com/tournaments",
                    "CMG"                 : "https://www.checkmategaming.com/bank"
                }
            };

var search = { // Query variable name is q, hardcoded, looks like a standard already anyways
                "default": "https://duckduckgo.com/?q=",
                "d" : "https://duckduckgo.com/?q=",
                "g" : "https://google.com/search?q=",
                "r" : "https://www.reddit.com/search?q=",
                "a" : "https://www.amazon.com/s?k=",
                "y" : "https://www.youtube.com/results?search_query=",
                "s" : "https://open.spotify.com/search/",
                "k" : "https://www.digikey.com/products/en?keywords=",
                "t" : "https://www.twitch.tv/search?term="
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


const chars = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
const randomLength = 6;
const urlBase = "https://prnt.sc/";
window.autoRandom = false;

function getCurrentUrl() {
    const buttons = $("#button-pack");
    const inputUrl = $("input[name=start-url]").val();
    if (!inputUrl) {
        buttons.hide();
        log("Please enter an URL", "danger");
        return;
    }

    const match = inputUrl.match(/^(https:\/\/prnt.sc\/)([0-9a-z]+)/);
    if (!match) {
        buttons.hide();
        log("What is this URL?", "danger");
        return;
    }
    const url = match[0];
    const baseUrl = match[1];
    const imageId = match[2];

    buttons.show();

    return [url, baseUrl, imageId];
}

function setCurrentUrl(url) {
    $("input[name=start-url]").val(url);
}

function loadUrl(history = true) {
    const inputUrl = getCurrentUrl();
    if (!inputUrl) return;
    const url = inputUrl[0];
    const imageId = inputUrl[2];
    log("Loading: "+url);
    $.get("/img/"+imageId, function(content) {
        const r = content.match(/https:\/\/image\.prntscr\.com\/image\/.*?\.(png|jpeg|jpg)/);

        const container = $("#content-container");

        if (!r) {
            log("Failed to load image "+imageId, "danger");
			fail();
            return;
        }
        const imageUrl = r[0];

        let img = $("<img/>");

        img.one("load", function() {
            log(false);
            container.empty();
            container.append(img);
			if(history) { addHistory(imageId, imageUrl); };
        });

        img.attr("src", imageUrl);
        img.attr("onerror", `log("Failed to load image", "danger"); fail();`);
    }, "html");
}

function saveImage() {
    const inputUrl = getCurrentUrl();
    if (!inputUrl) return;
    const url = $("img").attr("src");
    const id = inputUrl[2];
    log("Saving: "+id);
    $.get("/save?id="+id+"&link="+url, function(content) {
		if(content.length > 0) {
			log(content, "danger");
		} else {
			log("Saved image");			
		}
    }, "html");
}

// "They did research, you know.. 60% of the time - it work's every time! ;-)"
function randomPage() {
    let random = [];

    for (let i=0; i<randomLength; i++) {
        random[i] = chars[Math.floor(Math.random()*chars.length)];
    }

    const url = urlBase + random.join("");
    setCurrentUrl(url);
    loadUrl();
}

let lastLogClass = null;

function log(str, type = "info") {
    const log = $("#log");
    if (!str) {
        log.hide();
        return;
    }

    const alertClass = "alert-"+type;
    if (!lastLogClass) {
        lastLogClass = alertClass;
        log.addClass(alertClass);
    }
    if (lastLogClass && lastLogClass != alertClass) {
        log.removeClass(lastLogClass);
        lastLogClass = alertClass;
        log.addClass(alertClass);
    }

    log.show();
    log.text(str);
}

function clearHistory() {
	$("#history").html("");
}

function addHistory(id, url) {
	$("#history").append(
		$(`<div class="row" style="cursor: pointer" onclick="setCurrentUrl('${urlBase}${id}'); loadUrl(false);"><img src="${url}" height="64" width="64" /><h5 class="ml-4">ID: ${id}</h5></div><hr>`)
	);				
}

function fail() {
	if(window.autoRandom) {
		randomPage();
	}
}

function switchFail() {
	window.autoRandom = !window.autoRandom;
	$("#fail").attr("class", "btn "+ (window.autoRandom ? "btn-success" : "btn-danger"));
}

$(document).ready(function() {
    log(false);
});
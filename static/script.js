const chars = "abcdefghijklmnopqrstuvwxyz0123456789".split("");
const urlBase = "https://prnt.sc/";
window.autoRandom = false;

function getCurrentUrl() {
  const inputUrl = $("input[name=start-url]").val();
  if (!inputUrl) return log("Please enter an URL", "danger");

  const match = inputUrl.match(/^(https:\/\/prnt.sc\/)([0-9a-z]+)/);
  if (!match) return log("What is this URL?", "danger");

  return match;
  /* 0: URL | 1: baseURL | 2: imageID */
}

function setCurrentUrl(url) {
  $("input[name=start-url]").val(url);
}

function loadUrl(history = true) {
  const inputUrl = getCurrentUrl();
  if (!inputUrl) return;

  const imageId = inputUrl[2];
  log("Loading: " + inputUrl[0]);

  $.get("/img/" + imageId, function (content) {
    const r = content.match(/https:\/\/image\.prntscr\.com\/image\/.*?\.(png|jpeg|jpg)/);

    if (!r) {
      log("Failed to load image " + imageId, "danger");
      fail();
      return;
    }
    const imageUrl = r[0];

    let img = $("#image");
    img.attr("src", imageUrl);
    $("#img-id").html(imageId);

    if (history) {
      addHistory(imageId, imageUrl);
    };
  }, "html");
}

function saveImage() {
  const inputUrl = getCurrentUrl();
  if (!inputUrl) return;
  const url = $("#image").attr("src");
  const id = inputUrl[2];
  log("Saving: " + id);
  $.get("/save?id=" + id + "&link=" + url, function (content) {
    if (content.length > 0) {
      log(content, "danger");
    } else {
      log("Saved image");
    }
  }, "html");
}

// "They did research, you know.. 60% of the time - it work's every time! ;-)"
function randomPage() {
  let random = "";

  for (let i = 0; i < $("#randomLength").val(); i++) {
    random += chars[Math.floor(Math.random() * chars.length)];
  }

  setCurrentUrl(urlBase + random);
  loadUrl();
}

function log(str, type = "warning") {
  if (!str) return;
  console.log(type, str);

  var t = new Toast({
    message: str,
    type: type
  });
}

function clearHistory() {
  $("#history").html("");
}

function addHistory(id, url) {
  $("#history").append(
    $(`<div class="flex flex-row cursor-pointer" onclick="setCurrentUrl('${urlBase}${id}'); loadUrl(false);"><img src="${url}" height="64" width="64" /><h5 class="ml-4">ID: ${id}</h5></div>`)
  );
}

function fail() {
  if (window.autoRandom) {
    randomPage();
  }
}

function switchFail() {
  window.autoRandom = !window.autoRandom;
  $("#fail").attr("class", "w-2/5 p-2 rounded-2xl " + (window.autoRandom ? "bg-[#287e29]" : "bg-[#bf0000]"));
}
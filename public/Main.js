/////////////////
// USER INTERFACE
/////////////////

document.getElementById("edit_image").onclick = function(){
	document.getElementById("framed").contentWindow.postMessage("up top","*");
};

/////////////////
// URL PARSING
/////////////////

function getParameterByName(name){
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);
	if(results == null) return "";
	else return decodeURIComponent(results[1].replace(/\+/g, " "));
}

var url = getParameterByName("url");
var protocol = (/\/\/(.*)/).exec(url);
if(protocol){
	url = protocol[1]; // Without the protocol
}
var proxyURL = "http://ncase-proxy.herokuapp.com/"+url; // Proxy
var proxyURLBase = "http://ncase-proxy.herokuapp.com/"+url.split('/')[0]+"/"; // Base URL

/////////////////
// PROXY INTO AN IFRAME
/////////////////

var xhr = new XMLHttpRequest();
xhr.open("GET", proxyURL);
xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');
xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            var response = xhr.responseText;

            var ifrm = document.getElementById("framed");
            ifrm = (ifrm.contentWindow) ? ifrm.contentWindow : (ifrm.contentDocument.document) ? ifrm.contentDocument.document : ifrm.contentDocument;
			ifrm.document.open();
			//ifrm.document.write("\<base href='http://ponywings.nutcasenightmare.com/'\>"+response);

			var base = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
			ifrm.document.write(
				
				// Local scripts
				"\<script src='"+base+"/src/Toolbox.js'\>\<\/script\>"+
				//"\<script src='"+base+"/src/ImageScraper.js'\>\<\/script\>"+

				// The original game
				"\<base href='"+proxyURLBase+"'\>"+
				response+

				"\<script src='"+base+"/src/Wrapper.js'\>\<\/script\>"

			);
			ifrm.document.close();

            //document.write("\<base href='http://playbiolab.com/'\>"+response+"\<script\>document.body.style.webkitTransform='rotate(180deg)'\<\/script\>");
        }
    }
};
xhr.send();

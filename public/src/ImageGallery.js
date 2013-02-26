
///////////////////////
// CAPTURE ALL IMAGES
///////////////////////

window.images = [];

(function(){
	var OldImage = Image;
	Image = function(){
		var img = new OldImage();
		window.images.push(img);
		img.crossOrigin = "Anonymous";
		return img;
	};
})();

window.addEventListener("load",function(){
	debugger;
	var images = document.querySelectorAll("img");
	window.images = window.images.concat(images);
},false);

////////////////////////
///////////////////////


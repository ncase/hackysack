
//////////////////////
// Record all images
//////////////////////

window.ImageLibrary = [];

var OldImage = Image;
Image = function(){
	var img = new OldImage();
	img.crossOrigin = 'Anonymous';
	window.ImageLibrary.push(img);
	return img;
}

/*window.addEventListener("load",function(){
	var images = document.querySelectorAll("img");
	for(var i=0;i<images.length;i++){
		window.ImageLibrary.push(images[i]);
	}
},false);*/

//////////////////////
// Edit with Toolbox
//////////////////////

var app;
window.addEventListener("load",function(){
	var base = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
	app = Toolbox.open(base+"/editor/gallery");
},false);

//////////////////////
// Record all images
//////////////////////

window.addEventListener("message",function(event){
	
	if(event.data!=="up top") return;
	
	var sources = ImageLibrary.map(function(img){
		return img.src;
	});

	app.open(sources,function(index){

		// Image
		var img = ImageLibrary[index];

		// Canvas
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img,0,0);

		// Grayscale
		var imgd = ctx.getImageData(0,0,img.width,img.height);
		var pix = imgd.data;
		for (var i = 0, n = pix.length; i < n; i += 4) {
			var grayscale = pix[i]*.3 + pix[i+1]*.59 + pix[i+2]*.11;
			pix[i] = grayscale;
			pix[i+1] = grayscale;
			pix[i+2] = grayscale;
		}
		ctx.putImageData(imgd,0,0);

		// Change image source
		debugger;
		var dataURL = canvas.toDataURL();
		img.removeAttribute("crossorigin");
		img.src = dataURL;

		console.log(dataURL);

	});

}),false;

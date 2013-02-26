
// All images are cross-origin
// TOOD: Unless data:URI?
var OldImage = Image;
Image = function(){
	var img = new OldImage();
	img.crossOrigin = 'Anonymous';
	return img;
}

// Edit with Toolbox
var base = location.protocol+'//'+location.hostname+(location.port ? ':'+location.port: '');
var app = Toolbox.open(base+"/editor/image");

// ImpactJS Specifically
var _open = false;
window.addEventListener("keydown",function(event){
	if(event.keyCode==68){
		
		if(_open) return;
		_open=true;

		var imageURL = "media/tiles/biolab.png"; //"media/titlescreen.png"; 
		var imageAsset = ig.Image.cache[imageURL];

		var canvas = imageAsset.data;
		if(!canvas) return;
		var dataURL = canvas.toDataURL();
		
		app.open(dataURL,function(response){

			_open=false;
			window.focus();

			var context = canvas.getContext("2d");
			context.clearRect(0,0,canvas.width,canvas.height);

			var img = new OldImage();
			img.src = response;
			setTimeout(function(){
				context.drawImage(img,0,0); // Dunno.
			},1);

			console.log("===");
			console.log(canvas.toDataURL());

			// #1: OldImage is unstable
			// #2: For Impact, currently 

	    });

	}
});
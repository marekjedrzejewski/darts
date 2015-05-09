function drawingTest() {
	if (SVG.supported) {
		var scale = window.innerWidth*0.5;
		var draw = SVG('drawing').size(scale,scale);

		var list_of_objects = [];
		for (var i = 0; i < 20; i++) {
			list_of_objects[i] = draw.polygon('1,1 30,30 20,1');
			list_of_objects[i].move(0.5*scale,0.3*scale);
			list_of_objects[i].mouseover(lightup);
			list_of_objects[i].mouseout(lightdown);
			list_of_objects[i].rotate(18*i, 0.5*scale, 0.5*scale);
		}
	}
	else {
		alert('SVG not supported');
	}
}

var lightup = function() {
	this.fill("#fc0");
};

var lightdown = function() {
	this.fill('#000');
};

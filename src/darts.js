function drawingTest() {
	if (SVG.supported) {

		var draw = SVG('drawing').size(n.scale,n.scale);

		var outerboard = draw.circle(n.scale,n.scale);
		outerboard.fill(c.outerboard);
		outerboard.mouseover(lightup);
		outerboard.mouseout(lightdown);

		var list_of_objects = [];

		// Generating main segments of the board
		for (var i = 0; i < n.segments; i++) {
			list_of_objects[i] = draw.path(main_segment_shape);
			list_of_objects[i].mouseover(lightup);
			list_of_objects[i].mouseout(lightdown);
			list_of_objects[i].rotate(n.segment_rotation*i, n.center, n.center);
			list_of_objects[i].data({value: null});
			list_of_objects[i].fill(color_main_segments(i));
			}

	}
	else {
		alert('SVG not supported');
	}
}


// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};


// n is for numbers
var n = {
	scale: window.innerHeight*0.8,
	segments: 20,
	segment_rotation: 18
};
// I can't do that inside :( Why?
n.center = n.scale/2;
n.main_len = n.scale*0.42;

// c is for colors
var c = {
	outerboard: "#1b0d24",
	main_segment_odd: "#f0ebd6",
	main_segment_even: "#1a2119"
};

var main_segment_shape =
		'M' + // start on center
		Math.round(n.center) + ',' + Math.round(n.center) +
		' L' + // link to left point
		Math.round(
			n.center + n.main_len *
			Math.cos(Math.radians(270-n.segment_rotation/2))
		) + ',' +
		Math.round(
			n.center + n.main_len *
			Math.sin(Math.radians(270-n.segment_rotation/2))
		) + ' ' +
		'A' + // arc to
		Math.round(n.main_len) + ',' + Math.round(n.main_len) +
		' 0 0,1 ' +
		// right point
		Math.round(
			n.center + n.main_len *
			Math.cos(Math.radians(270+n.segment_rotation/2))
		) + ',' +
		Math.round(
			n.center + n.main_len *
			Math.sin(Math.radians(270+n.segment_rotation/2))
		);


var lightup = function() {
	this.filter(function(add) {
		add.componentTransfer({
			rgb: { type: 'linear', slope: 5.0}
		});
	});
};

var lightdown = function() {
	this.filter(function(add) {
		add.componentTransfer({
			rgb: { type: 'linear', slope: 1.0}
		});
	});
};

function color_main_segments(i) {
	if (i % 2 === 0) {
		return c.main_segment_even;
	}
	else {
		return c.main_segment_odd;
	}
}

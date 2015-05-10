function drawingTest() {
	if (SVG.supported) {

		var draw = SVG('drawing').size(n.scale,n.scale);

		var outerboard = draw.circle(n.scale);
		outerboard.fill(c.outerboard);
		outerboard.mouseover(lightup);
		outerboard.mouseout(lightdown);

		var main_segments = [];
		var mult2_segments = [];
		var mult3_segments = [];

		// Generating main segments of the board
		// TODO: There's gotta be a better (cleaner) way.
		// this is madness.
		for (var i = 0; i < n.segments; i++) {
			main_segments[i] = draw.path(main_segment_shape);
			main_segments[i].mouseover(lightup);
			main_segments[i].mouseout(lightdown);
			main_segments[i].rotate(n.segment_rotation*i, n.center, n.center);
			main_segments[i].data({value: null});
			main_segments[i].fill(color_main_segments(i));
			mult2_segments[i] = draw.path(generateSegmentPart(
																		n.mult2_out_r, n.mult2_in_r));
			mult2_segments[i].rotate(n.segment_rotation*i, n.center, n.center);
			mult2_segments[i].fill(color_mult_segments(i));
			mult2_segments[i].mouseover(lightup);
			mult2_segments[i].mouseout(lightdown);
			mult3_segments[i] = draw.path(generateSegmentPart(
																		n.mult3_out_r, n.mult3_in_r));
			mult3_segments[i].rotate(n.segment_rotation*i, n.center, n.center);
			mult3_segments[i].fill(color_mult_segments(i));
			mult3_segments[i].mouseover(lightup);
			mult3_segments[i].mouseout(lightdown);
			}

			var bull = draw.circle(n.bull_r*2);
			bull.move(n.center-n.bull_r, n.center-n.bull_r);
			bull.fill(c.bull);
			bull.mouseover(lightup);
			bull.mouseout(lightdown);
			var bullseye = draw.circle(n.bullseye_r*2);
			bullseye.move(n.center-n.bullseye_r, n.center-n.bullseye_r);
			bullseye.fill(c.bullseye);
			bullseye.mouseover(lightup);
			bullseye.mouseout(lightdown);
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
n.main_r = n.scale*0.42;
n.mult2_out_r = n.main_r;
n.mult2_in_r = n.main_r*0.95;
n.mult3_out_r = n.main_r*0.65;
n.mult3_in_r = n.main_r*0.6;
n.bull_r = n.main_r*0.1;
n.bullseye_r = n.main_r*0.04;

// c is for colors
var c = {
	outerboard: "#1b0d24",
	main_segment_odd: "#f0ebd6",
	main_segment_even: "#1a2119",
	mult_segment_odd: "#5a9136",
	mult_segment_even: "#b00e2c"
};
c.bull = c.mult_segment_odd;
c.bullseye = c.mult_segment_even;

// seg_gen is for segment generator
var seg_gen = {};
seg_gen.leftX = function(len) {
	return (
		n.center + len *
		Math.cos(Math.radians(270-n.segment_rotation/2))
	);
};
seg_gen.leftY = function(len) {
	return (
		n.center + len *
		Math.sin(Math.radians(270-n.segment_rotation/2))
	);
};
seg_gen.rightX = function(len) {
	return (
		n.center + len *
		Math.cos(Math.radians(270+n.segment_rotation/2))
	);
};
seg_gen.rightY = function(len) {
	return (
		n.center + len *
		Math.sin(Math.radians(270+n.segment_rotation/2))
	);
};


var main_segment_shape =
		'M' + // start on center
		n.center + ',' + n.center +
		' L' + // link to left point
		seg_gen.leftX(n.main_r) + ',' +
		seg_gen.leftY(n.main_r) + ' ' +
		'A' + // arc to
		n.main_r + ',' + n.main_r +
		' 0 0,1 ' +
		// right point
		seg_gen.rightX(n.main_r) + ',' +
		seg_gen.rightY(n.main_r);

function generateSegmentPart(outlen, inlen) {
	var shape =
		'M' +
		seg_gen.leftX(outlen) + ',' +
		seg_gen.leftY(outlen) + ' ' +
		'A' +
		outlen + ',' + outlen +
		' 0 0,1' +
		seg_gen.rightX(outlen) + ',' +
		seg_gen.rightY(outlen) + ' ' +
		'L' +
		seg_gen.rightX(inlen) + ',' +
		seg_gen.rightY(inlen) + ' ' +
		'A' +
		inlen + ',' + inlen +
		' 0 0,0' +
		seg_gen.leftX(inlen) + ',' +
		seg_gen.leftY(inlen);

		return shape;
}


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

function color_mult_segments(i) {
	if (i % 2 === 0) {
		return c.mult_segment_even;
	}
	else {
		return c.mult_segment_odd;
	}
}

function drawingTest() {
	if (SVG.supported) {

		var draw = SVG('drawing').size(n.scale,n.scale);

		var outerboard = draw.circle(n.scale);
		set_attr.outerboard(outerboard);

		var main_segments = [];
		var mult2_segments = [];
		var mult3_segments = [];
		var points_text = [];

		// Generating segments of the board and its events and attributes
		for (var i = 0; i < n.segments; i++) {
			main_segments[i] = draw.path(main_segment_shape);
			set_attr.main(main_segments[i], i);

			mult2_segments[i] = draw.path(generateSegmentPart(
																		n.mult2_out_r, n.mult2_in_r));
			set_attr.mult2(mult2_segments[i], i);

			mult3_segments[i] = draw.path(generateSegmentPart(
																		n.mult3_out_r, n.mult3_in_r));
			set_attr.mult3(mult3_segments[i], i);

			// THIS GOTTA GO INTO FUNCTION, but first let's ask someone
			// with windows if he sees glorious Ubuntu Condensed
			points_text[i] = draw.text(n.values[i].toString());
			points_text[i].fill(c.main_segment_odd);
			points_text[i].font({
				family:   'Ubuntu Condensed',
				size:     n.points_fontsize
			});
			points_text[i].center(point_calc.x(n.points_r, i*n.segment_rotation),
														point_calc.y(n.points_r, i*n.segment_rotation) );
		}

		var bull = draw.circle().radius(n.bull_r);
		set_attr.bull(bull);

		var bullseye = draw.circle().radius(n.bullseye_r);
		set_attr.bullseye(bullseye);
	}
	else {
		alert('SVG not supported');
	}
}


// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};


// n is for numbers (meaning all numeric values used)
var n = {
	scale: window.innerHeight*0.8,
	segments: 20,
	segment_rotation: 18
};
// I can't do that inside :(
n.center = n.scale/2;
n.main_r = n.scale*0.42;
n.mult2_out_r = n.main_r;
n.mult2_in_r = n.main_r*0.95;
n.mult3_out_r = n.main_r*0.65;
n.mult3_in_r = n.main_r*0.6;
n.bull_r = n.main_r*0.1;
n.bullseye_r = n.main_r*0.04;
n.points_fontsize = 0.35*(n.scale - n.main_r*2);
n.points_r = n.main_r + n.points_fontsize/1.5;
n.values = [20,1,18,4,13,6,10,15,2,17,3,19,7,16,8,11,14,9,12,5];
n.bull_val = 25;
n.bullseye_val = n.bull_val*2;
n.missed_val = 0;

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

// functions returning x and y based on angle and distance
// from center. Angle 0 is understood as straight up.
var point_calc = {};
point_calc.x = function(dist, ang) {
	return (
		n.center + dist *
		Math.cos(Math.radians(270+ang))
	);
};
point_calc.y = function(dist, ang) {
	return (
		n.center + dist *
		Math.sin(Math.radians(270+ang))
	);
};

// seg_gen is for segment generator
var seg_gen = {};
seg_gen.leftX = function(len) {
	return (
		point_calc.x(len, -n.segment_rotation/2)
	);
};
seg_gen.leftY = function(len) {
	return (
		point_calc.y(len, -n.segment_rotation/2)
	);
};
seg_gen.rightX = function(len) {
	return (
		point_calc.x(len, n.segment_rotation/2)
	);
};
seg_gen.rightY = function(len) {
	return (
		point_calc.y(len, n.segment_rotation/2)
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

var set_attr = {};
set_attr.mouseevents = function(shape) {
	shape.mouseover(lightup);
	shape.mouseout(lightdown);
};

set_attr.main = function(segment, i) {
	set_attr.mouseevents(segment);
	segment.rotate(n.segment_rotation*i, n.center, n.center);
	segment.data({value: n.values[i]});
	segment.fill(color_main_segments(i));
};

set_attr.mult2 = function(segment, i) {
	set_attr.main(segment, i);
	segment.fill(color_mult_segments(i));
	segment.data({value: segment.data('value')*2});
};

set_attr.mult3 = function(segment, i) {
	set_attr.main(segment, i);
	segment.fill(color_mult_segments(i));
	segment.data({value: segment.data('value')*3});
};

set_attr.outerboard = function(shape) {
	shape.fill(c.outerboard);
	shape.data({value: n.missed_val});
	set_attr.mouseevents(shape);
};

set_attr.bull = function (shape) {
	shape.center(n.center, n.center);
	shape.fill(c.bull);
	shape.data({value: n.bull_val});
	set_attr.mouseevents(shape);
};

set_attr.bullseye = function (shape) {
	shape.center(n.center, n.center);
	shape.fill(c.bullseye);
	shape.data({value: n.bullseye_val});
	set_attr.mouseevents(shape);
};

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

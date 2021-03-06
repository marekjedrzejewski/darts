function engine() {
	return angular.element(document.getElementById("score")).scope();
}

function draw_board() {
	if (SVG.supported) {

		var draw = SVG('board').size(n.scale,n.scale);
		draw.id("svgboard");
		draw.viewbox(0,0,n.scale,n.scale); // This allows scaling with width/height

		var outerboard = draw.circle(n.scale);
		set_attr.outerboard(outerboard);

		var main_segments = [];
		var mult2_segments = [];
		var mult3_segments = [];
		var points_text = [];

		// numbers are generated before everything else to cover them
		// from being selected with transparent mask
		for (var i = 0; i < n.segments; i++) {
			points_text[i] = draw.text(n.values[i].toString());
			set_attr.points(points_text[i],i);
		}
		// and here's the mask
		var outerboard_mask = draw.circle(n.scale);
		set_attr.outerboard_mask(outerboard_mask, outerboard);

		// Generating segments of the board and its events and attributes
		for (i = 0; i < n.segments; i++) {
			main_segments[i] = draw.path(main_segment_shape);
			set_attr.main(main_segments[i], i);

			mult2_segments[i] = draw.path(generateSegmentPart(
																		n.mult2_out_r, n.mult2_in_r));
			set_attr.mult2(mult2_segments[i], i);

			mult3_segments[i] = draw.path(generateSegmentPart(
																		n.mult3_out_r, n.mult3_in_r));
			set_attr.mult3(mult3_segments[i], i);
		}

		var bull = draw.circle().radius(n.bull_r);
		set_attr.bull(bull);

		var bullseye = draw.circle().radius(n.bullseye_r);
		set_attr.bullseye(bullseye);

		draw.size('100%', '100%'); // Makes the board responsive. Yaay <3
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
	scale: 1000000, // now that it's 100%x100% it only sets precision
	segments: 20,
	segment_rotation: 18
};
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
	outerboard_lit: "#2c0f42",
	main_segment_odd: "#f0ebd6",
	main_segment_odd_lit: "#fefefe",
	main_segment_even: "#1a2119",
	main_segment_even_lit: "#2d382b",
	mult_segment_odd: "#5a9136",
	mult_segment_odd_lit: "#6ab234",
	mult_segment_even: "#b00e2c",
	mult_segment_even_lit: "#d4002d",
	shot: "#ffcc00"
};
c.bull = c.mult_segment_odd;
c.bull_lit = c.mult_segment_odd_lit;
c.bullseye = c.mult_segment_even;
c.bullseye_lit = c.mult_segment_even_lit;
c.points = c.main_segment_odd;

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
		' 0 0, 1 ' +
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
		' 0 0, 1 ' +
		seg_gen.rightX(outlen) + ',' +
		seg_gen.rightY(outlen) + ' ' +
		'L' +
		seg_gen.rightX(inlen) + ',' +
		seg_gen.rightY(inlen) + ' ' +
		'A' +
		inlen + ',' + inlen +
		' 0 0, 0 ' +
		seg_gen.leftX(inlen) + ',' +
		seg_gen.leftY(inlen);

		return shape;
}

var set_attr = {};
set_attr.mouseevents = function(shape) {
	shape.mouseover(lightup);
	shape.mouseout(lightdown);
	shape.click(function() {
		indicateshot(shape);
		engine().score.darthit(
							shape.data('value'),
							shape.data('type')
						);
	});
};

set_attr.maskmouseevents = function(mask, shape) {
	mask.mouseover(function() {lightupshape(shape);});
	mask.mouseout(function() {lightdownshape(shape);});
	mask.click(function() {
		indicateshot(shape);
		engine().score.darthit(
							shape.data('value'),
							shape.data('type')
						);
	});
};

set_attr.main = function(segment, i) {
	set_attr.mouseevents(segment);
	segment.rotate(n.segment_rotation*i, n.center, n.center);
	segment.data({
		value: n.values[i],
		type: "main",
		color: color_calculator.main(i),
		color_lit: color_calculator.main_lit(i)
		});
	segment.fill(segment.data('color'));
};

set_attr.mult2 = function(segment, i) {
	set_attr.main(segment, i);
	segment.data({
		value: segment.data('value')*2,
		type: "mult2",
		color: color_calculator.mult(i),
		color_lit: color_calculator.mult_lit(i)
		});
	segment.fill(segment.data('color'));
};

set_attr.mult3 = function(segment, i) {
	set_attr.main(segment, i);
	segment.data({
		value: segment.data('value')*3,
		type: "mult3",
		color: color_calculator.mult(i),
		color_lit: color_calculator.mult_lit(i)
		});
	segment.fill(segment.data('color'));
};

set_attr.outerboard = function(shape) {
	shape.data({
		value: n.missed_val,
		type: "miss",
		color: c.outerboard,
		color_lit: c.outerboard_lit
		});
	shape.fill(shape.data('color'));
};

set_attr.outerboard_mask = function(mask, shape) {
	mask.opacity(0.00);
	set_attr.maskmouseevents(mask, shape);
};

set_attr.bull = function (shape) {
	shape.center(n.center, n.center);
	shape.data({
		value: n.bull_val,
		type: "bull",
		color: c.bull,
		color_lit: c.bull_lit
		});
	shape.fill(shape.data('color'));
	set_attr.mouseevents(shape);
};

set_attr.bullseye = function (shape) {
	shape.center(n.center, n.center);
	shape.data({
		value: n.bullseye_val,
		type: "bullseye",
		color: c.bullseye,
		color_lit: c.bullseye_lit
		});
	shape.fill(shape.data('color'));
	set_attr.mouseevents(shape);
};

set_attr.points = function (text, i) {
	text.fill(c.points);
	text.font({
		// there won't be any nice font. Google Fonts and trying to
		// make it work with svgjs defeated me :(
		// OK, let's just try with fonts not looking so bad with
		// fallbacks set.
		family: "Ubuntu Condensed, Segoe UI Semilight," +
						"HelveticaNeueCondensed, sans-serif",
		size:     n.points_fontsize
	});
	text.center(point_calc.x(n.points_r, i*n.segment_rotation),
							point_calc.y(n.points_r, i*n.segment_rotation) );
};

var lightup = function() {
	this.fill(this.data('color_lit'));
};

var lightupshape = function(shape) {
	shape.fill(shape.data('color_lit'));
};

var lightdown = function() {
	this.fill(this.data('color'));
};

var lightdownshape = function(shape) {
	shape.fill(shape.data('color'));
};

var indicateshot = function(shape) {
	shape.fill(c.shot);
};

var color_calculator = {};
color_calculator.main = function(i) {
	if (i % 2 === 0) {
		return c.main_segment_even;
	}
	else {
		return c.main_segment_odd;
	}
};

color_calculator.main_lit = function(i) {
	if (i % 2 === 0) {
		return c.main_segment_even_lit;
	}
	else {
		return c.main_segment_odd_lit;
	}
};

color_calculator.mult = function(i) {
	if (i % 2 === 0) {
		return c.mult_segment_even;
	}
	else {
		return c.mult_segment_odd;
	}
};

color_calculator.mult_lit = function(i) {
	if (i % 2 === 0) {
		return c.mult_segment_even_lit;
	}
	else {
		return c.mult_segment_odd_lit;
	}
};

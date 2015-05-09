function drawingTest() {
	if (SVG.supported) {
		var scale = window.innerHeight*0.8;
		var segment_rotation = 18;
		var draw = SVG('drawing').size(scale,scale);

		var outerboard = draw.circle(scale,scale);
		outerboard.fill('#1b0d24');
		outerboard.mouseover(lightup);
		outerboard.mouseout(lightdown);

		// Shame I don't know math and what is sin/cos :(
		// But I can use Inkscape <3
		// point: up 41292, left 06563
		var main_segment_points = 'M' +
															Math.round(scale/2) + ',' + Math.round(scale/2) +
															' L' +
															Math.round(scale/2 - 0.06563*scale) + ',' +
															Math.round(scale/2 - 0.41292*scale) + ' ' +
															'A180,180 0 0,1 ' +
															Math.round(scale/2 + 0.06563*scale) + ',' +
															Math.round(scale/2 - 0.41292*scale);


		console.log(main_segment_points);

		var list_of_objects = [];

		// Generating main segments of the board
		for (var i = 0; i < 20; i++) {
			list_of_objects[i] = draw.path(main_segment_points);
			list_of_objects[i].mouseover(lightup);
			list_of_objects[i].mouseout(lightdown);
			list_of_objects[i].rotate(segment_rotation*i, 0.5*scale, 0.5*scale);
			list_of_objects[i].data({value: null});
			list_of_objects[i].fill(color_main_segments(i));
			}

	}
	else {
		alert('SVG not supported');
	}
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
		return "#1a2119";
	}
	else {
		return "#f0ebd6";
	}
}

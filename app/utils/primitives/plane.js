var app = app || {};

app.plane = (function(){
	
	function plane(config){
		this.setDrawableProp(config);
		this.typeName = 'plane';

		this.data = [];
		var width = config.width || 1;
		var height = config.height || 1;

		for(var	y = -height / 2;y < height / 2;y++)
			for(var x = -width / 2;x < width / 2;x++)
				this.data.push(x  ,y  ,0, 0,0,1, 0,0,
							   x+1,y  ,0, 0,0,1, 1,0,
							   x+1,y+1,0, 0,0,1, 1,1,

							   x+1,y+1,0, 0,0,1, 1,1,
							   x  ,y+1,0, 0,0,1, 0,1,
							   x  ,y  ,0, 0,0,1, 0,0);
	}

	plane.prototype = app.drawable;

	return plane;

})();
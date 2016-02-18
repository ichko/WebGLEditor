var app = app || {};

app.cuboid = (function(){
	
	function cuboid(config){
		this.setDrawableProp(config);
		this.typeName = 'cuboid';

		this.scale[0] = config.width || 1;
		this.scale[2] = config.height || 1;
		this.scale[1] = config.depth || 1;
	}

	cuboid.prototype = new app.cube({});

	return cuboid;

})();
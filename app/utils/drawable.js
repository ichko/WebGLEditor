var app = app || {};

app.drawable = (function(){

	function drawable(){}

	drawable.prototype = {
		setDrawableProp: function(config){
			this.material = app.material.init(config.material);
			this.poz = config.poz || app.vector3.init();
			this.size = config.size || 1;
			this.scale = config.scale || [1, 1, 1];
			this.orientation = config.orientation || [0, 0, 0];
			this.offset = config.offset || app.vector3.init();
			this.wireframe = config.wireframe || false;

			this.name = config.name || 'unnamed';
			this.typeName = config.typeName || 'drawable';
		},

		bindBuffer: function(ctx){
			if(!this.buf){
				this.buf = ctx.createBuffer();
				ctx.bindBuffer(ctx.ARRAY_BUFFER, this.buf);
			}
		},

		drawableData: function() {
			return this;
		}
	}

	return new drawable();

})();
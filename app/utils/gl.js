var app = app || {};

app.gl = (function(){

	function gl(config) {
		this.canvas = document.getElementById(config.canvasId || 'canvas');
		this.canvas.width = config.width || this.canvas.parentElement.offsetWidth;
		this.canvas.height = config.height || this.canvas.parentElement.offsetHeight;
		this.ctx = getContext(this.canvas);
		
		this.ctx.enable(this.ctx.DEPTH_TEST);
		this.clearColor = config.clearColor || [0.7, 0.7, 0.7, 1];
		this.ctx.clearColor(this.clearColor[0], this.clearColor[1], this.clearColor[2], this.clearColor[3]);
	}

	gl.prototype = {
		clear: clear
	};

	function getContext(canvas){
		var context = canvas.getContext("webgl");
		if (!context)
			context = canvas.getContext("experimental-webgl");
		
		if (!context)
			throw new Error('No webgl context');

		return context;
	}

	function clear(){
		this.ctx.clear(this.ctx.COLOR_BUFFER_BIT + this.ctx.DEPTH_BUFFER_BIT);
	}

	return {
		init: function(config){
			return new gl(config || {});
		}
	};

})();
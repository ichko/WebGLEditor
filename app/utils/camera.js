var app = app || {};

app.camera = (function(){

	function camera(config){
		this.orientation = app.matrix4.init();

		this.proj = app.matrix4.init();

		this.orientation.viewMatrix(config.poz || [0, 0, 10], 
									config.eye || [0, 0, 0], 
									config.up || [0, 1, 0]);

		this.proj.perspMatrix(config.angle || Math.PI/3,
							  config.aspect || 800 / 600,
							  config.near || 0.01,
							  config.far || 75000);

		this.poz = config.poz || [0, 0, 10];
		this.eye = config.eye || [0, 0, 0];
		this.up = config.up || [0, 1, 0];
	}

	camera.prototype = {
		set: set,
		forwardVector: forwardVector
	};

	function set(poz, eye, up){
		this.poz = poz;
		this.eye = eye;
		this.up = up;

		this.orientation.viewMatrix(poz, eye, up);
	}

	function forwardVector(){
		return [this.eye[0] - this.poz[0],
				this.eye[1] - this.poz[1],
				this.eye[2] - this.poz[2]];
	}

	return {
		init: function(config){
			return new camera(config || {});
		}
	};

})();
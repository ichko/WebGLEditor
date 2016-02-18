var app = app || {};

app.flyingCamera = (function(){

	var defaultSize = 1;

	function flyingCamera(config){
		this.poz = app.vector3.fromObject(config.poz);
		this.eye = app.vector3.fromObject(config.eye);
		this.up = app.vector3.fromObject(config.up);

		this.camera = app.camera.init({
			angle: config.angle,
			aspect: config.aspect,
			near: config.near,
			far: config.far
		});
	}

	flyingCamera.prototype = {
		set: set,
		raw: raw,
		forwardVector: forwardVector,
		rightVector: rightVector,

		forward: forward,
		backward: backward,
		right: right,
		left: left,
		goUp: goUp,
		goDown: goDown,

		yaw: yaw,
		pitch: pitch,
		roll: roll
	};

	function set(config){
		this.poz = config.poz || this.poz;
		this.eye = config.eye || this.eye;
		this.up = config.up || this.up;
	}

	function raw(){
		this.camera.set(
			this.poz.raw(),
			this.eye.raw(),
			this.up.raw()
		);

		return this.camera;
	}

    function yaw(angle, up){
        var forward = this.forwardVector();
        if(!up || up.isZero())
            up = this.up;
        else
            this.up = app.math.rotate(up, this.up, angle);

        this.eye = this.poz.add(app.math.rotate(up, forward, angle));
    }

    function pitch(angle){
        var right = this.rightVector();
        var forward = this.forwardVector();

        this.eye = this.poz.add(app.math.rotate(right, forward, angle));
        //this.up = app.math.rotate(right, this.up, angle);
    }

    function roll(angle){
        this.up = app.math.rotate(this.forwardVector(), this.up, angle);
    }


    function goUp(size){
		var up = this.up.scalar(size);
		this.poz = this.poz.add(up);
		this.eye = this.eye.add(up);
    }

    function goDown(size){
    	this.goUp(-size);
    }

	function forward(size){
		var forward = this.forwardVector(size);
		this.poz = this.poz.add(forward);
		this.eye = this.eye.add(forward);
	}

	function backward(size){
		this.forward(-size);
	}

	function right(size){
		var right = this.rightVector(size);
		this.poz = this.poz.add(right);
		this.eye = this.eye.add(right);
	}

	function left(size){
		this.right(-size);
	}


	function forwardVector(size){
		if (typeof size === 'undefined')
			size = defaultSize;

		return this.eye.subtract(this.poz).normalize().scalar(size);
	}

	function rightVector(size){
		if (typeof size === 'undefined')
			size = defaultSize;
		
		return this.forwardVector().cross(this.up).normalize().scalar(size);
	}

	return {
		init: function(config){
			return new flyingCamera(config || {});
		}
	};

})();
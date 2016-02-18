var app = app || {};

app.cameraControl = (function(){

	function cameraControl(config){
		this.inputHandler = config.inputHandler;
		this.camera = config.camera;

		this.momentum = config.momentum || 0.1;
		this.angluarMomentum = config.angluarMomentum || 0.01;

		this.mouseSensitivity = config.mouseSensitivity || 1000;
		this.mouseTranlationSensitivity = config.mouseTranlationSensitivity || 200;

		this.up = config.up || this.camera.up;
		this.eps = config.eps || 0.1;
		var me = this;

		this.element = config.element;
	}

	cameraControl.prototype = {
		update: update
	}

	function update(camera){
		camera = camera || this.camera;
		var ih = this.inputHandler,
			speed = this.momentum,
			angularSpeed = this.angluarMomentum,
			up = this.up,
			oldCameraUp = app.vector3.init(camera.up.x, camera.up.y, camera.up.z),
			oldCameraEye = app.vector3.init(camera.eye.x, camera.eye.y, camera.eye.z);

		if(ih.lockPointerLost(this.element)){
			handleKeyboardRotation.call(this, angularSpeed, ih, camera, up);
			handleMouseRotation.call(this, ih, camera, up, -1);
			handleKeyboardTranslation.call(this, speed, ih, camera);
		}

		if(ih.mouse.leftKeyDown)
			handleMouseRotation.call(this, ih, camera, up, 1);

		if(ih.mouse.rightKeyDown)
			handleMouseTranslation.call(this, ih, camera);

		if(ih.mouse.scrollKeyDown)
			handleMouseZoom.call(this, ih, camera);

		limitEye.call(this, camera, oldCameraUp, oldCameraEye, up);
	}

	function limitEye(camera, oldCameraUp, oldCameraEye, up){
		if(up.distance(camera.forwardVector()) < this.eps || up.reverse().distance(camera.forwardVector()) < this.eps){
			camera.up = oldCameraUp;
			camera.eye = oldCameraEye;
		}
	}

	function handleMouseTranslation(ih, camera){
		if(ih.mouse.isMoving()){
			camera.goUp(ih.mouse.dY / this.mouseTranlationSensitivity);
			camera.right(-ih.mouse.dX / this.mouseTranlationSensitivity);
		}
	}

	function handleMouseZoom(ih, camera){
		if(ih.mouse.isMoving()){
			camera.forward(ih.mouse.dY / this.mouseTranlationSensitivity);
		}
	}

	function handleMouseRotation(ih, camera, up, direction){
		if(ih.mouse.isMoving()){
			camera.pitch(ih.mouse.dY / this.mouseSensitivity * direction);
			camera.yaw(ih.mouse.dX / this.mouseSensitivity * direction, up);
		}
	}

	function handleKeyboardRotation(speed, ih, camera, up){
		if(ih.keyDown(ih.key.UP))
			this.camera.pitch(speed);

		if(ih.keyDown(ih.key.DOWN))
			camera.pitch(-speed);

		if(ih.keyDown(ih.key.LEFT))
			camera.yaw(speed, up);

		if(ih.keyDown(ih.key.RIGHT))
			camera.yaw(-speed, up);
	}

	function handleKeyboardTranslation(speed, ih, camera){
		if(ih.keyDown(ih.key.W))
			camera.forward(speed);

		if(ih.keyDown(ih.key.S))
			camera.backward(speed);

		if(ih.keyDown(ih.key.A))
			camera.left(speed);

		if(ih.keyDown(ih.key.D))
			camera.right(speed);
	}

	return {
		init: function(config){
			return new cameraControl(config || {});
		}
	};

})();
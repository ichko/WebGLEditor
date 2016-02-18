var app = app || {};

var requestAnimFrame = (function() {
	var fps = 60;

	return  window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			window.oRequestAnimationFrame ||
			window.msRequestAnimationFrame ||
			function(callback) {
			   window.setTimeout(callback, 1000 / fps);
			};
})();

app.lib = (function() {

	var constants = {
		modelMatrixName: 'uModelMatrix',
		baseUrl: 'app',
		shadersPath: 'app/shaders/',
	};

	function lib(init, update) {
		this.gl = app.gl.init({
				canvasId: 'canvas',
				clearColor: [0.9, 0.9, 0.9, 1]
			}),
			this.modelMatrix = app.matrix4.init(),

			this.fog = app.fog.init({
				color: this.gl.clearColor,
				minDist: 10,
				maxDist: 20
			}),

			this.camera = app.flyingCamera.init({
				aspect: this.gl.canvas.width / this.gl.canvas.height,
				poz: app.vector3.init(3, 3, 3),
				eye: app.vector3.init(0, 0, 1),
				up: app.vector3.init(0, 0, 1)
			}),

			this.cameraControl = app.cameraControl.init({
				camera: this.camera,
				inputHandler: app.inputHandler,
				element: this.gl.canvas
			}),

			this.frame = 0,
			this.userUpdateFunc = update,
			this.scene = [],
			this.renderer = {},
			this.renderer = {},
			this.shader = {};

		loadShader.call(this, init, update);
	}

	function loadShader(init, update) {
		var me = this;
		app.shader.get({
			vShaderName: 'vshader.vert',
			fShaderName: 'fshader.frag',
			requester: app.requester.init(constants.shadersPath),
			ctx: me.gl.ctx,
			success: function(shader) {
				me.shader = shader;
				me.renderer = app.renderer.init({
					gl: me.gl,
					shader: shader,
					modelMatrix: me.modelMatrix,
					fog: me.fog
				});

				init(me);
				if (update) animate.call(me);
			}
		});
	}

	function animate() {
		var me = this;
		me.resizeCanvas();
		me.userUpdateFunc(me);
		me.frame++;

		requestAnimFrame(function() {
			animate.call(me);
		});
	}

	function clearScene() {
		this.scene.length = 0;
	}

	function resizeCanvas() {
		var canvas = this.gl.canvas;

		var displayWidth = canvas.clientWidth;
		var displayHeight = canvas.clientHeight;

		if (canvas.width != displayWidth || canvas.height != displayHeight) {
			canvas.width = displayWidth;
			canvas.height = displayHeight;
			this.gl.ctx.viewport(0, 0, canvas.width, canvas.height);

			this.camera = app.flyingCamera.init({
				aspect: this.gl.canvas.width / this.gl.canvas.height,
				poz: this.camera.poz,
				eye: this.camera.eye,
				up: this.camera.up
			});

			this.cameraControl.camera = this.camera;
		}
	}

	lib.prototype = {
		clearScene: clearScene,
		resizeCanvas: resizeCanvas
	};

	return {
		init: function(init, update) {
			return new lib(init, update);
		}
	};

})();
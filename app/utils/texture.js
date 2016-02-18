var app = app || {};

app.texture = (function(){

	var textures = [];
	var imagesSrc = [];

	function txt(config){
		if(imagesSrc.indexOf(config.imageSrc) >= 0){
			this.id = imagesSrc.indexOf(config.imageSrc);
		} else {
			this.id = textures.push(config.texture) - 1;
			imagesSrc.push(config.imageSrc);
		}
	}

	txt.prototype = {
		getTexture: getTexture,
		getTextureUrl: getTextureUrl,
		hasTexture: hasTexture
	};

	function get(config) {
		var texture = config.ctx.createTexture(),
			image = new Image(),
			result = new txt({
				texture: texture,
				imageSrc: config.url
			});

		image.onload = function() {
			imageLoaded(texture, image, config.ctx);

			if(config.success)
				config.success(result);
		};
		image.src = config.url;

		return result;
	}

	function getTexture(){
		return textures[this.id];
	}

	function getTextureUrl(){
		return imagesSrc[this.id];
	}

	function hasTexture(){
		return this.id in imagesSrc;
	}

	function imageLoaded(texture, image, gl){
		if (!isPowerOfTwo(image.width) || !isPowerOfTwo(image.height)) {
			var canvas = document.createElement("canvas");
			canvas.width = nextHighestPowerOfTwo(image.width);
			canvas.height = nextHighestPowerOfTwo(image.height);
			var ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, image.width, image.height);
			image = canvas;
		}

		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
		gl.generateMipmap(gl.TEXTURE_2D);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

		gl.bindTexture(gl.TEXTURE_2D, null);
	}

	function isPowerOfTwo(x){
		return (x & (x - 1)) == 0;
	}

	function nextHighestPowerOfTwo(x) {
		--x;
		for(var i = 1; i < 32; i <<= 1) {
			x = x | x >> i;
		}

		return x + 1;
	}

	function getTextures(){
		return {
			textures: textures,
			imagesSrc: imagesSrc
		};
	}

	return {
		init: function(config){
			return new txt(config);
		},
		get: get,
		getTextures: getTextures
	};

})();
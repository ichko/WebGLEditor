var app = app || {};

app.shader = (function(){

	function construct(config){
		this.vShaderSrc = config.vShaderSrc;
		this.fShaderSrc = config.fShaderSrc;
		this.ctx = config.ctx;
		this.FLOATS = config.FLOATS || 4;

		this.shaderProgram = undefined;
		this.uniforms = {};
		this.attributes = {};
	}

	function getShader(source, type){
		var shader = this.ctx.createShader(type);

		this.ctx.shaderSource(shader, source);
		this.ctx.compileShader(shader);

		if (!this.ctx.getShaderParameter(shader, this.ctx.COMPILE_STATUS))
			throw new Error(this.ctx.getShaderInfoLog(shader));
		
		return shader;
	}

	function getVariables(){
		this.uniforms = {};
		this.attributes = {};

		for (var i = 0;i < this.ctx.getProgramParameter(this.shaderProgram, this.ctx.ACTIVE_UNIFORMS);i++){
			var name = this.ctx.getActiveUniform(this.shaderProgram, i).name;
			this.uniforms[name] = this.ctx.getUniformLocation(this.shaderProgram, name);
		}

		for (var i = 0;i < this.ctx.getProgramParameter(this.shaderProgram, this.ctx.ACTIVE_ATTRIBUTES);i++){
			var name = this.ctx.getActiveAttrib(this.shaderProgram, i).name;
			this.attributes[name] = this.ctx.getAttribLocation(this.shaderProgram, name);
		}
	}

	function compile(){
		var vShader = getShader.call(this, this.vShaderSrc, this.ctx.VERTEX_SHADER);
		var fShader = getShader.call(this, this.fShaderSrc, this.ctx.FRAGMENT_SHADER);
				
		if (!vShader || !fShader)
			throw new Error('No shaders');
		
		var shaderProgram = this.ctx.createProgram();
		this.ctx.attachShader(shaderProgram,vShader);
		this.ctx.attachShader(shaderProgram,fShader);
		this.ctx.linkProgram(shaderProgram);

		if (!this.ctx.getProgramParameter(shaderProgram, this.ctx.LINK_STATUS))
			throw new Error(this.ctx.getProgramInfoLog(shaderProgram));

		this.ctx.useProgram(shaderProgram);
		this.shaderProgram = shaderProgram;
		getVariables.call(this);

		return this;
	}

	function varBind(src, dst, functionName){
		var me = this;
		return function() {
			me.ctx.uniformMatrix4fv(dst, false, src);
		}
	}

	construct.prototype = {
		compile: compile,
		varBind: varBind
	};


	function get(config){
		config.requester.get(config.vShaderName, function(vShaderSrc){
			config.requester.get(config.fShaderName, function(fShaderSrc){
				var shader =  new construct({
					vShaderSrc: vShaderSrc,
					fShaderSrc: fShaderSrc,
					ctx: config.ctx
				}).compile();

				config.success(shader);
			}, config.error);
		}, config.error);
	}

	return {
		init: function(config){
			return new construct(config);
		},
		get: get
	}

})();
var app = app || {};

app.renderer = (function(){

	var viewMatrixName = 'uViewMatrix',
		projMatrixName = 'uProjectionMatrix',
		modelMatrixName = 'uModelMatrix',
		textureSamplerName = 'uTxtSampler',
		normalSamplerName = 'uNormSampler';

	function renderer(config){
		this.gl = config.gl;
		this.shader = config.shader;
		this.fog = config.fog;

		this.modelMatrix = config.modelMatrix || app.matrix4.init();
		this.modelMatrixStack = [];
	}

	renderer.prototype = {
		drawScene: drawScene,
		pushMatrix: pushMatrix,
		popMatrix: popMatrix,
		useMatrix: useMatrix
	}

	function useFog(){
		this.gl.ctx.uniform1i(this.shader.uniforms['useFog'], this.fog.active);
		this.gl.ctx.uniform4fv(this.shader.uniforms['fogColor'], this.fog.color);
		this.gl.ctx.uniform1f(this.shader.uniforms['minDistance'], this.fog.minDist);
		this.gl.ctx.uniform1f(this.shader.uniforms['maxDistance'], this.fog.maxDist);
	}

	function useCamera(camera){
		this.gl.ctx.uniform3fv(this.shader.uniforms['viewDirection'], camera.forwardVector().raw());
		this.gl.ctx.uniform3fv(this.shader.uniforms['cameraPoz'], camera.poz.raw());
		this.gl.ctx.uniformMatrix4fv(this.shader.uniforms[viewMatrixName], false, camera.raw().orientation.mat);
		this.gl.ctx.uniformMatrix4fv(this.shader.uniforms[projMatrixName], false, camera.raw().proj.mat);
	}

	function useMatrix(){
		this.gl.ctx.uniformMatrix4fv(this.shader.uniforms[modelMatrixName], false, this.modelMatrix.mat);
	}

	function pushMatrix(){
		var mat = new Float32Array(this.modelMatrix.mat.length);
		mat.set(this.modelMatrix.mat);
		this.modelMatrixStack.push(mat);
	}

	function popMatrix(){
		if (this.modelMatrixStack.length)
			this.modelMatrix.mat = this.modelMatrixStack.pop();
		else
			this.modelMatrix.identity();
	}

	function drawScene(scene, camera){
		var me = this;
		useCamera.call(me, camera);
		useFog.call(me);

		scene.forEach(function(element){
			if(typeof element.drawableData === 'function'){
				var drawableData = element.drawableData();
				if(drawableData.length)
					drawableData.forEach(function(item){
						draw.call(me, item.drawableData(), camera);
					});
				else
					draw.call(me, element.drawableData(), camera);
			}
		});
	}

	function draw(element, camera){
		var shader = this.shader,
			ctx = shader.ctx,
			uniforms = shader.uniforms,
			attributes = shader.attributes,
			FLOATS = shader.FLOATS;

		this.pushMatrix();
		this.modelMatrix.translate(element.poz.raw());

		if(element.orientation){
			if (element.orientation[0]) this.modelMatrix.zRotate(element.orientation[0]);
			if (element.orientation[1]) this.modelMatrix.yRotate(element.orientation[1]);
			if (element.orientation[2]) this.modelMatrix.xRotate(element.orientation[2]);
			if (element.orientation[3]) this.modelMatrix.zRotate(element.orientation[3]);
		}

		this.modelMatrix.scale(element.scale);
		this.modelMatrix.scale([element.size, element.size, element.size]);
		this.modelMatrix.translate(element.offset.raw())
		this.useMatrix();

		element.bindBuffer(ctx);
		ctx.bufferData(ctx.ARRAY_BUFFER, new Float32Array(element.data), ctx.STATIC_DRAW);

		ctx.vertexAttrib3fv(attributes.aColor, element.material.color);

		ctx.enableVertexAttribArray(attributes.aXYZ);
		ctx.vertexAttribPointer(attributes.aXYZ,3,ctx.FLOAT,false,8*FLOATS,0*FLOATS);

		ctx.enableVertexAttribArray(attributes.aNormal);
		ctx.vertexAttribPointer(attributes.aNormal,3,ctx.FLOAT,false,8*FLOATS,3*FLOATS);

		if (element.material.colorTexture && ctx.isTexture(element.material.colorTexture.getTexture())){

			ctx.uniform1i(uniforms[textureSamplerName], 0);
			ctx.activeTexture(ctx.TEXTURE0);
			ctx.bindTexture(ctx.TEXTURE_2D, element.material.colorTexture.getTexture());

			ctx.enableVertexAttribArray(attributes.aST);
			ctx.vertexAttribPointer(attributes.aST,2,ctx.FLOAT,false,8*FLOATS,6*FLOATS);
			ctx.uniform1i(uniforms.useTexture, true);
		}
		else{
			ctx.disableVertexAttribArray(attributes.aST);
			ctx.uniform1i(uniforms.useTexture, false);
		}

		if (element.material.normalTexture && ctx.isTexture(element.material.normalTexture.getTexture())){
			ctx.uniform1i(uniforms[normalSamplerName], 1);
			ctx.activeTexture(ctx.TEXTURE1);
			ctx.bindTexture(ctx.TEXTURE_2D, element.material.normalTexture.getTexture());
			ctx.uniform1i(uniforms.useNormalTexture, true);
		}
		else{
			// ctx.disableVertexAttribArray(attributes.aST);
			ctx.uniform1i(uniforms.useNormalTexture, false);
		}

		var viewMatrix = camera.camera.orientation;
		var normalMatrix = app.matrix4.calculateNormalMatrix(app.matrix4.multiplyMatrix(viewMatrix.mat, 
			this.modelMatrix.mat).mat);

		ctx.uniformMatrix4fv(uniforms.uNormalMatrix,false,normalMatrix.mat);

		var drawType = ctx.TRIANGLES;
		if(element.wireframe)
			drawType = ctx.LINES;

		ctx.drawArrays(drawType, 0, element.data.length / 8);

		this.popMatrix();
	}

	return {
		init: function(config){
			return new renderer(config);
		}
	};

})();
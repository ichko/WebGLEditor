var app = app || {};

app.obj = (function(textureName){

	function obj(config){
		config.texturesBasePath = config.texturesBasePath || 'app/textures/';

		config.materials.ctx = config.ctx;
		this.materials = getMaterial.call(config.materials, config.txtpropName || '$tex.file', config.texturesBasePath);
		this.meshes = getMeshes.call(config);
		bindMaterials.call(this);
	}

	obj.prototype.drawableData = function(){
		return this.meshes;
	}

	function bindMaterials(){
		var me = this,
		 	materialCnt = 0;

		me.meshes.forEach(function(mesh){
			mesh.material = me.materials[materialCnt];
			materialCnt++;
		});
	}

	function getMeshes(){
		var me = this,
			meshRefArray = separateByMaterial(this.meshes),
			result = [];

		meshRefArray.forEach(function(meshes){
			result.push(app.mesh.fromArray(meshes));
		});

		return result;
	}

	function separateByMaterial(meshes){
		var result = [];
		for (var i = meshes.length - 1;i >= 0;i--){
			var m = meshes[i];
			if(!result.hasOwnProperty(m.materialindex))
				result[m.materialindex] = [];
			result[m.materialindex].push(m);
		};

		return result;
	}

	function getMaterial(txtpropName, textureBasePath){
		var me = this,
			result = [];

		me.forEach(function(material){
			var mat = app.material.init({color: [1,1,1]});
			for (var i = material.properties.length - 1; i >= 0; i--) {
				var property = material.properties[i];
				if(property.key === txtpropName && property.semantic === 1){
					mat.colorTexture = app.texture.get({
						ctx: me.ctx,
						url: textureBasePath + property.value
					});
				}
				if(property.key === txtpropName && property.semantic === 5){
					mat.normalTexture = app.texture.get({
						ctx: me.ctx,
						url: textureBasePath + property.value
					});
				}
			};

			result.push(mat);
		});

		return result;
	}

	function get(config) {
		config.requester = config.requester || app.requester.init();
		config.requester.get(config.name, function(json) {
			object = JSON.parse(json);
			
			for(objParam in config)
				object[objParam] = config[objParam];
			
			config.success(new obj(object), object);
		});
	}

	return {
		init: function(config){
			return new obj(config);
		},
		get: get
	};

})();
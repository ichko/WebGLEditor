var app = app || {};

app.mesh = (function(){

	function mesh(config){
		this.vertices = config.vertices || [];
		this.normals = config.normals || [];
		this.faces = config.faces || [];
		this.texturecoords = config.texturecoords || [];

		this.setDrawableProp(config);
		this.data = config.data || getData.call(config);
	}

	function fromArray(meshes){
		var data = [];
		for(var i = 0;i < meshes.length;i++)
			data = [].concat(data, getData.call(meshes[i]));

		return new mesh({data: data});
	}

	mesh.prototype = app.drawable;

	function getData(){
		var result = [];

		for(var i = 0;i < this.faces.length;i++){
			var ids = [this.faces[i][0] * 3, this.faces[i][1] * 3, this.faces[i][2] * 3];
			var txtIds = [this.faces[i][0] * 2, this.faces[i][1] * 2, this.faces[i][2] * 2];
			
			var v1 = [this.vertices[ids[0]], this.vertices[ids[0] + 1], this.vertices[ids[0] + 2]];
			var v2 = [this.vertices[ids[1]], this.vertices[ids[1] + 1], this.vertices[ids[1] + 2]];
			var v3 = [this.vertices[ids[2]], this.vertices[ids[2] + 1], this.vertices[ids[2] + 2]];
			
			var n1 = [this.normals[ids[0]], this.normals[ids[0] + 1], this.normals[ids[0] + 2]];
			var n2 = [this.normals[ids[1]], this.normals[ids[1] + 1], this.normals[ids[1] + 2]];
			var n3 = [this.normals[ids[2]], this.normals[ids[2] + 1], this.normals[ids[2] + 2]];

			var t1 = [0,0];
			var t2 = [0,0];
			var t3 = [0,0];

			if(this.texturecoords){
				var texturecoords = this.texturecoords[0];
				t1 = [texturecoords[txtIds[0]], texturecoords[txtIds[0] + 1]];
				t2 = [texturecoords[txtIds[1]], texturecoords[txtIds[1] + 1]];
				t3 = [texturecoords[txtIds[2]], texturecoords[txtIds[2] + 1]];
			}

			result.push(v1[0], v1[1], v1[2],  n1[0], n1[1], n1[2],  t1[0], t1[1],
						v2[0], v2[1], v2[2],  n2[0], n2[1], n2[2],  t2[0], t2[1],
						v3[0], v3[1], v3[2],  n3[0], n3[1], n3[2],  t3[0], t3[1]);
		}

		return result;
	}

	return {
		init: function(config){
			return new mesh(config || {});
		},
		fromArray: fromArray
	};

})();
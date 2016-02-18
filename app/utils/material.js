var app = app || {};

app.material = (function(){

	function material(config){
		this.color = config.color || [1, 0, 0];
		this.colorTexture = config.colorTexture;
		this.normalTexture = config.normalTexture;
	}

	return {
		init: function(config){
			return new material(config || {});
		}
	};

})();
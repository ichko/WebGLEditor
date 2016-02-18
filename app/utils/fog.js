var app = app || {};

app.fog = (function(){
	
	function fog(config){
		this.color = config.color || [0,0,0,1];
		this.minDist = config.minDist || 5;
		this.maxDist = config.maxDist || 10;
		this.active = config.active || true;
	}

	return {
		init: function(config){
			return new fog(config || {});
		}
	};

})();
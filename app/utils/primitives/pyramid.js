var app = app || {};

app.pyramid = (function(){

	function pyramid(config){
		this.setDrawableProp(config);
		this.typeName = 'pyramid';

		var a = 0, dA = 2*Math.PI/config.sides
		this.data = [];
		for (var i=0; i<=config.sides; i++) { 
			this.data.push(0,0,0, 0,0,-1, 0,0);
			this.data.push(Math.cos(a),Math.sin(a),0,0,0,-1, 0,0);
			this.data.push(Math.cos(a+dA),Math.sin(a+dA),0,0,0,-1, 0,0);
			a += dA;
		}

		a = 0;
		var nZ = Math.cos(Math.PI/config.sides);
		for (var i=0; i<=config.sides; i++){ 
			var N = [Math.cos(a+dA/2),Math.sin(a+dA/2),0];
			this.data.push(0,0,1,N[0],N[1],nZ, 0,0);
			this.data.push(Math.cos(a),Math.sin(a),0,N[0],N[1],0, 0,0);
			this.data.push(Math.cos(a+dA),Math.sin(a+dA),0,N[0],N[1],0, 0,0);
			a += dA;
		}
	}

	pyramid.prototype = app.drawable;

	return pyramid;

})();
var app = app || {};

app.prism = (function(){
	
	function prism(config){
		this.setDrawableProp(config);
		this.typeName = 'prism';

		var n = config.sides || 4;
		var a = 0, dA = 2*Math.PI/n;
		this.data = [];
		for (var i=0; i<=n; i++){ 
			this.data.push(0,0,0, 0,0,-1, 0.5,0.5);
			this.data.push(Math.cos(a),Math.sin(a),0,0,0,-1, 0.5+0.5*Math.cos(a),0.5+0.5*Math.sin(a));
			this.data.push(Math.cos(a+dA),Math.sin(a+dA),0,0,0,-1, 0.5+0.5*Math.cos(a+dA),0.5+0.5*Math.sin(a+dA));
			a += dA;
		}

		for (var i=0; i<=n; i++){
			this.data.push(0,0,1, 0,0,1, 0.5,0.5);
			this.data.push(Math.cos(a),Math.sin(a),1,0,0,1, 0.5+0.5*Math.cos(a),0.5+0.5*Math.sin(a));
			this.data.push(Math.cos(a+dA),Math.sin(a+dA),1,0,0,1, 0.5+0.5*Math.cos(a+dA),0.5+0.5*Math.sin(a+dA));
			a += dA;
		}

		a = 0;
		var nZ = Math.cos(Math.PI/n);
		for (var i=0; i<=n; i++){ 
			var N = [Math.cos(a),Math.sin(a)];
			var M = [Math.cos(a+dA),Math.sin(a+dA)];
			this.data.push(Math.cos(a),Math.sin(a),1,N[0],N[1],0, i/n,1);
			this.data.push(Math.cos(a),Math.sin(a),0,N[0],N[1],0, i/n,0);
			this.data.push(Math.cos(a+dA),Math.sin(a+dA),0,M[0],M[1],0, (i+1)/n,0);
			this.data.push(Math.cos(a+dA),Math.sin(a+dA),1,M[0],M[1],0, (i+1)/n,1);
			this.data.push(Math.cos(a+dA),Math.sin(a+dA),0,M[0],M[1],0, (i+1)/n,0);
			this.data.push(Math.cos(a),Math.sin(a),1,N[0],N[1],0, i/n,1);
			a += dA;
		}
	}

	prism.prototype = app.drawable;

	return prism;

})();
var app = app || {};

app.sphere = (function(){
	
	function sphere(config){
		this.setDrawableProp(config);
		this.typeName = 'sphere';

		var n = config.n || 32;
		n = 2*Math.floor(n/2);
		function dataPush(data,a,b,s,t){
			data.push(
				Math.cos(a)*Math.cos(b),
				Math.sin(a)*Math.cos(b),
				Math.sin(b),
				Math.cos(a)*Math.cos(b),
				Math.sin(a)*Math.cos(b),
				Math.sin(b),
				s, t);
		}
		
		this.data = [];
		
		var b = -Math.PI/2, dB = 2*Math.PI/n;
		for (var bi=0; bi<n/2; bi++){
			var a = 0, dA = 2*Math.PI/n;
			for (var ai=0; ai<=n; ai++){
				dataPush(this.data,a,b,ai/n,bi/(n/2));
				dataPush(this.data,a+dA,b,(ai+1)/n,(bi)/(n/2));
				dataPush(this.data,a+dA,b+dB,(ai+1)/n,(bi+1)/(n/2));

				dataPush(this.data,a+dA,b+dB,(ai+1)/n,(bi+1)/(n/2));
				dataPush(this.data,a,b+dB,ai/n,(bi+1)/(n/2));
				dataPush(this.data,a,b,ai/n,bi/(n/2));
				a += dA;
			}

			b += dB;
		}
	}

	sphere.prototype = app.drawable;

	return sphere;

})();
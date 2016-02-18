var app = app || {};

app.torus = (function(){
	
	var TORUS_MAJOR_SIDES = 50,
		TORUS_MINOR_SIDES = 25;

	function torus(config){
		this.setDrawableProp(config);
		this.typeName = 'torus';

		var R = config.R || 1,
			r = config.r || 0.5;

		function vertex(a,b){
			var x = (R+r*Math.cos(b))*Math.cos(a);
			var y = (R+r*Math.cos(b))*Math.sin(a);
			var z = r*Math.sin(b);
			return [x,y,z];
		}

		function normal(a,b){
			var u = app.vector3.init(-Math.cos(a)*Math.sin(b),-Math.sin(b)*Math.sin(a),Math.cos(b));
			var v = app.vector3.init(-Math.sin(a),Math.cos(a),0);
			return v.cross(u).normalize().raw();
		}
			
		function dataPush(a,b,ai,bi){	
			var p = vertex(a,b);
			var n = normal(a,b);
			me.data.push(p[0],p[1],p[2],n[0],n[1],n[2],ai,bi);
		}
		
		var me = this;
		me.data = [];
		
		var dA = 2*Math.PI/TORUS_MAJOR_SIDES;
		var dB = 2*Math.PI/TORUS_MINOR_SIDES;

		for (var bi=0; bi<TORUS_MINOR_SIDES; bi++){
			var b1 = bi*dB;
			var b2 = (bi+1)*dB;
			
			for (var ai=0; ai<=TORUS_MAJOR_SIDES; ai++){
				var a1 = ai*dA;
				var a2 = (ai+1)*dA;
				dataPush(a1,b1,ai/TORUS_MAJOR_SIDES,bi/TORUS_MINOR_SIDES);
				dataPush(a2,b1,ai/TORUS_MAJOR_SIDES,bi/TORUS_MINOR_SIDES);
				dataPush(a2,b2,ai/TORUS_MAJOR_SIDES,bi/TORUS_MINOR_SIDES);

				dataPush(a2,b2,ai/TORUS_MAJOR_SIDES,bi/TORUS_MINOR_SIDES);
				dataPush(a1,b2,(ai+1)/TORUS_MAJOR_SIDES,(bi+1)/TORUS_MINOR_SIDES);
				dataPush(a1,b1,ai/TORUS_MAJOR_SIDES,bi/TORUS_MINOR_SIDES);
			}
		}
	}

	torus.prototype = app.drawable;

	return torus;

})();
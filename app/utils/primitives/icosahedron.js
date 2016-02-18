var app = app || {};

app.icosahedron = (function(){
	
	function icosahedron(config){
		this.setDrawableProp(config);
		this.typeName = 'icosahedron';

		var me = this;
		me.data = [];
		
		function triangle(p1,p2,p3){
			var u = app.vector3.init(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
			var v = app.vector3.init(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);
			var norm = u.cross(v).normalize();
			me.data.push( p1[0], p1[1], p1[2], norm.x, norm.y, norm.z, 0,0);
			me.data.push( p2[0], p2[1], p2[2], norm.x, norm.y, norm.z, 0,0);
			me.data.push( p3[0], p3[1], p3[2], norm.x, norm.y, norm.z, 0,0);
		}
		
		var f = (1+Math.sqrt(5))/2;

		triangle([ 0, 1, f], [ 1, f, 0], [-1, f, 0]);	// десен горен
		triangle([ 0, 1,-f], [-1, f, 0], [ 1, f, 0]);	// десен долен
		triangle([ 0,-1, f], [-1,-f, 0], [ 1,-f, 0]);	// ляв горен
		triangle([ 0,-1,-f], [ 1,-f, 0], [-1,-f, 0]);	// ляв долен

		triangle([ 1, f, 0], [ f, 0, 1], [ f, 0,-1]);	// предни и задни
		triangle([ 1,-f, 0], [ f, 0,-1], [ f, 0, 1]);
		triangle([-1, f, 0], [-f, 0,-1], [-f, 0, 1]);
		triangle([-1,-f, 0], [-f, 0, 1], [-f, 0,-1]);

		triangle([ f, 0, 1], [ 0, 1, f], [ 0,-1, f]);	// горни и долни
		triangle([-f, 0, 1], [ 0,-1, f], [ 0, 1, f]);
		triangle([ f, 0,-1], [ 0,-1,-f], [ 0, 1,-f]);
		triangle([-f, 0,-1], [ 0, 1,-f], [ 0,-1,-f]);

		triangle([ 0, 1, f], [ f, 0, 1], [ 1, f, 0]);	// горни ъглови 
		triangle([ 0, 1, f], [-1, f, 0], [-f, 0, 1]);
		triangle([ 0,-1, f], [ 1,-f, 0], [ f, 0, 1]); 
		triangle([ 0,-1, f], [-f, 0, 1], [-1,-f, 0]);
		
		triangle([ 0, 1,-f], [ 1, f, 0], [ f, 0,-1]);	// долни ъглови 
		triangle([ 0, 1,-f], [-f, 0,-1], [-1, f, 0]);
		triangle([ 0,-1,-f], [ f, 0,-1], [ 1,-f, 0]); 
		triangle([ 0,-1,-f], [-1,-f, 0], [-f, 0,-1]);
	}

	icosahedron.prototype = app.drawable;

	return icosahedron;

})();

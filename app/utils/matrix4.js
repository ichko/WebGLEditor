var app = app || {};

app.matrix4 = (function(){

	function matrix4(config){
		this.mat = [];
		this.changed = false;
		this.identity();
	}

	// Interface

	matrix4.prototype = {
		identity: identity,
		translate: translate,
		scale: scale,
		xRotate: xRotate,
		yRotate: yRotate,
		zRotate: zRotate,

		perspMatrix: perspMatrix,
		viewMatrix: viewMatrix,

		cloneMatrix: cloneMatrix
	};


	// Transformations

	function identity(){
		this.changed = true;
		this.mat = new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
	}

	function translate(v){
		this.changed = true;
		this.mat[12] += this.mat[0]*v[0]+this.mat[4]*v[1]+this.mat[8]*v[2];
		this.mat[13] += this.mat[1]*v[0]+this.mat[5]*v[1]+this.mat[9]*v[2];
		this.mat[14] += this.mat[2]*v[0]+this.mat[6]*v[1]+this.mat[10]*v[2];
	}

	function scale(v){
		this.changed = true;
		this.mat[0] *= v[0];
		this.mat[1] *= v[0];
		this.mat[2] *= v[0];

		this.mat[4] *= v[1];
		this.mat[5] *= v[1];
		this.mat[6] *= v[1];

		this.mat[8] *= v[2];
		this.mat[9] *= v[2];
		this.mat[10] *= v[2];
	}

	function xRotate(a){
		this.changed = true;

		var s = Math.sin(a);
		var c = Math.cos(a);
		
		a = this.mat[4]*s+this.mat[8]*c;
		this.mat[4]=this.mat[4]*c-this.mat[8]*s;
		this.mat[8]=a;
		
		a = this.mat[5]*s+this.mat[9]*c;
		this.mat[5]=this.mat[5]*c-this.mat[9]*s;
		this.mat[9]=a;
		
		a = this.mat[6]*s+this.mat[10]*c;
		this.mat[6]=this.mat[6]*c-this.mat[10]*s;
		this.mat[10]=a;
	}

	function yRotate(a){
		this.changed = true;

		var s = Math.sin(a);
		var c = Math.cos(a);
		
		a = this.mat[0]*s+this.mat[8]*c;
		this.mat[0]=this.mat[0]*c-this.mat[8]*s;
		this.mat[8]=a;
		
		a = this.mat[1]*s+this.mat[9]*c;
		this.mat[1]=this.mat[1]*c-this.mat[9]*s;
		this.mat[9]=a;
		
		a = this.mat[2]*s+this.mat[10]*c;
		this.mat[2]=this.mat[2]*c-this.mat[10]*s;
		this.mat[10]=a;
	}

	function zRotate(a){
		this.changed = true;

		var s = Math.sin(a);
		var c = Math.cos(a);
		
		a = this.mat[0]*s+this.mat[4]*c;
		this.mat[0]=this.mat[0]*c-this.mat[4]*s;
		this.mat[4]=a;
		
		a = this.mat[1]*s+this.mat[5]*c;
		this.mat[1]=this.mat[1]*c-this.mat[5]*s;
		this.mat[5]=a;
		
		a = this.mat[2]*s+this.mat[6]*c;
		this.mat[2]=this.mat[2]*c-this.mat[6]*s;
		this.mat[6]=a;
	}


	// Projections

	function perspMatrix(angle, aspect, near, far){
		var fov = 1 / Math.tan(angle / 2);
		var matrix = [
			fov/aspect, 0, 0, 0,
			0, fov, 0, 0,
			0, 0, (far+near)/(near-far), -1,
			0, 0, 2.0*near*far/(near-far), 0];
		this.mat = matrix;
	}

	function viewMatrix(poz, focus, up){
		var z = unitVector(vectorPoints(poz, focus));
		var x = unitVector(vectorProduct(up, z));
		var y = unitVector(vectorProduct(z, x));

		var matrix = [
			x[0], y[0], z[0], 0,
			x[1], y[1], z[1], 0,
			x[2], y[2], z[2], 0,
			-scalarProduct(x, poz),
			-scalarProduct(y, poz),
			-scalarProduct(z, poz), 1];
		this.mat = matrix;
	};

	function vectorPoints(x, y){
		return [ x[0]-y[0], x[1]-y[1], x[2]-y[2] ];
	}
	
	function vectorProduct(x, y){
		return [
			x[1]*y[2]-x[2]*y[1],
			x[2]*y[0]-x[0]*y[2],
			x[0]*y[1]-x[1]*y[0] ];
	}

	function unitVector(x){
		var len = 1/Math.sqrt( x[0]*x[0]+x[1]*x[1]+x[2]*x[2] );
		return [ len*x[0], len*x[1], len*x[2] ];
	}

	function scalarProduct(x, y){
		return x[0]*y[0] + x[1]*y[1] + x[2]*y[2];
	}

	function multiplyMatrix(a, b){
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
			a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
			var out=[];

		var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3];  
		out[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		out[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		out[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		out[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

		b0 = b[4]; b1 = b[5]; b2 = b[6]; b3 = b[7];
		out[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		out[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		out[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		out[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

		b0 = b[8]; b1 = b[9]; b2 = b[10]; b3 = b[11];
		out[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		out[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		out[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		out[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

		b0 = b[12]; b1 = b[13]; b2 = b[14]; b3 = b[15];
		out[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
		out[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
		out[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
		out[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

		var result =  new matrix4();
		result.mat = out;

		return result;
	};

	function calculateNormalMatrix(a){
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11],
			a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15],

			b00 = a00 * a11 - a01 * a10,
			b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10,
			b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11,
			b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30,
			b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30,
			b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31,
			b11 = a22 * a33 - a23 * a32,

			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

		det = 1.0 / det;

		var out=[];
		out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
		out[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
		out[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
		out[3] = 0;
		
		out[4] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
		out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
		out[6] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
		out[7] = 0;

		out[8] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
		out[9] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
		out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
		out[11] = 0;
		
		out[12] = 0;
		out[13] = 0;
		out[14] = 0;
		out[15] = 1;

		var result = new matrix4();
		result.mat = out;

		return result;
	};		


	function cloneMatrix(){
		var result = new Float32Array(this.mat.length);
		result.set(this.mat);
		return result;
	}


	return {
		init: function(config){
			return new matrix4(config);
		},
		multiplyMatrix: multiplyMatrix,
		calculateNormalMatrix: calculateNormalMatrix
	};

})();
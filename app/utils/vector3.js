var app = app || {};

app.vector3 = (function(){
	
	function vector3(config){
		this.x = config.x || 0;
		this.y = config.y || 0;
		this.z = config.z || 0;
	}

	vector3.prototype = {
		add: add,
		reverse: reverse,
		subtract: subtract,
		scalar: scalar,
		normalize: normalize,
		length: length,
		raw: raw,
		cross: cross,
		isZero: isZero,
		distance: distance
	};

	function scalar(n){
		return init(this.x * n, this.y * n, this.z * n);
	}

	function add(vector){
		return init(this.x + vector.x, this.y + vector.y, this.z + vector.z);
	}

	function normalize(){
		return this.scalar(1 / this.length());
	}

	function length(){
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	}

	function reverse(){
		return init(-this.x , -this.y, -this.z);
	}

	function subtract(vector){
		return this.add(vector.reverse());
	}

	function raw(){
		return [this.x, this.y, this.z];
	}


	function init(x, y, z){
		return new vector3({x: x, y: y, z: z});
	}

	function cross(vector) {
        return init(determ(this.y, this.z, vector.y, vector.z),
                    determ(this.z, this.x, vector.z, vector.x),
                    determ(this.x, this.y, vector.x, vector.y));
    }

    function distance(vector){
    	return this.subtract(vector).length();
    }

	function isZero() {
        return this.x == 0 && this.y == 0 && this.z == 0;
    }

    function determ(a, b, c, d){
        return a * d - b * c;
    }

	return {
		init: init,
		fromObject: function(config){
			return new vector3(config || {});
		}
	};

})();
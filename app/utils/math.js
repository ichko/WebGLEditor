var app = app || {};

app.math = (function(){

	function rotationalMatrix(u, angle){
        var c = Math.cos(angle);
        var s = Math.sin(angle);

        var a00 = c + u.x * u.x * (1 - c);
        var a01 = u.x * u.y * (1 - c) - u.z * s;
        var a02 = u.x * u.z * (1 - c) + u.y * s;

        var a10 = u.y * u.x * (1 - c) + u.z * s;
        var a11 = c + u.y * u.y * (1 - c);
        var a12 = u.y * u.z * (1 - c) - u.x * s;

        var a20 = u.z * u.x * (1 - c) - u.y * s;
        var a21 = u.z * u.y * (1 - c) + u.x * s;
        var a22 = c + u.z * u.z * (1 - c);

        return [a00, a01, a02, a10, a11, a12, a20, a21, a22];
	}

	function transform(mat, v) {
        var result = app.vector3.init();
        result.x = mat[0] * v.x + mat[1] * v.y + mat[2] * v.z;
        result.y = mat[3] * v.x + mat[4] * v.y + mat[5] * v.z;
        result.z = mat[6] * v.x + mat[7] * v.y + mat[8] * v.z;

        return result;
    }

	function rotate(axis, init, angle){
        return transform(rotationalMatrix(axis, angle), init);
    }


    // Code from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    function componentToHex(c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    function rgbToHex(r, g, b) {
        return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
    }

    function hexToRgb(hex) {
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
	
	return {
		rotate: rotate,
        rgbToHex: rgbToHex,
        hexToRgb: hexToRgb
	};

})();
var app = app || {};

app.requester = (function () {

	var state = {
		ready: 4,
		okCode: 200
	}
	
	function Requester(baseUrl){
		this.baseUrl = baseUrl || '';
	}

	Requester.prototype = {
		makeRequest: makeRequest,
		get: get,
		post: post
	};

	function get(serviceUrl, success, error) {
        var headers = getHeaders();
        var url = this.baseUrl + serviceUrl;

        return makeRequest('GET',url, headers, null, success, error);
    }

	function post(serviceUrl, data, success, error) {
        var headers = getHeaders();
        var url = this.baseUrl + serviceUrl;

        return makeRequest('POST',url, headers, data, success, error);
    }

	function makeRequest(method, url, headers, data, success, error){
		var xhttp = new XMLHttpRequest();
		xhttp.open(method, url, true);

		for(headerKey in headers)
			xhttp.setRequestHeader(headerKey, headers[headerKey]);
		
		xhttp.onreadystatechange = function() {
			if(xhttp.readyState == state.ready && xhttp.status == state.okCode)
				success(xhttp.responseText);
			else if(xhttp.readyState == state.ready && xhttp.status != state.okCode){
				if(error)
					error(xhttp);
				else
					throw new Error(xhttp.statusText);
			}
		};

		xhttp.send();
	}

	function getHeaders() {
        var headers = {
            'Content-Type': 'application/json'
        };

        return headers;
    }

    return {
    	init: function (baseUrl) {
    		return new Requester(baseUrl);
    	}
    };

})();
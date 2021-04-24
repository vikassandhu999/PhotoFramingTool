const API = 'https://api.photoframe.com';

function getDataFromApi(type , cb) {
	const onError = () => {
		cb("error");
	}

	const onSuccess = (response) => {
		 if (!$.isEmptyObject(response) ) {
                 cb(response.data);
          } 
        cb("error");
	}

	browseGet(`product/${type}/sizes` , onError, onSuccess);	 
}


function browsePost(url ,data ,onError ,onSuccess) {
	 const options = {
            url: API+"/"+url,
            type: 'post',
            data: data , 
            contentType: false,
            processData: false,
            error: onError , 
            success: onSuccess , 
      }
	 $.ajax(options);
}

function browseGet(url ,onError ,onSuccess) {
	 const options = {
            url: API+"/"+url,
            type: 'get',
            error: onError , 
            success: onSuccess , 
      }
	 $.ajax(options);
}
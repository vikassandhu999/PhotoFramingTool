var railOptions = ['upload' , 'layout' , 'size' , 'frame' , 'options'];


// Bug : target might be inner child element
// function selectOption(e) {
// 	let id = e.target.id;
// 	id = id.split('-')[1];
// 	selectOptionWithId(id);
// }

function selectOptionWithId(id) {
	if(id) {
		railOptions.forEach((cid) => {
			if(id === cid)  {
			    $('#op-'+cid+'-btn').addClass('active-rail');
			} else {
				$('#op-'+cid+'-btn').removeClass('active-rail');
			}
		});
	}
}


function setLoader(time) {
	$("#loader").css({ display : 'flex' });
	if(time) {
		setTimeout(() => {
			$('#loader').css({display : 'none'});
		} , time);
	}
}

function rmLoader() {
			$('#loader').css({display : 'none'});
}

(function() {

	$('#nav-close-button').click(() => {
		$('#nav-drawer-0').css({left : '-500px'});
		$('#full-display-overlay').css( { display : 'none' });
	});

	$('#nav-open-button').click(() => {
		$('#nav-drawer-0').css({left : 0});
		$('#full-display-overlay').css( { display : 'block' });
	});

	railOptions.forEach((id) => { 
		$(`#op-${id}-btn , #op-${id}-btn >`).click(() => selectOptionWithId(id));
	});

	selectOptionWithId(railOptions[0]);
}())
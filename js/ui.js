var railOptions = ['upload' , 'specs' , 'border' , 'art' , 'options'];


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
			    $('#'+cid+'-contents').css({display : 'block'});
			} else {
				$('#op-'+cid+'-btn').removeClass('active-rail');
				$('#'+cid+'-contents').css({display : 'none'});
			}
		});
	}
}


function openModal(id) {
	setOverlay();
	$(id).show();
}

function rmModal(id) {
	$(id).hide();
	rmOverlay();
}

function setOverlay() {
		$('#full-display-overlay').css( { display : 'block' });
}


function rmOverlay() {
		$('#full-display-overlay').css( { display : 'none' });
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
	setTimeout(() => {
			$('#loader').css({display : 'none'});
	},500);
}

$('.toggle').click(function(e) {
  	e.preventDefault();
  
    var $this = $(this);

    if($this.children('i').hasClass('fa-rotate-270')) {
    	$this.children('i').removeClass('fa-rotate-270');
 
	} else {
	    $this.children('i').addClass('fa-rotate-270');
	}
  
    if ($this.next().hasClass('show')) {
        $this.next().removeClass('show');
        $this.next().slideUp(50);
    } else {
        // $this.parent().parent().find('li .inner').removeClass('show');
        // $this.parent().parent().find('li .inner').slideUp(50);
        $this.next().toggleClass('show');
        $this.next().slideToggle(50);
    }
});

(function() {

	$('#nav-close-button').click(() => {
		$('#nav-drawer-0').css({left : '-500px'});
		rmOverlay();
	});

	$('#nav-open-button').click(() => {
		$('#nav-drawer-0').css({left : 0});
		setOverlay();
	});

	railOptions.forEach((id) => { 
		$(`#op-${id}-btn , #op-${id}-btn >`).click(() => selectOptionWithId(id));
	});

	selectOptionWithId(railOptions[0]);
}())
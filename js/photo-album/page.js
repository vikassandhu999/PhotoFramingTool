function Dual(data, Super, context) {
	this.state = {
		startsAt : 0 , 
		canvases : {} , 
		layouts : []  ,  
		isStreched : false , 
	}

	this.walkAndUpdate = () => {

	}

	this.walkAndExtractData = () => {

	}

	this.renderWithData = () => {

	}


	this.applyPageLayout = () => {
		if(isStreched) {
			let layout = this.state.layouts[0] , 
			this.applyLayout(0 , layout);
		} else {
			let layouts = this.state.layouts;
			this.applyLayout(0 , layouts[0]);
			this.applyLayout(50 , layouts[1]);
		}
	}


	this.clear = () => {

	}

	this.applyLayout = (leftStart) => {

	}


	this.deleteMe = (id) => {
		delete this.state.canvases['id']; 
		$('canvas-'+id).remove();
	}
 
	this.extractData = () => {

	}
}


function Canvas(data, Super, context) {
	this.state = {
		canvas : null , 
		imageUrl : null , 
		objects : [] , 
		id : data.id , 
		width : data.width , 
		height : data.height , 
		top : data.top , 
		left : data.left , 
		right : data.right , 
		bottom: data.bottom , 
		padding : data.padding ,
		isSelected : false ,  
	}

	this.init = () => {
		let state = this.state;

		state.canvas = new Fabric.Canvas({backgroundColor : '#ffffff'});

		if(!state.canvases) {
			console.log("Enable to create the canvas");
			alert("Unable to create the layout please, refresh the page");
			return;
		}


		this.render();
	}
 
	this.update = () => {

	}


	this.render = () => {
		this.template = `
					<div id = "container-${this.id}" class = "canvas-container">
						<div class = "wrapper-container">
							<canvas id = "canvas-${this.id}"></canvas>
						</div>
						<div id = "tool-${this.id}" class = "canvas-tool-tip">

						</div>
					</div>
		`;

	}


	this.deleteImage = () => {

	}

	this.deleteMe = () => {
		Super.deleteCanvas(this.id);
	}
}
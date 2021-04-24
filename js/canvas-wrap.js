/**
	Written By: Vikas
*/

var data = {
	sizes : [ [6,8] , [8,6] , [8,8] , [8,12] , [10,10] , [10,12] , [11,14] , [12,12] , [12,15] , [12,18] , [16,20] , [16,24] , [20,24] , [20,30] , [30,20]]
}



function PrintTool(isFill ,FillData) {
	
	/** State of the tool */
	this.state = {
		type: 'canvas_wrap' , 
		productType: 'canvas' , 
		calculatedPrice: 0 ,
		priceList: [], 
		jsonData: '' , 
		defaultImageUrl: '' , 
		windowWidth: $(window).width() , 
        wrapWidth: 0.75,
		pxPerInch: 10 ,
		maxWidthRatio: 60 , 
        finalWidth: 0 , 
        finalHeight: 0 ,
        sizeX: 12 , 
        sizeY: 20 ,
	}


	/** Context of the tool */
	this.context = {
        mainDiv: '#main-container' ,
        mainDivWrapper: '#canvas-preview', 
        sizes: [] ,
        currentSize: [12,16],
        options: [], 
        instance: null , 
	}

	/** Data to load canvas from old data */
	this.fillData = FillData;


	/** 
		@function() Constructor 
	*/
	this.init = () => {
		let context = this.context, state = this.state;
		/** get data for the product from api */
		// getDataFromApi(context.type , (data) => { 
		// 	if(data == 'error') {
		// 		return;
		// 	}

			context.sizes = data.sizes;

			this.onWindowResize();

			this.render();

			if(isFill) {
				// TODO: create instance with preloaded data
			} else {
				// create instance with default data
			}

			context.instance = new CanvasWrap(state,context);
			context.instance.init();

		// });

		this.subscribeToEvents();
	}

	/**
		@function Subscribes to the DOM events listners
	*/
	this.subscribeToEvents = () => {
		let context = this.context , state = this.state;

		$(window).resize(this.onWindowResize);

		$(document).on('click' , '#size-select > li' , (e) => {
                let $this = $(e.currentTarget);
                $this.addClass("selected").siblings().removeClass("selected");
	            this.onSizeSelect($(e.currentTarget).attr('value'));
	    });

        $('#wrap-width > li').click(context.instance.changeBorderLine);

		$(document).on('change' , '#image-upload' , this.onImageAdd) ;

        $(document).on('dragstart' , '.draggable-image' , (e) => {
            e.originalEvent.dataTransfer.setData("text", e.target.id);
        });        

        $('#toggle-orientation').click(() => this.changeOrientation());

		$('#open-modal3d').click(() => this.open3DView());
		$('#open-modalroom').click(() => this.openRoomView());
        $('#open-imageupload').click(() => this.openImageUpload());
		$('#open-editpopup').click(() => this.popUpToEdit());


		$('#close-modal3d').click(() => rmModal('#modal3d'));
		$('#close-modalroom').click(() => rmModal('#modalroom'));
        $('#close-imageupload').click(() => rmModal('#imageupload'));
		$('#close-editpopup').click(() => rmModal('#editpopup'));

		$('#add-tocart').click(() => this.addToCart());
	}



	this.addToCart = () => {
		let state = this.state , context = this.context;

		let jsonDataString = JSON.stringify(context.instance.extractData());
        let cart = {
            type :  state.type,
            productType : state.productType , 
            calculatedPrice : state.calculatedPrice ,
            dimensions : state.sizeX+'x'+state.sizeY ,  
            jsonData : jsonDataString , 
            options : '' , 
        };
        console.log({cart});
	}



	/**
		@function popUpToEdit
	*/
	this.popUpToEdit = () => {
		openModal('#editpopup');
		tbi();
	}

    this.openImageUpload = () => {
        openModal('#imageupload');
        tbi();
    }


    /**
		@function roomView
	*/
	this.openRoomView = () => {
		setLoader();
		openModal('#modalroom');	
		if(this.context.instance)
			this.context.instance.openRoomView();	
	}


    /**
		@function 3DView
	*/
	this.open3DView = () => {
		setLoader();
		openModal('#modal3d');
		if(this.context.instance)
			this.context.instance.open3DView();
	}



	/**
		eventHandlers
	*/
    this.onSizeSelect = (size) => {
        let Size = size.split('x');
        this.state.sizeX = parseInt(Size[0]);
        this.state.sizeY = parseInt(Size[1]);
        this.onWindowResize();
    }


    this.onWindowResize = () => {
        this.calculateMaxSizeRatio();
        this.calculateScale();
        this.calculateFinalDimensions();
        if(this.context.instance)
        	this.context.instance.onResize();
    }


    this.onImageAdd = (e) => {
        e.preventDefault();
        
        let formData = new FormData();
        var files = e.target.files[0];
        formData.append('image',files);
        setLoader();


        // $.ajax({
        //     url: '<url>',
        //     type: 'post',
        //     data: formData,
        //     contentType: false,
        //     processData: false,
        //     error: function (xhr, ajaxOptions, thrownError) {
        //         rmLoader();
        //        // alert('Error While Uplaoding the image');
        //     },
        //     success: function(jsonReply) {
        //         if (!$j.isEmptyObject(jsonReply) ) {
        //             if(jsonReply.imageUrl) {
        //               insertImageElement(jsonReply.imageUrl);
        //             }
        //         } else {
        //             alert('Server Error, Unable to upload image');
        //         }
        //         rmLoader();
        //     }

        // });

        let reader = new FileReader();
        reader.onload = (f) => {
            let data = f.target.result;
            insertImageElement(data);
        }
        reader.readAsDataURL(files);
        rmLoader();

    }



    this.onImageDelete = () => {
    	tbi();
    }

    /** 
    	Calculations
    */
    
    /** Calculate maxWidthRatio for different screen sizes */
    this.calculateMaxSizeRatio = () => {
        let state = this.state;
        let deviceWidth = state.windowWidth = $(window).width();

        /* add breakpoints */
        if(deviceWidth <=360) {
            state.maxWidthRatio = 80;
        } else if(deviceWidth <=960) {
            state.maxWidthRatio = 50;
        } else if(deviceWidth <=1440){
            state.maxWidthRatio = 30;
        } else {
            state.maxWidthRatio = 30;
        }
    }

    this.changeOrientation = () => {
        let state = this.state;
        let temp = state.sizeX;
        if(temp === state.sizeY)
            return;

        state.sizeX = state.sizeY;
        state.sizeY = temp;
        this.onWindowResize();
    }

    /** Calcuate Scale (pxPerInch) */
    this.calculateScale = () => {
        let state = this.state ;
        let realWidth = $('.edit-area').width() - 160;
        let realHieght = $(window).height() - 280; //(state.maxWidthRatio * state.windowWidth) / 100;

        if(realWidth <= realHieght) {
            if( (realWidth / state.sizeX) * state.sizeY <=realHieght) {
                state.pxPerInch =  realWidth / state.sizeX;
            } else {
                state.pxPerInch = realWidth / state.sizeY;
            }
        } else {
            if((realHieght / state.sizeY) * state.sizeX <=realWidth) {
                state.pxPerInch =  realHieght / state.sizeY;
            } else {
                state.pxPerInch = realHieght / state.sizeX;
            }
        }
    }

    this.calculateFinalDimensions = () => {
        let state = this.state;
        state.finalWidth = state.pxPerInch * state.sizeX;
        state.finalHeight = state.pxPerInch * state.sizeY;
        console.log({ width : state.finalWidth , height : state.finalHeight});
    }



	/** Render content into the DOM */

	this.render = () => {
		this.renderSizes();
		this.renderBorders();
		this.renderOptions();
	}

	
	this.renderSizes = () => {
	   let sizes = this.context.sizes, elements = "";

       for (let i = 0; i <=  sizes.length - 1; i++) {
            let factor = 120 / ( (sizes[i][0] > sizes[i][1]) ? sizes[i][0] : sizes[i][1] );
            elements += `
                <li value = "${sizes[i][0]}x${sizes[i][1]}">
                    <span class = "square" value = "${sizes[i][0]}x${sizes[i][1]}" style = "height:${sizes[i][1] * factor}px;width:${sizes[i][0] * factor}px;">
                       
                    </span>
                    <span class="name">${sizes[i][0]}x${sizes[i][1]}</span>
                    <span class="price">Free</span>
                </li>
            `;
       }
        $('#size-select').html(elements);
	}

	this.renderBorders = () => {
		tbi();
	}

	this.renderOptions = () => {
		tbi();
	}

}

// Helpers
function tbi() {
	console.log("To Be Implemented...");
}
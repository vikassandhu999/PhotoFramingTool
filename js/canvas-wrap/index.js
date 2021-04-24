/** 
    CanvasType : SinglePrint , 
    ProductType : [Canvas , Acrylic , Metal , Wood] , 

*/
function CanvasWrap(Super , context) {
	this.state = {
		canvases : [] , 
		imageUrls : [] , 
		borderArea : 0 ,
        imageWrapArea : 0 , 
		borderLine : 0.75 , // 0.75 , 1.5 , 0
		borderType : 'wrap' , //wrap , mirror , color
        borderColor : '#ffffff' , 
		commonId :  1 , 
		jsonData : null ,
        currentImage : null , 
        toolId : 0 , 
        scaleFactor: 0 ,
        filter: 'original' ,  
	}
	

	/** Initialize Object */
	this.init = () => {
		$(context.mainDiv).html('');
		this.calculateBorderArea();
		this.createCanvas();
		this.attachEvents();
	}

	/** Event Handlers */
    this.onResize = () => {
    	this.calculateBorderArea();
    	this.resizeCanvas();
    }



	/** Create Canvas in DOM and fabric canvas */
	this.createCanvas = () => {
        let state = this.state;

        if(state.borderType == 'wrap') {
            state.imageWrapArea = state.borderArea;
        }

        let canvasElement = "";
        canvasElement += `
            <div id = "canvas_container_${state.commonId}" class = "canvas-container single-print-main-canvas-container"
            >
                  <canvas id = "canvas_${state.commonId}"
                    class = "main-canvas"
                  ></canvas>
            </div>
        `;


        let toggleOr = `
            <div class = "container-tool sh" style = "right : -${state.borderArea + 80}px;">
                <a href = "#" class = "tool" id = "toggle-orientation"><i class="fal fa-random"></i>
                <span>Orientation</span>
                </a>
            </div>
            <div class = "indicator ind-t"></div>
            <div class = "indicator ind-r"></div>
            <div class = "indicator ind-b"></div>
            <div class = "indicator ind-l"></div>

        `
     
        $(context.mainDiv).width(Super.finalWidth);
        $(context.mainDiv).height(Super.finalHeight);
        $(context.mainDiv).append(canvasElement);
        $(context.mainDiv).append(toggleOr);

        state.canvases.push(new fabric.Canvas("canvas_" + state.commonId, {selection: false, backgroundColor: 'white'}));
        this.addEffectElements();
        this.applyFilter();
        this.applyBorders();
    }

    this.addEffectElements = () => {

          let state = this.state;
        let sideCanvasTemplate = `
              <div id = "canvas_container_top_${state.commonId}" class ="canvas-container border-canvas-container"
                style=" height: ${state.borderArea + ""}px;
                        width: 100%;
                        top : -${state.borderArea+ ""}px;
                        left : 0;
                        right : 0;
                    "
            >
                  <canvas id = "canvas_top_${state.commonId}"
                    class = "border-canvas"
                  ></canvas>
            </div>
            
            <div id = "canvas_container_right_${state.commonId}"  class = "canvas-container border-canvas-container"
               style="  height: 100%;
                        width: ${state.borderArea + ""}px;
                        top : 0;
                        bottom: 0;
                        right : -${state.borderArea + ""}px;"
            >
                  <canvas id = "canvas_right_${state.commonId}"
                    class = "border-canvas"
                  ></canvas>
            </div>
            
            <div id = "canvas_container_bottom_${state.commonId}"  class = "canvas-container border-canvas-container"
                   style="   height: ${state.borderArea + ""}px;
                             width: 100%;
                             bottom : -${state.borderArea + ""}px;
                             left : 0;
                             right : 0;"
            >
                  <canvas id = "canvas_bottom_${state.commonId}"
                    class = "border-canvas"
                  ></canvas>
            </div>
            
    
            <div id = "canvas_container_left_${state.commonId}"  class = "canvas-container border-canvas-container"
                  style="   height: 100%;
                            width: ${state.borderArea + ""}px;
                            top : 0;
                            bottom: 0;
                            left : -${state.borderArea + ""}px;"
            >
                  <canvas id = "canvas_left_${state.commonId}" 
                    class = "border-canvas"
                  ></canvas>
            </div>
        `;

            $(context.mainDiv).append(sideCanvasTemplate);

            let list = ['top', 'right', 'bottom', 'left'];

            state.canvases = [state.canvases[0]];

            list.forEach((value => {
                state.canvases.push(new fabric.Canvas(`canvas_${value}_${state.commonId}`, {selection: false , backgroundColor: 'white'}));
            }));

            this.setCanvasDimensions();
    }
    
                                                                                                                                                                                                                              
      
    this.calculateBorderArea = () => {
    	this.state.borderArea = 36 * this.state.borderLine; 
    }


    this.changeBorderLine = (e) => {
        let $this = $(e.currentTarget);
        $this.addClass("selected").siblings().removeClass("selected");
        this.state.borderLine = parseFloat($(e.currentTarget).attr('value'));
        console.log(this.state.borderLine);
        this.onResize();
    }

    this.setCanvasDimensions = () => {
    	let state = this.state;
    	state.canvases[0].setWidth(Super.finalWidth);
        state.canvases[0].setHeight(Super.finalHeight);
        if(state.canvases[1]) {
            state.canvases[1].setWidth(Super.finalWidth);
            state.canvases[1].setHeight(state.borderArea);
        }
        if(state.canvases[2]) {
            state.canvases[2].setWidth(state.borderArea);
            state.canvases[2].setHeight(Super.finalHeight);
        }

        if(state.canvases[3]) {
            state.canvases[3].setWidth(Super.finalWidth);
            state.canvases[3].setHeight(state.borderArea);
        }

        if(state.canvases[4]) {
            state.canvases[4].setWidth(state.borderArea);
            state.canvases[4].setHeight(Super.finalHeight);
        }
        
    }  

    this.resizeCanvas = () => {
        setLoader();

    	let state = this.state;

    	$(context.mainDiv).width(Super.finalWidth);
        $(context.mainDiv).height(Super.finalHeight);
        $('#canvas-preview').css({padding : state.borderArea+"px"});

        $('#box-'+state.toolId).css({top:'-'+(state.borderArea+80)+'px'});
        $('.container-tool').css({right:'-'+(state.borderArea+80)+'px'});

        this.setCanvasDimensions();
        this.applyBorders();
        if(state.imageUrls[0]) {
            this.addImageObject(state.imageUrls[0]);
        }
   
        $("#canvas_container_top_1").css({ top : `-${state.borderArea}px` , height : `${state.borderArea}px` });
        $("#canvas_container_right_1").css({ right : `-${state.borderArea}px` , width : `${state.borderArea}px` });
        $("#canvas_container_bottom_1").css({ bottom : `-${state.borderArea}px` , height : `${state.borderArea}px` });
        $("#canvas_container_left_1").css({ left : `-${state.borderArea}px` , width : `${state.borderArea}px` });

        rmLoader();
    }


    this.addImageObject = (data) => {
    	let state = this.state;

        this.removeOldObject();
        $(`#box-${state.toolId}`).remove();


	    fabric.Image.fromURL(data, (img) => {
	          let scaleFactor , 
	              lock = {x : false , y : false , req : false} , 
	              ratioOfHeight , 
	              ratioOfWidth;

	              if(state.borderType == 'wrap') {
	              	 ratioOfHeight = img.height / (Super.finalHeight + 2 * state.imageWrapArea);
	              	 ratioOfWidth = img.width / (Super.finalWidth + 2* state.imageWrapArea);
	              } else {
	              	 ratioOfHeight = img.height / (Super.finalHeight);
	              	 ratioOfWidth = img.width / (Super.finalWidth);
	              }

	          if (ratioOfHeight >= ratioOfWidth) {
	                  scaleFactor =  1/ratioOfWidth;
	                  lock.x = true;
	          } else {
	                  scaleFactor = 1/ratioOfHeight;
	                  lock.y = true;
	          }

	          state.scaleFactor = scaleFactor;
	      
	          img.set({
	              perPixelTargetFind: true,
	              originX: 'left', 
	              originY: 'top',
	              scaleX: scaleFactor,
	              scaleY: scaleFactor , 
	              id : 'image' , 
	              lockScalingX : true ,
	              lockScalingY : true , 
	              lockMovementX : lock.x && lock.req,
	              lockMovementY : lock.y && lock.req,  
	              lockRotation:true,
	              hasBorders:false,
	              hasControls:false ,
	          });

	          state.canvases[0].add(img);
	          state.canvases[0].sendBackwards(img);
	          img.center();
	          img.centerV();
	          img.centerH();
	          state.canvases[0].renderAll();
              
              this.applyFilter();
              this.applyBorders();
              this.createToolBox();
	    });
    }


    this.addTextInCanvas = () => {
        let state = this.state;

        let randNumber = (new Date()).getTime() + Math.floor(Math.random() * 1000) , 
        text = "Hello World";


        var textAlignValue = $(".text-align a").hasClass('active') ? $(".text-align a.active").attr("alignment") : 'center';
        var fontWeightValue = $(".font-style a span[id ='textBold']").parent('a').hasClass('active') ? 'bold' : 'normal';
        var fontStyleValue = $(".font-style a span[id ='textItalic']").parent('a').hasClass('active') ? 'italic' : 'normal';
        var textDecorationValue = ($(".font-style a span[id ='textOveline']").parent('a').hasClass('active')) ? 'line-through' :
        ($(".font-style a span[id ='textUnderline']").parent('a').hasClass('active')) ? 'underline' : 'normal';



         if (state.currentText == null) {

                text = new fabric.Text("Hello Worl", {
                    left: 100,
                    top: 100,
                    opacity: 1,
                    // fontFamily: $("#textFontFamily").val(),
                    // fontSize: $("#textFontSize").val(),
                    cornerSize: 15,
                    textAlign: textAlignValue,
                    fontWeight: fontWeightValue,
                    fontStyle: fontStyleValue,
                    textDecoration: textDecorationValue,
                    fill: '#000000',
                    textCounter: randNumber,
                });
        }
        else {
                state.currentText.setText($("#text2").val());
        }

         if(state.canvases[0]){
                if (state.currentText == null ) {
                    state.currentText = text;
                    state.canvases[0].add(text);
                    text.center();
                    text.setCoords();
                }
                state.canvases[0].setActiveObject(current.option.currentObject);
        }

    }

    this.applyBorders = () => {
            if(this.state.borderType == 'mirror') {
                this.state.imageWrapArea = 0 ;
                this.applyMirrorEffect(this.state.canvases[0]);
            }
            else if(this.state.borderType == 'wrap') {
                this.state.imageWrapArea = this.state.borderArea;
                this.applyImageWrap(this.state.canvases[0]);
            } else if(this.state.borderType == 'color') {
                this.state.imageWrapArea = 0 ;
                this.applyColorFill(this.state.canvases[0]);
            }
    }

    this.removeOldObject = () => {
    	let state = this.state;

        let oldObject = this.getObjectById(state.canvases[0] , 'image' , 'image');
        if(oldObject) {

        	state.canvases[0].remove(oldObject);
        	state.canvases[0].renderAll();
        }
    }

    this.attachEvents = () => {
        let state = this.state ;


        $('#border-select > li').click((e) => {
            setLoader();
            let $this = $(e.currentTarget);
            $this.addClass("selected").siblings().removeClass("selected");
            let borderType = $(e.currentTarget).attr('value');
            state.borderType = borderType;
            if(state.borderType == 'wrap') {
                state.imageWrapArea = state.borderArea;
            }

            if(state.imageUrls[0]) {
                this.addImageObject(state.imageUrls[0]);
            }

            if(state.borderType == 'color') {
                this.openColorPicker();
            } else {
               this.applyBorders();
            }

            rmLoader();
        });


         $('#filter-select > li').click((e) => {
            setLoader();
            let $this = $(e.currentTarget);
                $this.addClass("selected").siblings().removeClass("selected");
            let filterType = $(e.currentTarget).attr('value');
            state.filter = filterType;
            this.applyFilter();
            this.applyBorders();
            rmLoader();
        });

    	$(document).on('drop' , '#canvas_container_1' , (e) => {
              setLoader();
    		  e.preventDefault();
			  var data = e.originalEvent.dataTransfer.getData("text");
			  let imgUrl = $("#"+data).attr('src');
			  this.state.imageUrls = [];
			  this.state.imageUrls.push(imgUrl);
			  this.addImageObject(imgUrl);
              rmLoader();
    	});

    	$(document).on('dragover' , '#canvas_container_1' , (e) => {
    		e.preventDefault();
    	});

    	state.canvases[0].on('object:moving' , this.mainFrameMove);
    }



    this.openColorPicker = () => {

        let state = this.state;

        $('#color-picker').spectrum({
                // color: currentColor,
                showInput: true,
                className: 'full-spectrum',
                flat: false,
                showInitial: true,
                showPalette: true,
                showSelectionPalette: true,
                maxSelectionSize: 10,
                preferredFormat: "hex",
                localStorageKey: "spectrum.demo",
                colorPaletteWidth: '36px',
                colorPaletteHeight: '36px',
                colorPaletteMargin: '0px 9px 0px 0px',
                move: (color) => {
                       state.borderColor = color.toHexString();
                       this.applyBorders();
                },
                show: (color) => {
                        let currentColor = state.borderColor;
                        this.applyBorders();
                        $('#color-picker').spectrum("set", currentColor);
                },
                beforeShow: function () {

                },
                hide: function () {
                    let currentColor = state.borderColor;
                    $('#color-picker').spectrum("set", currentColor);
                },
                change: (color) => {
                      state.borderColor = color.toHexString();
                      this.applyBorders();
                },
                choose: (color) => {
                       state.borderColor = color.toHexString();
                       this.applyBorders();
                },
                cancel: (color) => {
                     $('#color-picker').spectrum("hide");
                },
                palette: [
                    ["rgb(0, 0, 0)", "rgb(67, 67, 67)", "rgb(102, 102, 102)",
                        "rgb(204, 204, 204)", "rgb(217, 217, 217)", "rgb(255, 255, 255)"],
                    ["rgb(152, 0, 0)", "rgb(255, 0, 0)", "rgb(255, 153, 0)", "rgb(255, 255, 0)", "rgb(0, 255, 0)",
                        "rgb(0, 255, 255)", "rgb(74, 134, 232)", "rgb(0, 0, 255)", "rgb(153, 0, 255)", "rgb(255, 0, 255)"],
                    ["rgb(230, 184, 175)", "rgb(244, 204, 204)", "rgb(252, 229, 205)", "rgb(255, 242, 204)", "rgb(217, 234, 211)",
                        "rgb(208, 224, 227)", "rgb(201, 218, 248)", "rgb(207, 226, 243)", "rgb(217, 210, 233)", "rgb(234, 209, 220)",
                        "rgb(221, 126, 107)", "rgb(234, 153, 153)", "rgb(249, 203, 156)", "rgb(255, 229, 153)", "rgb(182, 215, 168)",
                        "rgb(162, 196, 201)", "rgb(164, 194, 244)", "rgb(159, 197, 232)", "rgb(180, 167, 214)", "rgb(213, 166, 189)",
                        "rgb(204, 65, 37)", "rgb(224, 102, 102)", "rgb(246, 178, 107)", "rgb(255, 217, 102)", "rgb(147, 196, 125)",
                        "rgb(118, 165, 175)", "rgb(109, 158, 235)", "rgb(111, 168, 220)", "rgb(142, 124, 195)", "rgb(194, 123, 160)",
                        "rgb(166, 28, 0)", "rgb(204, 0, 0)", "rgb(230, 145, 56)", "rgb(241, 194, 50)", "rgb(106, 168, 79)",
                        "rgb(69, 129, 142)", "rgb(60, 120, 216)", "rgb(61, 133, 198)", "rgb(103, 78, 167)", "rgb(166, 77, 121)",
                        "rgb(91, 15, 0)", "rgb(102, 0, 0)", "rgb(120, 63, 4)", "rgb(127, 96, 0)", "rgb(39, 78, 19)",
                        "rgb(12, 52, 61)", "rgb(28, 69, 135)", "rgb(7, 55, 99)", "rgb(32, 18, 77)", "rgb(76, 17, 48)"]
                ]
            });

    
        setTimeout(() => {  
                $("#color-picker").spectrum("show");
        } , 400);
    }
    

    this.mainFrameMove = (e) => {
       let state = this.state;

        if(e.target.id!='image')
            return


            if (e.target.angle == 90) {
                if (e.target.left < (e.target.canvas.width + state.imageWrapArea )) {
                    e.target.left = (e.target.canvas.width + state.imageWrapArea );
                } else {
                    var diffLeft = e.target.left - ((e.target.height * e.target.scaleY) - state.imageWrapArea );
                    if (diffLeft > 0) {
                        e.target.left = ((e.target.height * e.target.scaleY) - state.imageWrapArea );
                    }
                }

                if (e.target.top > (0 - state.imageWrapArea )) {
                    e.target.top = (0 - state.imageWrapArea );
                }

                if (e.target.top < (0 - state.imageWrapArea ) ) {
                    var objHeight = e.target.width * e.target.scaleX;
                    var topDiff = objHeight + e.target.top;

                    if (topDiff < (e.target.canvas.height + state.imageWrapArea )) {
                        e.target.top = (e.target.canvas.height + state.imageWrapArea) - objHeight;
                        e.target.canvas.renderAll();
                    }
                }
                e.target.canvas.renderAll();
            } else if (e.target.angle == 180) {
                if (e.target.left < (e.target.canvas.width + state.imageWrapArea ) ) {
                    e.target.left = (e.target.canvas.width + state.imageWrapArea );
                } else {
                    var diffLeft = e.target.left - ((e.target.width * e.target.scaleX) - state.imageWrapArea );
                    if (diffLeft > 0) {
                        e.target.left = ((e.target.width * e.target.scaleX) - state.imageWrapArea );
                    }
                }

                if (e.target.top < (e.target.canvas.height + state.imageWrapArea ) ) {
                    e.target.top = (e.target.canvas.height + state.imageWrapArea);
                } else {
                    var diffTop = e.target.top - ((e.target.height * e.target.scaleY) - state.imageWrapArea);
                    if (diffTop > 0) {
                        e.target.top = ((e.target.height * e.target.scaleY) - state.imageWrapArea );
                    }
                }
            } else if (e.target.angle == 270) {
                if (e.target.left > (0-state.imageWrapArea )) {
                    e.target.left = (0-state.imageWrapArea );
                } else if ( (e.target.left + (e.target.height * e.target.scaleY)) < (e.target.canvas.width + state.imageWrapArea ) ) {
                    e.target.left = ((e.target.canvas.width + state.imageWrapArea ) - (e.target.height * e.target.scaleY));
                }

                if (e.target.top < (e.target.canvas.height + state.imageWrapArea )) {
                    e.target.top = (e.target.canvas.height + state.imageWrapArea );
                } else {
                    var diffTop = e.target.top - ((e.target.width * e.target.scaleX) - state.imageWrapArea );
                    if (diffTop > 0) {
                        e.target.top = ((e.target.width * e.target.scaleX) - state.imageWrapArea );
                    }
                }
            } else if (e.target.angle == 0) {
                if (e.target.left > (0 - state.imageWrapArea) || e.target.top > (0 - state.imageWrapArea ) ) {
                    if (e.target.left > (0 - state.imageWrapArea )) {
                        e.target.set({left:(0 - state.imageWrapArea )});
                    }

                    if (e.target.top > (0 - state.imageWrapArea )) {
                        e.target.set({top:(0 - state.imageWrapArea )});
                    }
                    e.target.canvas.renderAll();
                }

                if (e.target.left < (0 - state.imageWrapArea )) {
                    var objWidth = e.target.width * e.target.scaleX;
                    var leftDiff = objWidth + e.target.left;

                    if (leftDiff < (e.target.canvas.width + state.imageWrapArea )) {
                        e.target.left =  (e.target.canvas.width + state.imageWrapArea) - objWidth;
                        e.target.canvas.renderAll();
                    }
                }

                if (e.target.top < (0 - state.imageWrapArea)) {
                    var objHeight = e.target.height * e.target.scaleY;
                    var topDiff = objHeight + e.target.top;

                    if (topDiff < (e.target.canvas.height + state.imageWrapArea )) {
                        e.target.top =  (e.target.canvas.height + state.imageWrapArea) - objHeight;
                        e.target.canvas.renderAll();
                    }
                }
            }
       
       this.applyBorders();
    }

    
    this.zoomIn = () => {
    	let imgObject = this.getObjectById(this.state.canvases[0] , 'image' , 'image');

    	let currentScale = imgObject.scaleX;
    	console.log(currentScale);
    	if(currentScale + 0.1 > this.state.scaleFactor * 3) {
    		return;
    	}
    	imgObject.set({ scaleX : currentScale + 0.1 });
    	imgObject.set({ scaleY : currentScale + 0.1 });
		 imgObject.center();
	     imgObject.centerV();
	     imgObject.centerH();
    	this.state.canvases[0].renderAll();
    	this.applyBorders();
    }

    this.zoomOut = () => {
    	let imgObject = this.getObjectById(this.state.canvases[0] , 'image' , 'image');

    	let currentScale = imgObject.scaleX;
    	console.log(currentScale);
    	if(currentScale - 0.1 < this.state.scaleFactor) {
    		return;
    	}
    	imgObject.set({ scaleX : currentScale - 0.1 });
    	imgObject.set({ scaleY : currentScale - 0.1 });
    	imgObject.center();
	    imgObject.centerV();
	    imgObject.centerH();
    	this.state.canvases[0].renderAll();
    	this.applyBorders();
    }

    this.rotate = () => {
    	let imgObject = this.getObjectById(this.state.canvases[0] , 'image' , 'image');
    	let nextAngle = imgObject.angle + 90;
    	if(nextAngle == 360) 
    		nextAngle = 0;

    	imgObject.set({angle : nextAngle});
    	  imgObject.center();
	      imgObject.centerV();
	      imgObject.centerH();
    	this.state.canvases[0].renderAll();
    	this.applyBorders();
    }

    this.flipX = () => {
        let imgObject = this.getObjectById(this.state.canvases[0] , 'image' , 'image');
          imgObject.set({ flipX : !imgObject.flipX});
          imgObject.center();
          imgObject.centerV();
          imgObject.centerH();
        this.state.canvases[0].renderAll();
        this.applyBorders();
    }


    this.flipY = () => {
        let imgObject = this.getObjectById(this.state.canvases[0] , 'image' , 'image');
          imgObject.set({ flipY : !imgObject.flipY});
          imgObject.center();
          imgObject.centerV();
          imgObject.centerH();
        this.state.canvases[0].renderAll();
        this.applyBorders();
    }

    this.delete = () => {
    	this.state.imageUrls = [];
    	this.removeOldObject();
        $(`#box-${this.state.toolId}`).remove();
    	this.state.canvases[0].renderAll();
    	this.applyBorders();
    }



    this.applyFilter = (newFilter) => {
            //Sideeffect : resizeds the image
            let state = this.state;

            let canvas = state.canvases[0] , 
                imgObject = this.getObjectById(state.canvases[0] , 'image' , 'image');

            if(!imgObject)
              return;

            if(newFilter) {
              state.filter = newFilter;
            }

            let filters = [];

            switch(state.filter) {
                case 'original':
                    imgObject.applyFilters(filters);
                    break;

                case 'sepia':
                    let sepia = new fabric.Image.filters.Sepia();
                    filters.push(sepia);
                    imgObject.applyFilters(filters);
                    break;

                case 'grayscale':
                    let grayscale = new fabric.Image.filters.Grayscale();
                    filters.push(grayscale);
                    imgObject.applyFilters(filters);
                    break;
            }
            canvas.renderAll();
    }


    this.applyMirrorEffect = (canvas , event) => {
	 	if(!canvas) 
	 		return;

	 	let canvases = this.state.canvases , 
	 		borderArea = this.state.borderArea;


        canvases[1].clear();
        canvases[1].renderAll();
        canvases[2].clear();
        canvases[2].renderAll();
        canvases[3].clear();
        canvases[3].renderAll();
        canvases[4].clear();
        canvases[4].renderAll();

	 	let context = canvas.getContext('2d');
	 	
	 	if(canvases[1]) {
	 	    let context_top = document.getElementById(`canvas_top_1`).getContext('2d');
	 		let imageData = context.getImageData(0, 0, canvas.lowerCanvasEl.width ,  borderArea);
            context_top.putImageData(imageData, 0, 0);
	 		let top_box = document.getElementById('canvas_container_top_1');
	 		top_box.style['-moz-transform'] = 'scale(1, -1)';
            top_box.style['-webkit-transform'] = 'scale(1, -1)';
            top_box.style['-o-transform'] = 'scale(1, -1)';
            top_box.style['transorm'] = 'scale(1, -1)';
	 	}


	 	if(canvases[2]) {
	 		let context_right = document.getElementById(`canvas_right_1`).getContext('2d');
	 		let imageData = context.getImageData(canvas.lowerCanvasEl.width - borderArea, 0, borderArea,canvas.lowerCanvasEl.height);
	 		context_right.putImageData(imageData, 0, 0);
	 		let right_box = document.getElementById('canvas_container_right_1');
	 		right_box.style['-moz-transform'] = 'scale(-1, 1)';
            right_box.style['-webkit-transform'] = 'scale(-1, 1)';
            right_box.style['-o-transform'] = 'scale(-1, 1)';
            right_box.style['transorm'] = 'scale(-1, 1)';
	 	}

	 	if(canvases[3]) {
            let context_bottom = document.getElementById(`canvas_bottom_1`).getContext('2d');
	 		let imageData = context.getImageData(0, canvas.lowerCanvasEl.height - borderArea,canvas.lowerCanvasEl.width,borderArea);
	 		context_bottom.putImageData(imageData, 0, 0);
	 		let bottom_box = document.getElementById('canvas_container_bottom_1');
	 		bottom_box.style['-moz-transform'] = 'scale(1, -1)';
            bottom_box.style['-webkit-transform'] = 'scale(1, -1)';
            bottom_box.style['-o-transform'] = 'scale(1, -1)';
            bottom_box.style['transorm'] = 'scale(1, -1)';
	 	}

	 	if(canvases[4]) {
            let context_left = document.getElementById(`canvas_left_1`).getContext('2d');
	 		let imageData = context.getImageData(0, 0, borderArea,canvas.lowerCanvasEl.height);
	 		context_left.putImageData(imageData, 0, 0);
	 		let left_box = document.getElementById('canvas_container_left_1');
	 		left_box.style['-moz-transform'] = 'scale(-1, 1)';
            left_box.style['-webkit-transform'] = 'scale(-1, 1)';
            left_box.style['-o-transform'] = 'scale(-1, 1)';
            left_box.style['transorm'] = 'scale(-1, 1)';
	 	}
	 }

     this.applyImageWrap = (canvas) => {
        if(!canvas) 
            return;

        let canvases = this.state.canvases , 
            borderArea = this.state.borderArea;

        let imgElement = this.getObjectById(canvases[0] , 'image' , 'image');
        canvases[1].clear();
        canvases[1].renderAll();
        canvases[2].clear();
        canvases[2].renderAll();
        canvases[3].clear();
        canvases[3].renderAll();
        canvases[4].clear();
        canvases[4].renderAll();
        
        if(!imgElement)
            return


        if(canvases[1]) {
        
            let topImgElement = fabric.util.object.clone(imgElement);
            topImgElement.set({lockMovementX : true , lockMovementY : true});
            topImgElement.top = imgElement.top + borderArea;
            canvases[1].add(topImgElement);
            canvases[1].renderAll();

            let top_box = document.getElementById('canvas_container_top_1');
            top_box.style['-moz-transform'] = 'scale(1, 1)';
            top_box.style['-webkit-transform'] = 'scale(1, 1)';
            top_box.style['-o-transform'] = 'scale(1, 1)';
            top_box.style['transorm'] = 'scale(1, 1)';
        }


        if(canvases[2]) {

            let rightImgElement = fabric.util.object.clone(imgElement);
            rightImgElement.set({lockMovementX : true , lockMovementY : true});
            rightImgElement.left = imgElement.left - canvases[0].width;
            canvases[2].add(rightImgElement);
            canvases[2].renderAll();

            let right_box = document.getElementById('canvas_container_right_1');
            right_box.style['-moz-transform'] = 'scale(1, 1)';
            right_box.style['-webkit-transform'] = 'scale(1, 1)';
            right_box.style['-o-transform'] = 'scale(1, 1)';
            right_box.style['transorm'] = 'scale(1, 1)';
        }

        if(canvases[3]) {

            let bottomImgElement = fabric.util.object.clone(imgElement);
            bottomImgElement.set({lockMovementX : true , lockMovementY : true});
            bottomImgElement.top = imgElement.top - canvases[0].height;
            canvases[3].add(bottomImgElement);
            canvases[3].renderAll();
            let bottom_box = document.getElementById('canvas_container_bottom_1');
            bottom_box.style['-moz-transform'] = 'scale(1, 1)';
            bottom_box.style['-webkit-transform'] = 'scale(1, 1)';
            bottom_box.style['-o-transform'] = 'scale(1, 1)';
            bottom_box.style['transorm'] = 'scale(1, 1)';
        }

        if(canvases[4]) {

            let leftImgElement = fabric.util.object.clone(imgElement);
            leftImgElement.set({lockMovementX : true , lockMovementY : true});
            leftImgElement.left = imgElement.left + borderArea;
            canvases[4].add(leftImgElement);
            canvases[4].renderAll();

            let left_box = document.getElementById('canvas_container_left_1');
            left_box.style['-moz-transform'] = 'scale(1, 1)';
            left_box.style['-webkit-transform'] = 'scale(1, 1)';
            left_box.style['-o-transform'] = 'scale(1, 1)';
            left_box.style['transorm'] = 'scale(1, 1)';
        }
                  
     }


      this.applyColorFill = (canvas) => {
        if(!canvas) 
            return;

        let canvases = this.state.canvases , 
            borderArea = this.state.borderArea;

      
        if(canvases[1]) {
            canvases[1].clear();
            canvases[1].backgroundColor = this.state.borderColor;
            canvases[1].renderAll();
        }


        if(canvases[2]) {
            canvases[2].clear();
            canvases[2].backgroundColor = this.state.borderColor;
            canvases[2].renderAll();
          
        }

        if(canvases[3]) {
            canvases[3].clear();
            canvases[3].backgroundColor = this.state.borderColor;
            canvases[3].renderAll();

        }

        if(canvases[4]) {
            canvases[4].clear();
            canvases[4].backgroundColor = this.state.borderColor;
            canvases[4].renderAll();
        }
                  
     }



     this.openRoomView = () => {
           let roomViewTemplate = `
                   <div id = "room_view_content" class="room-view-content">
                        <img class = 'room_view_image' style = "width:${$(window).width()}px;height:${$(window).height()}px;"src = "./media/room_view.jpg"/>
                    </div>`;

                    //canvas-preview
            $("#modal-wrapper-room").html(roomViewTemplate);

                setTimeout(() => {

                let base = 160;
                let scale = 0;

                if(Super.sizeY > Super.sizeX) {
                    scale = (base / Super.finalHeight);
                } else {
                    scale = (base / Super.finalWidth);
                }

                let left = $('#room_view_content').width() / 3;

                let height = Math.round((Super.finalHeight) * scale);
                let width = Math.round((Super.finalWidth) * scale);


               html2canvas($(context.mainDiv), {
                    timeout : 600,
                    onrendered: function (canhtml) {
                        var previewDataUrl = canhtml.toDataURL("image/jpg");
                      
                       $("#room_view_content").append(`<img class = 'print_canvas_image sh' style = 'left : ${left}px;height : ${height}px; width : ${width}px;'  src='${previewDataUrl}' />`);
                    }
                });
               rmLoader();

            } , 1000);
     }


     this.open3DView = () => {
        let state = this.state;
        let instrcution = `
            <ul class="instructions-3d">
                <li>Zoom In</li>
                <li>Zoom Out</li>
                <li>Hold Click to Move</li>
            </ul>
        `;
        setTimeout(() => {
            let perWidth = 700;
            let perHeight = 500;
            let windowWidth = $(window).width();
            let windowHeight = $(window).height();
            let canvasWidth = Super.finalWidth;
            let canvasHeight = Super.finalHeight;
            let borderArea = state.borderArea;

            THREE.ImageUtils.crossOrigin = '';

            let frontImageURL = state.canvases[0].toDataURL();
            let leftImageURL = state.canvases[4].lowerCanvasEl.toDataURL();
            let topImageURL =  state.canvases[1].lowerCanvasEl.toDataURL();
            let rightImageURL = state.canvases[2].lowerCanvasEl.toDataURL();
            let bottomImageURL = state.canvases[3].lowerCanvasEl.toDataURL();

            let loader = new THREE.TextureLoader();

            let frontImage = loader.load(frontImageURL);
            let leftImage = loader.load(leftImageURL);
            let topImage =  loader.load(topImageURL);
            let rightImage = loader.load(rightImageURL);
            let bottomImage = loader.load(bottomImageURL);

 
        
            let cubeMaterial = [
                new THREE.MeshBasicMaterial({
                    map: rightImage
                }),
                new THREE.MeshBasicMaterial({
                     map: leftImage
                }),
                new THREE.MeshBasicMaterial({
                      map: topImage
                }),
                new THREE.MeshBasicMaterial({
                      map: bottomImage
                }),
                new THREE.MeshBasicMaterial({
                      map: frontImage
                }),
                new THREE.MeshBasicMaterial({
                     map: frontImage 
                })
            ];

            let scene = new THREE.Scene();
            scene.background = new THREE.Color( 0xdcdcdc );
            let camera = new THREE.PerspectiveCamera(75, windowWidth/windowHeight, 1, 10000);

            let renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(windowWidth, windowHeight);
            $('#modal-wrapper-3d').html(renderer.domElement);
            
            let controls = new THREE.OrbitControls(camera, renderer.domElement);

            let geometry = new THREE.BoxGeometry(canvasWidth , canvasHeight, borderArea);
            let material = new THREE.MeshBasicMaterial({color: 0xfffff, wireframe: true});
            let cube = new THREE.Mesh(geometry, cubeMaterial);
            scene.add(cube);

            camera.position.z = 700;           
            function render() {
                requestAnimationFrame(render);
                controls.update();
                renderer.render(scene, camera);
            };

            render();

            rmLoader();
        },500);
     }


     this.openForEdit = () => {
        openModal('#editpopup');
     }

 
    this.getObjectById = (canvas, type , id) => {
		  const canvasObject = (canvas) ? canvas.getObjects(type).filter((item) => {
          return item.id === id;
	      }) : undefined;
	      return (canvasObject && canvasObject[0]) ? canvasObject[0] : null;
    }

    this.createToolBox = () => {
    	let state = this.state;
    	state.toolId = Math.floor(Math.random()*10);
    	let template = `
    		<div id = "box-${state.toolId}" class = "tool-box" style = "top : -${state.borderArea + 60}px;">
    			<div class = "tool-wrapper sh">
	    			<a class = "tool" href = "#" id = "tzoom-in"><i class="fal fa-search-plus"></i>
                        <span>Zoom In</span>
                    </a>
	    			<a class = "tool" href = "#" id = "tzoom-out"><i class="fal fa-search-minus"></i>
                        <span>Zoom Out</span>
                    </a>
	    			<a class = "tool" href = "#" id = "trotate"><i class="fal fa-redo"></i>
                          <span>Rotate</span>
                    </a>
                    <a class = "tool" href = "#" id = "tflipy"><i class="fal fa-arrows-v"></i>
                          <span>Flip V</span>
                    </a>
                    <a class = "tool" href = "#" id = "tflipx"><i class="fal fa-arrows-h"></i>
                          <span>Flip H</span>
                    </a>
	    			<a class = "tool" href = "#" id = "tdelete"><i class="fal fa-trash-alt"></i>
                          <span>Delete</span>
                    </a>
    			</div>
    		</div>
    	`;

    	$(context.mainDiv).append(template);

    	setTimeout(()=>{
    		$('#tzoom-in').click(this.zoomIn);
    		$('#tzoom-out').click(this.zoomOut);
            $('#tflipy').click(this.flipY);
            $('#tflipx').click(this.flipX);
    		$('#trotate').click(this.rotate);
    		$('#tdelete').click(this.delete);
    	},200);
    }

    this.extractData = () => {
        let state = this.state;
        let canvases = [];

       state.canvases.forEach((c) => {
            canvases.push({ canvasSVG : state.canvases[0].toSVG() });
       });

        return {
            canvases : canvases , 
            imageUrl : state.imageUrls[0] , 
            borderType : state.borderType , 
            borderArea : state.borderArea ,
            borderLine : state.borderLine , 
            frame : '' , 
        }
    }
}

//https://stackoverflow.com/questions/42950341/when-mouseover-hover-on-object-the-mouse-cursor-should-change-three-js


//Helpers
function insertImageElement(imageUrl) {
    let number = Date.now() + Math.floor(Math.random() * 10000);
    let iuid = "img-"+ number;
    let imageTemplate = `
        <div id = "box-${number}"> 
            <img draggable="true" class = "draggable-image" id = ${iuid} src = ${imageUrl} alt = "Image Content"/>
            <a href = "#" id = "delete-${number}"><i id = "delett-${number}" class="fas fa-times"></i></a>
        </div>
    `;
    $('#draggable-container').append(imageTemplate);
    setTimeout(()=> { 
        $(`#delete-${number}`).click((e) => {
         $('#box-'+ e.currentTarget.id.substring(7)).remove();
        }
    )
    }
    ,100);
    $('#image-upload').files = null;
}


//Helpers
function deleteImageElement(id) {
   $('#'+id).remove();
}


// function createMirrorImage( image ) {
//         // use the image, e.g. draw part of it on a canvas
//         var canvas = document.createElement( 'canvas' );
//         var context = canvas.getContext( '2d' );
//         context.scale(-1, 1);
//         context.drawImage( image, 100, 100 );
//         // context.drawImage(v, 0, 0, width*-1, height);
//         context.restore();
//         context.save();

// }


/*
           var current = this;
            var image = current.option.createdCanvases[0].toDataURL();
            var leftImage = current.option.createdCanvases[1].lowerCanvasEl.toDataURL();
            var topImage =  current.option.createdCanvases[2].lowerCanvasEl.toDataURL();
            var rightImage = current.option.createdCanvases[3].lowerCanvasEl.toDataURL();
            var bottomImage = current.option.createdCanvases[4].lowerCanvasEl.toDataURL();
            var productHeight = current.option.productHeight;
            var productWidth = current.option.productWidth;
            var canvaswrap = current.option.canvaswrap;
            var returnimage = "";
            returnimage = current.generate360View(image,leftImage,topImage,rightImage,bottomImage,$(el).attr("id"),productHeight,productWidth,canvaswrap);
            current.setOptionData(current.option, current.general);
*/


// THREE.ImageUtils.crossOrigin = '';

// let frontImageURL = state.canvases[0].toDataURL();
// let leftImageURL = state.canvases[1].toDataURL();
// let topImageURL =  state.canvases[2].toDataURL();
// let rightImageURL = state.canvases[3].toDataURL();
// let bottomImageURL = state.canvases[4].toDataURL();

// let frontImage = THREE.ImageUtils.loadTexture(frontImageURL);
// let leftImage = THREE.ImageUtils.loadTexture(leftImageURL);
// let topImage =  THREE.ImageUtils.loadTexture(topImageURL);
// let rightImage = THREE.ImageUtils.loadTexture(rightImageURL);
// let bottomImage = THREE.ImageUtils.loadTexture(bottomImageURL);

// frontImage.anisotropy  = renderer.getMaxAnisotropy();
// leftImage.anisotropy  = renderer.getMaxAnisotropy();
// topImage.anisotropy  = renderer.getMaxAnisotropy();
// rightImage.anisotropy  = renderer.getMaxAnisotropy();
// bottomImage.anisotropy  = renderer.getMaxAnisotropy();

// var cubeMaterial = [
//     new THREE.MeshBasicMaterial({
//         map: leftImage
//     }),
//     new THREE.MeshBasicMaterial({
//          map: rightImage
//     }),
//     new THREE.MeshBasicMaterial({
//           map: topImage
//     }),
//     new THREE.MeshBasicMaterial({
//           map: bottomImage
//     }),
//     new THREE.MeshBasicMaterial({
//           map: frontImage
//     }),
//     new THREE.MeshBasicMaterial({
//          map: frontImage 
//     })
// ];

// var cubegeometry = new THREE.CubeGeometry(1,1,1);                          
// let  cube = new THREE.Mesh(cubegeometry, cubeMaterials);                   
// group.add( cube );  


/*
texture.anisotropy = renderer.getMaxAnisotropy();

var cubeMaterial = [
    new THREE.MeshBasicMaterial({
        map: texture //left
    }),
    new THREE.MeshBasicMaterial({
        color: 'orange' //right
    }),
    new THREE.MeshBasicMaterial({
        color: 'green' // top
    }),
    new THREE.MeshBasicMaterial({
        color: 'blue' // bottom
    }),
    new THREE.MeshBasicMaterial({
        color: 'pink' // front
    }),
    new THREE.MeshBasicMaterial({
        color: 'yellow' //back
    })
];
*/
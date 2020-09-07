/** 
    CanvasType : SinglePrint , 
    ProductType : [Canvas , Acrylic , Metal , Wood] , 

    TODO : add Frame
*/
function SinglePrint(general , mainDiv) {
	this.general = general;
	this.config = {
		canvases : [] , 
		imageUrls : [] , 
		borderArea : 0 , 
		borderLine : 0.75 , // 0.75 , 1.5 , 0
		borderType : 'mirror' , //wrap , mirror , none
		commonId :  1 , 
		jsonData : null ,
	}
	

	/** Initialize Object */
	this.Init = () => {
		$(mainDiv).html('');
		this.calculateBorderArea();
		this.createCanvas();
		this.attachEvents();
		//this.applyMirrorEffect();
	}

	/** Event Handlers */

    this.onResize = () => {
    	this.calculateBorderArea();
    	this.resizeCanvas();
    }



	/** Create Canvas in DOM and fabric canvas */
	this.createCanvas = () => {
        let args = this.config , 
        	argv = this.general;

        let canvasElement = "";
        canvasElement += `
            <div id = "canvas_container_${args.commonId}" class = "canvas-container single-print-main-canvas-container"
            >
                  <canvas id = "canvas_${args.commonId}"
                    class = "main-canvas"
                  ></canvas>
            </div>
            
            <div id = "canvas_container_top_${args.commonId}" class ="canvas-container border-canvas-container"
                style=" height: ${args.borderArea + ""}px;
                        width: 100%;
                        top : -${args.borderArea+ ""}px;
                        left : 0;
                        right : 0;"
            >
                  <canvas id = "canvas_top_${args.commonId}"
                    class = "border-canvas"
                  ></canvas>
            </div>
            
            <div id = "canvas_container_right_${args.commonId}"  class = "canvas-container border-canvas-container"
               style="  height: 100%;
                        width: ${args.borderArea + ""}px;
                        top : 0;
                        bottom: 0;
                        right : -${args.borderArea + ""}px;"
            >
                  <canvas id = "canvas_right_${args.commonId}"
                    class = "border-canvas"
                  ></canvas>
            </div>
            
            <div id = "canvas_container_bottom_${args.commonId}"  class = "canvas-container border-canvas-container"
                   style="   height: ${args.borderArea + ""}px;
                             width: 100%;
                             bottom : -${args.borderArea + ""}px;
                             left : 0;
                             right : 0;"
            >
                  <canvas id = "canvas_bottom_${args.commonId}"
                    class = "border-canvas"
                  ></canvas>
            </div>
            
    
            <div id = "canvas_container_left_${args.commonId}"  class = "canvas-container border-canvas-container"
                  style="   height: 100%;
                            width: ${args.borderArea + ""}px;
                            top : 0;
                            bottom: 0;
                            left : -${args.borderArea + ""}px;"
            >
                  <canvas id = "canvas_left_${args.commonId}" let args = this.config , 
        	argv = this.general;
                    class = "border-canvas"
                  ></canvas>
            </div>
        `;
     
        $(mainDiv).width(argv.finalWidth);
        $(mainDiv).height(argv.finalHeight);
        $(mainDiv).append(canvasElement);

       // $('#canvas_container_1').css({ border : '1px solid white' });

        args.canvases.push(new fabric.Canvas("canvas_" + args.commonId, {selection: false, backgroundColor: 'white'}));
        let list = ['top', 'right', 'bottom', 'left'];
        list.forEach((value => {
            args.canvases.push(new fabric.Canvas(`canvas_${value}_${args.commonId}`, {selection: false , backgroundColor: 'white'}));
        }));

        this.setCanvasDimensions();
    }
      
    this.calculateBorderArea = () => {
    	let args = this.config , argv = this.general;
    	args.borderArea = argv.pxPerInch * args.borderLine; 
    }


    this.setCanvasDimensions = () => {
    	let args = this.config , 
        	argv = this.general;
    	args.canvases[0].setWidth(argv.finalWidth);
        args.canvases[0].setHeight(argv.finalHeight);

        args.canvases[1].setWidth(argv.finalWidth);
        args.canvases[1].setHeight(args.borderArea);

        args.canvases[2].setWidth(args.borderArea);
        args.canvases[2].setHeight(argv.finalHeight);

        args.canvases[3].setWidth(argv.finalWidth);
        args.canvases[3].setHeight(args.borderArea);

        args.canvases[4].setWidth(args.borderArea);
        args.canvases[4].setHeight(argv.finalHeight);
    }  

    this.resizeCanvas = () => {
    	let args = this.config , 
        	argv = this.general;

    	$(mainDiv).width(argv.finalWidth);
        $(mainDiv).height(argv.finalHeight);
        $("#canvas_container_top_1").css({ top : `-${args.borderArea}px` , height : `${args.borderArea}px` });
        $("#canvas_container_right_1").css({ right : `-${args.borderArea}px` , width : `${args.borderArea}px` });
        $("#canvas_container_bottom_1").css({ bottom : `-${args.borderArea}px` , height : `${args.borderArea}px` });
        $("#canvas_container_left_1").css({ left : `-${args.borderArea}px` , width : `${args.borderArea}px` });
        if(args.imageUrls[0]) {
            this.addImageObject(args.imageUrls[0]);
        }
        this.setCanvasDimensions();
       	this.applyMirrorEffect();
    }


    this.addImageObject = (data) => {
    	let args = this.config , 
        	argv = this.general;

        this.removeOldObject();

	    fabric.Image.fromURL(data, (img) => {
	          let scaleFactor , 
	              lock = {x : false , y : false , req : true} , 
	              ratioOfHeight , 
	              ratioOfWidth;

	              if(args.borderType == 'wrap') {
	              	 ratioOfHeight = img.height / (argv.finalHeight + args.borderArea);
	              	 ratioOfWidth = img.width / (argv.finalWidth + args.borderArea);
	              	 lock.req = false;
	              } else {
	              	 ratioOfHeight = img.height / (argv.finalHeight);
	              	 ratioOfWidth = img.width / (argv.finalWidth);
	              	 lock.req = true;
	              }

	          if (ratioOfHeight >= ratioOfWidth) {
	                  scaleFactor =  1/ratioOfWidth;
	                  lock.x = true;
	          } else {
	                  scaleFactor = 1/ratioOfHeight;
	                  lock.y = true;
	          }
	      
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

	          args.canvases[0].add(img);
	          args.canvases[0].sendBackwards(img);
	          img.center();
	          img.centerV();
	          img.centerH();
	          args.canvases[0].renderAll();
	          this.applyMirrorEffect(args.canvases[0] , "start");
	    });
    }


    this.removeOldObject = () => {
    	let args = this.config , 
        	argv = this.general;

        let oldObject = this.getObjectById(args.canvases[0] , 'image' , 'image');
        if(oldObject) {
        	args.canvases[0].remove(oldObject);
        }
    }

    this.attachEvents = () => {
        let args = this.config , 
    	argv = this.general;

    	$(document).on('drop' , '#canvas_container_1' , (e) => {
    		  e.preventDefault();
			  var data = e.originalEvent.dataTransfer.getData("text");
			  let imgUrl = $("#"+data).attr('src');
			  this.config.imageUrls = [];
			  this.config.imageUrls.push(imgUrl);
			  this.addImageObject(imgUrl);
    	});

    	$(document).on('dragover' , '#canvas_container_1' , (e) => {
    		e.preventDefault();
    	});


    	args.canvases[0].on('object:moving' , this.mainFrameMove);
    }
    

    this.mainFrameMove = (e) => {
        let obj = e.target;
        if(obj.id!='image')
        	return
       let canvas = obj.canvas;
        let objWidth = obj.width*obj.scaleX , 
        objHeight = obj.height*obj.scaleY , 
        top = obj.top , 
        left = obj.left;

        let canWidth = canvas.width;
       let diffW = Math.abs(objWidth - canWidth);
       (left < -diffW) ? obj.set('left' , -diffW) : null;
       (left > 0) ? obj.set('left' , 0) : null;

       let canHeight = canvas.height;
       let diffH = Math.abs(objHeight - canHeight);
       (top < -diffH) ? obj.set('top' , -diffH) : null;
       (top > 0) ? obj.set('top' , 0) : null;

       this.applyMirrorEffect(canvas , 'move');
    }


    this.applyMirrorEffect = (canvas , event) => {
	 	if(!canvas) 
	 		return;

	 	let canvases = this.config.canvases , 
	 		borderArea = this.config.borderArea;


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

    this.getObjectById = (canvas, type , id) => {
		  const canvasObject = (canvas) ? canvas.getObjects(type).filter((item) => {
          return item.id === id;
	      }) : undefined;
	      return (canvasObject && canvasObject[0]) ? canvasObject[0] : null;
    }


    this.extractData = () => {
        let canvases = [] , config = this.config;

        config.canvases.forEach((c) => {
            canvases.push({ canvasSVG : c.toSvg() });
        });

        return {
            canvases : canvases , 
            imageUrl : config.imageUrls[0] , 
            borderType : config.borderType , 
            borderArea : config.borderArea ,
            borderLine : config.borderLine , 
            frame : '' , 
        }
    }
}
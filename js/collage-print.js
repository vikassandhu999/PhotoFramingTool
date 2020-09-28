/** 
    CanvasType : CollagePrint , 
    ProductType : [Canvas , Acrylic , Metal] ,     
*/
function CollagePrint(general , mainDiv) {
	this.general = general;
	this.config = {
		canvases : [] , 
		imageUrls : [] , 
        layout : [{ top : 0 , left : 0 , width : 50 , height : 50 } , { top : 0 , left : 50 , width : 50 , height : 50 } , { top : 50 , left : 0 , width : 50 , height : 50 } ,  { top : 50 , left : 50 , width : 50 , height : 50 }] , 
		borderArea : 6 , 
		commonId :  1 , 
		jsonData : null ,
	}
	

    console.log("Object : " , general);

	/** Initialize Object */
	this.Init = () => {
		$(mainDiv).html('');
		this.createCanvas();
	}


	/** Create Canvas in DOM and fabric canvas */
	this.createCanvas = () => {
        let args = this.config , 
        	argv = this.general;

        $(mainDiv).width(argv.finalWidth);
        $(mainDiv).height(argv.finalHeight);
        this.applyLayout();        
    }

    this.changeLayout = (newLayout) => {
        $(mainDiv).html('');
        this.config.layout = newLayout;
        this.applyLayout();
    }

    this.applyLayout = () => {
        let args = this.config , argv = this.general;

        let layout = args.layout;
        if(layout) {
            for(let i in layout) {
                    this.addInCanvas(undefined,i,layout);
            }
        }
    }

    this.addInCanvas = (canvas, i, layout) => {
        let args = this.config , argv = this.general;

        let pxLeft = (layout[i].left * argv.finalWidth)/100 , 
            pxtop = (layout[i].top * argv.finalHeight)/100 , 
            pxWidth = (layout[i].width * argv.finalWidth)/100 , 
            pxHeight = (layout[i].height * argv.finalHeight)/100 ; 

            args.canvases.push(new Canvas(
                {   canvasId : i ,
                    top : pxtop , 
                    left : pxLeft , 
                    height : pxHeight , 
                    width : pxWidth , 
                    borderArea : args.borderArea ,
                    defaultImageData : this.general.defaultImageData , 
                }
            ));
            args.canvases[i].create(mainDiv);
    }


    this.onResize = () => {
        this.resizeCanvas();
    }

    this.resizeCanvas = () => {
    	let args = this.config , 
        	argv = this.general , 
            layout = args.layout;

    	$(mainDiv).width(argv.finalWidth);
        $(mainDiv).height(argv.finalHeight);
        for(let i in layout) {
            let pxLeft = (layout[i].left * argv.finalWidth)/100 , 
                pxtop = (layout[i].top * argv.finalHeight)/100 , 
                pxWidth = (layout[i].width * argv.finalWidth)/100 , 
                pxHeight = (layout[i].height * argv.finalHeight)/100 ; 
            args.canvases[i].resizeCanvas({top : pxtop , left : pxLeft , height : pxHeight , width : pxWidth , borderArea : args.borderArea });
        }
    }


    this.extractData = () => {
      let canvases = [];
      let params = this.config;
      params.canvases.forEach((c) => {
          canvases.push(c.extractData());
      });
      return {
        canvases : canvases , 
        layout : params.layout , 
        borderArea : params.borderArea , 
        frame : params.frame , 
      }
    }
}
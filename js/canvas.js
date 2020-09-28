
/**  General purpose Canvas Object */
function Canvas(params) {
    this.params = {
        canvasId : 0 , 
        top : 0,
        left : 0 ,
        right : 0 , 
        left : 0 ,  
        width : 0 , 
        height : 0 ,
        imageUrl : null , 
        canvas : null , 
        objects : [] ,
        isSide : false ,  
        jsonData : '' ,
        borderArea : 0 , 
        borderFill : '#ffffff' , 
        filter: 'grayscale' , 
        defaultImageData : null , 
    };

    this.params = $.extend(this.params , params);

    this.create = (mainDiv) => {
        let params = this.params , 
        canvasElement =`
            <div id = "canvas_container_${params.canvasId}" class = "generic-canvas-container">
                  <canvas id = "canvas_${params.canvasId}" class = "main-canvas"></canvas>
            </div>
        `;
        $(mainDiv).append(canvasElement);
        params.canvas = new fabric.Canvas("canvas_" + params.canvasId, {selection: false, backgroundColor: 'red'});
        this.setSize();
        this.applyFilter();
        this.attachEvents();
    }

    this.resizeCanvas = (size) => {
        console.log("Canvas Rezied" , this.params.canvasId);
        this.setSize(size);
    }

    this.setSize = (size) => {
        let params = this.params;
        if(size) {
            this.params.top = size.top;
            this.params.left = size.left;
            this.params.width = size.width;
            this.params.height = size.height;
            this.params.borderArea = (size.borderArea) ? size.borderArea : this.params.borderArea;
        }

        $(`#canvas_container_${params.canvasId}`).css(
            { top : params.top+'px' , left : params.left+'px', width : params.width+'px' , height : params.height+'px' , padding : params.borderArea+'px' }
        );
        console.log({ canvasId : params.canvasId, top : params.top , left : params.left , width : params.width , height : params.height , padding : params.borderArea+'px' })

        if(params.canvas) {
            params.canvas.setWidth(params.width - 2*params.borderArea);
            params.canvas.setHeight(params.height - 2*params.borderArea);
        }

        if(params.imageUrl) {
            this.addImageObject(params.imageUrl);
        } else {
            this.addImageObject(params.defaultImageData);
        }
    }

    this.applyFilter = (newFilter) => {
            //Sideeffect : resizeds the image
            let params = this.params;

            let imgObject = this.getObjectById(params.canvas , 'image' , 'image' + params.canvasId) , 
                filter = this.params.filter;

            if(!imgObject)
              return;

            if(newFilter) {
              filter = newFilter;
            }

            // switch(params.filter) {
            //     case 'original':
            //         imgObject.filters = [];
            //         imgObject.applyFilters();
            //         break;

            //     case 'sepia':
            //         let sepia = new fabric.Image.filters.Sepia2();
            //         imgObject.filters.push(sepia);
            //         imgObject.applyFilters();
            //         break;

            //     case 'grayscale':
            //         let grayscale = new fabric.Image.filters.Grayscale();
            //         imgObject.filters.push(grayscale);
            //         imgObject.applyFilters();
            //         break;
            // }
            // params.canvas.renderAll();
    }


    /** image drop event and main object move event */
    this.attachEvents = () => {
        let params = this.params;

        let elementId = '#canvas_container_'+params.canvasId;
        $(document).on('drop' ,  elementId, (e) => {
              e.preventDefault();
              var data = e.originalEvent.dataTransfer.getData("text");
              let imgUrl = $("#"+data).attr('src');
              params.imageUrl = imgUrl;
              this.addImageObject(imgUrl);
        });

        $(document).on('dragover' , elementId , (e) => {
            e.preventDefault();
        });


        //if(!params.imageUrl && params.defaultImageData) {
          this.addImageObject(params.defaultImageData);
          console.log("\n\n\n\n\vbdjcmaskdvnbfkvmaksvndf\n\n\n\n\n\n" , params.defaultImageData);
        //}
           
        if(params.canvas) {
            params.canvas.on('object:moving' , this.mainObjectMove);
        }
    }

    this.addImageObject = (data) => {
        let params = this.params;

        this.removeOldObject();

        fabric.Image.fromURL(data, (img) => {
              let scaleFactor , 
                  lock = {x : false , y : false } , 
                  ratioOfHeight , 
                  ratioOfWidth;

                  ratioOfHeight = img.height / (params.height - 2*params.borderArea);
                  ratioOfWidth = img.width / (params.width - 2*params.borderArea);

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
                  id : 'image'+params.canvasId , 
                  lockScalingX : true ,
                  lockScalingY : true , 
                  lockMovementX : lock.x ,
                  lockMovementY : lock.y ,  
                  lockRotation:true,
                  // stroke : 'white',
                  // strokeWidth : params.borderArea,
                  // hasBorders:false,
                  hasControls:false , 
              });

              params.canvas.add(img);
              params.canvas.sendBackwards(img);
              img.center();
              img.centerV();
              img.centerH();
              params.canvas.renderAll();
              this.applyFilter();
        });
    }

    this.removeOldObject = () => {
        let params = this.params;

        let oldObject = this.getObjectById(params.canvas , 'image' , 'image' + params.canvasId);
        if(oldObject) {
            params.canvas.remove(oldObject);
        }
    }

    this.mainObjectMove = (e) => {
        let obj = e.target;
        if(obj.id!='image'+params.canvasId)
            return
       let canvas = obj.canvas , objWidth = obj.width*obj.scaleX , objHeight = obj.height*obj.scaleY , 
        top = obj.top , 
        left = obj.left;

       let canWidth = canvas.width , diffW = Math.abs(objWidth - canWidth);
       (left < -diffW) ? obj.set('left' , -diffW) : null;
       (left > 0) ? obj.set('left' , 0) : null;

       let canHeight = canvas.height , diffH = Math.abs(objHeight - canHeight);
       (top < -diffH) ? obj.set('top' , -diffH) : null;
       (top > 0) ? obj.set('top' , 0) : null;
    }

    this.getObjectById = (canvas, type , id) => {
          const canvasObject = (canvas) ? canvas.getObjects(type).filter((item) => {
          return item.id === id;
          }) : undefined;
          return (canvasObject && canvasObject[0]) ? canvasObject[0] : null;
    }


    this.extractData = () => {
      let params = this.params , 
          canvasSVG = params.canvas.toSVG();
      return {
        top : params.top , 
        left : params.left , 
        right : params.right , 
        width : params.width , 
        height : params.height , 
        imgUrl : params.imgUrl ,
        canvasSVG :  canvasSVG , 
      }
    }
}
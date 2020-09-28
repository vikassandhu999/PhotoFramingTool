var SIZES = [
    [6,8] ,
    [8,8] ,
    [8,12] ,
    [10,10] ,
    [10,12] ,
    [11,14] ,
    [12,12] ,
    [12,15] ,
    [12,18] ,
    [16,20] ,
    [16,24] ,
    [20,24] ,
    [20,30] ,
    [30,20]
];


/* SuperType */
function PrintTool(config) {
    /** Configuration Object for Tool */
    this.config = {
        type : 'single_print' , 
        productType : 'canvas' , 
        calculatedPrice : 0,
        jsonData : null , 
        pxPerInch : 10 ,
        defaultImageData : null , 
        windowWidth : $(window).width() , 
        maxWidthRatio : 60 , 
        finalWidth : 0 , 
        finalHeight : 0 ,
        SizeX : 12 , 
        SizeY : 20 ,  
    };

    /**  */
    this.locals = {
        container : '#main-container' , 
        options : ['product' , 'size' , 'upload' , 'border' , 'finish'] , 
        instance : null ,
    }

    this.config = $.extend(this.config , config);

    /** Initiate Instance of tool */
    this.Init = () => {
        let args = this.config;
        this.calculateMaxSizeRatio();
        this.calculateScale();
        this.calculateFinalDimensions();
        this.attachEvents();
        this.createCanvasInstance();

        if(this.locals.instance)
            this.locals.instance.Init();   


        this.renderOptions();
    }


    this.attachEvents = () => {
        let args = this.config;

        $(window).resize(this.onWindowResize);


        $(document).on('click' , '#room-view' , this.generateRoomView);

        $(document).on('click' , '#size-select > li' , (e) => {
            this.resizeCanvas($(e.target).attr('value'));
        });

        $(document).on('click' , '#product-select > li' , (e) => {
            this.config.type = $(e.target).attr('value');
            this.Init();
        });


        $(document).on('click' , '#add-to-cart' , this.addToCart);


        $(document).on('change' , '#image-upload' , this.onImageUpload) ;

        $(document).on('dragstart' , '.draggable-image' , (e) => {
            e.originalEvent.dataTransfer.setData("text", e.target.id);
        });        

       
        let img =  $('#default-image-placeholder');
        let imgObj = new Image();
        imgObj.crossOrigin = 'Anonymous';
        imgObj.onload = function(oImg) {
            var tempCanvas = document.createElement('CANVAS');
            var tempCtx = tempCanvas.getContext('2d');
            var height = tempCanvas.height = this.naturalHeight;
            var width = tempCanvas.width = this.naturalWidth;
            tempCtx.drawImage(this, 0, 0);
            var dataURL = tempCanvas.toDataURL();
            console.log(dataURL);
            args.defaultImageData = dataURL;
        };


        imgObj.src = img.attr('src');
    }


    this.addToCart = () => {
            let jsonDataString = JSON.stringify(this.locals.instance.extractData());
            let cart = {
                type :  this.config.type,
                productType : this.config.productType , 
                calculatedPrice : this.config.calculatedPrice ,
                dimensions : this.config.SizeX+'x'+this.config.SizeY ,  
                jsonData : jsonDataString , 
                options : '' , 
            };
            console.log({cart});
            /* send to the server */
    }


    this.fillContent = (option) => {
        this.locals.options.forEach((id) => { 
            $('#'+id+'-contents').css({display : (id === option) ? 'block' : 'none'});
        });
    }


    this.renderOptions = () => {
        let elements = "";
       for (let i = 0; i <=  SIZES.length - 1; i++) {
            elements += `
                <li value = "${SIZES[i][0]}x${SIZES[i][1]}">${SIZES[i][0]}x${SIZES[i][1]}</li>
            `;
       }
        $('#size-select').html(elements);
    }

    this.onImageUpload = (e) => {
        e.preventDefault();
        
        let formData = new FormData();
        var files = e.target.files[0];
        formData.append('image',files);
        setLoader();


        $.ajax({
            url: '<url>',
            type: 'post',
            data: formData,
            contentType: false,
            processData: false,
            error: function (xhr, ajaxOptions, thrownError) {
                rmLoader();
               // alert('Error While Uplaoding the image');
            },
            success: function(jsonReply) {
                if (!$j.isEmptyObject(jsonReply) ) {
                    if(jsonReply.imageUrl) {
                      insertImageElement(jsonReply.imageUrl);
                    }
                } else {
                    alert('Server Error, Unable to upload image');
                }
                rmLoader();
            }

        });

        let reader = new FileReader();
        reader.onload = (f) => {
            let data = f.target.result;
            insertImageElement(data);
        }
        reader.readAsDataURL(files);
    }

    /** Create Instance of SubType according to 'type' */
    this.createCanvasInstance = () => {
        let args = this.config;

        switch(args.type) {
            case 'single_print' : 
                this.locals.instance = new SinglePrint(this.config , this.locals.container);
                return;
            case 'collage_print' : 
                this.locals.instance = new CollagePrint(this.config , this.locals.container);
                return;
            default :
                // Throw Error
                return;
        }
    }

    this.generateRoomView = () => {
        setLoader();
        openModal();
                  
            let roomViewTemplate = `
                   <div id = "room_view_content" class="room-view-content">
                        <img class = 'room_view_image' src = "./media/room_view.jpg"/>
                    </div>`;

                    //canvas-preview
            $(".modal-wrapper").html(roomViewTemplate);

                setTimeout(() => {

                        let base = 160;
                let scale = 0;

                if(this.config.SizeY > this.config.SizeX) {
                    scale = (base / this.config.finalHeight);
                } else {
                    scale = (base / this.config.finalWidth);
                }

                let left = $('#room_view_content').width() / 3;

                let height = Math.round((this.config.finalHeight) * scale);
                let width = Math.round((this.config.finalWidth) * scale);


               html2canvas($('.main-container'), {
                    timeout : 600,
                    onrendered: function (canhtml) {
                        var previewDataUrl = canhtml.toDataURL("image/jpg");
                      
                       $("#room_view_content").append(`<img class = 'print_canvas_image' style = 'left : ${left}px;height : ${height}px; width : ${width}px;'  src='${previewDataUrl}' />`);
                    }
                });
               rmLoader();


            } , 1000);
    }

    /** Calculate maxWidthRatio for different screen sizes */
    this.calculateMaxSizeRatio = () => {
        let args = this.config;
        let deviceWidth = args.windowWidth = $(window).width();

        /* add breakpoints */
        if(deviceWidth <=360) {
            args.maxWidthRatio = 80;
        } else if(deviceWidth <=960) {
            args.maxWidthRatio = 60;
        } else if(deviceWidth <=1440){
            args.maxWidthRatio = 40;
        } else {
            args.maxWidthRatio = 30;
        }
    }

    /** Calcuate Scale (pxPerInch) */
    this.calculateScale = () => {
        let args = this.config , 
        realWidth = (args.maxWidthRatio * args.windowWidth) / 100;
        if(args.SizeX > args.SizeY) {
            args.pxPerInch =  realWidth / args.SizeX;
        } else {
            args.pxPerInch = realWidth / args.SizeY;
        }
    }

    this.calculateFinalDimensions = () => {
        let args = this.config;
        args.finalWidth = args.pxPerInch * args.SizeX;
        args.finalHeight = args.pxPerInch * args.SizeY;
    }

    this.onWindowResize = () => {
        this.calculateMaxSizeRatio();
        this.calculateScale();
        this.calculateFinalDimensions();
        this.locals.instance.onResize();
    }


    this.resizeCanvas = (size) => {
        console.log(size);
        let Size = size.split('x');
        this.config.SizeX = parseInt(Size[0]);
        this.config.SizeY = parseInt(Size[1]);
        this.onWindowResize();
    }
}



//Helpers
function insertImageElement(imageUrl) {
    let iuid = "img-"+ Date.now() + Math.floor(Math.random() * 10000);
    let imageTemplate = `
        <div> 
            <img draggable="true" class = "draggable-image" id = ${iuid} src = ${imageUrl} alt = "Image Content"/>
            <a><i class="fas fa-trash-alt"></i></a>
        </div>
    `;
    $('#draggable-container').append(imageTemplate);
    $('#image-upload').files = null;
}
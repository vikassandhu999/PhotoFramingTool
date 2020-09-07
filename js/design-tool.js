/* SuperType */
function PrintTool(config) {
    /** Configuration Object for Tool */
    this.config = {
        type : 'collage_print' , 
        productType : 'canvas' , 
        calculatedPrice : 0,
        jsonData : null , 
        pxPerInch : 10 ,
        windowWidth : $(window).width() , 
        maxWidthRatio : 60 , 
        finalWidth : 0 , 
        finalHeight : 0 ,
        SizeX : 30 , 
        SizeY : 30 ,  
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
    }


    this.attachEvents = () => {

        $(window).resize(this.onWindowResize);

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

    this.onImageUpload = (e) => {
        e.preventDefault();
        let file = e.target.files[0];
        let reader = new FileReader();
        reader.onload = (f) => {
            let data = f.target.result;
            let iuid = "img-"+ Date.now();
            let imageTemplate = `<img draggable="true" class = "draggable-image" id = ${iuid} src = ${data} alt = "Image Content"/>`;
            $('#draggable-container').append(imageTemplate);
            $('#image-upload').files = null;
        }
        reader.readAsDataURL(file);
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
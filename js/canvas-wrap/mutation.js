        let obj = e.target;
        if(obj.id!='image')
        	return

        let canvas = obj.canvas;
        let objWidth = obj.width*obj.scaleX , 
        objHeight = obj.height*obj.scaleY , 
        top = obj.top , 
        left = obj.left;

       let canWidth = canvas.width;
       let diffW = Math.abs(objWidth - canWidth - this.state.imageWrapArea);
       (left < -diffW) ? obj.set('left' , -diffW) : null;
       (left > (0 - this.state.imageWrapArea)) ? obj.set('left' , -this.state.imageWrapArea) : null;

       let canHeight = canvas.height;
       let diffH = Math.abs(objHeight - canHeight - this.state.imageWrapArea);
       (top < -diffH) ? obj.set('top' , -diffH) : null;
       (top > (0 - this.state.imageWrapArea)) ? obj.set('top' , -this.state.imageWrapArea) : null;
       
       this.applyBorders();


       		let state = this.state;
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




             move: function (color) {
                    if(type == 'wrap_border_color') {
                        current.option.borderColor = color.toHexString();
                        current.fillBorderColorToAllCanvases();
                    } else if(type == 'binded') {
                        if (current.option.currentObject && current.option.currentObject != null && (current.option.currentObject.type == 'i-text' || current.option.currentObject.type == 'text' || current.option.currentObject.type == 'curvedText')) {
                            current.option.currentObject.set({ fill: color.toHexString() });
                            current.option.currentObject.canvas.renderAll();
                            if (current.option.type.indexOf('split') >= 0 && current.option.currentCanvas) {
                                current.applySplitCanvas(current.option.currentCanvas);
                            }
                            current.applyEffectOnCanvas(current.option.currentObject.canvas);
                        }
                    }else if(type == 'wordart_background_color'){
                        current.option.wordartObj.option.wordartBackgroundColor = color.toHexString();
                    }else if(type == 'wordart_primary_color'){
                        current.option.wordartObj.option.wordartPrimaryColor = color.toHexString();
                    }
                },
                show: function (color) {
                    if (type == 'wrap_border_color' && current.option.borderColor != '') {
                        currentColor = current.option.borderColor;
                        current.fillBorderColorToAllCanvases();
                        $j(container).spectrum("set", currentColor);
                    } else {
                        currentColor = color.toHexString();
                    }

                    if (type == 'digital_background_color' && current.option.digitalBackgroundColor != '') {
                        current.option.digitalBackgroundColor = color.toHexString();
                        $j(container).spectrum("set", currentColor);
                    }

                    if (type == 'binded' && current.option.currentObject && current.option.currentObject != null && (current.option.currentObject.type == 'i-text' || current.option.currentObject.type == 'text' || current.option.currentObject.type == 'curvedText')) {
                        currentColor = current.option.currentObject.fill;
                    }

                    if (type == 'qoc_canvas_background' && current.option.canvasBackgroundColor != '') {
                        currentColor = current.option.canvasBackgroundColor;
                        $j(container).spectrum("set", currentColor);
                    }
                },
                beforeShow: function () {

                },
                hide: function () {
                    if (type == "qoc_canvas_background") {
                        currentColor = current.option.canvasBackgroundColor;
                        if(currentColor == '' || currentColor == null || currentColor == undefined) {
                            current.option.canvasBackgroundColor = currentColor = '#FFFFFF';
                        }
                        $j(container).spectrum("set", currentColor);
                        $j('#custom_color_code').html((current.option.canvasBackgroundColor).toUpperCase());
                    }
                },
                change: function (color) {
                    if(type == 'wrap_border_color') {
                        current.option.borderColor = color.toHexString();
                        current.fillBorderColorToAllCanvases();
                    } else if(type == 'digital_background_color') {
                        current.option.digitalBackgroundColor = color.toHexString();
                    } else if (type == 'qoc_canvas_background') {
                        $j('#custom_color_code').html(color.toHexString().toUpperCase());
                    } else if(type == 'binded') {
                        if (current.option.currentObject && current.option.currentObject != null && (current.option.currentObject.type == 'i-text' || current.option.currentObject.type == 'text' || current.option.currentObject.type == 'curvedText')) {
                            current.option.currentObject.set({ fill: color.toHexString() });
                            current.option.currentObject.canvas.renderAll();
                            if (current.option.type.indexOf('split') >= 0 && current.option.currentCanvas) {
                                current.applySplitCanvas(current.option.currentCanvas);
                            }
                            current.applyEffectOnCanvas(current.option.currentObject.canvas);
                        }
                    } else if(type == 'wordart_background_color'){
                        current.option.wordartObj.option.wordartBackgroundColor = color.toHexString();
                        current.option.wordartObj.option.someOptionChanged = true;
                    }else if(type == 'wordart_primary_color'){
                        current.option.wordartObj.option.wordartPrimaryColor = color.toHexString();
                        current.option.wordartObj.option.someOptionChanged = true;
                    }
                    current.setOptionData(current.option, current.general);
                },
                choose: function(color) {
                    if (type == 'qoc_canvas_background') {
                        $j(current.option.createdCanvases).each(function (index) {
                            if (this.lowerCanvasEl.id) {
                                if (current.general.imageUploaded == 1) {
                                    if (current.option.currentCanvas.item(0).type == 'image') {
                                        current.option.currentCanvas.item(0).remove();
                                    }
                                    current.general.imageUploaded--;
                                    current.option.firstImageUploaded = 0;
                                }
                                current.option.createdCanvases[index].backgroundColor = color.toHexString();
                                current.option.createdCanvases[index].renderAll();
                                $j('.edit-option li').removeClass('disable-edit-option');
                            }
                        });
                        $j(".demo-image").hide();
                        current.option.canvasBackgroundColor = color.toHexString();
                        current.fillBorderColorInQOC();
                        current.enableDisableAddtocartButton();
                        current.setOverlayImageOnCanvas(current.option.currentCanvas);
                        if (current.checkWoodProducts(current.option.type) >= 0) {
                            current.changeSideWoodEvent(current.option.wood_type);
                        }
                        current.option.fotoliyaID = [];
                        current.calculateStockPhotoPrice();
                    }
                    current.setOptionData(current.option, current.general);
                },
                cancel: function (color) {
                    if(type == 'wrap_border_color') {
                        current.option.borderColor = currentColor;
                        current.fillBorderColorToAllCanvases();
                    } else if (type == 'digital_background_color') {
                        current.option.digitalBackgroundColor = color.toHexString();
                    } else if(type == 'binded') {
                        if (current.option.currentObject && current.option.currentObject != null && (current.option.currentObject.type == 'i-text' || current.option.currentObject.type == 'text' || current.option.currentObject.type == 'curvedText')) {
                            current.option.currentObject.set({ fill: currentColor });
                            current.option.currentObject.canvas.renderAll();
                            if (current.option.type.indexOf('split') >= 0 && current.option.currentCanvas) {
                                current.applySplitCanvas(current.option.currentCanvas);
                            }
                            current.applyEffectOnCanvas(current.option.currentObject.canvas);
                        }
                    } else if(type == 'wordart_background_color'){
                        current.option.wordartObj.option.wordartBackgroundColor = currentColor;
                    }else if(type == 'wordart_primary_color'){
                        current.option.wordartObj.option.wordartPrimaryColor = currentColor;
                    }
                    current.setOptionData(current.option, current.general);
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



















                setImageRatioAfterZoom0Angle: function (wrapPartArea) {
            var current = this;

            //var scaleNewX = (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) ? current.option.imgForEdited.scaleX / current.general.scale_factor : current.option.currentObject.scaleX;
            //var scaleNewY = (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY) ? current.option.imgForEdited.scaleY / current.general.scale_factor : current.option.currentObject.scaleY;

            var scaleNewX = current.option.imgForEdited.scaleX / current.general.scale_factor;
            var scaleNewY = current.option.imgForEdited.scaleY / current.general.scale_factor;

            if ((current.option.imgForEdited.width *  scaleNewX) >= (current.option.imgForEditedCanvas.width + (wrapPartArea * 2))   && (current.option.imgForEdited.height *  scaleNewY) >= (current.option.imgForEditedCanvas.height + (wrapPartArea * 2))) {
                /*if( (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) && (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY)){
                    current.option.imgForEdited.set({
                        scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                        scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                    });
                }*/

                current.option.imgForEdited.set({
                    scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                    scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                });


                if (current.option.imgForEdited.top > (0-wrapPartArea)) {
                    current.option.imgForEdited.top = (0-wrapPartArea);
                }

                if (current.option.imgForEdited.left > (0-wrapPartArea)) {
                    current.option.imgForEdited.left = (0-wrapPartArea);
                }

                if (current.option.imgForEdited.left < (0-wrapPartArea) ) {
                    var objWidth = current.option.imgForEdited.width * current.option.imgForEdited.scaleX;
                    var leftDiff = objWidth + current.option.imgForEdited.left;

                    if (leftDiff < (current.option.imgForEditedCanvas.width + wrapPartArea) ) {
                        current.option.imgForEdited.left =  (current.option.imgForEditedCanvas.width + wrapPartArea) - objWidth;
                        current.option.imgForEditedCanvas.renderAll();
                    }
                }

                if (current.option.imgForEdited.top < (0-wrapPartArea) ) {
                    var objHeight = current.option.imgForEdited.height * current.option.imgForEdited.scaleY;
                    var topDiff = objHeight + current.option.imgForEdited.top;

                    if (topDiff < (current.option.imgForEditedCanvas.height + wrapPartArea)) {
                        current.option.imgForEdited.top =  (current.option.imgForEditedCanvas.height + wrapPartArea) - objHeight;
                        current.option.imgForEditedCanvas.renderAll();
                    }
                }

                current.option.imgForEditedCanvas.renderAll();
            }else {
                current.fitImageAfterZoomOut();
            }
        },

        setImageRatioAfterZoom90Angle: function (wrapPartArea) {
            var current = this;
            //var scaleNewX = (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) ? current.option.imgForEdited.scaleX / current.general.scale_factor : current.option.currentObject.scaleX;
            //var scaleNewY = (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY) ? current.option.imgForEdited.scaleY / current.general.scale_factor : current.option.currentObject.scaleY;

            var scaleNewX = current.option.imgForEdited.scaleX / current.general.scale_factor;
            var scaleNewY = current.option.imgForEdited.scaleY / current.general.scale_factor;

            if ( (current.option.imgForEdited.width *  scaleNewX) >= (current.option.imgForEditedCanvas.height + (wrapPartArea * 2))   && (current.option.imgForEdited.height *  scaleNewY) >= (current.option.imgForEditedCanvas.width + (wrapPartArea * 2)) ) {
                /*if( (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) && (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY)){
                    current.option.imgForEdited.set({
                        scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                        scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                    });
                }*/

                current.option.imgForEdited.set({
                    scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                    scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                });

                if (current.option.imgForEdited.left < (current.option.imgForEditedCanvas.width + wrapPartArea) ) {
                    current.option.imgForEdited.left = (current.option.imgForEditedCanvas.width + wrapPartArea);
                } else {
                    var diffLeft =  current.option.imgForEdited.left - ((current.option.imgForEdited.height * current.option.imgForEdited.scaleY) - wrapPartArea);
                    if (diffLeft > 0) {
                        current.option.imgForEdited.left = ((current.option.imgForEdited.height * current.option.imgForEdited.scaleY) - wrapPartArea);
                    }
                }

                if (current.option.imgForEdited.top > (0-wrapPartArea) ) {
                    current.option.imgForEdited.top = (0-wrapPartArea);
                }

                if (current.option.imgForEdited.top < (0-wrapPartArea) ) {
                    var objHeight = current.option.imgForEdited.width * current.option.imgForEdited.scaleX;
                    var topDiff = objHeight + current.option.imgForEdited.top;

                    if (topDiff < (current.option.imgForEditedCanvas.height + wrapPartArea) ) {
                        current.option.imgForEdited.top =  (current.option.imgForEditedCanvas.height + wrapPartArea) - objHeight;
                        current.option.imgForEditedCanvas.renderAll();
                    }
                }

                current.option.imgForEditedCanvas.renderAll();
            }else {
                current.fitImageAfterZoomOut();
            }
        },

        setImageRatioAfterZoom180Angle: function (wrapPartArea) {
            var current = this;
            //var scaleNewX = (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) ? current.option.imgForEdited.scaleX / current.general.scale_factor : current.option.currentObject.scaleX;
            //var scaleNewY = (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY) ? current.option.imgForEdited.scaleY / current.general.scale_factor : current.option.currentObject.scaleY;

            var scaleNewX = current.option.imgForEdited.scaleX / current.general.scale_factor;
            var scaleNewY = current.option.imgForEdited.scaleY / current.general.scale_factor;

            if ((current.option.imgForEdited.width *  scaleNewX) >= (current.option.imgForEditedCanvas.width + (wrapPartArea * 2))   && (current.option.imgForEdited.height *  scaleNewY) >= (current.option.imgForEditedCanvas.height + (wrapPartArea * 2))) {
                /*if( (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) && (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY)){
                    current.option.imgForEdited.set({
                        scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                        scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                    });
                }*/

                current.option.imgForEdited.set({
                    scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                    scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                });

                if (current.option.imgForEdited.left < (current.option.imgForEditedCanvas.width + wrapPartArea) ) {
                    current.option.imgForEdited.left = (current.option.imgForEditedCanvas.width + wrapPartArea);
                } else {
                    var diffLeft = current.option.imgForEdited.left - ((current.option.imgForEdited.width * current.option.imgForEdited.scaleX) - wrapPartArea);
                    if (diffLeft > 0) {
                        current.option.imgForEdited.left = ((current.option.imgForEdited.width * current.option.imgForEdited.scaleX) - wrapPartArea);
                    }
                }

                if (current.option.imgForEdited.top < (current.option.imgForEditedCanvas.height + wrapPartArea) ) {
                    current.option.imgForEdited.top = (current.option.imgForEditedCanvas.height + wrapPartArea);
                } else {
                    var diffTop = current.option.imgForEdited.top - ((current.option.imgForEdited.height * current.option.imgForEdited.scaleY) - wrapPartArea);
                    if (diffTop > 0) {
                        current.option.imgForEdited.top = ((current.option.imgForEdited.height * current.option.imgForEdited.scaleY) - wrapPartArea);
                    }
                }
                current.option.imgForEditedCanvas.renderAll();
            }else {
                current.fitImageAfterZoomOut();
            }
        },

        setImageRatioAfterZoom270Angle: function (wrapPartArea) {
            var current = this;
            //var scaleNewX = (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) ? current.option.imgForEdited.scaleX / current.general.scale_factor : current.option.currentObject.scaleX;
            //var scaleNewY = (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY) ? current.option.imgForEdited.scaleY / current.general.scale_factor : current.option.currentObject.scaleY;

            var scaleNewX = current.option.imgForEdited.scaleX / current.general.scale_factor;
            var scaleNewY = current.option.imgForEdited.scaleY / current.general.scale_factor;

            if ((current.option.imgForEdited.width *  scaleNewX) >= (current.option.imgForEditedCanvas.height + (wrapPartArea * 2))   && (current.option.imgForEdited.height *  scaleNewY) >= (current.option.imgForEditedCanvas.width + (wrapPartArea * 2))) {
                /*if( (current.option.currentObject.scaleX < current.option.imgForEdited.scaleX) && (current.option.currentObject.scaleY < current.option.imgForEdited.scaleY)){
                    current.option.imgForEdited.set({
                        scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                        scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                    });
                }*/
                current.option.imgForEdited.set({
                    scaleX : current.option.imgForEdited.scaleX / current.general.scale_factor,
                    scaleY : current.option.imgForEdited.scaleY / current.general.scale_factor,
                });


                if (current.option.imgForEdited.left > (0-wrapPartArea)) {
                    current.option.imgForEdited.left = (0-wrapPartArea);
                } else if ( (current.option.imgForEdited.left + (current.option.imgForEdited.height * current.option.imgForEdited.scaleY)) < (current.option.imgForEditedCanvas.width + wrapPartArea) ) {
                    current.option.imgForEdited.left = ((current.option.imgForEditedCanvas.width + wrapPartArea) - (current.option.imgForEdited.height * current.option.imgForEdited.scaleY));
                }

                if (current.option.imgForEdited.top < (current.option.imgForEditedCanvas.height + wrapPartArea)) {
                    current.option.imgForEdited.top = (current.option.imgForEditedCanvas.height + wrapPartArea);
                } else {
                    var diffTop = current.option.imgForEdited.top - ((current.option.imgForEdited.width * current.option.imgForEdited.scaleX) - wrapPartArea);
                    if (diffTop > 0) {
                        current.option.imgForEdited.top = ((current.option.imgForEdited.width * current.option.imgForEdited.scaleX) - wrapPartArea);
                    }
                }
                current.option.imgForEditedCanvas.renderAll();
            }else {
                current.fitImageAfterZoomOut();
            }
        },
        /*** set zoom out at 0 lvel fixed issue for cvp-8187 ***/
        fitImageAfterZoomOut: function () {
            var current = this;

            if ($j.inArray( current.option.type, current.general.singlePrintProduct ) >= 0 && current.option.effect != 'wrap') {

                if (current.option.imgForEditedCanvas.item(0).angle == 90 || current.option.imgForEditedCanvas.item(0).angle == 270) {
                    var imgHeight = current.option.imgForEditedCanvas.item(0).width;
                    var imgWidth = current.option.imgForEditedCanvas.item(0).height;
                } else {
                    var imgHeight = current.option.imgForEditedCanvas.item(0).height;
                    var imgWidth = current.option.imgForEditedCanvas.item(0).width;
                }
                var ratioOfHeight = imgHeight/ current.option.imgForEditedCanvas.getHeight();
                var ratioOfWidth = imgWidth/ current.option.imgForEditedCanvas.getWidth();

                if (ratioOfHeight >= ratioOfWidth) {
                    current.option.imgForEditedCanvas.item(0).set({ scaleX: 1/ratioOfWidth, scaleY: 1/ratioOfWidth });
                } else {
                    current.option.imgForEditedCanvas.item(0).set({ scaleX: 1/ratioOfHeight, scaleY: 1/ratioOfHeight });
                }
                current.option.imgForEditedCanvas.item(0).center();
                current.option.imgForEditedCanvas.item(0).setCoords();
                current.option.imgForEditedCanvas.renderAll();
            }
        },




 fixTextMovementWithInCanvas: function (e) {
            var current = this;

            if (e.target && (e.target.type == 'i-text' || e.target.type == 'text' || e.target.type == 'curvedText' || e.target.type == 'path-group')){
                var obj = e.target;
                obj.setCoords();

                if(obj.getBoundingRect().top < 0 || obj.getBoundingRect().left < 0){
                    obj.top = Math.max(obj.top, obj.top-obj.getBoundingRect().top);
                    obj.left = Math.max(obj.left, obj.left-obj.getBoundingRect().left);
                }

                if(obj.getBoundingRect().top+obj.getBoundingRect().height  > obj.canvas.height ||
                    obj.getBoundingRect().left+obj.getBoundingRect().width  > obj.canvas.width){
                    obj.top = Math.min(obj.top, obj.canvas.height-obj.getBoundingRect().height+obj.top-obj.getBoundingRect().top);
                    obj.left = Math.min(obj.left, obj.canvas.width-obj.getBoundingRect().width+obj.left-obj.getBoundingRect().left);
                }
            }
        },

        dragTextDeleteOptionNearText: function (e) {
            var current = this;
            if (e.target && e.target.type == 'i-text' || e.target && e.target.type == 'text' || e.target && e.target.type == 'curvedText' || e.target && e.target.type == 'path-group' ) {
                var textCanvasId = e.target.canvas.lowerCanvasEl.id.replace("canvas_", "canvas_container_");
                var textCanvasPosition = $j('#'+textCanvasId).position();
                var deleteLeft = e.target.left;
                var deleteTop = e.target.top;

                if($j.inArray( current.option.type, current.general.singlePrintProduct ) >= 0){
                    deleteLeft =  e.target.left+20;  deleteTop = e.target.top - 30;
                }else{
                    deleteTop = e.target.top - 48;
                }
                if(deleteLeft < 1){
                    deleteLeft = 20;
                }else if(deleteTop < 1){
                    deleteTop = -30;
                }
                $j('.edit-text').show();
                $j('.edit-text').css('left',(deleteLeft)+(textCanvasPosition.left));
                $j('.edit-text').css('top',(deleteTop)+textCanvasPosition.top);
            } else {
                $j('.edit-text').hide();
            }
        },













          /*** add text in canvas when click on add text button ***/
        addTextInCanvas: function (object) {
            var current = this;

            var dateObj = new Date();
            var textRandomNumber = dateObj.getTime() + Math.floor(Math.random() * 1000);
            var current = this;
            var text = 'Double click to Edit';
            if(current.option.currentCanvas && current.option.type.indexOf('collage') < 0 ){
                $j("div [dropcanvasid=" + current.option.currentCanvas.lowerCanvasEl.id + "]").hide();
            }
            $j(".split-upload").hide();
            var textAlignValue = $j(".text-align a").hasClass('active') ? $j(".text-align a.active").attr("alignment") : 'center';
            var fontWeightValue = $j(".font-style a span[id ='textBold']").parent('a').hasClass('active') ? 'bold' : 'normal';
            var fontStyleValue = $j(".font-style a span[id ='textItalic']").parent('a').hasClass('active') ? 'italic' : 'normal';
            var textDecorationValue = ($j(".font-style a span[id ='textOveline']").parent('a').hasClass('active')) ? 'line-through' :
                ($j(".font-style a span[id ='textUnderline']").parent('a').hasClass('active')) ? 'underline' : 'normal';

            if (current.option.currentText == null ) {

                text = new fabric.Text($j("#text2").val(), {
                    left: 100,
                    top: 100,
                    opacity: 1,
                    fontFamily: $j("#textFontFamily").val(),
                    fontSize: $j("#textFontSize").val(),
                    cornerSize: 15,
                    textAlign: textAlignValue,
                    fontWeight: fontWeightValue,
                    fontStyle: fontStyleValue,
                    textDecoration: textDecorationValue,
                    fill: '#000000',
                    textCounter: textRandomNumber,
                });
            }
            else {
                current.option.currentObject.setText($j("#text2").val());
            }

            if(current.option.currentCanvas != null && current.option.currentCanvas != ''){
                if (current.option.currentText == null ) {
                    current.option.currentObject = current.option.currentText = text;
                    current.option.currentCanvas.add(text);
                    if(current.option.type.indexOf('mosaic') >= 0){
                        current.option.currentCanvas.sendBackwards(current.option.currentObject);
                    }
                    text.center();
                    text.setCoords();
                }
                current.option.currentCanvas.setActiveObject(current.option.currentObject);
                if(current.option.currentObject.type == 'curvedText' && current.option.currentObject.text == ''){
                    current.option.currentCanvas.remove(current.option.currentObject);
                }
                current.option.currentCanvas.renderAll();
                current.enableDisableAddtocartButton();
                if(current.option.type.indexOf('split') >= 0){
                    current.applySplitCanvas(current.option.currentCanvas);
                }

                current.applyEffectOnCanvas(current.option.currentCanvas);
            }
            current.setOptionData(current.option, current.general);
        },
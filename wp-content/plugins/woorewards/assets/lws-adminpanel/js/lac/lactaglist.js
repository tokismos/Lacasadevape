(function(b){b.widget("lws.lac_taglist",{options:{classe:"",name:"",placeholder:"",shared:false,addlabel:"Add",delay:300,minlength:1,minoptions:2,minsearch:1,comprehensiveSource:false},_create:function(){this._setOptions();this._createStructure();this.initList=(this.element.data("value")!=undefined&&this.element.data("value").trim()!="")?lwsBase64.toObj(this.element.data("value")):undefined;this.valueList=[];this.name=this.element.prop("name");this.element.data("lw_name",this.name).prop("name","");this.resLoad={};this.resLoad.target=this;this.resLoad.fn=this._ajaxLoading;this.resChange={};this.resChange.target=this;this.resChange.fn=this._resultChanged;this._manageModel();this.currentIndex=-1;this.preventNext=false;this.container.on("click",".lac-tag-remove",this._bind(this._delTag,this));this.container.on("click",".lac-taglist-addbutton",this._bind(this._addTags,this));this.container.on("focus",".lac-taglist-buffer",this._bind(this._getFocus,this));this.container.on("click",".lac-taglist-item",this._bind(this._selectItem,this));this.container.on("focusout",".lac-taglist-top",this._bind(this._manageFocus,this));this.container.on("keydown",this._bind(this._manageKeys,this));this.element.on("change",this._bind(this._changeElement,this));var a=this;var e;var f=[];this.container.keyup(function(d,c){f[0]=d.key;f[1]=d.keyCode;sentData=[f];e&&clearTimeout(e);e=setTimeout(a._bindD(a._manageSearch,a,sentData),a.options.delay)})},_bind:function(a,d){return function(){return a.apply(d,arguments)}},_bindD:function(a,f,e){return function(){return a.apply(f,e)}},_setOptions:function(){if(this.element.data("placeholder")!=undefined){this.options.placeholder=this.element.data("placeholder")}if(this.element.data("delay")!=undefined){this.options.delay=this.element.data("delay")}if(this.element.data("class")!=undefined){this.options.classe=this.element.data("class")}if(this.element.data("shared")!=undefined){this.options.shared=this.element.data("shared")}if(this.element.data("addlabel")!=undefined){this.options.shared=this.element.data("addlabel")}if(this.element.data("comprehensive")!=undefined){this.options.comprehensiveSource=this.element.data("comprehensive")}},_createStructure:function(){this.container=b("<div>",{"class":"lac-taglist-wrapper "}).append(b("<div>",{"class":"lac-taglist-top",tabIndex:"-1","data-uuid":this.uuid}).append(b("<div>",{"class":"lac-taglist-combo"}).append(b("<input>",{"class":"lac-taglist-input "+this.options.classe,placeholder:this.options.placeholder,name:this.options.name})).append(b("<div>",{"class":"lac-taglist-addbutton",html:this.options.addlabel}))).append(b("<div>",{"class":"lac-taglist-list","data-open":false})).append(b("<div>",{"class":"lac-taglist-error"})).append(b("<input>",{"class":"lac-taglist-buffer"}))).append(b("<div>",{"class":"lac-taglist-bottom"}).append(b("<div>",{"class":"lac-taglist-tags"}))).append(b("<div>",{"class":"lac-taglist-values"})).insertAfter(this.element);if(this.element.css("display")=="none"){this.container.hide()}this.element.hide();this.selectList=this.container.find(".lac-taglist-list");this.tagsList=this.container.find(".lac-taglist-tags");this.textInput=this.container.find(".lac-taglist-input")},_manageModel:function(){if(this.options.shared){if(b("#sha-"+this.options.shared).length){this.model=b("#sha-"+this.options.shared)}else{this.model=b("<input>",{id:"sha-"+this.options.shared,type:"hidden"}).appendTo(b("body"))}}else{this.model=this.element}b(this.model).lac_model({mode:"autocomplete",origin:this});if(this.initList!=undefined){this._ajaxLoading();b(this.model).lac_model("returnLabels",this.initList,this)}},_manageFocus:function(a,f){if(!a.originalEvent){return}var e=b(a.originalEvent.relatedTarget).closest(".lac-taglist-top");if(e.length>0&&e.data("uuid")==this.uuid){return}this._closeList()},_recursiveList:function(g){var a=[];for(var h in g){if(g[h].group!=undefined){retour=this._recursiveList(g[h].group);if(retour.length>0){if(retour[0][0].className!="lac-taglist-optgroup"){var f=b("<div>",{"class":"lac-taglist-optgroup","data-value":g[h].value,html:g[h].label});a.push(f)}a=b.merge(a,retour)}}else{this.selectIndex+=1;var f=b("<div>",{"class":"lac-taglist-item lac-item-"+this.selectIndex,"data-value":g[h].value,"data-label":g[h].label,"data-index":this.selectIndex,html:g[h].label});a.push(f)}}return a},_setResList:function(f){this.selectList.empty();this.currentIndex=-1;this.selectIndex=-1;var e=this._recursiveList(f);for(var a=0;a<e.length;a++){e[a].appendTo(this.selectList)}this.container.find(".lac-taglist-item").removeClass("lac-highlighted")},_openList:function(){this.selectList.data("open",true);this.selectList.show()},_closeList:function(){this.selectList.data("open",false);this.selectList.hide()},_changeElement:function(a){this.valueList=[];this.initList=(this.element.data("value")!=undefined&&this.element.data("value").trim()!="")?lwsBase64.toObj(this.element.data("value")):undefined;b(this.model).lac_model("returnLabels",this.initList,this)},_selectItem:function(a,f){var e=a.currentTarget.textContent;searchElements=this._getSearchElements();this.posIndex=searchElements.currentIndex;valArray=b.map(this.textInput.val().split(","),b.trim);valArray[this.posIndex]=e;curPos=searchElements.posSep[this.posIndex]+e.length;this.textInput.val(valArray.join(", "));this.textInput.val(this.textInput.val()+", ");this.textInput[0].setSelectionRange(this.textInput.val().length,this.textInput.val().length);this._closeList();this.currentIndex=b(a.currentTarget).data("index");this.textInput.focus()},_getFocus:function(a,d){if(this.preventNext){this.preventNext=false;this.textInput.focus()}},_getSearchElements:function(){var f={};f.currentPos=this.textInput[0].selectionStart;f.currentEndPos=this.textInput[0].selectionEnd;f.currentIndex=0;f.posSep=[0];posIndex=0;var e=this.textInput.val();for(var a=0;a<e.length;a++){if(e[a]===","){posIndex+=1;f.posSep[posIndex]=a}if(a+1==f.currentPos){f.currentIndex=posIndex}}return f},_manageSearch:function(a){searchElements=this._getSearchElements();this.posIndex=searchElements.currentIndex;valArray=b.map(this.textInput.val().split(","),b.trim);if(/[a-zA-Z0-9-_ ]/.test(String.fromCharCode(a[1]))){b(this.model).lac_model("research",valArray[this.posIndex],this)}},_afterArrowKeys:function(){var g=this.container.find(".lac-item-"+this.currentIndex);g.addClass("lac-highlighted");var h=this._getSearchElements();this.posIndex=h.currentIndex;var f=b.map(this.textInput.val().split(","),b.trim);f[this.posIndex]=g.data("label");var a=h.posSep[this.posIndex]+g.data("label").length+2;this.textInput.val(f.join(", "));this.textInput[0].setSelectionRange(a,a);if(!this.selectList.data("open")){this.selectList.data("open",true);this.selectList.show()}},_manageKeys:function(a,d){if(a.key=="ArrowDown"){if(jQuery.isEmptyObject(this.selectList)){return}this.container.find(".lac-item-"+this.currentIndex).removeClass("lac-highlighted");this.currentIndex=(this.currentIndex+1>this.selectIndex)?0:this.currentIndex+1;this._afterArrowKeys()}if(a.key=="ArrowUp"){if(jQuery.isEmptyObject(this.selectList)){return}this.posIndex=this._getSearchElements();this.container.find(".lac-item-"+this.currentIndex).removeClass("lac-highlighted");this.currentIndex=(this.currentIndex-1<0)?this.selectIndex:this.currentIndex-1;this._afterArrowKeys()}if(a.key=="Enter"){this.container.find(".lac-taglist-addbutton").trigger("click");this.selectList.data("open",false);this.selectList.hide()}if(a.key=="Tab"){if(this.selectList.data("open")==true){searchElements=this._getSearchElements();if((searchElements.currentEndPos+2)<this.textInput.val().length){this.textInput[0].setSelectionRange(searchElements.currentEndPos+2,searchElements.currentEndPos+2)}else{this.textInput.val(this.textInput.val()+", ");this.textInput[0].setSelectionRange(this.textInput.val().length,this.textInput.val().length)}this.selectList.data("open",false);this.selectList.hide();this.preventNext=true}else{this.container.find(".lac-taglist-addbutton").trigger("click")}}if(a.key=="Backspace"||a.key=="Delete"||a.key=="Suppr"||a.key==","){this.selectList.data("open",false);this.selectList.hide()}},_inputSelectRange:function(){if(this.textInput[0].setSelectionRange){valArray=b.map(this.textInput.val().split(","),b.trim);var g=this.container.find(".lac-item-"+this.currentIndex);var f="";var h=0;for(var a=0;a<valArray.length;a++){if(a==this.posIndex){start=h+valArray[a].length;end=h+g.data("label").length;f+=g.data("label")+", "}else{f+=valArray[a]+", ";h+=valArray[a].length+2}}this.textInput.focus();this.textInput.val(f.substring(0,f.length-2));this.textInput[0].setSelectionRange(start,end)}},_showError:function(a){this.container.find(".lac-taglist-error").html(a).show().delay(1000).fadeOut(500)},_ajaxLoading:function(){this.textInput.addClass("lac-loading")},_resultChanged:function(d){this.textInput.removeClass("lac-loading");if(d[1]=="ok"){if(!jQuery.isEmptyObject(d[0])){this.resList=d[0];this._setResList(this.resList);this.currentIndex=0;this._inputSelectRange();this.container.find(".lac-item-"+this.currentIndex).addClass("lac-highlighted");this._openList()}}else{if(d[1]=="init"){if(!jQuery.isEmptyObject(d[0])){var a=this;b.each(d[0],function(f,c){a.valueList[c.value]=c.label});this._fillTagList();this._updateList()}}else{this.resList=d[0];this._setResList(this.resList);this._showError(d[1])}}},_fillTagList:function(){this.tagsList.empty();for(var a in this.valueList){b("<div>",{"class":"lac-tag-wrapper","data-value":a}).append(b("<div>",{"class":"lac-tag-text",text:this.valueList[a]})).append(b("<a>",{"class":"lac-tag-remove lws-icon-cross"})).appendTo(this.tagsList)}if(this.valueList){b(this.model).lac_model("addToSource",this.valueList)}},_delTag:function(d){var a=b(d.currentTarget).parent();delete this.valueList[a.data("value")];a.remove();this._updateList()},_addTags:function(){labArray=b.grep(b.map(this.textInput.val().split(","),b.trim),function(d){return d.length>0});valArray=b(this.model).lac_model("getValuesFromLabels",labArray,this.options.comprehensiveSource);me=this;b.each(valArray,function(f,e){me.valueList[e.value]=e.label});var a="";if((labArray.length!=valArray.length)&&this.options.comprehensiveSource){b.each(labArray,function(j,h){var g=false;for(var i=0;(i<valArray.length)&&!g;i++){g=(h==valArray[i].label)}if(!g){if(a.length>0){a+=", "}a+=h}})}this.textInput.val(a);this._fillTagList();this._updateList();this._closeList();if((labArray.length!=valArray.length)&&this.options.comprehensiveSource){this._showError(lws_lac_taglist.value_unknown)}},_updateList:function(){var a=this.container.find(".lac-taglist-values");a.empty();keyTable=[];for(var d in this.valueList){b("<input>",{type:"hidden",name:this.name+"[]",value:d,"data-lw_dependant":this.name}).appendTo(a);keyTable.push(d)}this.element.data("value",lwsBase64.fromObj(keyTable))}})})(jQuery);jQuery(function(b){b(".lac_taglist").lac_taglist()});
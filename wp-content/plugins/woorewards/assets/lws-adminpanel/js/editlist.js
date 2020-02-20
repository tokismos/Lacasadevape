(function(b){b.widget("lws.lws_editlist",{_create:function(){this._bindOn(this.element,"mouseenter",".lws_editlist_row_editable",this._showLineButtons);this._bindOn(this.element,"mouseleave",".lws_editlist_row_editable",this._hideLineButtons);this._bindOn(this.element,"click",".lws_editlist_item_add",this._addLine);this._bindOn(this.element,"click",".lws-editlist-btn-mod",this.editLine);this._bindOn(this.element,"click",".lws-editlist-btn-dup",this._copyLine);this._bindOn(this.element,"click",".lws-editlist-btn-del",this._removeLine);this._bindOn(this.element,"click","button.lws-editlist-btn-save",this._saveForm);this._bindOn(this.element,"click","button.lws-editlist-btn-cancel",this._cancelForm);this._bindOn(this.element,"change","input.lws_editlist_check_selectall",this.checkAll);this._bindOn(this.element,"click",".lws_editlist_group_add",this._addGroup);this._bindOn(this.element,"click",".lws_editlist_group_del",this._removeGroup);this._bindOn(this.element,"click",".lws_editlist_group_head_edit",this._editGroup);this._bindOn(this.element,"click",".lws_editlist_group_form_submit",this._submitEditGroup);this._bindOn(this.element,"click",".lws_editlist_group_form_cancel",this._cancelEditGroup);this.itemForm=this.element.find(".lws_editlist_line_form").prev().addBack();this.itemTemplate=this.element.find(".lws_editlist_template[data-line]");this.tableTemplate=this.element.find(".lws_editlist_table").clone(true);this.tableTemplate.find(".lws_editlist_table_body").empty();this.groupForm=this.element.find(".lws_editlist_groupby_settings>.lws_editlist_groupby_form").detach();this.element.removeClass("lws-editlist-renderer-grouped").addClass("lws-editlist-renderer-flatten");if(this.element.data("groupby")=="on"){setTimeout(this._bind(this.groupBy,this),0)}},_addGroup:function(){if(!this.isFormVisible()){var e=this.element.find(".lws_editlist_groups");var f=0;e.children(".lws_editlist_group").each(function(){var c=b(this).find(".lws_editlist_table .lws_editlist_table_body").attr("data-body");if(f<=c){f=(c+1)}});var a=this._appendNewNode(e,f);a.addClass("lws_editlist_node_trial_state");this._editGroup({target:a.find(".lws_editlist_groupby_head")})}return false},_removeGroup:function(e){if(!this.isFormVisible()&&confirm(lws_adminpanel.confirmDel)){var a=b(e.target).closest(".lws_editlist_group");this._removeItems(a.find(".lws_editlist_row_editable"),a.closest(".lws_editlist_groups"));var f=a.data("line");this.groupForm.detach();this.itemForm.detach();this.itemTemplate.detach();a.remove();this.element.trigger("group_deleted",lwsBase64.toObj(f),this)}return false},_editGroup:function(d){if(!this.isFormVisible()){if(this.groupForm.length>0){var a=b(d.target).closest(".lws_editlist_groupby_node");b(".lws_editlist_modal_edit_button").addClass("lws-editlist-btn-disabled");a.children(".lws_editlist_groupby_head").hide();a.append(this.groupForm);obj=lwsBase64.toObj(a.closest(".lws_editlist_group").data("line"));this.groupForm.lwsWriteForm(obj);this.resetBeforeUnload();this.groupForm.show().trigger("edit",obj,this);this.focusFirstField(this.groupForm)}}return false},_submitEditGroup:function(e){if(this.groupForm.is(":visible")&&this.groupForm.lwsMatchPattern()){var h=this.groupForm.closest(".lws_editlist_groupby_node");var a=h.children(".lws_editlist_groupby_head");var g=this.groupForm.lwsReadForm();this.groupForm.detach();this._spreadGroupedData(h.closest(".lws_editlist_group"),g);a.lwsWriteForm(g).show();h.closest(".lws_editlist_group").data("line",lwsBase64.fromObj(g)).removeClass("lws_editlist_node_trial_state").trigger("change",g,this);this.resetBeforeUnload();b(".lws_editlist_modal_edit_button").removeClass("lws-editlist-btn-disabled")}return false},_cancelEditGroup:function(e){this.resetBeforeUnload();var f=b(e.target).closest(".lws_editlist_groupby_node");var a=f.closest(".lws_editlist_group");if(a.hasClass("lws_editlist_node_trial_state")&&a.find(".lws_editlist_row_editable[data-line]").length==0){this.groupForm.detach();this.itemForm.detach();this.itemTemplate.detach();a.remove()}else{a.removeClass("lws_editlist_node_trial_state");this.groupForm.detach();f.children(".lws_editlist_groupby_head").show()}b(".lws_editlist_modal_edit_button").removeClass("lws-editlist-btn-disabled");return false},_getFormData:function(){var d=this.itemForm.lwsReadForm();var a=this.itemForm.closest(".lws_editlist_group[data-line]");if(a.length>0){b.each(lwsBase64.toObj(a.data("line")),function(f,c){d[f]=c})}return d},_spreadGroupedData:function(a,f){var h=a.find(".lws_editlist_row_editable[data-line]");if(this._mergeData(h,f)){var g=this;h.each(function(){var c=b(this);b.ajax({dataType:"json",url:lws_editlist_ajax_url,method:"POST",data:{method:"put",id:g.element.attr("id"),line:c.data("line"),groupedBy:g.isGroupedBy()?"true":""},success:function(e){if((0!=e)&&e.status&&(e.line!=undefined)){var d=lwsBase64.toObj(e.line);g._updateItemCells(c,d)}else{alert((0!=e)&&(e.error!=undefined)?e.error:lws_adminpanel.updateAlert)}}}).fail(function(e,d,l){var k="<div class='lws-error'>Update error, status: "+d+", error: "+l+"</div>";a.replaceWith(k)})})}},_mergeData:function(h,f){if(f==undefined){var a=h.first().closest(".lws_editlist_group[data-line]");if(a.length==0){return false}f=lwsBase64.toObj(a.data("line"))}var g=false;h.each(function(){var c=lwsBase64.toObj(b(this).data("line"));b.each(f,function(e,d){if(c[e]!=d){g=true;c[e]=d}});b(this).data("line",lwsBase64.fromObj(c))});return g},_filterGroupData:function(a){if(this.groupDataTemplate==undefined){var d={};this.element.find(".lws_editlist_groupby_settings").find("span[data-name],input[name],select[name],textarea[name]").each(function(){var c=b(this);if(c.prop("tagName").toUpperCase()=="SPAN"){d[c.data("name")]=c.html()}else{d[c.attr("name")]=c.val()}});this.groupDataTemplate=d}var d={};b.each(this.groupDataTemplate,function(f,c){d[f]=(a[f]==undefined?c:a[f])});return d},isGroupedBy:function(){return(this.isGrouped===true)},_splitTable:function(k,i){var h=b(i);var j=lwsBase64.toObj(h.data("line"));var l=j[this.groupKey];l=(l==undefined?"":l.replace(/\"/g,'\\"'));var a=this.groups.find('.lws_editlist_group[data-groupval="'+l+'"]');if(a.length==0){a=this._appendNewNode(this.groups,k,j,this.table,l)}a.find(".lws_editlist_table .lws_editlist_table_body").append(h)},_appendNewNode:function(l,n,m,k,a){var i=this._filterGroupData(m==undefined?{}:m);li=b("<div>",{"class":"lws_editlist_group lws-editlist-group","data-groupval":a==undefined?"":a,"data-line":lwsBase64.fromObj(i)});this.groupHead.clone(true).removeClass("lws_editlist_groupby_settings").addClass("lws-editlist-groupby-head lws_editlist_groupby_node").appendTo(li).lwsWriteForm(i).show();if(l.children().length==0){li.append((k==undefined||k.lenght==0)?this.tableTemplate.clone(true):k);if(this.addBtn.length>0){li.append(this.addBtn)}}else{var j=((k==undefined||k.lenght==0)?this.tableTemplate:k).clone(true);j.find(".lws_editlist_table_body").empty();li.append(j);if(this.addBtn.length>0){li.append(this.addBtn.clone(true))}}li.find(".lws_editlist_table .lws_editlist_table_body").attr("data-body",n);li.find(".lws_editlist_item_add").attr("data-body",n);l.append(li);return li},groupBy:function(e){this.groupHead=this.element.find(".lws_editlist_groupby_settings");if(this.groupHead.length==0){return}if(e==undefined){e=this.groupHead.data("groupby")}if(e==undefined){return}this.groupKey=e;b(".lws_editlist_modal_edit_button").removeClass("lws-editlist-btn-disabled");this.itemForm.detach();this.itemTemplate.detach();this.flatten(true);this.addBtn=this.element.find(".lws_editlist_item_add");this.table=this.element.find(".lws_editlist_table");this.groups=this.element.find(".lws_editlist_groups");if(this.groups.length==0){this.groups=b("<div>",{"class":"lws_editlist_groups"}).insertBefore(this.table)}var a=this.table.find(".lws_editlist_row_editable[data-line]");if(a.length==0){this.table.remove();this.addBtn.remove()}else{a.each(this._bind(this._splitTable,this))}if(this.groupHead.data("add")!=undefined&&this.groupForm.length>0){var f=b("<button>",{"class":"lws-adm-btn lws-editlist-group-add lws_editlist_modal_edit_button lws_editlist_group_add","data-id":this.element.attr("id")}).append(b("<div>",{"class":"lws-group-add-icon lws-icon-plus"})).append(b("<div>",{"class":"lws-group-add-text"}).html(this.groupHead.data("add")));this.element.append(f)}this.groups=undefined;this.isGrouped=true;this.element.removeClass("lws-editlist-renderer-flatten").addClass("lws-editlist-renderer-grouped");this.element.trigger("grouped",this)},flatten:function(a){this._cancelForm();var f=this.element.find(".lws_editlist_groups");if(f.length>0){var e=this.tableTemplate.clone(true);e.find(".lws_editlist_table_body").empty();this.element.find(".lws_editlist_table .lws_editlist_table_body .lws_editlist_row_editable").each(function(){e.append(b(this))});e.insertAfter(f);if(this.addBtn.length>0){this.addBtn.clone(true).insertAfter(e)}b(".lws_editlist_modal_edit_button").removeClass("lws-editlist-btn-disabled");this.itemForm.detach();this.itemTemplate.detach();this.groupForm.detach();f.remove();this.element.children(".lws_editlist_group_add").remove();this.element.find(".lws_editlist_table .lws_editlist_table_body").attr("data-body","");this.element.find(".lws_editlist_item_add").attr("data-body","")}this.isGrouped=false;this.element.removeClass("lws-editlist-renderer-grouped").addClass("lws-editlist-renderer-flatten");if(a!==true){this.element.trigger("flatten",this)}},checkAll:function(a){if(a===true){this.element.find("input.lws_editlist_check_selectitem").prop("checked",true)}else{if(a===false){this.element.find("input.lws_editlist_check_selectitem").prop("checked",false)}else{this.localTable(a.target).find("input.lws_editlist_check_selectitem").prop("checked",b(a.currentTarget).prop("checked"))}}},localTable:function(a){if(a==undefined){return this.element.find(".lws_editlist_table")}else{return b(a).closest(".lws_editlist_table")}},_bindOn:function(f,h,a,g){f.on(h,a,this._bind(g,this))},_bind:function(a,d){return function(){return a.apply(d,arguments)}},_showLineButtons:function(a){if(!this.isFormVisible()){b(a.currentTarget).find(".lws-editlist-buttons").css("visibility","visible")}},_hideLineButtons:function(a){b(a.currentTarget).find(".lws-editlist-buttons").css("visibility","hidden")},hideAllLinesButtons:function(){this.element.find(".lws-editlist-buttons").css("visibility","hidden")},isFormVisible:function(){return(b(".lws_editlist .lws_editlist_modal_form:visible").length>0)},editLine:function(a){if(!this.isFormVisible()){this._showForm(b(a.target))}return false},_copyLine:function(e){if(!this.isFormVisible()){var a=b(e.target).closest(".lws_editlist_row_editable");var g=lwsBase64.toObj(a.data("line"));g[this.localTable(e.target).attr("uid")]="";var h=a.clone(true).removeAttr("id").data("template",1);h.find(".lws-editlist-buttons").remove();h.data("line",lwsBase64.fromObj(g));this._showForm(h.insertBefore(a))}return false},_removeLine:function(d){if(!this.isFormVisible()&&confirm(lws_adminpanel.confirmDel)){var a=b(d.target).closest(".lws_editlist_row_editable");if(a.length>0){this._removeItems(a)}}return false},_removeItems:function(a,f){var e=this;a.each(function(){var c=b(this);var d=(f==undefined?c:f);var h=c.data("line");b.ajax({dataType:"json",url:lws_editlist_ajax_url,method:"POST",data:{method:"del",id:e.element.attr("id"),line:h,groupedBy:e.isGroupedBy()?"true":""},success:function(g){if((0!=g)&&g.status){c.remove()}else{d.replaceWith("<p class='lws-error'>Erase error.</p>")}e.element.trigger("deleted",lwsBase64.toObj(h),this)}}).fail(function(k,g,l){d.replaceWith("<p class='lws-error'>Erase error, status: "+g+", error: "+l+"</p>")})})},_addLine:function(e){if(!this.isFormVisible()){var a=this.itemTemplate.clone(true);a.removeAttr("id").addClass("lws_editlist_row_editable").removeClass("lws_editlist_template");var f='.lws_editlist_table .lws_editlist_table_body[data-body="'+b(e.currentTarget).attr("data-body")+'"]';this.element.find(f).append(a);this._mergeData(a);this._showForm(a)}return false},_showForm:function(h){h=h.closest(".lws_editlist_row_editable").addClass("lws_editlist_tr_edited");this.itemForm.insertAfter(h.hide());var a=h.data("line");var e=((a==undefined||a.trim()=="")?{}:lwsBase64.toObj(a));try{this.itemForm.lwsWriteForm(e,true)}catch(g){console.log(g)}b(".lws_editlist_modal_edit_button").addClass("lws-editlist-btn-disabled");this.resetBeforeUnload();this.itemForm.show().trigger("edit",e,this);this.focusFirstField(this.itemForm)},_saveForm:function(){var a=this.element.find(".lws_editlist_tr_edited");b.ajax({dataType:"json",url:lws_editlist_ajax_url,method:"POST",data:{method:"put",id:this.element.attr("id"),line:lwsBase64.fromObj(this._getFormData()),groupedBy:this.isGroupedBy()?"true":""},success:this._bind(this._savedCallback,this)}).fail(function(h,d,j){var i="<p class='lws-error'>Update error, status: "+d+", error: "+j+"</p>";a.removeClass("lws_editlist_tr_edited").replaceWith(i).show()});return false},_savedCallback:function(a){if((0!=a)&&a.status&&(a.line!=undefined)){var e=lwsBase64.toObj(a.line);var f=this.element.find(".lws_editlist_tr_edited").removeClass("lws_editlist_tr_edited").data("line",a.line).removeData("template").removeAttr("data-template");this._updateItemCells(f,e,true);f.show();this.itemForm.hide().detach();b(".lws_editlist_modal_edit_button").removeClass("lws-editlist-btn-disabled");this.showInfo(a.message);this.resetBeforeUnload();f.trigger("updated",e,this)}else{alert((0!=a)&&(a.error!=undefined)?a.error:lws_adminpanel.updateAlert)}},_updateItemCells:function(g,f,a){var h=this.itemTemplate;g.find(".lws_editlist_td").each(function(j,c){c=b(c);var e=c.data("key");if((e!=undefined)&&(f[e]!=undefined)){var d=c.find(".lws-editlist-buttons").detach();if(d.length<=0){d=h.find('.lws_editlist_td[data-key="'+e+'"]').find(".lws-editlist-buttons").clone(true)}c.html(f[e]);if(d.length>0){c.append("<br/>",d)}if(a===true){c.trigger("change",f,this)}}})},showInfo:function(a){if(a!=undefined){alert(a)}},_cancelForm:function(){var a=this.element.find(".lws_editlist_tr_edited").removeClass("lws_editlist_tr_edited");if(a.length>0){if(a.data("template")=="1"){a.remove()}else{a.show()}}b(".lws_editlist_modal_edit_button").removeClass("lws-editlist-btn-disabled");this.itemForm.hide().detach();this.resetBeforeUnload();return false},resetBeforeUnload:function(){if(window.lwsInputchanged!==true){window.onbeforeunload=undefined}},focusFirstField:function(a){setTimeout(function(){a.find("input:visible, select:visible, textarea:visible").first().focus().select()},10)}})})(jQuery);jQuery(function(b){b(".lws_editlist").lws_editlist()});
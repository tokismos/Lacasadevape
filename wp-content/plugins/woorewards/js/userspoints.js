jQuery(function(b){b.fn.displayHistory=function(g,f){this.container=b(document.documentElement);b("<div>",{"class":"lws-history-shadow",tabIndex:"-1"}).append(b("<div>",{"class":"lws-history-wrapper"}).append(b("<div>",{"class":"lws-history-top-line"}).append(b("<div>",{"class":"lws-history-title",html:lws_wr_userspoints_labels.hist})).append(b("<div>",{"class":"lws-history-user",html:f})).append(b("<div>",{"class":"lws-history-close lws-icon-cross"}))).append(b("<div>",{"class":"lws-history-content"}))).appendTo(this.container);this.wrapper=this.container.find(".lws-history-wrapper");this.contentContainer=this.container.find(".lws-history-content");var h="<table class='lws-history-content-table'><tr><th>"+lws_wr_userspoints_labels.desc+"</th>";h+="<th>"+lws_wr_userspoints_labels.date+"</th><th>"+lws_wr_userspoints_labels.points+"</th><th>"+lws_wr_userspoints_labels.total+"</th>";for(var a=0;a<g.length;a++){if(g[a].op_value==null){g[a].op_value="n/a"}h+="<tr>";h+="<td>"+g[a].op_reason+"</td>";h+='<td class="date">'+g[a].op_date+"</td>";h+='<td class="number">'+g[a].op_value+"</td>";h+='<td class="number">'+g[a].op_result+"</td>";h+="</tr>"}h+="</table>";this.contentContainer.html(h);this.wrapper.css("left",((this.container.width()-this.wrapper.outerWidth())/2));this.wrapper.css("top",((this.container.height()-this.wrapper.outerHeight())/2));this.container.on("click",".lws-history-shadow","",function(d){var c=b(d.originalEvent.target);if(c.hasClass("lws-history-shadow")||c.hasClass("lws-history-close")){b(this).remove()}})};b(".lws_wre_point_history").click(function(){b(this).css("color","darkblue");var a=b(this).closest(".lws-editlist-row").find(".lws_wre_history_dispname").html();b.getJSON(lws_ajax_url,{action:"lws_woorewards_user_points_history",stack:b(this).data("stack"),user:b(this).data("user")},function(d){b(this).displayHistory(d,a)}).fail(function(g,d,h){console.log("["+g.status+"] "+g.responseText)})})});
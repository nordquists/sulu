define(["app-config"],function(a){"use strict";var b={filterListUrl:"resource/filters/",manageFilters:"manage",filtersUrl:"api/filters?flat=true&context=",filterUrl:"resource/filters/"},c=function(a,c,e,g,h){if(a&&c&&g){var i=b.filtersUrl+a,j="husky.datagrid."+g+".updated",k=f.call(this,a,g,i);this.filterResultSelector=h,this.context=a,this.datagridInstance=g,this.toolbarInstanceName=e,c.push(k),this.sandbox.off(j),this.sandbox.on(j,d.bind(this))}},d=function(a){if(this.filter)if(this.filterResultComponentStarted){var b=g.call(this);this.sandbox.emit("sulu.filter-result."+this.context+".update",a.total,this.filter,b)}else this.filterResultComponentStarted=!0,App.start([{name:"filter-result@suluresource",options:{el:this.filterResultSelector,filter:this.filter,datagridInstance:this.datagridInstance,numberOfResults:a.total,filterUrl:g.call(this),instanceName:this.context}}]).then(function(){this.sandbox.off("sulu.filter-result."+this.context+".unset_filter"),this.sandbox.on("sulu.filter-result."+this.context+".unset_filter",e.bind(this))}.bind(this))},e=function(){this.sandbox.emit("husky.toolbar."+this.toolbarInstanceName+".item.unmark",this.filter.id),this.filter=null},f=function(a,c,d){return{id:"filters",icon:"filter",title:this.sandbox.translate("resource.filter"),group:2,position:1,dropdownOptions:{url:d,resultKey:"filters",titleAttribute:"name",idAttribute:"id",languageNamespace:"toolbar.",markSelected:!0,changeButton:!0,callback:function(b){i.call(this,b,c,a)}.bind(this)},dropdownItems:[{divider:!0},{id:b.manageFilters,name:this.sandbox.translate("resource.filter.manage")}]}},g=function(){return b.filterUrl+this.context+"/"+a.getUser().locale+"/edit:"+this.filter.id+"/edit"},h=function(){this.filter=null,this.filterResultComponentStarted=!1,this.filterResultSelector&&App.stop(this.filterResultSelector)},i=function(a,c,d){a.id!==b.manageFilters?(this.filter=a,this.filterUrl=g.call(this),this.sandbox.emit("husky.datagrid."+c+".url.update",{filter:a.id})):(this.filter=null,this.filterUrl=null,this.sandbox.emit("sulu.router.navigate",b.filterListUrl+d))};return{initialize:function(a){a.components.before("initialize",function(){"Sulu App"===this.name&&(this.sandbox.on("sulu.header.toolbar.extend",c.bind(this)),this.sandbox.on("sulu.router.navigate",h.bind(this)))})}}});
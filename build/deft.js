/*!
DeftJS 0.9.0-pre

Copyright (c) 2013 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/
Ext.define("Deft.core.Class",{alternateClassName:["Deft.Class"],statics:{registerPreprocessor:function(b,d,a,c){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){Ext.Class.registerPreprocessor(b,function(e,f,g){return d.call(this,e,f,f,g)}).setDefaultPreprocessorPosition(b,a,c)}else{Ext.Class.registerPreprocessor(b,function(f,g,e,h){return d.call(this,f,g,e,h)},[b],a,c)}},hookOnClassCreated:function(a,b){if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){Ext.Function.interceptBefore(a,"onClassCreated",b)}else{Ext.Function.interceptBefore(a,"onCreated",b)}},hookOnClassExtended:function(c,b){var a;if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){a=function(d,e){return b.call(this,d,e,e)}}else{a=b}if(c.onClassExtended!=null){Ext.Function.interceptBefore(c,"onClassExtended",a)}else{c.onClassExtended=a}},extendsClass:function(c,b){var a;try{if(Ext.getClassName(b)===c){return true}if(b!=null?b.superclass:void 0){if(Ext.getClassName(b.superclass)===c){return true}else{return Deft.Class.extendsClass(c,Ext.getClass(b.superclass))}}else{return false}}catch(d){a=d;return false}}}});Ext.define("Deft.log.Logger",{alternateClassName:["Deft.Logger"],singleton:true,log:function(b,a){if(a==null){a="info"}},error:function(a){this.log(a,"error")},info:function(a){this.log(a,"info")},verbose:function(a){this.log(a,"verbose")},warn:function(a){this.log(a,"warn")},deprecate:function(a){this.log(a,"deprecate")}},function(){var a;if(Ext.getVersion("extjs")!=null){this.log=function(c,b){if(b==null){b="info"}if(b==="verbose"){b==="info"}if(b==="deprecate"){b="warn"}Ext.log({msg:c,level:b})}}else{if(Ext.isFunction((a=Ext.Logger)!=null?a.log:void 0)){this.log=Ext.bind(Ext.Logger.log,Ext.Logger)}}});Ext.define("Deft.util.Function",{alternateClassName:["Deft.Function"],statics:{memoize:function(d,c,a){var b;b={};return function(f){var e;e=Ext.isFunction(a)?a.apply(c,arguments):f;if(!(e in b)){b[e]=d.apply(c,arguments)}return b[e]}},nextTick:function(b,a){if(a!=null){b=Ext.Function.bind(b,a)}setTimeout(b,0)},spread:function(b,a){return function(c){if(!Ext.isArray(c)){Ext.Error.raise({msg:"Error spreading passed Array over target function arguments: passed a non-Array."})}return b.apply(a,c)}},extract:function(a,b){var c;c=a[b];delete a[b];return c}}},function(){if(typeof setImmediate!=="undefined"&&setImmediate!==null){return this.nextTick=function(){var a;if(typeof scope!=="undefined"&&scope!==null){a=Ext.Function.bind(a,scope)}setImmediate(a)}}});Ext.define("Deft.event.LiveEventListener",{alternateClassName:["Deft.LiveEventListener"],requires:["Ext.ComponentQuery"],constructor:function(c){var b,d,e,a;Ext.apply(this,c);this.components=[];d=Ext.ComponentQuery.query(this.selector,this.container);for(e=0,a=d.length;e<a;e++){b=d[e];this.components.push(b);b.on(this.eventName,this.fn,this.scope,this.options)}},destroy:function(){var b,d,a,c;c=this.components;for(d=0,a=c.length;d<a;d++){b=c[d];b.un(this.eventName,this.fn,this.scope)}this.components=null},register:function(a){if(this.matches(a)){this.components.push(a);a.on(this.eventName,this.fn,this.scope,this.options)}},unregister:function(b){var a;a=Ext.Array.indexOf(this.components,b);if(a!==-1){b.un(this.eventName,this.fn,this.scope);Ext.Array.erase(this.components,a,1)}},matches:function(a){if(this.selector===null&&this.container===a){return true}if(this.container===null&&Ext.Array.contains(Ext.ComponentQuery.query(this.selector),a)){return true}if(a.isDescendantOf(this.container)&&Ext.Array.contains(this.container.query(this.selector),a)){return true}return false}});Ext.define("Deft.event.LiveEventBus",{alternateClassName:["Deft.LiveEventBus"],requires:["Ext.Component","Ext.ComponentManager","Deft.event.LiveEventListener"],singleton:true,constructor:function(){this.listeners=[]},destroy:function(){var d,c,a,b;b=this.listeners;for(c=0,a=b.length;c<a;c++){d=b[c];d.destroy()}this.listeners=null},addListener:function(b,a,c,f,e,d){var g;g=Ext.create("Deft.event.LiveEventListener",{container:b,selector:a,eventName:c,fn:f,scope:e,options:d});this.listeners.push(g)},removeListener:function(b,a,c,e,d){var f;f=this.findListener(b,a,c,e,d);if(f!=null){Ext.Array.remove(this.listeners,f);f.destroy()}},on:function(b,a,c,f,e,d){return this.addListener(b,a,c,f,e,d)},un:function(b,a,c,e,d){return this.removeListener(b,a,c,e,d)},findListener:function(a,c,f,g,i){var b,d,h,e;e=this.listeners;for(d=0,h=e.length;d<h;d++){b=e[d];if(b.container===a&&b.selector===c&&b.eventName===f&&b.fn===g&&b.scope===i){return b}}return null},register:function(a){a.on("added",this.onComponentAdded,this);a.on("removed",this.onComponentRemoved,this)},unregister:function(a){a.un("added",this.onComponentAdded,this);a.un("removed",this.onComponentRemoved,this)},onComponentAdded:function(c,b,d){var g,f,a,e;e=this.listeners;for(f=0,a=e.length;f<a;f++){g=e[f];g.register(c)}},onComponentRemoved:function(c,b,d){var g,f,a,e;e=this.listeners;for(f=0,a=e.length;f<a;f++){g=e[f];g.unregister(c)}}},function(){if(Ext.getVersion("touch")!=null){Ext.define("Deft.Component",{override:"Ext.Component",setParent:function(c){var b,a;b=this.getParent();a=this.callParent(arguments);if(b===null&&c!==null){this.fireEvent("added",this,c)}else{if(b!==null&&c!==null){this.fireEvent("removed",this,b);this.fireEvent("added",this,c)}else{if(b!==null&&c===null){this.fireEvent("removed",this,b)}}}return a},isDescendantOf:function(a){var b;b=this.getParent();while(b!=null){if(b===a){return true}b=b.getParent()}return false}})}Ext.Function.interceptAfter(Ext.ComponentManager,"register",function(a){Deft.event.LiveEventBus.register(a)});Ext.Function.interceptAfter(Ext.ComponentManager,"unregister",function(a){Deft.event.LiveEventBus.unregister(a)})});Ext.define("Deft.ioc.DependencyProvider",{requires:["Deft.log.Logger"],config:{identifier:null,className:null,parameters:null,fn:null,value:void 0,singleton:true,eager:false},constructor:function(b){var a;this.initConfig(b);if((b.value!=null)&&b.value.constructor===Object){this.setValue(b.value)}if(this.getEager()){if(this.getValue()!=null){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': a 'value' cannot be created eagerly."})}if(!this.getSingleton()){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': only singletons can be created eagerly."})}}if(this.getClassName()!=null){a=Ext.ClassManager.get(this.getClassName());if(a==null){Deft.Logger.warn("Synchronously loading '"+(this.getClassName())+"'; consider adding Ext.require('"+(this.getClassName())+"') above Ext.onReady.");Ext.syncRequire(this.getClassName());a=Ext.ClassManager.get(this.getClassName())}if(a==null){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': unrecognized class name or alias: '"+(this.getClassName())+"'"})}}if(!this.getSingleton()){if(this.getClassName()!=null){if(Ext.ClassManager.get(this.getClassName()).singleton){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': singleton classes cannot be configured for injection as a prototype. Consider removing 'singleton: true' from the class definition."})}}if(this.getValue()!=null){Ext.Error.raise({msg:"Error while configuring '"+(this.getIdentifier())+"': a 'value' can only be configured as a singleton."})}}else{if((this.getClassName()!=null)&&(this.getParameters()!=null)){if(Ext.ClassManager.get(this.getClassName()).singleton){Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': parameters cannot be applied to singleton classes. Consider removing 'singleton: true' from the class definition."})}}}return this},resolve:function(d,e){var c,a,b;Deft.Logger.log("Resolving '"+(this.getIdentifier())+"'.");if(this.getValue()!==void 0){return this.getValue()}a=null;if(this.getFn()!=null){Deft.Logger.log("Executing factory function.");if(e){c=[d].concat(Ext.toArray(e))}else{c=[d]}a=this.getFn().apply(Deft.Injector,c)}else{if(this.getClassName()!=null){if(Ext.ClassManager.get(this.getClassName()).singleton){Deft.Logger.log("Using existing singleton instance of '"+(this.getClassName())+"'.");a=Ext.ClassManager.get(this.getClassName())}else{Deft.Logger.log("Creating instance of '"+(this.getClassName())+"'.");b=this.getParameters()!=null?[this.getClassName()].concat(this.getParameters()):[this.getClassName()];a=Ext.create.apply(this,b)}}else{Ext.Error.raise({msg:"Error while configuring rule for '"+(this.getIdentifier())+"': no 'value', 'fn', or 'className' was specified."})}}if(this.getSingleton()){this.setValue(a)}return a}});Ext.define("Deft.ioc.Injector",{alternateClassName:["Deft.Injector"],requires:["Ext.Component","Deft.log.Logger","Deft.ioc.DependencyProvider"],singleton:true,constructor:function(){this.providers={};this.injectionStack=[];return this},configure:function(b){var a;Deft.Logger.log("Configuring the injector.");a={};Ext.Object.each(b,function(d,c){var e;Deft.Logger.log("Configuring dependency provider for '"+d+"'.");if(Ext.isString(c)){e=Ext.create("Deft.ioc.DependencyProvider",{identifier:d,className:c})}else{e=Ext.create("Deft.ioc.DependencyProvider",Ext.apply({identifier:d},c))}this.providers[d]=e;a[d]=e},this);Ext.Object.each(a,function(c,d){if(d.getEager()){Deft.Logger.log("Eagerly creating '"+(d.getIdentifier())+"'.");d.resolve()}},this)},reset:function(){Deft.Logger.log("Resetting the injector.");this.providers={}},canResolve:function(a){var b;b=this.providers[a];return b!=null},resolve:function(a,b,d){var c;c=this.providers[a];if(c!=null){return c.resolve(b,d)}else{Ext.Error.raise({msg:"Error while resolving value to inject: no dependency provider found for '"+a+"'."})}},inject:function(e,f,k,j){var h,a,b,c,d,i,g;if(j==null){j=true}i=Ext.getClassName(f);if(Ext.Array.contains(this.injectionStack,i)){d=this.injectionStack.join(" -> ");this.injectionStack=[];Ext.Error.raise({msg:"Error resolving dependencies for '"+i+"'. A circular dependency exists in its injections: "+d+" -> *"+i+"*"});return null}this.injectionStack.push(i);h={};if(Ext.isString(e)){e=[e]}Ext.Object.each(e,function(o,p){var n,l,m;m=Ext.isArray(e)?p:o;n=p;l=this.resolve(n,f,k);if(m in f.config){Deft.Logger.log("Injecting '"+n+"' into '"+i+"."+m+"' config.");h[m]=l}else{Deft.Logger.log("Injecting '"+n+"' into '"+i+"."+m+"' property.");f[m]=l}},this);this.injectionStack=[];if(j){for(a in h){g=h[a];c="set"+Ext.String.capitalize(a);f[c].call(f,g)}}else{if((Ext.getVersion("extjs")!=null)&&f instanceof Ext.ClassManager.get("Ext.Component")){f.injectConfig=h}else{if(Ext.isFunction(f.initConfig)){b=f.initConfig;f.initConfig=function(m){var l;l=b.call(this,Ext.Object.merge({},m||{},h));return l}}}}return f}},function(){if(Ext.getVersion("extjs")!=null){if(Ext.getVersion("core").isLessThan("4.1.0")){Ext.Component.override({constructor:function(a){a=Ext.Object.merge({},a||{},this.injectConfig||{});delete this.injectConfig;return this.callOverridden([a])}})}else{Ext.define("Deft.InjectableComponent",{override:"Ext.Component",constructor:function(a){a=Ext.Object.merge({},a||{},this.injectConfig||{});delete this.injectConfig;return this.callParent([a])}})}}});Ext.define("Deft.mixin.Injectable",{requires:["Deft.core.Class","Deft.ioc.Injector","Deft.log.Logger"],onClassMixedIn:function(a){Deft.Logger.deprecate("Deft.mixin.Injectable has been deprecated and can now be omitted - simply use the 'inject' class annotation on its own.")}},function(){var a;if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){a=function(){return function(){if(!this.$injected){Deft.Injector.inject(this.inject,this,arguments,false);this.$injected=true}return this.callOverridden(arguments)}}}else{a=function(){return function(){if(!this.$injected){Deft.Injector.inject(this.inject,this,arguments,false);this.$injected=true}return this.callParent(arguments)}}}Deft.Class.registerPreprocessor("inject",function(b,e,j,i){var g,f,c,h,d;if(Ext.isString(e.inject)){e.inject=[e.inject]}if(Ext.isArray(e.inject)){g={};d=e.inject;for(c=0,h=d.length;c<h;c++){f=d[c];g[f]=f}e.inject=g}Deft.Class.hookOnClassCreated(j,function(k){k.override({constructor:a()})});Deft.Class.hookOnClassExtended(e,function(l,m,k){Deft.Class.hookOnClassCreated(k,function(n){n.override({constructor:a()})});if(m.inject==null){m.inject={}}Ext.applyIf(m.inject,l.superclass.inject)})},"before","extend")});Ext.define("Deft.mvc.Observer",{requires:["Deft.core.Class","Ext.util.Observable","Deft.util.Function"],statics:{mergeObserve:function(b,l){var d,q,m,r,g,k,o,i,n,p,e,f,a,j,h,c;if(!Ext.isObject(b)){a={}}else{a=Ext.clone(b)}if(!Ext.isObject(l)){g={}}else{g=Ext.clone(l)}i=["buffer","single","delay","element","target","destroyable"];o=function(A){var D,z,u,C,t,v,y,x,B,s,w;w=[];for(C in A){u=A[C];if(Ext.isArray(u)){z={};for(y=0,B=u.length;y<B;y++){v=u[y];if(Ext.Object.getSize(v)===1){Ext.apply(z,v)}else{D={};if((v!=null?v.fn:void 0)!=null){D.fn=v.fn}if((v!=null?v.scope:void 0)!=null){D.scope=v.scope}for(x=0,s=i.length;x<s;x++){t=i[x];if((v!=null?v[t]:void 0)!=null){D[t]=v[t]}}z[v.event]=[D]}}w.push(A[C]=z)}else{w.push(void 0)}}return w};o(a);o(g);for(k in g){q=g[k];for(d in q){m=q[d];if(Ext.isString(m)){g[k][d]=m.replace(" ","").split(",")}if(!(a!=null?a[k]:void 0)){a[k]={}}if(!(a!=null?(h=a[k])!=null?h[d]:void 0:void 0)){a[k][d]=g[k][d];delete g[k][d]}}}for(j in a){p=a[j];for(n in p){e=p[n];if(Ext.isString(e)){a[j][n]=e.split(",")}if(g!=null?(c=g[j])!=null?c[n]:void 0:void 0){r=g[j][n];f=a[j][n];a[j][n]=Ext.Array.unique(Ext.Array.insert(f,0,r))}}}return a}},constructor:function(a){var c,k,j,f,i,l,g,h,d,b,e;this.listeners=[];i=a!=null?a.host:void 0;d=a!=null?a.target:void 0;k=a!=null?a.events:void 0;if(i&&d&&(this.isPropertyChain(d)||this.isTargetObservable(i,d))){for(c in k){f=k[c];if(Ext.isString(f)){f=f.replace(" ","").split(",")}for(b=0,e=f.length;b<e;b++){j=f[b];h=i;l=null;if(Ext.isObject(j)){l=Ext.clone(j);if(l!=null?l.event:void 0){c=Deft.util.Function.extract(l,"event")}if(l!=null?l.fn:void 0){j=Deft.util.Function.extract(l,"fn")}if(l!=null?l.scope:void 0){h=Deft.util.Function.extract(l,"scope")}}g=this.locateReferences(i,d,j);if(g){g.target.on(c,g.handler,h,l);this.listeners.push({targetName:d,target:g.target,event:c,handler:g.handler,scope:h});Deft.Logger.log("Created observer on '"+d+"' for event '"+c+"'.")}else{Deft.Logger.warn("Could not create observer on '"+d+"' for event '"+c+"'.")}}}}else{Deft.Logger.warn("Could not create observers on '"+d+"' because '"+d+"' is not an Ext.util.Observable")}return this},isTargetObservable:function(b,e){var a,d,c;a=this.locateTarget(b,e);if(a==null){return false}if((a.isObservable!=null)||(((c=a.mixins)!=null?c.observable:void 0)!=null)){return true}else{d=Ext.ClassManager.getClass(a);return Deft.Class.extendsClass("Ext.util.Observable",d)||Deft.Class.extendsClass("Ext.mixin.Observable",d)}},locateTarget:function(b,c){var a;if(Ext.isFunction(b["get"+Ext.String.capitalize(c)])){a=b["get"+Ext.String.capitalize(c)].call(b);return a}else{if((b!=null?b[c]:void 0)!=null){a=b[c];return a}else{return null}}},isPropertyChain:function(a){return Ext.isString(a)&&a.indexOf(".")>-1},locateReferences:function(c,d,a){var b,e;b=c;if(this.isPropertyChain(d)){e=this.parsePropertyChain(c,d);if(!e){return null}c=e.host;d=e.target}if(Ext.isFunction(a)){return{target:this.locateTarget(c,d),handler:a}}else{if(Ext.isFunction(b[a])){return{target:this.locateTarget(c,d),handler:b[a]}}else{return null}}},parsePropertyChain:function(a,b){var c;if(Ext.isString(b)){c=b.split(".")}else{if(Ext.isArray(b)){c=b}else{return null}}if(c.length>1&&(this.locateTarget(a,c[0])!=null)){return this.parsePropertyChain(this.locateTarget(a,c[0]),c.slice(1))}else{if(this.isTargetObservable(a,c[0])){return{host:a,target:c[0]}}else{return null}}},destroy:function(){var d,c,a,b;b=this.listeners;for(c=0,a=b.length;c<a;c++){d=b[c];Deft.Logger.log("Removing observer on '"+d.targetName+"' for event '"+d.event+"'.");d.target.un(d.event,d.handler,d.scope)}this.listeners=[]}});Ext.define("Deft.mvc.ComponentSelectorListener",{requires:["Deft.event.LiveEventBus"],constructor:function(c){var b,e,a,d;Ext.apply(this,c);if(this.componentSelector.live){Deft.LiveEventBus.addListener(this.componentSelector.view,this.componentSelector.selector,this.eventName,this.fn,this.scope,this.options)}else{d=this.componentSelector.components;for(e=0,a=d.length;e<a;e++){b=d[e];b.on(this.eventName,this.fn,this.scope,this.options)}}return this},destroy:function(){var b,d,a,c;if(this.componentSelector.live){Deft.LiveEventBus.removeListener(this.componentSelector.view,this.componentSelector.selector,this.eventName,this.fn,this.scope)}else{c=this.componentSelector.components;for(d=0,a=c.length;d<a;d++){b=c[d];b.un(this.eventName,this.fn,this.scope)}}}});Ext.define("Deft.mvc.ComponentSelector",{requires:["Ext.ComponentQuery","Deft.log.Logger","Deft.mvc.ComponentSelectorListener"],constructor:function(c){var a,e,g,b,d,f;Ext.apply(this,c);if(!this.live){this.components=this.selector!=null?Ext.ComponentQuery.query(this.selector,this.view):[this.view]}this.selectorListeners=[];if(Ext.isObject(this.listeners)){f=this.listeners;for(a in f){g=f[a];e=g;d=this.scope;b=null;if(Ext.isObject(g)){b=Ext.apply({},g);if(b.fn!=null){e=b.fn;delete b.fn}if(b.scope!=null){d=b.scope;delete b.scope}}if(Ext.isString(e)&&Ext.isFunction(d[e])){e=d[e]}if(!Ext.isFunction(e)){Ext.Error.raise({msg:"Error adding '"+a+"' listener: the specified handler '"+e+"' is not a Function or does not exist."})}this.addListener(a,e,d,b)}}return this},destroy:function(){var d,c,a,b;b=this.selectorListeners;for(c=0,a=b.length;c<a;c++){d=b[c];d.destroy()}this.selectorListeners=[]},addListener:function(a,d,c,b){var e;if(this.findListener(a,d,c)!=null){Ext.Error.raise({msg:"Error adding '"+a+"' listener: an existing listener for the specified function was already registered for '"+this.selector+"."})}Deft.Logger.log("Adding '"+a+"' listener to '"+this.selector+"'.");e=Ext.create("Deft.mvc.ComponentSelectorListener",{componentSelector:this,eventName:a,fn:d,scope:c,options:b});this.selectorListeners.push(e)},removeListener:function(a,c,b){var d;d=this.findListener(a,c,b);if(d!=null){Deft.Logger.log("Removing '"+a+"' listener from '"+this.selector+"'.");d.destroy();Ext.Array.remove(this.selectorListeners,d)}},findListener:function(b,d,c){var g,f,a,e;e=this.selectorListeners;for(f=0,a=e.length;f<a;f++){g=e[f];if(g.eventName===b&&g.fn===d&&g.scope===c){return g}}return null}});Ext.define("Deft.mvc.ViewController",{alternateClassName:["Deft.ViewController"],requires:["Deft.core.Class","Deft.log.Logger","Deft.mvc.ComponentSelector","Deft.mvc.Observer"],config:{view:null},observe:{},constructor:function(a){if(a==null){a={}}if(a.view){this.controlView(a.view)}this.initConfig(a);if(Ext.Object.getSize(this.observe)>0){this.createObservers()}return this},controlView:function(a){if(a instanceof Ext.ClassManager.get("Ext.Component")){this.setView(a);this.registeredComponentReferences={};this.registeredComponentSelectors={};if(Ext.getVersion("extjs")!=null){if(this.getView().rendered){this.onViewInitialize()}else{this.getView().on("afterrender",this.onViewInitialize,this,{single:true})}}else{if(this.getView().initialized){this.onViewInitialize()}else{this.getView().on("initialize",this.onViewInitialize,this,{single:true})}}}else{Ext.Error.raise({msg:"Error constructing ViewController: the configured 'view' is not an Ext.Component."})}},init:function(){},destroy:function(){var b,a;for(b in this.registeredComponentReferences){this.removeComponentReference(b)}for(a in this.registeredComponentSelectors){this.removeComponentSelector(a)}this.removeObservers();return true},onViewInitialize:function(){var d,h,e,f,c,a,b,g;if(Ext.getVersion("extjs")!=null){this.getView().on("beforedestroy",this.onViewBeforeDestroy,this)}else{b=this;c=this.getView().destroy;this.getView().destroy=function(){if(b.destroy()){c.call(this)}}}g=this.control;for(h in g){d=g[h];a=null;if(h!=="view"){if(Ext.isString(d)){a=d}else{if(d.selector!=null){a=d.selector}else{a="#"+h}}}e=null;if(Ext.isObject(d.listeners)){e=d.listeners}else{if(!((d.selector!=null)||(d.live!=null))){e=d}}f=(d.live!=null)&&d.live;this.addComponentReference(h,a,f);this.addComponentSelector(a,e,f)}this.init()},onViewBeforeDestroy:function(){if(this.destroy()){this.getView().un("beforedestroy",this.onViewBeforeDestroy,this);return true}return false},addComponentReference:function(e,a,c){var b,d;if(c==null){c=false}Deft.Logger.log("Adding '"+e+"' component reference for selector: '"+a+"'.");if(this.registeredComponentReferences[e]!=null){Ext.Error.raise({msg:"Error adding component reference: an existing component reference was already registered as '"+e+"'."})}if(e!=="view"){b="get"+Ext.String.capitalize(e);if(this[b]==null){if(c){this[b]=Ext.Function.pass(this.getViewComponent,[a],this)}else{d=this.getViewComponent(a);if(d==null){Ext.Error.raise({msg:"Error locating component: no component(s) found matching '"+a+"'."})}this[b]=function(){return d}}this[b].generated=true}}this.registeredComponentReferences[e]=true},removeComponentReference:function(b){var a;Deft.Logger.log("Removing '"+b+"' component reference.");if(this.registeredComponentReferences[b]==null){Ext.Error.raise({msg:"Error removing component reference: no component reference is registered as '"+b+"'."})}if(b!=="view"){a="get"+Ext.String.capitalize(b);if(this[a].generated){this[a]=null}}delete this.registeredComponentReferences[b]},getViewComponent:function(a){var b;if(a!=null){b=Ext.ComponentQuery.query(a,this.getView());if(b.length===0){return null}else{if(b.length===1){return b[0]}else{return b}}}else{return this.getView()}},addComponentSelector:function(a,b,c){var d,e;if(c==null){c=false}Deft.Logger.log("Adding component selector for: '"+a+"'.");e=this.getComponentSelector(a);if(e!=null){Ext.Error.raise({msg:"Error adding component selector: an existing component selector was already registered for '"+a+"'."})}d=Ext.create("Deft.mvc.ComponentSelector",{view:this.getView(),selector:a,listeners:b,scope:this,live:c});this.registeredComponentSelectors[a]=d},removeComponentSelector:function(a){var b;Deft.Logger.log("Removing component selector for '"+a+"'.");b=this.getComponentSelector(a);if(b==null){Ext.Error.raise({msg:"Error removing component selector: no component selector registered for '"+a+"'."})}b.destroy();delete this.registeredComponentSelectors[a]},getComponentSelector:function(a){return this.registeredComponentSelectors[a]},createObservers:function(){var a,c,b;this.registeredObservers={};b=this.observe;for(c in b){a=b[c];this.addObserver(c,a)}},addObserver:function(c,b){var a;a=Ext.create("Deft.mvc.Observer",{host:this,target:c,events:b});return this.registeredObservers[c]=a},removeObservers:function(){var a,c,b;b=this.registeredObservers;for(c in b){a=b[c];a.destroy();delete this.registeredObservers[c]}}},function(){return Deft.Class.registerPreprocessor("observe",function(b,c,a,d){Deft.Class.hookOnClassExtended(c,function(f,h,e){var g;if(f.superclass&&((g=f.superclass)!=null?g.observe:void 0)&&Deft.Class.extendsClass("Deft.mvc.ViewController",f)){h.observe=Deft.mvc.Observer.mergeObserve(f.superclass.observe,h.observe)}})},"before","extend")});Ext.define("Deft.mvc.Application",{alternateClassName:["Deft.Application"],initialized:false,constructor:function(a){if(a==null){a={}}this.initConfig(a);Ext.onReady(function(){this.init();this.initialized=true},this);return this},init:function(){}});Ext.define("Deft.mixin.Controllable",{requires:["Ext.Component","Deft.core.Class","Deft.log.Logger"],onClassMixedIn:function(a){Deft.Logger.deprecate("Deft.mixin.Controllable has been deprecated and can now be omitted - simply use the 'controller' class annotation on its own.")}},function(){var a;if(Ext.getVersion("extjs")&&Ext.getVersion("core").isLessThan("4.1.0")){a=function(){return function(d){var b,c;if(d==null){d={}}if(this instanceof Ext.ClassManager.get("Ext.Component")&&!this.$controlled){try{b=Ext.create(this.controller,d.controllerConfig||this.controllerConfig||{})}catch(e){c=e;Deft.Logger.warn("Error initializing view controller: an error occurred while creating an instance of the specified controller: '"+this.controller+"'.");throw c}if(this.getController===void 0){this.getController=function(){return b}}this.$controlled=true;this.callOverridden(arguments);b.controlView(this);return this}return this.callOverridden(arguments)}}}else{a=function(){return function(d){var b,c;if(d==null){d={}}if(this instanceof Ext.ClassManager.get("Ext.Component")&&!this.$controlled){try{b=Ext.create(this.controller,d.controllerConfig||this.controllerConfig||{})}catch(e){c=e;Deft.Logger.warn("Error initializing view controller: an error occurred while creating an instance of the specified controller: '"+this.controller+"'.");throw c}if(this.getController===void 0){this.getController=function(){return b}}this.$controlled=true;this.callParent(arguments);b.controlView(this);return this}return this.callParent(arguments)}}}Deft.Class.registerPreprocessor("controller",function(d,e,b,f){var c;Deft.Class.hookOnClassCreated(b,function(g){g.override({constructor:a()})});Deft.Class.hookOnClassExtended(e,function(h,i,g){Deft.Class.hookOnClassCreated(g,function(j){j.override({constructor:a()})})});c=this;Ext.require([e.controller],function(){if(f!=null){f.call(c,d,e,b)}});return false},"before","extend")});Ext.define("Deft.promise.Resolver",{alternateClassName:["Deft.Resolver"],requires:["Deft.util.Function"],constructor:function(o,a,m){var c,k,j,e,n,l,h,i,b,d,g,f;this.promise=Ext.create("Deft.promise.Promise",this);i=[];d=false;e=false;n=null;l=null;if(!Ext.isFunction(a)){a=function(p){throw p}}h=Deft.util.Function.nextTick;g=function(){var q,r,p;for(r=0,p=i.length;r<p;r++){q=i[r];q[n](l)}i=[]};f=function(p){i.push(p);if(e){g()}};c=function(q,p){o=a=m=null;n=q;l=p;e=true;g()};j=function(p){c("resolve",p)};k=function(p){c("reject",p)};b=function(s,q){var p;d=true;try{if(Ext.isFunction(s)){q=s(q)}if(q&&Ext.isFunction(q.then)){q.then(j,k)}else{j(q)}}catch(r){p=r;k(p)}};this.resolve=function(p){if(!d){b(o,p)}};this.reject=function(p){if(!d){b(a,p)}};this.update=function(q){var r,s,p;if(!e){if(Ext.isFunction(m)){q=m(q)}for(s=0,p=i.length;s<p;s++){r=i[s];r.update(q)}}};this.then=function(s,p,r){var q;if(Ext.isFunction(s)||Ext.isFunction(p)||Ext.isFunction(r)){q=Ext.create("Deft.promise.Resolver",s,p,r);h(function(){return f(q)});return q.promise}return this.promise};return this}});Ext.define("Deft.promise.Promise",{alternateClassName:["Deft.Promise"],requires:["Deft.promise.Resolver"],statics:{when:function(a){var b;b=Ext.create("Deft.promise.Deferred");b.resolve(a);return b.promise},isPromise:function(a){return(a&&Ext.isFunction(a.then))===true},all:function(a){if(!(Ext.isArray(a)||Deft.Promise.isPromise(a))){throw new Error("Invalid parameter: expected an Array or Promise of an Array.")}return Deft.Promise.map(a,function(b){return b})},any:function(a){if(!(Ext.isArray(a)||Deft.Promise.isPromise(a))){throw new Error("Invalid parameter: expected an Array or Promise of an Array.")}return Deft.Promise.some(a,1).then(function(b){return b[0]},function(b){if(b.message==="Too few Promises were resolved."){throw new Error("No Promises were resolved.")}else{throw b}})},some:function(b,a){if(!(Ext.isArray(b)||Deft.Promise.isPromise(b))){throw new Error("Invalid parameter: expected an Array or Promise of an Array.")}if(!Ext.isNumeric(a)||a<=0){throw new Error("Invalid parameter: expected a positive integer.")}return Deft.Promise.when(b).then(function(i){var d,p,k,n,o,e,g,c,j,f,m,h,l;m=[];j=a;c=(i.length-j)+1;p=Ext.create("Deft.promise.Deferred");if(i.length<a){p.reject(new Error("Too few Promises were resolved."))}else{f=function(q){m.push(q);j--;if(j===0){d();p.resolve(m)}return q};g=function(q){c--;if(c===0){d();p.reject(new Error("Too few Promises were resolved."))}return q};d=function(){return f=g=Ext.emptyFn};o=function(q){return f(q)};n=function(q){return g(q)};for(k=h=0,l=i.length;h<l;k=++h){e=i[k];if(k in i){Deft.Promise.when(e).then(o,n)}}}return p.promise})},delay:function(a,c){var b;if(arguments.length===1){c=a;a=void 0}c=Math.max(c,0);b=Ext.create("Deft.promise.Deferred");setTimeout(function(){b.resolve(a)},c);return b.promise},timeout:function(b,d){var a,c,e;c=Ext.create("Deft.promise.Deferred");e=setTimeout(function(){if(e){c.reject(new Error("Promise timed out."))}},d);a=function(){clearTimeout(e);return e=null};Deft.Promise.when(b).then(function(f){a();c.resolve(f)},function(f){a();c.reject(f)});return c.promise},memoize:function(d,c,a){var b;b=Deft.util.Function.memoize(d,c,a);return function(){return Deft.Promise.all(Ext.Array.toArray(arguments)).then(function(e){return b.apply(c,e)})}},map:function(a,b){if(!(Ext.isArray(a)||Deft.Promise.isPromise(a))){throw new Error("Invalid parameter: expected an Array or Promise of an Array.")}if(!Ext.isFunction(b)){throw new Error("Invalid parameter: expected a function.")}return Deft.Promise.when(a).then(function(d){var k,h,c,g,j,f,e,i;g=d.length;f=new Array(d.length);k=Ext.create("Deft.promise.Deferred");if(!g){k.resolve(f)}else{j=function(m,l){return Deft.Promise.when(m).then(function(n){return b(n,l,f)}).then(function(n){f[l]=n;if(!--g){k.resolve(f)}return n},k.reject)};for(h=e=0,i=d.length;e<i;h=++e){c=d[h];if(h in d){j(d[h],h)}else{g--}}}return k.promise})},reduce:function(b,c,a){var d;if(!(Ext.isArray(b)||Deft.Promise.isPromise(b))){throw new Error("Invalid parameter: expected an Array or Promise of an Array.")}if(!Ext.isFunction(c)){throw new Error("Invalid parameter: expected a function.")}d=arguments.length===3;return Deft.Promise.when(b).then(function(f){var e;e=[function(h,i,g){return Deft.Promise.when(h).then(function(j){return Deft.Promise.when(i).then(function(k){return c(j,k,g,f)})})}];if(d){e.push(a)}return Deft.Promise.reduceArray.apply(f,e)})},reduceArray:function(f,a){var d,g,c,e,b;c=0;g=Object(this);e=g.length>>>0;d=arguments;if(d.length<=1){while(true){if(c in g){b=g[c++];break}if(++c>=e){throw new TypeError("Reduce of empty array with no initial value")}}}else{b=d[1]}while(c<e){if(c in g){b=f(b,g[c],c,g)}c++}return b}},constructor:function(b){var a;a=function(c){Deft.util.Function.nextTick(function(){throw c})};this.then=function(g,c,f,d){var e;if(arguments.length===1&&Ext.isObject(arguments[0])){e=arguments[0],g=e.success,c=e.failure,f=e.progress,d=e.scope}if(d!=null){if(Ext.isFunction(g)){g=Ext.Function.bind(g,d)}if(Ext.isFunction(c)){c=Ext.Function.bind(c,d)}if(Ext.isFunction(f)){f=Ext.Function.bind(f,d)}}return b.then(g,c,f)};this.otherwise=function(c,d){var e;if(arguments.length===1&&Ext.isObject(arguments[0])){e=arguments[0],c=e.fn,d=e.scope}if(d!=null){c=Ext.Function.bind(c,d)}return b.then(null,c)};this.always=function(c,d){var e;if(arguments.length===1&&Ext.isObject(arguments[0])){e=arguments[0],c=e.fn,d=e.scope}if(d!=null){c=Ext.Function.bind(c,d)}return b.then(function(g){var f;try{c()}catch(h){f=h;a(f)}return g},function(g){var f;try{c()}catch(h){f=h;a(f)}throw g})};this.done=function(){b.then(null,a)};this.cancel=function(c){if(c==null){c=null}b.reject(new CancellationError(c))};this.log=function(c){if(c==null){c=""}return b.then(function(d){Deft.Logger.log(""+(c||"Promise")+" resolved with value: "+d);return d},function(d){Deft.Logger.log(""+(c||"Promise")+" rejected with reason: "+d);throw d})};return this},then:Ext.emptyFn,otherwise:Ext.emptyFn,always:Ext.emptyFn,done:Ext.emptyFn,cancel:Ext.emptyFn,log:Ext.emptyFn},function(){var a;if(Array.prototype.reduce!=null){this.reduceArray=Array.prototype.reduce}a=typeof exports!=="undefined"&&exports!==null?exports:window;a.CancellationError=function(b){if(Error.captureStackTrace){Error.captureStackTrace(this,CancellationError)}this.name="Canceled";this.message=b};a.CancellationError.prototype=new Error();a.CancellationError.constructor=a.CancellationError});Ext.define("Deft.promise.Deferred",{alternateClassName:["Deft.Deferred"],requires:["Deft.promise.Resolver"],statics:{resolve:function(b){var a;a=Ext.create("Deft.promise.Deferred");a.resolve(b);return a.promise},reject:function(b){var a;a=Ext.create("Deft.promise.Deferred");a.reject(b);return a.promise}},promise:null,constructor:function(){var a;a=Ext.create("Deft.promise.Resolver");this.promise=a.promise;this.resolve=function(b){return a.resolve(b)};this.reject=function(b){return a.reject(b)};this.update=function(b){return a.update(b)};return this},resolve:Ext.emptyFn,reject:Ext.emptyFn,update:Ext.emptyFn,getPromise:function(){return this.promise}});var __slice=[].slice;Ext.define("Deft.promise.Chain",{alternateClassName:["Deft.Chain"],requires:["Deft.promise.Promise"],statics:{sequence:function(){var a,b,c;b=arguments[0],c=arguments[1],a=3<=arguments.length?__slice.call(arguments,2):[];if(c==null){c=null}return Deft.Promise.reduce(b,function(d,e){if(!Ext.isFunction(e)){throw new Error("Invalid parameter: expected a function.")}return Deft.Promise.when(e.apply(c,a)).then(function(f){d.push(f);return d})},[])},parallel:function(){var a,b,c;b=arguments[0],c=arguments[1],a=3<=arguments.length?__slice.call(arguments,2):[];if(c==null){c=null}return Deft.Promise.map(b,function(d){if(!Ext.isFunction(d)){throw new Error("Invalid parameter: expected a function.")}return d.apply(c,a)})},pipeline:function(b,a,c){if(c==null){c=null}return Deft.Promise.reduce(b,function(e,d){if(!Ext.isFunction(d)){throw new Error("Invalid parameter: expected a function.")}return d.call(c,e)},a)}}});

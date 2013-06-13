// Generated by CoffeeScript 1.6.3
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* A lightweight Application template class for use with Ext JS.
*/

Ext.define('Deft.mvc.Application', {
  alternateClassName: ['Deft.Application'],
  /**
  	* Indicates whether this Application instance has been initialized.
  */

  initialized: false,
  /**
  	* @param {Object} [config] Configuration object.
  */

  constructor: function(config) {
    if (config == null) {
      config = {};
    }
    this.initConfig(config);
    Ext.onReady(function() {
      this.init();
      this.initialized = true;
    }, this);
    return this;
  },
  /**
  	* Initialize the Application
  */

  init: function() {}
});

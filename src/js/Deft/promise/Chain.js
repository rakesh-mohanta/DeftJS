// Generated by CoffeeScript 1.6.3
/*
Copyright (c) 2012 [DeftJS Framework Contributors](http://deftjs.org)
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).

sequence(), parallel(), pipeline() methods adapted from:
[when.js](https://github.com/cujojs/when)
Copyright (c) B Cavalier & J Hann
Open source under the [MIT License](http://en.wikipedia.org/wiki/MIT_License).
*/

/**
* Utility class with static methods to create chains of {@link Deft.promise.Promise}s.
*/

var __slice = [].slice;

Ext.define('Deft.promise.Chain', {
  alternateClassName: ['Deft.Chain'],
  requires: ['Deft.promise.Promise'],
  statics: {
    /**
    		* Execute an Array (or {@link Deft.promise.Promise} of an Array) of functions sequentially.
    		* The specified functions may optionally return their results as {@link Deft.promise.Promise}s.
    		* Returns a {@link Deft.promise.Promise} of an Array of results for each function call (in the same order).
    */

    sequence: function() {
      var args, fns, scope;
      fns = arguments[0], scope = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (scope == null) {
        scope = null;
      }
      return Deft.Promise.reduce(fns, function(results, fn) {
        if (!Ext.isFunction(fn)) {
          throw new Error('Invalid parameter: expected a function.');
        }
        return Deft.Promise.when(fn.apply(scope, args)).then(function(result) {
          results.push(result);
          return results;
        });
      }, []);
    },
    /**
    		* Execute an Array (or {@link Deft.promise.Promise} of an Array) of functions in parallel.
    		* The specified functions may optionally return their results as {@link Deft.promise.Promise}s.
    		* Returns a {@link Deft.promise.Promise} of an Array of results for each function call (in the same order).
    */

    parallel: function() {
      var args, fns, scope;
      fns = arguments[0], scope = arguments[1], args = 3 <= arguments.length ? __slice.call(arguments, 2) : [];
      if (scope == null) {
        scope = null;
      }
      return Deft.Promise.map(fns, function(fn) {
        if (!Ext.isFunction(fn)) {
          throw new Error('Invalid parameter: expected a function.');
        }
        return fn.apply(scope, args);
      });
    },
    /**
    		* Execute an Array (or {@link Deft.promise.Promise} of an Array) of functions as a pipeline, where each function's result is passed to the subsequent function as input.
    		* The specified functions may optionally return their results as {@link Deft.promise.Promise}s.
    		* Returns a {@link Deft.promise.Promise} of the result value for the final function in the pipeline.
    */

    pipeline: function(fns, initialValue, scope) {
      if (scope == null) {
        scope = null;
      }
      return Deft.Promise.reduce(fns, function(value, fn) {
        if (!Ext.isFunction(fn)) {
          throw new Error('Invalid parameter: expected a function.');
        }
        return fn.call(scope, value);
      }, initialValue);
    }
  }
});

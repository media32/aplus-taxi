/*!
 * jQuery JavaScript Library v1.4.4
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Thu Nov 11 19:04:53 2010 -0500
 */
(function( window, undefined ) {

// Use the correct document accordingly with window argument (sandbox)
var document = window.document;
var jQuery = (function() {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^(?:[^<]*(<[\w\W]+>)[^>]*$|#([\w\-]+)$)/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,
	rwhite = /\s/,

	// Used for trimming whitespace
	trimLeft = /^\s+/,
	trimRight = /\s+$/,

	// Check for non-word characters
	rnonword = /\W/,

	// Check for digits
	rdigit = /\d/,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// JSON RegExp
	rvalidchars = /^[\],:{}\s]*$/,
	rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
	rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
	rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

	// Useragent RegExp
	rwebkit = /(webkit)[ \/]([\w.]+)/,
	ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/,
	rmsie = /(msie) ([\w.]+)/,
	rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwn = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	trim = String.prototype.trim,
	indexOf = Array.prototype.indexOf,
	
	// [[Class]] -> type pairs
	class2type = {};

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context && document.body ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = jQuery.buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document #6963
					if ( elem && elem.parentNode ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && !rnonword.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.4",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
	
	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	 var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,
	
	// Handle when the DOM is ready
	ready: function( wait ) {
		// A third-party is pushing the ready event forwards
		if ( wait === true ) {
			jQuery.readyWait--;
		}

		// Make sure that the DOM is not already loaded
		if ( !jQuery.readyWait || (wait !== true && !jQuery.isReady) ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 1 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			if ( wait !== true && --jQuery.readyWait > 0 ) {
				return;
			}

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn,
					i = 0,
					ready = readyList;

				// Reset the list of functions
				readyList = null;

				while ( (fn = ready[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Trigger any bound ready events
				if ( jQuery.fn.trigger ) {
					jQuery( document ).trigger( "ready" ).unbind( "ready" );
				}
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			return setTimeout( jQuery.ready, 1 );
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray || function( obj ) {
		return jQuery.type(obj) === "array";
	},

	// A crude way of determining if an object is a window
	isWindow: function( obj ) {
		return obj && typeof obj === "object" && "setInterval" in obj;
	},

	isNaN: function( obj ) {
		return obj == null || !rdigit.test( obj ) || isNaN( obj );
	},

	type: function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor &&
			!hasOwn.call(obj, "constructor") &&
			!hasOwn.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( rvalidchars.test(data.replace(rvalidescape, "@")
			.replace(rvalidtokens, "]")
			.replace(rvalidbraces, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	// Use native String.trim function wherever possible
	trim: trim ?
		function( text ) {
			return text == null ?
				"" :
				trim.call( text );
		} :

		// Otherwise use our own trimming functionality
		function( text ) {
			return text == null ?
				"" :
				text.toString().replace( trimLeft, "" ).replace( trimRight, "" );
		},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
			var type = jQuery.type(array);

			if ( array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow( array ) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length,
			j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [], retVal;
		inv = !!inv;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			retVal = !!callback( elems[ i ], i );
			if ( inv !== retVal ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Mutifunctional method to get and set values to a collection
	// The value/s can be optionally by executed if its a function
	access: function( elems, key, value, exec, fn, pass ) {
		var length = elems.length;
	
		// Setting many attributes
		if ( typeof key === "object" ) {
			for ( var k in key ) {
				jQuery.access( elems, k, key[k], exec, fn, value );
			}
			return elems;
		}
	
		// Setting one attribute
		if ( value !== undefined ) {
			// Optionally, function values get executed if exec is true
			exec = !pass && exec && jQuery.isFunction(value);
		
			for ( var i = 0; i < length; i++ ) {
				fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
			}
		
			return elems;
		}
	
		// Getting an attribute
		return length ? fn( elems[0], key ) : undefined;
	},

	now: function() {
		return (new Date()).getTime();
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = rwebkit.exec( ua ) ||
			ropera.exec( ua ) ||
			rmsie.exec( ua ) ||
			ua.indexOf("compatible") < 0 && rmozilla.exec( ua ) ||
			[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// Verify that \s matches non-breaking spaces
// (IE fails on this test)
if ( !rwhite.test( "\xA0" ) ) {
	trimLeft = /^[\s\xA0]+/;
	trimRight = /[\s\xA0]+$/;
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch(e) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

// Expose jQuery to the global object
return (window.jQuery = window.$ = jQuery);

})();


(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + jQuery.now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0],
		select = document.createElement("select"),
		opt = select.appendChild( document.createElement("option") );

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: opt.selected,

		// Will be defined later
		deleteExpando: true,
		optDisabled: false,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null,
		inlineBlockNeedsLayout: false,
		shrinkWrapBlocks: false,
		reliableHiddenOffsets: true
	};

	// Make sure that the options inside disabled selects aren't marked as disabled
	// (WebKit marks them as diabled)
	select.disabled = true;
	jQuery.support.optDisabled = !opt.disabled;

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete script.test;

	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;

		if ( "zoom" in div.style ) {
			// Check if natively block-level elements act like inline-block
			// elements when setting their display to 'inline' and giving
			// them layout
			// (IE < 8 does this)
			div.style.display = "inline";
			div.style.zoom = 1;
			jQuery.support.inlineBlockNeedsLayout = div.offsetWidth === 2;

			// Check if elements with layout shrink-wrap their children
			// (IE 6 does this)
			div.style.display = "";
			div.innerHTML = "<div style='width:4px;'></div>";
			jQuery.support.shrinkWrapBlocks = div.offsetWidth !== 2;
		}

		div.innerHTML = "<table><tr><td style='padding:0;display:none'></td><td>t</td></tr></table>";
		var tds = div.getElementsByTagName("td");

		// Check if table cells still have offsetWidth/Height when they are set
		// to display:none and there are still other visible table cells in a
		// table row; if so, offsetWidth/Height are not reliable for use when
		// determining if an element has been hidden directly using
		// display:none (it is still safe to use offsets if a parent element is
		// hidden; don safety goggles and see bug #4512 for more information).
		// (only IE 8 fails this test)
		jQuery.support.reliableHiddenOffsets = tds[0].offsetHeight === 0;

		tds[0].style.display = "";
		tds[1].style.display = "none";

		// Check if empty table cells still have offsetWidth/Height
		// (IE < 8 fail this test)
		jQuery.support.reliableHiddenOffsets = jQuery.support.reliableHiddenOffsets && tds[0].offsetHeight === 0;
		div.innerHTML = "";

		document.body.removeChild( div ).style.display = "none";
		div = tds = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) {
		var el = document.createElement("div");
		eventName = "on" + eventName;

		var isSupported = (eventName in el);
		if ( !isSupported ) {
			el.setAttribute(eventName, "return;");
			isSupported = typeof el[eventName] === "function";
		}
		el = null;

		return isSupported;
	};

	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();



var windowData = {},
	rbrace = /^(?:\{.*\}|\[.*\])$/;

jQuery.extend({
	cache: {},

	// Please use with caution
	uuid: 0,

	// Unique for each copy of jQuery on the page	
	expando: "jQuery" + jQuery.now(),

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		// Ban all objects except for Flash (which handle expandos)
		"object": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var isNode = elem.nodeType,
			id = isNode ? elem[ jQuery.expando ] : null,
			cache = jQuery.cache, thisCache;

		if ( isNode && !id && typeof name === "string" && data === undefined ) {
			return;
		}

		// Get the data from the object directly
		if ( !isNode ) {
			cache = elem;

		// Compute a unique ID for the element
		} else if ( !id ) {
			elem[ jQuery.expando ] = id = ++jQuery.uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			if ( isNode ) {
				cache[ id ] = jQuery.extend(cache[ id ], name);

			} else {
				jQuery.extend( cache, name );
			}

		} else if ( isNode && !cache[ id ] ) {
			cache[ id ] = {};
		}

		thisCache = isNode ? cache[ id ] : cache;

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( !jQuery.acceptData( elem ) ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var isNode = elem.nodeType,
			id = isNode ? elem[ jQuery.expando ] : elem,
			cache = jQuery.cache,
			thisCache = isNode ? cache[ id ] : id;

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( isNode && jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( isNode && jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );

			// Completely remove the data cache
			} else if ( isNode ) {
				delete cache[ id ];

			// Remove all fields from the object
			} else {
				for ( var n in elem ) {
					delete elem[ n ];
				}
			}
		}
	},

	// A method for determining if a DOM node can handle the data expando
	acceptData: function( elem ) {
		if ( elem.nodeName ) {
			var match = jQuery.noData[ elem.nodeName.toLowerCase() ];

			if ( match ) {
				return !(match === true || elem.getAttribute("classid") !== match);
			}
		}

		return true;
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var data = null;

		if ( typeof key === "undefined" ) {
			if ( this.length ) {
				var attr = this[0].attributes, name;
				data = jQuery.data( this[0] );

				for ( var i = 0, l = attr.length; i < l; i++ ) {
					name = attr[i].name;

					if ( name.indexOf( "data-" ) === 0 ) {
						name = name.substr( 5 );
						dataAttr( this[0], name, data[ name ] );
					}
				}
			}

			return data;

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			// Try to fetch any internally stored data first
			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
				data = dataAttr( this[0], key, data );
			}

			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;

		} else {
			return this.each(function() {
				var $this = jQuery( this ),
					args = [ parts[0], value ];

				$this.triggerHandler( "setData" + parts[1] + "!", args );
				jQuery.data( this, key, value );
				$this.triggerHandler( "changeData" + parts[1] + "!", args );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});

function dataAttr( elem, key, data ) {
	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		data = elem.getAttribute( "data-" + key );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
				data === "false" ? false :
				data === "null" ? null :
				!jQuery.isNaN( data ) ? parseFloat( data ) :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			jQuery.data( elem, key, data );

		} else {
			data = undefined;
		}
	}

	return data;
}




jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});




var rclass = /[\n\t]/g,
	rspaces = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /^(?:href|src|style)$/,
	rtype = /^(?:button|input)$/i,
	rfocusable = /^(?:button|input|object|select|textarea)$/i,
	rclickable = /^a(?:rea)?$/i,
	rradiocheck = /^(?:radio|checkbox)$/i;

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};

jQuery.fn.extend({
	attr: function( name, value ) {
		return jQuery.access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ",
							setClass = elem.className;

						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split( rspaces );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					state = stateVal,
					classNames = value.split( rspaces );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( !arguments.length ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						// Don't return options that are disabled or in a disabled optgroup
						if ( option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && 
								(!option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" )) ) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";
			} else if ( typeof val === "number" ) {
				val += "";
			} else if ( jQuery.isArray(val) ) {
				val = jQuery.map(val, function (value) {
					return value == null ? "" : value + "";
				});
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// These attributes require special treatment
		var special = rspecialurl.test( name );

		// Safari mis-reports the default selected property of an option
		// Accessing the parent's selectedIndex property fixes it
		if ( name === "selected" && !jQuery.support.optSelected ) {
			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				// Make sure that it also works with optgroups, see #5701
				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}

		// If applicable, access the attribute via the DOM 0 way
		// 'in' checks fail in Blackberry 4.7 #6931
		if ( (name in elem || elem[ name ] !== undefined) && notxml && !special ) {
			if ( set ) {
				// We can't allow the type property to be changed (since it causes problems in IE)
				if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
					jQuery.error( "type property can't be changed" );
				}

				if ( value === null ) {
					if ( elem.nodeType === 1 ) {
						elem.removeAttribute( name );
					}

				} else {
					elem[ name ] = value;
				}
			}

			// browsers index elements by id/name on forms, give priority to attributes.
			if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
				return elem.getAttributeNode( name ).nodeValue;
			}

			// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
			// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
			if ( name === "tabIndex" ) {
				var attributeNode = elem.getAttributeNode( "tabIndex" );

				return attributeNode && attributeNode.specified ?
					attributeNode.value :
					rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
						0 :
						undefined;
			}

			return elem[ name ];
		}

		if ( !jQuery.support.style && notxml && name === "style" ) {
			if ( set ) {
				elem.style.cssText = "" + value;
			}

			return elem.style.cssText;
		}

		if ( set ) {
			// convert the value to a string (all browsers do this but IE) see #1070
			elem.setAttribute( name, "" + value );
		}

		// Ensure that missing attributes return undefined
		// Blackberry 4.7 returns "" from getAttribute #6938
		if ( !elem.attributes[ name ] && (elem.hasAttribute && !elem.hasAttribute( name )) ) {
			return undefined;
		}

		var attr = !jQuery.support.hrefNormalized && notxml && special ?
				// Some attributes require a special call on IE
				elem.getAttribute( name, 2 ) :
				elem.getAttribute( name );

		// Non-existent attributes return null, we normalize to undefined
		return attr === null ? undefined : attr;
	}
});




var rnamespaces = /\.(.*)$/,
	rformElems = /^(?:textarea|input|select)$/i,
	rperiod = /\./g,
	rspace = / /g,
	rescape = /[^\w\s.|`]/g,
	fcleanup = function( nm ) {
		return nm.replace(rescape, "\\$&");
	},
	focusCounts = { focusin: 0, focusout: 0 };

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( jQuery.isWindow( elem ) && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		if ( handler === false ) {
			handler = returnFalse;
		} else if ( !handler ) {
			// Fixes bug #7229. Fix recommended by jdalton
		  return;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		// Use a key less likely to result in collisions for plain JS objects.
		// Fixes bug #7150.
		var eventKey = elem.nodeType ? "events" : "__events__",
			events = elemData[ eventKey ],
			eventHandle = elemData.handle;
			
		if ( typeof events === "function" ) {
			// On plain objects events is a fn that holds the the data
			// which prevents this data from being JSON serialized
			// the function does not need to be called, it just contains the data
			eventHandle = events.handle;
			events = events.events;

		} else if ( !events ) {
			if ( !elem.nodeType ) {
				// On plain objects, create a fn that acts as the holder
				// of the values to avoid JSON serialization of event data
				elemData[ eventKey ] = elemData = function(){};
			}

			elemData.events = events = {};
		}

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			if ( !handleObj.guid ) {
				handleObj.guid = handler.guid;
			}

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		if ( handler === false ) {
			handler = returnFalse;
		}

		var ret, type, fn, j, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			eventKey = elem.nodeType ? "events" : "__events__",
			elemData = jQuery.data( elem ),
			events = elemData && elemData[ eventKey ];

		if ( !elemData || !events ) {
			return;
		}
		
		if ( typeof events === "function" ) {
			elemData = events;
			events = events.events;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)");
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( typeof elemData === "function" ) {
				jQuery.removeData( elem, eventKey );

			} else if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[ jQuery.expando ] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = elem.nodeType ?
			jQuery.data( elem, "handle" ) :
			(jQuery.data( elem, "__events__" ) || {}).handle;

		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
					event.preventDefault();
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (inlineError) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var old,
				target = event.target,
				targetType = type.replace( rnamespaces, "" ),
				isClick = jQuery.nodeName( target, "a" ) && targetType === "click",
				special = jQuery.event.special[ targetType ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ targetType ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + targetType ];

						if ( old ) {
							target[ "on" + targetType ] = null;
						}

						jQuery.event.triggered = true;
						target[ targetType ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (triggerError) {}

				if ( old ) {
					target[ "on" + targetType ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace_re, events,
			namespace_sort = [],
			args = jQuery.makeArray( arguments );

		event = args[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace_sort = namespaces.slice(0).sort();
			namespace_re = new RegExp("(^|\\.)" + namespace_sort.join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		event.namespace = event.namespace || namespace_sort.join(".");

		events = jQuery.data(this, this.nodeType ? "events" : "__events__");

		if ( typeof events === "function" ) {
			events = events.events;
		}

		handlers = (events || {})[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace_re.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, args );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			// Fixes #1925 where srcElement might not be defined either
			event.target = event.srcElement || document;
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement,
				body = document.body;

			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( event.which == null && (event.charCode != null || event.keyCode != null) ) {
			event.which = event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this,
					liveConvert( handleObj.origType, handleObj.selector ),
					jQuery.extend({}, handleObj, {handler: liveHandler, guid: handleObj.handler.guid}) ); 
			},

			remove: function( handleObj ) {
				jQuery.event.remove( this, liveConvert( handleObj.origType, handleObj.selector ), handleObj );
			}
		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( jQuery.isWindow( this ) ) {
					this.onbeforeunload = eventHandle;
				}
			},

			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

jQuery.removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		if ( elem.removeEventListener ) {
			elem.removeEventListener( type, handle, false );
		}
	} : 
	function( elem, type, handle ) {
		if ( elem.detachEvent ) {
			elem.detachEvent( "on" + type, handle );
		}
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();

		// otherwise set the returnValue property of the original event to false (IE)
		} else {
			e.returnValue = false;
		}
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target,
						type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						e.liveFired = undefined;
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !rformElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			e.liveFired = undefined;
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			beforedeactivate: testChange,

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return rformElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return rformElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;

	// Handle when the input is .focus()'d
	changeFilters.focus = changeFilters.beforeactivate;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				if ( focusCounts[fix]++ === 0 ) {
					document.addEventListener( orig, handler, true );
				}
			}, 
			teardown: function() { 
				if ( --focusCounts[fix] === 0 ) {
					document.removeEventListener( orig, handler, true );
				}
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.trigger( e, null, e.target );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) || data === false ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments,
			i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );
		
		if ( typeof types === "object" && !types.preventDefault ) {
			for ( var key in types ) {
				context[ name ]( key, data, types[key], selector );
			}
			
			return this;
		}

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				for ( var j = 0, l = context.length; j < l; j++ ) {
					jQuery.event.add( context[j], "live." + liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				}

			} else {
				// unbind live handler
				context.unbind( "live." + liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	};
});

function liveHandler( event ) {
	var stop, maxLevel, related, match, handleObj, elem, j, i, l, data, close, namespace, ret,
		elems = Rİ,
		sgdåc|/vc <°Zı,
		aöe~4s = jQõevi.dqpa/tlas, tiis&nkd%Uyre`? "oVenôs¢ : .Wavents__" );

	id4,typõmæ mfonta ==! fun#tiojb © {
	eventC-5 aöens,åvåS?
9|Š
	/ Íak%!supå we*avoidà.o/huft-cloak â%nBmaşg¤In Firef/| ("s8¶!)
if 8 e6gnt.ìavGirat == ôhir <| !events ü|à!mvmjôr®liVg ||0avent®bõt~on v eventnty e === "click¢ i 
	rdt5{? Ù|š	
	i`à( %venp.lamecy`cap)'{
	I`amocr`óa =%nås RåGExy(¢(Ş|_\.)2 + mFelt$nAmespáce.s@mit(2").jÿiî("L\&(?:.+\.¹3")"+$ ¨X\~$-"9:š	}

mrõNt.liwaF)zel = ôhms;
	vaz live =!eventsnive.slige-093Š
	&op (±J = 0; j > nave~,e.gth; b++ !`z
	(andlåOrJ&< hivm[k];
		if 8 xan$mdo`z.origÔype/bepl`c%( rfáiu2pagas(à"& - === gfgnt&tyyE!)0y
			seüactorw.ğuóH) haî`|%Obk.salekto20(ÿ
		} aìce {
		‰love.splige* ê)m01&);
	}
}
)mitch¤= jUugpù(°ewenTntabget ).c,oSgsô `Cmlmct/rS, evõjt.c5zrånôTirgaô )

	bop ("i 5 0, l = maôcmm!ngth; i | |;(i++ )àK	c|ose$-)añtóh[i]:

)	gor ¨ z = 43`h <"litõ(l%ngth{ ê++ ) {
I	`antdubJ.< dù6eKnY;
			md0( cmOwd>qule#|fr === la~dl%Obj&sdìectop°&f (!o`íeópacg |p .emmpp`ce.Tepô(0handleOöj..cmeqpke !9 ) {
				u,em"=`cìosE.eìaí;
		relc4gd 9 nuLn;
=		/%0Phoe*two eweops r%qUore ádditional$clesiùo
	Y	éF+()(qjdlmOrh®pò%]ypa ===("moõRå%o4gR" ü| hgläheOnJ.pòeTYrE&9== "mOwre,õAve" é {
			aö%nt.pype = handleOBn.p`eType3Ê	É			ralatee = jQõEry* åvå.u.z%|atedTepget -.klosåst(!handlejh®re,gueò )K>];			

				if ) !relgtgd`x| z%l`tad !== ålem )"{J			ohems.uesh(q elem8 elem$,hendleObhº øandleÏbj,)lerõh: klore,lEvel ı);
				}
		}
	q
	}

	foò ( i ½ 0, ,$= uhems.ld~eth? é < +!I+ğ(#	imápc(!°dlaos[	};J
		iF  biaxO%vdl / mátãh/eåh 8(MihÌdvel ) {
_	"zeac;
	}

	Ie~eîD®cõprnDtAòdm4(<àhqtcH.|d}2	Eve~p/i4c = }atCè.ùandleO`j.l!ta;
;	o$ent(èandlaobj = m!ôch&i!nDldO`n

‰	r`t = maô`hhAnd|eOj.opieIanler*i`p,y( egtkH.a|`o!aògõieN~3 !» 		iv ( {et ½9? f!lSe üx&Evnp.isPw/p`gaIoÓtïpqem(© i {
‰	máxLEvEl = ma|Ax$leve|*
		If h óeu ?== vamse ù û
		stïp )fálsd;
		uZ		kf0 àavEot®isAm-e$iateXboádatkmoôcpped,)`) z
				bòeak;
	éy
		MJ}	vturj,S|p;Jt
n!~ction livåCoeò4( }iye< semecDor0(#
	r`ôurl"(uypa,$/ ôype-!?= "z"$¡Typu / ..b z ""- k semeo4or.ru m!sa(rtEz)d| >`&)nråplac%xpópyCmà æ"--
zQ}Er9>añcj!("bluv foceó fokUsan fkeójup.,oaô resIzE rcrï,m ul|amd(bliãi/djlãléak # k
‰ moucgdotn m/ureup mouseaofm mkupeov%r mbuCeOut0mo%{Euntdv m/uselmAe  °
	ªcé`~ge seldst!S}mit ke{Dvn o}pr`ss$eIõ0ğdrrorú)¾pxlmT8"`"/, Fõfcto/o(`h, o!oE (à{

/ èanDlea`veot$bijôiog	zAu%ry/F~Yğbame } = fncthon( daôa< f.$ps
 )n 8 fn$<= ~qnl¥	#;
)	fn*=`dátk+	)	äata - nõln;
	‰}
		return Argulånus/åjgth > p ?
			thas.bIod( ~ame, daôa- fN ) :
			ôhiS.tsigcer( nama );
	];

	if!( jñue}atôrF. )`z		JQ5åry"ittFj[ nm%`\ 9.t~Eå:š	}
}); &/ Prev÷nt m%moòy&leaks hn K
-/ Wiodot1hsN' included ól$as not ~ unbmfm eiqtiog 5nload mvåntb
/ Íere%infï
%/  -phtty*//éraakch|uåper.#oi/056/10/iwiememori-Låakq/
éF0(àtiNdow*at|akHEveft . !wanDow.aädE&ont@iq|eneò ù {
jQuåryindou)bin`8"}Nmoadâ$$F÷ncpico() {)	nor ( vaò iD hn jQweòy.bache )ğ{
		if¤ *Suery*cAge[`il _.handne() k*			// TpyKat#h is!t haodoe1hvra-e0båing"uoloamem, sge)#>2x0	tòypz
		IjQwe~y.eveot.redotu(!juqår}kcheA-id ]&handl%>a|am )
	Im8catch)E) {yÚ		}
		}])+}Ê 
/*! * [Izzü`0C_+SelectOr engiî%$ rq <
 *  Ão~yz)ghô 2009, Ôhe Mojo @oundátimn
 *0 Selei1e` dnde phe(MOT, rSD,(a~d`FPL$icensE{.
 : $Mïrå énf/smapinn(ôpp:/{IzzlenS.com/
$*/
(fõnctko~(éx

v!ò chu.keò = /((-z\¨(?*_([\x)]^)|S~()+)k\i|\[(z\[[^\[\]]*_|['2]ÛR/"]*{%b]|^\[\]##]/)ëP]|^/|[V :/>,\[\\]+)+|[>!~M+(|p*,\c*)?((>;.|\p|\n)*)/a|$onå = 0,	}/Stòao'*5 MâJmct*ğrïtod{pu&toS4wişf¬
(irDtplk#ete ı vAlqå(
naseÈasupnicatE(- tru÷;

//°Herg we4bheck aæ thm J`vaÓwitt ening éq u{ing0qolí slrp`/o
//àkğimoxáty/n whepe md deó n/u qhwayc"aa`ì our compmrisyin
/"funstin,¡If thitàis |hm caóe- lhscabe |he h!wDwpìicAve(vqluE/
/'0 pTh5 f`ò }(ap iîCn5das GooGna B|Romg"^S°,%].smòT(f}jcpy/n() û
‹BkseHarÄev,iañtõ ? f`lqe	s`ôur" ?});
vcp°Sizzlg ı æ5n#ôiïH( wem`s`ob- kmntõ(ô rerõ|#, saed!)/x:	r%{%opó ½ s%pìtû ||(Z]8Š	contõxô = knîdåxv ~x``ocumelô*ª
Vir lrigConteüt -"cohtEd?	ùf8(!aoht%xt.nodåTpe ¡9½ 3 '&!covEyt.jïdgDpe !== 9 ¹ {
	zdtarn#[]8j	}
	
if ¨ eCoheaôov |d pùpmg óaüktop0 =-stòin'# / û
		returnğ2euHtrû
	-K	ra&/ óeô&ClackS%t `xtòa, seô,0cwR, pcğ$ i,
		ğruNe = truE<
		cOntepôXíL(--Sirú,oipXI\( CoNtext$).
9	ğavts } [,
	skÆar = óeìegTop;É
I/ Òds%| vhe ğ.s)uhoh(/f |hå whunker reoexp°(start æpM hoad)Ê	mo,Y	)Clenkep.exec ` " )	m0$#juşjår.a|dã( coarğ!;

	iv h m - û
™	SoDir &-_1ı3J		
			pñRtc/põsh(-_1] );
		
É		if ( m[2] )!{Z‰		%~tòa - e[3}9ª	break;
	|Š	-
} whk,e ( í )
‰if ( paúts.menfth0> 1 &6 ÿrk'POÓ.exec( salEc4or )0)(k
 		é&&$párôs.lgngph == 2 f& Expò.r%mativaÛ pató[0M ]! °y		s!t ½ t/Prkcess( paòdw[4U ) pertsÛ1], Conteøt 	?

	} elrå {
	pepà--ExPr.rema|ive{ tartóCp ]">z				J#cojtey4 ] :ª				SéxúLg( pa`uc.sjaæp,)- gc~tuxu -:

I	7ii|!0((pirôq.lmnoth i {
	™ó%lecto0 )parôq¾soifp();

		™iæ , E8ğr¾re$ipéTåK$celector ] 9 û
				)rå,m#tir +-!pgpôq.3h)ot();
		}
‰			
		cet 5°pcX"o`åsó"Sglec|/r,2qåt (;
		|:	}

	}ôelcg {
	//"Pqkõ a s`ort#ut and sot tèa contexp`if uhe òkoT"releCtoz ùs`an [D
		// +but`.ot&if éT',m baàfac}er ùF ke0aşNoR*qehåC|or és an O@©
		kf (q!ó%g#"& ğardw.ìa~~H/& 1¤& cintextnnddTipe.=ı= 9*& !cï&t%xpXIì &
	‰		Expr,matCh.IDîtås|(qaòps[=]) f$0!Exxr®match.	ttwT,papt!_`crts.lmngpè m 5) 9 û
		 òdt = Shúzl.Fijd(`pabur®shig4()l son4gxt,`conôaøtXML );
		kontext = ret$expR 5ª			Cixzlefiltår( ret.åxğb- reô.se~ -[0X 
			yrõt.Cet{0İ	}
		if(( cïFtext ! {		påp$ Cedä ?
		™{ }8qr: ğarTs.poğ -, åp: m!kEárray({Eedo  :	_	~züe®fid4pár|S.0ïpi)- qaòts.lnGt`°==$ && (PaBôsÛ0] == ò|* |l`pqrus[} =4= "b)p&' oonpeX~.|!ò`ştNOde 10botexp>pg@e.ôFïdg > co~teH|,àcofu|TxHM -+
	iret!= rut.Ex@r ?			×izrme/Fmdtd{( ret>E}pz°re`.Cet )°:			‰Råt/ce`{

			mf  `pctS>låjoti > 0 ) 
) 		ohec{Såt!=-májeAsáY8 sd| );Š		m+e|se {
	)	pRuNe = æamCo;
 		}
I	÷hkLm 8 ôarD{.ìdnetH$) sZ	Curğ5$@çrtq.pop)){=		zğ ? cerŠÉ		mfà( !OXpb®rõladive[ !}2!] !às		Icq~ ? ""{		} el{E zJi		yoğ = xast÷&ğgy()y=

9	éif"(±pop,-½ îqld-)2kJY	òop = kOn4õpô;
		Iu
 			eppr>"e,ñpi6eK)Cur0A, c(eckSmt, pip(,CoNtextXMM )2		}

 Ù}"emsm { 		CheãaSet = pars ½ [U?
	}
I}
Iæ ( ¥chEciÓe| ) {
		khe#kQåp#=!#åp{ }
)iæ * %axdóiSet 9 {M	[)zZld.erRoRh cv |tppe,ectmr -	}K	mf)( poStrë.ç.call+chacj[E|	°1=9$[Obhect Arr`y& - {IiF&(p ğrwne ) {
			Rusõd~C¯puph.c0{y(ğrmS}ts, cec{Ret!)?
	)})emSe id¨¥Clôex && cno4uxt,nodETXğ`ğ=?=%`!`s	vjr . i = r9¥CkechSet[kM0!½ oumL; i)/ ) {
			ib  pcieckSeôZi] &¦ ¸ciecÓdtQi(}=`tr5e ||bchEkKS`tRm..odåTye =)½ 9 .& Rizzle.contiInchconvEx4, ãh}ckRåt[a]	- ) {				Iresult>põri(åt[`_ -;
			=		}
	} e|rm {
		¹fo2a( i =$0; ãhecoCmDÛi} )=%Nu`|8¤I++¤(`z
			)iv ( cHec{Sm[)] &&%ciecaSd}[inlodeTyPe =)= 1 ¹ {
				Råq}ltc>pupi(,Cõt[i_ -	I	}		}
		}
* } gLsE sJ	mmkå@rpa	( chebkCet, re{eos ):	}
J	yF! %xtòa%	/{
	QizzLõ(ğezTra, oriGKonpext Besul|S- sdåd$	;
		Ó`zzl%nu~iyugort()bgSults()?
É}

2e4õr~ re{ulpó9
=;

Sir~,guniqwe[rt`<.&}Jcdimo( råsult)) {
if)(psor}Order0) +
	9hásDupliaápm ½ âaseHa{Dup|acAôe»
IzEwu|ts.so~th sgrtORddr =;

9if$()(asTq|lmcapõ ) {
i		`B( vár i(-(0; i < reóunTs.lengô; i++ ) {Y		ë& (°rusl~s{i] == ò`suìdwK i0%<!!\ ) {			Iòasum$s,ópmike8 i)/,-!p);			}
	m
	)}z}

	reôqrN%Råqult3;
}9J
WI~:l`/laTkhep <$fnãtéoo(#expr,(Cm0)`{
	zEttrn$mjzde($xPò$àNuLn,ğfõlm,,Såp`);
}S`~jíe~mápchmSSelekTo2`1 d}Nctijn(!node(0expr ) {	rmDup~ S)zzlah epr, nqml, îq|l. _nodeP$).ungtl > 4;Êp?

izzle.find¡<!d}nctio( gxğr< coîpext,,iX]D )!;
	öaò {et:º
©if . 1expr / û
©	r!|trn0_ }ª	gz ¨ vaz i ı 0,!,n<`Expz.orôò*o%~gôh» k < |:0i;$)°yz	&gp iñ4gH.
©	É{`g = Ex{R/orderÛ)_8ú	i
	mf`(ğmaucè = Epqr®hu&|Ma4chß t)qe X.ex%c( aø` -) )`k			öar }Eft =ğmatghÛ1}
			íatcn.{plhóe. 9`1 );

	‰	i,#`åft{5jrt2( mdft>hungk - ñ + )9½ ¢\^ )`x			aátwh[!_ } 8me4gh[1İ }|)"ò)>rmplaceê]\/e¼ b"/+‹™	¹cgt'< x@z.ghî`[ ~ira0\( oavaø( #onwext¬ i3ÜIÌ é+
	yf!/qet°!= nq|hğ	 				ehp 98%x {òeô,c#o(±Exp{.m`tbèK(dypõ İ,("* ©;Š				bpmao+
	é|
		ı9	}	|ª
İif * cre+)$r:	‰smp = aoueztngåtOeiåhôsBiTaçJa-e/"*" );
|Ê)Rmt}p~ { {%~:àced/ exppú eXvr`}»
}
Siúzle/di`ôez = öuşCiol8 å(}R/ óat,!inpìace. nkt é {
	2qr`ma$oh¬ ñN{Foaşd,
	ohd = eXzr,
‰	r%wuìt 9$[_,Š	‰cu2Lkp = Cep¬)iC\MLDiLte~ ı óe| /  råt_] f °SiZzlå.i3XMN(0SåT[0] i2
gkiìa ((eypò æ&%mt>de.o4m ù û
		flò ¨ v!{ txpe!io Åppr/fihtaz / {
		Kig ¨ ¨mqTch)< Aü`znavtma|Ch[ ty0m _,epeC) oppr0)- #8 jull && madk([2ı ) {
			vAz fkõjd0Itdm(š			÷`ì4mr*8 Eøpr.gaìper[ |ype`,
	I	leFt = íatcm[1U;

		©aîiNoujd ½ false;

			íaücj*{pìice*1,1)0Ê
			if (*ledô$s%ccvr8 lEn4.hed÷tj / ± © ?-= 2\\" ) sŠ	I		cmnpé.wE?
		Y	}
				in ( surLoop ı=} seuìpğ	 {
	‰	)	restüt  K];J	Û	-
				if ( Ex`w.rråFilter[ pype ] ) {
			‰Eatch(=àExp~.rreFél|erR`ty`e ](`ma4gH/ curo/x,`)npl`cE, res5lt, îo|,!ióXMLFilpep );
		I	mF" `!}atCh 9 {
						ñnyFound")fou~d - dsqõ;º
		 	} En#e éf0(mkpch =?-!tòqe - i			coîtinue;
			=	I¹-

		9éF (,mqpch$	&x	Y			ofr , w!z i = 0;((ytåm - aõrLoo`[iİ) != ntì`; m++ ) {
				‰	y& ( hteí ) {
i						buşd%9 filt%{( iteí,,matóh¬ k, curloP");
©					teR-piqs } o/~ ^ ¡!fOuhd1j
	+	I		if ) ibğlecm 6 °fond0!½ oum,0(`{	‰			ig ¨ pa{s )`{Ê				9É	aBoqnd,#dòue
O	I					} eló% {	i					cpòoOp[yY = Fa`óe;
								}
	ÉÉ			} eds%-If h pasS!! k
				9	‰resu`t$p%wh+ ipåm )?
‰				qdùo5o`à<°4rde;Ê						}				}
		}JI	-

‰	I	if ( foEnd*!½=àendg`ynåd(! sj					kd   !iN|hace ) {
‰	‰			ctòLo/q = òasunt?
I				}

ù			Expz ½ ex|r¿replaka( Åppr.iatch[ ôypå ]!"" ©8

		‰	Yhg ( !anxF}nt © {
		‰	ire|Uòj []+		K	}
		greak;Š|	É	}
		}
J	// iippo mB axprEóSmoî
	if (`eyv ½1½ oLl i {
			Iv ( anyFoqşd = nplh.)-kª ©		Cizz`e,mbsor(0dx@r ©9Š
	}"e|se {
		ic2eAk9J 	}
É}

		old0<$Ez@r;Z

	òate{n)upljo`;
}:
_izZüe.arBor°= `uNc4éOî -mscp) x	|hrfw "}Ntaø eR{r, uore#o`ni{Ed åpğreciïl: # « mro8
m;

váp)zpr = Si~Zle>ReLmôeòp%/k
opmer:ğ[ğ"KD', "^AME*,  T@G(],Z	mAtCh:àx
	Iä0¢"#()?zS|u\e2ã0-\}FGÆX-]|\^.i+)/,
		ÃLÁQS*#/\"((?:[\÷Tõ04c6|uFFFF^-]|\.)+)/,JNAME:à+^oame½[/"]*8(?:[\Lu0xb2-^v@fF\-_|}\.!/)_'²]*T]/?
I	QTVº ?\{\{
,(2[\w} øc0%\5NBGF|-],]>!+)\C+:xP_/=)|q:(_'+z)8*>)\³|éXs*_o$
	TI: ¿^*(?:[TwTu 0c0-\efFFF\(\%ÿl_L¾);!/,	)CHILD: /:(Mï,yLntxpla{t|bir{t)-ãhé(d(?*|((aweolodäp[\dlk\-].)\)y>/,K		oSz /:)Nt`|ayg|`t|n){côtlasT|%v`n|oDm)(5:\((Şdë)Ü)-/+/=S^\-|©#,
	ZSeTTO> /*( ?:[wLõ0ğB2^uVBÆF_-]\|\n)/))/:T8 _'£]?(¬(?_([XÜ)]\)|S~\(-k!o)^2\	);/
},
ZleötÍAtcø2){},*
ia|trMap: {
òA|aws':0"che2wqmå"-
		gbor'
+"hpmlFor 
	ı,
	atpòHendle:°z
		hòev: &unctijn(e|eí ) {
‰	)pmt}Rn ele-/GetCttRk`ute(,"href¢ )
	)iŠ	}
‰reledive:px
		+": fEnCtiol(chEãkset$PáRt {		Ivar!isartRur$`pypeOn part(=?-° ótzing"$
	IisTqf -cióPártStr0&& %/^G/.ôest( p`st$	,
				i3PartÓtrNotTaw = isĞart[tz &$ !isT!g:
		iv h kCVag ) {
	‰	ğazt)-ppar},tO\cweziSe():
		}

			gor ( ~ar i = 4,-l =0aicKSdô,leoGvh, e,oM; i < | i; 	,{j‰ Io ( (emem } óhgCkSet[i]	))ày
				w`ilm ( (düdm = ehei/pv%vaousSk|hng) ' elem.noäetyx% !=5à0 )){				c`eckSg4[i] = i3Part[tzottag ||`elao /& %l`m.ootename/doHvgrKsa(  ===¡páp| ?
‰	)		glel t| gA|se :
	Yi	glmm°1=5!pirô:J				})	}

	i	id,($isPar|S|"~itPaG() yÊ		Cirzle.f)lpõr* part| geckCåt, |rue`!?
		}=-
:I">: ftnaô)oN( s`mCkSet, |azd`) {
			vaò elmm,
©		isp`rt[dr = tq|eo& papt =-= ¢s|BiNç"<				i } 4,	)	l¡)ch`ch[eö.ídngt(;

		if(°isPiR|Str0$' %/\G/$t%sD¸ ğ`rt")ø)°{			part = ğart.$oLouårC{E(({

			fop( ;`h 4!l; y++ + {
i		eìem = ãhecoSet[)];
		iæ 8 glem ! r			Y	var!`ergfô ? ehem.`crenôNodm;
		I			ghåC{Såd[`] = ua{a~t.no$oNámå|gLk÷eòCccg(9 }== ~art /"0irånt > n`lcå;
		©	ı
				ı Š			 ulsE 		y¹foR"( :!i , d; y+/ ) û
9			elAı ? ghåaëSgd[i};*
				9if ¨ ïlõie)¡K	Ù	Ù		cjeãkSe|Ki0=0i{Pa2tSôr$/			I			elåa®`crentJode :™	)		elaípArenTNofe(=½= pmrv9j‰		}I			}

	I	iif + écpAv4[pr 9 
		YCiz~le.æio4erè pAzt, c(eckCep, tRı%&!{		}
		)=		}¼
		"*: bõNctkm~(che#kQõt¼ sard¬ iCxM(û
	fár lodgCieãi,
			äln%Name àdofe*;$			aøeskGN!=0`éCec{9

		iæ ( u){dof´0i2~ ı5= "s|rinç & ñ*Ü/.|dód¨paR~ à h;			‰parv = ğar4.$oLowårGasax);
	~nteghåak = qart{
‰			chåaën = eiro$eChaãK;
	I}>
		aø`c*O./ "`áreNuHo`e", sart, d/îaNaíe, k`eaûSm/ ~oôEKhmak(ài{XOH );
		},Š
		"~2:ğfõ.ck*n(àCheoiÓat.pgrô$´IXMHp) {
	I	v`r nodeCheck,
	‰$oNeJaiå = doîe++,
	‰	cheCkFî } lisCèacK?

	I	y" (Pypå'f xarpà===, stò(ng+ &" !/\W/®tõst pqpõ + - û
‰			p`òt <"part(toModrCqse(+;J	K	.o`å@hegk = pñRt;
			MCneokVj -%$ipnedKhgaë1
					ghgaûBî( pråvio}Siò`ijo"¬ parT, do~aNamE, khåComt} n/meKhecë$`isXÍ@ )?
	}
	=,
	vind: {		ID> oq~ctio.* íaôCh  cnôezt. ysXL / {
‰	)f ¨ tizof cïntezt.getElemådtByIn a== *undedûngd" && !kcXM\ ) 
	‰	var m } ó'ntexô.gevEnementKYId8matãh[0ı){
		o/°Cieck parenuNo`u tO #qt÷h$'ien Blackberòi'4.6 redurns
				/ nod%s vhat`a~e(nï longer hî }he docement`#v)6
	‰I"m4rn m &#M.pqretNïdå ? [i} : [];
)		m
	q,
		AAE:0fucpioî()mitãh< k/ntext ) {
		if ) ôyğ%of'cïntEx4.fåpU,gmebtqByName°!=-("unädæin%m" )àk			vab+mt`4°],	)			s%wq|pó = omşpe8t.oDtA|em%npsByamm( hádch[1] );

	‰	fOr ( v`z i ? 0, l"=(rå`},ts.lençtl+*i`< L; i"+ ) {
				)g ( reóunTs[éY.ggtEttribu4g("jáme+ }== oa|axZq()*{*					petnpusk(`råsulws[aı /+	™	}
	¹}

				råt}Rn òat.meneôh!-?=!0a=à.um : ret+
		}
	}$ª
	TAG: funcTkon( atchì son4gxt © {
	‰påturn cmn4ext$getElemeîtsB}TacName, matax[1] 	;
)}
}<
IpreNalte"> {
		ÃLaSS: fung4imn `-kk`ì s5~olğ, inpmaca, restìp< oo~,`asXO*( yÊ		maôch = " " k oa~ch[1M/beplace(/_\ïe, ""- + " "+

			if ( ésXL ) û)		vetuòN mapóh;
		}*
™	&or1 `6ir(i 5 0, elei; -%leh°9$CubLnop[i]) != oemL; i"+ = 
				i°(0anem i {
					`f ( ot ^ -%lem.ãlasNalå .((¢ c / elel~`l{CN`me"$  i(r%pLácå /[\T|`}(o("`"9$iNd|Jö m!|x) 6? 2)`( {		© ©in , ai~plAce )0z	M		 ‰re{q|t.puch( e|em -*			}
			m`e|pm kfb(panlaãap!-{		)		cu2lnop_i] = fanCoš		 		
‰‰}
		}
		bõturn nA|qå;
	.

	IG8 bıNkTiOn àmatkhà(pq			rdtt~n Mapã`[!_rdpla#m/\|ç("â!»	,
 		\AG: fõhctio~($haDkh< ctrLoOp i {
	)råtuo íaôci[1>tDo'oRãasd))?
‰ },
	S@iLL*(&õnótioo aá4k(!)`sJ	o`( iadc([1] ?-= "fth# ) {
I		//`páp{%!eñqátionc1hyje 'veî&- 'Odd' -'=', '2o'. §0o#6® §0~,9, §-n+6'	ù)var.pept = /(=3)(\D+	n(8%?L/|m!?Xd*-/>exac
			Ima|chZ²]-==- "õvgN# .&p"6" ||ğeatkh[2] ¿-= ²jtd& '&p"rn/" ü|	‰			¡-|@/tdsp( oat#hZ²Y()%&& 20o++ k íavciò\ || mat#h[>M-::
y	//`cáhcmAô` ti%(nõmbevs$f`ss|	o+(`áp|)ìiïbüqding @v t@m¸ara,joGqtive
		mat#lK²à< (veûtÛ0_ ¯ 8test[2]°t| =	© = °:		)iátkH[] = |st[2] - 4Z		}
	Y	/%¨TÏDO:pEove tk`no2mal ãachm.ç sywteL
	m tCxZ0\&<!Dojç#/
iired`n m`wch;
©y,

		AÔTR: &õfspioo(0mátcH, cuòHoop, hnplakE, res%mt, not))sXML$) {J		~r n`íe(,mátch_!].rdrli#m(/T\/g,%");			
		Iaf , !aóXML(&f UxpB.!ttrDi0[áie]!	({
 		modãh[1] = Åxpr.attrMqp[ame];
		}

	in ( math[³\!0=-!"ş<" ) {
)		mAvCh[4U. " "p)-mac`[4] + b "3			}
J	zeôuò`!McTãH» 		},Z
YCEEÔz f5nCtioj* match,(u0l`ïp/ ipdáae,)råsudu Lotğ ,K			if((#mqpãh[1] === "NoTò é 
	‰¯/)If we÷rg fealijg ith ` coMq`ex-ExPrdópio, ió i wimp|d(on:)	if ( h khwnker.m8ec¨eátch[3]!àx| " )~leNgh > 1 ~\ /^/. ect(match[3M) ) {
				mátch[3_ = Shzzl8iá4ch[3], luhm,¢nulm,#cõp\oo@©
i		} ålse {	I	vaz sdt = [izxl%.fiLtdr match[³\, c5rLoix Inpl`ce­ true)N opé;

		I		hn ( !in`la{e`) z
		rgswlt.pqsH.Ağpmx¬ rEsu}t, rdt );
			I	ı
			)	raturn fáh{e?
I	i	}

	} elsd iv ( G8pr.miDgh.POS.$mct(`hatg([0] ) || Expr.oaõbh*CKLD&te{T( íatch[:]p($)$			reuB~ tRue;
y™t
		
	I	retUòf0da$ch;	,
I	ĞO[ &ubcpiOn(`aatch 	0{
		mAtch$ınóhydô (4rue i:

			påpuRn matcm;	)u
 }
		æaltmRó:ò{	%nabled: fencuion( elem - û	båturn elm)>désa"neä ½= fa|sõ &&¢elem.ui~a0 ½<""haôdun.	dì
	désablee8 dõ.ctoon(0El%m i û
	råtu2 edud>diSabìat =-? trõ%?
	ı,

		c`eakem!fulãtk/n àal%m - {
™		retõr~ elel.ah%oke `=ı= $sqe8
		u,
)	Š	Sglåcte|:"fõhcTiOn( a|em + û		// Ácceskng ôhmc(Prkpesdy maks saüesm$-by%deg`wdt
Y		/ ïPôio.{ il Sc&iri wovK&pòmteşl{YeoEm.ğaò$otOkt%~cmLmcôedIndex;
É	
	™rõdu2n e,eM¯3ehåct%g =0= trwe;¹	},
	p`òeo4: æunctionx elm+) sš			rattò !%e|am.gipôAx)m$;‰},

	eex$y:(fulãdiOn(ğaüem ) û
‰	rgpurn %eldm.firCtCèi|$;
	},Ş
	jas8 F}ncpio~(9%lem,`i- matcè - {
©‰2gturn a!Si{zla¨ mAvchY7M- ohõa`).long`h*		y¼k	hoader$wjcpéon(.elaí + 9	™Rot}p~ hm\f.é).4ecu(àel%o.nkôe^!m+);
I	},
		te|4: æunCviohx e,gM ( zŠ			return#"t`xp¢ =-= ehem.dypå9:		,
		radio2 fõnktmkî  %nem i {
			return &rqDé/" ?!} e,mm/typå*	x¬
Z	ldcab/z:!`õnã4in( al$m ) {
Ù		"etõr~ 'Ciacajoz"+<}9peoem$ôypE;
	ı(Š
	ni|e: oenction( gdåd ) K		re|5rh°"æila" ½== m,em¾pypo;Éx¬
		paórwOvD: nuîctioly e,mm() sŠ		retqrn)"tassw/s$" }5= elee.typg;	u,

	qõbıit: bulction(0e|%m / {
‰	2mtõrn "ubmaô"0?= aldmuype;
		,
	i-e`e8 fwnctùoî(!ela} ) {
	‰ret}bn "im!gE& ==} elgm.type	9}l
Š		råset; guncôion* åhum )!z
	)	zeuurn°"v%set"`==="eìeí.wyse;
		},

		betton: funCviïN( elem¤)`{			rdôusn  jutdonb }== elgm®ty0m ||`elemootd^am%.tïLïwm2Caóe¨	"==9  bettob²;	=. Jiop}t: æuoc}ij< m,mm )`K
			return! ¿iş`ut|råleC~<t`øtaga|button/k)®pe#w($eìdm.n'daÎame$!;
	}
	=,	su$Filpers
$K	`ibst? vqnC|iof( e,g-, i ) {
			rådurn i }-= 0:Š		],

		`ist* dunãtkOn( el%m, i, íat#h,p`rBgy$!0zš			veturn!i =}= azRaq®`e.g4l - q;
		},
Š		E~en80&}ncpùgn(,eem, i 	#{
	)	~ewurl i`%(2 =ı=$0;I	ı,

	dô/fulspioo("`ìam,%i$) y		retUò."I*% 0à-=-f0;™	},
)	ìT: fq~ctioN* elå, i,`eatgh (`{Š			ratqr!I 4 ma4ch[0] m 0;
		tl

		ct0 &uNctim~( elEm, i- matCè - 			"mtwrn é > maôchK7]$,00{
	}$Ê
		nth8 fu.c4iin(hemem, al oa|ch i 
		rå4wrn íaôCh[;\`%ä0#===0i»
		},j)	mq; functioh( ule-, é( midch ) k			òetu~n¤mapch[3] ı 0 == i3Š	-=	}
	nilperº {
		PSEUM> `uhgTion( dlam,ğmqpk(, i,à`riy°)à{			ö`r n!mEp=`ia$cH[1_,		d}`|%v } Åxy.filôazS[ n`ma-];
*	)i&-( `ilvr ) {				òeôur$Fi`üdz((ela}(!	, m`tbi, rrñp!	?

 		 elód°in , namd -== "snoTe)ns¢ + {
)	M	ve|uòn` e,eM>pgxôCoôent <| edul.InnerTe|$ü Si{zl%.gåp]ex4hZ emem İ) x~ #),ihdEzæma}ChK3Y+ ?-,0;
J		} elóe&Ig * name'<½4 "oOt1! y
			©Var!o4°<8lidch[3İ3
			fnr , var j = p$ l%=*nop.lmng4x;°h#*,; ê++ + {				if 8 nOu[j\ğ4=§elam ) {
I9		rEturn£fcLó`û
			Iu
			-Š
Y			zetuvj(trUe;Ú	m`elqm {
		M[i~*lenezborh bC{}ax årzos, u~rmcoG~izdf epråssion; " / ïama !;
	é|
]­
	iBHINû func|iof8 eloi, mat#h ) {
		6árpp}`e } matciqY,		noäd )%lem;
		‰s÷ivh h txt 	 zZ			Case "nlù :		casd fIòrt º
			Yumile ( (noleà=à*ode.prårioucshâdkno)à() {
				 mf,( Jo`e.ndatixE%=101()-k 
I			ret}Ro f`lrm;*
É«		
	)		=

				In 8 tyuE$,=< "n)rSô"à(({&
y Ù	vEttrn"trUõ; 	‰	I|Š
		Inïdm = edåm;
	I	-aase blas}":
9	)‹wéI|a° )noda`<%.ode(naxTWhòhéno)%(I {
		Yife()No`ç(oOg%tqpe -?= 1 )/{(
	)			retupn faìse:!
				‰}
				©}
	‰)pet}B~ tru%;

	M		cëAg 6n|h&:J				var æizS| ½ matciKr],			)lasD! eápkh[#İ;J 		‰af ( nirqu =-= 1 6&!laSô =5= 8 i {
		© òe|evn prte			}
I						)ver$Do.åNaee = matbh[0,) 				paòdnT$ e|empòantOolE; )
		)	Ihf , xAòenp . ¸páreNtóizaiie0!?8!donõJame ||0!åhgm/o`åIne8) ) {
		I		wa{ ãounu ½ °:										fjr ( nOdep @arefö.o)zstAhimd; ~môa; nodeğ9 node$ndxTSibdyno - {
I		)if ) î/de.lodgType =-= ± © {
						o/äe~no`mIndex(=!+«cotnt?
I	I		}
	I			i 
J						pa`g.|.óizbicie05`doneNaiu:
			9	}
				‰			vár difn = eleM/ndeHnDm8ğ-blas|;

			Iæ ( v)rsô =9= 8 9 { 		iòd|uz.p`i`f == °:

			)q)elCe û
		)	rdôEún (àdiff e fazt =8= 6 /&°diff / æhrQô > 0p!?
		)	)}		}		},
)	É@; nencthon( elem, mat"h - {
)	9petu"n ålmm.No`eTy0e === 5 && alemoet@ôtriêuõd¨"md#) 1=<(Miãh{
	},:
		TAG: bunc4iOî `dnEo,plátkh$	0kJ		return.(matbh =? "*¢ . E|em,nOdeUxğe == 1) }|$Elem&îoìE^ama.oLowerK!seh) 9==$mñpch?
}$
 
		SHASS:!&unãtiOn( `lem,(matãh#)({		I2edwrş 8"  " (elem/c|assOaoe°|ü mlem¾gåtCdvpybu4e(6c|`óc")) k " .)	‰	É.iNnexJf((mató` )(>b%q;	-,
:¹AWTR2 bu.kdien(0%o%m$°iqtk( !`y
		vaò îAme&= matcH[1},J	‰	påsu,u = Uxğ/avtòHqndleZ lame ] 
ß		Expòctvrèaî$oe[ nam%,]* uhem$)&:
	I			edee{ nameä] != oullğ		K		ememàna-e _ ºy					u,em/gTÑpôrkb}te(ànk-e ©,			ralue"="resulı + r"<
			typ%)=)mñtóh[],
			ckesk`=$-itóhû4_+
		)Bm4urî rEelp <= neol°9
		typå =5= ¢="$"
		™$ypm =5½ "" 
Ù			~a|qe =-? óhuCk ;			tyxa!==-!"*<c ¿
				ö`ì%m.ifäeøf(chebk)&>= 0 z
			tip%"===  ş=& ?
i			-" "p* vmlue +0"!").inä%|f(óheck)$6= p >
		)	¡CjEcja5*			pñhu%,&> rasemT$!=5`feLe 8ª	I	pypå =-= 2½"
	)	‰Vkle0 ½=)Cjdãk :		‰typo ==} ò?!;*	É		Vghõa.In$gpofìCnegk9 === 0 z
‰			tyğe =?=""ä=¢ ?
		vAlEe&óubs|B,tahue.lençtè - ghåakmEneth9 ==? ãhåco :
	I	ty|a`4=-&"=" ¿
)			valee =<= cock ü|°6i,ue®subw4s(0,pci%kj.hungtz k q).-?8 cxegk !à"½ :	I	Fgle;
©	},

i	P[#dõdctin( elem,"iápãh, i, arbm9 )°s*		var nAme$1ğhaTgH[0}$ª			fédt%z = EpğR.cepFalte[ na-e ];J
		if ( fimtmrp! {
			©råd}rn viltgb( ulum- o,0látc(, arra{ -;
	é	}
	ı
	}
];Jtar oriwP_C =%@xpò.oatcèĞO[(
	v`scape ½ vtnctiohè!oL. num	{
	zetusN!"\\b « )lõm`-! $+01ù	};Š
v/r ( var tipepiş Exsr.iatch ) sª	Gxtr®iatg`[ ôypE2&= nu7 RggÅxp((Expò.}a~chS pù`e ]souboe +à o(?![ZÜC}
\])(![^\(]"\(9..rouòcå)();
‰ExPzlaftOatcjS0t}pe ] } ~ew We÷ExP) /(Ş(:.,\rü\n	+?)/>suvcm » õhğr.látcH[ uxğe0/cotrae.reslñae(/\\(\d«)/', æesce`e)0!;
}
pqr°maKeArraI -$fuhcdioo(0arRi)- res5n4{ ) {
	azraxà- Awpáx.pzo},ôyğD.snica.call( aòray, ° 9;

	if ì reu|ps / 		òe{emts.p5sh.appìy, reóqìts,$array )?
)	òatErj`pes}l|q»
I=	returN$array?
};J
/dPerfmòm$a)qieğle chõaû v/(dupõRmind if uhe ârog{ez ùsà#a0cB|e`of
// coverpùno e NkdelisT"po á array0uInfpbõalij0iå4hods¾
/. Alqo verifiåp tla| t`e Ettrhud arPay°holf30DOM No`eqš// +which is not the cas%+in ôhu FLaakberry `riwSeb-
ôry 
Arpay.pzotityte/qìisE.ckll( docMent.mocumentGLeme&t.chmhdNode3, ° )[0M.nodeype9š
/++PvovidE a fñhlbaCk metho$,iw i4(does nGt woòa
}!et`h(,e!	 zšoakeÁrr`y = ft~buIon8 ársay reqw,|C )`s
	árbi ) ,		ret`= rg3uLôr x| [»
	ig ( tl[zinc>ccmeròa{)!½=à [OfJeaô I0z yX# ) {
	I@{2a9nprft|9rd.Pso.ápğly(%råp< eBray 9:
		} ålwe,{:	]	mf((àtype/f apr`}l%îgt` =-! ştmBgR2 y 
	‰	fgz * var m = arra}.langth; i ¼ l;$I++  q		Y	rd}.xeóhh azAyYéX");
	)	}
	) } olsE sÊ			fïr  ! òpip[i]+ `+#))+[
 ‰ 	zEt*pTsH( ápòa}k]  ;			}
Ù	m
		|J
		{eôtrh m?
9}?
}
*váp$Cort@r`mr, sArlinoCxecb»
	æ h mmcement.o#õeeltAneman0.#oMğaòaG/cmenp^O{	tio,*)(+	slsdOrdaò ? ouncôhon) ñ$`b)) k9`f ( a ½== b ) û	hásDuyLkbape = wRõe{
	råturn <Ú	u
	id (0!i.whmpmBmobuamntPoaitioo |x0!fkompáreDo#}een|Poitéon ) {
)	edurn a.compargDocõiub~Posypioo ? -0 8¤!?
		} 		retõpn i.clípcbeoauien|@oqitkon(ò) $ $ ?0,1 ~ =:*	}"
} e`ód(	óartO"mer } fUnct`on( i, ` (${Ê	Évñp%ao, B|,K	áp 9,K],:Y	gP,= Z},			á4ğ = c.ğ`òeotNOäa|
		bõp0<."¯`qpån÷No@e(Ê			gEò = ip;K
	//$Txa0nodeS aò%¸)lE~técáLm we`ba0exiô e!vlùY	kf%pa 0= p(àr		maó@u@oicate$-"truå9			rdôqv.  ;
Š		+/ Éb0phe!nodår!Are sibminó (ir iDåntic!m) ve can dn0a,!uick ci%ck*‰}(el3å if%(!aõp ==-(bup ) K			òe|urn ri`mInGÃ`õ`k !l c );

)?&%If no`pa"m.vr qmrm ælõll thel thE!nodws+r% désgnnlected
	ı åls%$Iæ ) ¥awpà( {
			reôtrn&1;Z	} åhse)in , !bu`0)`z
	zeôurj";
‰	}

	// ÏtlErwyså }hmI·re s/mew`åre ese in t(å ôRoE Co ÷e!nmeä		/ To jtile wp a(&L| list4f t`e x!òeîtOoes æmz kompñpkCon
	©shime`( bu ) {		a`.tşslIçt( ãqs )+J)kur = cus.prdntOmde;
		}
	‰cõr -%bup;

		ghile!$urh)(k
			bp.un#hift) ctr ))
			cur = cur.pa{endNntd;
		}
ª 	al = áp®hençth3
	bl = bP/Lenwti
Io/"S|art0walk)nd d'o the trmeğlao)og`fïr a!$yqsp}@iNcyJ		fo"   vaR 	 9ğ0; i < al$& i ¼ bl; y)+ + {
‰	af ) ñp[i] #= bpÛ)] ) { 			reôuzn(ci`ìingC(eck !axKi\, jp[i} )9
			}
	}

	9/ We"En`e` omåplac%!ep the t2e` ro mo a pibî)îc ahec+
 ire4uî i =)? ql0?		sablm.gCødãj( c,øbğ[i], -1`)"*
	‰	s`flélgAh`c+) apÛi]%", 1 )
	}:	sibli~gKhek = îunCthob) a,$b, r%t ) {
		mfà `a&==< b  $Z
	Y	rdturN¤ret¿
	}
J	fcr cõr'=(a,nex4Sibléng
‰ whilm , sur ) {é	Ùin ( cuò ?-? r y {
			úev!zfà,1
	ı
Ê			ctò = cts,îax4Sijlinw		x «	ówuòn 1;
	u?}
/ Utilidy fqş#iol dÿR"bgtreivkNo the ş%ztàra,ue,ov ñ arpáy0/f ENm nles
Sişzl%.gepÔ%xt = bõlktmeî( eleos´)`K	var ò%| ? ¢, elem»

	nn{ ( öa i  0#elemS{)]"i«!p	 {
Y%l%m ? ehõhw[m]»
Ê		// Çeô hm tex4 Frgí tey$"`ÿ`õc%o °CDA]A)jÿ`u3
		if ¨ elem>nodgDùpõ ½-? 7 || Em%m.îmtW)ta ==5*$#)°q
		veô ë= %laíîoeeV`|au
	/$°òavarrå eepyphioG&aüqu(%ybåpt kmhuf| oolds
‰	} edóağin ( ålåM.nodePype #<½ ø + 
©	2ed$)= Ói~*ne~ae@_exp8 õle-/ahi|$Oofes )+		xº	ı
	~etpr0Ret;
ı

// A|eok(tÿ ó%m f the!@sj÷rer Rgpupnsd%namantw oqpHñMç whõnš/ s5eryioG"bù geuleíeî4ByI`q(ñ.f {2ovéde a ÷aòmRouşdé
,Fwjcti/n)zJ¿(We're0goInfppï ikesp a Fake énpEt element ÷`ôh(A(sğaãinIed`hqMe
vap°fobm = üOcuman4®~ekteAìemeot("diw-,É)g = òrãroPt à+¤(o%w T`ôe()).çatToMg(i(Ê	bonô } foãqíe~T.docõiån~Elemeîd;
	ferm>	olephM.8$"<a .aií8§"*+$hä + /'/>23

// IhjEct$iô ùntM the Rok~ õ`e-m.~, chdgjaits su!u5s,`!nd"rõmvm it quickmyroo4.iîsåRtBefpå"for},`roow.æiòcvhald`);
	/'àTh"vork`zOulä has vn d e$dhtAÿnc,$cèecks adt`r a geôE|em%ntByÉ$	// WhIch"slkws)tii~es í/wl`bo2!O}hårğbrmwrårs (hence04le!"raşcl)ng)‰if ( doceoent.ce4MdomehtByIg( at ) / {		Mxpr¾finn.KD <ğfuncTion(%mctc`l copåpt"i{PmLp	 K
			iF"(,pùpåoo ckntõX~oatE|emenpÂxMd-!?1h"uneni~ed")&/ ñisHML()à{J			tqr0m%-)cÿnôezt.fe4eLomenôByIm(matah[3])9
‰		vettrn%e ?Š	É		o.i`0-=,eqtóh[_ || 4y eov m.gE|@ttr)b%}dNgô%)!=9 "}.leniodä & í*çe|A|tòibuveNodah"id"!.nodgVilõe0==-(mat÷h[1_ 
				[m] ;
						undefineo >
©	)	[]3	i	}
	};Š
		Mxpp.Fmltar.I&-;fujctiOo( el%m,iatãh`)"{Ki	vaz ~IôE !typõOo eluiîgmtCptrib}teLïde #== buş$gijudb &&eìamoeuAttúIbUvaNode(idb(»

		òetesN"d|aí.noeaÔyp% -=5 1 & nmde & noäeînoDeRa`õe-== mqTcH;
	}3	}
	úoot.pemoeCkil`( fowm !{
	/-0rå,gA{eğlåmoRy in IE
	romt = onòe 9%null9J}/(+:Jhfuncpéo~-{
	¯-¤Cjeki tï ee id ti `òmwseR,pepuRn3 mşhy elemåntc	//°sèen doylg getE|emEnTsByTaGNamey"*)

	// Cveatå a gaoe õheMeNt
	tcr,`évp8($oCwiåjucreaôaGleåbt "diVâ){
	$iv.`rpgNmhi|d- l/cuíeo4.raápmCo-ídnp-"+)`);
	// @áke sUre ho cOímåft$@ò@èdoo$Ji`!( iv>fmtEåiebuJ9V`gJo-o(¢ ²).lençth > 0 ) {
	Expp®fmnl.ôAG = nuîctao, í`ubl!#ïnô`x ) {		var sel4ó = konepô"oEtldmeot{ByPabName8 m`tCi±] !?

	Y	/.)Filô`ò o5| pkórkBm"coimEo4ó		if ( mauci[±]!5= º ğ(,K	 	vib+T}p 4 []J
 		f/ò è ~{ i = 9;,RårõlC[i}9äi+)) y
				mf0((ReSulôp[Iß.îiäa_9|%p1=< !&	0r* ‹			tmp.@wcè( rgC}lôcÛi] -;:í	‰	}
II}
	I	Irocuts`<*dm`;
Im

I	)pg4}2n rd{Umd÷3J		};
)x: // she"k vO1pea)in áj a|Tziâqtd0íTõr~r$NRmalizel øred!a~pr`but%{
=dirn)oNerXP]L%=`"¼`(hz%v9' /<a<"8
if ( mIvöaòsvCiildp$& tipeïf divnfiRû4Chùht"o%AtpricTve  ?< "undevaoed" "&
	dkv®bkbs$ãhihe.oetAôprijeôe( href2( !}-,"#p(`{
Iåxx2.ttrHa*elõ.hreF$ buncTion  `lem © {	bgpurn måe.cm@KTtribue( "xre&ğ2ğ(?
	ı2š
	//`relese`do-ïpy én'IO
	div(,u`l9
-(é2J if$``ocmeNt.ñuírùCulõc|rAl``(!+
	(`õjc4moî(ù{	far jlS	zzld&<)Sizzde	)	div = toãtoenT.`òaaTeEldmdnp,"äiv"9,		id  "__ói{jlß_"9

		äiv&i.oEr@TIN ? b<p g,ass=§TOV'>8¯p>;
Š		// [af`rh(ciN't haNdLe õpxerCáså oR$Uîacdl%(ch`sac4e2ó w`en
	I+/ kN)quhri{ ooäd¾		mf ( `ifoquarx[leãtïrCll && dif.!õeòqSlEãtopAln¢.ÔAS").låloTh === < - û
I	rg4upn:	=J	
Sizzle ? fe~ctao* ñUåpy, cnt`yt, õptra,Seaä ) {
			co.v%xp 1/conteøt!|} äncumnT;

		//¢Lakm {Ura th!t áttRiBu4å óam!kdops ire ñuÿtgD			ñ5eBy = qteRy.repliCe/\ıTw*([^!£\_]*)\s*\]/g "='-']¢);

		/. Only õse qemrySåle#toòA|h#on non)ZMN dncuoen s
)// (Id s%mec4ors mo~'t work`h~ n/nxPmD!documål|3-
‰		io : ¡peed '&0!ShzZl%>isXOL,coftext+ ) {
			id ($oNtext.nodeType =-= y = {
		‰	dz)(s:					rõtwRo makeÁrAy(°aontExt.qÿez9Ó`laoTorñh|(qTeRy(, å(tBi ù1				ı ka|ch(ñqkEr"op© {}
)		//.qÓ@ uobks 3ôrmno%lypjn GlemejtvOoted !}erier			"/ WE(cab pork ároun$"dhas b(øacinykng an%Extra0ID oJ 4hd"root©	/ and woRëhng&ep fpïl#4kEr` (\ha.ks to Anôreu Du`ojt oor thå |ekh~iñqå		)	i// IE 8 `oewn§p woro of jf
et ålglents
		=0alse kd ( aon|Ext.ne%Vyğep==- 0 && c/opupô.o/~eîaíE.toHwåRCa{ex!p!=-'"ÿbêeg4" i {
		&ár Ond 9 BoNuext¾'m4Cttryb}4å(p ûd# -,Š	‰				dy` !Old x| id? Z	É		of (`o,g ) {
			9	cnï$exô.s%uA|triò}e, âit", o`ä )			Y	ı				tRy {
‰É		~eôtrn<-kkåArBuY( co~4mxv,quer}Celåcto~Amhh â#' + nid + * b k u5grû i, extr!p	?

			[ katBè(y3eqämÅRrOr)`y›		} fion`y {
			i&h()!ÿht ) {
‰	-			afôe~d/põmÿ$eAttòibEÿ%) ¢iô#)?y	)	}Ù	™	}	I 9}
‰	ıÉ		ratus.ildói{Zla(põrI, sin`eht,0ax4z!/ see$++	ùu;
		fopğ$fepğpò/x il mlSIzrìah) {	‹óizzmeÛ p2o`(] =àol$Sizxl[ urp°];
}
Z		/ reìeoSe íaíGsi%an I
	dir 9"Nwll9	})(!{
}
(u~cthoN*){ivaP+html } fksqíend.daõmgvEüeıoT,
	ía}Cj`ó ½ itmh®mátkhesóE|%g4or |ü hoh®aoOatcxe÷Sggctor ~\ htllwebkit}a~CjesRå$eCvcr | Htaì,msMa|`hesSelecôlr,		psau$oWorkq° Fidse;	~ry {
	/% Tøis shoqìd"feil wiu(`~ e8k%ypùoî
/, Geoo)`oas nOu errow"repurn3"`ahse!iîqôeqD
	matãhoc/Calì(%Doaueen~fmcum%nOhemuNt," Ûpåct!=&§]:ckZzdu  );

	x0Catg`ø ğSeEdomròOv + {		xsmpdc×Grks = tru%?
	}J
	if ¨ }a|Ches ) {
	Sazzm%.mñtãhesSa|eãtob"50fuNctoo~( fo m$ exPr - {
É		/ Íakd*supå thatjattrib5td0qõleCtoòS!asa pudted
		expr ? exğ/Repìac%*/^=\q*([^'\]]*)ó(\Yo'- .=7$ñ]"/;Š
9		ig ( !Cizz,e.ùs\M( jode ) © û
		ôpy  
	‰			iF$( ps%uoGïrks || ¥Expz.oat`è.]BETÄO.dect( ex v + ¶$`/!=+n4usu Expr ) - {
é				òetUrn(iatchec.cal|(-no`e$°eP{ );ê					}
			} caôCi(e)0z}
		qº
¹		retõn Si{zìe8Ey`z `lu,n,#lõhl, Knmdeİ).$ejçTè ? 09
	m;
}Zu¹()

8fuc$im~()k	war d	~ = ägc5o%np>createDldíent- ôiv")+

‰di.innerHPML < "|dkV,bìasc='|estàe'.>/dhv?dir cla{s='tes4'></diö>&

©-¯ Opmra can'u fiîd A"seaoNm klqrs.gmm (in 96)o/$Aoqo, mekm sqòe$tlat ç%tnemeştsB}A|`s3Nao` `c4uallù åxists[	i&*!!tivgevAlamEndsByCìAsSNama <| dhv.gE|EleíentsByClaósNama8 e)laneth!-=<  p) {	Ipet}Rn;Šı
	/,`QqFaRi ãachec,#|AsS$audr!b5|es, `ïesn't cátgH(`haï'oS- ùl .)I`i6.lastAèild.blassOaoa`9`g";

	if$( `év®GetOlemåntsNySlac{Namu("a+)/ledgth === 1 ) {
‰òetern;
	-
	
	Uppr.ovdep.S{licu(±, , *CÌAWS.)»
	xpz,faîd/CLASS =!unatio) maôaj()#ïft`y4- iSX@O ) {
Ù	if` pypo/n ãgnte(ugdvEnEo%ntsB}laósÎam$=8°"}Nleæhnal"!&& áh{HML`! {
		òeôez. Cïntez.GepUhme.ôrRqC,a÷Nede(mtcxR1);
 	y:	}:
©-/ velaarm memorx#	n iAŠ	dh~ = ~umL;
ı)h!;
Fõ`cpiOn äiòBoeCheóh( fIr,pc, äkneOam, ãhmcket< oolaChebk)ióXMH$)"[Š	æez ( var i = 0 àl*,CxaãjSet|anc}(? i < o I+#à)${	étaR!ìem = kheCëSåt[)]Z	iF, a|Eí - {‹k2 aátkh$=ğfñhsE?
	é	elmm`= dlEm[diò];
	)÷hiLç ( åhmm%)`s:		Iæ 8 mleM®sizkaghå === e/îe^ama)) {
				matck ? checkCg[el`o.{)zset_+
im	bRmaë;
		m
i			kf0(0dnEm~iä%Tyre1=½=,!-&¦ !a{X_L ({	‹		e|dm)zcacje-=xdodeNk-å0j			edåi.ci:sdt = m;j		}
y	9	iF(`elem.ï/de^ame.ïHÿwgRCa{eh &½ cub )([Z«	maôbx ? glõa{
			)breå+?
		Ù}

	)		eîem ? åhom[$ipİ;			}

	khåckQe4[i] = ma| hJ	}	}}
uncpimn miòAhegK, das,$c}r, dhneÎaí`¬ g(gckSåt- nôaChmCk0hsXM$) s:fr ø ö`r k ı °,`l,°cxec+S%ô&|dog}h{ é >  h«+(	([J)0i$e|am = cHeakSot[I]+
‰	éf0(àamem i {
		vap iaTg(à9°fmhwD;	
		I`ldm = elçiÛDir]8J
		whiìe#((Elam - {
I		ib(( e|am.siz`ábhA === `oneáhe ) {
i	I	-atc`b=$CkcjW`|mlem®si:setM»
				‰breek;
		i}
	)‰if ( elem.NodåType == ñ ) {
I				if ( !`sXM`)ğr
			I )anem.óhzaiCie`50doneNamõ;					©dlem.sizsed*-ài{			ix

		Éif ( tiped$Cur !}5,sdòing/ ) { )					if (,eld} =0? ceò ) {
		‰	madsh 8)dzeõ;
				9âreak					=* 			m eìqe ifà( Qiúõ.f`lder( ãu{,+[u`ål] 9le~FtH,> 0¡!-		 		Imitãhğ9"Ene};j				)`rda?
	 I		]
	)Ét
-			edmm$=pe|em[fIò];	]Š			ajeãkse|i] 5ğla@kH;
I	}
	m
uZof¦`doc}mgnt.dlkumantelemenô"ciniins )!{	Sazzme.Cjtains = æuncvIol( i,-b ) {	båturn á 1== b .&à a,cooTéans)?,a.`ont!ins b)$*)Trte!?
	}{
y$em3e i`8(Docuhen|.lgãqmEnEhõmgNt.km}píåDocõmentPsitkoo ) {
Skzzhe&cNnTá`ns,-$Fõlspmon a, o ) {‰	ret5ònà!!(c.compcreobumen|P2itmon(r)p"$16	;©};
]àalse {
	Sizzlg.ccotiios 0 funktinî() {
	retuzğbah{e;
9|{
}
Sizzle.iCØDL = fuşcôhon, ålem")!{?&$doaõienvEm`~t(Is veòinIedáfop!cacåq0ukerEpit domC~ t yet uxir}
// (qucl áp°loaeing `fRaus an IE%)b#573) 
	var dnãuoentAlem%nd"=pu,gm 4 elem.o7~erDo#målô || aìeí ; 2)>doc}-gjôDìeo!np»

	~%uuònà$oCmåjtDnEmeşt(? $ocumuNtl`mşt.odåNá-g )5= "HWL"°:`filse{
ı;
v`r p-s@smkass( bulcté/n( qe,ec|or(ğonveøt0) svar mat#x,Ş	$mpSat = []¬
)	oater } .".
™	rOoT = cïtzt®nodgT}på ? _cobô`øt] : ãondext;j
i/ SoóatIon*re,uCtnrs lusv ne dïnm abô%ò he fimteB
¯/4Aîd&p ıes-:not(yg{)t)ÿ.il) óm`Gm oove`all¡PóEõDOc!tï tHm ehä
oilap( (oawaø ½ Oxvp®látc .ÓAÕDO&gxec8 snestÿb )- 9 û
		latar /=&lñp{[0_
3g,mctgz = {a}dódob/põp|ak%( ÅhğR.Mktc`.SE]DÏ,à"* );ª	}

	dleóto""=b@x@w.vaìaôi%[qehecuor]`?àcoLecôiò + &"# z w%oecpïR;
fmv - vaò i = ;,`h <#Root$í%ngvh{ é ~ l;aië+$),qŠ™Sile(°Sohmctnò,+Rohô[i- tmğQet&);
Y|Ú
	2epu0î Si{pìa®Foveò(`LoTgp, t-pSgp ({
};
ï%0E_POBE
êQuvy>`id = Óiz:le?
êQuEry.aøpò = Sizpìe/SeleatOrS;
jQu%ri.%xPò[&.Y <0
Ueorù*åxpr/fidôewS;
jPu%{9/pşhq5m = Óizl%.p~iy5eCorô3jUugry$te~4ª<àSkZ{,e çeôTex;
hÑegR}(ksxMMDoc 5 SiZ{le$isXN3jQueby,ãkştkior = Cizzlõ&contåa~p;

})ø)»

vaz òun0mlq /]n|il ¯
	rpápenu|rev`- /^(ÿ2pazents|prevUntaì|p2otálì	/(
	?- Nodg:0Th(s VewDøp"3hgõld j%$impòovEn,àkr likeìq°põ,ned vRom¥Ripúlg
ríul4kcedebt/r = ¿,o,	ipSIí0oe = -^[N;#\[\.,]*$?,
û,iaå = AB~ay.ğ2ototùpu.sdibe,*	POS } şQuery.aøpr.oaôcè.WOW3

jAuery¾`n.eXuendx{
	giîd: funcôion, saldãtor !`{
	va2`Re4&="tèisx5{hsta#o(""",0"fIod¢, cm,ecôoò +,
	)m%ngv` <$0?

Ébr&!rar i)=)0ì | = |héq.Lenotx3`i$<©`» ù++ / {)	,ençtx = rat,lengthû
		jWuårù.fan`¨ selector< thkq[aı¡rep );

		y` ( i%<p00	(+
 ‰		// Oake(c}rm thád The rõs},|r aò eniñqm
				for ( vaò ~ = lengôh? n | r!u.la~gth; n)+ ) {
		I	‰foR ( rar"r$5 0{ r = laîGtH? r)+ - {9I		kf ( rgd[r} }== vatYn )¢{
	é			òaôwmióe¸/-- 1){
				bsegiû
					ı
Ù			x*I		m			}
	Š	ÍRgTupn ret
},Š
	hasú functioj¨ tarcup ) K
‰var dirçEtC = jQtery( parge} );J		ret}rî thiC.fylôer(fqn#ôhon)) {Š			gor h vaz i ı 3,)d`<0tkRgeôs.,gnoph9ài$, l{ i+/ + {I		if (0JUuårù.ãOntcinq¬ whiQ, ta~GetsQi!	!)às
				retUz. pòpe+
		©}Š			}
™});
t,
	not8ğbungTion(0sm,maugr ) {		òe}urn phiwtupxQ|Ack( ÷hnjogøtxhs,!sele`uz, fáls%) "nat", óelec4oR);J	}fyd|%r:`fõfcio~(àqmLmcôjr - {
)	r$|zN pxisqUwhSpiëàwifowõ@ùp, s%ldstoR, trud),,fi|tgB.,brehc}ò ¹9	},
 ic: fu~c|ion* óenektor0)$k	Épetun © selEc4ïr "& jAueòx®Filter ,eLåatgs,)haó ).~eneô`$>(;
Ixn
	ãlopeRv FõdkTik~("pmleCôcòs, kO~pexv ) {
		vaw òdt ? [M, i,!l- ãtr = tHys[0]
		if)()JQpery.}SÁpòAy,sedåctzs  0!){	i	öas oatch,!Cmleatdz
		YmiTgHerà0$[ÿ,Š	le6u`0=(1;
:	) ëd& cõr $f óelecTo2ó.lenCh !àI
		Ifïr%(¦	 =`0. n = s$nek`ors,onfôh{ i = l; i/!)°sj				s`|dc4o09 selgCtlòq[)];Š
				hf x %Madcher[Sm,õctor,	øs			)dats(msqeheC}Or\p1,jUuery*exx2>iapkH.POS~tec|(hsåleCtò ù ? 	)	i 	jAueòa( {E|ectï- ón~poX |xptiI{cjntå8t ) z 		))sole#ônò9
			)	}			}

	wxhle(( cu2 ". otr
obnerDocõhet æ pau2!!==`boNtxp!(%[	) )foò é óal%c$oR4in m tcha{ ) {]				m`tcl = íatBjEs[óaüdktoR};Z
			™if,(©-qtch/*{Uepù ? mtcè$idex(gur)$!)1 ; oQuerq(cõB9,éshmadg`m ) {
)			råp¾pw3m{ s`lc rz wemEspïr­ g,ehz cez,0låtg,: leöal });
					ı
			}

			cur°=%cuR®papg.|Node;
			)neveo	+:	}Z	‰}

	)	òa|uz. rep?
		}
	vmb pos !POS.`m3t redeCtOòQp(($
IbQuey  releôkrs- oonteX| ~L tii{.go~pext ) : ~pl,{

)dor ( i4=$ , l } uHmS>lehgTh i 0 ; i); ) {
I	Icu  pha{[i; 
		w(ide , kur i {
				ib$(&ïSà5- os~indmx(Cõpi > -00 jSUm{*fiod/-átãhosS%leãtor-Cõr, s%mEstor{)!	 {
		ret&pUwHh sUr );j‰ 	kreak9
				ı gl{e {
				ctr = kEr&p`zEoD~nôd?
	)	`g , acup |~ 1cur¯owNårDokeoent || cer ½<= konpåx| ) {
I			break+	)	I
				}			|J		y

		reô = seô&leog|ha>00"/ 
qqåry.wniqõe)re4k : re~+
			reôurn Th)s.push_déck !rmp- "c|/{ewp"($mLåbte~c%){	|,
	
i)? tE|ermije t(e pk{It	ojğog an(eldmnd within
Y// öHm }atcj%e set oF*eldmDî$s
	i~dmx: fuîc|ionx å`em!)`{
ig ( !anem || ty`eov ehmm(=== "strInc¢ ) 
		)re }b~ jQuEv9>`n@rRiy( ôhisÛ0],š		// if I| úecaiVo `0stmng, th%$Cå$åb~Or yqğu{ed
)	I	// Iö it&"åaeiödó othino$4ha qiBlişcs are uqåd			iel%m ? zQõerh edem ) : thastaòa~t,)/Chal`vn(9 i:	]	I'/ Oocate$dje pïsktion /f uhg dasized elemen}
reu5zd hQEmry.énárra{ :Y	//&	v ét"2mcåhv á jAõ%sI*nâjebv,!tøe &iRst0elEm%np Aó õsgdŠ			m(mm>hqee2y ¿ e,em_0İ º glel¬ ôhic );
)m-
	qde:(&õlãpi/o(,selõCtor, contey4 ! [J		6aRôsg$!= pùpe/f saìeotop <=-$"string6 ?
			jQueòQ( seleãtor, kinpåH} |\`this.koîTe(t + º
y		jQuerY.LcCe@rba9. sEìek4or¡),
		all - jSuår}.m%vau °to	{.çet()()råpğ);

		pçD}ro t`ic/ }qøSôack/ i0dI{conîestod* setS2M#)°xü msDióbo.oeëtåDh eloZ0A ) 	á,l :
)‰
Q%epy(õNmaa8 q,o ) );	,
Ian$Selb: æEnctiÿjx)(+‰råwrn ô`i3.add¨ ôhiS.pòevgjmct é;
	}
}(;
// Á ğai.fully siopleàcoEck pï see ib`an mheiånv or $ySoonhõbt$m
// broo e äec5mEop`(shoun` bå i-yporõ$. whõrõ oaaqyble+.
`õjã4mon éqDi{conoeó4g* ~oäe )kz
r%~%rb0!nOfEfx| !.og,p`ò%ntNode0| njda®parejtJï$gncäetype$==) !19
pÊ
êQ}ezy.aácm({
IpqbeNv: fõfcdk/~(hel%m i û
	ar ğareop =pemem,paò%o4O`ôd;
r`tur20ipelô &&(papujwnkdaÖy~%* ½8à!5 ? ğaòEnt+8 hõlo+	,ª	yare~ts(wlcpioo&ale} - {‰òa|erl jÑ%o2y&ôar(*eleí( yare~p^OdE" )3ª	,	paò%nt{PntùD> ftîatio., ele-, i,ptntil ! z
		repurn kQeòy®dir( ulem, "pqre.todu"¬ w.|al )
	},
	îex: æqnc|Iol¨ e,emf( {		2etupş kQueòy®nuh( ehe-, 2, "n$y$[ablé.g&);
Y},
pzev:!Funstioo( eìem - 
		ò%|urn jq%ery&nph( ela},ô2, "pravIousSibìiog" );J	},
	naxtQLn: funcTo/n( elem © {
	setpòn%*Qterygiz(àel%m#"îexSijlijg$(;
y|
	pzeö@ìl; oqïcôioN( elem ) sª	pm4wbî zAuEry.diR) m,ei| *pzeöioe{Si`|ing& )1š	ı,
	ndxtõN|im: duNctibn( enem, i, }nvil y {	òetevn"hQuury.mir °amEm, "îEy4Wirhing. uhtil +
	},
	xråvU.|il2!dõ.ctimş(ğel%m, i, unvil ) {
		reô%zN(jÑtury.diò(àeleo,`"profmcurÓibling"< until ©;	},Š	siblmngrz fuoctiïN* ghem$)-{
	©re4ub~ jAueri/pi`linG/ elem.0irejtodm$faòStni|d¼ glmm0);
}.
‰chimdreî8!fwncpio~(#lAm é {
òat~n&bñuåRywibling"`|dmfissôChild ){‰=,
	cojôends: du.ctmgn( elem i û
	zaôqrn-JQtepù
nOdAName( oluMì "ifpamå$)+?
	‰	elem®conuentTgc%o%opğ|| m,elnco.tenpWi~dog.dÿcumeNv zK	*Qpep}maoeÁprAy((elem.khmhtNodmc ){	=
]/ ftncuioj, ~ame. æh°) k
jQu%r9.fş[ name ] = functioN8 ultal,$smleCtor ) {
‰var rat = nqtíp}map( tji{( b~ 9%otilğ(?
			Éag ) ¡ru`t)lôesp( oAme`)"	)I
		eleçtïr%= U~`éh;
	ı
J	io h sdmEkdor0&& tYpeof(seLåbôgs == rp|ri.g 1)![
	)rdu = zQõer)/&idtAz(-Cådåa|Or, pet-	;
	}
	Oret =&thió.|dogt( >à1!%Jñpep}u.íqõ`( reu i : rEt;Z
	if (p }hi.denoth ~ ± ||(rıul`ielåctcr.teót( {%lespor-)- 6&`rpzE~tsprEwvaóp, o!md )/	$k
É	re} ½ reuòvdzrm);
	u
	ò`ttr$has&ğU{hótáao+2ep, oame, óhkCo.ca|((A{gulehtS-kcyn,.) é0	};Šy+0
kuery.ezTåfd û
Fédtez8ffõlctkn( eøpr,)elamp, oOt i {
	ifp(-no )`x	K	åhpp( "znop()+`expz + 2)b3	MZ
9r%trhà$memS>lålopi ½=? = ?
		IbSUmry*vhnD.ñtchec_eüacto2.ldms[ ],4axpr	!`Z0amems[0] ] : {Y 8.			jQudri?&ift,mA|èeó(gXqr, elm{	;	e,
	
Ydirº guşbtaon+ åhem- lió(!TîdiL )pq	Far mïds(gdà9"K],j	©cur = elom[ ähr ];

w`mlm 8 cpr '&`cõp.oåType )= y &$ubtim === uhleniï`t }l*cur.noDmùpe -)? 1 ||%nAuary, cAò é.ks* }fôam -	0)`{			ùf` .c}pnlodç{Pe ı== 5 i {		íatciedpqóh) cr ©1
	‰	}Ù	cur`<db2[dip]3	mÚ Irwtubn m`tlt;
	},
bôh¿ oe~ation* ceò$#rmSuhô($Dir, ålgi()°{	besult = resuüp!|| ±:	fiRànum -);
J	Fo "( 3,cur{ ãur = ãuò[lIz ( [			if ((}r>`odeDyPe =9= 1 ¦&à#+NuMà=<(Pm#ult ) {
			 cre!k;Ê		}
		}	Båpõpn ceò9
 }K
	sy`min': æunc|ion( n(%lem ) {
)	var r ½ [U;
	Idop .+`n{ n = î.neyt[	bdijg 9 {
		in 8 ~*nOdeÔyp`$?= 1 $. n a9= mleM°(à{
			ypnpush"j )?
	)tŠ]

	òete{n r; Š]9:

/!ImplemeoT0phe ilEntiCaL(fõdãpioalatx(fo2pdùlvz and n~
ftn`tIoN winnOw( düameots(¡pwam)v`up, kEåp !¡k	if ( jSuåry.iSFunaôhon) quahifier é - 
		raver. jQugry*gbep(elemants)fu.ãpioo(°elem,"i )8r
			vaò retVal =-!-qõaligior.ball!e|em, I, edem 	?
ù		pet}rn retal01=9 KmEp:m-;J} elsu i` (1uaìhfIe/fodmTyå é {
		rettö jqee`y.oRep(eîemeşps(&Fwncpyoo*Emdm, ) ) y[	zdtuzn,(m,gm 9=-!!uaìhgimbi =9? keep;		}){

	} m,se hf ( uyp`o$Qõalif)eb =}=$wtò`ng" ) { 		vaò æh|te"gd 5 jQUmy"gpmP(e|dmeos, fungiKn `dneo y {
	råtur~ elåm>fodeDype ?== 1:
		]-;J)i%(pisQimpLe*te{t, quádifiEr i ) {
)	)re4urn jQwevy®`ùlter(qua`m&iEr, boluEvaæ,!keep);	}`dìqg {
			q5a,ifidr ? jPuery.fmhter(!1aüiçimR, öi|tgbg`0!;
	
™|Š
2etõrî nudr9îgsEz(åleloNuqì n5nCvion8 e,eh| ù + 
‰	r%ard0 jAu%rq®i~@zbiq( õ,gM. ñualifker ) > ¹ }=¿ oeåp{
--;Jyš

tár rinm(nej}esyp=ä/$*Wuerù\t+= (?ºg+}nõll)6/o,Š	rLeAeincWhigsğAce"- /Ş\s+/,	rxèdmlT@ç = /,(?áar%ebrşc|embu$|hs<iMw|knr5}|ìhîk-mpá|ğAram)((Û\w:]#©[^>]
)Po2¿ig	rpáOamaà9p/<([\÷8ß-//
rôbody ½ ¿,tbodù-i+	shôm| ? /0|$#/^w+9¿(Š	~noaábx% 5¨/¼ÿ*wcsipd|/kJoattõ-bedx0ôIo.|styìe)m,(#k`ãkõ$?"khecë%í"(oò ãhmCkeä øh|-m4©
‰Rchobk`d = /aèdckm$\rª(?:[^=\ü=Üs*.chgc{Ag.-#i,š	{actikn = /\}(Û^?'>üqı+^/-6/cl
7wapIñ`"*{
)/utiiş8`,!? "<semEcp eu,tIhe='multiphå'>", "<¿meat4² _,	)hegmNf8 [ 1- "<æiålfsep~"| #/"i%ìdsE~4¢ ]	dheiD> _ q, <Tcb|d¾, &4ïtabo%>"0Y¬
		tr: { 3, "<tablE><ô`ody"$` ü/|Bo`y6|abhe<r ],
	dä: K"3< ò<tAkle<¼4booy>8ôr>"- "<otw<.t`o${=%ô`ò,o" ],
	coh: [ 2,("¼paboe><t`ïd{.<.t`ody><aïlçRouq>b(à?/okngòO}`><otabn%? àQ,
		mpea: _ 3(°"<mc`>"¬ ",/-ap¾" ],
_`eFaulpz Û 0 "*$ n ]
¹P{
JgzapAáp.oqpçpouu = wra0Map.ption;
wrapMap.tbody ? ÷rá@Map*tfoov ? wrapMav.óoìgr/}p < '~!qMapîcap~iïn < WsaøEap.tjeqd;
wråpMAp.vH = wraqIap>pe

// Ie can%t ó%riglizå >lknk> aod <sariy$> ôags$Noríaü,y
if ( !jQudry.Supq/rt¾hv-lSepéalize )àk	wrapma|._dõ`aUlT%< [01, "diV|dkv>"¬ "</dmv>" ?
}JjQeery.fn.xTgjô({
	tmxt2 fuNctinş("tmxt é {
		éf ("jqqepù.icFqîctIon.påpt)%	$y
	)	{e}qrj44hi{.åacH)fulótioo(i!°{º			var Co,g ½ zQ}erp( thic!)» Š		qålf.u%x4¨ ôe}d/`all(}hkq, ù(!Sehf.ô%x$,)9 )+		});
		}Š	™if * tyxeof(texô !== ²jrjmc|  &¦ tezt`!}= undefi.gd() x*			~etuòn 4jis.e-~ty ).qpy%nd( (4iis[p] &. thés{0_.ownarDoCwiejô |L"`oauMen|!>cz$mtoextNoDe( te8t - )9Š	=
	òetezd hÑuo,teøT/ |hyr`);
x¬

	wrepÁll:(funãté/n#html ) ‰i."bñuåR}osFuncvIoh( x4ml )à)0{		raô5r. pø)s.each(functmmî(i	 [	É	‰j]umrù ôhoS),wrqpAll( hô-m.g!|l¨thiw$`i) -+			ı);
	ı

	)f ( ô(k[0İ i {
i/¯ Vhe ulå-entr p wRcp`phe*4krgav aroqîdŠ			~aò ÷Rkp.=0jñemBy(0html!thas[0.ownerDOcuíaşt )/dq(°)/cloşa(tvue);
			ib°( txIs[8U®pi2mluNo$e ) {
‰			wrap.ioCertòagOrE( ôhks[0İ y:			}
J		wráp¾ia`)õfcpk/ny {
				v`v elg"<0pm)s;J
‰ 		w(ihå ( }lål.bmbstchill /p`ìeogIrsôAh	md®nodeT}På }<= 1 i {
				)d|dm = åhål/i2spGHk,mŠ )	}
	 return0`mm;
	)	}(.appenethési3	]º	vEtuön ph	s+*	},

WrapIne": veoc|Iod( idm,`! s	Iv x jAueòy.isFu.ãTéeo((html ) - û
É	2}Tupn thi.aaai(g5naôioN(Ii {
				êQues))xhs(.grapHnfm"( xtmd.#ql(t`iS, i)¡!?
	‰q)1		]

Ù	rEvern 4hI{.each(u.gpyon- {
ÙVar qå`g = jQuezy* t`ir)	-
‰		kootents  sådö,kKotebôs();
Jiif, coj~ens.l%ng|h0) y
			icoltEots.wrm Al| x`uml i:
		0alsm {
		)	{emf®appmN~(°hten )	y}
	}!{
}-
Úwpip: ftnat)on< hpmL)	à{Zbetupn |hi#~eq`|n5ncôhon() s	jõaòy* u(isp .zApA|d) hTml !»
		ı);]-
zufwBkP: ætîc|Ioly!,k
	)råt}bn vhés.pa"ånt ).mach(`wgtynn() {
Y		if , !JQ`er{.ogäaOmE( thi3- rbod}$	0!!z		)`qperû(¡tèis +.rağlimùph(,DiIs.çhiLdJo`es$	;
É Ù|
	}y&ån(=
	},
	Ağpefl*!dulctëOoi û
		r%turljiió*demMaNyp8a{guMenôq< üBueü fnCthon) ulea !!{Éyf&(%Thas*ndATxğ`&<=±1à ![	)I4hi{.apğdo$KHihd(,Emem )8
			}
});
	|l

	xrepåne: õncpion) {
		settrl tkis.tgmManip¨`r'uMehôs, |bõd, feocthol, mlee ) K			if ( Tøió&odEôppd(=,`0!)!k
	) 	tiisihóarJ%fjra, mål, thms.fip{dChilt -;
			}
	});
	}-

	âeægs> fto`tIo.h) z
		if ¸ tHiS[0] . This[9].`apån}No$e ) 
			råpuBn ôhis.doMÍaîaxibwqmao${,°bals%, vqnctio8 elem') r
			Dxaó.pa{EîtNae.I~per|BeFore( emem(°thiw );			});‰} oló` io , ar÷uoents,|%ngh`( {
			v`r {Ew = êP}ry(aó`}me.ts{0]);
)	)sed.Põrh,kprly( rmt, t`is/@oArráy(	!	{
É	rgurn thi3.pu1jS|ackh set`"bafOze", `rgumultr));
		}
},
:	áf|er!du`cpmoî() {
	id   TiióYp\ & ô`is[0]xareo4Näe )4+	òatu{N`pha.eomAanip)!rauieN|S, æ`lcu, funktin(ğenEm ) {
			thia.piruntFoDe.yjsevtCevkrd( oLål, ô(iR.lux|SiBling,);
		Éy+;	)} amse if  &!zgõlelts.le.gti - {
		var såp(,This.p5shStack($4xas,$iftar , érçtmen$s )3Z			{ô"pq{H/apply( wat, jU5eRy aroUoe~tó[8]-tkArray(9 )3	‰	rdttsn)Setû
		}
	},	
/o oeepData0i{ fr id|eònñl`q{e`only,-$o niô doctí`~t	semgva> f%~cthon) seneãTo2, kee`Nata )#{
		for ( vaò y = °$ elem+-(udem#=*tèhóKiE) 1=°nwln;pi{* )'zš©o"( ° s%n%ïtïrà<} nPõarx.Filôer((sglectOz,%Z0Aşeo ] ©.l%oCt`0  [		™if ) +ieAğote ¦&`%leo&nmde_yqe0=}<©!+)àyj			jQõEry/cüaanDau 8 eom.'ut×le-mjtrÂiTagNaMå /*&! ){
		™hQeeRy.cheanetá  [ eleı ] /3
iÉm
	 I	if)( aìem.tAreştNle))`sZ		 `|eo.xaòdîtO/da®rõMoveAhhm$. g`åit)?
Éı
		y:	©=	
		ra|%zH tjis;	}$

empôyº f5nbtioN«)%zª	ob  `tar*i#=°0¼ glgm» (el%m ½ ôhmc_i]) != ould» m+ 9 û
		/? Remo~`0a|m%oP n$e#*aod(0sevdït memopù l%m+{‰		hf * e`mm..odeTypg =<½ 1 ) {
		Í	juerx>CoecbD`ôa) edem>'etElemånSJxôaggmm #*f	"	;
)	©]

	I-/ [emaö``ani:remaioIoa lo$eS/	I	whm,ç h elg-.dipótKklô ¹ {
		e,mi.påiovgCniìd( glemofù2w4CHylä )	ı
	¹		Rgpurï tHor{
™m,

	cdng fujãtiOo(0aö%nds © {
)	/$ Do the ãdïnm
		vaò et } thiC.eá`¨&unãtyOî- { 	‰in + ¡jÑuer.óuppoR|.~eC,o.eAöd~4&& ¡jq5gRy*iqØLob¨pxiw)#)`xZ		/ï YE%cïpées evontqäboun`0véA,attaahE~eot th%n
		/ %sişb cloodÎmä%/ Caühijg deô`cHGvelô oN4The*™	// sDo.m hl` Also ramo¤the %ventó vrom the ovionqd
		/¯ ÉN(or`urğto get qro5nd tèis((we uco inneòHTDN.Ê		/ Udf/rtwnatuly, txAó o%anó s/ma edi&matéi~c($oI			/$aôtribeves in(IE ôha4£!rd ac4õally ÿ.my sôor%d
			/$as prÿpe2}ieq`Wiln ncô ge copiel (suah aC$the			// thm naíe a|t{ibpôe-on an io`uté.j		vár`h|mn } thiB.oõpurIML,
‰				k÷låRF/kqmeot$%"thiwognar@cu-mjt9J
				y`0((!hpílb!({				wa{ ôiö = ovş%òDocuhåjt.cbeateElgmelt(¢dmv&);
)			 éVnap`entChil. thù#.cmk~eNOe%,trqe)!)?9	I		h}Dì = di~*énn%rHTEM8ª			}š
‰		zdôuòn jStery.clman(ÛhtMl.òep,ace(riîlm.ojqpeBy, "2)					// anfle ôhm caóe in IE!0`wh%re aãpiOn</te|/> óal&-c|osas a uag
i		.reğlacå(raãtmoo$ '½$"<ç)š				.re`maca(rleidmlçWhitespácõ,&#	], ownerDkãUoend)St]?
		} elSe {
				vaôurn hhó*ãloeJo`e(tbua)9
	}
		});
	É,ï KOpyàtè%-events gRoe`the Oò)wiîal ua tø$ coonaŠ	ig 8 åvetp°4}=#4rqå © {
			cl/neCkpyEvenu( phiw,2repà)?
	IalooeÃağyEVen( pèis.nind("."),`pet/ind("*")$);
		}

	‰+¯ REttrl di% c|onan wet		setqrj reT;
	u¬
	ltıd: nunatiïN( valqe ) 
)if ) v`üuo ==½ õjmefIn`ä ) {
		‰petuî thk#[ı f& 4iis[tY.o$eType ==ı ± ?
			ôhiS[0İ.ijnerHtM\,z|labe(rInLmnåhY5eRù,`"#	$Š Y 	,u,l:		/0Rå`%in ÷eàcc,4abe c (ïrôa}$$a~` b}cu usw in%r@ôMN
	} elwe))æ h upEïd!påLu%à5=8!"sdri~d" &p!òfoacèantms|$talue0)`&¦	zQu`rI.sõpğ`rT.LåAäaoG_Hipery!oe°|| )lEa`ijgWi	taspig.tesp/ vAluå ))-f
			w2ápM`xK!(òtagO!oE>`xdc($ValuE¥	 || Û"/+"¢P)Y=].ToLÿqgRKaseh) M-) p

	vá`ue,'Falõd.gplaca)ry(te|Tag. 24$0¿,/²2â);
	É	tr{ {
		I	go{ ( var i = p$#L.`phi.nngth? i < |9 I+`) i
				 /,-Rmmve mlmmejt n/ls áfd rRetål| meíorq%LoakqZ		‰	ybp(,lióSi].nodåPype ?= q = {
=)		kQudrq.cm%alÔa|a) this[I]geô@lEm%ntsByDa'Naıe*+") i;	‰				dhi{[y].`îebØP]@.=+vqhua;
				}Ê				}		./ if,u{ing !nne"hPM!thbows gN.excep|ion< usm |(e v`llb!cC mmDmOä
)	-)catch,e- {			}hip.`mpüyé)®at`gnd °vaL}à!;
	]
		} mlse if , úQõdrY.iûFõlktmO~(`valuE°!p .kŠ	YôhiS/abè(nUn#taïd(	-{K		veB`qõlo = zQõeòi© ôhés)){
* )	elf,hpmL- öa|ug.g`|dhpl	spi¬ wemF?hôaí/) ({
I	}i;Š	} ålóa$[
		ôhis.eíptx))/appene valõe!);
‰} 
		Return uHis;
-
ve|laceWéti:$FuhãpiOn( ralue!)`{Z	)f ( ôhiC[] &$(4iIó[°U.eRå@ôLode i {
			/ M`ke õre tHa4 thA,eo%í`~t{ abe rdmOved vroM"4he DOM befre t(åy as%$InpgptEd
‰		#/ thisğaaN"Help n)x òapdiciLg a yar%nt Wmth shi`d elålejtS
	‰id)(!jSugry.mCÆunct)oNx valUe i ) {
	)òaur. pèis.maãhhfucTyl~(i)![Š			~Ar sdlf,àjQTeRy(t`és-+ol` =)smLv.øtol();
-		self.zExlacõWiTm vá`ue.cáhí(!ti)s(0a, oLô ) )+
			m)9N			}

			éfğ(!`ypeof ~amee a9= "trijg"!	 {J	ralue - jÑqepy!valõa-)/detaci()+Z	}

	9	òeturn txis.maãh(f}ncti(~ - û
		ivaz ~%xt =-txas$o%xpshbli.o,>)		xardnt,-%thaó.xar%~p^ilE;

			j[eepy(-Dh	s é.rEmo~eh ?

	)	Éaf ( next¢	)kš		kQuery-Nexu(.be&obå(ppylud );
			} e(se!+*	I		kAudòp+pk`unt).appu&d(&falua`(;
	i}
		]i3
	-)eüse {
	9petuRo t`ip.pséSôac++ jPuer	(
Ñqep}isvu~cuIon(valu) ? ö`nue(y : ~AmUe)l &rePüaceWiuh", vclE ){
		}
Iu,J	deôach: fEoction- selektïR0)ğs	Kreturo thiq.remo&å 0Sglebtgr($TrUu i3	}
K`oMO!nip: fnctimo((apg2, tablõ$0Ckllback - {
öar reótüds,$bùpót. frqf}%o$. ğ`òen ,‰	fo,ue %àas{Z°Y<
			qkbipõSb<`[]
	?-°Wg caş't khoduNo$g frñcmdnds t@ñ4&Contaél cjekked- in0UåbKiô‰	i&%(h!úQõEry/rõpp/rt/bèac+Olo*u ö&$azcuhe*ts.låjçdo ==½ s >&*tùpeOv valqu ==? "strino"¤&& ~bieciåd/$epv( Fal}%`!`)$[	™	r|uznptxiwgAchxfwkténî() {
©			kQ}ary(4his!®do-M!oağ(0aw, taBle- óa|,j!kk, öB}e');
I	-)3º	¹m

ù$ (*QpåpyocÎpnation+pñhõ%- / û
9		rå4õPî uhk2>aqcioq~cô)oN-iy û
			var seo`09x*[%ory(t(i#/:*	‰		azbsRğ = tóhõ%.#mlì(ôks. é  0able <`sgln.èt},()(8 uşde&kj}`9		9sõlo.dgmIa.ip( arçc- taâhe,"cmdm`qk /;*	©		;
		}
		av x |h{r{0] + {
™i0aRgjt = vanqe æ& Fidua¾pielôFÿo
	I// K` se'se$iî a nRagíe~4. jQs4àese'tèat owtõad oFf`uildiNg a new onå
		if ( êAusy.su0pOrp®pareNvJode && pápån~ &" parmNt,nitaUyrd -½-(!9 6&ppaRm`t&s(mloNo`ås.lejgtè == ô`i!/,oh÷tè / {
©		s%sqlps = { ærqgm%npz pa~%np x
			ı åLse*sJ		rosulôC,- jqueR{cuéddraoiejt( !raû( `jis, qãbi0ts°);
	|
					örag}Ent¨5 Rm#}lõsnfzaomebô			
I	m$( fragmenô&chiläFodes.lejwth ==? ± © {		©	æircv = vra'oe~t -""zagme.firsôxind{
	] elqe {
K		fir1t = ærcmeîT.fibstS`ylt
		}

			i` (&Forótà	"j			)tkBmA0= táble &f kA}eòyşodeNáie( first, &ts"p)ÿ				boR ( vár i#=!0¬ l = vhiq.length;pi &l; i++ ) û
				aahübmck,ãall)
				)	vabhå 
			y		oovthyc[i]$ Fér{4) :
					thisKkQ­
]		i ¾ 5 |x res}l}s>cqch%ibìe L} whys.lengpø ¾ 1 $<ª	)				æpñGo%np.a|/neOmäa(4zue)`2ê				‰	fbegoe~t				)3º				y
	É	}
		if (&qóryt#.Deng4h - û
‰			kQudòi.eaaø(°ck"ipôc, eVclSbzipd0);
)	}
	‰|:
		vetuòn$$his8
	}
}!;
Šf}nction sooth ålom, ãqr + 	retuRo jQõarI.nodeNmmm(õle-, :table#	$?i(eloi.getElåieftsFy\agJñ-m#troôY+)[0] ü|	dlam.apteîdChkld(elå-.wjerÄOcUmaîp.CzectõElEmEnp("tboD{")(¹ :
		edem;
}
Zbõ.ctok~ cloNeCopyDvent(mrIg, reté 
	rap I, 0{	rE|.each,fwnspén(- {
		mf+( pèi{.o.denamE !=5à(oRieÛiİ . mòigZi.joduName( )${			ratu~.;
		}
		pár OldLat`$-#j]qgrù.eatax oRiG[ië(} )$			curDctñ ½ jAuery®$ata(0thi{,$oldÄAta$)|
			events = oluDa4i .$ gìdData.eveotw;º	Ig ( åtej|S°!ğz			ddìdt curÄau!.ábd`o;
	é	curaTa&gveN 8pr}+
y	©fo2$ rár(Ty0å in$evenps - {
)fOv ( vaz hA~dler mN°AvdnT{
`type ] ) {				jqteBy.gveJ|.e$ô  tiiw,°pypm, eva~p{&4ypå _Z,hantleb,¬ åvetS{ uhte![ h`nles ],da|Ap);			ı
I}
	mu
	});
}

bUumRy.r`kLmFòagieNv ½ æuïC|Ih* iRoc< nod%{pqãripuS") {	w!r îrogmE~t¬ cakhå`rde¥ñ`hdzesuîtó$	Db 5 ~Odes ',nodåq_ _ ? nede{[ğ]¾MwNobdoãumEndp|| nOdEsS°],'DobõlgNt); ‹	//$~dy kacHå "Síao¢ h!/$KÒ) svinçcğthA are kssoãiápg$.iph |Ho m`i,*do#umelt
	/o ChoNinç op|ions |g{es thu s%lspå$!qvAte, o-dïj't-C{chd0thí
+o IE,&pdoesn/Tødiam op!the~ you ğqt =rjea|.%or <embm$~ ehuMmnôsğho i fragmEn
	ÿ/"Amso,pTeBKIt ägec(Nt``îOoe°"shocket#`atTrIâttdó oN8a|aoeNnda¬ o $ol§p ca#hešif(( aòa.ne~fth$-==p0 "& |xpaob arsS0X -==à str)og2 f"$Av'óRq\/Lmngpx < ?1ó &&$doc 0==(Doõaeh| .&I!rocache.4eCô ``rgsKøXà "&& ¸jQugryóuğpo"õ,chåbkoOn`ğ|| 'c`eakd.ô`st( aBgc[0_ -	p) qJ
s`ó`ejle } u2ue;		caghåpåsw,ub05 `Umy*fregmEnpóZ%ArgsZp] M;
)	éd+((ca`harEsults + {
‰	Ihf ) cacheResulôs!!= 0 ) k
	©	Ifr!oent = cachermsults»
		}
	‰y
	}
Šif$()!ærcfm%nt  °{
		Fraçimnt = ägccReAôdLOk%md~pG2amdnt-);
‰	zQuEri.blekn- ápçq, doc, dzagment,)c2ipôq$);
)}in è caceAbhe ) {
É	êQuer).fò`gMgNts[ igsÛ0] ] = cachmbusulôs-?,bragigNt : ±;	}
Šòe}Urnr{ `{agmõnt2 zAwmåjt,)cchaabm%: cagheAâdå }+}»

bQ%eRy,frigmenps = {}{
bQ5mRy.eAcH({:áptodÔa: +apPenô"/
`reğenD^oz "prEpend2,
	mnsdòtBfora; &"efore ,
InserıAgTer: +afdõr",
	reğdáceAml: ârgpmaãeWit(&
}, b}Nktion(*nkie,`lrighnal ) {
IjÑtmry.vn[ oame0\p< &uNspi'n( selea}k~ © {	var ret = [],
		)nserv = êQuesy( sdles4o24!,
		0ared| = this.Le.gpx == 1 ö&$di)sR0]/@a2ejôNode;*	I	if ( `arenô &&ªPiråjô"nleôqpe!?`01 ¦&$@ápuf|.khildNodm#.låjgdi === 1 '&`inqgrt.|eneth ==< 1l)(::	iinserp[ omgilah!) thir__ )2J	zettrj tjió:
		
		t0dlSm {		for0(ptaR )`= 0, l = insert~hõnotl i`< l; ù#k / ûI‰	va{ elåm{ = (i <  !?qphis.cLohå(ruEi : |hiS9.wat(+;*	M	jQuepy( Ioråpt[}%([ ormei
ql ], elumó -	)	)red"=pråt/conaath elemó i;
		}
				reter..tèióxushótáck(#put| o!oa¬ éns%zt¾sålotnr é;	|Ê	}:
])9Šêu%zynexTe.d({»cm%anº æ5nctaod8 gleeó,`"o.texP¬ fRegíeî, sazipt{ ) {
I	ë/ntåxt = ooşpõu }|àdo#ueeft:

-	//p ãon$mxt*createå`åmoNt æailw kf IE wIvh an evmò buv zeôurn vxp`ïF%'obêecd'
		if`$T{p÷gf conpe8tcbgataWhgmmhô ı== #qî`uFkNm`" 9 {
		con}%zpà5 cot!xt®o.mrÄos5m%np || kootuxôK4) ¶ óoodexôZ0M®/wjåpÔOc%o`nt || emóqm%nt;	ı
	ráPğbed#<p[]+
vgò ( var é = 0(0aìem+/(õhu-+-)eìem3[)_)¡!= nulh{ é++ ) û
Ù		)o ¨ tXreod``l%m =4½ â.}Mndò 0)"k
			Íel%o {< /+¹ı
	i`0()!glei ) [J	¹	©contaope
		}
ª			/* Aonezp°ht,m {triîg"iop dm nkdes
M	if h ti}e@ eno ½=½ +spyj÷",& ¡rè4m,.påst(*elaí y + {
		Éeloi 9 coNveøtîCr%opeTe8tNo`e(°lem i1:
		h`aì3e ob0( 4y@ecæ ele(<=- striodâ / {
‰)	/ Fix0"XHVAÌ"-stile0Té's id  ì,,b{o÷rers
			ule- < el%o.dğlá#orxètílWag(  |$1.=/¤2~"/

I	K	//*Prim whipåsğAce/ ïpèezWoqe éNmexOf woow ÷'rK a expec4gdš	‰		Var ta',="(òpa'Oame.axEc($e|aí - |\8S¢", . }![1].|kLc÷ErCase ),				w2ap$=`uraxMáp[ tao ] |t wr!sEáp®Olefaulô,
		9 d%p4n = ÷rcp[0},
				daö = konpex|.cpõateElgment"dmvò!»

			‰// G/ t i4m, aî` bick$ Ph!n veel`ff#extra(wrappers
	‰	diwmnneòHTML ½ wrap[0} ; ele-`+ôwvap[2Yû

				/ï Oove to the right deppx
			wHilg ( ôeptl-- ) û
		KdiF#=!$ivn,esvCèal?
		y}
		©/ Remmöd IM's áuôOksarted$<vbod}>¥&vcí tag,m öpagmeots
]			if ("kQuerq.cupygòt¾dboex ) K+
‰	/ Wprin'*gcq a0<vaflå>l *eayª have!rpqriou <tò/fY>
)	™	far0hacFodx09prt"oDù.t%s4,`}em)-
			‰	tbodù ½ t!o ½-= "tcbl`* &&0!hasBoDy ¿						déV.&krstShild 6&0div.dirs4Child.ãhkldFï`eS&:	I			// Ódring`uaC-a(`qre <${dad> oR%<ôfo/t	I			M	wrapÛ1_ =4= ²<|blu>² //!x`sBod{ ¿
					‰	ei~chylôo$gs :Ê			K			‰K_)	M	For0( vaR&j <0dbodynlungth - ±3`J := p ; -%ê ) {
		I	if  àbÑumRy.îgd%OAmeh tbod{[`j ]- *trOäy" ) &$ !vbody[ j M/chiüdOles$l%o}`ğ(0{
			‰	‰	tbo`yYhJ!.parunwNode(r%o/vdChile( pâodI[ k ı í		)	©m)	i	}

				t*
			//0IE cmíplevelx kilms luading$wèitEspacu ÷heL innõRLML1as usmd
	if ( !jQerh>quPport¾lmal)şc×hy$espacd!& vhåaeio×hipe#xAãente#u0dnem + + {
			idiv/)nbebôBmFo"å( con}exp~bzidePõxtNoDe àbl%aDinçWi	tóPy`mm(åb8amEm	{0} -, ip>fk{4Chihl -ª©		M
		 m,em =2`ko#jildNoleó;
	}
Ê	ii&$0`l`ío/ä%Tpp )a{		Ret~p3h( alem )	
)} g,sd s				re`" jÑtep}oeòGå -mp> åhmm,	»K
	9uJ
	i"  `rg-ådt + {
)Éfor-( i`=!» rdtZiM; ë*+ ) {
	if,`qsRi@|1à$¦ jeòq>lodmNámõ(*RoT[iı( {crhpt" ) &&0(-ReD{hİ tYre pı {eüiU>ty`gtglGerCárå() ?=} "tgt/êaöasc{ippæ)¨)![Jé	wCrixp.z5shh ze|iMnpibeNôJo`g ? ò$tZi]/`ñren}Node*rdoo~s`é,d( ret[i] - : re|[k]°(;			i]<%lsg {
	I	ag . rdt[i/n`ePy`m }<} = - { ‰				rat*slIãe¾`p@m)h òe}(i û 3,!0}.cnnCaD(jÑeeby,}akeËBraù(re~[k]>getELoMåjtqB)\AïLñam(*Rcrip~"))i é;
			é	}			)fr`-o,ô.apxendC(i`m(,2et[`] -+j)		-	i}		}
Z	Iretu~ rdt	} :	ëlå`şDedc* bunkiş( aleos0)p{	&ar $i4aàaô,*cccød°<)jQUery.gachõ,:	ópe`é`ï ? jQõezI.wdîp.peóhed-
		`ulmtexpafdO-0hÑqm2y.sqtpo"t.deìa|EExğ`şdo;i	 fr x ö`v i = ò$¡Enem9`(elom`- doemS[h})$= ntll; m+« y {
			iæ ( elem®jodeáie &&(Jquery.oodata[om.ncl%N!íe®too7erÃa{E()İ i {
		)	clotiNue»
		]

‰		id = ådeM_ zPõ`z/%xpqneO ;
	 	
	Iiö ( idb)`{.		©`áta = cachmK!id :	I				if0($dedi ¦&`daTeåpe`ôS") z				fmò ( vAr ôqx iî da|a.vent{ + {					if  "reãiah[ |yğe U()({					zPuer.Evanp.Reore(%%m%m  p{Pe )3Ê
			©	} e,ó% z
 			jQ}ezy>rådo6uve~t- m,ee¬ t	{e, da|a.hánôlg )+	)		}
				}
)}
	)Ê 	iæ ( mel%teuxpanDo ) {
				dmlodå elem[ jAuezi/ezpáJd/!]{

		= dlse k& (``nem.removeAtôri`wm i {
			ielem.remjv`C4ty`õ4e( jQuåp}.mxğando ;;Ê		]			I
			delete-céche[ k \{
		})=	}
}(; funcpékn m6qhSavAxT( i,(eoem ) {
	If ø gLem.srb$	 k*	Ihqu}R{.abëh(+š		rm:pe|em{rc,
	‰	abydó0,faLsa,
		$átáPype* "ócsiqd2
		)?i| elce {
		nA}$òy>blobAmAv`l($Elam.t%yd0|| eLem.pextCont`np$|| åhåm/innerhTML(ü "",	;
)|Z
If ( ele-.@árenvNodm © {
	ålåm.0aõntFo$å,rdío÷eKHihô((Elem )9
	}
}

 
var rampiA`= %alxHaX¸SŞ)_*|!/i,
	ropacit} ı ?o~!cIup= _)]:)/,	rDáshAíPja09`/m([a-zİ)/io,	rupp%r ı ?([A-R])/g-
	r~umpy ? ïX½\d+(¿8ğX+/&%y$J	s.wi°<à'^)?Pd/,
	grsSèow ? { pO{Iuiï`: "afrluDm"- v!óiãI|aôx: +hi`t`n"> daópüay*$ rHï#o$|¬
ICscWadth = [ 2Le&ı". ²Ri'in ](Ú	kswHåight = û 2op#,`"Ògt$om" ],
	curCÓ@/
	çetCom{uôadCtYne,
	cuveîTStylm,Š
	fo`oelBáCe = æunCwio*è a|#lådtEr ) {
		sewUòjtlg4}eò.ôo]0qaòAqSg()9*	}+

kQõdvy¯fn sqó = gt~atIo&) şa}%, ~aìtç ) {
.o We}pùn÷ '%ndåFiNo$' éq°A$.o%op
of!(°ar'}-eltpîle&çpè ı-= 7 v"06ie05½) En`efém$)0a
		Rgpup~ }(iR»
½=
råtıRn jPudòi.aga÷pó(,$hhó, cmg,àrilu%, trõ`. ~tîat)on( elåm, na}a, alpu 9 
	rat%{n"valõe/==°uîdgfmfe`p?		jPõerI/rty|E- m`ual oaoe, vaoUe 9 z
	/jQueR}.css(àel!m$1Dñmm +9zı	?
}9

êQ}Erh.aø4eld(û
	// A`e é."8ld``ro~`òpy noaó nOv operrifInf0tx dgfáq|t	/.0bå`aokò of Gepôi~F and aettinc``às|Yla pòErtyCsSLgoks2'K
	Oøagitaz û
	gepº nuoctiÿn- ehudm cmpõtåd  xÊ			io 8 sm`utå`p)'{
	II	//*Ve sHo%ì`°aüGay{ gaô c nQ}båB%bac{ fro!eğaciuI			v!r òaô = gtòCSC) ghõa, .o|ashtY#,  ÿpáCmTy (!;
		9re4}rn raô =-= ¢" ?%5" :`Ret?
j			m else {
		re4urî õlme.style.oracity;
	Y	ı
		}j		=
	},

‰// Gxãhudo uhe f/l,owing c3s ppïpgrtiår to adt px
	csóNumj%r8 {Š~Iîdex"*"trqe,
		"ömntW%iehpb:"tuå,š		"opáci4y"; ôpu,
		rzÿoo": true,
	"héngHeiçht"> vrua
	}
	// Af if proxeòti% whoså oames yo} wish`4o fiø bEn/zej	/!cetôing"n~ gdôti.o ôhe ~alqe‰cscZrïpw,k
Ù'? niálizm oloat kC{ proPeruyš		"f,oaô"º jAudòy.C}pqjòt>#w#F`oat ? #assÆloav  : "s4yhåDìoed#
	u,

	/!0Gõ` an`0så!dla0sôile&pòix%z4y on4a#OI Node
	ruxle: nuşbtio.) ålem, namd, valte, dxTra )8k
		-/ Äon'~ {et {ty`es oo text`!nd comíenT`nï`å3
	ag h !%nem ü\ Emem,n/me\qpe`==-+3 l| elei.do$eType ==} 9 |xà!elme.rôyl")°{š		{etqrN;
ı
Š		// Íake(surå ô(c se&re gorkan&gktø tHe vight nAodJ6ir ret, origNaíe !jQqe2y.camelCaSg( lame -,
	i	{tyhe } mlelnqtyme, hoïcw = zQõery.as1Hok{[ oòioNeme ı+
	nam%#=)`ÑterycpsPr.vs[ opiOamd Y | orieNao%;

	I// Chåck if(wå%òe"smttiîG$a value
		aæ ( vanqe 1== ujäaæined ) {
			/¿ Make$supå thap°NqN4And(null ~a}Ues azen'ô wet. See; '·!±0			if ("pypõov wamue ı8= "nõmâes" ¶ iqN!Nğvalu%!	 t~ vAoDe ==-.ul~ © {
	)	òa|Ur.»
I	}
){-/ If0a°nwMcEr ÷a{ pAósåd In°Aô`(p8g uc!Dh% (upcep`bïr!Ce2t`ih(CW°pòmxErdyas 			if0(-ypegæ v`luå =<= *nõmbes$¦ !`UUeRù.ãssumbeòX,OrIgJñmm ] © {			valum +`"pp/;		}

			¯/ If c èoïa-ic0prjileô$âu{E<Txaô vamç( iuhe2w`óa/Juô óeu }hå speéydt ~amue
	io x !hoOoSà|| !*set§ m+hoakq- |<0(öaoEe = hmok{.óet((ElEm 0viLuE (é - õhä`gin%d ) {
	)/&¥GrAppåd do ğrevm| IEğfrom t`òkioGàerrow whej/'knvalhn,"alues are p`oVidåd
		/? æayes rpw #5=9©			vRy { ‰		‰stqme[ n`me !°ral}E?
I	i	} ka|ch m)*{} i		-

} eL{Epz	//`Aö u ioi0qeC(Prmöhdel odt |He ncş-comp}ted¥alueàfrom therç
	™hv . kooks '*ç`u  )o hma && (re| = hoï)s.g%t  amem,pfalse, õxtpa ))0!=4lendeBijed%	`s*		Rå`upn zet9J	}
* 		/)Ot`åpióe jõst get the ~ìue nBom0the$txld0of*eCô érgtırş {t}LeKpnkme İ3 m‹	}(

C{s: öunC|	on( geml naoe, åxôri ) {
	//©Mqhå {ure$th`u we'pe w/vki`ç wiuH`th`$ixp nmmm
	öar ret(`krigNamå = kQudry.CaMelC`sa( îa}`0)-
			hoOks 8àjQueù*cq{HoOks[ o2iGN`oe ];
JInmme } êPu%ry.cósXropóZ`OvigName ] |\ crigNaMe3Ê	// Iæ a hOoağti( rnwieed gdt uhm compuTe$ vah}%/òfm |Here 	if ( hokS$&& ¢get* in4hook && )ReT 9 hookS®gep( elem< tRuE, ux|2a ©) !==*ndefine$`( s			reôprN"båt;
	¯ OtiErwise,!in á ÷ay |Op`åp ti%"coipuw%ä ~aoue åxéstc- õpe uaT|,emcå if(()CurCRS = {
YRetupn kzCSP( mlmm< şaoE, ori'Naoe );
		}
	q<
	/ @àdetkoì f`s q5ickly sWapphog)In#ou| CCS properôiåq `o geô k/sråcô cAlulapkons
	s4kp> æuna~ionh ehg- opôions,0callback 9 {
		var old = {y?
	‰// Reoem`er Tie0o|d,Vi,ões,"anDxa~smr| t`e n%w ofes		For  <far`hame i.pipp}OnS )àz			odô[)na-e İ ? elem~stlE[ ~ame(]{
	emeí*ópLm[ jame _ = opô)onsQ0`mme ];
	m

		ãallc!ck.calm( eleo -)Z
)	// Ru6er| |(e old w!lqes	For ( .aMe in$Ot4ibnr$	-{
 )elmm®sôyl%[ name!](pcl`[ na}d ]?
	}	},

	camdlCas}2ğdncTion(2stRyng - {Iöevu{ rôriNgreplae(àräashQLpha,)fcAmelCism 9:š	}
}){
./ DEpRECCeD¬ Use nPueòx.#s8) hns}EedJjQug2y*curCSS = hSumry.cs3;

jÑqõRye`ch(["hmiw`t- *uédôH"], öuîcviod8 y, .gmå © {
	bqtegrsHï/kS[ n`md*]!=ğq		gotz vEnauhïdº g,em¬ ãoo`utu`, g8trá 9 {
Ipá2'Vel»
Z		kf(( coMpqôee ­ {
‰	m	iF%(àaü%m,ofæsetWietè !-= 1 9 û
O			pah ="eåt÷H/ eleml ~aoe, eXtre )3ê
			} else(z			jQu`òi/cap( emem,àCsWHos< fnc|ho.x)$j
	9Y		il < gm4WH¨ eLg-, n`me, gpôru -+I™	}	;
		)	}	Ù	in ( öal ==/00) {	‰™öal = ã5òC[C) åhõ-. n`}e, nameğ!»
		ii&  (váLà-=%#"0`x"(&/ ctòbeNuStxì )${	‰			pñh8)#}ròeîtS4}hå((%mem,!lá-m, dñiõ )+
‰	‰

 I I	of(  vi,"!= îd|,!)({Ê	Ù		+o Shoel`0rå4}2n "au4o" inrôem$kæ °,"ewe 0`o			©	/ te}`oripù j!kK`r`s-cOmpatj			IpeTurn vaì =-= " °~ waì ½? *aupo-# °px"!:$pál;
				i|Ê			y*
I			o` (pVol&$ 0`\~ va| ½= whl ) {
	I	)vg,!<paì%m.spyhe[!Namå ]

			)/ Shïtìd*Retõrî .Auto °inSv`ád`gg 4,puóe$0%dopš			/+ tgmqnòaòy$i`{tá"lC-bïlğa~
	‰	‰rgturn öal =<} b"%\~ val =-? 2audo"$  0p|"*:`pál;
		}
	)	)pewRo tppeo.pel0==-& ópring" ¿ ö!m : öal / &pø ;
		yú)}<

	)sõT> nuÿction( edåe, valqe ) 			)g * rnumòh.tert((value )!)&qª			// ùgîore*nugati6g wiätj afd h%klt vá,uEs #1589
		‰valuo = pArseF|eót+velõe);
		yf&( válue(>= p © 
			Iredwpn valUe ; ãpx";
‰	I	}
			ı else {*			)rupurn waluõ;J		}
		}};
ı);
if ( )jSuepysUsport.opgaity + {
‰jQ5ory,cróHo/kqnopAcityà=`	cåtz nunbtioN( glõm| computåd() {Ê	‰	/(IE ucec biltezC.bor0ouAkityª			{aôurn(BoPácity.uesp((gompõtõd && å,eM.curòe~4[$y`u ? elem¾auBrentÓtyle&niìtåb : e|e}.s4}le&ö)ltep) |!&)09
			(par3mofat¸Re'Oxp.$!) / q0ğ)(+  b º
			ãomputgd`?("1" 0  b;
		}¬		cmt: æun#vioh8 olea, vam5e ) {
			var s|yle¸5 %n%m&style
		¹// KA haS-tzmu`l%+gkth opccoty i& I doeSbnot!`áve mayiõt
		?/°FoRke0it jy"råpt)og$tèe zoom ìev%n
	rôyle.zokm = 33ª
É	/ Set tHg alpHa filtur 4o seô the ïpáCidy
			viR$opacity = hÑumry*isnaOvaluu) 
				"" :
		"alpha(racity½" +%válõe%
(000`++")"ü
‰		fiìtår"= rtxld/filtar }|  b1J
		rtyìe.fihôer = ralpìa/tmqt(filderi ?
				æalter.rep|ag%*pñhpha nğaciu9) :
				ótylefiltur +4 ' # ox!kiõq;
		}
	}»
}

if ( e/guaehtdef`õlvRi!÷ 6&)$ocuientlefaõhuVi÷*gavoğutaduyleb)$[Š	gdtComx5ôeäSul% )ğb}Nktéon($emem("lmGOAma< nAmE )ày
		VáràreT, äAv`u,tidw(!Cop4ô`eStla{	nade = oaíd¾pmPlace( zepper< 'd1" ©.voLoweòCeCm(i;j		mF  ! ,DefáulpW	ega=0dlEoow~ezoõienu.nfaõl}Fi%w)0	%{
		ravEsn°un`efkfåD» 		}
Z	ho ( 8bomx|EtQôyne!"`ebiuo4ö`es.geDCgmputmdótyhe( |d},,nuLn )!())[Z 	ret } cOmP}4ådÓtyo.gatPzoxertùRcLwe( îamE+);			If ( re| == â $g !hÑpgry.ce~tiinS( elåM.O÷fårNmgemant.do#ueõltEmEoaît, eLemp!!)¬J	I	bed =`h[umy.style(`aleo,).áeå -		 }		}
	rg4}~ ò%|;
	}9
q
mf ( docmeht&dOcu}antMle-eft.cU~rıftQtyn! (`z	c5vpejtC||e !,funcpion()%|a}(=NiMe ù {
	var mefD, òsNEgt,
IreD -°elemsurrg.}Côxla&$/ ulem.C}Rsd~tÓ$yleYpb}me ] 
		{tylå ? e,ei.suyle{

	// Örom dhe0`w`wom%0habk cI`@e`n E÷ards
		?/`htTv:/"eriK/eae.Net/!òbxives/2006/?ò3/1<
?>15/'Comment-4ò0ñ

	/ éd+wuòa`no4$õa|ing©uyph a zEçpìaz t)xal nmbårJ	// bqt i oUmbåp¨tìAt øas c wamre unding- weàhåed unpcobv%rphô to!P}x÷ds
	ib`($!rnulğp/tmSt( peT ) && rjum®turu( ret ( 	 {	‰	// åheibez ôhe o2igincl Vaues	left = stylå*lEnt;
I	rsLeft = elee>runtImeÓtyleìeft;
		/.(Pudài~ uHe ndw walespto oet a oom`õtåd)Falõa d}d
			õlemo2õnôimeStyle.meft =`ammcprpeNtSôyla.eft;Z			stylu.l%f4 9`fime =5= +fo.tRiZm"(? "1`o *°(rat ~| )1			ret = dyhe.p)xe|Debt + ¢px ;
	) //ReFept uhm ãhalgd v`lumc			stylm|aæt =$Left		edåd.ntame[tyle.üegT"- rsLeF~;
		|

		retuzN%retà==!¢ ? #auto" 8 rgT;
)};
}

cõrKSS = ge|ComğuôedC|yle || currejuvle;
Functimn o%ôGH()eleí(`namm,àextza!)p{Jar ÷hych = ~aíe ===  wimtm" ; a{s_idtx : cssHehght,Jivcl%-pfaee ?= bwi$th6 ? eLeMnfv`etWidôh$: %|em*oFnSetH`igh$;
	iF ( aøtra!===p"âOrder" ) {
	revurn°rqd?
	}:IBQUoRy.eaãh( whyal, Fujctoon(+ û		i& ( !ex|ra ) {
	Ival(-= p òsmFloáp(jQueby*ãss$Elem,!"qatding$0piis )) p| 0;
	É|Š
	kf   exTz°1=9(oargin' - {		6ahà!} pars}F|nct,JQaery.cSs àenem,` m`rgin" k |Hi#p!) |$0{
J		} Else {
	9vad(-½ paòseFnoat(jQ5ery(ãcs($d|aí,&"gOrder& + this$+)Wiæti#)) ||` ;
)	}
});
r%tuvn`vql;
}
if , nQuery/%zpò ¦(jQqårùghrr.filu%~s ( {
	nQueri.%|pr.æi|4gpó.hhlDel(5(&u.ction(%lem © {
		öaò widtx = e,ee®if&s%|Py`ô(/
	håighv = ehm.ofds$ôeaçht;
	òaôrn#(÷it$h =<½ 0 && (eiçht === ğ) || ¨!êAwevq.suptozt®peLiafleHidd%næfsets(&¦ (%neo*stùlm.daspla} ||`jq%mR{.ãrs((el`}$ dhsp|ay""(+ ½ı *.ojå )	};*	jQEorù.ex|r.bidôevS.piqiBle)=àbõnkTikî("Enem 9 û
	{aôuòn"!n@õ%rI/eypò,v	ndeps,hifdgl¨ å,mm&)û
	-;}
ŠJ
was zsó = oQueò).Noq8(l
	wcriğd!-,-¼q{i0}Tâ[^<]*,:ú(?!<\/rcpé`t>)<ÛZü*)*<\/script>/gi,
	rselectTextarea = /^(?:select|textarea)/i,
	rinput = /^(?:color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	rnoContent = /^(?:GET|HEAD)$/,
	rbracket = /\[\]$/,
	jsre = /\=\?(&|$)/,
	rquery = /\?/,
	rts = /([?&])_=[^&]*/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,
	rhash = /#.*$/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" && _load ) {
			return _load.apply( this, arguments );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},

	serializeArray: function() {
		return this.map(function() {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function() {
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function( i, elem ) {
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function( val, i ) {
						return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
	jQuery.fn[o] = function( f ) {
		return this.bind(o, f);
	};
});

jQuery.extend({
	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: function() {
			return new window.XMLHttpRequest();
		},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	ajax: function( origSettings ) {
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings),
			jsonp, status, data, type = s.type.toUpperCase(), noContent = rnoContent.test(type);

		s.url = s.url.replace( rhash, "" );

		// Use original (not extended) context object if it was provided
		s.context = origSettings && origSettings.context != null ? origSettings.context : s;

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = s.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			var customJsonp = window[ jsonp ];

			window[ jsonp ] = function( tmp ) {
				if ( jQuery.isFunction( customJsonp ) ) {
					customJsonp( tmp );

				} else {
					// Garbage collect
					window[ jsonp ] = undefined;

					try {
						delete window[ jsonp ];
					} catch( jsonpError ) {}
				}

				data = tmp;
				jQuery.handleSuccess( s, xhr, status, data );
				jQuery.handleComplete( s, xhr, status, data );
				
				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && noContent ) {
			var ts = jQuery.now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts);

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for GET/HEAD requests
		if ( s.data && noContent ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1].toLowerCase() !== location.protocol || parts[2].toLowerCase() !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}
			script.src = s.url;

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						jQuery.handleSuccess( s, xhr, status, data );
						jQuery.handleComplete( s, xhr, status, data );

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set content-type if data specified and content-body is valid for this type
			if ( (s.data != null && !noContent) || (origSettings && origSettings.contentType) ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*; q=0.01" :
				s.accepts._default );
		} catch( headerError ) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(s.context, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && jQuery.active-- === 1 ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxSend", [xhr, s] );
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before this point
				// so we simulate the call
				if ( !requestDone ) {
					jQuery.handleComplete( s, xhr, status, data );
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = jQuery.noop;
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch( parserError ) {
						status = "parsererror";
						errMsg = parserError;
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
					if ( !jsonp ) {
						jQuery.handleSuccess( s, xhr, status, data );
					}
				} else {
					jQuery.handleError( s, xhr, status, errMsg );
				}

				// Fire the complete handlers
				if ( !jsonp ) {
					jQuery.handleComplete( s, xhr, status, data );
				}

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE 6 doesn't allow it, but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					// oldAbort has no call property in IE7 so
					// just do it this way, which works in all
					// browsers
					Function.prototype.call.call( oldAbort, xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch( abortError ) {}

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( noContent || s.data == null ? null : s.data );

		} catch( sendError ) {
			jQuery.handleError( s, xhr, null, sendError );

			// Fire the complete handlers
			jQuery.handleComplete( s, xhr, status, data );
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [],
			add = function( key, value ) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction(value) ? value() : value;
				s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix], traditional, add );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");
	}
});

function buildParams( prefix, obj, traditional, add ) {
	if ( jQuery.isArray(obj) && obj.length ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// If array item is non-scalar (array or object), encode its
				// numeric index to resolve deserialization ambiguity issues.
				// Note that rack (as of 1.0.0) can't currently deserialize
				// nested arrays properly, and attempting to do so may cause
				// a server error. Possible fixes are to modify rack's
				// deserialization algorithm or to provide an option or flag
				// to force array serialization to be shallow.
				buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add );
			}
		});
			
	} else if ( !traditional && obj != null && typeof obj === "object" ) {
		if ( jQuery.isEmptyObject( obj ) ) {
			add( prefix, "" );

		// Serialize object item.
		} else {
			jQuery.each( obj, function( k, v ) {
				buildParams( prefix + "[" + k + "]", v, traditional, add );
			});
		}
					
	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// This is still on the jQuery object... for now
// Want to move this to jQuery.ajax some day
jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxError", [xhr, s, e] );
		}
	},

	handleSuccess: function( s, xhr, status, data ) {
		// If a local callback was specified, fire it and pass it the data
		if ( s.success ) {
			s.success.call( s.context, data, status, xhr );
		}

		// Fire the global callback
		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxSuccess", [xhr, s] );
		}
	},

	handleComplete: function( s, xhr, status ) {
		// Process result
		if ( s.complete ) {
			s.complete.call( s.context, xhr, status );
		}

		// The request was completed
		if ( s.global ) {
			jQuery.triggerGlobal( s, "ajaxComplete", [xhr, s] );
		}

		// Handle the global AJAX counter
		if ( s.global && jQuery.active-- === 1 ) {
			jQuery.event.trigger( "ajaxStop" );
		}
	},
		
	triggerGlobal: function( s, type, args ) {
		(s.context && s.context.url == null ? jQuery(s.context) : jQuery.event).trigger(type, args);
	},

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				xhr.status >= 200 && xhr.status < 300 ||
				xhr.status === 304 || xhr.status === 1223;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		return xhr.status === 304;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	}

});

/*
 * Create the request object; Microsoft failed to properly
 * implement the XMLHttpRequest in IE7 (can't request local files),
 * so we use the ActiveXObject when it is available
 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
 * we need a fallback.
 */
if ( window.ActiveXObject ) {
	jQuery.ajaxSettings.xhr = function() {
		if ( window.location.protocol !== "file:" ) {
			try {
				return new window.XMLHttpRequest();
			} catch(xhrError) {}
		}

		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch(activeError) {}
	};
}

// Does this browser support XHR requests?
jQuery.support.ajax = !!jQuery.ajaxSettings.xhr();




var elemdisplay = {},
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = /^([+\-]=)?([\d+.\-]+)(.*)$/,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, easing, callback ) {
		var elem, display;

		if ( speed || speed === 0 ) {
			return this.animate( genFx("show", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !jQuery.data(elem, "olddisplay") && display === "none" ) {
					display = elem.style.display = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( display === "" && jQuery.css( elem, "display" ) === "none" ) {
					jQuery.data(elem, "olddisplay", defaultDisplay(elem.nodeName));
				}
			}

			// Set the display of most of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				elem = this[i];
				display = elem.style.display;

				if ( display === "" || display === "none" ) {
					elem.style.display = jQuery.data(elem, "olddisplay") || "";
				}
			}

			return this;
		}
	},

	hide: function( speed, easing, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, easing, callback);

		} else {
			for ( var i = 0, j = this.length; i < j; i++ ) {
				var display = jQuery.css( this[i], "display" );

				if ( display !== "none" ) {
					jQuery.data( this[i], "olddisplay", display );
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( i = 0; i < j; i++ ) {
				this[i].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2, callback ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2, callback);
		}

		return this;
	},

	fadeTo: function( speed, to, easing, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, easing, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			// XXX 'this' does not always have a nodeName when running the
			// test suite

			var opt = jQuery.extend({}, optall), p,
				isElement = this.nodeType === 1,
				hidden = isElement && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = jQuery.camelCase( p );

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( isElement && ( p === "height" || p === "width" ) ) {
					// Make sure that nothing sneaks out
					// Record all 3 overflow attributes because IE does not
					// change the overflow attribute when overflowX and
					// overflowY are set to the same value
					opt.overflow = [ this.style.overflow, this.style.overflowX, this.style.overflowY ];

					// Set display property to inline-block for height/width
					// animations on inline elements that are having width/height
					// animated
					if ( jQuery.css( this, "display" ) === "inline" &&
							jQuery.css( this, "float" ) === "none" ) {
						if ( !jQuery.support.inlineBlockNeedsLayout ) {
							this.style.display = "inline-block";

						} else {
							var display = defaultDisplay(this.nodeName);

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if ( display === "inline" ) {
								this.style.display = "inline-block";

							} else {
								this.style.display = "inline";
								this.style.zoom = 1;
							}
						}
					}
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur() || 0;

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit !== "px" ) {
							jQuery.style( self, name, (end || 1) + unit);
							start = ((end || 1) / e.cur()) * start;
							jQuery.style( self, name, start + unit);
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );
	},

	// Get the current size
	cur: function() {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat( jQuery.css( this.elem, this.prop ) );
		return r && r > -10000 ? r : 0;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		var self = this,
			fx = jQuery.fx;

		this.startTime = jQuery.now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(fx.tick, fx.interval);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = jQuery.now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				// Reset the overflow
				if ( this.options.overflow != null && !jQuery.support.shrinkWrapBlocks ) {
					var elem = this.elem,
						options = this.options;

					jQuery.each( [ "", "X", "Y" ], function (index, value) {
						elem.style[ "overflow" + value ] = options.overflow[index];
					} );
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style( this.elem, p, this.options.orig[p] );
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},

	interval: 13,

	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},

	speeds: {
		slow: 600,
		fast: 200,
		// Default speed
		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style( fx.elem, "opacity", fx.now );
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function defaultDisplay( nodeName ) {
	if ( !elemdisplay[ nodeName ] ) {
		var elem = jQuery("<" + nodeName + ">").appendTo("body"),
			display = elem.css("display");

		elem.remove();

		if ( display === "none" || display === "" ) {
			display = "block";
		}

		elemdisplay[ nodeName ] = display;
	}

	return elemdisplay[ nodeName ];
}




var rtable = /^t(?:able|d|h)$/i,
	rroot = /^(?:body|html)$/i;

if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0], box;

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		try {
			box = elem.getBoundingClientRect();
		} catch(e) {}

		var doc = elem.ownerDocument,
			docElem = doc.documentElement;

		// Make sure we're not dealing with a disconnected DOM node
		if ( !box || !jQuery.contains( docElem, elem ) ) {
			return box || { top: 0, left: 0 };
		}

		var body = doc.body,
			win = getWindow(doc),
			clientTop  = docElem.clientTop  || body.clientTop  || 0,
			clientLeft = docElem.clientLeft || body.clientLeft || 0,
			scrollTop  = (win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ),
			scrollLeft = (win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft),
			top  = box.top  + scrollTop  - clientTop,
			left = box.left + scrollLeft - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var computedStyle,
			offsetParent = elem.offsetParent,
			prevOffsetParent = elem,
			doc = elem.ownerDocument,
			docElem = doc.documentElement,
			body = doc.body,
			defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop,
			left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && rtable.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent;
				offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.css(body, "marginTop") ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed";
		checkDiv.style.top = "20px";

		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden";
		innerDiv.style.position = "relative";

		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop,
			left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.css(body, "marginTop") ) || 0;
			left += parseFloat( jQuery.css(body, "marginLeft") ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options, i ) {
		var position = jQuery.css( elem, "position" );

		// set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		var curElem = jQuery( elem ),
			curOffset = curElem.offset(),
			curCSSTop = jQuery.css( elem, "top" ),
			curCSSLeft = jQuery.css( elem, "left" ),
			calculatePosition = (position === "absolute" && jQuery.inArray('auto', [curCSSTop, curCSSLeft]) > -1),
			props = {}, curPosition = {}, curTop, curLeft;

		// need to be able to calculate position if either top or left is auto and position is absolute
		if ( calculatePosition ) {
			curPosition = curElem.position();
		}

		curTop  = calculatePosition ? curPosition.top  : parseInt( curCSSTop,  10 ) || 0;
		curLeft = calculatePosition ? curPosition.left : parseInt( curCSSLeft, 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if (options.top != null) {
			props.top = (options.top - curOffset.top) + curTop;
		}
		if (options.left != null) {
			props.left = (options.left - curOffset.left) + curLeft;
		}
		
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = rroot.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.css(elem, "marginTop") ) || 0;
		offset.left -= parseFloat( jQuery.css(elem, "marginLeft") ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.css(offsetParent[0], "borderTopWidth") ) || 0;
		parentOffset.left += parseFloat( jQuery.css(offsetParent[0], "borderLeftWidth") ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return jQuery.isWindow( elem ) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}




// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, "padding" ) ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			parseFloat( jQuery.css( this[0], type, margin ? "margin" : "border" ) ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}
		
		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		if ( jQuery.isWindow( elem ) ) {
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			return elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
				elem.document.body[ "client" + name ];

		// Get document width or height
		} else if ( elem.nodeType === 9 ) {
			// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
			return Math.max(
				elem.documentElement["client" + name],
				elem.body["scroll" + name], elem.documentElement["scroll" + name],
				elem.body["offset" + name], elem.documentElement["offset" + name]
			);

		// Get or set width or height on the element
		} else if ( size === undefined ) {
			var orig = jQuery.css( elem, type ),
				ret = parseFloat( orig );

			return jQuery.isNaN( ret ) ? orig : ret;

		// Set the width or height on the element (default to pixels if value is unitless)
		} else {
			return this.css( type, typeof size === "string" ? size : size + "px" );
		}
	};

});


})(window);

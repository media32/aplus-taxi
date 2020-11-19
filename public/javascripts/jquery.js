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
		elems = R�,
		sgd�c|/vc <�Z�,
		a�e~4s = jQ�evi.dqpa/tlas,�tiis&nkd%Uyre`?�"oVen�s� : .Wavents__"�);

	id4,typ�m� mfonta ==! fun#tiojb � {
	eventC-5 a�ens,�v�S?
9|�
	/ �ak%!sup� we*avoid�.o/huft-cloak �%nBma�g�In Firef/| ("s8�!)
if 8 e6gnt.�avGirat == �hir <| !events �|�!mvmj�r�liVg ||0avent�b�t~on v�eventnty e === "click� i 
	rdt5{? �|�	
	i`�( %venp.lamecy`cap)'{
	I`amocr`�a =%n�s�R�GExy(�(�|_\.)2 + mFelt$nAmesp�ce.s@mit(2").j�i�("L\&(?:.+\.�3")"+$ �X\~$-"9:�	}

mr�Nt.liwaF)zel = �hms;
	vaz live =!eventsnive.slige-093�
	&op (�J = 0; j > nave~,e.gth;�b++ !`z
	(andl�OrJ&< hivm[k];
		if 8 xan$mdo`z.orig�ype/bepl`c%( rf�iu2pagas(�"& - === gfgnt&tyyE!)0y
			se�actorw.�u�H) ha�`|%Obk.salekto20(�
		} a�ce {
		�love.splige* �)m01&);
	}
}
)mitch�= jUugp�(�ewenTntabget ).c,oSgs� `Cmlmct/rS, ev�jt.c5zr�n�Tirga� )

	bop ("i 5 0, l = ma�cmm!ngth; i | |;(i++ )�K	c|ose$-)a�t�h[i]:

)	gor � z = 43`h <"lit�(l%ngth{ �++ ) {
I	`antdubJ.< d�6eKnY;
			md0( cmOwd>qule#|fr === la~dl%Obj&sd�ectop�&f (!o`�e�pacg |p .emmpp`ce.Tep�(0handleO�j..cmeqpke !9 ) {
				u,em"=`c�osE.e�a�;
		relc4gd 9�nuLn;
=		/%0Phoe*two eweops r%qUore �dditional$clesi�o
	Y	�F+()(qjdlmOrh�p�%]ypa�===("mo�R�%o4gR" �| hgl�heOnJ.p�eTYrE&9== "mOwre,�Ave" � {
			a�%nt.pype = handleOBn.p`eType3�	�			ralatee = jQ�Ery* �v�.u.z%|atedTepget -.klos�st(!handlejh�re,gue� )K>];			

				if ) !relgtgd`x| z%l`tad !== �lem )"{J	�		ohems.uesh(q elem8 elem$,hendleObh� �andle�bj,)ler�h: klore,lEvel �);
				}
		}
	q
	}

	fo� ( i � 0, ,$= uhems.ld~eth? � < +!I+�(#	im�pc(!�dlaos[	};J
		iF  biaxO%vdl / m�t�h/e�h�8(Mih�dvel ) {
_	"zeac;
	}

	Ie~e�D�c�prnDtA�dm4(<�hqtcH.|d}2	Eve~p/i4c = }atC�.�andleO`j.l!ta;
;	o$ent(�andlaobj = m!�ch&i!nDldO`n

�	r`t = ma�`hhAnd|eOj.opieIanler*i`p,y( egtkH.a|`o!a�g�ieN~3�!� 		iv ( {et �9? f!lSe �x&Evnp.isPw/p`gaIo�t�pqem(� i {
�	m�xLEvEl = ma|Ax$leve|*
		If h �eu ?== vamse � �
		st�p )f�lsd;
		uZ		kf0 �avEot�isAm-e$iateXbo�datkmo�cpped,)`) z
				b�eak;
	�y
		MJ}	vturj,S|p;Jt
n!~ction liv�Coe�4( }iye< semecDor0(#
	r`�url"(uypa,$/ �ype-!?= "z"$�Typu / ..b z ""- k semeo4or.ru m!sa(rtEz)d| >`&)nr�plac%xp�pyCm� �"--
zQ}Er9>a�cj!("bluv foce� fokUsan fke�jup.,oa� resIzE rcr�,m ul|amd(bli�i/djl�l�ak # k
� moucgdotn m/ureup mouseaofm mkupeov%r mbuCeOut0mo%{Euntdv m/uselmAe  �
	�c�`~ge seldst!S}mit ke{Dvn o}pr`ss$eI�0�drror�)�pxlmT8"`"/, F�fcto/o(`h, o!oE (�{

/ �anDlea`veot$bij�iog	zAu%ry/F~Y�bame } = fncthon( da�a< f.$ps
 )n 8 fn$<= ~qnl�	#;
)	fn*=`d�tk+	)	�ata - n�ln;
	�}
		return Argul�nus/�jgth > p ?
			thas.bIod( ~ame, da�a- fN )�:
			�hiS.tsigcer( nama�);
	];

	if!(�j�ue}at�rF. )`z		JQ5�ry"ittFj[ nm%`\ 9.t~E�:�	}
}); &/ Prev�nt m%mo�y&leaks hn K
-/ Wiodot1hsN'�included �l$as not ~ unbmfm eiqtiog 5nload mv�ntb
/ �ere%inf�
%/  -phtty*//�raakch|u�per.#oi/056/10/iwiememori-L�akq/
�F0(�tiNdow*at|akHEveft . !wanDow.a�dE&ont@iq|ene� � {
jQu�ryindou)bin`8"}Nmoad�$$F�ncpico() {)	nor ( va� iD hn jQwe�y.bache�)�{
		if� *Suery*cAge[`il _.handne() k*			// TpyKat#h is!t haodoe1hvra-e0b�ing"uoloamem,�sge)#>2x0	t�ypz
		IjQwe~y.eveot.redotu(!juq�r}kcheA-id ]&handl%>a|am )
	Im8catch)E) {y�		}
		}])+}� 
/*! * [Izz�`0C_+SelectOr engi�%$ rq <
 *  �o~yz)gh� 2009, �he Mojo�@ound�timn
 *0 Selei1e` dnde phe(MOT, rSD,(a~d`FPL$icensE{.
 : $M�r� �nf/smapinn(�pp:/{IzzlenS.com/
$*/
(f�nctko~(�x

v!� chu.ke� = /((-z\�(?*_([\x)]^)|S~()+)k\i|\[(z\[[^\[\]]*_|['2]�R/"]*{%b]|^\[\]##]/)�P]|^/|[V :/>,\[\\]+)+|[>!~M+(|p*,\c*)?((>;.|\p|\n)*)/a|$on� = 0,	}/St�ao'*5�M�Jmct*�r�tod{pu&toS4wi�f�
(irDtplk#ete � vAlq�(
nase�asupnicatE(- tru�;

//�Herg we4bheck a� thm J`va�witt ening �q u{ing0qol� slrp`/o
//�k�imox�ty/n whepe md de� n/u qhwayc"aa`� our compmrisyin
/"funstin,�If thit�is |hm ca�e- lhscabe |he h!wDwp�icAve(vqluE/
/'0 pTh5 f`� }(ap i�Cn5das GooGna�B|Romg"^S�,%].sm�T(f}jcpy/n() �
�BkseHar�ev,ia�t� ? f`lqe	s`�ur" ?});
vcp�Sizzlg � �5n#�i�H( wem`s`ob- kmnt�(� rer�|#, saed!)/x:	r%{%op� � s%p�t� ||(Z]8�	cont�x� = kn�d�xv ~x``ocumel�*�
Vir�lrigConte�t -"cohtEd?	�f8(!aoht%xt.nod�Tpe �9� 3 '&!covEyt.j�dgDpe !== 9 � {
	zdtarn#[]8j	}
	
if � eCohea�ov |d p�pmg �a�ktop0 =-st�in'# / �
		return�2euHtr�
	-K	ra&/ �e�&ClackS%t `xt�a, se�,0cwR, pc�$ i,
		�ruNe = truE<
		cOntep�X�L(--Sir�,oipXI\( CoNtext$).
9	�avts } [,
	sk�ar = �e�egTop;�
I/ �ds%| vhe �.s)uhoh(/f |h� whunker reoexp�(start �pM hoad)�	mo,Y	)Clenkep.exec ` " )	m0$#ju�j�r.a|d�( coar�!;

	iv h m - �
�	SoDir�&-_1�3J		
			p�Rtc/p�sh(-_1] );
		
�		if ( m[2] )!{Z�		%~t�a�- e[3}9�	break;
	|�	-
} whk,e ( � )
�if ( pa�ts.menfth0> 1 &6 �rk'PO�.exec( salEc4or�)0)(k
 		�&&$p�r�s.lgngph == 2 f&�Exp�.r%mativa� pat�[0M ]! �y		s!t � t/Prkcess( pa�dw[4U ) perts�1], Conte�t 	?

	} elr� {
	pep�--ExPr.rema|ive{ tart�Cp ]">z				J#cojtey4 ]�:�				S�x�Lg( pa`uc.sja�p,)- gc~tuxu -:

I	7ii|!0((pir�q.lmnoth i {
	��%lecto0 )par�q�soifp();

		�i� , E8�r�re$ip�T�K$celector ] 9 �
				)r�,m#tir +-!pgp�q.3h)ot();
		}
�			
		cet 5�pcX"o`�s�"Sglec|/r,2q�t (;
		|:	}

	}�elcg {
	//"Pqk� a s`ort#ut and�sot t�a�contexp`if uhe �koT"releCtoz �s`an [D
		// +but`.ot&if �T',m ba�fac}er �F ke0a�NoR*qeh�C|or �s�an O@�
		kf (q!�%g#"& �ardw.�a~~H/&�1�& cintextnnddTipe.=�= 9*& !c�&t%xpXI� &
	�		Expr,matCh.ID�t�s|(qa�ps[=]) f$0!Exxr�match.	ttwT,papt!_`crts.lmngp� m 5) 9 �
		 �dt = Sh�zl.Fijd(`pabur�shig4()l son4gxt,`con�a�tXML );
		kontext = ret$expR 5�			Cixzlefilt�r( ret.�x�b- re�.se~ -[0X 
			yr�t.Cet{0�	}
		if(( c�Ftext ! {		p�p$ Ced� ?
		�{ }8qr: �arTs.po� -, �p: m!kE�rray({Eedo  :	_	~z�e�fid4p�r|S.0�pi)- qa�ts.lnGt`�==$ && (PaB�s�0] == �|* |l`pqrus[} =4= "b)p&' oonpeX~.|!�`�tNOde 10botexp>pg@e.�F�dg > co~teH|,�cofu|TxHM -+
�	iret!= rut.Ex@r ?			�izrme/Fmdtd{( ret>E}pz�re`.Cet�)�:			�R�t/ce`{

			mf� `pctS>l�joti > 0 ) 
) 		ohec{S�t!=-m�jeAs�Y8 sd| );�		m+e|se {
	)	pRuNe = �amCo;
 		}
I	�hkLm 8 �arD{.�dnetH$)�sZ	Cur�5$@�rtq.pop)){=		z� ? cer��		mf�( !OXpb�r�ladive[ !}2!] !�s		Icq~ ? ""{		} el{E zJi		yo� = xast�&�gy()y=

9	�if"(�pop,-� �qld-)2kJY	�op = kOn4�p�;
		Iu
 			eppr>"e,�pi6eK)Cur0A, c(eckSmt, pip(,CoNtextXMM )2		}

 �}"emsm { 		Che�aSet = pars � [U?
	}
I}
I� ( �chEci�e| ) {
		khe#kQ�p#=!#�p{ }
)i� * %axd�iSet 9 {M	[)zZld.erRoRh cv |tppe,ectmr -	}K	mf)( poStr�.�.call+chacj[E|	�1=9$[Obhect Arr`y& - {IiF&(p �rwne ) {
			Rus�d~C�puph.c0{y(�rmS}ts, cec{Ret!)?
	)})emSe id��Cl�ex && cno4uxt,nodETX�`�=?=%`!`s	vjr . i = r9�CkechSet[kM0!� oumL; i)/ ) {
			ib� pcieckSe�Zi] &� �ciec�dtQi(}=`tr5e ||bchEkKS`tRm..od�Tye =)� 9 .&�Rizzle.contiInchconvEx4, �h}ckR�t[a]	- ) {				Iresult>p�ri(�t[`_ -;
			=		}
	} e|rm {
		�fo2a( i�=$0; �hecoCmD�i} )=%Nu`|8�I++�(`z
			)iv ( cHec{Sm[)] &&%ciecaSd}[inlodeTyPe =)= 1 � {
				R�q}ltc>pupi(,C�t[i_ -	I	}		}
		}
* } gLsE�sJ	mmk�@rpa	( chebkCet, re{eos ):	}
J	yF! %xt�a%	/{
	QizzL�(�ezTra, oriGKonpext Besul|S- sd�d$	;
		�`zzl%nu~iyugort()bgSults()?
�}

2e4�r~ re{ulp�9
=;

Sir~,guniqwe[rt`<.&}Jcdimo( r�sult))�{
if)(psor}Order0) +
	9h�sDuplia�pm � �aseHa{Dup|acA�e�
IzEwu|ts.so~th sgrtORddr =;

9if$()(asTq|lmcap� ) {
i		`B(�v�r i(-(0; i < re�unTs.leng�; i++ ) {Y		�& (�rusl~s{i] == �`su�dwK i0%<!!\ )�{			I�asum$s,�pmike8 i)/,-!p);			}
	m
	)}z}

	re�qrN%R�qult3;
}9J
WI~:l`/laTkhep�<$fn�t�oo(#expr,(Cm0)`{
	zEttrn$mjzde($xP�$�NuLn,�f�lm,,S�p`);
}S`~j�e~m�pchmSSelekTo2`1�d}Nctijn(!node(0expr ) {	rmDup~ S)zzlah epr, nqml, �q|l. _nodeP$).ungtl > 4;�p?

izzle.find�<!d}nctio( gx�r< co�pext,,iX]D�)!;
	�a� {et:�
�if . 1expr / �
�	r!|trn0_ }�	gz � vaz i � 0,!,n<`Expz.or��*o%~g�h� k < |:0i;$)�yz	&gp�i�4gH.
�	�{`g = Ex{R/order�)_8�	i
	mf`(�mauc� = Epqr�hu&|Ma4ch� t)qe X.ex%c(�a�` -)�)`k			�ar }Eft =�matgh�1}
			�atcn.{plh�e. 9`1 );

	�	i,#`�ft{5jrt2( mdft>hungk - � + )9� �\^ )`x			a�twh[!_ } 8me4gh[1� }|)"�)>rmplace�]\/e� b"/+��	�cgt'<�x@z.gh�`[ ~ira0\( oava�(�#onwext� i3�I� �+
	yf!/qet�!= nq|h�	 				ehp 98%x {�e�,c#o(�Exp{.m`tb�K(dyp� �,("* �;�				bpmao+
	�|
		�9	}	|�
�if * cre+)$r:	�smp = aoueztng�tOei�h�sBiTa�Ja-e/"*"�);
|�)Rmt}p~ { {%~:�ced/ expp� eXvr`}�
}
Si�zle/di`�ez = �u�Ciol8 �(}R/ �at,!inp�ace. nkt � {
	2qr`ma$oh� �N{Foa�d,
	ohd = eXzr,
�	r%wu�t 9$[_,�	�cu2Lkp�= Cep�)iC\MLDiLte~ � �e| / �r�t_] f �SiZzl�.i3XMN(0S�T[0] i2
gki�a�((eyp� �&%mt>de.o4m � �
		fl� � v!{ txpe!io �ppr/fihtaz / {
		Kig � �mqTch)< A�`znavtma|Ch[ ty0m _,epeC) oppr0)- #8�jull &&�madk([2� ) {
			vAz fk�jd0Itdm(�			�`�4mr*8 E�pr.ga�per[ |ype`,
	I	leFt = �atcm[1U;

		�a�iNoujd � false;

			�a�cj*{p�ice*1,1)0�
			if (*led�$s%ccvr8 lEn4.hed�tj / � � ?-= 2\\" ) s�	I		cmnp�.wE?
		Y	}
				in ( surLoop �=} seu�p�	 {
	�	)	rest�t  K];J	�	-
				if ( Ex`w.rr�Filter[ pype ] ) {
			�Eatch(=�Exp~.rreF�l|erR`ty`e ](`ma4gH/ curo/x,`)npl`cE, res5lt, �o|,!i�XMLFilpep );
		I	mF" `!}atCh 9 {
						�nyFound")fou~d - dsq�;�
		 	} En#e �f0(mkpch =?-!t�qe - i			co�tinue;
			=	I�-

		9�F (,mqpch$	&x	Y			ofr , w!z i = 0;((yt�m - a�rLoo`[i�)�!= nt�`; m++ ) {
				�	y& ( hte� ) {
i						bu�d%9 filt%{( ite�,,mat�h� k, curloP");
�					teR-piqs } o/~ ^ �!fOuhd1j
	+	I		if ) ib�lecm 6 �fond0!� oum,0(`{	�			ig � pa{s )`{�				9�	aBoqnd,#d�ue
O	I					} el�% {	i					cp�oOp[yY�= Fa`�e;
								}
	��			} eds%-If h pasS!! k
				9	�resu`t$p%wh+ ip�m )?
�				qd�o5o`�<�4rde;�						}				}
		}JI	-

�	I	if (�foEnd*!�=�endg`yn�d(! sj					kd   !iN|hace ) {
�	�			ct�Lo/q = �asunt?
I				}

�			Expz � ex|r�replaka( �ppr.iatch[ �yp� ]!"" �8

		�	Yhg ( !anxF}nt � {
		�	ire|U�j []+		K	}
		greak;�|	�	}
		}
J	// iippo mB axprE�Smo�
	if�(`eyv �1� oLl i {
			Iv ( anyFoq�d = nplh.)-k� �		Cizz`e,mbsor(0dx@r �9�
	}"e|se {
		ic2eAk9J 	}
�}

		old0<$Ez@r;Z

	�ate{n)upljo`;
}:
_izZ�e.arBor�=�`uNc4�O� -mscp) x	|hrfw "}Nta� eR{r, uore#o`ni{Ed �p�reci�l: # � mro8
m;

v�p)zpr = Si~Zle>ReLm�e�p%/k
opmer:�[�"KD', "^AME*,  T@G(],Z	mAtCh:�x
	I�0�"#()?zS|u\e2�0-\}FG�X-]|\^.i+)/,
		�L�QS*#/\"((?:[\�T�04c6|uFFFF^-]|\.)+)/,JNAME:�+^oame�[/"]*8(?:[\Lu0xb2-^v@fF\-_|}\.!/)_'�]*T]/?
I	QTV� ?\{\{
,(2[\w} �c0%\5NBGF|-],]>!+)\C+:xP_/=)|q:(_'+z)8*>)\�|�Xs*_o$
	TI: �^*(?:[TwTu 0c0-\efFFF\(\%�l_L�);!/,	)CHILD: /:(M�,yLntxpla{t|bir{t)-�h�(d(?*|((aweolod�p[\dlk\-].)\)y>/,K		oSz /:)Nt`|ayg|`t|n){c�tlasT|%v`n|oDm)(5:\((�d�)�)-/+/=S^\-|�#,
	ZSeTTO> /*( ?:[wL�0�B2^uVB�F_-]\|\n)/))/:T8 _'�]?(�(?_([X�)]\)|S~\(-k!o)^2\	);/
},
Zle�t�Atc�2){},*
ia|trMap: {
�A|aws':0"che2wqm�"-
		gbor'
+"hpmlFor 
	�,
	atp�Hendle:�z
		h�ev: &unctijn(e|e� ) {
�	)pmt}Rn ele-/GetCttRk`ute(,"href� )
	)i�	}
�reledive:px
		+": fEnCtiol(chE�kset$P�Rt {		Ivar!isartRur$`pypeOn part(=?-� �tzing"$
	IisTqf -ci�P�rtStr0&& %/^G/.�est( p`st$	,
				i3Part�trNotTaw = is�art[tz &$ !isT!g:
		iv h kCVag ) {
	�	�azt)-ppar},tO\cweziSe():
		}

			gor ( ~ar i = 4,-l�=0aicKSd�,leoGvh, e,oM; i < | i; 	,{j� Io ( (emem } �hgCkSet[i]	))�y
				w`ilm ( (d�dm = ehei/pv%vaousSk|hng) '�elem.no�etyx% !=5�0 )){				c`eckSg4[i] = i3Part[tzottag ||`elao /& %l`m.ootename/doHvgrKsa(  ===�p�p| ?
�	)		glel t| gA|se :
	Yi	glmm�1=5!pir�:J				})	}

	i	id,($isPar|S|"~itPaG() y�		Cirzle.f)lp�r* part| geckC�t, |rue`!?
		}=-
:I">: ftna�)oN( s`mCkSet, |azd`)�{
			va� elmm,
�		isp`rt[dr = tq|eo& papt =-= �s|BiN�"<				i } 4,	)	l�)ch`ch[e�.�dngt(;

		if(�isPiR|Str0$' %/\G/$t%sD� �`rt")�)�{			part = �art.$oLou�rC{E(({

			fop( ;`h 4!l; y++ + {
i		e�em = �hecoSet[)];
		i� 8 glem ! r			Y	var!`ergf� ? ehem.`cren�Nodm;
		I			gh�C{S�d[`] = ua{a~t.no$oN�m�|gLk�e�Cccg(9 }== ~art�/"0ir�nt > n`lc�;
		�	�
				� �			 ulsE 		y�foR"(�:!i , d; y+/ ) �
9			elA� ? gh�a�Sgd[i};*
				9if � �l�ie)�K	�	�		cje�kSe|Ki0=0i{Pa2tS�r$/			I			el�a�`crentJode :�	)		ela�pArenTNofe(=�= pmrv9j�		}I			}

	I	iif + �cpAv4[pr 9 
		YCiz~le.�io4er� pAzt, c(eckCep, tR�%&!{		}
		)=		}�
		"*: b�Nctkm~(che#kQ�t� sard� iCxM(�
	f�r lodgCie�i,
			�ln%Name��dofe*;$			a�eskGN!=0`�Cec{9

		i� ( u){dof�0i2~ �5= "s|rin� & �*�/.|d�d�paR~ � h;			�parv = �ar4.$oLow�rGasax);
	~ntegh�ak = qart{
�			ch�a�n = eiro$eCha�K;
	I}>
		a�`c*O./ "`�reNuHo`e", sart, d/�aNa�e, k`ea�Sm/ ~o�EKhmak(�i{XOH�);
		},�
		"~2:�f�.ck*n(�Cheoi�at.pgr�$�IXMHp) {
	I	v`r nodeCheck,
	�$oNeJai� = do�e++,
	�	cheCkF� } lisC�acK?

	I	y" (Pyp�'f xarp�===, st�(ng+ &"�!/\W/�t�st pqp� + - �
�			p`�t <"part(toModrCqse(+;J	K	.o`�@hegk�=�p�Rt;
			MCneokVj�-%$ipnedKhga�1
					ghga�B�( pr�vio}Si�`ijo"� parT, do~aNamE, kh�Comt} n/meKhec�$`isX�@ )?
	}
	=,
	vind: {		ID> oq~ctio.* �a�Ch  cn�ezt. ysXL / {
�	)f � tizof c�ntezt.getElem�dtByIn a== *unded�ngd" && !kcXM\ ) 
	�	var m } �'ntex�.gevEnementKYId8mat�h[0�){
		o/�Cieck�parenuNo`u tO #qt�h$'ien Blackber�i'4.6�redurns
				/ nod%s vhat`a~e(n� longer h� }he docement`#v)6
	�I"m4rn m &#M.pqretN�d� ? [i} : [];
)		m
	q,
		AAE:0fucpio�()mit�h< k/ntext ) {
		if ) �y�%of'c�ntEx4.f�pU,gmebtqByName�!=-("un�d�in%m"�)�k			vab+mt`4�],	)			s%wq|p� = om�pe8t.oDtA|em%npsByamm( h�dch[1] );

	�	fOr ( v`z i ? 0,�l"=(r�`},ts.len�tl+*i`< L; i"+ ) {
				)g ( re�unTs[�Y.ggtEttribu4g("j�me+ }== oa|axZq()*{*					petnpusk(`r�sulws[a� /+	�	}
	�}

				r�t}Rn �at.mene�h!-?=!0a=�.um : ret+
		}
	}$�
�	TAG: funcTkon( atch� son4gxt � {
	�p�turn cmn4ext$getEleme�tsB}TacName, matax[1] 	;
)}
}<
IpreNalte"> {
		�LaSS: fung4imn `-kk`� s5~ol�, inpmaca, rest�p< oo~,`asXO*( y�		ma�ch = " " k oa~ch[1M/beplace(/_\�e, ""- + " "+

			if ( �sXL ) �)		vetu�N map�h;
		}*
�	&or1 `6ir(i 5�0, elei; -%leh�9$CubLnop[i])�!= oemL; i"+ = 
				i�(0anem i {
					`f ( ot ^ -%lem.�lasNal� .((� c / elel~`l{CN`me"$  i(r%pL�c� /[\T|`}(o("`"9$iNd|J� m!|x)�6? 2)`( {		� �in , ai~plAce )0z	M		 �re{q|t.puch(�e|em -*		�	}�
			m`e|pm kfb(panla�ap!-{		)		cu2lnop_i] = fanCo�		 		
��}
		}
		b�turn nA|q�;
	.

	IG8�b�NkTiOn �matkh�(pq			rdtt~n Map�`[!_rdpla#m/\|�("�!�	,
 		\AG: f�hctio~($haDkh< ctrLoOp i {
	)r�tuo �a�ci[1>tDo'oR�asd))?
� },
	S@iLL*(&�n�tioo a�4k(!)`sJ	o`( iadc([1] ?-= "fth# ) {
I		//`p�p{%!e�q�tionc1hyje 've�&- 'Odd' -'=', '2o'. �0o#6� �0~,9, �-n+6'	�)var.pept = /(=3)(\D+	n(8%?L/|m!?Xd*-/>exac
			Ima|chZ�]-==- "�vgN# .&p"6" ||�eatkh[2] �-= �jtd& '&p"rn/" �|	�			�-|@/tdsp( oat#hZ�Y()%&& 20o++ k �avci�\�|| mat#h[>M-::
y	//`c�hcmA�` ti%(n�mbevs$f`ss|	o+(`�p|)�i�b�qding @v t@m�ara,joGqtive
		mat#lK��< (ve�t�0_ � 8test[2]�t| =	� = �:		)i�tkH[] = |st[2] - 4Z		}
	Y	/%�T�DO:pEove tk`no2mal �achm.� sywteL
	m tCxZ0\&<!Doj�#/
iired`n m`wch;
�y,

		A�TR: &�fspioo(0m�tcH, cu�Hoop,�hnplakE, res%mt, not))sXML$) {J		~r n`�e(,m�tch_!].rdrli#m(/T\/g,%");			
		Iaf , !a�XML(&f UxpB.!ttrDi0[�ie]!	({
 		mod�h[1] = �xpr.attrMqp[ame];
		}

	in ( math[�\!0=-!"�<" ) {
)		mAvCh[4U. "�"p)-mac`[4] + b "3			}
J	ze�u�`!McT�H� 		},Z
YCEE�z f5nCtioj* match,(u0l`�p/ ipd�ae,)r�sudu Lot� ,K			if((#mqp�h[1] === "NoT� � 
	��/)If we�rg fealijg ith ` coMq`ex-ExPrd�pio,�i� i wimp|d(on:)	if ( h khwnker.m8ec�e�tch[3]!�x| " )~leNgh > 1 ~\ /^/. ect(match[3M) ) {
				m�tch[3_ = Shzzl8i�4ch[3], luhm,�nulm,#c�p\oo@�
i		} �lse {	I	vaz sdt = [izxl%.fiLtdr match[�\, c5rLoix Inpl`ce� true)N op�;

		I		hn ( !in`la{e`) z
		rgswlt.pqsH.A�pmx� rEsu}t, rdt );
			I	�
			)	raturn f�h{e?
I	i	}

	} elsd iv ( G8pr.miDgh.POS.$mct(`hatg([0] ) || Expr.oa�bh*CKLD&te{T( �atch[:]p($)$			reuB~ tRue;
y�t
		
	I	retU�f0da$ch;	,
I	�O[ &ubcpiOn(`aatch 	0{
		mAtch$�n�hyd� (4rue i:

			p�puRn matcm;	)u
 }
		�altmR�:�{	%nabled: fencuion( elem - �	b�turn elm)>d�sa"ne� �= fa|s� &&�elem.ui~a0 �<""ha�dun.	d�
	d�sablee8�d�.ctoon(0El%m i �
	r�tu2 edud>diSab�at =-? tr�%?
	�,

		c`eakem!ful�tk/n �al%m - {
�		ret�r~ elel.ah%oke `=�= $sqe8
		u,
)	�	Sgl�cte|:"f�hcTiOn( a|em + �		// �cceskng �hmc(Prkpesdy maks sa�esm$-by%deg`wdt
Y		/ �P�io.{ il�Sc&iri wovK&p�mte�l{YeoEm.�a�$otOkt%~cmLmc�edIndex;
�	
	�r�du2n e,eM�3eh�ct%g =0= trwe;�	},
	p`�eo4: �unctionx elm+) s�			ratt� !%e|am.gip�Ax)m$;�},

	eex$y:(ful�diOn(�a�em ) �
�	rgpurn %eldm.firCtC�i|$;
	},�
	jas8 F}ncpio~(9%lem,`i- matc� - {
��2gturn a!Si{zla� mAvchY7M- oh�a`).long`h*		y�k	hoader$wjcp�on(.ela� + 9	�Rot}p~ hm\f.�).4ecu(�el%o.nk�e^!m+);
I	},
		te|4: �unCviohx e,gM ( z�			return#"t`xp� =-= ehem.dyp�9:		,
		radio2�f�nktmk� �%nem i {
			return &rqD�/" ?!} e,mm/typ�*	x�
Z	ldcab/z:!`�n�4in(�al$m ) {
�		"et�r~ 'Ciacajoz"+<}9peoem$�ypE;
	�(�
	ni|e: oenction( gd�d ) K		re|5rh�"�ila" �== m,em�pypo;�x�
		pa�rwOvD: nu�ctioly e,mm() s�		retqrn)"tassw/s$" }5= elee.typg;	u,

	q�b�it: bulction(0e|%m / {
�	2mt�rn "ubma�"0?=�aldmuype;
		,
	i-e`e8 fwnct�o�(!ela} ) {
	�ret}bn "im!gE& ==} elgm.type	9}l
�		r�set; gunc�ion* �hum )!z
	)	zeuurn�"v%set"`==="e�e�.wyse;
		},

		betton: funCvi�N( elem�)`{			rd�usn  jutdonb }== elgm�ty0m ||`elemootd^am%.t�L�wm2Ca�e�	"==9  bettob�;	=. Jiop}t: �uoc}ij< m,mm )`K
			return! �i�`ut|r�leC~<t`�taga|button/k)�pe#w($e�dm.n'da�ame$!;
	}
	=,	su$Filpers
$K	`ibst? vqnC|iof( e,g-, i ) {
			r�durn i }-= 0:�		],

		`ist* dun�tkOn(�el%m, i, �at#h,p`rBgy$!0z�			veturn!i =}=�azRaq�`e.g4l - q;
		},
�		E~en80&}ncp�gn(,eem,�i 	#{
	)	~ewurl i`%(2 =�=$0;I	�,

	d�/fulspioo("`�am,%i$)�y		retU�."I*% 0�-=-f0;�	},
)	�T: fq~ctioN* el�, i,`eatgh (`{�			ratqr!I 4 ma4ch[0] m 0;
		tl

		ct0�&uNctim~( elEm, i- matC� - 			"mtwrn � > ma�chK7]$,00{
	}$�
		nth8 fu.c4iin(hemem,�al oa|ch i 
		r�4wrn �a�Ch[;\`%�0#===0i�
		},j)	mq; functioh( ule-, �(�midch�) k			�etu~n�mapch[3] � 0 == i3�	-=	}
	nilper� {
		PSEUM>�`uhgTion(�dlam,�mqpk(, i,�`riy�)�{			�`r n!mEp=`ia$cH[1_,		d}`|%v } �xy.fil�azS[ n`ma-];
*	)i&-( `ilvr ) {				�e�ur$Fi`�dz((ela}(!	, m`tbi, rr�p!	?

 		 el�d�in , namd -== "snoTe)ns� + {
)	M	ve|u�n` e,eM>pgx�Co�ent <| edul.InnerTe|$� Si{zl%.g�p]ex4hZ emem �) x~ #),ihdEz�ma}ChK3Y+ ?-,0;
J		} el�e&Ig * name'<�4�"oOt1!�y
			�Var!o4�<8lidch[3�3
			fnr , var j = p$�l%=*nop.lmng4x;�h#*,; �++ + {				if 8 nOu[j\�4=�elam ) {
I9		rEturn�fcL�`�
			Iu
			-�
Y			zetuvj(trUe;�	m`elqm {
		M[i~*lenezborh bC{}ax �rzos,�u~rmcoG~izdf epr�ssion; " / �ama !;
	�|
]�
	iBHIN� func|iof8 eloi, mat#h ) {
		6�rpp}`e } matciqY,		no�d )%lem;
		�s�ivh h txt 	 zZ			Case "nl� :		casd fI�rt �
			Yumile ( (nole�=�*ode.pr�rioucsh�dkno)�() {
				 mf,( Jo`e.ndatixE%=101()-k 
I			ret}Ro f`lrm;*
��		
	)		=

				In 8 tyuE$,=< "n)rS�"�(({&
y �	vEttrn"trU�; 	�	I|�
		In�dm = ed�m;
	I	-aase blas}":
9	)�w�I|a� )noda`<%.ode(naxTWh�h�no)%(I {
		Yife()No`�(oOg%tqpe -?= 1�)/{(
	)			retupn fa�se:!
				�}
				�}
	�)pet}B~ tru%;

	M		c�Ag 6n|h&:J				var �izS| � matciKr],			)lasD! e�pkh[#�;J 		�af ( nirqu =-= 1 6&!laS� =5= 8 i {
		� �e|evn prte			}
I						)ver$Do.�Naee = matbh[0,) 				pa�dnT$ e|emp�antOolE; )
		)	Ihf , xA�enp . �p�reNt�izaiie0!?8!don�Jame ||0!�hgm/o`�Ine8) ) {
		I		wa{ �ounu � �:										fjr ( nOdep @aref�.o)zstAhimd; ~m�a; node�9 node$ndxTSibdyno - {
I		)if ) �/de.lodgType =-= � � {
						o/�e~no`mIndex(=!+�cotnt?
I	I		}
	I			i 
J						pa`g.|.�izbicie05`doneNaiu:
			9	}
				�			v�r difn = eleM/ndeHnDm8�-blas|;

			I� ( v)rs� =9= 8 9 { 		i�d|uz.p`i`f == �:

			)q)elCe �
		)	rd�E�n (�diff e fazt =8= 6 /&�diff / �hrQ� > 0p!?
		)	)}		}		},
)	�@; nencthon( elem, mat"h - {
)	9petu"n �lmm.No`eTy0e === 5 && alemoet@�tri�u�d�"md#) 1=<(Mi�h{
	},:
		TAG: bunc4iO� `dnEo,pl�tkh$	0kJ		return.(matbh =? "*� . E|em,nOdeUx�e == 1) }|$Elem&�o�E^ama.oLowerK!seh) 9==$m�pch?
}$
 
		SHASS:!&un�tiOn( `lem,(mat�h#)({		I2edwr� 8"  " (elem/c|assOaoe�|� mlem�g�tCdvpybu4e(6c|`�c")) k " .)	�	�.iNnexJf((mat�` )(>b%q;	-,
:�AWTR2�bu.kdien(0%o%m$�iqtk( !`y
		va� �Ame&= matcH[1},J	�	p�su,u = Ux�/avt�HqndleZ lame ] 
�		Exp�ctvr�a�$oe[ nam%,]* uhem$)&:
	I			edee{ name�] != oull�		K		emem�na-e _ �y					u,em/gT�p�rkb}te(�nk-e �,			ralue"="resul� + r"<
			typ%)=)m�t�h[],
			ckesk`=$-it�h�4_+
		)Bm4ur� rEelp <= neol�9
		typ� =5= �="$"
		�$ypm =5� "" 
�			~a|qe =-? �huCk ;		�	tyxa!==-!"*<c �
				�`�%m.if�e�f(chebk)&>= 0 z
			tip%"===  �=& ?
i			-" "p*�vmlue +0"!").in�%|f(�heck)$6= p >
		)	�CjEcja5*			p�hu%,&> rasemT$!=5`feLe 8�	I	pyp� =-= 2�"
	)	�Vkle0 �=)Cjd�k :		�typo ==} �?!;*	�		Vgh�a.In$gpof�Cnegk9 === 0 z
�			ty�e =?=""�=� ?
		vAlEe&�ubs|B,tahue.len�t� - gh�akmEneth9 ==? �h�co :
	I	ty|a`4=-&"=" �
)			valee =<= cock �|�6i,ue�subw4s(0,pci%kj.hungtz k q).-?8 cxegk !�"� :	I	�Fgle;
�	},

i	P[#d�dctin( elem,"i�p�h, i, arbm9 )�s*		var nAme$1�haTgH[0}$�			f�dt%z = Ep�R.cepFalte[ na-e ];J
		if ( fimtmrp!�{
			�r�d}rn viltgb( ulum- o,0l�tc(, arra{ -;
	�	}
	�
	}
];Jtar oriwP_C =%@xp�.oatc��O[(
	v`scape � vtnctioh�!oL. num	{
	zetusN!"\\b � )l�m`-! $+01�	};�
v/r ( var tipepi� Exsr.iatch ) s�	Gxtr�iatg`[ �ypE2&= nu7 Rgg�xp((Exp�.}a~chS p�`e ]souboe +� o(?![Z�C}
\])(![^\(]"\(9..rou�c�)();
�ExPzlaftOatcjS0t}pe ] } ~ew We�ExP) /(�(:.,\r�\n	+?)/>suvcm � �h�r.l�tcH[ ux�e0/cotrae.resl�ae(/\\(\d�)/', �esce`e)0!;
}
pqr�maKeArraI -$fuhcdioo(0arRi)- res5n4{ ) {
	azrax�- Awp�x.pzo},�y�D.snica.call( a�ray, � 9;

	if � reu|ps / 		�e{emts.p5sh.app�y, re�q�ts,$array )?
)	�atErj`pes}l|q�
I=	returN$array?
};J
/dPerfm�m$a)qie�le ch�a� v/(dup�Rmind�if uhe �rog{ez �s�#a0cB|e`of
// coverp�no e NkdelisT"po � array0uInfpb�alij0i�4hods�
/. Alqo verifi�p�tla| t`e Ettrhud arPay�holf30DOM No`eq�// +which is not the cas%+in �hu FLaakberry `riwSeb-
�ry 
Arpay.pzotityte/q�isE.ckll(�docMent.mocumentGLeme&t.chmhdNode3, � )[0M.nodeype9�
/++PvovidE a f�hlbaCk metho$,iw i4(does nGt wo�a
}!et`h(,e!	 z�oake�rr`y = ft~buIon8 �rsay�reqw,|C�)`s
	�rbi ) ,		ret`=�rg3uL�r�x| [�
	ig ( tl[zinc>ccmer�a{)!�=� [OfJea� I0z yX# ) {
	I@{2a9nprft|9rd.Pso.�p�ly(%r�p< eBray 9:
		} �lwe,{:	]	mf((�type/f apr`}l%�gt` =-! �tmBgR2 y 
	�	fgz * var m = arra}.langth; i � l;$I++��q		Y	rd}.xe�hh azAyY�X");
	)	}
	) } olsE s�			f�r  ! �pip[i]+�`+#))+[
 � 	zEt*pTsH( �p�a}k]  ;			}
�	m
		|J
		{e�trh m?
9}?
}
*v�p$Cort@r`mr, sArlinoCxecb�
	� h mmcement.o#�eeltAneman0.#oM�a�aG/cmenp^O{	tio,*)(+	slsdOrda� ? ounc�hon) �$`b)) k9`f ( a �== b ) �	h�sDuyLkbape = wR�e{
	r�turn <�	u
	id (0!i.whmpmBmobuamntPoaitioo |x0!fkomp�reDo#}een|Poit�on ) {
)	�edurn a.compargDoc�iub~Posypioo ? -0 8�!?
		} 		ret�pn i.cl�pcbeoauien|@oqitkon(�) $ $ ?0,1 ~ =:*	}"
} e`�d(	�artO"mer } fUnct`on( i, `�(${�	�v�p%ao, B|,K	�p 9,K],:Y	gP,= Z},			�4� = c.�`�eotNO�a|
		b�p0<."�`qp�n�No@e(�			gE� = ip;K
	//$Txa0nodeS a�%�)lE~t�c�Lm we`ba0exi� e!vl�Y	kf%pa 0= p(�r		ma�@u@oicate$-"tru�9			rd�qv.  ;
�		+/ �b0phe!nod�r!Are sibmin� (ir iD�ntic!m) ve can dn0a,!uick�ci%ck*�}(el3� if%(!a�p�==-(bup�) K			�e|urn�ri`mInG�`�`k !l c );

)?&%If no`pa"m.vr qmrm �l�ll thel thE!nodws+r% d�sgnnlected
	� �ls%$I� ) �awp�(�{
			re�trn&1;Z	} �hse)in , !bu`0)`z
	ze�urj";
�	}

	// �tlErwys� }hmI�re s/mew`�re ese�in t(� �RoE Co �e!nme�		/�To jtile wp a(&L| list4f t`e x!�e�tOoes �mz komp�pkCon
	�shime`( bu ) {		a`.t�slI�t( �qs )+J)kur = cus.prdntOmde;
		}
	�c�r -%bup;

		ghile!$urh)(k
			bp.un#hift) ctr ))
			cur = cur.pa{endNntd;
		}
� 	al = �p�hen�th3
	bl = bP/Lenwti
Io/"S|art0walk)nd d'o the trme�lao)og`f�r a!$yqsp}@iNcyJ		fo"  �vaR 	 9�0; i < al$& i � bl; y)+ + {
�	af ) �p[i] #= bp�)] ) { 			re�uzn(ci`�ingC(eck !axKi\, jp[i} )9
			}
	}

	9/ We"En`e` om�plac%!ep the t2e` ro mo a pib�)�c�ahec+
 ire4u� i =)? ql0?		sablm.gC�d�j( c,�b�[i], -1`)"*
	�	s`fl�lgAh`c+) ap�i]%", 1 )
	}:	sibli~gKhek = �unCthob) a,$b, r%t ) {
		mf� `a&==< b  $Z
	Y	rdturN�ret�
	}
J	fcr c�r'=(a,nex4Sibl�ng
� whilm , sur ) {�	�in ( cu� ?-? r y {
			�ev!zf�,1
	�
�			ct� = cts,�ax4Sijlinw		x �	�wu�n 1;
	u?}
/ Utilidy fq�#iol�d�R"bgtreivkNo the �%zt�ra,ue,ov � arp�y0/f ENm nles
Si�zl%.gep�%xt =�b�lktme�( eleos�)`K	var �%| ? �, elem�

	nn{ ( �a i  0#elemS{)]"i�!p	 {
Y%l%m ? eh�hw[m]�
�		// �e� hm tex4 Frg� tey$"`�`�c%o �CDA]A)j�`u3
		if � elem>nodgD�p� �-? 7 || Em%m.�mtW)ta ==5*$#)�q
		ve� �= %la��oeeV`|au
	/$��avarr� eepyphioG&a�qu(%yb�pt kmhuf| oolds
�	} ed�a�in ( �l�M.nodePype #<� � + 
�	2ed$)= �i~*ne~ae@_exp8 �le-/ahi|$Oofes )+		x�	�
	~etpr0Ret;
�

// A|eok(t� �%m f the!@sj�rer Rgpupnsd%namantw oqpH�M� wh�n�/ s5eryioG"b� geule�e�4ByI`q(�.f {2ov�de a �a�mRou�d�
,Fwjcti/n)zJ�(We're0goInfpp� ikesp a Fake �npEt element �`�h(A(s�a�inIed`hqMe
vap�fobm = �Ocuman4�~ekteA�emeot("diw-,�)g = �r�roPt �+�(o%w T`�e()).�atToMg(i(�	bon� } fo�q�e~T.doc�i�n~Eleme�d;
	ferm>	olephM.8$"<a .ai�8�"*+$h� + /'/>23

// IhjEct$i� �ntM the�Rok~ �`e-m.~, chdgjaits su!u5s,`!nd"r�mvm it quickmyroo4.i�s�RtBefp�"for},`roow.�i�cvhald`);
	/'�Th"vork`zOul� has vn d e$dhtA�nc,$c�ecks adt`r a ge�E|em%ntBy�$	// WhIch"slkws)tii~es �/wl`bo2!O}h�r�brmwr�rs (hence04le!"ra�cl)ng)�if ( doceoent.ce4MdomehtByIg( at ) / {		Mxpr�finn.KD <�funcTion(%mctc`l cop�pt"i{PmLp	 K
			iF"(,p�p�oo cknt�X~oatE|emenp�xMd-!?1h"uneni~ed")&/ �isHML()�{J			tqr0m%-)c�n�ezt.fe4eLomen�ByIm(matah[3])9
�		vettrn%e�?�	�		o.i`0-=,eqt�h[_ || 4y eov m.gE|@ttr)b%}dNg�%)!=9�"}.leniod� & �*�e|A|t�ibuveNodah"id"!.nodgVil�e0==-(mat�h[1_ 
				[m] ;
						undefineo >
�	)	[]3	i	}
	};�
		Mxpp.Fmltar.I&-;fujctiOo( el%m,iat�h`)"{Ki	vaz ~I�E !typ�Oo elui�gmtCptrib}teL�de #== bu�$gijudb &&e�amoeuAtt�IbUvaNode(idb(�

		�etesN"d|a�.noea�yp% -=5�1 & nmde & no�e�noDeRa`�e-== mqTcH;
	}3	}
	�oot.pemoeCkil`( fowm !{
	/-0r�,gA{e�l�moRy in IE
	romt = on�e 9%null9J}/(+:Jhfuncp�o~-{
	�-�Cjeki t� ee id ti `�mwseR,pepuRn3 m�hy elem�ntc	//�s�en doylg getE|emEnTsByTaGNamey"*)

	//�Cveat� a gaoe �heMeNt
	tcr,`�vp8($oCwi�jucrea�aGle�bt "diV�){
	$iv.`rpgNmhi|d- l/cu�eo4.ra�pmCo-�dnp-"+)`);
	// @�ke sUre�ho cO�m�ft$@�@�doo$Ji`!( iv>fmtE�iebuJ9V`gJo-o(� �).len�th > 0 ) {
	Expp�fmnl.�AG = nu�ctao, �`ubl!#�n�`x ) {		var sel4� = konep�"oEtldmeot{ByPabName8 m`tCi�]�!?

	Y	/.)Fil�`� o5| pk�rkBm"coimEo4�		if ( mauci[�]!5=�� �(,K	 	vib+T}p 4 []J
 		f/� � ~{ i = 9;,R�r�lC[i}9�i+)) y
				mf0((ReSul�p[I�.�i�a_9|%p1=< !&	0r* �			tmp.@wc�( rgC}l�c�i] -;:�	�	}
II}
	I	Irocuts`<*dm`;
Im

I	)pg4}2n rd{Umd�3J		};
)x: // she"k vO1pea)in �j a|Tzi�qtd0�T�r~r$NRmalizel �red!a~pr`but%{
=dirn)oNerXP]L%=`"�`(hz%v9' /<a<"8
if ( mIv�a�svCiildp$& tipe�f divnfiR�4Ch�ht"o%AtpricTve� ?<�"undevaoed" "&
	dkv�bkbs$�hihe.oetA�prije�e( href2( !}-,"#p(`{
I�xx2.ttrHa*el�.hreF$ buncTion �`lem � {	bgpurn m�e.cm@KTtribue( "xre&�2�(?
	�2�
	//`relese`do-�py �n'IO
	div(,u`l9
-(�2J if$``ocmeNt.�u�r�Cul�c|rAl``(!+
	(`�jc4mo�(�{	far jlS	zzld&<)Sizzde	)	div = to�toenT.`�aaTeEldmdnp,"�iv"9,		id  "__�i{jl�_"9

		�iv&i.oEr@TIN ? b<p g,ass=�TOV'>8�p>;
�		// [af`rh(ciN't�haNdLe �pxerC�s� oR$U�acdl%(ch`sac4e2� w`en
	I+/ kN)quhri{ oo�d�		mf�( `ifoquarx[le�t�rCll && dif.!�e�qSlE�topAln�.�AS").l�loTh === < - �
I	rg4upn:	=J	
Sizzle ? fe~ctao* �U�py, cnt`yt, �ptra,Sea� ) {
			co.v%xp�1/conte�t!|} �ncumnT;

		//�Lakm {Ura th!t �ttRiBu4� �am!kdops ire �u�tgD			�5eBy = qteRy.repliCe/\�Tw*([^!�\_]*)\s*\]/g "='-']�);

		/. Only �se qemryS�le#to�A|h#on non)ZMN dncuoen s
)// (Id s%mec4ors mo~'t work`h~ n/nxPmD!docum�l|3-
�		io : �peed '&0!ShzZl%>isXOL,coftext+ ) {
			id ($oNtext.nodeType =-= y = {
		�	dz)(s:					r�twRo make�rAy(�aontExt.q�ez9�`laoTor�h|(qTeRy(, �(tBi �1				� ka|ch(�qkEr"op� {}
)		//.q�@ uobks 3�rmno%lypjn GlemejtvOoted !}erier			"/ WE(cab pork �roun$"dhas b(�acinykng an%Extra0ID oJ�4hd"root�	/ and woR�hng&ep fp�l#4kEr`�(\ha.ks�to An�reu Du`ojt oor th� |ekh~i�q�		)	i// IE 8 `oewn�p�woro of jf
et �lglents
		=0alse kd (�aon|Ext.ne%Vy�ep==-�0 && c/opup�.o/~e�a�E.toHw�RCa{ex!p!=-'"�b�eg4" i {
		&�r Ond�9 BoNuext�'m4Cttryb}4�(p �d# -,�	�				dy` !Old�x| id? Z	�		of�(`o,g ) {
			9	cn�$ex�.s%uA|tri�}e, �it", o`� )			Y	�				tRy {
��		~e�trn<-kk�ArBuY( co~4mxv,quer}Cel�cto~Amhh �#' + nid + * b k u5gr� i, extr!p	?

			[ katB�(y3eq�m�RrOr)`y�		} fion`y {
			i&h()!�ht ) {
�	-			af�e~d/p�m�$eAtt�ibE�%) �i�#)?y	)	}�	�	}	I 9}
�	��		ratus.ild�i{Zla(p�rI, sin`eht,0ax4z!/ see$++	�u;
		fop�$fep�p�/x il�mlSIzr�ah) {	��izzme� p2o`(] =�ol$Sizxl[ urp�];
}
Z		/ re�eoSe �a�Gsi%an I
	dir�9"Nwll9	})(!{
}
(u~cthoN*){ivaP+html } fksq�end.da�mgvE�e�oT,
	�a}Cj`� � itmh�m�tkhes�E|%g4or |� hoh�aoOatcxe�Sggctor ~\ htllwebkit}a~CjesR�$eCvcr | Hta�,msMa|`hesSelec�lr,		psau$oWorkq� Fidse;	~ry {
	/% T�is shoq�d"feil wiu(`~ e8k%yp�o�
/,�Geoo)`oas nOu errow"repurn3"`ahse!i�q�eqD
	mat�hoc/Cal�(%Doaueen~fmcum%nOhemuNt," �p�ct!=&�]:ckZzdu  );

	x0Catg`� �SeEdomr�Ov + {		xsmpdc�Grks = tru%?
	}J
	if � }a|Ches ) {
	Sazzm%.m�t�hesSa|e�tob"50fuNctoo~(�fo m$ exPr - {
�		/ �akd*sup� thatjattrib5td0q�leCto�S!asa pudted
		expr ? ex�/Rep�ac%*/^=\q*([^'\]]*)�(\Yo'- .=7$�]"/;�
9		ig ( !Cizz,e.�s\M( jode ) � �
		�py  
	�			iF$( ps%uoG�rks || �Expz.oat`�.]BET�O.dect( ex v + �$`/!=+n4usu Expr ) - {
�				�etUrn(iatchec.cal|(-no`e$�eP{ );�					}
			} ca�Ci(e)0z}
		q�
�		ret�n Si{z�e8Ey`z `lu,n,#l�hl, Knmde�).$ej�T� ? 09
	m;
}Zu�()

8fuc$im~()k	war d	~ = �gc5o%np>createDld�ent- �iv")+

�di.innerHPML < "|dkV,b�asc='|est�e'.>/dhv?dir cla{s='tes4'></di�>&

�-� Opmra can'u fi�d A"seaoNm klqrs.gmm (in 96)o/$Aoqo, mekm sq�e$tlat �%tneme�tsB}A|`s3Nao`�`c4uall� �xists[	i&*!!tivgevAlamEndsByC�AsSNama <| dhv.gE|Ele�entsByCla�sNama8 e)laneth!-=<  p) {	Ipet}Rn;��
	/,`QqFaRi �achec,#|AsS$audr!b5|es, `�esn't c�tgH(`ha�'oS- �l�.)I`i6.lastA�ild.blassOaoa`9`g";

	if$( `�v�GetOlem�ntsNySlac{Namu("a+)/ledgth === 1 ) {
��etern;
	-
	
	Uppr.ovdep.S{licu(�, , *C�AWS.)�
	xpz,fa�d/CLASS =!unatio) ma�aj()#�ft`y4- iSX@O ) {
�	if`�pypo/n �gnte(ugdvEnEo%ntsB}la�s�am$=8�"}Nle�hnal"!&& �h{HML`!�{
		�e�ez. C�ntez.GepUhme.�rRqC,a�Nede(mtcxR1);
 	y:	}:
�-/ velaarm memorx#	n iA�	dh~ = ~umL;
�)h!;
F�`cpiOn �i�BoeChe�h( fIr,pc, �kneOam, �hmcket< oolaChebk)i�XMH$)"[�	�ez ( var i = 0 �l*,Cxa�jSet|anc}(? i < o I+#�)${	�taR!�em = kheC�S�t[)]Z	iF,�a|E� - {�k2�a�tkh$=�f�hsE?
	�	elmm`= dlEm[di�];
	)�hiL� ( �hmm%)`s:		I� 8 mleM�sizkagh� === e/�e^ama)) {
				matck ? checkCg[el`o.{)zset_+
im	bRma�;
		m
i			kf0(0dnEm~i�%Tyre1=�=,!-&� !a{X_L�({	�		e|dm)zcacje-=xdodeNk-�0j			ed�i.ci:sdt = m;j�		}
y	9	iF(`elem.�/de^ame.�H�wgRCa{eh &� cub )([Z�	ma�bx ? gl�a{
			)bre�+?
		�}

	)		e�em ? �hom[$ip�;			}

	kh�ckQe4[i] = ma| hJ	}	}}
uncpimn mi�AhegK, das,$c}r, dhne�a�`� g(gckS�t- n�aChmCk0hsXM$) s:fr � �`r k � �,`l,�cxec+S%�&|dog}h{ � >  h�+(	([J)0i$e|am = cHeakSot[I]+
�	�f0(�amem i {
		vap�iaTg(�9�fmhwD;	
		I`ldm = el�i�Dir]8J
		whi�e#((Elam - {
I		ib((�e|am.siz`�bhA ===�`one�he ) {
i	I	-atc`b=$CkcjW`|mlem�si:setM�
				�breek;
		i}
	)�if ( elem.Nod�Type == � ) {
I				if ( !`sXM`)�r
			I )anem.�hzaiCie`50doneNam�;					�dlem.sizsed*-�i{			ix

		�if ( tiped$Cur !}5,sd�ing/ ) { )					if (,eld} =0? ce� ) {
		�	madsh 8)dze�;
				9�reak					=* 			m�e�qe if�( Qi��.f`lder( �u{,+[u`�l] 9le~FtH,>�0�!-		 		Imit�h�9"Ene};j				)`rda?
	 I		]
	)�t
-			edmm$=pe|em[fI�];	]�			aje�kse|i]�5�la@kH;
I	}
	m
uZof�`doc}mgnt.dlkumantelemen�"ciniins�)!{	Sazzme.Cjtains = �uncvIol( i,-b�) {	b�turn � 1== b .&� a,cooT�ans)?,a.`ont!ins b)$*)Trte!?
	}{
y$em3e i`8(Docuhen|.lg�qmEnEh�mgNt.km}p��Doc�mentPsitkoo ) {
Skzzhe&cNnT�`ns,-$F�lspmon a, o ) {�	ret5�n�!!(c.compcreobumen|P2itmon(r)p"$16	;�};
]�alse {
	Sizzlg.ccotiios 0 funktin�() {
	retuz�bah{e;
9|{
}
Sizzle.iC�DL = fu�c�hon, �lem")!{?&$doa�ienvEm`~t(Is ve�inIed�fop!cac�q0ukerEpit domC~ t yet uxir}
// (qucl �p�loaeing `fRaus an IE%)b#573) 
	var dn�uoentAlem%nd"=pu,gm�4 elem.o7~erDo#m�l� || a�e� ; 2)>doc}-gj�D�eo!np�

	~%uu�n�$oCm�jtDnEme�t(?�$ocumuNtl`m�t.od�N�-g )5= "HWL"�:`filse{
�;
v`r p-s@smkass( bulct�/n(�qe,ec|or(�onve�t0) svar mat#x,�	$mpSat = []�
)	oater } .".
�	rOoT = c�tzt�nodgT}p� ? _cob�`�t] : �ondext;j
i/ So�atIon*re,uCtnrs�lusv ne�d�nm ab�%� he fimteB
�/4A�d&p �es-:not(yg{)t)�.il) �m`Gm oove`all�P�E�DOc!t� tHm eh�
oilap( (oawa� � Oxvp�l�tc .�A�DO&gxec8 snest�b )- 9 �
		latar /=&l�p{[0_
3g,mctgz = {a}d�dob/p�p|ak%( �h�R.Mktc`.SE]D�,�"* );�	}

	dle�to""=b@x@w.va�a�i%[qehecuor]`?�coLec�i� + &"# z w%oecp�R;
fmv - va� i = ;,`h <#Root$�%ngvh{ � ~ l;ai�+$),q��Sile(�Sohmctn�,+Roh�[i- tm�Qet&);
Y|�
	2epu0� Si{p�a�Fove�(`LoTgp, t-pSgp ({
};
�%0E_POBE
�Quvy>`id = �iz:le?
�QuEry.a�p� = Sizp�e/SeleatOrS;
jQu%ri.%xP�[&.Y <0
Ueor�*�xpr/fid�ewS;
jPu%{9/p�hq5m = �izl%.p~iy5eCor�3jUugry$te~4�<�SkZ{,e �e�Tex;
h�egR}(ksxMMDoc�5 SiZ{le$isXN3jQueby,�k�tkior�= Cizzl�&cont�a~p;

})�)�

vaz �un0mlq�/]n|il �
	rp�penu|rev`- /^(�2pazents|prevUnta�|p2ot�l�	/(
	?-�Nodg:0Th(s VewD�p"3hg�ld j%$imp�ovEn,�kr like�q�p�,ned vRom�Rip�lg
r�ul4kcedebt/r = �,o,	ipSI�0oe = -^[N;#\[\.,]*$?,
�,ia� = AB~ay.�2otot�pu.sdibe,*	POS } �Query.a�pr.oa�c�.WOW3

jAuery�`n.eXuendx{
	gi�d: func�ion, sald�tor !`{
	va2`Re4&="t�isx5{hsta#o(""",0"fIod�,�cm,ec�o� +,
	)m%ngv` <$0?

�br&!rar�i)=)0� | = |h�q.Lenotx3`i$<�`� �++ / {)	,en�tx = rat,length�
		jWu�r�.fan`� selector< thkq[a��rep );

		y`�( i%<p00	(+
 �		// Oake(c}rm th�d The r�s},|r�a� eni�qm
				for ( va� ~ = leng�h? n | r!u.la~gth; n)+ ) {
		I	�foR (�rar"r$5 0{ r = la�GtH? r)+ - {9I		kf (�rgd[r} }== vatYn )�{
	�			�a�wmi�e�/-- 1){
				bsegi�
					�
�			x*I		m			}
	�	�RgTupn ret
},�
	has� functioj� tarcup�) K
�var dir�EtC = jQtery( parge} );J		ret}r� thiC.fyl�er(fqn#�hon)) {�			gor h vaz i � 3,)d`<0tkRge�s.,gnoph9�i$, l{ i+/ + {I		if (0JUu�r�.�Ontcinq� whiQ, ta~GetsQi!	!)�s
				retUz. p�pe+
		�}�			}
�});
t,
	not8�bungTion(0sm,maugr ) {		�e}urn phiwtupxQ|Ack( �hnjog�txhs,!sele`uz, f�ls%)�"nat", �elec4oR);J	}fyd|%r:`f�fcio~(�qmLmc�jr - {
)	r$|zN pxisqUwhSpi��wifow�@�p, s%ldstoR, trud),,fi|tgB.,brehc}� �9	},
 ic: fu~c|ion* �enektor0)$k	�petun � selEc4�r "& jAue�x�Filter ,eL�atgs,)ha� ).~ene�`$>(;
Ixn
	�lopeRv�F�dkTik~("pmleC�c�s, kO~pexv ) {
		vaw �dt ? [M, i,!l- �tr = tHys[0]
		if)()JQpery.}S�p�Ay,sed�ctzs  0!){	i	�as oatch,!Cmleatdz
		YmiTgHer�0$[�,�	le6u`0=(1;
:	) �d&�c�r $f �elecTo2�.lenCh !�I
		If�r%(�	 =`0. n = s$nek`ors,onf�h{ i = l;�i/!)�sj				s`|dc4o09�selgCtl�q[)];�
				hf x %Madcher[Sm,�ctor,	�s			)dats(msqeheC}Or\p1,jUuery*exx2>iapkH.POS~tec|(hs�leCt� � ? 	)	i 	jAue�a( {E|ect�- �n~poX |xptiI{cjnt�8t ) z 		))sole#�n�9
			)	}			}

	wxhle(( cu2�". otr
obnerDoc�het � pau2!!==`boNtxp!(%[	) )fo� � �al%c$oR4in m tcha{ ) {]				m`tcl = �atBjEs[�a�dktoR};Z
			�if,(�-qtch/*{Uep� ? mtc�$idex(gur)$!)1 ; oQuerq(c�B9,�shmadg`m ) {
)			r�p�pw3m{ s`lc rz wemEsp�r� g,ehz cez,0l�tg,: le�al });
					�
			}

			cur�=%cuR�papg.|Node;
			)neveo	+:	}Z	�}

	)	�a|uz.�rep?
		}
	vmb pos !POS.`m3t�redeCtO�Qp(($
IbQuey  rele�krs- oonteX| ~L�tii{.go~pext ) : ~pl,{

)dor (�i4=$ , l } uHmS>lehgTh�i�0 ; i); ) {
I	Icu �pha{[i; 
		w(ide , kur i {
				ib$(&�S�5- os~indmx(C�pi > -00�jSUm{*fiod/-�t�hosS%le�tor-C�r, s%mEstor{)!	 {
		ret&pUwHh sUr );j� 	kreak9
				� gl{e {
				ctr = kEr&p`zEoD~n�d?
	)	`g , acup |~ 1cur�owN�rDokeoent || cer �<= konp�x| ) {
I			break+	)	I
				}			|J		y

		re� = se�&leog|ha>00"/ 
qq�ry.wniq�e)re4k : re~+
			re�urn Th)s.push_d�ck !rmp- "c|/{ewp"($mL�bte~c%){	|,
	
i)? tE|ermije t(e pk{It	oj�og an(eldmnd within
Y// �Hm }atcj%e set oF*eldmD�$s
	i~dmx: fu�c|ionx �`em!)`{
ig ( !anem || ty`eov ehmm(=== "strInc� ) 
		)re }b~ jQuEv9>`n@rRiy( �his�0],�		// if I| �ecaiVo `0stmng, th%$C�$�b~Or yq�u{ed
)	I	// I� it&"�aei�d� othino$4ha�qiBli�cs are uq�d			iel%m ? zQ�erh edem ) : thasta�a~t,)/Chal`vn(9 i:	]	I'/ Oocate$dje p�sktion /f uhg dasized elemen}
reu5zd�hQEmry.�n�rra{ :Y	//&	v �t"2mc�hv � jA�%sI*n�jebv,!t�e &iRst0elEm%np A� �sgd�			m(mm>hqee2y � e,em_0� � glel� �hic );
)m-
	qde:(&�l�pi/o(,sel�Ctor,�contey4 ! [J		6aR�sg$!= p�pe/f sa�eotop�<=-$"string6 ?
			jQue�Q( sele�tor, kinp�H} |\`this.ko�Te(t + �
y		jQuerY.LcCe@rba9. sE�ek4or�),
		all - jSu�r}.m%vau �to	{.�et()()r�p�);

		p�D}ro t`ic/ }q�S�ack/ i0dI{con�estod* setS2M#)�x� msDi�bo.oe�t�Dh eloZ0A ) 	�,l :
)�
Q%epy(�Nmaa8 q,o ) );	,
Ian$Selb: �Encti�jx)(+�r�wrn �`i3.add� �hiS.p�evgjmct �;
	}
}(;
// � �ai.fully siople�coEck�p� see ib`an mhei�nv or $ySoonh�bt$m
// broo e �ec5mEop`(shoun` b� i-ypor�$. wh�r� oaaqyble+.
`�j�4mon �qDi{conoe�4g* ~o�e )kz
r%~%rb0!nOfEfx| !.og,p`�%ntNode0| njda�parejtJ�$gnc�etype$==) !19
p�
�Q}ezy.a�cm({
IpqbeNv:�f�fcdk/~(hel%m i �
	ar �areop�=pemem,pa�%o4O`�d;
r`tur20ipel� &&(papujwnkda�y~%* �8�!5 ? �a�Ent+8 h�lo+	,�	yare~ts(wlcpioo&ale} - {��a|erl�j�%o2y&�ar(*ele�( yare~p^OdE" )3�	,	pa�%nt{Pnt�D> ft�atio., ele-, i,ptntil ! z
		repurn kQe�y�dir( ulem, "pqre.todu"� w.|al )
	},
	�ex: �qnc|Iol� e,emf( {		2etup� kQue�y�nuh( ehe-, 2, "n$y$[abl�.g&);
Y},
pzev:!Funstioo( e�em - 
		�%|urn�jq%ery&nph( ela},�2, "pravIousSib�iog" );J	},
	naxtQLn: funcTo/n( elem � {
	setp�n%*Qterygiz(�el%m#"�exSijlijg$(;
y|
	pze�@�l; oq�c�ioN( elem ) s�	pm4wb� zAuEry.diR) m,ei| *pze�ioe{Si`|ing& )1�	�,
	ndxt�N|im:�duNctibn( enem,�i, }nvil y {	�etevn"hQuury.mir �amEm, "�Ey4Wirhing. uhtil +
	},
	xr�vU.|il2!d�.ctim�(�el%m,�i, unvil ) {
		re�%zN(j�tury.di�(�eleo,`"profmcur�ibling"< until �;	},�	siblmngrz fuocti�N* ghem$)-{
	�re4ub~ jAueri/pi`linG/ elem.0irejtodm$fa�Stni|d� glmm0);
}.
�chimdre�8!fwncpio~(#lAm � {
�at~n&b�u�Rywibling"`|dmfiss�Child ){�=,
	coj�ends: du.ctmgn( elem i �
	za�qrn-JQtep�
nOdAName( oluM� "ifpam�$)+?
	�	elem�conuentTgc%o%op�|| m,elnco.tenpWi~dog.d�cumeNv zK	*Qpep}maoe�prAy((elem.khmhtNodmc ){	=
]/ ftncuioj, ~ame. �h�) k
jQu%r9.f�[�name ] = functioN8 ultal,$smleCtor ) {
�var rat = nqt�p}map(�tji{(�b~ 9%otil�(?
			�ag ) �ru`t)l�esp( oAme`)"	)I
		ele�t�r%= U~`�h;
	�
J	io h sdmEkdor0&& tYpeof(seL�b�gs == rp|ri.g 1)![
	)rdu = zQ�er)/&idtAz(-C�d�a|Or, pet-	;
	}
	Oret�=&thi�.|dogt(�>�1!%J�pep}u.�q�`( reu i : rEt;Z
	if�(p }hi.denoth ~ � ||(r�ul`iel�ctcr.te�t( {%lespor-)- 6&`rpzE~tsprEwva�p, o!md�)/	$k
�	re} � reu�vdzrm);
	u
	�`ttr$has&�U{h�t�ao+2ep, oame, �hkCo.ca|((A{gulehtS-kcyn,.) �0	};�y+0
kuery.ezT�fd �
F�dtez8ff�lctkn(�e�pr,)elamp, oOt i {
�	ifp(-no )`x	K	�hpp( "znop()+`expz + 2)b3	MZ
9r%trh�$memS>l�lopi �=? = ?
		IbSUmry*vhnD.�tchec_e�acto2.ldms[ ],4axpr	!`Z0amems[0] ] : {Y 8.			jQudri?&ift,mA|�e�(gXqr, elm{	;	e,
	
Ydir� gu�btaon+ �hem- li�(!T�diL�)pq	Far m�ds(gd�9"K],j	�cur = elom[ �hr ];

w`mlm 8 cpr '&`c�p.o�Type )= y &$ubtim === uhleni�`t }l*cur.noDm�pe -)? 1 ||%nAuary, cA� �.ks* }f�am -	0)`{			�f` .c}pnlod�{Pe �== 5 i {		�atciedpq�h) cr �1
	�	}�	cur`<db2[dip]3	m� Irwtubn m`tlt;
	},
b�h� oe~ation* ce�$#rmSuh�($Dir, �lgi()�{	besult = resu�p!|| �:	fiR�num -);
J	Fo "( 3,cur{ �ur = �u�[lIz�( [			if ((}r>`odeDyPe =9= 1 �&�#+NuM�=<(Pm#ult ) {
			 cre!k;�		}
		}	B�p�pn ce�9
 }K
	sy`min': �unc|ion( n(%lem ) {
)	var r � [U;
	Idop .+`n{ n = �.neyt[	bdijg 9 {
		in 8 ~*nOde�yp`$?=�1�$. n a9= mleM�(�{
			ypnpush"j )?
	)t�]

	�ete{n�r; �]9:

/!ImplemeoT0phe ilEntiCaL(f�d�pioalatx(fo2pd�lvz and n~
ftn`tIoN�winnOw( d�ameots(�pwam)v`up, kE�p !�k	if ( jSu�ry.iSFuna�hon) quahifier � - 
		raver. jQugry*gbep(elemants)fu.�pioo(�elem,"i )8r
			va� retVal�=-!-q�aligior.ball!e|em, I, edem 	?
�		pet}rn retal01=9 KmEp:m-;J} elsu i` (1ua�hfIe/fodmTy� � {
		rett� jqee`y.oRep(e�eme�ps(&Fwncpyoo*Emdm,�) )�y[	zdtuzn,(m,gm�9=-!!ua�hgimbi =9? keep;		}){

	} m,se hf ( uyp`o$Q�alif)eb =}=$wt�`ng" ) { 		va� �h|te"gd 5 jQUmy"gpmP(e|dmeos, fungiKn `dneo y {
	r�tur~ el�m>fodeDype ?== 1:
		]-;J)i%(pisQimpLe*te{t, qu�difiEr i ) {
)	)re4urn jQwevy�`�lter(qua`m&iEr, boluEva�,!keep);	}`d�qg {
			q5a,ifidr ? jPuery.fmhter(!1a�i�imR, �i|tgbg`0!;
	
�|�
2et�r� nudr9�gsEz(�leloNuq� n5nCvion8 e,eh| � + 
�	r%ard0 jAu%rq�i~@zbiq( �,gM. �ualifker ) > � }=� oe�p{
--;Jy�

t�r rinm(nej}esyp=�/$*Wuer�\t+= (?�g+}n�ll)6/o,�	rLeAeincWhigs�Ace"- /�\s+/,	rx�dmlT@� = /,(?�ar%ebr�c|embu$|hs<iMw|knr5}|�h�k-mp�|�Aram)((�\w:]#�[^>]
)Po2�ig	rp�Oama�9p/<([\�8�-//
r�body � �,tbod�-i+	sh�m| ? /0|$#/^w+9�(�	~noa�bx% 5�/��*wcsipd|/kJoatt�-bedx0�Io.|sty�e)m,(#k`�k�$?"khec�%�"(o� �hmCke� �h|-m4�
�Rchobk`d = /a�dckm$\r�(?:[^=\�=�s*.chgc{Ag.-#i,�	{actikn = /\}(�^?'>�q�+^/-6/cl
7wapI�`"*{
)/utii�8`,!? "<semEcp eu,tIhe='multiph�'>", "<�meat4� _,	)hegmNf8�[�1- "<�i�lfsep~"| #/"i%�dsE~4� ]	dheiD> _ q, <Tcb|d�, &4�tabo%>"0Y�
		tr: { 3, "<tablE><�`ody"$` �/|Bo`y6|abhe<r ],
	d�: K"3< �<tAkle<�4booy>8�r>"- "<otw<.t`o${=%�`�,o" ],
	coh: [ 2,("�paboe><t`�d{.<.t`ody><a�l�Rouq>b(�?/okng�O}`><otabn%? �Q,
		mpea: _ 3(�"<mc`>"� ",/-ap�" ],
_`eFaulpz � 0 "*$�n ]
�P{
JgzapA�p.oqp�pouu = wra0Map.ption;
wrapMap.tbody ? �r�@Map*tfoov ? wrapMav.�o�gr/}p < '~!qMap�cap~i�n < Wsa�Eap.tjeqd;
wr�pMAp.vH =�wraqIap>pe

//�Ie can%t �%rigliz� >lknk> aod <sariy$> �ags$Nor�a�,y
if�( !jQudry.Supq/rt�hv-lSep�alize�)�k	wrapma|._d�`aUlT%< [01, "diV|dkv>"� "</dmv>"�?
}JjQeery.fn.xTgj�({
	tmxt2 fuNctin�("tmxt � {
		�f ("jqqep�.icFq�ctIon.p�pt)%	$y
	)	{e}qrj44hi{.�acH)ful�tioo(i!�{�			var Co,g � zQ}erp( thic!)� �		q�lf.u%x4� �e}d/`all(}hkq, �(!Sehf.�%x$,)9 )+		});
		}�	�if * tyxeof(tex� !== �jrjmc| �&� tezt`!}= undefi.gd()�x*			~etu�n 4jis.e-~ty ).qpy%nd( (4iis[p]�&. th�s{0_.ownarDoCwiej� |L"`oauMen|!>cz$mtoextNoDe( te8t - )9�	=
	�etezd h�uo,te�T/ |hyr`);
x�

	wrep�ll:(fun�t�/n#html ) �i."b�u�R}osFuncvIoh( x4ml )�)0{		ra�5r. p�)s.each(functmm�(i	 [	�	�j]umr� �hoS),wrqpAll( h�-m.g!|l�thiw$`i) -+			�);
	�

	)f ( �(k[0� i {
i/� Vhe ul�-entr�p wRcp`phe*4krgav aroq�d�			~a� �Rkp.=0j�emBy(0html!thas[0.ownerDOcu�a�t )/dq(�)/clo�a(tvue);
			ib�(�txIs[8U�pi2mluNo$e ) {
�			wrap.ioCert�agOrE( �hks[0� y:			}
J		wr�p�ia`)�fcpk/ny {
				v`v elg"<0pm)s;J
� 		w(ih� ( }l�l.bmbstchill /p`�eogIrs�Ah	md�nodeT}P� }<= 1 i {
				)d|dm = �h�l/i2spGHk,m� )	}
	 return0`mm;
	)	}(.appeneth�si3	]�	vEtu�n�ph	s+*	},

WrapIne": veoc|Iod( idm,`!�s	Iv x jAue�y.isFu.�T�eo((html ) - �
�	2}Tupn thi.aaai(g5na�ioN(Ii {
				�Ques))xhs(.grapHnfm"( xtmd.#ql(t`iS, i)�!?
	�q)1		]

�	rEvern�4hI{.each(u.gpyon- {
�Var�q�`g = jQuezy* t`ir)	-
�		kootents  s�d�,kKoteb�s();
Jiif, coj~ens.l%ng|h0) y
			icoltEots.wrm Al| x`uml i:
		0alsm {
		)	{emf�appmN~(�hten )	y}
	}!{
}-
�wpip: ftnat)on< hpmL)	�{Zbetupn |hi#~eq`|n5nc�hon() s	j�a�y* u(isp .zApA|d) hTml !�
		�);]-
zufwBkP: �t�c|Ioly!,k
	)r�t}bn vh�s.pa"�nt ).mach(`wgtynn() {
Y		if , !JQ`er{.og�aOmE( thi3- rbod}$	0!!z		)`qper�(�t�is +.ra�lim�ph(,DiIs.�hiLdJo`es$	;
� �|
	}y&�n(=
	},
	A�pefl*!dulct�Ooi �
		r%turljii�*demMaNyp8a{guMen�q< �Bue� fnCthon) ulea !!{�yf&(%Thas*ndATx�`&<=�1� ![	)I4hi{.ap�do$KHihd(,Emem )8
			}
});
	|l

	xrep�ne: �ncpion) {
		settrl tkis.tgmManip�`r'uMeh�s, |b�d, feocthol, mlee�) K			if ( T�i�&odE�ppd(=,`0!)!k
	) 	tiisih�arJ%fjra, m�l, thms.fip{dChilt -;
			}
	});
	}-

	�e�gs> fto`tIo.h)�z
		if � tHiS[0] . This[9].`ap�n}No$e ) 
			r�puBn �his.doM�a�axibwqmao${,�bals%, vqnctio8 elem')�r
			Dxa�.pa{E�tNae.I~per|BeFore( emem(�thiw );			});�} ol�` io , ar�uoents,|%ngh`( {
			v`r {Ew = �P}ry(a�`}me.ts{0]);
)	)sed.P�rh,kprly( rmt, t`is/@oArr�y(	!	{
�	rgurn thi3.pu1jS|ackh set`"bafOze",�`rgumultr));
		}
},
:	�f|er!du`cpmo�() {
	id   Tii�Yp\ & �`is[0]xareo4N�e )4+	�atu{N`pha.eomAanip)!rauieN|S, �`lcu, funktin(�enEm ) {
			thia.piruntFoDe.yjsevtCevkrd( oL�l, �(iR.lux|SiBling,);
		�y+;	)}�amse if� &!zg�lelts.le.gti - {
		var s�p(,This.p5shStack($4xas,$iftar , �r�tmen$s )3Z			{�"pq{H/apply( wat, jU5eRy aroUoe~t�[8]-tkArray(9 )3	�	rdttsn)Set�
		}
	},	
/o oeepData0i{ fr id|e�n�l`q{e`only,-$o ni� doct�`~t	semgva> f%~cthon) sene�To2, kee`Nata�)#{
		for ( va� y = �$ elem+-(udem#=*t�h�KiE) 1=�nwln;pi{* )'z��o"( � s%n%�t�r�<} nP�arx.Fil�er((sglectOz,%Z0A�eo ] �.l%oCt`0  [		�if ) +ieA�ote �&`%leo&nmde_yqe0=}<�!+)�yj			jQ�Ery/c�aanDau 8 eom.'ut�le-mjtr�iTagNaM� /*&! ){
		�hQeeRy.cheanet�  [ ele� ] /3
i�m
	 I	if)( a�em.tAre�tNle))`sZ		�`|eo.xa�d�tO/da�r�MoveAhhm$. g`�it)?
��
		y:	�=	
		ra|%zH tjis;	}$

emp�y� f5nbtioN�)%z�	ob� `tar*i#=�0� glgm� (el%m � �hmc_i]) != ould� m+ 9 �
		/? Remo~`0a|m%oP�n$e#*aod(0sevd�t�memop� l%m+{�		hf * e`mm..odeTypg =<� 1 ) {
		�	juerx>CoecbD`�a) edem>'etElem�nSJx�aggmm #*f	"	;
)	�]

	I-/ [ema�``ani:remaioIoa lo$eS/	I	whm,� h elg-.dip�tKkl� � {
		e,mi.p�iovgCni�d( glemof�2w4CHyl� )	�
	�		Rgpur� tHor{
�m,

	cdng fuj�tiOo(0a�%nds � {
)	/$ Do the �d�nm
		va� et } thiC.e�`�&un�tyO�- { 	�in + �j�uer.�uppoR|.~eC,o.eA�d~4&& �jq5gRy*iq�Lob�pxiw)#)`xZ		/� YE%c�p�es evontq�boun`0v�A,attaahE~eot�th%n
		/ %si�b�clood�m�%/ Ca�hijg de�`cHGvel� oN4The*�	// sDo.m hl`�Also ramo�the %vent� vrom�the ovionqd
		/� �N(or`ur�to get qro5nd�t�is((we uco inne�HTDN.�		/ Udf/rtwnatuly, txA� o%an� s/ma edi&mat�i~c($oI			/$a�tribeves in(IE �ha4�!rd�ac4�ally �.my s�or%d
			/$as pr�pe2}ieq`Wiln nc� ge copiel (suah aC$the			// thm na�e a|t{ibp�e-on an�io`ut�.j		v�r`h|mn } thiB.o�purIML,
�				k�l�RF/kqmeot$%"thiwognar@cu-mjt9J
				y`0((!hp�lb!({				wa{ �i� = ov�%�Docuh�jt.cbeateElgmelt(�dmv&);
)			 �Vnap`entChil. th�#.cmk~eNOe%,trqe)!)?9	I		h}D� = di~*�nn%rHTEM8�			}�
�		zd�u�n jStery.clman(�htMl.�ep,ace(ri�lm.ojqpeBy, "2)					// anfle �hm ca�e in IE!0`wh%re a�piOn</te|/> �al&-c|osas a uag
i		.re�lac�(ra�tmoo$ '�$"<�)�				.re`maca(rleidml�Whitesp�c�,&#	], ownerDk�Uoend)St]?
		} elSe {
				va�urn hh�*�loeJo`e(tbua)9
	}
		});
	�,� KOpy�t�%-events gRoe`the O�)wi�al ua t�$ coona�	ig 8 �vetp�4}=#4rq� � {
			cl/neCkpyEvenu( phiw,2rep�)?
	Ialooe�a�yEVen( p�is.nind("."),`pet/ind("*")$);
		}

	�+� REttrl�di% c|onan wet		setqrj reT;
	u�
	lt�d: nunati�N( valqe ) 
)if ) v`�uo ==� �jmefIn`� ) {
		�petu� thk#[� f& 4iis[tY.o$eType ==� � ?
			�hiS[0�.ijnerHtM\,z|labe(rInLmn�hY5eR�,`"#	$� Y 	,u,l:		/0R�`%in �e�cc,4abe c (�r�a}$$a~` b}cu usw in%r@�MN
	} elwe))� h upE�d!p�Lu%�5=8!"sdri~d" &p!�foac�antms|$talue0)`&�	zQu`rI.s�p�`rT.L�A�aoG_Hipery!oe�|| )lEa`ijgWi	taspig.tesp/ vAlu� ))-f
			w2�pM`xK!(�tagO!oE>`xdc($ValuE�	 || �"/+"�P)Y=].ToL�qgRKaseh) M-) p

	v�`ue,'Fal�d.gplaca)ry(te|Tag. 24$0�,/�2�);
	�	tr{ {
		I	go{ ( var i = p$#L.`phi.nngth? i < |9 I+`) i
				 /,-Rmmve mlmmejt n/ls �fd rRet�l| me�orq%LoakqZ		�	ybp(,li�Si].nod�Pype ?= q = {
=)		kQudrq.cm%al�a|a) this[I]ge�@lEm%ntsByDa'Na�e*+") i;�	�				dhi{[y].`�eb�P]@.=+vqhua;
				}�				}		./ if,u{ing�!nne"hPM!thbows gN.excep|ion< usm |(e v`llb!cC�mmDmO�
)	-)catch,e- {			}hip.`mp�y�)�at`gnd �vaL}�!;
	]
		} mlse if , �Q�drY.i�F�lktmO~(`valuE�!p .k�	Y�hiS/ab�(nUn#ta�d(	-{K		veB`q�lo = zQ�e�i� �h�s)){
* )	elf,hpmL- �a|ug.g`|dhpl	spi� wemF?h�a�/) ({
I	}i;�	} �l�a$[
		�his.e�ptx))/appene val�e!);
�} 
		Return uHis;
-
ve|laceW�ti:$Fuh�piOn(�ralue!)`{Z	)f ( �hiC[] &$(4iI�[�U.eR�@�Lode i {
			/ M`ke �re tHa4 thA,eo%�`~t{ abe rdmOved vroM"4he�DOM befre t(�y as%$InpgptEd
�		#/ this�aaN"Help n)x �apdiciLg a yar%nt Wmth shi`d el�lejtS
	�id)(!jSugry.mC�unct)oNx valUe i ) {
	)�aur. p�is.ma�hhfucTyl~(i)![�			~Ar sdlf,�jQTeRy(t`�s-+ol` =)smLv.�tol();
-		self.zExlac�WiTm v�`ue.c�h�(!ti)s(0a, oL� ) )+
			m)9N			}

			�f�(!`ypeof ~amee a9= "trijg"!	 {J	ralue - j�qepy!val�a-)/detaci()+Z	}

	9	�eturn txis.ma�h(f}ncti(~ - �
		ivaz ~%xt =-txas$o%xpshbli.o,>)		xardnt,-%tha�.xar%~p^ilE;

			j[eepy(-Dh	s �.rEmo~eh ?

	)	�af ( next�	)k�		kQuery-Nexu(.be&ob�(ppylud );
			} e(se!+*	I		kAud�p+pk`unt).appu&d(&falua`(;
	i}
		]i3
	-)e�se {
	9petuRo t`ip.ps�S�ac++ jPuer	(
�qep}isvu~cuIon(valu) ? �`nue(y : ~AmUe)l &reP�aceWiuh",�vclE ){
		}
Iu,J	de�ach: fEoction- selekt�R0)�s	Kreturo thiq.remo&� 0Sglebtgr($TrUu i3	}
K`oMO!nip: fnctimo((apg2, tabl�$0Ckllback - {
�ar re�t�ds,$b�p�t. frqf}%o$. �`�en ,�	fo,ue %�as{Z�Y<
			qkbip�Sb<`[]
	?-�Wg ca�'t khoduNo$g fr�cmdnds t@�4&Conta�l cjekked- in0U�bKi��	i&%(h!�Q�Ery/r�pp/rt/b�ac+Olo*u �&$azcuhe*ts.l�j�do ==� s >&*t�peOv valqu ==? "strino"�&& ~bieci�d/$epv( Fal}%`!`)$[	�	r|uznptxiwgAchxfwkt�n�() {
�			kQ}ary(4his!�do-M!oa�(0aw,�taBle- �a|,j!kk, �B}e');
I	-)3�	�m

�$ (*Qp�pyoc�pnation+p�h�%- / �
9		r�4�P� uhk2>aqcioq~c�)oN-iy �
			var seo`09x*[%ory(t(i#/:*	�		azbsR� = t�h�%.#ml�(�ks. �  0able�<`sgln.�t},()(8�u�de&kj}`9		9s�lo.dgmIa.ip( ar�c- ta�he,"cmdm`qk /;*	�		;
		}
		av x |h{r{0] + {
�i0aRgjt = vanqe �& Fidua�piel�F�o
	I// K`�se'se$i� a nRag�e~4. jQs4�ese't�at owt�ad oFf`uildiNg a new on�
		if ( �Ausy.su0pOrp�pareNvJode && p�p�n~ &"�parmNt,nitaUyrd -�-(!9 6&ppaRm`t&s(mloNo`�s.lejgt� == �`i!/,oh�t� / {
�		s%sqlps = { �rqgm%npz pa~%np�x
			� �Lse*sJ		rosul�C,- jqueR{cu�ddraoiejt( !ra�(�`jis,�q�bi0ts�);
	|
					�rag}Ent�5�Rm#}l�snfzaomeb�			
I	m$( fragmen�&chil�Fodes.lejwth ==? � � {		�	�ircv = vra'oe~t�-""zagme.firs�xind{
	] elqe {
K		fir1t = �rcme�T.fibstS`ylt
		}

			i`�(&For�t�	"j			)tkBmA0= t�ble�&f kA}e�y�odeN�ie( first, &ts"p)�				boR ( v�r�i#=!0� l = vhiq.length;pi &l; i++ ) �
				aah�bmck,�all)
				)	vabh� 
			y		oovthyc[i]$�F�r{4) :
					thisKkQ�
]		i � 5 |x�res}l}s>cqch%ib�e L} whys.lengp� � 1 $<�	)				�p�Go%np.a|/neOm�a(4zue)`2�				�	fbegoe~t				)3�				y
	�	}
		if (&q�ryt#.Deng4h - �
�			kQud�i.eaa�(�ck"ip�c, eVclSbzipd0);
)	}
	�|:
		vetu�n$$his8
	}
}!;
�f}nction sooth �lom, �qr + 	retuRo jQ�arI.nodeNmmm(�le-, :table#	$?i(eloi.getEl�ieftsFy\agJ�-m#tro�Y+)[0] �|	dlam.apte�dChkld(el�-.wjer�OcUma�p.Czect�ElEmEnp("tboD{")(� :
		edem;
}
Zb�.ctok~ cloNeCopyDvent(mrIg, ret� 
	rap�I, 0{	rE|.each,fwnsp�n(- {
		mf+( p�i{.o.denamE !=5�(oRie�i� . m�igZi.joduName(�)${			ratu~.;
		}
		p�r OldLat`$-#j]qgr�.eatax oRiG[i�(} )$			curDct� � jAuery�$ata(0thi{,$old�Ata$)|
			events = oluDa4i .$ g�dData.eveotw;�	Ig ( �tej|S�!�z			dd�dt cur�au!.�bd`o;
	�	curaTa&gveN 8pr}+
y	�fo2$�r�r(Ty0� in$evenps - {
)fOv ( vaz hA~dler mN�AvdnT{
`type ] ) {				jqteBy.gveJ|.e$� �tiiw,�pypm, eva~p{&4yp� _Z,hantleb,� �vetS{ uhte![ h`nles ],da|Ap);			�
I}
	mu
	});
}

bUumRy.r`kLmF�agieNv � �u�C|Ih* iRoc< nod%{pq�ripuS")�{	w!r �rogmE~t� cakh�`rde��`hdzesu�t�$	Db�5 ~Odes ',nod�q_ _ ? nede{[�]�MwNobdo�umEndp|| nOdEsS�],'Dob�lgNt); �	//$~dy kacH� "S�ao� h!/$K�) svin�c�thA are ksso�i�pg$.iph |Ho m`i,*do#umelt
	/o ChoNin� op|ions |g{es thu s%lsp�$!qvAte, o-d�j't-C{chd0th�
+o IE,&pdoesn/T�diam op!the~ you �qt =rjea|.%or <embm$~ ehuMmn�s�ho i fragmEn
	�/"Amso,pTeBKIt �gec(Nt``�Ooe�"shocket#`atTrI�ttd� oN8a|aoeNnda� o $ol�p ca#he�if(( a�a.ne~fth$-==p0 "& |xpaob arsS0X -==� str)og2 f"$Av'�Rq\/Lmngpx < ?1� &&$doc 0==(Do�aeh| .&I!rocache.4eC� ``rgsK�X� "&& �jQugry�u�po"�,ch�bkoOn`�|| 'c`eakd.�`st( aBgc[0_ -	p)�qJ
s`�`ejle } u2ue;		cagh�p�sw,ub05 `Umy*fregmEnp�Z%ArgsZp] M;
)	�d+((ca`harEsults + {
�	Ihf ) cacheResul�s!!=�0 ) k
	�	Ifr!oent = cachermsults�
		}
	�y
	}
�if$()!�rcfm%nt  �{
		Fra�imnt = �gccReA�dLOk%md~pG2amdnt-);
�	zQuEri.blekn- �p�q, doc, dzagment,)c2ip�q$);
)}in � caceAbhe ) {
�	�Quer).f�`gMgNts[ igs�0] ] = cachmbusul�s-?,bragigNt : �;	}
��e}Urnr{ `{agm�nt2 zAwm�jt,)cchaabm%: cagheA�d� }+}�

bQ%eRy,frigmenps = {}{
bQ5mRy.eAcH({:�ptod�a: +apPen�"/
`re�enD^oz "prEpend2,
	mnsd�tBfora; &"efore ,
Inser�AgTer: +afd�r",
	re�d�ceAml: �rgpma�eWit(&
}, b}Nktion(*nkie,`lrighnal ) {
Ij�tmry.vn[ oame0\p< &uNspi'n( selea}k~ � {	var ret = [],
		)nserv = �Quesy( sdles4o24!,
		0ared| = this.Le.gpx == 1 �&$di)sR0]/@a2ej�Node;*	I	if (�`aren� &&�Pir�j�"nle�qpe!?`01 �&$@�puf|.khildNodm#.l�jgdi === 1 '&`inqgrt.|eneth ==< 1l)(::	iinserp[ omgilah!) thir__ )2J	zettrj tji�:
		
		t0dlSm {		for0(ptaR )`= 0, l = insert~h�notl i`< l; �#k / �I�	va{ el�m{ = (i <  !?qphis.cLoh�(ruEi : |hiS9.wat(+;*	M	jQuepy( Ior�pt[}%([ ormei
ql ], elum� -	)	)red"=pr�t/conaath elem� i;
		}
				reter..t�i�xush�t�ck(#put| o!oa� �ns%zt�s�lotnr �;	|�	}:
])9��u%zynexTe.d({�cm%an� �5nctaod8 glee�,`"o.texP� fReg�e�, sazipt{ ) {
I	�/nt�xt = oo�p�u }|�do#ueeft:

-	//p �on$mxt*create�`�moNt �ailw kf IE wIvh an evm� buv ze�urn vxp`�F%'ob�ecd'
		if`$T{p�gf conpe8tcbgataWhgmmh� �== #q�`uFkNm`" 9 {
		con}%zp�5 cot!xt�o.mr�os5m%np�|| kootux�K4) � �oodex�Z0M�/wj�p�Oc%o`nt || em�qm%nt;	�
	r�P�bed#<p[]+
vg� ( var � = 0(0a�em+/(�hu-+-)e�em3[)_)�!= nulh{ �++ ) �
�		)o � tXreod``l%m =4� �.}Mnd� 0)"k
			�el%o {< /+��
	i`0()!glei�) [J	�	�contaope
		}
�			/*�Aonezp�ht,m {tri�g"iop dm nkdes
M	if h ti}e@�eno �=� +spyj�",& �r�4m,.p�st(*ela� y + {
		�eloi�9 coNve�t�Cr%opeTe8tNo`e(�lem i1:
		h`a�3e ob0(�4y@ec� ele(<=- striod� / {
�)	/ Fix0"XHVA�"-stile0T�'s id  �,,b{o�rers
			ule- < el%o.d�l�#orx�t�lWag(  |$1.=/�2~"/

I	K	//*Prim whip�s�Ace/ �p�ezWoqe �NmexOf woow �'rK a expec4gd�	�		Var�ta',="(�pa'Oame.axEc($e|a� - |\8S�", . }![1].|kLc�ErCase ),				w2ap$=`uraxM�p[ tao ] |t�wr!sE�p�Olefaul�,
		9 d%p4n = �rcp[0},
				da� = konpex|.cp�ateElgment"dmv�!�

			�// G/ t i4m, a�` bick$ Ph!n veel`ff#extra(wrappers
	�	diwmnne�HTML � wrap[0} ; ele-`+�wvap[2Y�

				/� Oove�to the right deppx
			wHilg ( �eptl-- ) �
		KdiF#=!$ivn,esvC�al?
		y}
		�/ Remm�d�IM's �u�Oksarted$<vbod}>�&vc� tag,m �pagmeots
]			if ("kQuerq.cupyg�t�dboex ) K+
�	/ Wprin'*gcq�a0<vafl�>l *eay� have!rpqriou <t�/fY>
)	�	far0hacFodx09prt"oD�.t%s4,`}em)-
			�	tbod� � t!o �-= "tcbl`* &&0!hasBoDy �						d�V.&krstShild 6&0div.dirs4Child.�hkldF�`eS&:	I			// �dring`uaC-a(`qre <${dad> oR%<�fo/t	I			M	wrap�1_ =4= �<|blu>� //!x`sBod{ �
					�	ei~chyl�o$gs :�			K			�K_)	M	For0( vaR&j <0dbodynlungth - �3`J := p ; -%� ) {
		I	if  �b�umRy.�gd%OAmeh tbod{[`j ]- *trO�y" ) &$�!vbody[�j M/chi�dOles$l%o}`�(0{
			�	�	tbo`yYhJ!.parunwNode(r%o/vdChile(�p�odI[ k � �		)	�m)	i	}

				t*
			//0IE cm�plevelx kilms luading$w�itEspacu �heL inn�RLML1as usmd
	if ( !jQerh>quPport�lmal)�c�hy$espacd!& vh�aeio�hipe#xA�ente#u0dnem + + {
			idiv/)nbeb�BmFo"�( con}exp~bzideP�xtNoDe �bl%aDin�Wi	t�Py`mm(�b8amEm	{0} -, ip>fk{4Chihl -��		M
		 m,em =2`ko#jildNole�;
	}
�	ii&$0`l`�o/�%Tpp )a{		Ret~p3h(�alem )	
)} g,sd s				re`" j�tep}oe�G� -mp> �hmm,	�K
	9uJ
	i"  `rg-�dt + {
)�for-(�i`=!� rdtZiM; �*+ ) {
	if,`qsRi@|1�$� je�q>lodmN�m�(*RoT[i�( {crhpt" ) &&0(-ReD{h� tYre�p� {e�iU>ty`gtglGerC�r�() ?=} "tgt/�a�asc{ipp�)�)![J�	wCrixp.z5shh ze|iMnpibeN�Jo`g ? �$tZi]/`�ren}Node*rdoo~s`�,d( ret[i] - : re|[k]�(;			i]<%lsg {
	I	ag . rdt[i/n`ePy`m }<} = - { �				rat*slI�e�`p@m)h �e}(i � 3,!0}.cnnCaD(j�eeby,}ake�Bra�(re~[k]>getELoM�jtqB)\A�L�am(*Rcrip~"))i �;
			�	}			)fr`-o,�.apxendC(i`m(,2et[`] -+j)		-	i}		}
Z	Iretu~ rdt	} :	�l�`�Dedc* bunki�( aleos0)p{	�&ar $i4a�a�,*ccc�d�<)jQUery.gach�,:	�pe`�`� ? jQ�ezI.wd�p.pe�hed-
		`ulmtexpafdO-0h�qm2y.sqtpo"t.de�a|EEx�`�do;i	 fr x �`v i = �$�Enem9`(elom`-�doemS[h})$= ntll; m+� y {
			i� ( elem�jode�ie &&(Jquery.oodata[om.ncl%N!�e�too7er�a{E()� i {
		)	clotiNue�
		]

�		id = �deM_ zP�`z/%xpqneO ;
	 	
	Ii� ( idb)`{.		�`�ta = cachmK!id :	I				if0($dedi �&`daTe�pe`�S")�z				fm� ( vAr �qx i� da|a.vent{ + {					if� "re�iah[ |y�e�U()({					zPuer.Evanp.Reore(%%m%m  p{Pe )3�
			�	} e,�%�z
 			jQ}ezy>r�do6uve~t- m,ee� t	{e, da|a.h�n�lg )+	)		}
				}
)}
	)� 	i� ( mel%teuxpanDo ) {
				dmlod� elem[ jAuezi/ezp�Jd/!]{

		= dlse k& (``nem.removeAt�ri`wm i {
			ielem.remjv`C4ty`�4e( jQu�p}.mx�ando ;;�		]			I
			delete-c�che[ k \{
		})=	}
}(; funcp�kn m6qhSavAxT( i,(eoem ) {
	If � gLem.srb$	�k*	Ihqu}R{.ab�h(+�		rm:pe|em{rc,
	�	abyd�0,faLsa,
		$�t�Pype* "�csiqd2
		)?i| elce {
		nA}$�y>blobAmAv`l($Elam.t%yd0|| eLem.pextCont`np$|| �h�m/innerhTML(� "",	;
)|Z
If ( ele-.@�renvNodm � {
	�l�m.0a�ntFo$�,rd�o�eKHih�((Elem )9
	}
}

 
var rampiA`= %alxHaX�S�)_*|!/i,
	ropacit} � ?o~!cIup= _)]:)/,	rD�shA�Pja09`/m([a-z�)/io,	rupp%r � ?([A-R])/g-
	r~umpy ? �X�\d+(�8�X+/&%y$J	s.wi�<�'^)?Pd/,
	grsS�ow ? { pO{Iui�`: "afrluDm"- v!�i�I|a�x: +hi`t`n"> da�p�ay*$ rH�#o$|�
ICscWadth = [ 2Le&�". �Ri'in ](�	kswH�ight = � 2op#,`"�gt$om" ],
	curC�@/
	�etCom{u�adCtYne,
	cuve�TStylm,�
	fo`oelB�Ce = �unCwio*� a|#l�dtEr ) {
		sewU�jtlg4}e�.�o]0qa�AqSg()9*	}+

kQ�dvy�fn sq� = gt~atIo&) �a}%, ~a�t� ) {
.o We}p�n� '%nd�FiNo$' �q�A$.o%op
of!(�ar'}-eltp�le&�p� �-= 7 v"06ie05�) En`ef�m$)0a
		Rgpup~ }(iR�
�=
r�t�Rn jPud�i.aga�p�(,$hh�,�cmg,�rilu%, tr�`. ~t�at)on( el�m, na}a, alpu 9 
	rat%{n"val�e/==�u�dgfmfe`p?		jP�erI/rty|E- m`ual oaoe, vaoUe 9 z
	/jQueR}.css(�el!m$1D�mm +9z�	?
}9

�Q}Erh.a�4eld(�
	// A`e �."8ld``ro~`�py noa� nOv operrifInf0tx dgf�q|t	/.0b�`aok� of Gep�i~F and�aettinc``�s|Yla�p�ErtyCsSLgoks2'K
	O�agitaz �
	gep� nuocti�n- ehudm cmp�t�d  x�			io 8 sm`ut�`p)'{
	II	//*Ve sHo%�`�a�Gay{ ga� c nQ}b�B%bac{ fro!e�aciuI			v!r �a� = gt�CSC) gh�a, .o|ashtY#,  �p�CmTy (!;
		9re4}rn ra� =-= �" ?%5" :`Ret?
j			m else {
		re4ur� �lme.style.oracity;
	Y	�
		}j		=
	},

�// Gx�hudo uhe f/l,owing c3s pp�pgrti�r to adt px
	cs�Numj%r8 {�~I�dex"*"trqe,
		"�mntW%iehpb:"tu�,�		"op�ci4y"; �pu,
		rz�oo": true,
	"h�ngHei�ht"> vrua
	}
	// Af if proxe�ti% whos� oames yo} wish`4o fi� bEn/zej	/!cet�ing"n~ gd�ti.o �he ~alqe�cscZr�pw,k
�'? ni�lizm oloat kC{ proPeruy�		"f,oa�"� jAud�y.C}pqj�t>#w#F`oat ? #ass�loav �:�"s4yh�D�oed#
	u,

	/!0G�` an`0s�!dla0s�ile&p�ix%z4y on4a#OI Node
	ruxle: nu�btio.) �lem, namd, valte, dxTra�)8k
		-/ �on'~ {et {ty`es oo text`!nd com�enT`n�`�3
	ag h !%nem �\ Emem,n/me\qpe`==-+3 l| elei.do$eType ==} 9 |x�!elme.r�yl")�{�		{etqrN;
�
�		// �ake(sur� �(c se&re gorkan&gkt� tHe vight nAodJ6ir ret, origNa�e !jQqe2y.camelCaSg( lame -,
	i	{tyhe } mlelnqtyme, ho�cw = zQ�ery.as1Hok{[ o�ioNeme �+
	nam%#=)`�terycpsPr.vs[ opiOamd Y | orieNao%;

	I// Ch�ck if(w�%�e"smtti�G$a value
		a� ( vanqe 1== uj�a�ined ) {
			/� Make$sup� thap�NqN4And(null ~a}Ues azen'� wet. See; '�!�0			if�("pyp�ov wamue �8= "n�m�es" � iqN!N�valu%!	 t~ vAoDe ==-.ul~ � {
	)	�a|Ur.�
I	}
){-/ If0a�nwMcEr �a{ pA�s�d In�A�`(p8g uc!Dh%�(upcep`b�r!Ce2t`ih(CW�p�mxErdyas 			if0(-ypeg� v`lu� =<= *n�mbes$� !`UUeR�.�ssumbe�X,OrIgJ�mm ] � {			valum +`"pp/;		}

			�/ If c �o�a-ic0prjile�$�u{E<Txa� vam�( iuhe2w`�a/Ju� �eu }h� spe�ydt ~amue
	io x !hoOoS�|| !*set� m+hoakq- |<0(�aoEe = hmok{.�et((ElEm 0viLuE (� - �h�`gin%d ) {
	)/&�GrApp�d do �revm| IE�from t`�kioG�errow whej/'knvalhn,"alues are p`oVid�d
		/? �ayes rpw #5=9�			vRy { �	�	�stqme[ n`me !�ral}E?
I	i	} ka|ch m)*{} i		-

} eL{Epz	//`A� u ioi0qeC(Prm�hdel odt |He nc�-comp}ted�alue�from ther�
	�hv . kooks '*�`u  )o hma && (re| = ho�)s.g%t  amem,pfalse, �xtpa ))0!=4lendeBijed%	`s*		R�`upn zet9J	}
* 		/)Ot`�pi�e j�st get the ~�ue nBom0the$txld0of*eC� �rgt�r� {t}LeKpnkme �3 m�	}(

C{s: �unC|	on( geml naoe, �x�ri ) {
	//�Mqh� {ure$th`u we'pe w/vki`� wiuH`th`$ixp�nmmm
	�ar ret(`krigNam� = kQudry.CaMelC`sa( �a}`0)-
			hoOks 8�jQue�*cq{HoOks[ o2iGN`oe ];
JInmme } �Pu%ry.c�sXrop�Z`OvigName ] |\ crigNaMe3�	//�I� a hOoa�ti( rnwieed gdt uhm compuTe$ vah}%/�fm |Here 	if ( hokS$&& �get* in4hook && )ReT�9 hookS�gep( elem< tRuE, ux|2a �) !==*ndefine$`( s			re�prN"b�t;
	� OtiErwise,!in � �ay |Op`�p ti%"coipuw%� ~aoue �x�stc- �pe uaT|,emc� if(()CurCRS = {
YRetupn kzCSP( mlmm< �aoE, ori'Naoe );
		}
	q<
	/ @�detko� f`s q5ickly sWapphog)In#ou| CCS proper�i�q `o ge� k/sr�c� cAlulapkons
	s4kp> �una~ionh ehg- op�ions,0callback 9 {
		var old = {y?
�	�// Reoem`er Tie0o|d,Vi,�es,"anDxa~smr| t`e n%w ofes		For  <far`hame i.pipp}OnS�)�z			od�[)na-e � ? elem~stlE[ ~ame(]{
	eme�*�pLm[ jame _ = op�)onsQ0`mme ];
	m

		�allc!ck.calm( eleo -)Z
)	// Ru6er| |(e old w!lqes	For ( .aMe in$Ot4ibnr$	-{
 )elmm�s�yl%[ name!](pcl`[ na}d ]?
	}	},

	camdlCas}2�dncTion(2stRyng - {I�evu{�r�riNgreplae(�r�ashQLpha,)fcAmelCism 9:�	}
}){
./ DEpRECCeD� Use nPue�x.#s8) hns}EedJjQug2y*curCSS =�hSumry.cs3;

j�q�Rye`ch(["hmiw`t- *u�d�H"], �u�cviod8 y, .gm� � {
	bqtegrsH�/kS[ n`md*]!=�q		gotz vEnauh�d� g,em� �oo`utu`, g8tr� 9 {
Ip�2'Vel�
Z		kf(( coMpq�ee � {
�	m	iF%(�a�%m,of�setWiet� !-= 1 9 �
O			pah ="e�t�H/ eleml ~aoe, eXtre )3�
			} else(z�			jQu`�i/cap( emem,�CsWHos< fnc|ho.x)$j
	9Y		il�<�gm4WH� eLg-, n`me, gp�ru -+I�	}	;
		)	}	�	in ( �al ==/00) {	���al = �5�C[C) �h�-. n`}e, name�!�
		ii&  (v�L�-=%#"0`x"(&/ ct�beNuStx� )${	�			p�h8)#}r�e�tS4}h�((%mem,!l�-m, d�i� )+
�	�

 I I	of(  vi,"!= �d|,!)({�	�		+o Shoel`0r�4}2n "au4o" inr�em$k� �,"ewe�0`o			�	/ te}`orip� j!kK`r`s-cOmpatj			IpeTurn va� =-= " �~ wa� �? *aupo-# �px"!:$p�l;
				i|�			y*
I			o`�(pVol&$�0`\~ va| �= whl ) {
	I	)vg,!<pa�%m.spyhe[!Nam� ]

			)/ Sh�t�d*Ret�r� .Auto �inSv`�d`gg 4,pu�e$0%dop�			/+�tgmqn�a�y$i`{t�"lC-b�l�a~
	�	�rgturn �al =<} b"%\~ val =-? 2audo"$� 0p|"*:`p�l;
		}
	)	)pewRo tppeo.pel0==-& �pring" � �!m : �al / &p� ;
		y�)}<

	)s�T> nu�ction( ed�e, valqe ) 			)g * rnum�h.tert((value )!)&q�			// �g�ore*nugati6g wi�tj afd h%klt v�,uEs #1589
		�valuo = pArseF|e�t+vel�e);
		yf&( v�lue(>= p � 
			Iredwpn valUe ; �px";
�	I	}
			� else {*			)rupurn walu�;J		}
		}};
�);
if ( )jSuepysUsport.opgaity + {
�jQ5ory,cr�Ho/kqnopAcity�=`	c�tz nunbtioN( gl�m| comput�d() {�	�	/(IE ucec biltezC.bor0ouAkity�			{a�urn(BoP�city.uesp((gomp�t�d && �,eM.cur�e~4[$y`u ? elem�auBrent�tyle&ni�t�b : e|e}.s4}le&�)ltep) |!&)09
			(par3mofat�Re'Oxp.$!) / q0�)(+  b �
			�omputgd`?("1" 0  b;
		}�		cmt: �un#vioh8 olea, vam5e ) {
			var�s|yle�5�%n%m&style
		�// KA haS-tzmu`l%+gkth opccoty i& I doeSbnot!`�ve mayi�t
		?/�FoRke0it jy"r�pt)og$t�e zoom �ev%n
	r�yle.zokm = 33�
�	/ Set tHg alpHa filtur 4o se� the �p�Cidy
			viR$opacity = h�umry*isnaOvaluu) 
				"" :
		"alpha(racity�" +%v�l�e%
(000`++")"�
�		fi�t�r"= rtxld/filtar }|  b1J
		rty�e.fih�er = ralp�a/tmqt(filderi ?
				�alter.rep|ag%*p�hpha n�aciu9) :
				�tylefiltur�+4 ' #�ox!ki�q;
		}
	}�
}

if ( e/guaehtdef`�lvRi!� 6&)$ocuientlefa�huVi�*gavo�utaduyleb)$[�	gdtComx5�e�Sul% )�b}Nkt�on($emem("lmGOAma< nAmE )�y
		V�r�reT, �Av`u,tidw(!Cop4�`eStla{	nade = oa�d�pmPlace( zepper< 'd1" �.voLowe�CeCm(i;j		mF  ! ,Def�ulpW	ega=0dlEoow~ezo�ienu.nfa�l}Fi%w)0	%{
		ravEsn�un`efkf�D� 		}
Z	ho ( 8bomx|EtQ�yne!"`ebiuo4�`es.geDCgmputmd�tyhe(�|d},,nuLn )!())[Z 	ret } cOmP}4�d�tyo.gatPzoxert�RcLwe( �amE+);			If ( re| == � $g !h�pgry.ce~tiinS( el�M.O�f�rNmgemant.do#ue�ltEmEoa�t, eLemp!!)�J	I	bed =`h[umy.style(`aleo,).�e� -		 }		}
	rg4}~ �%|;
	}9
q
mf�( docmeht&dOcu}antMle-eft.cU~r�ftQtyn! (`z	c5vpejtC||e !,funcpion()%|a}(=NiMe � {
	var mefD, �sNEgt,
IreD -�elemsurrg.}C�xla&$/ ulem.C}Rsd~t�$yleYpb}me ] 
		{tyl� ? e,ei.suyle{

	// �rom dhe0`w`wom%0habk cI`@e`n E�ards
		?/`htTv:/"eriK/eae.Net/!�bxives/2006/?�3/1<
?>15/'Comment-4�0�

	/ �d+wu�a`no4$�a|ing�uyph a zE�p�az t)xal nmb�rJ	// bqt i oUmb�p�t�At �as c wamre unding- we�h�ed unpcobv%rph� to!P}x�ds
	ib`($!rnul�p/tmSt(�peT ) && rjum�turu( ret ( 	 {	�	// �heibez �he o2igincl Vaues	left = styl�*lEnt;
I	rsLeft = elee>runtIme�tyle�eft;
		/.(Pud�i~ uHe ndw walespto oet a oom`�t�d)Fal�a d}d
			�lemo2�n�imeStyle.meft�=`ammcprpeNtS�yla.eft;Z			stylu.l%f4�9`fime =5= +fo.tRiZm"(? "1`o *�(rat ~|�)1			ret = dyhe.p)xe|Debt + �px ;
	) //ReFept uhm �halgd v`lumc			stylm|a�t =$Left		ed�d.ntame[tyle.�egT"- rsLeF~;
		|

		retuzN%ret�==!� ? #auto" 8 rgT;
)};
}

c�rKSS = ge|Com�u�edC|yle�|| currejuvle;
Functimn o%�GH()ele�(`namm,�extza!)p{Jar �hych = ~a�e ===  wimtm"�; a{s_idtx : cssHehght,Jivcl%-pfaee ?= bwi$th6 ? eLeMnfv`etWid�h$: %|em*oFnSetH`igh$;
	iF ( a�tra!===p"�Order" ) {
	revurn�rqd?
	}:IBQUoRy.ea�h( whyal, Fujctoon(+ �		i& (�!ex|ra ) {
	Ival(-= p �smFlo�p(jQueby*�ss$Elem,!"qatding$0piis )) p| 0;
	�|�
	kf   exTz�1=9(oargin' - {		6ah�!} pars}F|nct,JQaery.cSs �enem,` m`rgin" k |Hi#p!) |$0{
J		} Else {
	9vad(-� pa�seFnoat(jQ5ery(�cs($d|a�,&"gOrder& + this$+)Wi�ti#)) ||` ;
)	}
});
r%tuvn`vql;
}
if , nQuery/%zp� �(jQq�r�ghrr.filu%~s�(�{
	nQueri.%|pr.�i|4gp�.hhlDel(5(&u.ction(%lem � {
		�a� widtx = e,ee�if&s%|Py`�(/
	h�ighv = ehm.ofds$�ea�ht;
	�a�rn#(�it$h =<� 0 && (ei�ht === �) || �!�Awevq.suptozt�peLiafleHidd%n�fsets(&� (%neo*st�lm.daspla} ||`jq%mR{.�rs((el`}$ dhsp|ay""(+ �� *.oj� )	};*	jQEor�.ex|r.bid�evS.piqiBle)=�b�nkTik�("Enem 9 �
	{a�u�n"!n@�%rI/eyp�,v	ndeps,hifdgl� �,mm&)�
	-;}
�J
was zs� = oQue�).Noq8(l
	wcri�d!-,-�q{i0}T�[^<]*,:�(?!<\/rcp�`t>)<�Z�*)*<\/script>/gi,
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

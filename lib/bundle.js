(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.6.0
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright OpenJS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2021-03-02T17:08Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

		// Support: Chrome <=57, Firefox <=52
		// In some browsers, typeof returns "function" for HTML <object> elements
		// (i.e., `typeof document.createElement( "object" ) === "function"`).
		// We don't want to classify *any* DOM node as a function.
		// Support: QtWeb <=3.8.5, WebKit <=534.34, wkhtmltopdf tool <=0.12.5
		// Plus for old WebKit, typeof returns "function" for HTML collections
		// (e.g., `typeof document.getElementsByTagName("div") === "function"`). (gh-4756)
		return typeof obj === "function" && typeof obj.nodeType !== "number" &&
			typeof obj.item !== "function";
	};


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.6.0",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

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

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
						[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
	function( _i, name ) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.6
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2021-02-16
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem && elem.namespaceURI,
		docElem = elem && ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

	return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

}
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the primary Deferred
			primary = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						primary.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, primary.done( updateFunc( i ) ).resolve, primary.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( primary.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return primary.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), primary.reject );
		}

		return primary.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
						value :
						value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
				dataPriv.get( this, "events" ) || Object.create( null )
			)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
						return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
						return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();

						// Support: Chrome 86+
						// In Chrome, if an element having a focusout handler is blurred by
						// clicking outside of it, it invokes the handler synchronously. If
						// that handler calls `.remove()` on the element, the data is cleared,
						// leaving `result` undefined. We need to guard against this.
						return result && result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,
	which: true
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		// Suppress native focus or blur as it's already being fired
		// in leverageNative.
		_default: function() {
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		//
		// Support: Firefox 70+
		// Only Firefox includes border widths
		// in computed dimensions. (gh-4529)
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px;border-collapse:separate";
				tr.style.cssText = "border:1px solid";

				// Support: Chrome 86+
				// Height set through cssText does not get applied.
				// Computed height then comes back as 0.
				tr.style.height = "1px";
				trChild.style.height = "9px";

				// Support: Android 8 Chrome 86+
				// In our bodyBackground.html iframe,
				// display for all div elements is set to "inline",
				// which causes a problem only in Android 8 Chrome 86.
				// Ensuring the div is display: block
				// gets around this issue.
				trChild.style.display = "block";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = ( parseInt( trStyle.height, 10 ) +
					parseInt( trStyle.borderTopWidth, 10 ) +
					parseInt( trStyle.borderBottomWidth, 10 ) ) === tr.offsetHeight;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
					swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, dimension, extra );
					} ) :
					getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
			) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
				jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

				/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
					animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};

		doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
							"" :
							dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || Object.create( null ) )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, parserErrorElem;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {}

	parserErrorElem = xml && xml.getElementsByTagName( "parsererror" )[ 0 ];
	if ( !xml || parserErrorElem ) {
		jQuery.error( "Invalid XML: " + (
			parserErrorElem ?
				jQuery.map( parserErrorElem.childNodes, function( el ) {
					return el.textContent;
				} ).join( "\n" ) :
				data
		) );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} ).filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} ).map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );

originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script but not if jsonp
			if ( !isSuccess &&
				jQuery.inArray( "script", s.dataTypes ) > -1 &&
				jQuery.inArray( "json", s.dataTypes ) < 0 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( {
		padding: "inner" + name,
		content: type,
		"": "outer" + name
	}, function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each(
	( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	}
);




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],2:[function(require,module,exports){
!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.Raphael=e():t.Raphael=e()}(window,function(){return function(t){var e={};function r(i){if(e[i])return e[i].exports;var n=e[i]={i:i,l:!1,exports:{}};return t[i].call(n.exports,n,n.exports,r),n.l=!0,n.exports}return r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:i})},r.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(r.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var n in t)r.d(i,n,function(e){return t[e]}.bind(null,n));return i},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=1)}([function(t,e,r){var i,n;i=[r(2)],void 0===(n=function(t){function e(i){if(e.is(i,"function"))return r?i():t.on("raphael.DOMload",i);if(e.is(i,A))return e._engine.create[c](e,i.splice(0,3+e.is(i[0],T))).add(i);var n=Array.prototype.slice.call(arguments,0);if(e.is(n[n.length-1],"function")){var a=n.pop();return r?a.call(e._engine.create[c](e,n)):t.on("raphael.DOMload",function(){a.call(e._engine.create[c](e,n))})}return e._engine.create[c](e,arguments)}e.version="2.3.0",e.eve=t;var r,i,n=/[, ]+/,a={circle:1,rect:1,path:1,ellipse:1,text:1,image:1},s=/\{(\d+)\}/g,o="hasOwnProperty",l={doc:document,win:window},h={was:Object.prototype[o].call(l.win,"Raphael"),is:l.win.Raphael},u=function(){this.ca=this.customAttributes={}},c="apply",f="concat",p="ontouchstart"in window||window.TouchEvent||window.DocumentTouch&&document instanceof DocumentTouch,d="",g=" ",x=String,v="split",y="click dblclick mousedown mousemove mouseout mouseover mouseup touchstart touchmove touchend touchcancel"[v](g),m={mousedown:"touchstart",mousemove:"touchmove",mouseup:"touchend"},b=x.prototype.toLowerCase,_=Math,w=_.max,k=_.min,B=_.abs,C=_.pow,S=_.PI,T="number",A="array",M=Object.prototype.toString,E=(e._ISURL=/^url\(['"]?(.+?)['"]?\)$/i,/^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?)%?\s*\))\s*$/i),N={NaN:1,Infinity:1,"-Infinity":1},L=/^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,P=_.round,z=parseFloat,F=parseInt,R=x.prototype.toUpperCase,j=e._availableAttrs={"arrow-end":"none","arrow-start":"none",blur:0,"clip-rect":"0 0 1e9 1e9",cursor:"default",cx:0,cy:0,fill:"#fff","fill-opacity":1,font:'10px "Arial"',"font-family":'"Arial"',"font-size":"10","font-style":"normal","font-weight":400,gradient:0,height:0,href:"http://raphaeljs.com/","letter-spacing":0,opacity:1,path:"M0,0",r:0,rx:0,ry:0,src:"",stroke:"#000","stroke-dasharray":"","stroke-linecap":"butt","stroke-linejoin":"butt","stroke-miterlimit":0,"stroke-opacity":1,"stroke-width":1,target:"_blank","text-anchor":"middle",title:"Raphael",transform:"",width:0,x:0,y:0,class:""},I=e._availableAnimAttrs={blur:T,"clip-rect":"csv",cx:T,cy:T,fill:"colour","fill-opacity":T,"font-size":T,height:T,opacity:T,path:"path",r:T,rx:T,ry:T,stroke:"colour","stroke-opacity":T,"stroke-width":T,transform:"transform",width:T,x:T,y:T},D=/[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/,q={hs:1,rg:1},O=/,?([achlmqrstvxz]),?/gi,V=/([achlmrqstvz])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,W=/([rstm])[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*)+)/gi,Y=/(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,?[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*/gi,G=(e._radial_gradient=/^r(?:\(([^,]+?)[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*,[\x09\x0a\x0b\x0c\x0d\x20\xa0\u1680\u180e\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u202f\u205f\u3000\u2028\u2029]*([^\)]+?)\))?/,{}),H=function(t,e){return z(t)-z(e)},X=function(t){return t},U=e._rectPath=function(t,e,r,i,n){return n?[["M",t+n,e],["l",r-2*n,0],["a",n,n,0,0,1,n,n],["l",0,i-2*n],["a",n,n,0,0,1,-n,n],["l",2*n-r,0],["a",n,n,0,0,1,-n,-n],["l",0,2*n-i],["a",n,n,0,0,1,n,-n],["z"]]:[["M",t,e],["l",r,0],["l",0,i],["l",-r,0],["z"]]},$=function(t,e,r,i){return null==i&&(i=r),[["M",t,e],["m",0,-i],["a",r,i,0,1,1,0,2*i],["a",r,i,0,1,1,0,-2*i],["z"]]},Z=e._getPath={path:function(t){return t.attr("path")},circle:function(t){var e=t.attrs;return $(e.cx,e.cy,e.r)},ellipse:function(t){var e=t.attrs;return $(e.cx,e.cy,e.rx,e.ry)},rect:function(t){var e=t.attrs;return U(e.x,e.y,e.width,e.height,e.r)},image:function(t){var e=t.attrs;return U(e.x,e.y,e.width,e.height)},text:function(t){var e=t._getBBox();return U(e.x,e.y,e.width,e.height)},set:function(t){var e=t._getBBox();return U(e.x,e.y,e.width,e.height)}},Q=e.mapPath=function(t,e){if(!e)return t;var r,i,n,a,s,o,l;for(n=0,s=(t=Tt(t)).length;n<s;n++)for(a=1,o=(l=t[n]).length;a<o;a+=2)r=e.x(l[a],l[a+1]),i=e.y(l[a],l[a+1]),l[a]=r,l[a+1]=i;return t};if(e._g=l,e.type=l.win.SVGAngle||l.doc.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure","1.1")?"SVG":"VML","VML"==e.type){var J,K=l.doc.createElement("div");if(K.innerHTML='<v:shape adj="1"/>',(J=K.firstChild).style.behavior="url(#default#VML)",!J||"object"!=typeof J.adj)return e.type=d;K=null}function tt(t){if("function"==typeof t||Object(t)!==t)return t;var e=new t.constructor;for(var r in t)t[o](r)&&(e[r]=tt(t[r]));return e}e.svg=!(e.vml="VML"==e.type),e._Paper=u,e.fn=i=u.prototype=e.prototype,e._id=0,e.is=function(t,e){return"finite"==(e=b.call(e))?!N[o](+t):"array"==e?t instanceof Array:"null"==e&&null===t||e==typeof t&&null!==t||"object"==e&&t===Object(t)||"array"==e&&Array.isArray&&Array.isArray(t)||M.call(t).slice(8,-1).toLowerCase()==e},e.angle=function(t,r,i,n,a,s){if(null==a){var o=t-i,l=r-n;return o||l?(180+180*_.atan2(-l,-o)/S+360)%360:0}return e.angle(t,r,a,s)-e.angle(i,n,a,s)},e.rad=function(t){return t%360*S/180},e.deg=function(t){return Math.round(180*t/S%360*1e3)/1e3},e.snapTo=function(t,r,i){if(i=e.is(i,"finite")?i:10,e.is(t,A)){for(var n=t.length;n--;)if(B(t[n]-r)<=i)return t[n]}else{var a=r%(t=+t);if(a<i)return r-a;if(a>t-i)return r-a+t}return r};var et,rt;e.createUUID=(et=/[xy]/g,rt=function(t){var e=16*_.random()|0;return("x"==t?e:3&e|8).toString(16)},function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(et,rt).toUpperCase()});e.setWindow=function(r){t("raphael.setWindow",e,l.win,r),l.win=r,l.doc=l.win.document,e._engine.initWin&&e._engine.initWin(l.win)};var it=function(t){if(e.vml){var r,i=/^\s+|\s+$/g;try{var n=new ActiveXObject("htmlfile");n.write("<body>"),n.close(),r=n.body}catch(t){r=createPopup().document.body}var a=r.createTextRange();it=ht(function(t){try{r.style.color=x(t).replace(i,d);var e=a.queryCommandValue("ForeColor");return"#"+("000000"+(e=(255&e)<<16|65280&e|(16711680&e)>>>16).toString(16)).slice(-6)}catch(t){return"none"}})}else{var s=l.doc.createElement("i");s.title="Raphaël Colour Picker",s.style.display="none",l.doc.body.appendChild(s),it=ht(function(t){return s.style.color=t,l.doc.defaultView.getComputedStyle(s,d).getPropertyValue("color")})}return it(t)},nt=function(){return"hsb("+[this.h,this.s,this.b]+")"},at=function(){return"hsl("+[this.h,this.s,this.l]+")"},st=function(){return this.hex},ot=function(t,r,i){if(null==r&&e.is(t,"object")&&"r"in t&&"g"in t&&"b"in t&&(i=t.b,r=t.g,t=t.r),null==r&&e.is(t,"string")){var n=e.getRGB(t);t=n.r,r=n.g,i=n.b}return(t>1||r>1||i>1)&&(t/=255,r/=255,i/=255),[t,r,i]},lt=function(t,r,i,n){var a={r:t*=255,g:r*=255,b:i*=255,hex:e.rgb(t,r,i),toString:st};return e.is(n,"finite")&&(a.opacity=n),a};function ht(t,e,r){return function i(){var n=Array.prototype.slice.call(arguments,0),a=n.join("␀"),s=i.cache=i.cache||{},l=i.count=i.count||[];return s[o](a)?(function(t,e){for(var r=0,i=t.length;r<i;r++)if(t[r]===e)return t.push(t.splice(r,1)[0])}(l,a),r?r(s[a]):s[a]):(l.length>=1e3&&delete s[l.shift()],l.push(a),s[a]=t[c](e,n),r?r(s[a]):s[a])}}e.color=function(t){var r;return e.is(t,"object")&&"h"in t&&"s"in t&&"b"in t?(r=e.hsb2rgb(t),t.r=r.r,t.g=r.g,t.b=r.b,t.hex=r.hex):e.is(t,"object")&&"h"in t&&"s"in t&&"l"in t?(r=e.hsl2rgb(t),t.r=r.r,t.g=r.g,t.b=r.b,t.hex=r.hex):(e.is(t,"string")&&(t=e.getRGB(t)),e.is(t,"object")&&"r"in t&&"g"in t&&"b"in t?(r=e.rgb2hsl(t),t.h=r.h,t.s=r.s,t.l=r.l,r=e.rgb2hsb(t),t.v=r.b):(t={hex:"none"}).r=t.g=t.b=t.h=t.s=t.v=t.l=-1),t.toString=st,t},e.hsb2rgb=function(t,e,r,i){var n,a,s,o,l;return this.is(t,"object")&&"h"in t&&"s"in t&&"b"in t&&(r=t.b,e=t.s,i=t.o,t=t.h),o=(l=r*e)*(1-B((t=(t*=360)%360/60)%2-1)),n=a=s=r-l,lt(n+=[l,o,0,0,o,l][t=~~t],a+=[o,l,l,o,0,0][t],s+=[0,0,o,l,l,o][t],i)},e.hsl2rgb=function(t,e,r,i){var n,a,s,o,l;return this.is(t,"object")&&"h"in t&&"s"in t&&"l"in t&&(r=t.l,e=t.s,t=t.h),(t>1||e>1||r>1)&&(t/=360,e/=100,r/=100),o=(l=2*e*(r<.5?r:1-r))*(1-B((t=(t*=360)%360/60)%2-1)),n=a=s=r-l/2,lt(n+=[l,o,0,0,o,l][t=~~t],a+=[o,l,l,o,0,0][t],s+=[0,0,o,l,l,o][t],i)},e.rgb2hsb=function(t,e,r){var i,n;return t=(r=ot(t,e,r))[0],e=r[1],r=r[2],{h:((0==(n=(i=w(t,e,r))-k(t,e,r))?null:i==t?(e-r)/n:i==e?(r-t)/n+2:(t-e)/n+4)+360)%6*60/360,s:0==n?0:n/i,b:i,toString:nt}},e.rgb2hsl=function(t,e,r){var i,n,a,s;return t=(r=ot(t,e,r))[0],e=r[1],r=r[2],i=((n=w(t,e,r))+(a=k(t,e,r)))/2,{h:((0==(s=n-a)?null:n==t?(e-r)/s:n==e?(r-t)/s+2:(t-e)/s+4)+360)%6*60/360,s:0==s?0:i<.5?s/(2*i):s/(2-2*i),l:i,toString:at}},e._path2string=function(){return this.join(",").replace(O,"$1")};e._preload=function(t,e){var r=l.doc.createElement("img");r.style.cssText="position:absolute;left:-9999em;top:-9999em",r.onload=function(){e.call(this),this.onload=null,l.doc.body.removeChild(this)},r.onerror=function(){l.doc.body.removeChild(this)},l.doc.body.appendChild(r),r.src=t};function ut(){return this.hex}function ct(t,e){for(var r=[],i=0,n=t.length;n-2*!e>i;i+=2){var a=[{x:+t[i-2],y:+t[i-1]},{x:+t[i],y:+t[i+1]},{x:+t[i+2],y:+t[i+3]},{x:+t[i+4],y:+t[i+5]}];e?i?n-4==i?a[3]={x:+t[0],y:+t[1]}:n-2==i&&(a[2]={x:+t[0],y:+t[1]},a[3]={x:+t[2],y:+t[3]}):a[0]={x:+t[n-2],y:+t[n-1]}:n-4==i?a[3]=a[2]:i||(a[0]={x:+t[i],y:+t[i+1]}),r.push(["C",(-a[0].x+6*a[1].x+a[2].x)/6,(-a[0].y+6*a[1].y+a[2].y)/6,(a[1].x+6*a[2].x-a[3].x)/6,(a[1].y+6*a[2].y-a[3].y)/6,a[2].x,a[2].y])}return r}e.getRGB=ht(function(t){if(!t||(t=x(t)).indexOf("-")+1)return{r:-1,g:-1,b:-1,hex:"none",error:1,toString:ut};if("none"==t)return{r:-1,g:-1,b:-1,hex:"none",toString:ut};!q[o](t.toLowerCase().substring(0,2))&&"#"!=t.charAt()&&(t=it(t));var r,i,n,a,s,l,h=t.match(E);return h?(h[2]&&(n=F(h[2].substring(5),16),i=F(h[2].substring(3,5),16),r=F(h[2].substring(1,3),16)),h[3]&&(n=F((s=h[3].charAt(3))+s,16),i=F((s=h[3].charAt(2))+s,16),r=F((s=h[3].charAt(1))+s,16)),h[4]&&(l=h[4][v](D),r=z(l[0]),"%"==l[0].slice(-1)&&(r*=2.55),i=z(l[1]),"%"==l[1].slice(-1)&&(i*=2.55),n=z(l[2]),"%"==l[2].slice(-1)&&(n*=2.55),"rgba"==h[1].toLowerCase().slice(0,4)&&(a=z(l[3])),l[3]&&"%"==l[3].slice(-1)&&(a/=100)),h[5]?(l=h[5][v](D),r=z(l[0]),"%"==l[0].slice(-1)&&(r*=2.55),i=z(l[1]),"%"==l[1].slice(-1)&&(i*=2.55),n=z(l[2]),"%"==l[2].slice(-1)&&(n*=2.55),("deg"==l[0].slice(-3)||"°"==l[0].slice(-1))&&(r/=360),"hsba"==h[1].toLowerCase().slice(0,4)&&(a=z(l[3])),l[3]&&"%"==l[3].slice(-1)&&(a/=100),e.hsb2rgb(r,i,n,a)):h[6]?(l=h[6][v](D),r=z(l[0]),"%"==l[0].slice(-1)&&(r*=2.55),i=z(l[1]),"%"==l[1].slice(-1)&&(i*=2.55),n=z(l[2]),"%"==l[2].slice(-1)&&(n*=2.55),("deg"==l[0].slice(-3)||"°"==l[0].slice(-1))&&(r/=360),"hsla"==h[1].toLowerCase().slice(0,4)&&(a=z(l[3])),l[3]&&"%"==l[3].slice(-1)&&(a/=100),e.hsl2rgb(r,i,n,a)):((h={r:r,g:i,b:n,toString:ut}).hex="#"+(16777216|n|i<<8|r<<16).toString(16).slice(1),e.is(a,"finite")&&(h.opacity=a),h)):{r:-1,g:-1,b:-1,hex:"none",error:1,toString:ut}},e),e.hsb=ht(function(t,r,i){return e.hsb2rgb(t,r,i).hex}),e.hsl=ht(function(t,r,i){return e.hsl2rgb(t,r,i).hex}),e.rgb=ht(function(t,e,r){function i(t){return t+.5|0}return"#"+(16777216|i(r)|i(e)<<8|i(t)<<16).toString(16).slice(1)}),e.getColor=function(t){var e=this.getColor.start=this.getColor.start||{h:0,s:1,b:t||.75},r=this.hsb2rgb(e.h,e.s,e.b);return e.h+=.075,e.h>1&&(e.h=0,e.s-=.2,e.s<=0&&(this.getColor.start={h:0,s:1,b:e.b})),r.hex},e.getColor.reset=function(){delete this.start},e.parsePathString=function(t){if(!t)return null;var r=ft(t);if(r.arr)return mt(r.arr);var i={a:7,c:6,h:1,l:2,m:2,r:4,q:4,s:4,t:2,v:1,z:0},n=[];return e.is(t,A)&&e.is(t[0],A)&&(n=mt(t)),n.length||x(t).replace(V,function(t,e,r){var a=[],s=e.toLowerCase();if(r.replace(Y,function(t,e){e&&a.push(+e)}),"m"==s&&a.length>2&&(n.push([e][f](a.splice(0,2))),s="l",e="m"==e?"l":"L"),"r"==s)n.push([e][f](a));else for(;a.length>=i[s]&&(n.push([e][f](a.splice(0,i[s]))),i[s]););}),n.toString=e._path2string,r.arr=mt(n),n},e.parseTransformString=ht(function(t){if(!t)return null;var r=[];return e.is(t,A)&&e.is(t[0],A)&&(r=mt(t)),r.length||x(t).replace(W,function(t,e,i){var n=[];b.call(e);i.replace(Y,function(t,e){e&&n.push(+e)}),r.push([e][f](n))}),r.toString=e._path2string,r},this,function(t){if(!t)return t;for(var e=[],r=0;r<t.length;r++){for(var i=[],n=0;n<t[r].length;n++)i.push(t[r][n]);e.push(i)}return e});var ft=function(t){var e=ft.ps=ft.ps||{};return e[t]?e[t].sleep=100:e[t]={sleep:100},setTimeout(function(){for(var r in e)e[o](r)&&r!=t&&(e[r].sleep--,!e[r].sleep&&delete e[r])}),e[t]};function pt(t,e,r,i,n){return t*(t*(-3*e+9*r-9*i+3*n)+6*e-12*r+6*i)-3*e+3*r}function dt(t,e,r,i,n,a,s,o,l){null==l&&(l=1);for(var h=(l=l>1?1:l<0?0:l)/2,u=[-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],c=[.2491,.2491,.2335,.2335,.2032,.2032,.1601,.1601,.1069,.1069,.0472,.0472],f=0,p=0;p<12;p++){var d=h*u[p]+h,g=pt(d,t,r,n,s),x=pt(d,e,i,a,o),v=g*g+x*x;f+=c[p]*_.sqrt(v)}return h*f}function gt(t,e,r,i,n,a,s,o){if(!(w(t,r)<k(n,s)||k(t,r)>w(n,s)||w(e,i)<k(a,o)||k(e,i)>w(a,o))){var l=(t-r)*(a-o)-(e-i)*(n-s);if(l){var h=((t*i-e*r)*(n-s)-(t-r)*(n*o-a*s))/l,u=((t*i-e*r)*(a-o)-(e-i)*(n*o-a*s))/l,c=+h.toFixed(2),f=+u.toFixed(2);if(!(c<+k(t,r).toFixed(2)||c>+w(t,r).toFixed(2)||c<+k(n,s).toFixed(2)||c>+w(n,s).toFixed(2)||f<+k(e,i).toFixed(2)||f>+w(e,i).toFixed(2)||f<+k(a,o).toFixed(2)||f>+w(a,o).toFixed(2)))return{x:h,y:u}}}}function xt(t,r,i){var n=e.bezierBBox(t),a=e.bezierBBox(r);if(!e.isBBoxIntersect(n,a))return i?0:[];for(var s=dt.apply(0,t),o=dt.apply(0,r),l=w(~~(s/5),1),h=w(~~(o/5),1),u=[],c=[],f={},p=i?0:[],d=0;d<l+1;d++){var g=e.findDotsAtSegment.apply(e,t.concat(d/l));u.push({x:g.x,y:g.y,t:d/l})}for(d=0;d<h+1;d++)g=e.findDotsAtSegment.apply(e,r.concat(d/h)),c.push({x:g.x,y:g.y,t:d/h});for(d=0;d<l;d++)for(var x=0;x<h;x++){var v=u[d],y=u[d+1],m=c[x],b=c[x+1],_=B(y.x-v.x)<.001?"y":"x",C=B(b.x-m.x)<.001?"y":"x",S=gt(v.x,v.y,y.x,y.y,m.x,m.y,b.x,b.y);if(S){if(f[S.x.toFixed(4)]==S.y.toFixed(4))continue;f[S.x.toFixed(4)]=S.y.toFixed(4);var T=v.t+B((S[_]-v[_])/(y[_]-v[_]))*(y.t-v.t),A=m.t+B((S[C]-m[C])/(b[C]-m[C]))*(b.t-m.t);T>=0&&T<=1.001&&A>=0&&A<=1.001&&(i?p++:p.push({x:S.x,y:S.y,t1:k(T,1),t2:k(A,1)}))}}return p}function vt(t,r,i){t=e._path2curve(t),r=e._path2curve(r);for(var n,a,s,o,l,h,u,c,f,p,d=i?0:[],g=0,x=t.length;g<x;g++){var v=t[g];if("M"==v[0])n=l=v[1],a=h=v[2];else{"C"==v[0]?(f=[n,a].concat(v.slice(1)),n=f[6],a=f[7]):(f=[n,a,n,a,l,h,l,h],n=l,a=h);for(var y=0,m=r.length;y<m;y++){var b=r[y];if("M"==b[0])s=u=b[1],o=c=b[2];else{"C"==b[0]?(p=[s,o].concat(b.slice(1)),s=p[6],o=p[7]):(p=[s,o,s,o,u,c,u,c],s=u,o=c);var _=xt(f,p,i);if(i)d+=_;else{for(var w=0,k=_.length;w<k;w++)_[w].segment1=g,_[w].segment2=y,_[w].bez1=f,_[w].bez2=p;d=d.concat(_)}}}}}return d}e.findDotsAtSegment=function(t,e,r,i,n,a,s,o,l){var h=1-l,u=C(h,3),c=C(h,2),f=l*l,p=f*l,d=u*t+3*c*l*r+3*h*l*l*n+p*s,g=u*e+3*c*l*i+3*h*l*l*a+p*o,x=t+2*l*(r-t)+f*(n-2*r+t),v=e+2*l*(i-e)+f*(a-2*i+e),y=r+2*l*(n-r)+f*(s-2*n+r),m=i+2*l*(a-i)+f*(o-2*a+i),b=h*t+l*r,w=h*e+l*i,k=h*n+l*s,B=h*a+l*o,T=90-180*_.atan2(x-y,v-m)/S;return(x>y||v<m)&&(T+=180),{x:d,y:g,m:{x:x,y:v},n:{x:y,y:m},start:{x:b,y:w},end:{x:k,y:B},alpha:T}},e.bezierBBox=function(t,r,i,n,a,s,o,l){e.is(t,"array")||(t=[t,r,i,n,a,s,o,l]);var h=St.apply(null,t);return{x:h.min.x,y:h.min.y,x2:h.max.x,y2:h.max.y,width:h.max.x-h.min.x,height:h.max.y-h.min.y}},e.isPointInsideBBox=function(t,e,r){return e>=t.x&&e<=t.x2&&r>=t.y&&r<=t.y2},e.isBBoxIntersect=function(t,r){var i=e.isPointInsideBBox;return i(r,t.x,t.y)||i(r,t.x2,t.y)||i(r,t.x,t.y2)||i(r,t.x2,t.y2)||i(t,r.x,r.y)||i(t,r.x2,r.y)||i(t,r.x,r.y2)||i(t,r.x2,r.y2)||(t.x<r.x2&&t.x>r.x||r.x<t.x2&&r.x>t.x)&&(t.y<r.y2&&t.y>r.y||r.y<t.y2&&r.y>t.y)},e.pathIntersection=function(t,e){return vt(t,e)},e.pathIntersectionNumber=function(t,e){return vt(t,e,1)},e.isPointInsidePath=function(t,r,i){var n=e.pathBBox(t);return e.isPointInsideBBox(n,r,i)&&vt(t,[["M",r,i],["H",n.x2+10]],1)%2==1},e._removedFactory=function(e){return function(){t("raphael.log",null,"Raphaël: you are calling to method “"+e+"” of removed object",e)}};var yt=e.pathBBox=function(t){var e=ft(t);if(e.bbox)return tt(e.bbox);if(!t)return{x:0,y:0,width:0,height:0,x2:0,y2:0};for(var r,i=0,n=0,a=[],s=[],o=0,l=(t=Tt(t)).length;o<l;o++)if("M"==(r=t[o])[0])i=r[1],n=r[2],a.push(i),s.push(n);else{var h=St(i,n,r[1],r[2],r[3],r[4],r[5],r[6]);a=a[f](h.min.x,h.max.x),s=s[f](h.min.y,h.max.y),i=r[5],n=r[6]}var u=k[c](0,a),p=k[c](0,s),d=w[c](0,a),g=w[c](0,s),x=d-u,v=g-p,y={x:u,y:p,x2:d,y2:g,width:x,height:v,cx:u+x/2,cy:p+v/2};return e.bbox=tt(y),y},mt=function(t){var r=tt(t);return r.toString=e._path2string,r},bt=e._pathToRelative=function(t){var r=ft(t);if(r.rel)return mt(r.rel);e.is(t,A)&&e.is(t&&t[0],A)||(t=e.parsePathString(t));var i=[],n=0,a=0,s=0,o=0,l=0;"M"==t[0][0]&&(s=n=t[0][1],o=a=t[0][2],l++,i.push(["M",n,a]));for(var h=l,u=t.length;h<u;h++){var c=i[h]=[],f=t[h];if(f[0]!=b.call(f[0]))switch(c[0]=b.call(f[0]),c[0]){case"a":c[1]=f[1],c[2]=f[2],c[3]=f[3],c[4]=f[4],c[5]=f[5],c[6]=+(f[6]-n).toFixed(3),c[7]=+(f[7]-a).toFixed(3);break;case"v":c[1]=+(f[1]-a).toFixed(3);break;case"m":s=f[1],o=f[2];default:for(var p=1,d=f.length;p<d;p++)c[p]=+(f[p]-(p%2?n:a)).toFixed(3)}else{c=i[h]=[],"m"==f[0]&&(s=f[1]+n,o=f[2]+a);for(var g=0,x=f.length;g<x;g++)i[h][g]=f[g]}var v=i[h].length;switch(i[h][0]){case"z":n=s,a=o;break;case"h":n+=+i[h][v-1];break;case"v":a+=+i[h][v-1];break;default:n+=+i[h][v-2],a+=+i[h][v-1]}}return i.toString=e._path2string,r.rel=mt(i),i},_t=e._pathToAbsolute=function(t){var r=ft(t);if(r.abs)return mt(r.abs);if(e.is(t,A)&&e.is(t&&t[0],A)||(t=e.parsePathString(t)),!t||!t.length)return[["M",0,0]];var i=[],n=0,a=0,s=0,o=0,l=0;"M"==t[0][0]&&(s=n=+t[0][1],o=a=+t[0][2],l++,i[0]=["M",n,a]);for(var h,u,c=3==t.length&&"M"==t[0][0]&&"R"==t[1][0].toUpperCase()&&"Z"==t[2][0].toUpperCase(),p=l,d=t.length;p<d;p++){if(i.push(h=[]),(u=t[p])[0]!=R.call(u[0]))switch(h[0]=R.call(u[0]),h[0]){case"A":h[1]=u[1],h[2]=u[2],h[3]=u[3],h[4]=u[4],h[5]=u[5],h[6]=+(u[6]+n),h[7]=+(u[7]+a);break;case"V":h[1]=+u[1]+a;break;case"H":h[1]=+u[1]+n;break;case"R":for(var g=[n,a][f](u.slice(1)),x=2,v=g.length;x<v;x++)g[x]=+g[x]+n,g[++x]=+g[x]+a;i.pop(),i=i[f](ct(g,c));break;case"M":s=+u[1]+n,o=+u[2]+a;default:for(x=1,v=u.length;x<v;x++)h[x]=+u[x]+(x%2?n:a)}else if("R"==u[0])g=[n,a][f](u.slice(1)),i.pop(),i=i[f](ct(g,c)),h=["R"][f](u.slice(-2));else for(var y=0,m=u.length;y<m;y++)h[y]=u[y];switch(h[0]){case"Z":n=s,a=o;break;case"H":n=h[1];break;case"V":a=h[1];break;case"M":s=h[h.length-2],o=h[h.length-1];default:n=h[h.length-2],a=h[h.length-1]}}return i.toString=e._path2string,r.abs=mt(i),i},wt=function(t,e,r,i){return[t,e,r,i,r,i]},kt=function(t,e,r,i,n,a){return[1/3*t+2/3*r,1/3*e+2/3*i,1/3*n+2/3*r,1/3*a+2/3*i,n,a]},Bt=function(t,e,r,i,n,a,s,o,l,h){var u,c=120*S/180,p=S/180*(+n||0),d=[],g=ht(function(t,e,r){return{x:t*_.cos(r)-e*_.sin(r),y:t*_.sin(r)+e*_.cos(r)}});if(h)A=h[0],M=h[1],C=h[2],T=h[3];else{t=(u=g(t,e,-p)).x,e=u.y,o=(u=g(o,l,-p)).x,l=u.y;_.cos(S/180*n),_.sin(S/180*n);var x=(t-o)/2,y=(e-l)/2,m=x*x/(r*r)+y*y/(i*i);m>1&&(r*=m=_.sqrt(m),i*=m);var b=r*r,w=i*i,k=(a==s?-1:1)*_.sqrt(B((b*w-b*y*y-w*x*x)/(b*y*y+w*x*x))),C=k*r*y/i+(t+o)/2,T=k*-i*x/r+(e+l)/2,A=_.asin(((e-T)/i).toFixed(9)),M=_.asin(((l-T)/i).toFixed(9));(A=t<C?S-A:A)<0&&(A=2*S+A),(M=o<C?S-M:M)<0&&(M=2*S+M),s&&A>M&&(A-=2*S),!s&&M>A&&(M-=2*S)}var E=M-A;if(B(E)>c){var N=M,L=o,P=l;M=A+c*(s&&M>A?1:-1),o=C+r*_.cos(M),l=T+i*_.sin(M),d=Bt(o,l,r,i,n,0,s,L,P,[M,N,C,T])}E=M-A;var z=_.cos(A),F=_.sin(A),R=_.cos(M),j=_.sin(M),I=_.tan(E/4),D=4/3*r*I,q=4/3*i*I,O=[t,e],V=[t+D*F,e-q*z],W=[o+D*j,l-q*R],Y=[o,l];if(V[0]=2*O[0]-V[0],V[1]=2*O[1]-V[1],h)return[V,W,Y][f](d);for(var G=[],H=0,X=(d=[V,W,Y][f](d).join()[v](",")).length;H<X;H++)G[H]=H%2?g(d[H-1],d[H],p).y:g(d[H],d[H+1],p).x;return G},Ct=function(t,e,r,i,n,a,s,o,l){var h=1-l;return{x:C(h,3)*t+3*C(h,2)*l*r+3*h*l*l*n+C(l,3)*s,y:C(h,3)*e+3*C(h,2)*l*i+3*h*l*l*a+C(l,3)*o}},St=ht(function(t,e,r,i,n,a,s,o){var l,h=n-2*r+t-(s-2*n+r),u=2*(r-t)-2*(n-r),f=t-r,p=(-u+_.sqrt(u*u-4*h*f))/2/h,d=(-u-_.sqrt(u*u-4*h*f))/2/h,g=[e,o],x=[t,s];return B(p)>"1e12"&&(p=.5),B(d)>"1e12"&&(d=.5),p>0&&p<1&&(l=Ct(t,e,r,i,n,a,s,o,p),x.push(l.x),g.push(l.y)),d>0&&d<1&&(l=Ct(t,e,r,i,n,a,s,o,d),x.push(l.x),g.push(l.y)),h=a-2*i+e-(o-2*a+i),f=e-i,p=(-(u=2*(i-e)-2*(a-i))+_.sqrt(u*u-4*h*f))/2/h,d=(-u-_.sqrt(u*u-4*h*f))/2/h,B(p)>"1e12"&&(p=.5),B(d)>"1e12"&&(d=.5),p>0&&p<1&&(l=Ct(t,e,r,i,n,a,s,o,p),x.push(l.x),g.push(l.y)),d>0&&d<1&&(l=Ct(t,e,r,i,n,a,s,o,d),x.push(l.x),g.push(l.y)),{min:{x:k[c](0,x),y:k[c](0,g)},max:{x:w[c](0,x),y:w[c](0,g)}}}),Tt=e._path2curve=ht(function(t,e){var r=!e&&ft(t);if(!e&&r.curve)return mt(r.curve);for(var i=_t(t),n=e&&_t(e),a={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},s={x:0,y:0,bx:0,by:0,X:0,Y:0,qx:null,qy:null},o=function(t,e,r){var i,n;if(!t)return["C",e.x,e.y,e.x,e.y,e.x,e.y];switch(!(t[0]in{T:1,Q:1})&&(e.qx=e.qy=null),t[0]){case"M":e.X=t[1],e.Y=t[2];break;case"A":t=["C"][f](Bt[c](0,[e.x,e.y][f](t.slice(1))));break;case"S":"C"==r||"S"==r?(i=2*e.x-e.bx,n=2*e.y-e.by):(i=e.x,n=e.y),t=["C",i,n][f](t.slice(1));break;case"T":"Q"==r||"T"==r?(e.qx=2*e.x-e.qx,e.qy=2*e.y-e.qy):(e.qx=e.x,e.qy=e.y),t=["C"][f](kt(e.x,e.y,e.qx,e.qy,t[1],t[2]));break;case"Q":e.qx=t[1],e.qy=t[2],t=["C"][f](kt(e.x,e.y,t[1],t[2],t[3],t[4]));break;case"L":t=["C"][f](wt(e.x,e.y,t[1],t[2]));break;case"H":t=["C"][f](wt(e.x,e.y,t[1],e.y));break;case"V":t=["C"][f](wt(e.x,e.y,e.x,t[1]));break;case"Z":t=["C"][f](wt(e.x,e.y,e.X,e.Y))}return t},l=function(t,e){if(t[e].length>7){t[e].shift();for(var r=t[e];r.length;)u[e]="A",n&&(p[e]="A"),t.splice(e++,0,["C"][f](r.splice(0,6)));t.splice(e,1),v=w(i.length,n&&n.length||0)}},h=function(t,e,r,a,s){t&&e&&"M"==t[s][0]&&"M"!=e[s][0]&&(e.splice(s,0,["M",a.x,a.y]),r.bx=0,r.by=0,r.x=t[s][1],r.y=t[s][2],v=w(i.length,n&&n.length||0))},u=[],p=[],d="",g="",x=0,v=w(i.length,n&&n.length||0);x<v;x++){i[x]&&(d=i[x][0]),"C"!=d&&(u[x]=d,x&&(g=u[x-1])),i[x]=o(i[x],a,g),"A"!=u[x]&&"C"==d&&(u[x]="C"),l(i,x),n&&(n[x]&&(d=n[x][0]),"C"!=d&&(p[x]=d,x&&(g=p[x-1])),n[x]=o(n[x],s,g),"A"!=p[x]&&"C"==d&&(p[x]="C"),l(n,x)),h(i,n,a,s,x),h(n,i,s,a,x);var y=i[x],m=n&&n[x],b=y.length,_=n&&m.length;a.x=y[b-2],a.y=y[b-1],a.bx=z(y[b-4])||a.x,a.by=z(y[b-3])||a.y,s.bx=n&&(z(m[_-4])||s.x),s.by=n&&(z(m[_-3])||s.y),s.x=n&&m[_-2],s.y=n&&m[_-1]}return n||(r.curve=mt(i)),n?[i,n]:i},null,mt),At=(e._parseDots=ht(function(t){for(var r=[],i=0,n=t.length;i<n;i++){var a={},s=t[i].match(/^([^:]*):?([\d\.]*)/);if(a.color=e.getRGB(s[1]),a.color.error)return null;a.opacity=a.color.opacity,a.color=a.color.hex,s[2]&&(a.offset=s[2]+"%"),r.push(a)}for(i=1,n=r.length-1;i<n;i++)if(!r[i].offset){for(var o=z(r[i-1].offset||0),l=0,h=i+1;h<n;h++)if(r[h].offset){l=r[h].offset;break}l||(l=100,h=n);for(var u=((l=z(l))-o)/(h-i+1);i<h;i++)o+=u,r[i].offset=o+"%"}return r}),e._tear=function(t,e){t==e.top&&(e.top=t.prev),t==e.bottom&&(e.bottom=t.next),t.next&&(t.next.prev=t.prev),t.prev&&(t.prev.next=t.next)}),Mt=(e._tofront=function(t,e){e.top!==t&&(At(t,e),t.next=null,t.prev=e.top,e.top.next=t,e.top=t)},e._toback=function(t,e){e.bottom!==t&&(At(t,e),t.next=e.bottom,t.prev=null,e.bottom.prev=t,e.bottom=t)},e._insertafter=function(t,e,r){At(t,r),e==r.top&&(r.top=t),e.next&&(e.next.prev=t),t.next=e.next,t.prev=e,e.next=t},e._insertbefore=function(t,e,r){At(t,r),e==r.bottom&&(r.bottom=t),e.prev&&(e.prev.next=t),t.prev=e.prev,e.prev=t,t.next=e},e.toMatrix=function(t,e){var r=yt(t),i={_:{transform:d},getBBox:function(){return r}};return Et(i,e),i.matrix}),Et=(e.transformPath=function(t,e){return Q(t,Mt(t,e))},e._extractTransform=function(t,r){if(null==r)return t._.transform;r=x(r).replace(/\.{3}|\u2026/g,t._.transform||d);var i,n,a=e.parseTransformString(r),s=0,o=1,l=1,h=t._,u=new Pt;if(h.transform=a||[],a)for(var c=0,f=a.length;c<f;c++){var p,g,v,y,m,b=a[c],_=b.length,w=x(b[0]).toLowerCase(),k=b[0]!=w,B=k?u.invert():0;"t"==w&&3==_?k?(p=B.x(0,0),g=B.y(0,0),v=B.x(b[1],b[2]),y=B.y(b[1],b[2]),u.translate(v-p,y-g)):u.translate(b[1],b[2]):"r"==w?2==_?(m=m||t.getBBox(1),u.rotate(b[1],m.x+m.width/2,m.y+m.height/2),s+=b[1]):4==_&&(k?(v=B.x(b[2],b[3]),y=B.y(b[2],b[3]),u.rotate(b[1],v,y)):u.rotate(b[1],b[2],b[3]),s+=b[1]):"s"==w?2==_||3==_?(m=m||t.getBBox(1),u.scale(b[1],b[_-1],m.x+m.width/2,m.y+m.height/2),o*=b[1],l*=b[_-1]):5==_&&(k?(v=B.x(b[3],b[4]),y=B.y(b[3],b[4]),u.scale(b[1],b[2],v,y)):u.scale(b[1],b[2],b[3],b[4]),o*=b[1],l*=b[2]):"m"==w&&7==_&&u.add(b[1],b[2],b[3],b[4],b[5],b[6]),h.dirtyT=1,t.matrix=u}t.matrix=u,h.sx=o,h.sy=l,h.deg=s,h.dx=i=u.e,h.dy=n=u.f,1==o&&1==l&&!s&&h.bbox?(h.bbox.x+=+i,h.bbox.y+=+n):h.dirtyT=1}),Nt=function(t){var e=t[0];switch(e.toLowerCase()){case"t":return[e,0,0];case"m":return[e,1,0,0,1,0,0];case"r":return 4==t.length?[e,0,t[2],t[3]]:[e,0];case"s":return 5==t.length?[e,1,1,t[3],t[4]]:3==t.length?[e,1,1]:[e,1]}},Lt=e._equaliseTransform=function(t,r){r=x(r).replace(/\.{3}|\u2026/g,t),t=e.parseTransformString(t)||[],r=e.parseTransformString(r)||[];for(var i,n,a,s,o=w(t.length,r.length),l=[],h=[],u=0;u<o;u++){if(a=t[u]||Nt(r[u]),s=r[u]||Nt(a),a[0]!=s[0]||"r"==a[0].toLowerCase()&&(a[2]!=s[2]||a[3]!=s[3])||"s"==a[0].toLowerCase()&&(a[3]!=s[3]||a[4]!=s[4]))return;for(l[u]=[],h[u]=[],i=0,n=w(a.length,s.length);i<n;i++)i in a&&(l[u][i]=a[i]),i in s&&(h[u][i]=s[i])}return{from:l,to:h}};function Pt(t,e,r,i,n,a){null!=t?(this.a=+t,this.b=+e,this.c=+r,this.d=+i,this.e=+n,this.f=+a):(this.a=1,this.b=0,this.c=0,this.d=1,this.e=0,this.f=0)}e._getContainer=function(t,r,i,n){var a;if(null!=(a=null!=n||e.is(t,"object")?t:l.doc.getElementById(t)))return a.tagName?null==r?{container:a,width:a.style.pixelWidth||a.offsetWidth,height:a.style.pixelHeight||a.offsetHeight}:{container:a,width:r,height:i}:{container:1,x:t,y:r,width:i,height:n}},e.pathToRelative=bt,e._engine={},e.path2curve=Tt,e.matrix=function(t,e,r,i,n,a){return new Pt(t,e,r,i,n,a)},function(t){function r(t){return t[0]*t[0]+t[1]*t[1]}function i(t){var e=_.sqrt(r(t));t[0]&&(t[0]/=e),t[1]&&(t[1]/=e)}t.add=function(t,e,r,i,n,a){var s,o,l,h,u=[[],[],[]],c=[[this.a,this.c,this.e],[this.b,this.d,this.f],[0,0,1]],f=[[t,r,n],[e,i,a],[0,0,1]];for(t&&t instanceof Pt&&(f=[[t.a,t.c,t.e],[t.b,t.d,t.f],[0,0,1]]),s=0;s<3;s++)for(o=0;o<3;o++){for(h=0,l=0;l<3;l++)h+=c[s][l]*f[l][o];u[s][o]=h}this.a=u[0][0],this.b=u[1][0],this.c=u[0][1],this.d=u[1][1],this.e=u[0][2],this.f=u[1][2]},t.invert=function(){var t=this,e=t.a*t.d-t.b*t.c;return new Pt(t.d/e,-t.b/e,-t.c/e,t.a/e,(t.c*t.f-t.d*t.e)/e,(t.b*t.e-t.a*t.f)/e)},t.clone=function(){return new Pt(this.a,this.b,this.c,this.d,this.e,this.f)},t.translate=function(t,e){this.add(1,0,0,1,t,e)},t.scale=function(t,e,r,i){null==e&&(e=t),(r||i)&&this.add(1,0,0,1,r,i),this.add(t,0,0,e,0,0),(r||i)&&this.add(1,0,0,1,-r,-i)},t.rotate=function(t,r,i){t=e.rad(t),r=r||0,i=i||0;var n=+_.cos(t).toFixed(9),a=+_.sin(t).toFixed(9);this.add(n,a,-a,n,r,i),this.add(1,0,0,1,-r,-i)},t.x=function(t,e){return t*this.a+e*this.c+this.e},t.y=function(t,e){return t*this.b+e*this.d+this.f},t.get=function(t){return+this[x.fromCharCode(97+t)].toFixed(4)},t.toString=function(){return e.svg?"matrix("+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)].join()+")":[this.get(0),this.get(2),this.get(1),this.get(3),0,0].join()},t.toFilter=function(){return"progid:DXImageTransform.Microsoft.Matrix(M11="+this.get(0)+", M12="+this.get(2)+", M21="+this.get(1)+", M22="+this.get(3)+", Dx="+this.get(4)+", Dy="+this.get(5)+", sizingmethod='auto expand')"},t.offset=function(){return[this.e.toFixed(4),this.f.toFixed(4)]},t.split=function(){var t={};t.dx=this.e,t.dy=this.f;var n=[[this.a,this.c],[this.b,this.d]];t.scalex=_.sqrt(r(n[0])),i(n[0]),t.shear=n[0][0]*n[1][0]+n[0][1]*n[1][1],n[1]=[n[1][0]-n[0][0]*t.shear,n[1][1]-n[0][1]*t.shear],t.scaley=_.sqrt(r(n[1])),i(n[1]),t.shear/=t.scaley;var a=-n[0][1],s=n[1][1];return s<0?(t.rotate=e.deg(_.acos(s)),a<0&&(t.rotate=360-t.rotate)):t.rotate=e.deg(_.asin(a)),t.isSimple=!(+t.shear.toFixed(9)||t.scalex.toFixed(9)!=t.scaley.toFixed(9)&&t.rotate),t.isSuperSimple=!+t.shear.toFixed(9)&&t.scalex.toFixed(9)==t.scaley.toFixed(9)&&!t.rotate,t.noRotation=!+t.shear.toFixed(9)&&!t.rotate,t},t.toTransformString=function(t){var e=t||this[v]();return e.isSimple?(e.scalex=+e.scalex.toFixed(4),e.scaley=+e.scaley.toFixed(4),e.rotate=+e.rotate.toFixed(4),(e.dx||e.dy?"t"+[e.dx,e.dy]:d)+(1!=e.scalex||1!=e.scaley?"s"+[e.scalex,e.scaley,0,0]:d)+(e.rotate?"r"+[e.rotate,0,0]:d)):"m"+[this.get(0),this.get(1),this.get(2),this.get(3),this.get(4),this.get(5)]}}(Pt.prototype);for(var zt=function(){this.returnValue=!1},Ft=function(){return this.originalEvent.preventDefault()},Rt=function(){this.cancelBubble=!0},jt=function(){return this.originalEvent.stopPropagation()},It=function(t){var e=l.doc.documentElement.scrollTop||l.doc.body.scrollTop,r=l.doc.documentElement.scrollLeft||l.doc.body.scrollLeft;return{x:t.clientX+r,y:t.clientY+e}},Dt=l.doc.addEventListener?function(t,e,r,i){var n=function(t){var e=It(t);return r.call(i,t,e.x,e.y)};if(t.addEventListener(e,n,!1),p&&m[e]){var a=function(e){for(var n=It(e),a=e,s=0,o=e.targetTouches&&e.targetTouches.length;s<o;s++)if(e.targetTouches[s].target==t){(e=e.targetTouches[s]).originalEvent=a,e.preventDefault=Ft,e.stopPropagation=jt;break}return r.call(i,e,n.x,n.y)};t.addEventListener(m[e],a,!1)}return function(){return t.removeEventListener(e,n,!1),p&&m[e]&&t.removeEventListener(m[e],a,!1),!0}}:l.doc.attachEvent?function(t,e,r,i){var n=function(t){t=t||l.win.event;var e=l.doc.documentElement.scrollTop||l.doc.body.scrollTop,n=l.doc.documentElement.scrollLeft||l.doc.body.scrollLeft,a=t.clientX+n,s=t.clientY+e;return t.preventDefault=t.preventDefault||zt,t.stopPropagation=t.stopPropagation||Rt,r.call(i,t,a,s)};return t.attachEvent("on"+e,n),function(){return t.detachEvent("on"+e,n),!0}}:void 0,qt=[],Ot=function(e){for(var r,i=e.clientX,n=e.clientY,a=l.doc.documentElement.scrollTop||l.doc.body.scrollTop,s=l.doc.documentElement.scrollLeft||l.doc.body.scrollLeft,o=qt.length;o--;){if(r=qt[o],p&&e.touches){for(var h,u=e.touches.length;u--;)if((h=e.touches[u]).identifier==r.el._drag.id){i=h.clientX,n=h.clientY,(e.originalEvent?e.originalEvent:e).preventDefault();break}}else e.preventDefault();var c,f=r.el.node,d=f.nextSibling,g=f.parentNode,x=f.style.display;l.win.opera&&g.removeChild(f),f.style.display="none",c=r.el.paper.getElementByPoint(i,n),f.style.display=x,l.win.opera&&(d?g.insertBefore(f,d):g.appendChild(f)),c&&t("raphael.drag.over."+r.el.id,r.el,c),i+=s,n+=a,t("raphael.drag.move."+r.el.id,r.move_scope||r.el,i-r.el._drag.x,n-r.el._drag.y,i,n,e)}},Vt=function(r){e.unmousemove(Ot).unmouseup(Vt);for(var i,n=qt.length;n--;)(i=qt[n]).el._drag={},t("raphael.drag.end."+i.el.id,i.end_scope||i.start_scope||i.move_scope||i.el,r);qt=[]},Wt=e.el={},Yt=y.length;Yt--;)!function(t){e[t]=Wt[t]=function(r,i){return e.is(r,"function")&&(this.events=this.events||[],this.events.push({name:t,f:r,unbind:Dt(this.shape||this.node||l.doc,t,r,i||this)})),this},e["un"+t]=Wt["un"+t]=function(r){for(var i=this.events||[],n=i.length;n--;)i[n].name!=t||!e.is(r,"undefined")&&i[n].f!=r||(i[n].unbind(),i.splice(n,1),!i.length&&delete this.events);return this}}(y[Yt]);Wt.data=function(r,i){var n=G[this.id]=G[this.id]||{};if(0==arguments.length)return n;if(1==arguments.length){if(e.is(r,"object")){for(var a in r)r[o](a)&&this.data(a,r[a]);return this}return t("raphael.data.get."+this.id,this,n[r],r),n[r]}return n[r]=i,t("raphael.data.set."+this.id,this,i,r),this},Wt.removeData=function(t){return null==t?delete G[this.id]:G[this.id]&&delete G[this.id][t],this},Wt.getData=function(){return tt(G[this.id]||{})},Wt.hover=function(t,e,r,i){return this.mouseover(t,r).mouseout(e,i||r)},Wt.unhover=function(t,e){return this.unmouseover(t).unmouseout(e)};var Gt=[];Wt.drag=function(r,i,n,a,s,o){function h(h){(h.originalEvent||h).preventDefault();var u=h.clientX,c=h.clientY,f=l.doc.documentElement.scrollTop||l.doc.body.scrollTop,d=l.doc.documentElement.scrollLeft||l.doc.body.scrollLeft;if(this._drag.id=h.identifier,p&&h.touches)for(var g,x=h.touches.length;x--;)if(g=h.touches[x],this._drag.id=g.identifier,g.identifier==this._drag.id){u=g.clientX,c=g.clientY;break}this._drag.x=u+d,this._drag.y=c+f,!qt.length&&e.mousemove(Ot).mouseup(Vt),qt.push({el:this,move_scope:a,start_scope:s,end_scope:o}),i&&t.on("raphael.drag.start."+this.id,i),r&&t.on("raphael.drag.move."+this.id,r),n&&t.on("raphael.drag.end."+this.id,n),t("raphael.drag.start."+this.id,s||a||this,this._drag.x,this._drag.y,h)}return this._drag={},Gt.push({el:this,start:h}),this.mousedown(h),this},Wt.onDragOver=function(e){e?t.on("raphael.drag.over."+this.id,e):t.unbind("raphael.drag.over."+this.id)},Wt.undrag=function(){for(var r=Gt.length;r--;)Gt[r].el==this&&(this.unmousedown(Gt[r].start),Gt.splice(r,1),t.unbind("raphael.drag.*."+this.id));!Gt.length&&e.unmousemove(Ot).unmouseup(Vt),qt=[]},i.circle=function(t,r,i){var n=e._engine.circle(this,t||0,r||0,i||0);return this.__set__&&this.__set__.push(n),n},i.rect=function(t,r,i,n,a){var s=e._engine.rect(this,t||0,r||0,i||0,n||0,a||0);return this.__set__&&this.__set__.push(s),s},i.ellipse=function(t,r,i,n){var a=e._engine.ellipse(this,t||0,r||0,i||0,n||0);return this.__set__&&this.__set__.push(a),a},i.path=function(t){t&&!e.is(t,"string")&&!e.is(t[0],A)&&(t+=d);var r=e._engine.path(e.format[c](e,arguments),this);return this.__set__&&this.__set__.push(r),r},i.image=function(t,r,i,n,a){var s=e._engine.image(this,t||"about:blank",r||0,i||0,n||0,a||0);return this.__set__&&this.__set__.push(s),s},i.text=function(t,r,i){var n=e._engine.text(this,t||0,r||0,x(i));return this.__set__&&this.__set__.push(n),n},i.set=function(t){!e.is(t,"array")&&(t=Array.prototype.splice.call(arguments,0,arguments.length));var r=new ce(t);return this.__set__&&this.__set__.push(r),r.paper=this,r.type="set",r},i.setStart=function(t){this.__set__=t||this.set()},i.setFinish=function(t){var e=this.__set__;return delete this.__set__,e},i.getSize=function(){var t=this.canvas.parentNode;return{width:t.offsetWidth,height:t.offsetHeight}},i.setSize=function(t,r){return e._engine.setSize.call(this,t,r)},i.setViewBox=function(t,r,i,n,a){return e._engine.setViewBox.call(this,t,r,i,n,a)},i.top=i.bottom=null,i.raphael=e;function Ht(){return this.x+g+this.y+g+this.width+" × "+this.height}i.getElementByPoint=function(t,e){var r,i,n,a,s,o,h,u=this.canvas,c=l.doc.elementFromPoint(t,e);if(l.win.opera&&"svg"==c.tagName){var f=(i=(r=u).getBoundingClientRect(),n=r.ownerDocument,a=n.body,s=n.documentElement,o=s.clientTop||a.clientTop||0,h=s.clientLeft||a.clientLeft||0,{y:i.top+(l.win.pageYOffset||s.scrollTop||a.scrollTop)-o,x:i.left+(l.win.pageXOffset||s.scrollLeft||a.scrollLeft)-h}),p=u.createSVGRect();p.x=t-f.x,p.y=e-f.y,p.width=p.height=1;var d=u.getIntersectionList(p,null);d.length&&(c=d[d.length-1])}if(!c)return null;for(;c.parentNode&&c!=u.parentNode&&!c.raphael;)c=c.parentNode;return c==this.canvas.parentNode&&(c=u),c=c&&c.raphael?this.getById(c.raphaelid):null},i.getElementsByBBox=function(t){var r=this.set();return this.forEach(function(i){e.isBBoxIntersect(i.getBBox(),t)&&r.push(i)}),r},i.getById=function(t){for(var e=this.bottom;e;){if(e.id==t)return e;e=e.next}return null},i.forEach=function(t,e){for(var r=this.bottom;r;){if(!1===t.call(e,r))return this;r=r.next}return this},i.getElementsByPoint=function(t,e){var r=this.set();return this.forEach(function(i){i.isPointInside(t,e)&&r.push(i)}),r},Wt.isPointInside=function(t,r){var i=this.realPath=Z[this.type](this);return this.attr("transform")&&this.attr("transform").length&&(i=e.transformPath(i,this.attr("transform"))),e.isPointInsidePath(i,t,r)},Wt.getBBox=function(t){if(this.removed)return{};var e=this._;return t?(!e.dirty&&e.bboxwt||(this.realPath=Z[this.type](this),e.bboxwt=yt(this.realPath),e.bboxwt.toString=Ht,e.dirty=0),e.bboxwt):((e.dirty||e.dirtyT||!e.bbox)&&(!e.dirty&&this.realPath||(e.bboxwt=0,this.realPath=Z[this.type](this)),e.bbox=yt(Q(this.realPath,this.matrix)),e.bbox.toString=Ht,e.dirty=e.dirtyT=0),e.bbox)},Wt.clone=function(){if(this.removed)return null;var t=this.paper[this.type]().attr(this.attr());return this.__set__&&this.__set__.push(t),t},Wt.glow=function(t){if("text"==this.type)return null;var e={width:((t=t||{}).width||10)+(+this.attr("stroke-width")||1),fill:t.fill||!1,opacity:null==t.opacity?.5:t.opacity,offsetx:t.offsetx||0,offsety:t.offsety||0,color:t.color||"#000"},r=e.width/2,i=this.paper,n=i.set(),a=this.realPath||Z[this.type](this);a=this.matrix?Q(a,this.matrix):a;for(var s=1;s<r+1;s++)n.push(i.path(a).attr({stroke:e.color,fill:e.fill?e.color:"none","stroke-linejoin":"round","stroke-linecap":"round","stroke-width":+(e.width/r*s).toFixed(3),opacity:+(e.opacity/r).toFixed(3)}));return n.insertBefore(this).translate(e.offsetx,e.offsety)};var Xt=function(t,r,i,n,a,s,o,l,h){return null==h?dt(t,r,i,n,a,s,o,l):e.findDotsAtSegment(t,r,i,n,a,s,o,l,function(t,e,r,i,n,a,s,o,l){if(!(l<0||dt(t,e,r,i,n,a,s,o)<l)){var h,u=.5,c=1-u;for(h=dt(t,e,r,i,n,a,s,o,c);B(h-l)>.01;)h=dt(t,e,r,i,n,a,s,o,c+=(h<l?1:-1)*(u/=2));return c}}(t,r,i,n,a,s,o,l,h))},Ut=function(t,r){return function(i,n,a){for(var s,o,l,h,u,c="",f={},p=0,d=0,g=(i=Tt(i)).length;d<g;d++){if("M"==(l=i[d])[0])s=+l[1],o=+l[2];else{if(p+(h=Xt(s,o,l[1],l[2],l[3],l[4],l[5],l[6]))>n){if(r&&!f.start){if(c+=["C"+(u=Xt(s,o,l[1],l[2],l[3],l[4],l[5],l[6],n-p)).start.x,u.start.y,u.m.x,u.m.y,u.x,u.y],a)return c;f.start=c,c=["M"+u.x,u.y+"C"+u.n.x,u.n.y,u.end.x,u.end.y,l[5],l[6]].join(),p+=h,s=+l[5],o=+l[6];continue}if(!t&&!r)return{x:(u=Xt(s,o,l[1],l[2],l[3],l[4],l[5],l[6],n-p)).x,y:u.y,alpha:u.alpha}}p+=h,s=+l[5],o=+l[6]}c+=l.shift()+l}return f.end=c,(u=t?p:r?f:e.findDotsAtSegment(s,o,l[0],l[1],l[2],l[3],l[4],l[5],1)).alpha&&(u={x:u.x,y:u.y,alpha:u.alpha}),u}},$t=Ut(1),Zt=Ut(),Qt=Ut(0,1);e.getTotalLength=$t,e.getPointAtLength=Zt,e.getSubpath=function(t,e,r){if(this.getTotalLength(t)-r<1e-6)return Qt(t,e).end;var i=Qt(t,r,1);return e?Qt(i,e).end:i},Wt.getTotalLength=function(){var t=this.getPath();if(t)return this.node.getTotalLength?this.node.getTotalLength():$t(t)},Wt.getPointAtLength=function(t){var e=this.getPath();if(e)return Zt(e,t)},Wt.getPath=function(){var t,r=e._getPath[this.type];if("text"!=this.type&&"set"!=this.type)return r&&(t=r(this)),t},Wt.getSubpath=function(t,r){var i=this.getPath();if(i)return e.getSubpath(i,t,r)};var Jt=e.easing_formulas={linear:function(t){return t},"<":function(t){return C(t,1.7)},">":function(t){return C(t,.48)},"<>":function(t){var e=.48-t/1.04,r=_.sqrt(.1734+e*e),i=r-e,n=-r-e,a=C(B(i),1/3)*(i<0?-1:1)+C(B(n),1/3)*(n<0?-1:1)+.5;return 3*(1-a)*a*a+a*a*a},backIn:function(t){var e=1.70158;return t*t*((e+1)*t-e)},backOut:function(t){var e=1.70158;return(t-=1)*t*((e+1)*t+e)+1},elastic:function(t){return t==!!t?t:C(2,-10*t)*_.sin(2*S*(t-.075)/.3)+1},bounce:function(t){var e=7.5625,r=2.75;return t<1/r?e*t*t:t<2/r?e*(t-=1.5/r)*t+.75:t<2.5/r?e*(t-=2.25/r)*t+.9375:e*(t-=2.625/r)*t+.984375}};Jt.easeIn=Jt["ease-in"]=Jt["<"],Jt.easeOut=Jt["ease-out"]=Jt[">"],Jt.easeInOut=Jt["ease-in-out"]=Jt["<>"],Jt["back-in"]=Jt.backIn,Jt["back-out"]=Jt.backOut;var Kt=[],te=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){setTimeout(t,16)},ee=function(){for(var r=+new Date,i=0;i<Kt.length;i++){var n=Kt[i];if(!n.el.removed&&!n.paused){var a,s,l=r-n.start,h=n.ms,u=n.easing,c=n.from,p=n.diff,d=n.to,x=(n.t,n.el),v={},y={};if(n.initstatus?(l=(n.initstatus*n.anim.top-n.prev)/(n.percent-n.prev)*h,n.status=n.initstatus,delete n.initstatus,n.stop&&Kt.splice(i--,1)):n.status=(n.prev+(n.percent-n.prev)*(l/h))/n.anim.top,!(l<0))if(l<h){var m=u(l/h);for(var b in c)if(c[o](b)){switch(I[b]){case T:a=+c[b]+m*h*p[b];break;case"colour":a="rgb("+[re(P(c[b].r+m*h*p[b].r)),re(P(c[b].g+m*h*p[b].g)),re(P(c[b].b+m*h*p[b].b))].join(",")+")";break;case"path":a=[];for(var _=0,w=c[b].length;_<w;_++){a[_]=[c[b][_][0]];for(var k=1,B=c[b][_].length;k<B;k++)a[_][k]=+c[b][_][k]+m*h*p[b][_][k];a[_]=a[_].join(g)}a=a.join(g);break;case"transform":if(p[b].real)for(a=[],_=0,w=c[b].length;_<w;_++)for(a[_]=[c[b][_][0]],k=1,B=c[b][_].length;k<B;k++)a[_][k]=c[b][_][k]+m*h*p[b][_][k];else{var C=function(t){return+c[b][t]+m*h*p[b][t]};a=[["m",C(0),C(1),C(2),C(3),C(4),C(5)]]}break;case"csv":if("clip-rect"==b)for(a=[],_=4;_--;)a[_]=+c[b][_]+m*h*p[b][_];break;default:var S=[][f](c[b]);for(a=[],_=x.paper.customAttributes[b].length;_--;)a[_]=+S[_]+m*h*p[b][_]}v[b]=a}x.attr(v),function(e,r,i){setTimeout(function(){t("raphael.anim.frame."+e,r,i)})}(x.id,x,n.anim)}else{if(function(r,i,n){setTimeout(function(){t("raphael.anim.frame."+i.id,i,n),t("raphael.anim.finish."+i.id,i,n),e.is(r,"function")&&r.call(i)})}(n.callback,x,n.anim),x.attr(d),Kt.splice(i--,1),n.repeat>1&&!n.next){for(s in d)d[o](s)&&(y[s]=n.totalOrigin[s]);n.el.attr(y),ae(n.anim,n.el,n.anim.percents[0],null,n.totalOrigin,n.repeat-1)}n.next&&!n.stop&&ae(n.anim,n.el,n.next,null,n.totalOrigin,n.repeat)}}}Kt.length&&te(ee)},re=function(t){return t>255?255:t<0?0:t};function ie(t,e,r,i,n,a){var s=3*e,o=3*(i-e)-s,l=1-s-o,h=3*r,u=3*(n-r)-h,c=1-h-u;function f(t){return((l*t+o)*t+s)*t}return function(t,e){var r=function(t,e){var r,i,n,a,h,u;for(n=t,u=0;u<8;u++){if(a=f(n)-t,B(a)<e)return n;if(B(h=(3*l*n+2*o)*n+s)<1e-6)break;n-=a/h}if(i=1,(n=t)<(r=0))return r;if(n>i)return i;for(;r<i;){if(a=f(n),B(a-t)<e)return n;t>a?r=n:i=n,n=(i-r)/2+r}return n}(t,e);return((c*r+u)*r+h)*r}(t,1/(200*a))}function ne(t,e){var r=[],i={};if(this.ms=e,this.times=1,t){for(var n in t)t[o](n)&&(i[z(n)]=t[n],r.push(z(n)));r.sort(H)}this.anim=i,this.top=r[r.length-1],this.percents=r}function ae(r,i,a,s,l,h){a=z(a);var u,c,p,d,g,y,m=r.ms,b={},_={},w={};if(s)for(B=0,C=Kt.length;B<C;B++){var k=Kt[B];if(k.el.id==i.id&&k.anim==r){k.percent!=a?(Kt.splice(B,1),p=1):c=k,i.attr(k.totalOrigin);break}}else s=+_;for(var B=0,C=r.percents.length;B<C;B++){if(r.percents[B]==a||r.percents[B]>s*r.top){a=r.percents[B],g=r.percents[B-1]||0,m=m/r.top*(a-g),d=r.percents[B+1],u=r.anim[a];break}s&&i.attr(r.anim[r.percents[B]])}if(u){if(c)c.initstatus=s,c.start=new Date-c.ms*s;else{for(var S in u)if(u[o](S)&&(I[o](S)||i.paper.customAttributes[o](S)))switch(b[S]=i.attr(S),null==b[S]&&(b[S]=j[S]),_[S]=u[S],I[S]){case T:w[S]=(_[S]-b[S])/m;break;case"colour":b[S]=e.getRGB(b[S]);var A=e.getRGB(_[S]);w[S]={r:(A.r-b[S].r)/m,g:(A.g-b[S].g)/m,b:(A.b-b[S].b)/m};break;case"path":var M=Tt(b[S],_[S]),E=M[1];for(b[S]=M[0],w[S]=[],B=0,C=b[S].length;B<C;B++){w[S][B]=[0];for(var N=1,P=b[S][B].length;N<P;N++)w[S][B][N]=(E[B][N]-b[S][B][N])/m}break;case"transform":var F=i._,R=Lt(F[S],_[S]);if(R)for(b[S]=R.from,_[S]=R.to,w[S]=[],w[S].real=!0,B=0,C=b[S].length;B<C;B++)for(w[S][B]=[b[S][B][0]],N=1,P=b[S][B].length;N<P;N++)w[S][B][N]=(_[S][B][N]-b[S][B][N])/m;else{var D=i.matrix||new Pt,q={_:{transform:F.transform},getBBox:function(){return i.getBBox(1)}};b[S]=[D.a,D.b,D.c,D.d,D.e,D.f],Et(q,_[S]),_[S]=q._.transform,w[S]=[(q.matrix.a-D.a)/m,(q.matrix.b-D.b)/m,(q.matrix.c-D.c)/m,(q.matrix.d-D.d)/m,(q.matrix.e-D.e)/m,(q.matrix.f-D.f)/m]}break;case"csv":var O=x(u[S])[v](n),V=x(b[S])[v](n);if("clip-rect"==S)for(b[S]=V,w[S]=[],B=V.length;B--;)w[S][B]=(O[B]-b[S][B])/m;_[S]=O;break;default:for(O=[][f](u[S]),V=[][f](b[S]),w[S]=[],B=i.paper.customAttributes[S].length;B--;)w[S][B]=((O[B]||0)-(V[B]||0))/m}var W=u.easing,Y=e.easing_formulas[W];if(!Y)if((Y=x(W).match(L))&&5==Y.length){var G=Y;Y=function(t){return ie(t,+G[1],+G[2],+G[3],+G[4],m)}}else Y=X;if(k={anim:r,percent:a,timestamp:y=u.start||r.start||+new Date,start:y+(r.del||0),status:0,initstatus:s||0,stop:!1,ms:m,easing:Y,from:b,diff:w,to:_,el:i,callback:u.callback,prev:g,next:d,repeat:h||r.times,origin:i.attr(),totalOrigin:l},Kt.push(k),s&&!c&&!p&&(k.stop=!0,k.start=new Date-m*s,1==Kt.length))return ee();p&&(k.start=new Date-k.ms*s),1==Kt.length&&te(ee)}t("raphael.anim.start."+i.id,i,r)}}function se(t){for(var e=0;e<Kt.length;e++)Kt[e].el.paper==t&&Kt.splice(e--,1)}Wt.animateWith=function(t,r,i,n,a,s){if(this.removed)return s&&s.call(this),this;var o=i instanceof ne?i:e.animation(i,n,a,s);ae(o,this,o.percents[0],null,this.attr());for(var l=0,h=Kt.length;l<h;l++)if(Kt[l].anim==r&&Kt[l].el==t){Kt[h-1].start=Kt[l].start;break}return this},Wt.onAnimation=function(e){return e?t.on("raphael.anim.frame."+this.id,e):t.unbind("raphael.anim.frame."+this.id),this},ne.prototype.delay=function(t){var e=new ne(this.anim,this.ms);return e.times=this.times,e.del=+t||0,e},ne.prototype.repeat=function(t){var e=new ne(this.anim,this.ms);return e.del=this.del,e.times=_.floor(w(t,0))||1,e},e.animation=function(t,r,i,n){if(t instanceof ne)return t;!e.is(i,"function")&&i||(n=n||i||null,i=null),t=Object(t),r=+r||0;var a,s,l={};for(s in t)t[o](s)&&z(s)!=s&&z(s)+"%"!=s&&(a=!0,l[s]=t[s]);if(a)return i&&(l.easing=i),n&&(l.callback=n),new ne({100:l},r);if(n){var h=0;for(var u in t){var c=F(u);t[o](u)&&c>h&&(h=c)}!t[h+="%"].callback&&(t[h].callback=n)}return new ne(t,r)},Wt.animate=function(t,r,i,n){if(this.removed)return n&&n.call(this),this;var a=t instanceof ne?t:e.animation(t,r,i,n);return ae(a,this,a.percents[0],null,this.attr()),this},Wt.setTime=function(t,e){return t&&null!=e&&this.status(t,k(e,t.ms)/t.ms),this},Wt.status=function(t,e){var r,i,n=[],a=0;if(null!=e)return ae(t,this,-1,k(e,1)),this;for(r=Kt.length;a<r;a++)if((i=Kt[a]).el.id==this.id&&(!t||i.anim==t)){if(t)return i.status;n.push({anim:i.anim,status:i.status})}return t?0:n},Wt.pause=function(e){for(var r=0;r<Kt.length;r++)Kt[r].el.id!=this.id||e&&Kt[r].anim!=e||!1!==t("raphael.anim.pause."+this.id,this,Kt[r].anim)&&(Kt[r].paused=!0);return this},Wt.resume=function(e){for(var r=0;r<Kt.length;r++)if(Kt[r].el.id==this.id&&(!e||Kt[r].anim==e)){var i=Kt[r];!1!==t("raphael.anim.resume."+this.id,this,i.anim)&&(delete i.paused,this.status(i.anim,i.status))}return this},Wt.stop=function(e){for(var r=0;r<Kt.length;r++)Kt[r].el.id!=this.id||e&&Kt[r].anim!=e||!1!==t("raphael.anim.stop."+this.id,this,Kt[r].anim)&&Kt.splice(r--,1);return this},t.on("raphael.remove",se),t.on("raphael.clear",se),Wt.toString=function(){return"Raphaël’s object"};var oe,le,he,ue,ce=function(t){if(this.items=[],this.length=0,this.type="set",t)for(var e=0,r=t.length;e<r;e++)!t[e]||t[e].constructor!=Wt.constructor&&t[e].constructor!=ce||(this[this.items.length]=this.items[this.items.length]=t[e],this.length++)},fe=ce.prototype;for(var pe in fe.push=function(){for(var t,e,r=0,i=arguments.length;r<i;r++)!(t=arguments[r])||t.constructor!=Wt.constructor&&t.constructor!=ce||(this[e=this.items.length]=this.items[e]=t,this.length++);return this},fe.pop=function(){return this.length&&delete this[this.length--],this.items.pop()},fe.forEach=function(t,e){for(var r=0,i=this.items.length;r<i;r++)if(!1===t.call(e,this.items[r],r))return this;return this},Wt)Wt[o](pe)&&(fe[pe]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t][c](r,e)})}}(pe));return fe.attr=function(t,r){if(t&&e.is(t,A)&&e.is(t[0],"object"))for(var i=0,n=t.length;i<n;i++)this.items[i].attr(t[i]);else for(var a=0,s=this.items.length;a<s;a++)this.items[a].attr(t,r);return this},fe.clear=function(){for(;this.length;)this.pop()},fe.splice=function(t,e,r){t=t<0?w(this.length+t,0):t,e=w(0,k(this.length-t,e));var i,n=[],a=[],s=[];for(i=2;i<arguments.length;i++)s.push(arguments[i]);for(i=0;i<e;i++)a.push(this[t+i]);for(;i<this.length-t;i++)n.push(this[t+i]);var o=s.length;for(i=0;i<o+n.length;i++)this.items[t+i]=this[t+i]=i<o?s[i]:n[i-o];for(i=this.items.length=this.length-=e-o;this[i];)delete this[i++];return new ce(a)},fe.exclude=function(t){for(var e=0,r=this.length;e<r;e++)if(this[e]==t)return this.splice(e,1),!0},fe.animate=function(t,r,i,n){(e.is(i,"function")||!i)&&(n=i||null);var a,s,o=this.items.length,l=o,h=this;if(!o)return this;n&&(s=function(){!--o&&n.call(h)}),i=e.is(i,"string")?i:s;var u=e.animation(t,r,i,s);for(a=this.items[--l].animate(u);l--;)this.items[l]&&!this.items[l].removed&&this.items[l].animateWith(a,u,u),this.items[l]&&!this.items[l].removed||o--;return this},fe.insertAfter=function(t){for(var e=this.items.length;e--;)this.items[e].insertAfter(t);return this},fe.getBBox=function(){for(var t=[],e=[],r=[],i=[],n=this.items.length;n--;)if(!this.items[n].removed){var a=this.items[n].getBBox();t.push(a.x),e.push(a.y),r.push(a.x+a.width),i.push(a.y+a.height)}return{x:t=k[c](0,t),y:e=k[c](0,e),x2:r=w[c](0,r),y2:i=w[c](0,i),width:r-t,height:i-e}},fe.clone=function(t){t=this.paper.set();for(var e=0,r=this.items.length;e<r;e++)t.push(this.items[e].clone());return t},fe.toString=function(){return"Raphaël‘s set"},fe.glow=function(t){var e=this.paper.set();return this.forEach(function(r,i){var n=r.glow(t);null!=n&&n.forEach(function(t,r){e.push(t)})}),e},fe.isPointInside=function(t,e){var r=!1;return this.forEach(function(i){if(i.isPointInside(t,e))return r=!0,!1}),r},e.registerFont=function(t){if(!t.face)return t;this.fonts=this.fonts||{};var e={w:t.w,face:{},glyphs:{}},r=t.face["font-family"];for(var i in t.face)t.face[o](i)&&(e.face[i]=t.face[i]);if(this.fonts[r]?this.fonts[r].push(e):this.fonts[r]=[e],!t.svg)for(var n in e.face["units-per-em"]=F(t.face["units-per-em"],10),t.glyphs)if(t.glyphs[o](n)){var a=t.glyphs[n];if(e.glyphs[n]={w:a.w,k:{},d:a.d&&"M"+a.d.replace(/[mlcxtrv]/g,function(t){return{l:"L",c:"C",x:"z",t:"m",r:"l",v:"c"}[t]||"M"})+"z"},a.k)for(var s in a.k)a[o](s)&&(e.glyphs[n].k[s]=a.k[s])}return t},i.getFont=function(t,r,i,n){if(n=n||"normal",i=i||"normal",r=+r||{normal:400,bold:700,lighter:300,bolder:800}[r]||400,e.fonts){var a,s=e.fonts[t];if(!s){var l=new RegExp("(^|\\s)"+t.replace(/[^\w\d\s+!~.:_-]/g,d)+"(\\s|$)","i");for(var h in e.fonts)if(e.fonts[o](h)&&l.test(h)){s=e.fonts[h];break}}if(s)for(var u=0,c=s.length;u<c&&((a=s[u]).face["font-weight"]!=r||a.face["font-style"]!=i&&a.face["font-style"]||a.face["font-stretch"]!=n);u++);return a}},i.print=function(t,r,i,a,s,o,l,h){o=o||"middle",l=w(k(l||0,1),-1),h=w(k(h||1,3),1);var u,c=x(i)[v](d),f=0,p=0,g=d;if(e.is(a,"string")&&(a=this.getFont(a)),a){u=(s||16)/a.face["units-per-em"];for(var y=a.face.bbox[v](n),m=+y[0],b=y[3]-y[1],_=0,B=+y[1]+("baseline"==o?b+ +a.face.descent:b/2),C=0,S=c.length;C<S;C++){if("\n"==c[C])f=0,A=0,p=0,_+=b*h;else{var T=p&&a.glyphs[c[C-1]]||{},A=a.glyphs[c[C]];f+=p?(T.w||a.w)+(T.k&&T.k[c[C]]||0)+a.w*l:0,p=1}A&&A.d&&(g+=e.transformPath(A.d,["t",f*u,_*u,"s",u,u,m,B,"t",(t-m)/u,(r-B)/u]))}}return this.path(g).attr({fill:"#000",stroke:"none"})},i.add=function(t){if(e.is(t,"array"))for(var r,i=this.set(),n=0,s=t.length;n<s;n++)r=t[n]||{},a[o](r.type)&&i.push(this[r.type]().attr(r));return i},e.format=function(t,r){var i=e.is(r,A)?[0][f](r):arguments;return t&&e.is(t,"string")&&i.length-1&&(t=t.replace(s,function(t,e){return null==i[++e]?d:i[e]})),t||d},e.fullfill=(oe=/\{([^\}]+)\}/g,le=/(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g,function(t,e){return String(t).replace(oe,function(t,r){return function(t,e,r){var i=r;return e.replace(le,function(t,e,r,n,a){e=e||n,i&&(e in i&&(i=i[e]),"function"==typeof i&&a&&(i=i()))}),i=(null==i||i==r?t:i)+""}(t,r,e)})}),e.ninja=function(){if(h.was)l.win.Raphael=h.is;else{window.Raphael=void 0;try{delete window.Raphael}catch(t){}}return e},e.st=fe,t.on("raphael.DOMload",function(){r=!0}),null==(he=document).readyState&&he.addEventListener&&(he.addEventListener("DOMContentLoaded",ue=function(){he.removeEventListener("DOMContentLoaded",ue,!1),he.readyState="complete"},!1),he.readyState="loading"),function t(){/in/.test(he.readyState)?setTimeout(t,9):e.eve("raphael.DOMload")}(),e}.apply(e,i))||(t.exports=n)},function(t,e,r){var i,n;i=[r(0),r(3),r(4)],void 0===(n=function(t){return t}.apply(e,i))||(t.exports=n)},function(t,e,r){var i,n,a,s,o,l,h,u,c,f,p,d,g,x;s="hasOwnProperty",o=/[\.\/]/,l=/\s*,\s*/,h=function(t,e){return t-e},u={n:{}},c=function(){for(var t=0,e=this.length;t<e;t++)if(void 0!==this[t])return this[t]},f=function(){for(var t=this.length;--t;)if(void 0!==this[t])return this[t]},p=Object.prototype.toString,d=String,g=Array.isArray||function(t){return t instanceof Array||"[object Array]"==p.call(t)},(x=function(t,e){var r,i=a,s=Array.prototype.slice.call(arguments,2),o=x.listeners(t),l=0,u=[],p={},d=[],g=n;d.firstDefined=c,d.lastDefined=f,n=t,a=0;for(var v=0,y=o.length;v<y;v++)"zIndex"in o[v]&&(u.push(o[v].zIndex),o[v].zIndex<0&&(p[o[v].zIndex]=o[v]));for(u.sort(h);u[l]<0;)if(r=p[u[l++]],d.push(r.apply(e,s)),a)return a=i,d;for(v=0;v<y;v++)if("zIndex"in(r=o[v]))if(r.zIndex==u[l]){if(d.push(r.apply(e,s)),a)break;do{if((r=p[u[++l]])&&d.push(r.apply(e,s)),a)break}while(r)}else p[r.zIndex]=r;else if(d.push(r.apply(e,s)),a)break;return a=i,n=g,d})._events=u,x.listeners=function(t){var e,r,i,n,a,s,l,h,c=g(t)?t:t.split(o),f=u,p=[f],d=[];for(n=0,a=c.length;n<a;n++){for(h=[],s=0,l=p.length;s<l;s++)for(r=[(f=p[s].n)[c[n]],f["*"]],i=2;i--;)(e=r[i])&&(h.push(e),d=d.concat(e.f||[]));p=h}return d},x.separator=function(t){t?(t="["+(t=d(t).replace(/(?=[\.\^\]\[\-])/g,"\\"))+"]",o=new RegExp(t)):o=/[\.\/]/},x.on=function(t,e){if("function"!=typeof e)return function(){};for(var r=g(t)?g(t[0])?t:[t]:d(t).split(l),i=0,n=r.length;i<n;i++)!function(t){for(var r,i=g(t)?t:d(t).split(o),n=u,a=0,s=i.length;a<s;a++)n=(n=n.n).hasOwnProperty(i[a])&&n[i[a]]||(n[i[a]]={n:{}});for(n.f=n.f||[],a=0,s=n.f.length;a<s;a++)if(n.f[a]==e){r=!0;break}!r&&n.f.push(e)}(r[i]);return function(t){+t==+t&&(e.zIndex=+t)}},x.f=function(t){var e=[].slice.call(arguments,1);return function(){x.apply(null,[t,null].concat(e).concat([].slice.call(arguments,0)))}},x.stop=function(){a=1},x.nt=function(t){var e=g(n)?n.join("."):n;return t?new RegExp("(?:\\.|\\/|^)"+t+"(?:\\.|\\/|$)").test(e):e},x.nts=function(){return g(n)?n:n.split(o)},x.off=x.unbind=function(t,e){if(t){var r=g(t)?g(t[0])?t:[t]:d(t).split(l);if(r.length>1)for(var i=0,n=r.length;i<n;i++)x.off(r[i],e);else{r=g(t)?t:d(t).split(o);var a,h,c,f,p,v=[u];for(i=0,n=r.length;i<n;i++)for(f=0;f<v.length;f+=c.length-2){if(c=[f,1],a=v[f].n,"*"!=r[i])a[r[i]]&&c.push(a[r[i]]);else for(h in a)a[s](h)&&c.push(a[h]);v.splice.apply(v,c)}for(i=0,n=v.length;i<n;i++)for(a=v[i];a.n;){if(e){if(a.f){for(f=0,p=a.f.length;f<p;f++)if(a.f[f]==e){a.f.splice(f,1);break}!a.f.length&&delete a.f}for(h in a.n)if(a.n[s](h)&&a.n[h].f){var y=a.n[h].f;for(f=0,p=y.length;f<p;f++)if(y[f]==e){y.splice(f,1);break}!y.length&&delete a.n[h].f}}else for(h in delete a.f,a.n)a.n[s](h)&&a.n[h].f&&delete a.n[h].f;a=a.n}}}else x._events=u={n:{}}},x.once=function(t,e){var r=function(){return x.off(t,r),e.apply(this,arguments)};return x.on(t,r)},x.version="0.5.0",x.toString=function(){return"You are running Eve 0.5.0"},t.exports?t.exports=x:void 0===(i=function(){return x}.apply(e,[]))||(t.exports=i)},function(t,e,r){var i,n;i=[r(0)],void 0===(n=function(t){if(!t||t.svg){var e="hasOwnProperty",r=String,i=parseFloat,n=parseInt,a=Math,s=a.max,o=a.abs,l=a.pow,h=/[, ]+/,u=t.eve,c="",f=" ",p="http://www.w3.org/1999/xlink",d={block:"M5,0 0,2.5 5,5z",classic:"M5,0 0,2.5 5,5 3.5,3 3.5,2z",diamond:"M2.5,0 5,2.5 2.5,5 0,2.5z",open:"M6,1 1,3.5 6,6",oval:"M2.5,0A2.5,2.5,0,0,1,2.5,5 2.5,2.5,0,0,1,2.5,0z"},g={};t.toString=function(){return"Your browser supports SVG.\nYou are running Raphaël "+this.version};var x=function(i,n){if(n)for(var a in"string"==typeof i&&(i=x(i)),n)n[e](a)&&("xlink:"==a.substring(0,6)?i.setAttributeNS(p,a.substring(6),r(n[a])):i.setAttribute(a,r(n[a])));else(i=t._g.doc.createElementNS("http://www.w3.org/2000/svg",i)).style&&(i.style.webkitTapHighlightColor="rgba(0,0,0,0)");return i},v=function(e,n){var h="linear",u=e.id+n,f=.5,p=.5,d=e.node,g=e.paper,v=d.style,m=t._g.doc.getElementById(u);if(!m){if(n=(n=r(n).replace(t._radial_gradient,function(t,e,r){if(h="radial",e&&r){f=i(e);var n=2*((p=i(r))>.5)-1;l(f-.5,2)+l(p-.5,2)>.25&&(p=a.sqrt(.25-l(f-.5,2))*n+.5)&&.5!=p&&(p=p.toFixed(5)-1e-5*n)}return c})).split(/\s*\-\s*/),"linear"==h){var b=n.shift();if(b=-i(b),isNaN(b))return null;var _=[0,0,a.cos(t.rad(b)),a.sin(t.rad(b))],w=1/(s(o(_[2]),o(_[3]))||1);_[2]*=w,_[3]*=w,_[2]<0&&(_[0]=-_[2],_[2]=0),_[3]<0&&(_[1]=-_[3],_[3]=0)}var k=t._parseDots(n);if(!k)return null;if(u=u.replace(/[\(\)\s,\xb0#]/g,"_"),e.gradient&&u!=e.gradient.id&&(g.defs.removeChild(e.gradient),delete e.gradient),!e.gradient){m=x(h+"Gradient",{id:u}),e.gradient=m,x(m,"radial"==h?{fx:f,fy:p}:{x1:_[0],y1:_[1],x2:_[2],y2:_[3],gradientTransform:e.matrix.invert()}),g.defs.appendChild(m);for(var B=0,C=k.length;B<C;B++)m.appendChild(x("stop",{offset:k[B].offset?k[B].offset:B?"100%":"0%","stop-color":k[B].color||"#fff","stop-opacity":isFinite(k[B].opacity)?k[B].opacity:1}))}}return x(d,{fill:y(u),opacity:1,"fill-opacity":1}),v.fill=c,v.opacity=1,v.fillOpacity=1,1},y=function(t){if((e=document.documentMode)&&(9===e||10===e))return"url('#"+t+"')";var e,r=document.location;return"url('"+(r.protocol+"//"+r.host+r.pathname+r.search)+"#"+t+"')"},m=function(t){var e=t.getBBox(1);x(t.pattern,{patternTransform:t.matrix.invert()+" translate("+e.x+","+e.y+")"})},b=function(i,n,a){if("path"==i.type){for(var s,o,l,h,u,f=r(n).toLowerCase().split("-"),p=i.paper,v=a?"end":"start",y=i.node,m=i.attrs,b=m["stroke-width"],_=f.length,w="classic",k=3,B=3,C=5;_--;)switch(f[_]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":w=f[_];break;case"wide":B=5;break;case"narrow":B=2;break;case"long":k=5;break;case"short":k=2}if("open"==w?(k+=2,B+=2,C+=2,l=1,h=a?4:1,u={fill:"none",stroke:m.stroke}):(h=l=k/2,u={fill:m.stroke,stroke:"none"}),i._.arrows?a?(i._.arrows.endPath&&g[i._.arrows.endPath]--,i._.arrows.endMarker&&g[i._.arrows.endMarker]--):(i._.arrows.startPath&&g[i._.arrows.startPath]--,i._.arrows.startMarker&&g[i._.arrows.startMarker]--):i._.arrows={},"none"!=w){var S="raphael-marker-"+w,T="raphael-marker-"+v+w+k+B+"-obj"+i.id;t._g.doc.getElementById(S)?g[S]++:(p.defs.appendChild(x(x("path"),{"stroke-linecap":"round",d:d[w],id:S})),g[S]=1);var A,M=t._g.doc.getElementById(T);M?(g[T]++,A=M.getElementsByTagName("use")[0]):(M=x(x("marker"),{id:T,markerHeight:B,markerWidth:k,orient:"auto",refX:h,refY:B/2}),A=x(x("use"),{"xlink:href":"#"+S,transform:(a?"rotate(180 "+k/2+" "+B/2+") ":c)+"scale("+k/C+","+B/C+")","stroke-width":(1/((k/C+B/C)/2)).toFixed(4)}),M.appendChild(A),p.defs.appendChild(M),g[T]=1),x(A,u);var E=l*("diamond"!=w&&"oval"!=w);a?(s=i._.arrows.startdx*b||0,o=t.getTotalLength(m.path)-E*b):(s=E*b,o=t.getTotalLength(m.path)-(i._.arrows.enddx*b||0)),(u={})["marker-"+v]="url(#"+T+")",(o||s)&&(u.d=t.getSubpath(m.path,s,o)),x(y,u),i._.arrows[v+"Path"]=S,i._.arrows[v+"Marker"]=T,i._.arrows[v+"dx"]=E,i._.arrows[v+"Type"]=w,i._.arrows[v+"String"]=n}else a?(s=i._.arrows.startdx*b||0,o=t.getTotalLength(m.path)-s):(s=0,o=t.getTotalLength(m.path)-(i._.arrows.enddx*b||0)),i._.arrows[v+"Path"]&&x(y,{d:t.getSubpath(m.path,s,o)}),delete i._.arrows[v+"Path"],delete i._.arrows[v+"Marker"],delete i._.arrows[v+"dx"],delete i._.arrows[v+"Type"],delete i._.arrows[v+"String"];for(u in g)if(g[e](u)&&!g[u]){var N=t._g.doc.getElementById(u);N&&N.parentNode.removeChild(N)}}},_={"-":[3,1],".":[1,1],"-.":[3,1,1,1],"-..":[3,1,1,1,1,1],". ":[1,3],"- ":[4,3],"--":[8,3],"- .":[4,3,1,3],"--.":[8,3,1,3],"--..":[8,3,1,3,1,3]},w=function(t,e,i){if(e=_[r(e).toLowerCase()]){for(var n=t.attrs["stroke-width"]||"1",a={round:n,square:n,butt:0}[t.attrs["stroke-linecap"]||i["stroke-linecap"]]||0,s=[],o=e.length;o--;)s[o]=e[o]*n+(o%2?1:-1)*a;x(t.node,{"stroke-dasharray":s.join(",")})}else x(t.node,{"stroke-dasharray":"none"})},k=function(i,a){var l=i.node,u=i.attrs,f=l.style.visibility;for(var d in l.style.visibility="hidden",a)if(a[e](d)){if(!t._availableAttrs[e](d))continue;var g=a[d];switch(u[d]=g,d){case"blur":i.blur(g);break;case"title":var y=l.getElementsByTagName("title");if(y.length&&(y=y[0]))y.firstChild.nodeValue=g;else{y=x("title");var _=t._g.doc.createTextNode(g);y.appendChild(_),l.appendChild(y)}break;case"href":case"target":var k=l.parentNode;if("a"!=k.tagName.toLowerCase()){var C=x("a");k.insertBefore(C,l),C.appendChild(l),k=C}"target"==d?k.setAttributeNS(p,"show","blank"==g?"new":g):k.setAttributeNS(p,d,g);break;case"cursor":l.style.cursor=g;break;case"transform":i.transform(g);break;case"arrow-start":b(i,g);break;case"arrow-end":b(i,g,1);break;case"clip-rect":var S=r(g).split(h);if(4==S.length){i.clip&&i.clip.parentNode.parentNode.removeChild(i.clip.parentNode);var T=x("clipPath"),A=x("rect");T.id=t.createUUID(),x(A,{x:S[0],y:S[1],width:S[2],height:S[3]}),T.appendChild(A),i.paper.defs.appendChild(T),x(l,{"clip-path":"url(#"+T.id+")"}),i.clip=A}if(!g){var M=l.getAttribute("clip-path");if(M){var E=t._g.doc.getElementById(M.replace(/(^url\(#|\)$)/g,c));E&&E.parentNode.removeChild(E),x(l,{"clip-path":c}),delete i.clip}}break;case"path":"path"==i.type&&(x(l,{d:g?u.path=t._pathToAbsolute(g):"M0,0"}),i._.dirty=1,i._.arrows&&("startString"in i._.arrows&&b(i,i._.arrows.startString),"endString"in i._.arrows&&b(i,i._.arrows.endString,1)));break;case"width":if(l.setAttribute(d,g),i._.dirty=1,!u.fx)break;d="x",g=u.x;case"x":u.fx&&(g=-u.x-(u.width||0));case"rx":if("rx"==d&&"rect"==i.type)break;case"cx":l.setAttribute(d,g),i.pattern&&m(i),i._.dirty=1;break;case"height":if(l.setAttribute(d,g),i._.dirty=1,!u.fy)break;d="y",g=u.y;case"y":u.fy&&(g=-u.y-(u.height||0));case"ry":if("ry"==d&&"rect"==i.type)break;case"cy":l.setAttribute(d,g),i.pattern&&m(i),i._.dirty=1;break;case"r":"rect"==i.type?x(l,{rx:g,ry:g}):l.setAttribute(d,g),i._.dirty=1;break;case"src":"image"==i.type&&l.setAttributeNS(p,"href",g);break;case"stroke-width":1==i._.sx&&1==i._.sy||(g/=s(o(i._.sx),o(i._.sy))||1),l.setAttribute(d,g),u["stroke-dasharray"]&&w(i,u["stroke-dasharray"],a),i._.arrows&&("startString"in i._.arrows&&b(i,i._.arrows.startString),"endString"in i._.arrows&&b(i,i._.arrows.endString,1));break;case"stroke-dasharray":w(i,g,a);break;case"fill":var N=r(g).match(t._ISURL);if(N){T=x("pattern");var L=x("image");T.id=t.createUUID(),x(T,{x:0,y:0,patternUnits:"userSpaceOnUse",height:1,width:1}),x(L,{x:0,y:0,"xlink:href":N[1]}),T.appendChild(L),function(e){t._preload(N[1],function(){var t=this.offsetWidth,r=this.offsetHeight;x(e,{width:t,height:r}),x(L,{width:t,height:r})})}(T),i.paper.defs.appendChild(T),x(l,{fill:"url(#"+T.id+")"}),i.pattern=T,i.pattern&&m(i);break}var P=t.getRGB(g);if(P.error){if(("circle"==i.type||"ellipse"==i.type||"r"!=r(g).charAt())&&v(i,g)){if("opacity"in u||"fill-opacity"in u){var z=t._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g,c));if(z){var F=z.getElementsByTagName("stop");x(F[F.length-1],{"stop-opacity":("opacity"in u?u.opacity:1)*("fill-opacity"in u?u["fill-opacity"]:1)})}}u.gradient=g,u.fill="none";break}}else delete a.gradient,delete u.gradient,!t.is(u.opacity,"undefined")&&t.is(a.opacity,"undefined")&&x(l,{opacity:u.opacity}),!t.is(u["fill-opacity"],"undefined")&&t.is(a["fill-opacity"],"undefined")&&x(l,{"fill-opacity":u["fill-opacity"]});P[e]("opacity")&&x(l,{"fill-opacity":P.opacity>1?P.opacity/100:P.opacity});case"stroke":P=t.getRGB(g),l.setAttribute(d,P.hex),"stroke"==d&&P[e]("opacity")&&x(l,{"stroke-opacity":P.opacity>1?P.opacity/100:P.opacity}),"stroke"==d&&i._.arrows&&("startString"in i._.arrows&&b(i,i._.arrows.startString),"endString"in i._.arrows&&b(i,i._.arrows.endString,1));break;case"gradient":("circle"==i.type||"ellipse"==i.type||"r"!=r(g).charAt())&&v(i,g);break;case"opacity":u.gradient&&!u[e]("stroke-opacity")&&x(l,{"stroke-opacity":g>1?g/100:g});case"fill-opacity":if(u.gradient){(z=t._g.doc.getElementById(l.getAttribute("fill").replace(/^url\(#|\)$/g,c)))&&(F=z.getElementsByTagName("stop"),x(F[F.length-1],{"stop-opacity":g}));break}default:"font-size"==d&&(g=n(g,10)+"px");var R=d.replace(/(\-.)/g,function(t){return t.substring(1).toUpperCase()});l.style[R]=g,i._.dirty=1,l.setAttribute(d,g)}}B(i,a),l.style.visibility=f},B=function(i,a){if("text"==i.type&&(a[e]("text")||a[e]("font")||a[e]("font-size")||a[e]("x")||a[e]("y"))){var s=i.attrs,o=i.node,l=o.firstChild?n(t._g.doc.defaultView.getComputedStyle(o.firstChild,c).getPropertyValue("font-size"),10):10;if(a[e]("text")){for(s.text=a.text;o.firstChild;)o.removeChild(o.firstChild);for(var h,u=r(a.text).split("\n"),f=[],p=0,d=u.length;p<d;p++)h=x("tspan"),p&&x(h,{dy:1.2*l,x:s.x}),h.appendChild(t._g.doc.createTextNode(u[p])),o.appendChild(h),f[p]=h}else for(p=0,d=(f=o.getElementsByTagName("tspan")).length;p<d;p++)p?x(f[p],{dy:1.2*l,x:s.x}):x(f[0],{dy:0});x(o,{x:s.x,y:s.y}),i._.dirty=1;var g=i._getBBox(),v=s.y-(g.y+g.height/2);v&&t.is(v,"finite")&&x(f[0],{dy:v})}},C=function(t){return t.parentNode&&"a"===t.parentNode.tagName.toLowerCase()?t.parentNode:t},S=function(e,r){this[0]=this.node=e,e.raphael=!0,this.id=("0000"+(Math.random()*Math.pow(36,5)<<0).toString(36)).slice(-5),e.raphaelid=this.id,this.matrix=t.matrix(),this.realPath=null,this.paper=r,this.attrs=this.attrs||{},this._={transform:[],sx:1,sy:1,deg:0,dx:0,dy:0,dirty:1},!r.bottom&&(r.bottom=this),this.prev=r.top,r.top&&(r.top.next=this),r.top=this,this.next=null},T=t.el;S.prototype=T,T.constructor=S,t._engine.path=function(t,e){var r=x("path");e.canvas&&e.canvas.appendChild(r);var i=new S(r,e);return i.type="path",k(i,{fill:"none",stroke:"#000",path:t}),i},T.rotate=function(t,e,n){if(this.removed)return this;if((t=r(t).split(h)).length-1&&(e=i(t[1]),n=i(t[2])),t=i(t[0]),null==n&&(e=n),null==e||null==n){var a=this.getBBox(1);e=a.x+a.width/2,n=a.y+a.height/2}return this.transform(this._.transform.concat([["r",t,e,n]])),this},T.scale=function(t,e,n,a){if(this.removed)return this;if((t=r(t).split(h)).length-1&&(e=i(t[1]),n=i(t[2]),a=i(t[3])),t=i(t[0]),null==e&&(e=t),null==a&&(n=a),null==n||null==a)var s=this.getBBox(1);return n=null==n?s.x+s.width/2:n,a=null==a?s.y+s.height/2:a,this.transform(this._.transform.concat([["s",t,e,n,a]])),this},T.translate=function(t,e){return this.removed?this:((t=r(t).split(h)).length-1&&(e=i(t[1])),t=i(t[0])||0,e=+e||0,this.transform(this._.transform.concat([["t",t,e]])),this)},T.transform=function(r){var i=this._;if(null==r)return i.transform;if(t._extractTransform(this,r),this.clip&&x(this.clip,{transform:this.matrix.invert()}),this.pattern&&m(this),this.node&&x(this.node,{transform:this.matrix}),1!=i.sx||1!=i.sy){var n=this.attrs[e]("stroke-width")?this.attrs["stroke-width"]:1;this.attr({"stroke-width":n})}return this},T.hide=function(){return this.removed||(this.node.style.display="none"),this},T.show=function(){return this.removed||(this.node.style.display=""),this},T.remove=function(){var e=C(this.node);if(!this.removed&&e.parentNode){var r=this.paper;for(var i in r.__set__&&r.__set__.exclude(this),u.unbind("raphael.*.*."+this.id),this.gradient&&r.defs.removeChild(this.gradient),t._tear(this,r),e.parentNode.removeChild(e),this.removeData(),this)this[i]="function"==typeof this[i]?t._removedFactory(i):null;this.removed=!0}},T._getBBox=function(){if("none"==this.node.style.display){this.show();var t=!0}var e,r=!1;this.paper.canvas.parentElement?e=this.paper.canvas.parentElement.style:this.paper.canvas.parentNode&&(e=this.paper.canvas.parentNode.style),e&&"none"==e.display&&(r=!0,e.display="");var i={};try{i=this.node.getBBox()}catch(t){i={x:this.node.clientLeft,y:this.node.clientTop,width:this.node.clientWidth,height:this.node.clientHeight}}finally{i=i||{},r&&(e.display="none")}return t&&this.hide(),i},T.attr=function(r,i){if(this.removed)return this;if(null==r){var n={};for(var a in this.attrs)this.attrs[e](a)&&(n[a]=this.attrs[a]);return n.gradient&&"none"==n.fill&&(n.fill=n.gradient)&&delete n.gradient,n.transform=this._.transform,n}if(null==i&&t.is(r,"string")){if("fill"==r&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;if("transform"==r)return this._.transform;for(var s=r.split(h),o={},l=0,c=s.length;l<c;l++)(r=s[l])in this.attrs?o[r]=this.attrs[r]:t.is(this.paper.customAttributes[r],"function")?o[r]=this.paper.customAttributes[r].def:o[r]=t._availableAttrs[r];return c-1?o:o[s[0]]}if(null==i&&t.is(r,"array")){for(o={},l=0,c=r.length;l<c;l++)o[r[l]]=this.attr(r[l]);return o}if(null!=i){var f={};f[r]=i}else null!=r&&t.is(r,"object")&&(f=r);for(var p in f)u("raphael.attr."+p+"."+this.id,this,f[p]);for(p in this.paper.customAttributes)if(this.paper.customAttributes[e](p)&&f[e](p)&&t.is(this.paper.customAttributes[p],"function")){var d=this.paper.customAttributes[p].apply(this,[].concat(f[p]));for(var g in this.attrs[p]=f[p],d)d[e](g)&&(f[g]=d[g])}return k(this,f),this},T.toFront=function(){if(this.removed)return this;var e=C(this.node);e.parentNode.appendChild(e);var r=this.paper;return r.top!=this&&t._tofront(this,r),this},T.toBack=function(){if(this.removed)return this;var e=C(this.node),r=e.parentNode;r.insertBefore(e,r.firstChild),t._toback(this,this.paper);this.paper;return this},T.insertAfter=function(e){if(this.removed||!e)return this;var r=C(this.node),i=C(e.node||e[e.length-1].node);return i.nextSibling?i.parentNode.insertBefore(r,i.nextSibling):i.parentNode.appendChild(r),t._insertafter(this,e,this.paper),this},T.insertBefore=function(e){if(this.removed||!e)return this;var r=C(this.node),i=C(e.node||e[0].node);return i.parentNode.insertBefore(r,i),t._insertbefore(this,e,this.paper),this},T.blur=function(e){var r=this;if(0!=+e){var i=x("filter"),n=x("feGaussianBlur");r.attrs.blur=e,i.id=t.createUUID(),x(n,{stdDeviation:+e||1.5}),i.appendChild(n),r.paper.defs.appendChild(i),r._blur=i,x(r.node,{filter:"url(#"+i.id+")"})}else r._blur&&(r._blur.parentNode.removeChild(r._blur),delete r._blur,delete r.attrs.blur),r.node.removeAttribute("filter");return r},t._engine.circle=function(t,e,r,i){var n=x("circle");t.canvas&&t.canvas.appendChild(n);var a=new S(n,t);return a.attrs={cx:e,cy:r,r:i,fill:"none",stroke:"#000"},a.type="circle",x(n,a.attrs),a},t._engine.rect=function(t,e,r,i,n,a){var s=x("rect");t.canvas&&t.canvas.appendChild(s);var o=new S(s,t);return o.attrs={x:e,y:r,width:i,height:n,rx:a||0,ry:a||0,fill:"none",stroke:"#000"},o.type="rect",x(s,o.attrs),o},t._engine.ellipse=function(t,e,r,i,n){var a=x("ellipse");t.canvas&&t.canvas.appendChild(a);var s=new S(a,t);return s.attrs={cx:e,cy:r,rx:i,ry:n,fill:"none",stroke:"#000"},s.type="ellipse",x(a,s.attrs),s},t._engine.image=function(t,e,r,i,n,a){var s=x("image");x(s,{x:r,y:i,width:n,height:a,preserveAspectRatio:"none"}),s.setAttributeNS(p,"href",e),t.canvas&&t.canvas.appendChild(s);var o=new S(s,t);return o.attrs={x:r,y:i,width:n,height:a,src:e},o.type="image",o},t._engine.text=function(e,r,i,n){var a=x("text");e.canvas&&e.canvas.appendChild(a);var s=new S(a,e);return s.attrs={x:r,y:i,"text-anchor":"middle",text:n,"font-family":t._availableAttrs["font-family"],"font-size":t._availableAttrs["font-size"],stroke:"none",fill:"#000"},s.type="text",k(s,s.attrs),s},t._engine.setSize=function(t,e){return this.width=t||this.width,this.height=e||this.height,this.canvas.setAttribute("width",this.width),this.canvas.setAttribute("height",this.height),this._viewBox&&this.setViewBox.apply(this,this._viewBox),this},t._engine.create=function(){var e=t._getContainer.apply(0,arguments),r=e&&e.container;if(!r)throw new Error("SVG container not found.");var i,n=e.x,a=e.y,s=e.width,o=e.height,l=x("svg"),h="overflow:hidden;";return n=n||0,a=a||0,x(l,{height:o=o||342,version:1.1,width:s=s||512,xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"}),1==r?(l.style.cssText=h+"position:absolute;left:"+n+"px;top:"+a+"px",t._g.doc.body.appendChild(l),i=1):(l.style.cssText=h+"position:relative",r.firstChild?r.insertBefore(l,r.firstChild):r.appendChild(l)),(r=new t._Paper).width=s,r.height=o,r.canvas=l,r.clear(),r._left=r._top=0,i&&(r.renderfix=function(){}),r.renderfix(),r},t._engine.setViewBox=function(t,e,r,i,n){u("raphael.setViewBox",this,this._viewBox,[t,e,r,i,n]);var a,o,l=this.getSize(),h=s(r/l.width,i/l.height),c=this.top,p=n?"xMidYMid meet":"xMinYMin";for(null==t?(this._vbSize&&(h=1),delete this._vbSize,a="0 0 "+this.width+f+this.height):(this._vbSize=h,a=t+f+e+f+r+f+i),x(this.canvas,{viewBox:a,preserveAspectRatio:p});h&&c;)o="stroke-width"in c.attrs?c.attrs["stroke-width"]:1,c.attr({"stroke-width":o}),c._.dirty=1,c._.dirtyT=1,c=c.prev;return this._viewBox=[t,e,r,i,!!n],this},t.prototype.renderfix=function(){var t,e=this.canvas,r=e.style;try{t=e.getScreenCTM()||e.createSVGMatrix()}catch(r){t=e.createSVGMatrix()}var i=-t.e%1,n=-t.f%1;(i||n)&&(i&&(this._left=(this._left+i)%1,r.left=this._left+"px"),n&&(this._top=(this._top+n)%1,r.top=this._top+"px"))},t.prototype.clear=function(){t.eve("raphael.clear",this);for(var e=this.canvas;e.firstChild;)e.removeChild(e.firstChild);this.bottom=this.top=null,(this.desc=x("desc")).appendChild(t._g.doc.createTextNode("Created with Raphaël "+t.version)),e.appendChild(this.desc),e.appendChild(this.defs=x("defs"))},t.prototype.remove=function(){for(var e in u("raphael.remove",this),this.canvas.parentNode&&this.canvas.parentNode.removeChild(this.canvas),this)this[e]="function"==typeof this[e]?t._removedFactory(e):null};var A=t.st;for(var M in T)T[e](M)&&!A[e](M)&&(A[M]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t].apply(r,e)})}}(M))}}.apply(e,i))||(t.exports=n)},function(t,e,r){var i,n;i=[r(0)],void 0===(n=function(t){if(!t||t.vml){var e="hasOwnProperty",r=String,i=parseFloat,n=Math,a=n.round,s=n.max,o=n.min,l=n.abs,h=/[, ]+/,u=t.eve,c=" ",f="",p={M:"m",L:"l",C:"c",Z:"x",m:"t",l:"r",c:"v",z:"x"},d=/([clmz]),?([^clmz]*)/gi,g=/ progid:\S+Blur\([^\)]+\)/g,x=/-?[^,\s-]+/g,v="position:absolute;left:0;top:0;width:1px;height:1px;behavior:url(#default#VML)",y=21600,m={path:1,rect:1,image:1},b={circle:1,ellipse:1},_=function(e,r,i){var n=t.matrix();return n.rotate(-e,.5,.5),{dx:n.x(r,i),dy:n.y(r,i)}},w=function(t,e,r,i,n,a){var s=t._,o=t.matrix,h=s.fillpos,u=t.node,f=u.style,p=1,d="",g=y/e,x=y/r;if(f.visibility="hidden",e&&r){if(u.coordsize=l(g)+c+l(x),f.rotation=a*(e*r<0?-1:1),a){var v=_(a,i,n);i=v.dx,n=v.dy}if(e<0&&(d+="x"),r<0&&(d+=" y")&&(p=-1),f.flip=d,u.coordorigin=i*-g+c+n*-x,h||s.fillsize){var m=u.getElementsByTagName("fill");m=m&&m[0],u.removeChild(m),h&&(v=_(a,o.x(h[0],h[1]),o.y(h[0],h[1])),m.position=v.dx*p+c+v.dy*p),s.fillsize&&(m.size=s.fillsize[0]*l(e)+c+s.fillsize[1]*l(r)),u.appendChild(m)}f.visibility="visible"}};t.toString=function(){return"Your browser doesn’t support SVG. Falling down to VML.\nYou are running Raphaël "+this.version};var k,B=function(t,e,i){for(var n=r(e).toLowerCase().split("-"),a=i?"end":"start",s=n.length,o="classic",l="medium",h="medium";s--;)switch(n[s]){case"block":case"classic":case"oval":case"diamond":case"open":case"none":o=n[s];break;case"wide":case"narrow":h=n[s];break;case"long":case"short":l=n[s]}var u=t.node.getElementsByTagName("stroke")[0];u[a+"arrow"]=o,u[a+"arrowlength"]=l,u[a+"arrowwidth"]=h},C=function(n,l){n.attrs=n.attrs||{};var u=n.node,g=n.attrs,v=u.style,_=m[n.type]&&(l.x!=g.x||l.y!=g.y||l.width!=g.width||l.height!=g.height||l.cx!=g.cx||l.cy!=g.cy||l.rx!=g.rx||l.ry!=g.ry||l.r!=g.r),C=b[n.type]&&(g.cx!=l.cx||g.cy!=l.cy||g.r!=l.r||g.rx!=l.rx||g.ry!=l.ry),T=n;for(var A in l)l[e](A)&&(g[A]=l[A]);if(_&&(g.path=t._getPath[n.type](n),n._.dirty=1),l.href&&(u.href=l.href),l.title&&(u.title=l.title),l.target&&(u.target=l.target),l.cursor&&(v.cursor=l.cursor),"blur"in l&&n.blur(l.blur),(l.path&&"path"==n.type||_)&&(u.path=function(e){var i=/[ahqstv]/gi,n=t._pathToAbsolute;if(r(e).match(i)&&(n=t._path2curve),i=/[clmz]/g,n==t._pathToAbsolute&&!r(e).match(i)){var s=r(e).replace(d,function(t,e,r){var i=[],n="m"==e.toLowerCase(),s=p[e];return r.replace(x,function(t){n&&2==i.length&&(s+=i+p["m"==e?"l":"L"],i=[]),i.push(a(t*y))}),s+i});return s}var o,l,h=n(e);s=[];for(var u=0,g=h.length;u<g;u++){o=h[u],"z"==(l=h[u][0].toLowerCase())&&(l="x");for(var v=1,m=o.length;v<m;v++)l+=a(o[v]*y)+(v!=m-1?",":f);s.push(l)}return s.join(c)}(~r(g.path).toLowerCase().indexOf("r")?t._pathToAbsolute(g.path):g.path),n._.dirty=1,"image"==n.type&&(n._.fillpos=[g.x,g.y],n._.fillsize=[g.width,g.height],w(n,1,1,0,0,0))),"transform"in l&&n.transform(l.transform),C){var M=+g.cx,E=+g.cy,N=+g.rx||+g.r||0,L=+g.ry||+g.r||0;u.path=t.format("ar{0},{1},{2},{3},{4},{1},{4},{1}x",a((M-N)*y),a((E-L)*y),a((M+N)*y),a((E+L)*y),a(M*y)),n._.dirty=1}if("clip-rect"in l){var P=r(l["clip-rect"]).split(h);if(4==P.length){P[2]=+P[2]+ +P[0],P[3]=+P[3]+ +P[1];var z=u.clipRect||t._g.doc.createElement("div"),F=z.style;F.clip=t.format("rect({1}px {2}px {3}px {0}px)",P),u.clipRect||(F.position="absolute",F.top=0,F.left=0,F.width=n.paper.width+"px",F.height=n.paper.height+"px",u.parentNode.insertBefore(z,u),z.appendChild(u),u.clipRect=z)}l["clip-rect"]||u.clipRect&&(u.clipRect.style.clip="auto")}if(n.textpath){var R=n.textpath.style;l.font&&(R.font=l.font),l["font-family"]&&(R.fontFamily='"'+l["font-family"].split(",")[0].replace(/^['"]+|['"]+$/g,f)+'"'),l["font-size"]&&(R.fontSize=l["font-size"]),l["font-weight"]&&(R.fontWeight=l["font-weight"]),l["font-style"]&&(R.fontStyle=l["font-style"])}if("arrow-start"in l&&B(T,l["arrow-start"]),"arrow-end"in l&&B(T,l["arrow-end"],1),null!=l.opacity||null!=l.fill||null!=l.src||null!=l.stroke||null!=l["stroke-width"]||null!=l["stroke-opacity"]||null!=l["fill-opacity"]||null!=l["stroke-dasharray"]||null!=l["stroke-miterlimit"]||null!=l["stroke-linejoin"]||null!=l["stroke-linecap"]){var j=u.getElementsByTagName("fill");if(!(j=j&&j[0])&&(j=k("fill")),"image"==n.type&&l.src&&(j.src=l.src),l.fill&&(j.on=!0),null!=j.on&&"none"!=l.fill&&null!==l.fill||(j.on=!1),j.on&&l.fill){var I=r(l.fill).match(t._ISURL);if(I){j.parentNode==u&&u.removeChild(j),j.rotate=!0,j.src=I[1],j.type="tile";var D=n.getBBox(1);j.position=D.x+c+D.y,n._.fillpos=[D.x,D.y],t._preload(I[1],function(){n._.fillsize=[this.offsetWidth,this.offsetHeight]})}else j.color=t.getRGB(l.fill).hex,j.src=f,j.type="solid",t.getRGB(l.fill).error&&(T.type in{circle:1,ellipse:1}||"r"!=r(l.fill).charAt())&&S(T,l.fill,j)&&(g.fill="none",g.gradient=l.fill,j.rotate=!1)}if("fill-opacity"in l||"opacity"in l){var q=((+g["fill-opacity"]+1||2)-1)*((+g.opacity+1||2)-1)*((+t.getRGB(l.fill).o+1||2)-1);q=o(s(q,0),1),j.opacity=q,j.src&&(j.color="none")}u.appendChild(j);var O=u.getElementsByTagName("stroke")&&u.getElementsByTagName("stroke")[0],V=!1;!O&&(V=O=k("stroke")),(l.stroke&&"none"!=l.stroke||l["stroke-width"]||null!=l["stroke-opacity"]||l["stroke-dasharray"]||l["stroke-miterlimit"]||l["stroke-linejoin"]||l["stroke-linecap"])&&(O.on=!0),("none"==l.stroke||null===l.stroke||null==O.on||0==l.stroke||0==l["stroke-width"])&&(O.on=!1);var W=t.getRGB(l.stroke);O.on&&l.stroke&&(O.color=W.hex),q=((+g["stroke-opacity"]+1||2)-1)*((+g.opacity+1||2)-1)*((+W.o+1||2)-1);var Y=.75*(i(l["stroke-width"])||1);if(q=o(s(q,0),1),null==l["stroke-width"]&&(Y=g["stroke-width"]),l["stroke-width"]&&(O.weight=Y),Y&&Y<1&&(q*=Y)&&(O.weight=1),O.opacity=q,l["stroke-linejoin"]&&(O.joinstyle=l["stroke-linejoin"]||"miter"),O.miterlimit=l["stroke-miterlimit"]||8,l["stroke-linecap"]&&(O.endcap="butt"==l["stroke-linecap"]?"flat":"square"==l["stroke-linecap"]?"square":"round"),"stroke-dasharray"in l){var G={"-":"shortdash",".":"shortdot","-.":"shortdashdot","-..":"shortdashdotdot",". ":"dot","- ":"dash","--":"longdash","- .":"dashdot","--.":"longdashdot","--..":"longdashdotdot"};O.dashstyle=G[e](l["stroke-dasharray"])?G[l["stroke-dasharray"]]:f}V&&u.appendChild(O)}if("text"==T.type){T.paper.canvas.style.display=f;var H=T.paper.span,X=g.font&&g.font.match(/\d+(?:\.\d*)?(?=px)/);v=H.style,g.font&&(v.font=g.font),g["font-family"]&&(v.fontFamily=g["font-family"]),g["font-weight"]&&(v.fontWeight=g["font-weight"]),g["font-style"]&&(v.fontStyle=g["font-style"]),X=i(g["font-size"]||X&&X[0])||10,v.fontSize=100*X+"px",T.textpath.string&&(H.innerHTML=r(T.textpath.string).replace(/</g,"&#60;").replace(/&/g,"&#38;").replace(/\n/g,"<br>"));var U=H.getBoundingClientRect();T.W=g.w=(U.right-U.left)/100,T.H=g.h=(U.bottom-U.top)/100,T.X=g.x,T.Y=g.y+T.H/2,("x"in l||"y"in l)&&(T.path.v=t.format("m{0},{1}l{2},{1}",a(g.x*y),a(g.y*y),a(g.x*y)+1));for(var $=["x","y","text","font","font-family","font-weight","font-style","font-size"],Z=0,Q=$.length;Z<Q;Z++)if($[Z]in l){T._.dirty=1;break}switch(g["text-anchor"]){case"start":T.textpath.style["v-text-align"]="left",T.bbx=T.W/2;break;case"end":T.textpath.style["v-text-align"]="right",T.bbx=-T.W/2;break;default:T.textpath.style["v-text-align"]="center",T.bbx=0}T.textpath.style["v-text-kern"]=!0}},S=function(e,a,s){e.attrs=e.attrs||{};e.attrs;var o=Math.pow,l="linear",h=".5 .5";if(e.attrs.gradient=a,a=(a=r(a).replace(t._radial_gradient,function(t,e,r){return l="radial",e&&r&&(e=i(e),r=i(r),o(e-.5,2)+o(r-.5,2)>.25&&(r=n.sqrt(.25-o(e-.5,2))*(2*(r>.5)-1)+.5),h=e+c+r),f})).split(/\s*\-\s*/),"linear"==l){var u=a.shift();if(u=-i(u),isNaN(u))return null}var p=t._parseDots(a);if(!p)return null;if(e=e.shape||e.node,p.length){e.removeChild(s),s.on=!0,s.method="none",s.color=p[0].color,s.color2=p[p.length-1].color;for(var d=[],g=0,x=p.length;g<x;g++)p[g].offset&&d.push(p[g].offset+c+p[g].color);s.colors=d.length?d.join():"0% "+s.color,"radial"==l?(s.type="gradientTitle",s.focus="100%",s.focussize="0 0",s.focusposition=h,s.angle=0):(s.type="gradient",s.angle=(270-u)%360),e.appendChild(s)}return 1},T=function(e,r){this[0]=this.node=e,e.raphael=!0,this.id=t._oid++,e.raphaelid=this.id,this.X=0,this.Y=0,this.attrs={},this.paper=r,this.matrix=t.matrix(),this._={transform:[],sx:1,sy:1,dx:0,dy:0,deg:0,dirty:1,dirtyT:1},!r.bottom&&(r.bottom=this),this.prev=r.top,r.top&&(r.top.next=this),r.top=this,this.next=null},A=t.el;T.prototype=A,A.constructor=T,A.transform=function(e){if(null==e)return this._.transform;var i,n=this.paper._viewBoxShift,a=n?"s"+[n.scale,n.scale]+"-1-1t"+[n.dx,n.dy]:f;n&&(i=e=r(e).replace(/\.{3}|\u2026/g,this._.transform||f)),t._extractTransform(this,a+e);var s,o=this.matrix.clone(),l=this.skew,h=this.node,u=~r(this.attrs.fill).indexOf("-"),p=!r(this.attrs.fill).indexOf("url(");if(o.translate(1,1),p||u||"image"==this.type)if(l.matrix="1 0 0 1",l.offset="0 0",s=o.split(),u&&s.noRotation||!s.isSimple){h.style.filter=o.toFilter();var d=this.getBBox(),g=this.getBBox(1),x=d.x-g.x,v=d.y-g.y;h.coordorigin=x*-y+c+v*-y,w(this,1,1,x,v,0)}else h.style.filter=f,w(this,s.scalex,s.scaley,s.dx,s.dy,s.rotate);else h.style.filter=f,l.matrix=r(o),l.offset=o.offset();return null!==i&&(this._.transform=i,t._extractTransform(this,i)),this},A.rotate=function(t,e,n){if(this.removed)return this;if(null!=t){if((t=r(t).split(h)).length-1&&(e=i(t[1]),n=i(t[2])),t=i(t[0]),null==n&&(e=n),null==e||null==n){var a=this.getBBox(1);e=a.x+a.width/2,n=a.y+a.height/2}return this._.dirtyT=1,this.transform(this._.transform.concat([["r",t,e,n]])),this}},A.translate=function(t,e){return this.removed?this:((t=r(t).split(h)).length-1&&(e=i(t[1])),t=i(t[0])||0,e=+e||0,this._.bbox&&(this._.bbox.x+=t,this._.bbox.y+=e),this.transform(this._.transform.concat([["t",t,e]])),this)},A.scale=function(t,e,n,a){if(this.removed)return this;if((t=r(t).split(h)).length-1&&(e=i(t[1]),n=i(t[2]),a=i(t[3]),isNaN(n)&&(n=null),isNaN(a)&&(a=null)),t=i(t[0]),null==e&&(e=t),null==a&&(n=a),null==n||null==a)var s=this.getBBox(1);return n=null==n?s.x+s.width/2:n,a=null==a?s.y+s.height/2:a,this.transform(this._.transform.concat([["s",t,e,n,a]])),this._.dirtyT=1,this},A.hide=function(){return!this.removed&&(this.node.style.display="none"),this},A.show=function(){return!this.removed&&(this.node.style.display=f),this},A.auxGetBBox=t.el.getBBox,A.getBBox=function(){var t=this.auxGetBBox();if(this.paper&&this.paper._viewBoxShift){var e={},r=1/this.paper._viewBoxShift.scale;return e.x=t.x-this.paper._viewBoxShift.dx,e.x*=r,e.y=t.y-this.paper._viewBoxShift.dy,e.y*=r,e.width=t.width*r,e.height=t.height*r,e.x2=e.x+e.width,e.y2=e.y+e.height,e}return t},A._getBBox=function(){return this.removed?{}:{x:this.X+(this.bbx||0)-this.W/2,y:this.Y-this.H,width:this.W,height:this.H}},A.remove=function(){if(!this.removed&&this.node.parentNode){for(var e in this.paper.__set__&&this.paper.__set__.exclude(this),t.eve.unbind("raphael.*.*."+this.id),t._tear(this,this.paper),this.node.parentNode.removeChild(this.node),this.shape&&this.shape.parentNode.removeChild(this.shape),this)this[e]="function"==typeof this[e]?t._removedFactory(e):null;this.removed=!0}},A.attr=function(r,i){if(this.removed)return this;if(null==r){var n={};for(var a in this.attrs)this.attrs[e](a)&&(n[a]=this.attrs[a]);return n.gradient&&"none"==n.fill&&(n.fill=n.gradient)&&delete n.gradient,n.transform=this._.transform,n}if(null==i&&t.is(r,"string")){if("fill"==r&&"none"==this.attrs.fill&&this.attrs.gradient)return this.attrs.gradient;for(var s=r.split(h),o={},l=0,c=s.length;l<c;l++)(r=s[l])in this.attrs?o[r]=this.attrs[r]:t.is(this.paper.customAttributes[r],"function")?o[r]=this.paper.customAttributes[r].def:o[r]=t._availableAttrs[r];return c-1?o:o[s[0]]}if(this.attrs&&null==i&&t.is(r,"array")){for(o={},l=0,c=r.length;l<c;l++)o[r[l]]=this.attr(r[l]);return o}var f;for(var p in null!=i&&((f={})[r]=i),null==i&&t.is(r,"object")&&(f=r),f)u("raphael.attr."+p+"."+this.id,this,f[p]);if(f){for(p in this.paper.customAttributes)if(this.paper.customAttributes[e](p)&&f[e](p)&&t.is(this.paper.customAttributes[p],"function")){var d=this.paper.customAttributes[p].apply(this,[].concat(f[p]));for(var g in this.attrs[p]=f[p],d)d[e](g)&&(f[g]=d[g])}f.text&&"text"==this.type&&(this.textpath.string=f.text),C(this,f)}return this},A.toFront=function(){return!this.removed&&this.node.parentNode.appendChild(this.node),this.paper&&this.paper.top!=this&&t._tofront(this,this.paper),this},A.toBack=function(){return this.removed?this:(this.node.parentNode.firstChild!=this.node&&(this.node.parentNode.insertBefore(this.node,this.node.parentNode.firstChild),t._toback(this,this.paper)),this)},A.insertAfter=function(e){return this.removed?this:(e.constructor==t.st.constructor&&(e=e[e.length-1]),e.node.nextSibling?e.node.parentNode.insertBefore(this.node,e.node.nextSibling):e.node.parentNode.appendChild(this.node),t._insertafter(this,e,this.paper),this)},A.insertBefore=function(e){return this.removed?this:(e.constructor==t.st.constructor&&(e=e[0]),e.node.parentNode.insertBefore(this.node,e.node),t._insertbefore(this,e,this.paper),this)},A.blur=function(e){var r=this.node.runtimeStyle,i=r.filter;return i=i.replace(g,f),0!=+e?(this.attrs.blur=e,r.filter=i+c+" progid:DXImageTransform.Microsoft.Blur(pixelradius="+(+e||1.5)+")",r.margin=t.format("-{0}px 0 0 -{0}px",a(+e||1.5))):(r.filter=i,r.margin=0,delete this.attrs.blur),this},t._engine.path=function(t,e){var r=k("shape");r.style.cssText=v,r.coordsize=y+c+y,r.coordorigin=e.coordorigin;var i=new T(r,e),n={fill:"none",stroke:"#000"};t&&(n.path=t),i.type="path",i.path=[],i.Path=f,C(i,n),e.canvas&&e.canvas.appendChild(r);var a=k("skew");return a.on=!0,r.appendChild(a),i.skew=a,i.transform(f),i},t._engine.rect=function(e,r,i,n,a,s){var o=t._rectPath(r,i,n,a,s),l=e.path(o),h=l.attrs;return l.X=h.x=r,l.Y=h.y=i,l.W=h.width=n,l.H=h.height=a,h.r=s,h.path=o,l.type="rect",l},t._engine.ellipse=function(t,e,r,i,n){var a=t.path();a.attrs;return a.X=e-i,a.Y=r-n,a.W=2*i,a.H=2*n,a.type="ellipse",C(a,{cx:e,cy:r,rx:i,ry:n}),a},t._engine.circle=function(t,e,r,i){var n=t.path();n.attrs;return n.X=e-i,n.Y=r-i,n.W=n.H=2*i,n.type="circle",C(n,{cx:e,cy:r,r:i}),n},t._engine.image=function(e,r,i,n,a,s){var o=t._rectPath(i,n,a,s),l=e.path(o).attr({stroke:"none"}),h=l.attrs,u=l.node,c=u.getElementsByTagName("fill")[0];return h.src=r,l.X=h.x=i,l.Y=h.y=n,l.W=h.width=a,l.H=h.height=s,h.path=o,l.type="image",c.parentNode==u&&u.removeChild(c),c.rotate=!0,c.src=r,c.type="tile",l._.fillpos=[i,n],l._.fillsize=[a,s],u.appendChild(c),w(l,1,1,0,0,0),l},t._engine.text=function(e,i,n,s){var o=k("shape"),l=k("path"),h=k("textpath");i=i||0,n=n||0,s=s||"",l.v=t.format("m{0},{1}l{2},{1}",a(i*y),a(n*y),a(i*y)+1),l.textpathok=!0,h.string=r(s),h.on=!0,o.style.cssText=v,o.coordsize=y+c+y,o.coordorigin="0 0";var u=new T(o,e),p={fill:"#000",stroke:"none",font:t._availableAttrs.font,text:s};u.shape=o,u.path=l,u.textpath=h,u.type="text",u.attrs.text=r(s),u.attrs.x=i,u.attrs.y=n,u.attrs.w=1,u.attrs.h=1,C(u,p),o.appendChild(h),o.appendChild(l),e.canvas.appendChild(o);var d=k("skew");return d.on=!0,o.appendChild(d),u.skew=d,u.transform(f),u},t._engine.setSize=function(e,r){var i=this.canvas.style;return this.width=e,this.height=r,e==+e&&(e+="px"),r==+r&&(r+="px"),i.width=e,i.height=r,i.clip="rect(0 "+e+" "+r+" 0)",this._viewBox&&t._engine.setViewBox.apply(this,this._viewBox),this},t._engine.setViewBox=function(e,r,i,n,a){t.eve("raphael.setViewBox",this,this._viewBox,[e,r,i,n,a]);var s,o,l=this.getSize(),h=l.width,u=l.height;return a&&(i*(s=u/n)<h&&(e-=(h-i*s)/2/s),n*(o=h/i)<u&&(r-=(u-n*o)/2/o)),this._viewBox=[e,r,i,n,!!a],this._viewBoxShift={dx:-e,dy:-r,scale:l},this.forEach(function(t){t.transform("...")}),this},t._engine.initWin=function(t){var e=t.document;e.styleSheets.length<31?e.createStyleSheet().addRule(".rvml","behavior:url(#default#VML)"):e.styleSheets[0].addRule(".rvml","behavior:url(#default#VML)");try{!e.namespaces.rvml&&e.namespaces.add("rvml","urn:schemas-microsoft-com:vml"),k=function(t){return e.createElement("<rvml:"+t+' class="rvml">')}}catch(t){k=function(t){return e.createElement("<"+t+' xmlns="urn:schemas-microsoft.com:vml" class="rvml">')}}},t._engine.initWin(t._g.win),t._engine.create=function(){var e=t._getContainer.apply(0,arguments),r=e.container,i=e.height,n=e.width,a=e.x,s=e.y;if(!r)throw new Error("VML container not found.");var o=new t._Paper,l=o.canvas=t._g.doc.createElement("div"),h=l.style;return a=a||0,s=s||0,n=n||512,i=i||342,o.width=n,o.height=i,n==+n&&(n+="px"),i==+i&&(i+="px"),o.coordsize=216e5+c+216e5,o.coordorigin="0 0",o.span=t._g.doc.createElement("span"),o.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;",l.appendChild(o.span),h.cssText=t.format("top:0;left:0;width:{0};height:{1};display:inline-block;position:relative;clip:rect(0 {0} {1} 0);overflow:hidden",n,i),1==r?(t._g.doc.body.appendChild(l),h.left=a+"px",h.top=s+"px",h.position="absolute"):r.firstChild?r.insertBefore(l,r.firstChild):r.appendChild(l),o.renderfix=function(){},o},t.prototype.clear=function(){t.eve("raphael.clear",this),this.canvas.innerHTML=f,this.span=t._g.doc.createElement("span"),this.span.style.cssText="position:absolute;left:-9999em;top:-9999em;padding:0;margin:0;line-height:1;display:inline;",this.canvas.appendChild(this.span),this.bottom=this.top=null},t.prototype.remove=function(){for(var e in t.eve("raphael.remove",this),this.canvas.parentNode.removeChild(this.canvas),this)this[e]="function"==typeof this[e]?t._removedFactory(e):null;return!0};var M=t.st;for(var E in A)A[e](E)&&!M[e](E)&&(M[E]=function(t){return function(){var e=arguments;return this.forEach(function(r){r[t].apply(r,e)})}}(E))}}.apply(e,i))||(t.exports=n)}])});
},{}],3:[function(require,module,exports){
"use strict";

var _jquery = _interopRequireDefault(require("jquery"));

var _raphael = _interopRequireDefault(require("raphael"));

var _dylanSeatingHitched = require("./dylanSeatingHitched");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

window.DylanSeating = new _dylanSeatingHitched.DylanSeating(_jquery["default"], _raphael["default"]);

},{"./dylanSeatingHitched":4,"jquery":1,"raphael":2}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DylanSeating = DylanSeating;

/*jslint nomen: true */

/*global $:false, _:false, console:false, socket:false, Raphael:false, window:false */

/**
 * @license DylanSeating v1
 *
 * (c) 2011-2012 by digiguru (Adam Hall)
 *
 * License: Creative Commons 3.0 (http://creativecommons.org/licenses/by-nc/3.0/)
 * Prequisites : jQuery, underscore, rapheal
 **/
var myPlanID, possibleSeats; // Array Remove - By John Resig (MIT Licensed)

Array.prototype.remove = function ArrayRemove(from, to) {
  "use strict";

  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

Array.prototype.insertAt = function ArrayInsertAt(o, index) {
  "use strict";

  if (index > -1 && index <= this.length) {
    this.splice(index, 0, o);
    return true;
  }

  return false;
};

function DylanSeating($, Raphael) {
  "use strict";

  window.Raphael = Raphael;

  this.Controller = function Controller() {};

  var viewModule = function (Raphael) {
    var auditModule = function auditModule(paper) {
      var auditBox = paper.text(200, 20, "loaded");
      return {
        audits: [],
        log: function log(eventText) {
          this.audits.push(eventText);
          auditBox.remove();
          auditBox = paper.text(400, 200, this.audits.slice(-20).join("\n"));
        }
      };
    },
        generatePaperIfNotPresent = function generatePaperIfNotPresent() {
      if (!$("#board").length) {
        $("body").prepend("<div id='board'></div>");
      }

      return window.Raphael("board", 900, 900);
    },
        paper = generatePaperIfNotPresent();

    return {
      paper: paper,
      audit: auditModule(paper)
    };
  }(Raphael); //console.log(view, view.paper);


  var seatList = [],
      myTables = [],
      myGuests = [],
      paper = viewModule.paper,
      logEvent = function logEvent(eventText) {
    viewModule.audit.log(eventText);
  },
      MyToolBar,
      selectedGuestEdit,
      clearData = function clearData() {
    var dfdRemoveAllData = $.Deferred(),
        arrAllDataDFD = [],
        i,
        l = myTables.length;

    if (myTables && l) {
      for (i = 0; i < l; i += 1) {
        arrAllDataDFD.push(myTables[i].remove());
      }
    }

    if (myGuests) {
      l = myGuests.length;

      for (i = 0; i < l; i += 1) {
        arrAllDataDFD.push(myGuests[i].remove());
      }
    }

    $.when.apply($, arrAllDataDFD).done(function () {
      myTables = [];
      myGuests = [];
      console.log("removed all data from the scene. it is now clean");
      dfdRemoveAllData.resolve();
    });
    return dfdRemoveAllData.promise();
  },
      requestPlanList = function requestPlanList() {
    if (socket) {
      socket.emit('GetPlanList');
    }
  },
      loadData = function loadData(data) {
    var dfdRemoveAllData = $.Deferred(),
        arrAllDataDFD = [],
        loadGuest = function loadGuest(data, callback) {
      return new Guest(data.name, data.x, data.y, data.id, callback);
    },
        loadTable = function loadTable(data, callback) {
      return new RoundTable(data.x, data.y, data.seatCount, data.seatList, data.id, callback);
    },
        loadDesk = function loadDesk(data, callback) {
      return new Desk(data.x, data.y, data.rotation, data.id, callback);
    },
        i,
        l,
        myTableData,
        myTable,
        tableComplete = function tableComplete(table, data) {
      if (data.seatList && data.seatList.length) {
        var i2, l2, seat, guest;
        l2 = data.seatList.length;

        for (i2 = 0; i2 < l2; i2 += 1) {
          seat = data.seatList[i2];

          if (seat && seat.guest && seat.guest[0]) {
            guest = seat.guest[0]; //Hack : needs to be property, not an array.

            myGuests.push(loadGuest(guest));
            controller.PlaceGuestOnSeat(guest.id, seat.id);
          }
        }
      }
    };

    if (data.tableList) {
      l = data.tableList.length;

      var makeCompleteFunction = function makeCompleteFunction(data) {
        return function (table) {
          tableComplete(table, data);
        };
      };

      for (i = 0; i < l; i += 1) {
        myTableData = data.tableList[i];
        myTable = null;

        if (data.tableList[i].type === "desk") {
          myTable = loadDesk(myTableData, makeCompleteFunction(myTableData));
        } else if (data.tableList[i].type === "table") {
          myTable = loadTable(myTableData, makeCompleteFunction(myTableData));
        }

        myTables.push(myTable);

        if (myTable.dfdPromise) {
          arrAllDataDFD.push(myTable.dfdPromise);
        }
      }
    }

    if (data.guestList) {
      l = data.guestList.length;

      for (i = 0; i < l; i += 1) {
        myGuests.push(loadGuest(data.guestList[i]));
      }
    }

    $.when.apply($, arrAllDataDFD).done(function () {
      dfdRemoveAllData.resolve();
    });
    return dfdRemoveAllData;
  },
      Controller = function controller() {
    /*These functions grab the object from the stage. You can pass in the actual object or an ID, and they will cope with both.*/
    var getTableByID = function getTableByID(id) {
      var i,
          l = myTables.length;

      for (i = 0; i < l; i += 1) {
        if (myTables[i].id === id) {
          return myTables[i];
        }
      }

      return null;
    },
        getTable = function getTable(table) {
      if (typeof table === "number" || typeof table === "string") {
        table = getTableByID(table);
      }

      return table;
    },
        getGuestByID = function getGuestByID(id) {
      var i,
          l = myGuests.length;

      for (i = 0; i < l; i += 1) {
        if (myGuests[i].id === id) {
          return myGuests[i];
        }
      }

      return null;
    },
        getSeatByID = function getSeatByID(id) {
      var i,
          l = myTables.length,
          j,
          m;

      for (i = 0; i < l; i += 1) {
        if (myTables[i].tableSeatList) {
          j = 0;

          for (m = myTables[i].tableSeatList.length; j < m; j += 1) {
            if (myTables[i].tableSeatList[j].id === id) {
              return myTables[i].tableSeatList[j];
            }
          }
        }
      }

      return false;
    },
        getSeatMarkerByNumber = function getSeatMarkerByNumber(table, seatMarkerNumber) {
      var j,
          m = table.tableSeatAdditions.length;

      for (j = 0; j < m; j += 1) {
        if (table.tableSeatAdditions[j].seatNumber === seatMarkerNumber) {
          return table.tableSeatAdditions[j];
        }
      }

      return null;
    },
        getGuest = function getGuest(guest) {
      if (typeof guest === "number" || typeof guest === "string") {
        guest = getGuestByID(guest);
      }

      return guest;
    },
        getSeat = function getSeat(seat) {
      if (typeof seat === "number" || typeof seat === "string") {
        seat = getSeatByID(seat);
      }

      return seat;
    },
        getSeatCreatedByMarker = function getSeatCreatedByMarker(table, seatMarker) {
      var seat;
      table = getTable(table);

      if (typeof seatMarker === "number" || typeof seatMarker === "string") {
        seat = table.tableSeatList[seatMarker];
      }

      return seat;
    },
        getSeatMarker = function getSeatMarker(table, seatMarker) {
      var seat;
      table = getTable(table);

      if (typeof seatMarker === "number" || typeof seatMarker === "string") {
        seat = getSeatMarkerByNumber(table, seatMarker);
      }

      return seat;
    },
        topTableID = 0,
        topSeatID = 0,
        topGuestID = 0,

    /*This clever little class stores actions and their opposite actions - allowing undoable events*/
    ActionController = function ActionController() {
      var cachedActions = [],
          getAction = function getAction(action) {
        if (!action.name) {
          return cachedActions[action];
        }

        return action;
      };

      this.UndoActions = [];
      this.RedoActions = [];

      this.WrapMessage = function WrapMessage(data) {
        var plan = {
          _id: myPlanID
        }; // Hack: Let's only deal with one floorplan for the time being!

        return {
          data: data,
          plan: plan
        };
      };

      this.Add = function Add(action) {
        //var dfd = new $.Deferred();
        if (!cachedActions[action.name]) {
          action.oppositeName = "Undo" + action.name;
          cachedActions[action.name] = action;
          cachedActions[action.oppositeName] = {
            name: action.oppositeName,
            doAction: action.undoAction,
            undoAction: action.doAction,
            oppositeName: action.name
          };
        }

        if (socket) {
          socket.on(action.name + "Response", function (data) {
            console.log(data);
            action.doAction(data); //dfd.resolve();
            //controller.CreateSeatAndPlaceGuest(data);
          });
          socket.on(action.oppositeName + "Response", function (data) {
            console.log(data);
            action.undoAction(data); //dfd.resolve();
            //controller.CreateSeatAndPlaceGuest(data);
          });
        }
      };

      this.CallNext = function CallNext(arrActionList, callback) {
        var dfd = $.Deferred(),
            nextAction = arrActionList.pop(),
            currentDFD = this.CallInner(nextAction, nextAction.args, nextAction.callback).promise();
        $.when(currentDFD).done(function chainedAction() {
          if (arrActionList && arrActionList.length) {
            var innerDFD = this.CallNext(arrActionList, callback);
            $.when(innerDFD).done(function innerChaindAction() {
              dfd.resolveWith(this);
            });
          } else {
            dfd.resolveWith(this);
          }
        });
        return dfd;
      };

      this.CallMultiple = function CallMultiple(arrActionList, callback) {
        var arrListClone = this.CloneArray(arrActionList),
            reverse = false;
        this.UndoActions.push(arrListClone);
        return this.SequenceDeferred(arrActionList.reverse(), reverse, callback);
      };

      this.Call = function Call(myAction, args, callback) {
        var actionName = myAction,
            action;

        if (myAction && myAction.name) {
          actionName = myAction.name;
        }

        if (myAction && myAction.args) {
          args = myAction.args;
        }

        action = getAction(actionName);
        return this.CallMultiple([{
          name: action.name,
          oppositeName: action.oppositeName,
          args: args
        }], callback);
      };
      /*Deferred example*/


      this.CallInner = function CallInner(myAction, args, callback) {
        var actionName = myAction,
            dfdPromise;

        if (myAction && myAction.name) {
          actionName = myAction.name;
        }

        if (myAction && myAction.args) {
          args = myAction.args;
        }

        dfdPromise = this.CallInnerWithoutHistory(actionName, args, callback);
        return dfdPromise;
      };

      this.CallInnerWithoutHistory = function CallWithoutHistory(myAction, args, callback) {
        var actionName = myAction,
            action,
            dfdOverall = $.Deferred(),
            dfdAction = $.Deferred(),
            dfdSocket = $.Deferred(),
            ac = this;

        if (myAction && myAction.name) {
          actionName = myAction.name;
        }

        if (myAction && myAction.args) {
          args = myAction.args;
        }

        console.log("Doing" + actionName, args);
        action = getAction(actionName);

        if (action) {
          if (socket) {
            socket.emit(action.name, this.WrapMessage(args), function () {
              console.log("called" + actionName, args);
              dfdSocket.resolveWith(this);
            });
          } else {
            dfdSocket.resolveWith(this);
          }

          action.doAction(args, function resolveCallInnerWithoutHistory() {
            dfdAction.resolveWith(ac);
          });
        } else {
          console.log("No such action:" + actionName);
          dfdSocket.resolve({
            success: false,
            message: "No such socket."
          });
          dfdAction.resolve({
            success: false,
            message: "No such action."
          });
        }

        $.when(dfdAction, dfdSocket).then(function ResolveInnerWithoutHistory() {
          dfdOverall.resolveWith(ac);
        });
        return dfdOverall.promise();
      };

      this.CloneArray = function CloneArray(array) {
        return array.slice();
      };

      this.SequenceDeferred = function SequenceDeferred(list, reverse, callback) {
        var dfd = $.Deferred(),
            nextAction = list.pop(),
            swapAction = getAction(nextAction.name),
            currentDFDPromise = this.CallInnerWithoutHistory(reverse ? swapAction.oppositeName : nextAction.name, nextAction.args, nextAction.callback).promise(),
            ac = this;
        $.when(currentDFDPromise).done(function chainedAction() {
          if (list && list.length) {
            var innerDeferred = this.SequenceDeferred(list, reverse, callback);
            $.when(innerDeferred).done(function innerChaindAction() {
              dfd.resolveWith(this);
            });
          } else {
            dfd.resolveWith(ac);
          }
        });
        return dfd;
      };

      this.Undo = function Undo(callback) {
        var arrActionList = this.UndoActions.pop(),
            arrListClone = this.CloneArray(arrActionList),
            reverse = true;
        this.RedoActions.push(arrActionList);
        return this.SequenceDeferred(arrListClone, reverse, callback);
      };

      this.Redo = function Redo(callback) {
        var arrActionList = this.RedoActions.pop(),
            arrListClone = this.CloneArray(arrActionList),
            reverse = false;
        this.UndoActions.push(arrActionList);
        return this.SequenceDeferred(arrListClone.reverse(), reverse, callback);
      };
    };
    /*And now some concrete implementations. These could be assigned to the class later making the class itself reusuable.*/
    //seatMarker


    this.ClickAddSeatAtPosition = function ClickAddSeatAtPosition(table, seatNumber) {
      var data = {
        table: table.id,
        seatNumber: seatNumber
      };
      return this.ac.Call("AddSeatAtPosition", data);
    };

    this.ClickSeatRemove = function ClickSeatRemove(seat) {
      var data = {
        table: seat.table.id,
        seatNumber: seat.seatNumber
      };
      return this.ac.Call("UndoAddSeatAtPosition", data);
    };

    this.CreateSeatAndPlaceGuest = function CreateSeatAndPlaceGuest(guest, table, seatMarker) {
      guest = getGuest(guest);
      table = getTable(table);
      seatMarker = getSeatMarker(table, seatMarker);
      console.log("converting marker to seat");
      var seat = seatMarker.convertToSeat();
      $.when(seat.table.dfdPromise).then(function () {
        console.log("Finished creating seat - now place guest on new seat");
        guest.moveToSeat(seat);
      });
    };

    this.PlaceGuestOnSeat = function PlaceGuestOnSeat(guest, seat) {
      guest = getGuest(guest);
      seat = getSeat(seat);
      guest.moveToSeat(seat);
    }; //Example = Controller.PlaceGuestOnSeat(myGuests[0], myTables[4].tableSeatList[0]);


    this.RemoveGuestFromTheirSeat = function RemoveGuestFromTheirSeat(guest) {
      guest = getGuest(guest);
      guest.removeFromSeat();
    };

    this.RemoveGuestFromSeat = function RemoveGuestFromSeat(seat) {
      seat = getSeat(seat);
      seat.guest.removeFromSeat();
    };

    this.SwapGuests = function SwapGuests(guest1, guest2) {
      guest1 = getGuest(guest1);
      guest2 = getGuest(guest2);
      guest1.swapWithGuestAt(guest2.seat);
    };

    this.SwapGuestWithSeat = function SwapGuestWithSeat(guest, seat) {
      guest = getGuest(guest);
      seat = getSeat(seat);
      guest.swapWithGuestAt(seat);
    };

    this.NextTableID = function NextTableID() {
      var i,
          l = myTables.length;

      for (i = 0; i < l; i += 1) {
        if (myTables[i].id === topTableID) {
          topTableID += 1;
        }
      }

      return topTableID;
    };

    this.NextSeatID = function NextSeatID() {
      topSeatID += 1;
      return topSeatID;
    };

    this.NextGuestID = function NextGuestID() {
      var i,
          l = myGuests.length;

      for (i = 0; i < l; i += 1) {
        if (myGuests[i].id === topTableID) {
          topGuestID += 1;
        }
      }

      return topGuestID;
    };

    this.MoveGuestToSeatArea = function MoveGuestToSeatArea(model, mySeat) {
      var data;

      if (mySeat.isoccupied) {
        data = {
          guest1: model.id,
          guest2: mySeat.guest.id
        };
        return this.ac.Call("SwapGuestWithGuest", data);
      }

      if (mySeat.ismarker) {
        data = {
          guest: model.id,
          table: mySeat.table.id,
          seatMarker: mySeat.seatNumber
        };
        return this.ac.Call("PlaceGuestOnNewSeat", data);
      }

      data = {
        guest: model.id,
        seat: mySeat.id,
        guestOriginalSeat: model.seat ? model.seat.id : null
      };
      return this.ac.Call("PlaceGuestOnSeat", data);
    }; //When creating an action you should be using the raw objects.
    //Generally undo actions should be generated at the same time,
    //but occassionally added to after the original command has completed.
    //Example usage:
    //  ActionController.Call("PlaceGuestOnNewSeat",{guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat});
    //this will in turn create one of the following UNDO events:
    //  ActionController.Call("ReplaceGuestAndDeletePreviousSeat", {guest:guest,seat:seat});
    //which will remove the guest from their current seat, delete that seat and then move them to the
    //seat defined in the args. If Null it will move that guest off the stage entirely.
    //CreateSeatAndPlace = PlaceGuestOnNewSeat
    //  ActionController.Call("PlaceGuestOnNewSeat",{guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat});
    //  UNDO
    //  ActionController.Call("UndoPlaceGuestOnNewSeat", {guest:guest,table:table,seatMarker:seatMarker,guestOriginalSeat:guest.seat});
    //  ActionController.Call("PlaceGuestOnSeat",{guest:guest,seat:seat,guestOriginalSeat:guest.seat});
    //  UNDO
    //  ActionController.Call("UndoPlaceGuestOnSeat",{guest:guest,seat:seat,guestOriginalSeat:guest.seat});
    //  ActionController.Call("SwapGuestWithGuest",{guest1:guest,guest2:guest});
    //  UNDO
    //  ActionController.Call("UndoSwapGuestWithGuest",{guest1:guest,guest2:guest});
    //  ActionController.Call("AddSeatAtPosition", {table:table, seatNumber:seatNumber};
    //  UNDO
    //  ActionController.Call("UndoAddSeatAtPosition", {table:table, seatNumber:seatNumber};
    //  ActionController.Call("AddTable", {tableID:tableID, properties:{seatCount, width, colour}};
    //  UNDO
    //  ActionController.Call("UndoAddTable", {tableID:tableID, properties:{seatCount, width, colour}};
    //  ActionController.Call("AddGuest", {guestID:guestID, properties:{name, colour, gender}};
    //  UNDO
    //  ActionController.Call("UndoAddGuest", {guestID:guestID, properties:{name, colour, gender}};


    this.ac = new ActionController();
    this.ac.Add({
      name: "PlaceGuestOnNewSeat",
      doAction: function doActionPlaceGuestOnNewSeat(args, callback) {
        var guest = getGuest(args.guest),
            table = getTable(args.table),
            seatMarker = getSeatMarker(table, args.seatMarker),
            seat = seatMarker.convertToSeat();
        console.log("Convert to new seat from place guest on new seat");
        $.when(seat.table.dfdPromise).then(function whenPromiseDoActionPlaceGuestOnNewSeatNewSeat() {
          console.log("DONE! - Convert to new seat from place guest on new seat"); //guest.moveToSeat(seat);

          console.log("Place guest on new seat");
          $.when(guest.moveToSeat(seat)).then(function whenPromiseDoActionPlaceGuestOnNewSeatPlaceGuest() {
            console.log("DONE! - Place guest on new seat");

            if (callback) {
              callback();
            }
          });
        });
      },
      undoAction: function undoActionPlaceGuestOnNewSeat(args, callback) {
        var guest = getGuest(args.guest),
            table = getTable(args.table),
            seatFrom = getSeat(args.guestOriginalSeat),
            seatRemove = getSeatCreatedByMarker(table, args.seatMarker),
            dfdPromise;

        if (seatFrom) {
          console.log("undoActionPlaceGuestOnNewSeat - Move to seat");
          dfdPromise = guest.moveToSeat(seatFrom);
        } else {
          console.log("undoActionPlaceGuestOnNewSeat - Remove from seat");
          dfdPromise = guest.removeFromSeat();
        }

        $.when(dfdPromise).then(function undoActionPlaceGuestComplete() {
          console.log("DONE! - undoActionPlaceGuestOnNewSeatComplete");
          $.when(table.removeSeat(seatRemove.seatNumber)).then(function undoActionRemoveSeatComplete() {
            if (callback) {
              callback();
            }
          });
        });
      }
    });
    this.ac.Add({
      name: "PlaceGuestOnSeat",
      doAction: function doActionPlaceGuestOnSeat(args, callback) {
        var guest = getGuest(args.guest),
            seat = getSeat(args.seat);
        $.when(guest.moveToSeat(seat)).done(function () {
          if (callback) {
            callback();
          }
        });
      },
      undoAction: function undoActionPlaceGuestOnSeat(args, callback) {
        var guest = getGuest(args.guest),
            seatFrom = getSeat(args.guestOriginalSeat),
            dfdPromise;

        if (seatFrom) {
          dfdPromise = guest.moveToSeat(seatFrom);
        } else {
          dfdPromise = guest.removeFromSeat();
        }

        $.when(dfdPromise).then(function undoActionPlaceGuestOnSeatComplete() {
          console.log("DONE! - undoActionPlaceGuestOnSeatComplete");

          if (callback) {
            callback();
          }
        });
      }
    });
    this.ac.Add({
      name: "SwapGuestWithGuest",
      doAction: function doActionSwapGuestWithGuest(args, callback) {
        var guest1 = getGuest(args.guest1),
            guest2 = getGuest(args.guest2);
        $.when(guest1.swapWithGuestAt(guest2.seat)).then(function doActionSwapGuestWithGuestComplete() {
          console.log("DONE! - doActionSwapGuestWithGuestComplete");

          if (callback) {
            callback();
          }
        });
      },
      undoAction: function undoActionSwapGuestWithGuest(args, callback) {
        var guest1 = getGuest(args.guest1),
            guest2 = getGuest(args.guest2);
        $.when(guest2.swapWithGuestAt(guest1.seat)).then(function undoActionSwapGuestWithGuestComplete() {
          console.log("DONE! - undoActionSwapGuestWithGuestComplete");

          if (callback) {
            callback();
          }
        });
      }
    });
    this.ac.Add({
      name: "AddSeatAtPosition",
      doAction: function doActionAddSeatAtPosition(args, callback) {
        var table = getTable(args.table);
        $.when(table.addSeatFromMarker(args.seatNumber)).then(function doActionAddSeatAtPositionComplete() {
          console.log("DONE! - doActionAddSeatAtPositionComplete");

          if (callback) {
            callback();
          }
        });
      },
      undoAction: function undoActionAddSeatAtPosition(args, callback) {
        var table = getTable(args.table);
        $.when(table.removeSeat(args.seatNumber)).then(function undoActionAddSeatAtPositionComplete() {
          console.log("DONE! - undoActionAddSeatAtPositionComplete");

          if (callback) {
            callback();
          }
        });
      }
    });
    this.ac.Add({
      name: "AddTable",
      doAction: function doActionAddTable(args, callback) {
        $.when(loadData({
          tableList: [args]
        })).then(callback);
      },
      undoAction: function undoActionAddTable(args, callback) {
        var table = getTable(args.id);
        $.when(table.remove()).then(function () {
          myTables = _.reject(myTables, function undoActionAddTableRemoveItem(removeTable) {
            return removeTable.id === args.id;
          });

          if (callback) {
            callback();
          }
        });
      }
    });
    this.ac.Add({
      name: "AddGuest",
      doAction: function doActionAddGuest(args, callback) {
        $.when(loadData({
          guestList: [args]
        })).then(callback);
      },
      undoAction: function undoActionAddGuest(args, callback) {
        var guest = getGuest(args.id);
        $.when(guest.remove()).then(function whenPromiseAddGuest() {
          myGuests = _.reject(myGuests, function (removeGuest) {
            return removeGuest.id === args.id;
          });

          if (callback) {
            callback();
          }
        });
      }
    });
    this.ac.Add({
      name: "MoveTable",
      doAction: function doMoveTable(args, callback) {
        var table = getTable(args.table);
        console.log("MoveTable", args);
        table.animateTable(args.current, callback);
      },
      undoAction: function undoMoveTable(args, callback) {
        var table = getTable(args.table);
        console.log("UndoMoveTable", args);
        table.animateTable(args.previous, callback);
      }
    });
    this.ac.Add({
      name: "EditGuest",
      doAction: function doEditGuest(args, callback) {
        var guest = getGuest(args.guest);
        console.log("EditGuest", args);
        guest.SetName(args.current.name);

        if (callback) {
          callback();
        }
      },
      undoAction: function undoEditGuest(args, callback) {
        var guest = getGuest(args.guest);
        console.log("UndoEditGuest", args);
        guest.SetName(args.previous.name);

        if (callback) {
          callback();
        }
      }
    });
  },
      controller = new Controller(),
      hideAllEditPanels = function hideAllEditPanels() {
    $("#editGuest").hide();
    $("#editGuest").find("input").val("");
    $("#editPlan").hide();
    $("#editPlan").find("input").val("");
    $("#txtGuestName").change(function (e) {
      var previousGuest = {
        name: selectedGuestEdit.name
      },
          currentGuest = {
        name: $(e.currentTarget).val()
      };

      if (previousGuest.name !== currentGuest.name) {
        controller.ac.Call("EditGuest", {
          guest: selectedGuestEdit.id,
          previous: previousGuest,
          current: currentGuest
        });
      }
    }); //$("#txtPlanName").change(function (e) { });
  },
      showEditGuest = function showEditGuest(guest) {
    selectedGuestEdit = guest;
    hideAllEditPanels();
    $("#editGuest").show();
    $("#txtGuestName").val(guest.name);
  },

  /*showEditPlan = function (plan) {
      hideAllEditPanels();
      $("#editPlan").show();
      $("#txtPlanName").val(plan.name);
  },*/
  deletePlanData = function deletePlanData() {
    window.console.log("Attempting to deletePlanData");

    if (window.confirm("Are you sure you want to delete all the tables in this plan?")) {
      clearData();

      if (socket) {
        socket.emit('deletePlanData', controller.ac.WrapMessage());
      }
    }
  },
      animationTime = 300,
      colGuest = "yellow",
      colGuestStroke = "black",
      colGuestMoveStroke = "blue",
      colGuestSwapStroke = "purple",
      colTable = "purple",
      colTableStroke = "black",
      colTableSelectedStroke = "yellow",
      colToolbarBack = "cyan",
      colSeatSelectedStroke = "blue",
      colDisabled = "grey",
      Generic = {
    PathGetX: function PathGetX(graphic) {
      var myGraphic = graphic || this.graphic;

      if (myGraphic) {
        return myGraphic.attr("ox");
      }

      return 0;
    },
    PathGetY: function PathGetY(graphic) {
      var myGraphic = graphic || this.graphic;

      if (myGraphic) {
        return myGraphic.attr("oy");
      }

      return 0;
    },
    GetRotation: function GetRotation(graphic) {
      var myGraphic = graphic || this.graphic;
      return myGraphic.attr("rotation") || 0;
    },
    ShapeGetX: function ShapeGetX(graphic) {
      var myGraphic = graphic || this.graphic;
      return myGraphic.attr("cx");
    },
    ShapeGetY: function ShapeGetY(graphic) {
      var myGraphic = graphic || this.graphic;
      return myGraphic.attr("cy");
    },
    SetRelativeGraphicPosition: function SetRelativeGraphicPosition(position, graphic) {
      var myGraphic = graphic || this.graphic,
          rotation = this.rotation;
      myGraphic.attr({
        ox: position.x,
        oy: position.y
      });
      myGraphic.transform("t" + position.x + "," + position.y + "R" + rotation);
    },
    SetAbsoluteGraphicPosition: function SetAbsoluteGraphicPosition(position, graphic) {
      var myGraphic = graphic || this.graphic;
      myGraphic.attr({
        ox: position.x,
        oy: position.y
      });
      myGraphic.transform("T" + position.x + "," + position.y);
    },
    SetShapeGraphicPosition: function SetShapeGraphicPosition(position, graphic) {
      this.graphic.attr({
        cx: position.x,
        cy: position.y
      });
    },
    SetRotation: function SetRotation(r, graphic) {
      var myGraphic = graphic || this.graphic,
          currentX = this.GetX(),
          currentY = this.GetY(),
          rotation = r;
      myGraphic.transform("t" + currentX + "," + currentY + "R" + rotation);
    },
    Disable: function Disable(graphic, colour) {
      var myGraphic = graphic || this.graphic,
          myColour = colour || colDisabled;
      myGraphic.PreviousColourFill = myGraphic.attr("fill");

      if (myGraphic) {
        myGraphic.animate({
          "stroke-width": 1,
          "fill": myColour
        }, animationTime);
      }
      /*graphic.mouseover(function (event) { });
      graphic.mouseout(function (event) { });*/

    },
    Enable: function Enable(graphic, colour) {
      var myGraphic = graphic || this.graphic,
          myColour = colour || colTableSelectedStroke;
      myGraphic.PreviousColourFill = myGraphic.attr("fill");

      if (myGraphic) {
        myGraphic.animate({
          "fill": myColour
        }, animationTime);
      }

      graphic.mouseover(function (event) {
        logEvent("Over ToolboxIcon");
        Generic.Highlight(this);
      });
      graphic.mouseout(function (event) {
        logEvent("Out ToolboxIcon");
        Generic.Unhighlight(this);
      });
    },
    Highlight: function Highlight(graphic, colour) {
      var myGraphic = graphic || this.graphic,
          myColour = colour || colTableSelectedStroke;
      myGraphic.PreviousColour = myGraphic.attr("stroke");

      if (myGraphic) {
        myGraphic.animate({
          "stroke-width": 2,
          "stroke": myColour
        }, animationTime);
      }
    },
    Unhighlight: function Unhighlight(graphic, colour) {
      var myGraphic = graphic || this.graphic,
          myColour = colour || myGraphic.PreviousColour;

      if (myGraphic) {
        myGraphic.animate({
          "stroke-width": 1,
          "stroke": myColour
        }, animationTime);
      }
    }
  },
      requestPlan = function requestPlan() {
    console.log(["Request new plan", controller.ac.WrapMessage()]);

    if (socket) {
      socket.emit('GetPlan', controller.ac.WrapMessage());
    }
  },
      shapes = {
    guestOLD: "M -10 -10 L 10 -10 L 0 10 z",
    desk: "m-61,-30l0,60l120,0l0,-60c-45,20 -75,20 -120,0z",
    seat: "M -20 -10 L 20 -10 L 0 10 z",
    guest: "m5.35835,-0.51847c-0.611,-1.104 -1.359,-1.998 -2.109,-2.623c-0.875,0.641 -1.941,1.031 -3.103,1.031c-1.164,0 -2.231,-0.391 -3.105,-1.031c-0.75,0.625 -1.498,1.519 -2.111,2.623c-1.422,2.563 -1.578,5.192 -0.35,5.874c0.55,0.307 1.127,0.078 1.723,-0.496c-0.105,0.582 -0.166,1.213 -0.166,1.873c0,2.932 1.139,5.307 2.543,5.307c0.846,0 1.265,-0.865 1.466,-2.189c0.201,1.324 0.62,2.189 1.463,2.189c1.406,0 2.545,-2.375 2.545,-5.307c0,-0.66 -0.061,-1.291 -0.168,-1.873c0.598,0.574 1.174,0.803 1.725,0.496c1.228,-0.682 1.069,-3.311 -0.353,-5.874zm-5.213,-2.592c2.362,0 4.278,-1.916 4.278,-4.279s-1.916,-4.279 -4.278,-4.279c-2.363,0 -4.28,1.916 -4.28,4.279s1.917,4.279 4.28,4.279z",
    logogithub: "M28.436,15.099c-1.201-0.202-2.451-0.335-3.466-0.371l-0.179-0.006c0.041-0.09,0.072-0.151,0.082-0.16c0.022-0.018,0.04-0.094,0.042-0.168c0-0.041,0.018-0.174,0.046-0.35c0.275,0.01,0.64,0.018,1.038,0.021c1.537,0.012,3.145,0.136,4.248,0.331c0.657,0.116,0.874,0.112,0.389-0.006c-0.491-0.119-1.947-0.294-3.107-0.37c-0.779-0.053-1.896-0.073-2.554-0.062c0.019-0.114,0.041-0.241,0.064-0.371c0.093-0.503,0.124-1.009,0.126-2.016c0.002-1.562-0.082-1.992-0.591-3.025c-0.207-0.422-0.441-0.78-0.724-1.104c0.247-0.729,0.241-1.858-0.015-2.848c-0.211-0.812-0.285-0.864-1.021-0.708C22.19,4.019,21.69,4.2,21.049,4.523c-0.303,0.153-0.721,0.391-1.024,0.578c-0.79-0.278-1.607-0.462-2.479-0.561c-0.884-0.1-3.051-0.044-3.82,0.098c-0.752,0.139-1.429,0.309-2.042,0.511c-0.306-0.189-0.75-0.444-1.067-0.604C9.973,4.221,9.473,4.041,8.847,3.908c-0.734-0.157-0.81-0.104-1.02,0.708c-0.26,1.003-0.262,2.151-0.005,2.878C7.852,7.577,7.87,7.636,7.877,7.682c-1.042,1.312-1.382,2.78-1.156,4.829c0.059,0.534,0.15,1.024,0.277,1.473c-0.665-0.004-1.611,0.02-2.294,0.064c-1.162,0.077-2.618,0.25-3.109,0.369c-0.484,0.118-0.269,0.122,0.389,0.007c1.103-0.194,2.712-0.32,4.248-0.331c0.29-0.001,0.561-0.007,0.794-0.013c0.07,0.237,0.15,0.463,0.241,0.678L7.26,14.759c-1.015,0.035-2.264,0.168-3.465,0.37c-0.901,0.151-2.231,0.453-2.386,0.54c-0.163,0.091-0.03,0.071,0.668-0.106c1.273-0.322,2.928-0.569,4.978-0.741l0.229-0.02c0.44,1.022,1.118,1.802,2.076,2.41c0.586,0.373,1.525,0.756,1.998,0.816c0.13,0.016,0.508,0.094,0.84,0.172c0.333,0.078,0.984,0.195,1.446,0.262h0.011c-0.009,0.006-0.017,0.01-0.025,0.016c-0.56,0.291-0.924,0.744-1.169,1.457c-0.11,0.033-0.247,0.078-0.395,0.129c-0.529,0.18-0.735,0.217-1.271,0.221c-0.556,0.004-0.688-0.02-1.02-0.176c-0.483-0.225-0.933-0.639-1.233-1.133c-0.501-0.826-1.367-1.41-2.089-1.41c-0.617,0-0.734,0.25-0.288,0.615c0.672,0.549,1.174,1.109,1.38,1.537c0.116,0.24,0.294,0.611,0.397,0.824c0.109,0.227,0.342,0.535,0.564,0.748c0.522,0.498,1.026,0.736,1.778,0.848c0.504,0.074,0.628,0.074,1.223-0.002c0.287-0.035,0.529-0.076,0.746-0.127c0,0.244,0,0.525,0,0.855c0,1.766-0.021,2.334-0.091,2.5c-0.132,0.316-0.428,0.641-0.716,0.787c-0.287,0.146-0.376,0.307-0.255,0.455c0.067,0.08,0.196,0.094,0.629,0.066c0.822-0.051,1.403-0.355,1.699-0.891c0.095-0.172,0.117-0.518,0.147-2.318c0.032-1.953,0.046-2.141,0.173-2.42c0.077-0.166,0.188-0.346,0.25-0.395c0.104-0.086,0.111,0.084,0.111,2.42c-0.001,2.578-0.027,2.889-0.285,3.385c-0.058,0.113-0.168,0.26-0.245,0.33c-0.135,0.123-0.192,0.438-0.098,0.533c0.155,0.154,0.932-0.088,1.356-0.422c0.722-0.572,0.808-1.045,0.814-4.461l0.003-2.004l0.219,0.021l0.219,0.02l0.036,2.621c0.041,2.951,0.047,2.994,0.549,3.564c0.285,0.322,0.572,0.5,1.039,0.639c0.625,0.188,0.813-0.102,0.393-0.605c-0.457-0.547-0.479-0.756-0.454-3.994c0.017-2.076,0.017-2.076,0.151-1.955c0.282,0.256,0.336,0.676,0.336,2.623c0,2.418,0.069,2.648,0.923,3.07c0.399,0.195,0.511,0.219,1.022,0.221c0.544,0.002,0.577-0.006,0.597-0.148c0.017-0.115-0.05-0.193-0.304-0.348c-0.333-0.205-0.564-0.467-0.709-0.797c-0.055-0.127-0.092-0.959-0.117-2.672c-0.036-2.393-0.044-2.502-0.193-2.877c-0.201-0.504-0.508-0.902-0.897-1.166c-0.101-0.066-0.202-0.121-0.333-0.162c0.161-0.016,0.317-0.033,0.468-0.055c1.572-0.209,2.403-0.383,3.07-0.641c1.411-0.543,2.365-1.445,2.882-2.724c0.046-0.114,0.092-0.222,0.131-0.309l0.398,0.033c2.051,0.173,3.706,0.42,4.979,0.743c0.698,0.177,0.831,0.198,0.668,0.105C30.666,15.551,29.336,15.25,28.436,15.099zM22.422,15.068c-0.233,0.512-0.883,1.17-1.408,1.428c-0.518,0.256-1.33,0.451-2.25,0.544c-0.629,0.064-4.137,0.083-4.716,0.026c-1.917-0.188-2.991-0.557-3.783-1.296c-0.75-0.702-1.1-1.655-1.039-2.828c0.039-0.734,0.216-1.195,0.679-1.755c0.421-0.51,0.864-0.825,1.386-0.985c0.437-0.134,1.778-0.146,3.581-0.03c0.797,0.051,1.456,0.051,2.252,0c1.886-0.119,3.145-0.106,3.61,0.038c0.731,0.226,1.397,0.834,1.797,1.644c0.18,0.362,0.215,0.516,0.241,1.075C22.808,13.699,22.675,14.517,22.422,15.068zM12.912,11.762c-1.073-0.188-1.686,1.649-0.863,2.587c0.391,0.445,0.738,0.518,1.172,0.248c0.402-0.251,0.62-0.72,0.62-1.328C13.841,12.458,13.472,11.862,12.912,11.762zM19.425,11.872c-1.073-0.188-1.687,1.647-0.864,2.586c0.392,0.445,0.738,0.519,1.173,0.247c0.401-0.25,0.62-0.72,0.62-1.328C20.354,12.569,19.985,11.971,19.425,11.872zM16.539,15.484c-0.023,0.074-0.135,0.184-0.248,0.243c-0.286,0.147-0.492,0.096-0.794-0.179c-0.187-0.169-0.272-0.258-0.329-0.081c-0.053,0.164,0.28,0.493,0.537,0.594c0.236,0.094,0.405,0.097,0.661-0.01c0.254-0.106,0.476-0.391,0.476-0.576C16.842,15.303,16.595,15.311,16.539,15.484zM16.222,14.909c0.163-0.144,0.2-0.44,0.044-0.597s-0.473-0.133-0.597,0.043c-0.144,0.206-0.067,0.363,0.036,0.53C15.865,15.009,16.08,15.034,16.222,14.909z",
    logonodejs: "M4.783,4.458L2.59,3.196C2.553,3.174,2.511,3.163,2.469,3.161H2.447C2.405,3.163,2.363,3.174,2.326,3.196L0.133,4.458C0.051,4.505,0,4.593,0,4.688l0.005,3.398c0,0.047,0.024,0.092,0.066,0.114c0.041,0.024,0.091,0.024,0.132,0l1.303-0.746c0.083-0.049,0.132-0.136,0.132-0.229V5.637c0-0.095,0.05-0.183,0.132-0.229l0.555-0.32c0.041-0.023,0.086-0.035,0.132-0.035c0.045,0,0.092,0.012,0.132,0.035l0.555,0.32c0.082,0.047,0.133,0.135,0.133,0.229v1.588c0,0.094,0.051,0.182,0.132,0.229l1.303,0.746c0.041,0.024,0.092,0.024,0.132,0c0.041-0.022,0.066-0.067,0.066-0.114l0.004-3.398C4.915,4.593,4.865,4.505,4.783,4.458zM17.93,0.745l-1.305-0.729c-0.042-0.023-0.091-0.022-0.132,0.001c-0.041,0.024-0.065,0.067-0.065,0.114v3.365c0,0.033-0.018,0.064-0.046,0.081s-0.064,0.017-0.093,0l-0.549-0.316c-0.082-0.047-0.183-0.047-0.265,0l-2.193,1.266c-0.082,0.047-0.133,0.135-0.133,0.229V7.29c0,0.095,0.051,0.182,0.132,0.229l2.194,1.267c0.082,0.048,0.183,0.048,0.265,0l2.194-1.267c0.082-0.048,0.133-0.135,0.133-0.229V0.977C18.066,0.88,18.014,0.792,17.93,0.745zM16.421,6.458c0,0.023-0.013,0.045-0.033,0.057l-0.753,0.435c-0.021,0.012-0.045,0.012-0.066,0l-0.753-0.435c-0.021-0.012-0.033-0.034-0.033-0.057v-0.87c0-0.023,0.013-0.045,0.033-0.058l0.753-0.435c0.021-0.012,0.045-0.012,0.066,0l0.753,0.435c0.021,0.012,0.033,0.034,0.033,0.058V6.458zM24.473,4.493l-2.18-1.266c-0.082-0.047-0.183-0.048-0.265,0l-2.193,1.266c-0.082,0.047-0.132,0.135-0.132,0.229v2.532c0,0.096,0.051,0.184,0.133,0.23l2.18,1.242c0.08,0.045,0.179,0.046,0.26,0.001l1.318-0.732c0.042-0.023,0.067-0.067,0.068-0.115c0-0.048-0.025-0.092-0.066-0.116l-2.207-1.266c-0.041-0.023-0.066-0.067-0.066-0.115V5.59c0-0.047,0.025-0.091,0.065-0.115l0.688-0.396c0.041-0.024,0.091-0.024,0.132,0l0.688,0.396c0.041,0.023,0.066,0.067,0.066,0.115v0.625c0,0.047,0.025,0.091,0.066,0.114c0.041,0.024,0.092,0.024,0.132,0l1.314-0.764c0.081-0.047,0.132-0.135,0.132-0.229V4.722C24.605,4.628,24.555,4.541,24.473,4.493zM11.363,4.48L9.169,3.214c-0.082-0.047-0.183-0.047-0.265,0L6.711,4.48C6.629,4.527,6.579,4.615,6.579,4.709v2.534c0,0.095,0.051,0.182,0.133,0.229l2.193,1.267c0.082,0.048,0.183,0.048,0.265,0l2.193-1.267c0.082-0.048,0.132-0.135,0.132-0.229V4.709C11.495,4.615,11.445,4.527,11.363,4.48zM31.019,4.382L28.95,3.187c-0.13-0.074-0.304-0.074-0.435,0l-2.068,1.195c-0.135,0.077-0.218,0.222-0.218,0.377v2.386c0,0.156,0.083,0.301,0.218,0.378l0.542,0.312c0.263,0.13,0.356,0.13,0.477,0.13c0.389,0,0.612-0.236,0.612-0.646V4.962c0-0.033-0.027-0.06-0.06-0.06h-0.263c-0.033,0-0.061,0.026-0.061,0.06v2.356c0,0.182-0.188,0.363-0.495,0.209l-0.566-0.326c-0.021-0.012-0.033-0.033-0.033-0.057V4.759c0-0.023,0.013-0.045,0.033-0.057l2.067-1.193c0.019-0.011,0.044-0.011,0.063,0l2.067,1.193c0.02,0.012,0.032,0.034,0.032,0.057v2.386c0,0.023-0.013,0.046-0.032,0.057l-2.068,1.193c-0.018,0.012-0.045,0.012-0.063,0l-0.53-0.314c-0.017-0.01-0.036-0.013-0.052-0.004c-0.146,0.083-0.175,0.094-0.312,0.143c-0.034,0.012-0.084,0.031,0.019,0.09l0.691,0.408c0.065,0.038,0.141,0.059,0.217,0.059s0.151-0.021,0.218-0.059l2.068-1.194c0.134-0.078,0.217-0.222,0.217-0.378V4.759C31.235,4.604,31.152,4.459,31.019,4.382zM29.371,6.768c-0.548,0-0.668-0.138-0.708-0.41c-0.005-0.029-0.029-0.051-0.06-0.051h-0.268c-0.033,0-0.06,0.026-0.06,0.06c0,0.349,0.189,0.765,1.095,0.765c0.655,0,1.031-0.259,1.031-0.709c0-0.447-0.302-0.566-0.938-0.65c-0.643-0.085-0.708-0.128-0.708-0.279c0-0.125,0.056-0.29,0.531-0.29c0.425,0,0.581,0.091,0.646,0.378c0.006,0.027,0.03,0.047,0.059,0.047h0.269c0.017,0,0.032-0.007,0.044-0.019c0.011-0.013,0.017-0.029,0.016-0.046c-0.042-0.493-0.37-0.723-1.032-0.723c-0.59,0-0.941,0.249-0.941,0.666c0,0.453,0.35,0.578,0.916,0.634c0.677,0.066,0.729,0.166,0.729,0.298C29.992,6.669,29.807,6.768,29.371,6.768zM22.128,5.446l-0.42,0.243c-0.016,0.009-0.025,0.026-0.025,0.044v0.486c0,0.019,0.01,0.035,0.025,0.044l0.42,0.243c0.016,0.009,0.035,0.009,0.052,0l0.421-0.243c0.016-0.009,0.025-0.025,0.025-0.044V5.733c0-0.018-0.01-0.035-0.025-0.044L22.18,5.446C22.163,5.438,22.144,5.438,22.128,5.446z",
    logoraph: "M27.777,18.941c0.584-0.881,0.896-1.914,0.896-2.998c0-1.457-0.567-2.826-1.598-3.854l-6.91-6.911l-0.003,0.002c-0.985-0.988-2.35-1.6-3.851-1.6c-1.502,0-2.864,0.612-3.85,1.6H12.46l-6.911,6.911c-1.031,1.029-1.598,2.398-1.598,3.854c0,1.457,0.567,2.826,1.598,3.854l6.231,6.229c0.25,0.281,0.512,0.544,0.789,0.785c1.016,0.961,2.338,1.49,3.743,1.49c1.456,0,2.825-0.565,3.854-1.598l6.723-6.725c0.021-0.019,0.034-0.032,0.051-0.051l0.14-0.138c0.26-0.26,0.487-0.54,0.688-0.838c0.004-0.008,0.01-0.015,0.014-0.021L27.777,18.941zM26.658,15.946c0,0.678-0.197,1.326-0.561,1.879c-0.222,0.298-0.447,0.559-0.684,0.784L25.4,18.625c-1.105,1.052-2.354,1.35-3.414,1.35c-0.584,0-1.109-0.09-1.523-0.195c-2.422-0.608-5.056-2.692-6.261-5.732c0.649,0.274,1.362,0.426,2.11,0.426c2.811,0,5.129-2.141,5.415-4.877l3.924,3.925C26.301,14.167,26.658,15.029,26.658,15.946zM16.312,5.6c1.89,0,3.426,1.538,3.426,3.427c0,1.89-1.536,3.427-3.426,3.427c-1.889,0-3.426-1.537-3.426-3.427C12.886,7.138,14.423,5.6,16.312,5.6zM6.974,18.375c-0.649-0.648-1.007-1.512-1.007-2.429c0-0.917,0.357-1.78,1.007-2.428l2.655-2.656c-0.693,2.359-0.991,4.842-0.831,7.221c0.057,0.854,0.175,1.677,0.345,2.46L6.974,18.375zM11.514,11.592c0.583,4.562,4.195,9.066,8.455,10.143c0.693,0.179,1.375,0.265,2.033,0.265c0.01,0,0.02,0,0.027,0l-3.289,3.289c-0.648,0.646-1.512,1.006-2.428,1.006c-0.638,0-1.248-0.177-1.779-0.5l0.001-0.002c-0.209-0.142-0.408-0.295-0.603-0.461c-0.015-0.019-0.031-0.026-0.046-0.043l-0.665-0.664c-1.367-1.567-2.227-3.903-2.412-6.671C10.669,15.856,10.921,13.673,11.514,11.592",
    logotwitter: "M14.605,13.11c0.913-2.851,2.029-4.698,3.313-6.038c0.959-1,1.453-1.316,0.891-0.216c0.25-0.199,0.606-0.464,0.885-0.605c1.555-0.733,1.442-0.119,0.373,0.54c2.923-1.045,2.82,0.286-0.271,0.949c2.527,0.047,5.214,1.656,5.987,5.077c0.105,0.474-0.021,0.428,0.464,0.514c1.047,0.186,2.03,0.174,2.991-0.13c-0.104,0.708-1.039,1.167-2.497,1.471c-0.541,0.112-0.651,0.083-0.005,0.229c0.799,0.179,1.69,0.226,2.634,0.182c-0.734,0.846-1.905,1.278-3.354,1.296c-0.904,3.309-2.976,5.678-5.596,7.164c-6.152,3.492-15.108,2.984-19.599-3.359c2.947,2.312,7.312,2.821,10.555-0.401c-2.125,0-2.674-1.591-0.99-2.449c-1.595-0.017-2.608-0.521-3.203-1.434c-0.226-0.347-0.229-0.374,0.14-0.64c0.405-0.293,0.958-0.423,1.528-0.467c-1.651-0.473-2.66-1.335-3.009-2.491c-0.116-0.382-0.134-0.363,0.256-0.462c0.38-0.097,0.87-0.148,1.309-0.17C6.11,10.88,5.336,9.917,5.139,8.852c-0.186-1.006,0.005-0.748,0.758-0.46C9.263,9.68,12.619,11.062,14.605,13.11L14.605,13.11z",
    iconback: "M21.871,9.814 15.684,16.001 21.871,22.188 18.335,25.725 8.612,16.001 18.335,6.276z",
    iconforward: "M10.129,22.186 16.316,15.999 10.129,9.812 13.665,6.276 23.389,15.999 13.665,25.725z",
    icontrash: "M20.826,5.75l0.396,1.188c1.54,0.575,2.589,1.44,2.589,2.626c0,2.405-4.308,3.498-8.312,3.498c-4.003,0-8.311-1.093-8.311-3.498c0-1.272,1.21-2.174,2.938-2.746l0.388-1.165c-2.443,0.648-4.327,1.876-4.327,3.91v2.264c0,1.224,0.685,2.155,1.759,2.845l0.396,9.265c0,1.381,3.274,2.5,7.312,2.5c4.038,0,7.313-1.119,7.313-2.5l0.405-9.493c0.885-0.664,1.438-1.521,1.438-2.617V9.562C24.812,7.625,23.101,6.42,20.826,5.75zM11.093,24.127c-0.476-0.286-1.022-0.846-1.166-1.237c-1.007-2.76-0.73-4.921-0.529-7.509c0.747,0.28,1.58,0.491,2.45,0.642c-0.216,2.658-0.43,4.923,0.003,7.828C11.916,24.278,11.567,24.411,11.093,24.127zM17.219,24.329c-0.019,0.445-0.691,0.856-1.517,0.856c-0.828,0-1.498-0.413-1.517-0.858c-0.126-2.996-0.032-5.322,0.068-8.039c0.418,0.022,0.835,0.037,1.246,0.037c0.543,0,1.097-0.02,1.651-0.059C17.251,18.994,17.346,21.325,17.219,24.329zM21.476,22.892c-0.143,0.392-0.69,0.95-1.165,1.235c-0.474,0.284-0.817,0.151-0.754-0.276c0.437-2.93,0.214-5.209-0.005-7.897c0.881-0.174,1.708-0.417,2.44-0.731C22.194,17.883,22.503,20.076,21.476,22.892zM11.338,9.512c0.525,0.173,1.092-0.109,1.268-0.633h-0.002l0.771-2.316h4.56l0.771,2.316c0.14,0.419,0.53,0.685,0.949,0.685c0.104,0,0.211-0.017,0.316-0.052c0.524-0.175,0.808-0.742,0.633-1.265l-1.002-3.001c-0.136-0.407-0.518-0.683-0.945-0.683h-6.002c-0.428,0-0.812,0.275-0.948,0.683l-1,2.999C10.532,8.77,10.815,9.337,11.338,9.512z"
  },
      inrange = false,
      dragThreshold = 15,
      scene = {
    SeatConflictCheck: function SeatConflictCheck(thisSeat) {
      var i = 0,
          l = seatList.length,
          seatCheck;
      logEvent("scene.SeatConflictCheck");

      for (i = 0; i < l; i += 1) {
        seatCheck = seatList[i];

        if (seatCheck.guest === thisSeat.guest && seatCheck !== thisSeat) {
          logEvent("Seat conflict");
          seatCheck.guest = false;
          seatCheck.isoccupied = false;
        }
      }
    },
    GetCachedListOfSeatAreas: function GetCachedListOfSeatAreas() {
      var i = 0,
          l = seatList.length,
          possibleSeats = [];

      for (i = 0; i < l; i += 1) {
        possibleSeats[i] = {
          t: seatList[i].GetY() - dragThreshold,
          r: seatList[i].GetX() + dragThreshold,
          b: seatList[i].GetY() + dragThreshold,
          l: seatList[i].GetX() - dragThreshold
        };
      }

      return possibleSeats;
    }
  },
      pathGenerateCircularArc = function pathGenerateCircularArc(point1, point2, radius) {
    point1.x = point1.x || 0;
    point1.y = point1.y || 0;
    point2.x = point2.x || 0;
    point2.y = point2.y || 0;
    return "M" + point1.x + " " + point1.y + " L " + point1.x + " " + point1.y + " A " + radius + " " + radius + " 0 0 1 " + point2.x + " " + point2.y;
  },
      ToolBar = function ToolBar() {
    var lnkUndo = paper.path(shapes.iconback),
        lnkRedo = paper.path(shapes.iconforward),
        lnkDelete = paper.path(shapes.icontrash),
        lnkGitH = paper.path(shapes.logogithub),
        lnkNode = paper.path(shapes.logonodejs),
        lnkRaph = paper.path(shapes.logoraph),
        lnkTwit = paper.path(shapes.logotwitter);
    this.background = paper.rect(600, 20, 200, 600, 5);
    this.background.attr({
      fill: colToolbarBack,
      stroke: colTableStroke,
      model: this
    });
    this.toolBox = [];

    this.generateGuestSelect = function () {
      var obj = {
        graphic: undefined,
        type: "guest",
        createObject: function createObject(x, y) {
          if (!x) {
            x = 30;
          }

          if (!y) {
            y = 30;
          }

          return controller.ac.Call("AddGuest", {
            id: controller.NextGuestID(),
            //Collisions possible...?
            name: "Example New Guest",
            x: x,
            y: y
          });
        }
      },
          guestSelect = paper.path(shapes.guest);
      guestSelect.attr({
        fill: colGuest,
        stroke: colGuestStroke,
        model: obj,
        ox: 0,
        oy: 0
      });
      obj.graphic = guestSelect;
      return obj;
    };

    this.generateTableSelect = function () {
      var obj = {
        graphic: undefined,
        type: "table",
        createObject: function createObject(x, y) {
          if (!x) {
            x = 200;
          }

          if (!y) {
            y = 200;
          }

          controller.ac.Call("AddTable", {
            id: controller.NextTableID(),
            //Collisions possible...?
            type: "table",
            x: x,
            y: y,
            seatCount: 5
          });
        }
      },
          tableSelect = paper.circle(0, 0, 20);
      tableSelect.attr({
        fill: colTable,
        stroke: colTableStroke,
        model: obj,
        ox: 0,
        oy: 0,
        type: "table"
      });
      obj.graphic = tableSelect;
      return obj;
    };

    this.generateDeskSelect = function () {
      var obj = {
        graphic: undefined,
        type: "desk",
        createObject: function createObject(x, y) {
          if (!x) {
            x = 400;
          }

          if (!y) {
            y = 400;
          }

          controller.ac.Call("AddTable", {
            id: controller.NextTableID(),
            //Collisions possible...?
            type: "desk",
            x: x,
            y: y,
            rotation: 90
          });
        }
      },
          tableSelect = paper.path(shapes.desk);
      tableSelect.attr({
        fill: colTable,
        stroke: colTableStroke,
        model: obj,
        ox: 0,
        oy: 0,
        type: "desk"
      });
      obj.graphic = tableSelect;
      return obj;
    };

    this.AddToolBoxItem = function (obj, helperText, type) {
      var item = obj.graphic,
          offsetY = this.toolBox.length * 50,
          start = function start(event) {
        this.ox = this.attr("ox");
        this.oy = this.attr("oy");
        this.animate({
          "stroke-width": 3,
          opacity: 0.7
        }, animationTime);
      },
          move = function move(mx, my) {
        var model = this.attr("model"),
            mouseCX = this.ox + mx,
            mouseCY = this.oy + my,
            myStroke = colGuestStroke;
        model.setGraphicPosition({
          x: mouseCX,
          y: mouseCY
        });
        this.attr({
          stroke: myStroke
        });
      },
          up = function up() {
        var dfpCreateGuest,
            model = this.attr("model"),
            inToolBox = MyToolBar.background.getBBox().x < model.GetX();

        if (inToolBox) {
          dfpCreateGuest = model.createObject();
        } else {
          dfpCreateGuest = model.createObject(model.GetX(), model.GetY());
        }

        this.animate({
          "stroke-width": 2,
          opacity: 1
        }, animationTime);
        model.setGraphicPosition({
          x: this.ox,
          y: this.oy
        });
        $.when(dfpCreateGuest).done(function () {
          showEditGuest(model);
        });
      };

      this.toolBox.push(obj);
      this.type = type;
      item.transform("t650," + offsetY);
      item.attr({
        ox: 650,
        oy: offsetY
      });
      item.mouseover(function (event) {
        logEvent("Over ToolboxItem");
        Generic.Highlight(this);
        this.attr("model").text = paper.text(this.attr("ox") + 75, this.attr("oy"), helperText);
        this.attr("model").text.show();
      });
      item.mouseout(function (event) {
        logEvent("Out ToolboxItem");
        Generic.Unhighlight(this);

        if (this.attr("model").text) {
          this.attr("model").text.hide();
        }
      });
      obj.setGraphicPosition = Generic.SetRelativeGraphicPosition;
      obj.GetX = Generic.PathGetX;
      obj.GetY = Generic.PathGetY;
      item.drag(move, start, up);
    };

    this.AddToolBoxItem(this.generateGuestSelect(), "Add new person", "guest");
    this.AddToolBoxItem(this.generateTableSelect(), "Add new table", "table");
    this.AddToolBoxItem(this.generateDeskSelect(), "Add new desk", "desk");
    this.iconLeft = 0;
    this.iconTop = 450;

    this.enableButton = function (icon) {
      Generic.Enable(icon);
    };

    this.disableButton = function (icon) {
      Generic.Disable(icon);
    };

    this.applyStylingToIcon = function (icon, text, clickevent) {
      this.iconLeft = this.iconLeft + 40;
      var iconX = 600 + this.iconLeft;
      icon.attr({
        fill: colGuest,
        stroke: colGuestStroke,
        model: this,
        transform: "t" + iconX + "," + this.iconTop
      });
      icon.mouseover(function (event) {
        logEvent("Over ToolboxIcon");
        Generic.Highlight(this);
      });
      icon.mouseout(function (event) {
        logEvent("Out ToolboxIcon");
        Generic.Unhighlight(this);
      });
      icon.click(clickevent);
    };

    this.applyStylingToIcon(lnkUndo, "undo", function (e) {
      controller.ac.Undo();
    });
    this.applyStylingToIcon(lnkRedo, "redo", function (e) {
      controller.ac.Redo();
    });
    this.applyStylingToIcon(lnkDelete, "delete", function (e) {
      deletePlanData();
    });
    this.disableButton(lnkUndo);
    this.iconLeft = 0;
    this.iconTop = 500;

    this.linkTo = function (link) {
      window.alert(link);
    };

    this.applyStylingToIcon(lnkGitH, "Fork me on github", function (e) {
      controller.createNewPlan();
    });
    this.applyStylingToIcon(lnkNode, "Using Node.js on the server", function (e) {
      this.linkTo("hello");
    });
    this.applyStylingToIcon(lnkRaph, "Interface using RaphaelJS", function (e) {
      this.linkTo("hello");
    });
    this.applyStylingToIcon(lnkTwit, "Contact me via Twitter", function (e) {
      this.linkTo("hello");
    });
  },
      Guest = function Guest(name, x, y, id, callback) {
    this.id = id || controller.NextGuestID();
    logEvent("Create Guest");
    this.name = name;
    this.text = false;
    this.graphic = paper.path(shapes.guest); //deskShape);//

    this.graphic.attr({
      ox: 0,
      oy: 0
    });
    this.graphic.attr({
      fill: colGuest,
      stroke: colGuestStroke,
      model: this
    });

    this.SetName = function (newName) {
      this.name = newName;
      this.showHelpText(this.name);
    };

    this.graphic.mouseover(function (event) {
      Generic.Highlight(this, "black");
    });
    this.graphic.mouseout(function (event) {
      this.animate({
        "stroke-width": 1
      }, animationTime);
    });

    this.startDrag = function () {
      this.hideName();
      this.ghost = this.graphic.clone();
      this.ghost.attr("opacity", 0.3);
    };

    this.overEmptySeat = function (position, seat) {
      this.showHelpText("Move " + this.name + " to this seat", position); //this.graphic.attr("rotation", seat.GetRotation());

      this.SetRotation(seat.GetRotation());
    };

    this.SetBaseRotation = Generic.SetRotation;

    this.SetRotation = function (rotation) {
      this.rotation = rotation;
      this.SetBaseRotation(rotation);
    };

    this.overOccupiedSeat = function (position, seat) {
      this.showHelpText("Swap " + this.name + " with " + seat.guest.name, position);
      seat.guest.hideName();
    };

    this.overNewSeat = function (position, seat) {
      this.showHelpText("Create new seat and move " + this.name + " to it", position);
      this.SetRotation(seat.GetRotation());
    };

    this.moveGhostToNewLocation = function () {
      if (this.ghost) {
        this.ghost.show();
        this.ghost.model = this;
        this.ghost.animate({
          transform: this.graphic.attr("transform")
        }, animationTime, "<", function () {
          this.model.showHelpText(this.model.name);
          this.model.graphic.animate({
            opacity: 1
          }, animationTime);
          this.hide();
        });
      }
    };

    this.removeFromSeat = function () {
      var dfd = $.Deferred(),
          seatCX = 0,
          seatCY = 0;
      logEvent("remove from seat " + this.name);
      this.seat.RemoveGuest();
      this.seat = false;
      this.animateToSpot(seatCX, seatCY, 0, function () {
        console.log("Removed guest from seat");
        dfd.resolve();
      });
      return dfd.promise();
    };

    this.animateToSpot = function (x, y, rotation, callback) {
      if (this.graphic) {
        this.graphic.model = this;
        this.graphic.animate({
          transform: "t" + x + "," + y + "R" + rotation
        }, animationTime, ">", function () {
          this.attr({
            ox: x,
            oy: y
          });
          this.model.moveGhostToNewLocation();
          this.model.showHelpText(this.model.name);
          this.model.SetRotation(rotation);

          if (callback) {
            callback();
          }
        });
      }
    };

    this.swapWithGuestAt = function (seat) {
      var meGuest = this,
          meSeat = this.seat,
          themGuest = seat.guest,
          themSeat = seat;
      logEvent("Swap " + meGuest.name + " from seat occupied by " + themGuest.name + ".");

      if (meSeat) {
        themGuest.moveToSeat(meSeat);
      } else {
        themGuest.removeFromSeat();
      }

      meGuest.moveToSeat(themSeat); //Consider for swapping 
      //object making them go 
      //in a curved line 
      //rather than straight.
    };

    this.makeSureMainGraphicIsInRightPlace = function makeSureMainGraphicIsInRightPlace(seat, callback) {
      var myCX = this.GetX(),
          myCY = this.GetY(),
          seatCX = seat.GetX(),
          seatCY = seat.GetY(),
          seatRotation = seat.GetRotation();

      if (myCX !== seatCX || myCY !== seatCY) {
        logEvent("Seat not in right place for " + this.name);
        this.animateToSpot(seatCX, seatCY, seatRotation, callback);
      } else {
        this.SetRotation(seatRotation);
        this.moveGhostToNewLocation();

        if (callback) {
          callback();
        }
      }
    };

    this.moveToSeat = function moveToSeat(seat) {
      var dfd = $.Deferred();

      if (this.ghost) {
        this.ghost.toFront();
      }

      this.graphic.toFront();
      logEvent("seat move for " + this.name);
      this.makeSureMainGraphicIsInRightPlace(seat, function CallbackMakeSureMainGraphicIsInRightPlace() {
        dfd.resolve();
      });
      this.seat = seat;
      this.seat.isoccupied = true;
      this.seat.guest = this;
      scene.SeatConflictCheck(this.seat);
      return dfd.promise();
    };

    this.GetX = Generic.PathGetX;
    this.GetY = Generic.PathGetY;
    this.Rotation = Generic.Rotation;
    this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;

    this.setGraphicPosition = function (position) {
      this.setGraphicPositionBase(position);

      if (this.text) {
        this.text.attr({
          x: position.x,
          y: position.y - 20
        });
      }
    };

    this.showHelpText = function (text, position) {
      if (!position) {
        position = {
          x: this.graphic.attr("ox"),
          y: this.graphic.attr("oy")
        };
      }

      if (!position.x) {
        position.x = this.graphic.attr("ox");
      }

      if (!position.y) {
        position.y = this.graphic.attr("oy");
      }

      if (text) {
        this.hideName();
        this.text = paper.text(position.x, position.y - 20, text);
        this.text.show();
      }
    };

    this.hideName = function () {
      if (this.text) {
        this.text.hide();
      }
    };

    this.remove = function () {
      if (this.text) {
        this.text.remove();
        this.text = null;
      }

      var dfd = $.Deferred(),
          contextModel = this;

      if (this.graphic) {
        this.graphic.stop();
        this.graphic.animate({
          opacity: "0"
        }, animationTime, true, function () {
          this.remove();
          contextModel.graphic = null;
          dfd.resolve();
        });
      }

      return dfd.promise();
    };

    this.setGraphicPosition({
      x: x,
      y: y
    });
    this.showHelpText(this.name);

    var start = function start(event) {
      //bring this model to the front
      this.toFront();
      this.ox = this.attr("ox");
      this.oy = this.attr("oy"); //get the model object

      var model = this.attr("model");
      model.startDrag();
      showEditGuest(model);
      possibleSeats = scene.GetCachedListOfSeatAreas();
      this.animate({
        "stroke-width": 3,
        opacity: 0.7
      }, animationTime);
    },
        move = function move(mx, my) {
      var model = this.attr("model"),
          mouseCX = this.ox + mx,
          mouseCY = this.oy + my,
          lockX = 0,
          lockY = 0,
          myStroke = colGuestStroke,
          i = 0,
          l = myTables.length,
          tableCheck,
          mySeat;
      inrange = false; //You could improve performance by only looping tables nearby to the cursor.

      for (i = 0, l = myTables.length; i < l; i += 1) {
        tableCheck = myTables[i];
        mySeat = tableCheck.CheckOverSeat(mouseCX, mouseCY);

        if (mySeat) {
          inrange = true;
          lockX = mySeat.GetX();
          lockY = mySeat.GetY();

          if (mySeat.ismarker) {
            myStroke = colGuestMoveStroke;
            model.overNewSeat({
              x: lockX,
              y: lockY
            }, mySeat);
          } else if (mySeat.isoccupied) {
            myStroke = colGuestSwapStroke;
            model.overOccupiedSeat({
              x: lockX,
              y: lockY
            }, mySeat);
          } else {
            myStroke = colGuestMoveStroke;
            model.overEmptySeat({
              x: lockX,
              y: lockY
            }, mySeat);
          }
        }
      }

      if (inrange) {
        model.setGraphicPosition({
          x: lockX,
          y: lockY
        });
        this.attr({
          stroke: myStroke
        });
      } else {
        model.hideName();
        model.setGraphicPosition({
          x: mouseCX,
          y: mouseCY
        });
      }
    },
        up = function up() {
      //*** NEED TO WRITE UP ON MARKER FUNCTION
      var model = this.attr("model"),
          i,
          l = myTables.length,
          tableCheck,
          mySeat;

      if (inrange) {
        for (i = 0, l = myTables.length; i < l; i += 1) {
          tableCheck = myTables[i];
          mySeat = tableCheck.CheckOverSeat(model.GetX(), model.GetY());

          if (mySeat) {
            inrange = true;
            controller.MoveGuestToSeatArea(model, mySeat);
          }
        }
      } else {
        model.ghost.hide();
        model.removeFromSeat();
      }

      this.animate({
        "stroke-width": 2
      }, animationTime);
    };

    this.graphic.drag(move, start, up);

    this.ToJson = function () {
      return {
        name: this.name,
        x: this.GetX(),
        y: this.GetY()
      };
    };

    if (callback) {
      callback();
    }
  },
      Seat = function Seat(x, y, rotation, table, seatNumber, id, guest) {
    logEvent("Create Seat");
    this.id = id || controller.NextSeatID();
    this.table = table;
    this.rotation = rotation;
    this.graphic = paper.path(shapes.seat);
    this.seatNumber = seatNumber;

    this.SetRotation = function (rotation) {
      this.rotation = rotation;

      if (this.guest) {
        this.guest.SetRotation(rotation);
      }

      this.SetBaseRotation(rotation);
    };

    this.graphic.attr({
      ox: x,
      oy: y,
      fill: "blue",
      model: this
    });
    this.graphic.transform("...t" + x + "," + y);
    this.GetX = Generic.PathGetX;
    this.GetY = Generic.PathGetY;

    this.GetLoc = function () {
      var x = this.GetX() || 0,
          y = this.GetY() || 0;

      if (x === 0 && y === 0) {
        return null;
      }

      return {
        x: x,
        y: y
      };
    };

    this.SetBaseRotation = Generic.SetRotation;
    this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;

    this.GetRotation = function () {
      return this.rotation;
    };

    this.setGraphicPositionCore = function (position) {
      this.setGraphicPositionBase(position);

      if (this.guest) {
        this.guest.setGraphicPosition(position);
      }

      this.t = this.GetY() - dragThreshold;
      this.r = this.GetX() + dragThreshold;
      this.b = this.GetY() + dragThreshold;
      this.l = this.GetX() - dragThreshold;
    };

    this.setGraphicPosition = function (pointTo, pointFrom) {
      var dfd = $.Deferred(),
          mypath;

      if (pointFrom) {
        mypath = pathGenerateCircularArc(pointFrom, pointTo, this.table.widthWithChairs);
        this.setGraphicPositionCore(pointFrom);
        this.graphic.animate({
          transform: "t" + pointTo.x + "," + pointTo.y + "R" + pointTo.r
        }, animationTime, true, function () {
          this.attr("model").setGraphicPositionCore(pointTo);
          this.attr("model").SetRotation(pointTo.r);
          console.log("placed seat");
          dfd.resolve();
        });
      } else {
        this.setGraphicPositionCore(pointTo);
        dfd.resolve();
      }

      return dfd.promise();
    };

    this.RemoveGuest = function Seat_RemoveGuest() {
      if (this.guest) {
        logEvent("Remove seat for " + this.guest.name);
      }

      this.guest = false;
      this.isoccupied = false;
    };

    this.remove = function Seat_Remove() {
      console.log("delete seat");
      var dfd = $.Deferred(),
          contextModel = this;
      this.RemoveGuest();

      if (this.graphic) {
        this.graphic.stop();
        this.graphic.animate({
          transform: "T0,0"
        }, animationTime, true, function () {
          console.log("destroy seat graphic");
          this.remove();
          contextModel.graphic = null;
          dfd.resolve();
        });
      }

      return dfd.promise();
    };

    this.RemoveGuest();
    seatList.push(this);

    this.ToJson = function () {
      var myGuest;

      if (this.guest) {
        myGuest = this.guest.ToJson();
      }

      return {
        type: "seat",
        rotation: this.rotation,
        x: this.GetX(),
        y: this.GetY(),
        guest: myGuest
      };
    };

    var myMouseOver = function myMouseOver(event) {
      Generic.Highlight(this);
      this.animate({
        fill: "red"
      }, animationTime);
    },
        myMouseOut = function myMouseOut(event) {
      Generic.Unhighlight(this);
      this.animate({
        fill: "blue"
      }, animationTime);
    },
        myMouseClick = function myMouseClick(event) {
      logEvent("click empty seat");
      this.unmouseout(myMouseOut); // Suggest to Rapheal that calling this with no functions clears the list?

      controller.ClickSeatRemove(this.attr("model"));
    };

    this.graphic.mouseover(myMouseOver);
    this.graphic.mouseout(myMouseOut);
    this.graphic.click(myMouseClick);
  },
      SeatMarker = function SeatMarker(x, y, table, seatNumber, rotation) {
    logEvent("Create SeatMarker");
    this.ismarker = true;
    this.rotation = rotation;
    this.SetBaseRotation = Generic.SetRotation;

    this.GetRotation = function () {
      return this.rotation;
    };

    this.SetRotation = function (rotation) {
      this.rotation = rotation;
      this.SetBaseRotation(rotation);
    };

    this.table = table;
    this.seatNumber = seatNumber;
    this.graphic = paper.circle(x, y, 4);
    this.graphic.attr({
      fill: "blue",
      model: this
    });
    this.GetX = Generic.PathGetX;
    this.GetY = Generic.PathGetY;

    this.GetLoc = function () {
      var x = this.GetX() || 0,
          y = this.GetY() || 0;

      if (x === 0 && y === 0) {
        return null;
      }

      return {
        x: x,
        y: y
      };
    };

    this.convertToSeat = function () {
      return this.table.addSeatFromMarker(this.seatNumber + 1);
    };

    this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;

    this.setGraphicPositionCore = function (position) {
      this.setGraphicPositionBase(position);
      this.t = this.GetY() - dragThreshold;
      this.r = this.GetX() + dragThreshold;
      this.b = this.GetY() + dragThreshold;
      this.l = this.GetX() - dragThreshold;
    };

    this.setGraphicPosition = function (pointTo, pointFrom) {
      if (pointFrom) {
        var mypath = pathGenerateCircularArc(pointFrom, pointTo, this.table.widthWithChairs),
            animateAlongPath = false;
        this.setGraphicPositionCore(pointFrom);
        this.graphic.animate({
          transform: "t" + pointTo.x + "," + pointTo.y
        }, animationTime, true, function () {
          this.attr("model").setGraphicPositionCore(pointTo);
        });

        if (animateAlongPath) {
          if (this.graphic2) {
            this.graphic2.stop();
            this.graphic2.remove();
          }

          this.graphic2 = paper.path(mypath);
          this.graphic2.attr({
            fill: "green",
            model: this,
            opacity: 0.5
          });
        }
      } else {
        this.setGraphicPositionCore(pointTo);
      }
    };

    this.remove = function SeatMarkerRemove() {
      var dfd = $.Deferred(),
          contextModel = this;
      console.log("delete seat marker");

      if (this.graphic) {
        this.graphic.stop();
        this.graphic.animate({
          transform: "T0,0"
        }, animationTime, true, function () {
          this.remove();
          console.log("destroy seat marker graphic");
          contextModel.graphic = null;
          dfd.resolve();
        });
      }

      return dfd.promise();
    };

    this.graphic.mouseover(function (event) {
      Generic.Highlight(this);
      this.animate({
        fill: "red"
      }, animationTime);
    });
    this.graphic.mouseout(function (event) {
      Generic.Unhighlight(this);
      this.animate({
        fill: "blue"
      }, animationTime);
    });
    this.graphic.click(function (event) {
      logEvent("click seatmarker");
      var model = this.attr("model");
      controller.ClickAddSeatAtPosition(model.table, model.seatNumber + 1);
    });
  },

  /*GenerateCirclePath = function (x, y, r) {
      var s = "M" + x + "," + (y - r) + "A" + r + "," + r + ",0,1,1," + (x - 0.1) + "," + (y - r) + " z";
      return s;
  },*/
  RoundTable = function RoundTable(x, y, seatCount, seatList, id, callback) {
    var i,
        l,
        start = function start(event) {
      var model = this.attr("model"),
          i,
          l,
          s;
      this.ox = model.GetX();
      this.oy = model.GetY();
      model.previousPosition = {
        x: model.GetX(),
        y: model.GetY()
      };

      for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
        s = model.tableSeatList[i];
        s.graphic.attr({
          fromTableX: s.GetX(),
          fromTableY: s.GetY()
        });
      }

      for (i = 0, l = model.tableSeatAdditions.length; i < l; i += 1) {
        s = model.tableSeatAdditions[i];
        s.graphic.attr({
          fromTableX: s.GetX(),
          fromTableY: s.GetY()
        });
      }

      model.seatSet.attr({
        stroke: colSeatSelectedStroke
      });
      this.attr("stroke", colTableSelectedStroke);
    },
        move = function move(mx, my) {
      var model = this.attr("model"),
          mouseCX = this.ox + mx,
          mouseCY = this.oy + my,
          i,
          l,
          s;

      for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
        s = model.tableSeatList[i];
        s.setGraphicPosition({
          x: s.graphic.attr("fromTableX") + mx,
          y: s.graphic.attr("fromTableY") + my
        });
      }

      for (i = 0, l = model.tableSeatAdditions.length; i < l; i += 1) {
        s = model.tableSeatAdditions[i];
        s.setGraphicPosition({
          x: s.graphic.attr("fromTableX") + mx,
          y: s.graphic.attr("fromTableY") + my
        });
      }

      model.setGraphicPosition({
        x: mouseCX,
        y: mouseCY
      });
    },
        up = function up() {
      var model = this.attr("model");
      model.seatSet.attr({
        stroke: colTableStroke
      });
      controller.ac.Call("MoveTable", {
        table: model.id,
        previous: model.previousPosition,
        current: {
          x: model.GetX(),
          y: model.GetY()
        }
      });
    };

    this.id = id || controller.NextTableID();
    logEvent("Create RoundTable");
    this.seatCount = seatCount;

    if (seatList) {
      this.seatCount = seatCount >= seatList.length ? seatCount : seatList.length;
    }

    this.GetX = Generic.ShapeGetX;
    this.GetY = Generic.ShapeGetY;

    this.GetLocation = function RoundTable_GetLocation() {
      return {
        x: this.GetX(),
        y: this.GetY(),
        r: this.rotation
      };
    };

    this.GetTwelve = function RoundTable_GetTwelve() {
      return {
        x: this.GetX(),
        y: this.GetY() - this.widthWithChairs
      };
    };

    this.remove = function RoundTableRemove() {
      var dfdRemoveTable = $.Deferred(),
          arrRemoveDFD = [],
          i,
          l,
          seat,
          seatMarker,
          contextualModel = this;

      for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
        seat = this.tableSeatList[i];
        arrRemoveDFD.push(seat.remove());
      }

      for (i = 0, l = this.tableSeatAdditions.length; i < l; i += 1) {
        seatMarker = this.tableSeatAdditions[i];
        arrRemoveDFD.push(seatMarker.remove());
      }

      $.when.apply($, arrRemoveDFD).done(function () {
        console.log("removed all contents of table");

        if (contextualModel.graphic) {
          contextualModel.graphic.stop();
          contextualModel.graphic.animate({
            opacity: "0"
          }, animationTime, true, function () {
            this.remove();
            contextualModel.graphic = null;
            console.log("removed table");
            dfdRemoveTable.resolve();
          });
        } else {
          console.log("no table to remove");
          dfdRemoveTable.resolve();
        }
      });
      return dfdRemoveTable.promise();
    };

    this.setGraphicPositionBase = Generic.SetShapeGraphicPosition;

    this.setGraphicPosition = function RoundTable_setGraphicPosition(pointTo, pointFrom, callback) {
      var dfd = $.Deferred(),
          fixedPointTo;

      if (pointFrom) {
        fixedPointTo = {
          x: pointTo.x,
          y: pointTo.y
        };
        this.setGraphicPositionBase(pointFrom);
        this.graphic.animate({
          cx: pointTo.x,
          cy: pointTo.y
        }, animationTime, true, function () {
          var model = this.attr("model"),
              t,
              seatCount = model.seatCount;
          model.setGraphicPositionBase(fixedPointTo);

          for (t = 0; t < seatCount; t += 1) {
            model.placeSeat(t);
            model.placeSeatMarker(t);
          }

          if (callback) {
            callback();
          }

          dfd.resolve();
        });
      } else {
        this.setGraphicPositionBase(pointTo);

        if (callback) {
          callback();
        }

        dfd.resolve();
      }

      return dfd.promise();
    };

    this.width = seatCount * 10;
    this.widthWithChairs = this.width + 20;
    this.graphic = paper.circle(x, y, this.width);
    this.seatSet = paper.set();
    this.seatSet.push(this.graphic);
    this.graphic.attr({
      fill: colTable,
      stroke: colTableStroke,
      model: this
    });
    this.tableSeatList = [];
    this.tableSeatAdditions = [];

    this.caclulateClockworkValues = function (divisions, pointNumber) {
      var alpha = 360 / divisions * pointNumber,
          a = (90 - alpha) * Math.PI / 180,
          x = this.GetX() + this.widthWithChairs * Math.cos(a),
          y = this.GetY() - this.widthWithChairs * Math.sin(a);
      return {
        alpha: alpha,
        a: a,
        x: x,
        y: y
      };
    };

    this.placeSeat = function RoundTable_PlaceSeat(seatNumber) {
      var dfdPromise,
          obj = this.caclulateClockworkValues(this.seatCount, seatNumber),
          moveToSeatLoc = {
        x: obj.x,
        y: obj.y,
        r: obj.alpha
      },
          mySeat = this.tableSeatList[seatNumber],
          moveFromSeatLoc = mySeat.GetLoc() || this.lastSeatMarkerLoc || this.GetTwelve();
      dfdPromise = mySeat.setGraphicPosition(moveToSeatLoc, moveFromSeatLoc);
      mySeat.seatNumber = seatNumber;
      this.lastSeatLoc = mySeat.GetLoc();
      mySeat.graphic.attr({
        fromTableX: moveToSeatLoc.x,
        fromTableY: moveToSeatLoc.y
      });
      return dfdPromise;
    };

    this.lastSeatMarkerLoc = null;
    this.lastSeatLoc = null;

    this.placeSeatMarker = function RoundTable_PlaceSeatMarker(seatNumber) {
      var seatCount = seatNumber > -1 ? this.seatCount * 2 : 1,
          seatNumberWithOffset = seatNumber > -1 ? seatNumber * 2 + 1 : 0,
          obj = this.caclulateClockworkValues(seatCount, seatNumberWithOffset),
          seatNumberFixed = seatNumber > -1 ? seatNumber : 0,
          moveToSeatLoc = {
        x: obj.x,
        y: obj.y,
        r: obj.alpha
      },
          mySeat = this.tableSeatAdditions[seatNumberFixed],
          moveFromSeatLoc = mySeat.GetLoc() || this.lastSeatLoc || this.GetTwelve();
      mySeat.setGraphicPosition(moveToSeatLoc, moveFromSeatLoc);
      mySeat.SetRotation(obj.alpha);
      mySeat.seatNumber = seatNumberFixed;
      this.lastSeatMarkerLoc = moveToSeatLoc;
      mySeat.graphic.attr({
        fromTableX: moveToSeatLoc.x,
        fromTableY: moveToSeatLoc.y
      });
    };

    this.CheckOverSeat = function RoundTable_CheckOverSeat(x, y) {
      var i, l, seatCheck;

      for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
        seatCheck = this.tableSeatList[i];

        if (seatCheck.t < y && seatCheck.b > y && seatCheck.r > x && seatCheck.l < x) {
          return seatCheck;
        }
      }

      for (i = 0, l = this.tableSeatAdditions.length; i < l; i += 1) {
        seatCheck = this.tableSeatAdditions[i];

        if (seatCheck.t < y && seatCheck.b > y && seatCheck.r > x && seatCheck.l < x) {
          return seatCheck;
        }
      }

      return null;
    };

    this.addSeat = function RoundTable_AddSeat(seatNumber) {
      var mySeat = new Seat(0, 0, 0, this, seatNumber),
          mySeatMarker = new SeatMarker(0, 0, this, seatNumber, 0);
      this.tableSeatList.push(mySeat);
      this.tableSeatAdditions.push(mySeatMarker);
      this.seatSet.push(mySeat.graphic);
      this.seatSet.push(mySeatMarker.graphic);
    };

    this.addKnownSeat = function RoundTable_addKnownSeat(seat) {
      var mySeat = new Seat(0, 0, 0, this, seat.seatNumber, seat.id, seat.guest),
          mySeatMarker = new SeatMarker(0, 0, this, seat.seatNumber, 0);
      this.tableSeatList.push(mySeat);
      this.tableSeatAdditions.push(mySeatMarker);
      this.seatSet.push(mySeat.graphic);
      this.seatSet.push(mySeatMarker.graphic);
    };

    this.addSeatFromMarker = function RoundTable_AddSeatFromMarker(markerNumber) {
      var mySeat = new Seat(0, 0, 0, this, markerNumber),
          mySeatMarker = new SeatMarker(0, 0, this, markerNumber, 0); //markerNumber = this.tableSeatList.length ? markerNumber : 0;

      if (this.tableSeatList.length) {
        this.tableSeatList.insertAt(mySeat, markerNumber);
        this.tableSeatAdditions.insertAt(mySeatMarker, markerNumber);
      } else {
        this.tableSeatList.insertAt(mySeat, 0);
      }

      this.seatSet.push(mySeat.graphic);
      this.seatSet.push(mySeatMarker.graphic);
      this.renderSeats();
      return mySeat;
    };

    this.removeSeat = function RoundTable_RemoveSeat(index) {
      var isLastSeat = this.seatCount === index,
          dfd = $.Deferred(),
          dfdList = [],
          context = this,
          dfdSeatRemove = this.tableSeatList[index].remove(),
          dfdSeatMarkerRemove;
      logEvent("remove seat" + index);
      dfdList.push(dfdSeatRemove);
      $.when(dfdSeatRemove).done(function removeSeatCallback() {
        context.tableSeatList.remove(index);
      });

      if (!isLastSeat) {
        dfdSeatMarkerRemove = this.tableSeatAdditions[index].remove();
        $.when(dfdSeatMarkerRemove).done(function () {
          context.tableSeatAdditions.remove(index);
        });
        dfdList.push(dfdSeatMarkerRemove);
      }

      $.when.apply($, dfdList).done(function () {
        var myDFD = context.renderSeats();
        $.when(myDFD).done(function () {
          dfd.resolve();
        });
      });
      return dfd.promise();
    };

    this.renderSeats = function renderSeats() {
      var dfd = $.Deferred(),
          arrAllSeatsDFD = [],
          isLastSeat = this.tableSeatList.length === 1,
          t,
          l;
      this.seatCount = this.tableSeatList.length;

      for (t = 0, l = this.tableSeatList.length; t < l; t += 1) {
        arrAllSeatsDFD.push(this.placeSeat(t));
        this.placeSeatMarker(t);
      }

      if (isLastSeat) {
        this.placeSeatMarker();
      }

      $.when.apply($, arrAllSeatsDFD).done(function () {
        console.log("all done with seat processing");
        dfd.resolve();
      });
      this.dfdPromise = dfd.promise();
      return dfd.promise();
    };

    for (i = 0, l = this.seatCount; i < l; i += 1) {
      if (seatList && seatList[i]) {
        this.addKnownSeat(seatList[i]);
      } else {
        this.addSeat(i);
      }
    }

    this.dfdPromise = this.renderSeats();
    var me = this;
    $.when(this.dfdPromise).then(function () {
      if (callback) {
        callback(me);
      }
    });

    this.animateTable = function (position, callback) {
      var currentLocation = this.GetLocation();

      if (currentLocation.x !== position.x || currentLocation.y !== position.y || currentLocation.r !== position.r) {
        return this.setGraphicPosition(position, currentLocation, callback);
      }
    };

    this.graphic.drag(move, start, up);
    this.graphic.mouseover(function (event) {
      Generic.Highlight(this);
    });
    this.graphic.mouseout(function (event) {
      Generic.Unhighlight(this);
    });

    this.ToJson = function () {
      var seatObject = [],
          i,
          l;

      for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
        seatObject.push(this.tableSeatList[i].ToJson());
      }

      return {
        type: "round",
        seatCount: this.tableSeatList.length,
        x: this.GetX(),
        y: this.GetY(),
        seatList: seatObject
      };
    };
  },
      MathHelper = {
    calculateAngle: function calculateAngle(center, point) {
      var twelveOClock = {
        x: center.x,
        y: center.y - Math.sqrt(Math.abs(point.x - center.x) * Math.abs(point.x - center.x) + Math.abs(point.y - center.y) * Math.abs(point.y - center.y))
      };
      return 2 * Math.atan2(point.y - twelveOClock.y, point.x - twelveOClock.x) * 180 / Math.PI;
    },
    roundValue: function roundValue(val, rounding) {
      return Math.round(val / rounding) * rounding;
    }
  },
      Desk = function Desk(x, y, rotation, callback) {
    this.id = controller.NextTableID();
    this.widthWithChairs = 30;
    logEvent("Create Desk");
    this.GetX = Generic.PathGetX;
    this.GetY = Generic.PathGetY;

    this.remove = function DeskRemove() {
      var dfdRemoveTable = $.Deferred(),
          arrRemoveDFD = [],
          i,
          l,
          seat,
          contextualModel = this;

      for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
        seat = this.tableSeatList[i];
        arrRemoveDFD.push(seat.remove());
      }

      $.when.apply($, arrRemoveDFD).done(function () {
        console.log("removed all contents of table");

        if (contextualModel.graphic) {
          contextualModel.graphic.stop();
          contextualModel.graphic.animate({
            opacity: "0"
          }, animationTime, true, function () {
            this.remove();
            contextualModel.graphic = null;
            console.log("removed table");
            dfdRemoveTable.resolve();
          });
        } else {
          console.log("no table to remove");
          dfdRemoveTable.resolve();
        }
      });
      return dfdRemoveTable.promise();
    };

    this.GetLocation = function () {
      return {
        x: this.GetX(),
        y: this.GetY(),
        r: this.rotation
      };
    };

    this.setGraphicPositionBase = Generic.SetRelativeGraphicPosition;

    this.setGraphicPosition = function (pointTo, pointFrom, callback) {
      if (pointFrom) {
        //var fixedPointTo = {x:pointTo.x - (this.width/2), y:pointTo.y - (this.width/2)};
        //var fixedPointTo = {x:pointTo.x, y:pointTo.y};
        this.setGraphicPositionBase(pointFrom); //this.setGraphicPositionBase(fixedPointTo);

        this.rotation = pointTo.r;
        this.graphic.animate({
          transform: "t" + pointTo.x + "," + pointTo.y + "R" + pointTo.r,
          //rotation: pointTo.r
          ox: pointTo.x,
          oy: pointTo.y
        }, animationTime, true, function () {
          var model = this.attr("model"); //model.setGraphicPositionBase(pointTo);

          model.placeSeat(model.tableSeatList[0], true);

          if (callback) {
            callback();
          }
        });
      } else {
        this.setGraphicPositionBase(pointTo);
        this.placeSeat(this.tableSeatList[0], false);

        if (callback) {
          callback();
        }
      }

      this.placeRotationHandle(pointTo);
    };

    this.placeRotationHandle = function (pointTo) {
      this.rotationHandle.attr({
        cx: pointTo.x + 50,
        cy: pointTo.y + 50
      });
    };

    this.caclulateRotationPlacement = function (rotation) {
      var alpha = rotation,
          //360 / divisions * pointNumber,
      a = (90 - alpha) * Math.PI / 180,
          x = this.GetX() + this.widthWithChairs * Math.cos(a),
          y = this.GetY() - this.widthWithChairs * Math.sin(a);
      return {
        alpha: alpha,
        a: a,
        x: x,
        y: y
      };
    };

    this.placeSeat = function (mySeat, animated) {
      var obj = this.caclulateRotationPlacement(this.rotation),
          moveToSeatLoc = {
        x: obj.x,
        y: obj.y,
        r: obj.alpha
      },
          moveFromSeatLoc;

      if (animated) {
        moveFromSeatLoc = mySeat.GetLoc() || {
          x: 0,
          y: 0
        };
        mySeat.setGraphicPosition(moveToSeatLoc, moveFromSeatLoc);
      } else {
        mySeat.setGraphicPosition(moveToSeatLoc);
      }

      mySeat.SetRotation(obj.alpha); //mySeat.seatNumber = seatNumber;

      mySeat.graphic.attr({
        fromTableX: moveToSeatLoc.x,
        fromTableY: moveToSeatLoc.y
      });
    };

    this.rotation = rotation;
    this.graphic = paper.path(shapes.desk); //

    this.graphic.attr({
      ox: 0,
      oy: 30,
      rotation: rotation,
      fill: colTable,
      stroke: colTableStroke,
      model: this
    });
    this.rotationHandle = paper.circle(60, 60, 10);
    this.rotationHandle.attr({
      rotation: rotation,
      fill: colTable,
      stroke: colTableStroke,
      model: this
    });

    var rotationstart = function rotationstart(event) {
      logEvent("StartRotation Desk");
      var model = this.attr("model");
      model.previousPosition = model.GetLocation(); //{x:model.GetX(),y:model.GetY(),r:model.rotation}

      model.offsetRotation = model.rotation;
    },
        rotationmove = function rotationmove(mx, my) {
      var model = this.attr("model"),
          mouseCX = this.attr("cx") + mx,
          mouseCY = this.attr("cy") + my,
          offset = 135,
          rounding = 22.5,
          calculateAngle = MathHelper.calculateAngle,
          roundValue = MathHelper.roundValue,
          newANGLE = calculateAngle({
        x: model.GetX(),
        y: model.GetY()
      }, {
        x: mouseCX,
        y: mouseCY
      }) - offset;
      newANGLE = roundValue(newANGLE, rounding);
      model.rotation = newANGLE + model.offsetRotation;
      model.graphic.attr({
        transform: "T" + model.GetX() + "," + model.GetY() + "R" + model.rotation
      });
      model.placeSeat(model.tableSeatList[0], false);
    },
        rotationup = function rotationup() {
      logEvent("EndRotation Desk");
      var model = this.attr("model");
      controller.ac.Call("MoveTable", {
        table: model.id,
        previous: model.previousPosition,
        current: model.GetLocation()
      });
    },
        start = function start(event) {
      logEvent("StartDrag Desk");
      var model = this.attr("model"),
          i,
          l,
          s;
      model.previousPosition = model.GetLocation(); //{x:model.GetX(),y:model.GetY(),r:model.rotation}

      this.ox = model.GetX();
      this.oy = model.GetY();

      for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
        s = model.tableSeatList[i];
        s.graphic.attr({
          fromTableX: s.GetX(),
          fromTableY: s.GetY()
        });
      }

      model.seatSet.attr({
        stroke: colSeatSelectedStroke
      });
      this.attr("stroke", colTableSelectedStroke);
    },
        move = function move(mx, my) {
      var model = this.attr("model"),
          mouseCX = this.ox + mx,
          mouseCY = this.oy + my,
          i,
          l,
          s;

      for (i = 0, l = model.tableSeatList.length; i < l; i += 1) {
        s = model.tableSeatList[i];
        s.setGraphicPosition({
          x: s.graphic.attr("fromTableX") + mx,
          y: s.graphic.attr("fromTableY") + my
        });
      }

      model.setGraphicPosition({
        x: mouseCX,
        y: mouseCY
      });
    },
        up = function up() {
      logEvent("EndDrag Desk");
      var model = this.attr("model");
      model.seatSet.attr({
        stroke: colTableStroke
      });
      controller.ac.Call("MoveTable", {
        table: model.id,
        previous: model.previousPosition,
        current: model.GetLocation() //{x:model.GetX(),y:model.GetY(),r:model.rotation}

      });
    };

    this.rotationHandle.drag(rotationmove, rotationstart, rotationup);
    this.rotationHandle.mouseover(function (event) {
      logEvent("Over Desk Rotation");
      Generic.Highlight(this);
    });
    this.rotationHandle.mouseout(function (event) {
      logEvent("Out Desk Rotation");
      Generic.Unhighlight(this);
    });
    this.seatSet = paper.set();
    this.seatSet.push(this.graphic);
    this.seatSet.push(this.rotationHandle);
    this.tableSeatList = [];

    this.addSeat = function () {
      var mySeat = new Seat(x, y, rotation);
      mySeat.table = this;
      this.tableSeatList.push(mySeat);
      this.seatSet.push(mySeat.graphic);
      this.placeSeat(this.tableSeatList[0], false);
    };

    this.CheckOverSeat = function (x, y) {
      var i, l, seatCheck;

      for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
        seatCheck = this.tableSeatList[i];

        if (seatCheck.t < y && seatCheck.b > y && seatCheck.r > x && seatCheck.l < x) {
          return seatCheck;
        }
      }

      return null;
    };

    this.addSeat();
    this.setGraphicPosition({
      x: x,
      y: y
    });
    this.graphic.drag(move, start, up);
    this.graphic.mouseover(function (event) {
      Generic.Highlight(this);
    });
    this.graphic.mouseout(function (event) {
      Generic.Unhighlight(this);
    });

    this.animateTable = function (position, callback) {
      var currentLocation = this.GetLocation();

      if (currentLocation.x !== position.x || currentLocation.y !== position.y || currentLocation.r !== position.r) {
        return this.setGraphicPosition(position, currentLocation, callback);
      }
    };

    this.ToJson = function () {
      var seatObject = [],
          i,
          l;

      for (i = 0, l = this.tableSeatList.length; i < l; i += 1) {
        seatObject.push(this.tableSeatList[i].ToJson());
      }

      return {
        type: "desk",
        rotation: this.rotation,
        x: this.GetX(),
        y: this.GetY(),
        seatList: seatObject
      };
    };

    if (callback) {
      callback();
    }
  },
      SaveAll = function SaveAll() {
    var SaveObject = {
      tableList: [],
      guestList: []
    },
        i,
        l;

    for (i = 0, l = myTables.length; i < l; i += 1) {
      SaveObject.tableList.push(myTables[i].ToJson());
    }

    for (i = 0, l = myGuests.length; i < l; i += 1) {
      if (!myGuests[i].seat) {
        SaveObject.guestList.push(myGuests[i].ToJson());
      }
    }

    return SaveObject;
  },
      createNewPlan = function createNewPlan() {
    $.when(clearData()).then(function () {
      if (socket) {
        socket.emit('AddPlan');
      }
    });
  },
      saveNewPlan = function saveNewPlan() {
    window.alert("need to be able to save a new plan");
  },
      renderAllPlans = function renderAllPlans(data) {
    var summaryText = "Summary",
        i,
        l,
        summaryRow;

    if (data.length !== 0) {
      for (i = 0, l = data.length; i < l; i += 1) {
        summaryRow = "Unnamed plan (" + data[i].guestList.length + " guests " + data[i].tableList.length + " tables)";
        console.log([data[i], summaryRow]);
        myPlanID = data[i]._id;
        summaryText += ". " + summaryRow;
        $("#lstPlans").append($("<option>").attr({
          value: myPlanID,
          text: summaryRow
        }).append(summaryRow));
      }

      requestPlan(); //Hack - load last plan
    } else {
      saveNewPlan();
    }

    console.log(summaryText);
  };

  this.getController = function () {
    return controller;
  };

  this.getTables = function () {
    return myTables;
  };

  this.getGuests = function () {
    return myGuests;
  };

  this.setAnimationTime = function (newTime) {
    animationTime = newTime;
  };

  paper.customAttributes = {
    model: function model(_model) {
      this.myModel = _model;
      return this.myModel;
    },
    ox: function ox(_ox) {
      this.myOx = _ox;
      return this.myOx;
    },
    oy: function oy(_oy) {
      this.myOy = _oy;
      return this.myOy;
    },
    fromTableX: function fromTableX(_fromTableX) {
      this.myfromTableX = _fromTableX;
      return this.myfromTableX;
    },
    fromTableY: function fromTableY(_fromTableY) {
      this.myfromTableY = _fromTableY;
      return this.myfromTableY;
    },
    rotation: function rotation(_rotation) {
      this.myrotation = _rotation;
      return this.myrotation;
    }
  };

  this.ClearDataExternal = function () {
    return clearData();
  };

  this.LoadDataExternal = function (data) {
    return loadData(data);
  };

  if (socket) {
    socket.on('AddPlanResponse', function (data) {
      console.log(data);
      loadData([data]);
    });
    socket.on('GetPlanResponse', function (data) {
      console.log(data);
      loadData(data);
    });
    socket.on('GetPlanListResponse', function (data) {
      console.log(data);
      renderAllPlans(data);
    });
  }

  (function () {
    MyToolBar = new ToolBar();
    requestPlanList();
    logEvent("Finished Init");
    $("#lstPlans").change(function (o) {
      console.log("Change option");
      myPlanID = o.currentTarget.value;
      $.when(clearData()).then(requestPlan);
    });
    hideAllEditPanels();
  })();

  if (socket) {
    socket.on('CreateSeatAndPlaceGuestResponse', function (data) {
      console.log(data);
      controller.CreateSeatAndPlaceGuest(data.table, data.guest, data.seatMarker); //socket.emit('my other event', { my: 'data' });
    });
    socket.on('PlaceGuestOnSeatResponse', function (data) {
      console.log(data);
      controller.PlaceGuestOnSeat(data.guest, data.seat); //socket.emit('my other event', { my: 'data' });
    });
    socket.on('SwapGuestWithSeatResponse', function (data) {
      console.log(data);
      controller.SwapGuestWithSeat(data.guest, data.seat); //socket.emit('my other event', { my: 'data' });
    });
    socket.on('AddSeatAtPositionResponse', function (data) {
      console.log(data);
      controller.AddSeatAtPosition(data.table, data.seatNumber); //socket.emit('my other event', { my: 'data' });
    });
    socket.on('RemoveSeatResponse', function (data) {
      console.log(data);
      controller.RemoveSeat(data.seat); //socket.emit('my other event', { my: 'data' });
    });
  }
}

;

},{}]},{},[3]);

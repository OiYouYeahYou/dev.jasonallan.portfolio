/* breakpoints.js v1.0 | @ajlkn | MIT licensed */

"use strict";
const _breakpoints = {
	/**
	 * List.
	 * @var {array}
	 */
	list: null,

	/**
	 * Media cache.
	 * @var {object}
	 */
	media: {},

	/**
	 * Events.
	 * @var {array}
	 */
	events: [],

	/**
	 * Initialize.
	 * @param {array} list List.
	 */
	init: function (list) {
		// Set list.
		_breakpoints.list = list;

		// Add event listeners.
		window.addEventListener("resize", _breakpoints.poll);
		window.addEventListener("orientationchange", _breakpoints.poll);
		window.addEventListener("load", _breakpoints.poll);
		window.addEventListener("fullscreenchange", _breakpoints.poll);
	},

	/**
	 * Determines if a given query is active.
	 * @param {string} query Query.
	 * @return {bool} True if yes, false if no.
	 */
	active: function (query) {
		if (query in _breakpoints.media) {
			return _breakpoints.media[query] === false
				? false
				: window.matchMedia(_breakpoints.media[query]).matches;
		}

		// Media for this query doesn't exist? Generate it.
		// Determine operator, breakpoint.
		const { breakpoint, op } = xxx(query);

		let media;

		// Build media.
		if (breakpoint && breakpoint in _breakpoints.list) {
			const a = _breakpoints.list[breakpoint];

			if (!Array.isArray(a)) {
				if (a.charAt(0) == "(") {
					// Missing a media type? Prefix with "screen".
					media = "screen and " + a;
				} else {
					// Otherwise, use as-is.
					media = a;
				}
				_breakpoints.media[query] = media ? media : false;
				return;
			}

			// Range.

			const min = parseInt(a[0]);
			const max = parseInt(a[1]);

			let units;
			if (!isNaN(min)) {
				units = a[0].substr(String(min).length);
			} else if (!isNaN(max)) {
				units = a[1].substr(String(max).length);
			} else {
				return;
			}

			if (isNaN(min)) {
				switch (op) {
					// Greater than or equal (>= 0 / anything)
					case "gte":
						media = "screen";
						break;

					// Less than or equal (<= y)
					case "lte":
						media = "screen and (max-width: " + max + units + ")";
						break;

					// Greater than (> y)
					case "gt":
						media =
							"screen and (min-width: " + (max + 1) + units + ")";
						break;

					// Less than (< 0 / invalid)
					case "lt":
						media = "screen and (max-width: -1px)";
						break;

					// Not (> y)
					case "not":
						media =
							"screen and (min-width: " + (max + 1) + units + ")";
						break;

					// Equal (<= y)
					default:
						media = "screen and (max-width: " + max + units + ")";
						break;
				}
			} else if (isNaN(max)) {
				switch (op) {
					// Greater than or equal (>= x)
					case "gte":
						media = "screen and (min-width: " + min + units + ")";
						break;

					// Less than or equal (<= inf / anything)
					case "lte":
						media = "screen";
						break;

					// Greater than (> inf / invalid)
					case "gt":
						media = "screen and (max-width: -1px)";
						break;

					// Less than (< x)
					case "lt":
						media =
							"screen and (max-width: " + (min - 1) + units + ")";
						break;

					// Not (< x)
					case "not":
						media =
							"screen and (max-width: " + (min - 1) + units + ")";
						break;

					// Equal (>= x)
					default:
						media = "screen and (min-width: " + min + units + ")";
						break;
				}
			} else {
				switch (op) {
					// Greater than or equal.
					case "gte":
						media = "screen and (min-width: " + min + units + ")";
						break;

					// Less than or equal.
					case "lte":
						media = "screen and (max-width: " + max + units + ")";
						break;

					// Greater than.
					case "gt":
						media =
							"screen and (min-width: " + (max + 1) + units + ")";
						break;

					// Less than.
					case "lt":
						media =
							"screen and (max-width: " + (min - 1) + units + ")";
						break;

					// Not.
					case "not":
						media =
							"screen and (max-width: " +
							(min - 1) +
							units +
							"), screen and (min-width: " +
							(max + 1) +
							units +
							")";
						break;

					// Equal.
					default:
						media =
							"screen and (min-width: " +
							min +
							units +
							") and (max-width: " +
							max +
							units +
							")";
						break;
				}
			}
		}

		// Cache.
		_breakpoints.media[query] = media ? media : false;
	},

	/**
	 * Registers an event.
	 * @param {string} query Query.
	 * @param {function} handler Handler.
	 */
	on: function (query, handler) {
		// Register event.
		_breakpoints.events.push({
			query: query,
			handler: handler,
			state: false,
		});

		// Query active *right now*? Call handler.
		if (_breakpoints.active(query)) {
			handler();
		}
	},

	/**
	 * Polls for events.
	 */
	poll: function () {
		// Step through events.
		for (let i = 0; i < _breakpoints.events.length; i++) {
			// Get event.
			const e = _breakpoints.events[i];

			if (_breakpoints.active(e.query)) {
				if (!e.state) {
					e.state = true;
					e.handler();
				}
			} else {
				if (e.state) {
					e.state = false;
				}
			}
		}
	},
};

export function breakpoints(list) {
	_breakpoints.init(list);
}
breakpoints._ = _breakpoints;
breakpoints.on = function (query, handler) {
	_breakpoints.on(query, handler);
};
breakpoints.active = function (query) {
	return _breakpoints.active(query);
};

function xxx(query) {
	let breakpoint;
	let op;

	if (query.substr(0, 2) == ">=") {
		op = "gte"; // Greater than or equal.
		breakpoint = query.substr(2);
	} else if (query.substr(0, 2) == "<=") {
		op = "lte"; // Less than or equal.
		breakpoint = query.substr(2);
	} else if (query.substr(0, 1) == ">") {
		op = "gt"; // Greater than.
		breakpoint = query.substr(1);
	} else if (query.substr(0, 1) == "<") {
		op = "lt"; // Less than.
		breakpoint = query.substr(1);
	} else if (query.substr(0, 1) == "!") {
		op = "not"; // Not.
		breakpoint = query.substr(1);
	} else {
		op = "eq"; // Equal.
		breakpoint = query;
	}

	return { op, breakpoint };
}

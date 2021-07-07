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
		var breakpoint, op, media, a, x, y, units;

		// Media for this query doesn't exist? Generate it.
		if (!(query in _breakpoints.media)) {
			// Determine operator, breakpoint.

			if (query.substr(0, 2) == ">=") {
				// Greater than or equal.
				op = "gte";
				breakpoint = query.substr(2);
			} else if (query.substr(0, 2) == "<=") {
				// Less than or equal.
				op = "lte";
				breakpoint = query.substr(2);
			} else if (query.substr(0, 1) == ">") {
				// Greater than.
				op = "gt";
				breakpoint = query.substr(1);
			} else if (query.substr(0, 1) == "<") {
				// Less than.
				op = "lt";
				breakpoint = query.substr(1);
			} else if (query.substr(0, 1) == "!") {
				// Not.
				op = "not";
				breakpoint = query.substr(1);
			} else {
				// Equal.
				op = "eq";
				breakpoint = query;
			}

			// Build media.
			if (breakpoint && breakpoint in _breakpoints.list) {
				a = _breakpoints.list[breakpoint];

				// Range.
				if (Array.isArray(a)) {
					x = parseInt(a[0]);
					y = parseInt(a[1]);

					if (!isNaN(x)) {
						units = a[0].substr(String(x).length);
					} else if (!isNaN(y)) {
						units = a[1].substr(String(y).length);
					} else {
						return;
					}

					// Max only.
					if (isNaN(x)) {
						switch (op) {
							// Greater than or equal (>= 0 / anything)
							case "gte":
								media = "screen";
								break;

							// Less than or equal (<= y)
							case "lte":
								media =
									"screen and (max-width: " + y + units + ")";
								break;

							// Greater than (> y)
							case "gt":
								media =
									"screen and (min-width: " +
									(y + 1) +
									units +
									")";
								break;

							// Less than (< 0 / invalid)
							case "lt":
								media = "screen and (max-width: -1px)";
								break;

							// Not (> y)
							case "not":
								media =
									"screen and (min-width: " +
									(y + 1) +
									units +
									")";
								break;

							// Equal (<= y)
							default:
								media =
									"screen and (max-width: " + y + units + ")";
								break;
						}
					}

					// Min only.
					else if (isNaN(y)) {
						switch (op) {
							// Greater than or equal (>= x)
							case "gte":
								media =
									"screen and (min-width: " + x + units + ")";
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
									"screen and (max-width: " +
									(x - 1) +
									units +
									")";
								break;

							// Not (< x)
							case "not":
								media =
									"screen and (max-width: " +
									(x - 1) +
									units +
									")";
								break;

							// Equal (>= x)
							default:
								media =
									"screen and (min-width: " + x + units + ")";
								break;
						}
					}

					// Min and max.
					else {
						switch (op) {
							// Greater than or equal.
							case "gte":
								media =
									"screen and (min-width: " + x + units + ")";
								break;

							// Less than or equal.
							case "lte":
								media =
									"screen and (max-width: " + y + units + ")";
								break;

							// Greater than.
							case "gt":
								media =
									"screen and (min-width: " +
									(y + 1) +
									units +
									")";
								break;

							// Less than.
							case "lt":
								media =
									"screen and (max-width: " +
									(x - 1) +
									units +
									")";
								break;

							// Not.
							case "not":
								media =
									"screen and (max-width: " +
									(x - 1) +
									units +
									"), screen and (min-width: " +
									(y + 1) +
									units +
									")";
								break;

							// Equal.
							default:
								media =
									"screen and (min-width: " +
									x +
									units +
									") and (max-width: " +
									y +
									units +
									")";
								break;
						}
					}
				}

				// String.
				else {
					if (a.charAt(0) == "(") {
						// Missing a media type? Prefix with "screen".
						media = "screen and " + a;
					} else {
						// Otherwise, use as-is.
						media = a;
					}
				}
			}

			// Cache.
			_breakpoints.media[query] = media ? media : false;
		}

		return _breakpoints.media[query] === false
			? false
			: window.matchMedia(_breakpoints.media[query]).matches;
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
		if (_breakpoints.active(query)) handler();
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

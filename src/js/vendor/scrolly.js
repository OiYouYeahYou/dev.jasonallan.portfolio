/* jquery.scrolly v1.0.0-dev | (c) @ajlkn | MIT licensed */
"use strict";

/**
 * @param {jQuery} $ jQuery object.
 */
export function scrolly($) {
	function getPosition(elem, opts) {
		const $elem = $(elem);
		if (!$elem.length) {
			return null;
		}

		const top = $elem.offset().top;
		let ret;

		switch (opts.anchor) {
			case "middle":
				ret = top - ($(window).height() - $elem.outerHeight()) / 2;
				break;
			default:
			case "top":
				ret = Math.max(top, 0);
		}

		ret -= typeof opts.offset == "function" ? opts.offset() : opts.offset;

		return ret;
	}

	$.fn.scrolly = function (opts) {
		const $elem = $(this);
		if (this.length == 0) {
			return $elem;
		}

		if (this.length > 1) {
			for (let i = 0; i < this.length; i++) {
				$(this[i]).scrolly(opts);
			}
			return $elem;
		}

		const href = $elem.attr("href") || "";

		if (href.charAt(0) != "#" || href.length < 2) {
			return $elem;
		}

		const _opts = Object.assign(
			{
				anchor: "top",
				easing: "swing",
				offset: 0,
				parent: $("body,html"),
				pollOnce: false,
				speed: 1e3,
			},
			opts
		);

		const constantPosition = _opts.pollOnce
			? getPosition(href, _opts)
			: undefined;

		$elem.off("click.scrolly").on("click.scrolly", function (e) {
			const position = constantPosition
				? constantPosition
				: getPosition(href, _opts);
			if (position) {
				e.preventDefault();
				_opts.parent
					.stop()
					.animate(
						{ scrollTop: position },
						_opts.speed,
						_opts.easing
					);
			}
		});
	};
}

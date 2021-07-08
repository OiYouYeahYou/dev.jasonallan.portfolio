/* browser.js canUse v1.0 | @ajlkn | MIT licensed */
export function canUse(key) {
	const style = document.createElement("div").style;
	const firstCharUpperKey = key.charAt(0).toUpperCase() + key.slice(1);
	return (
		key in style ||
		"Moz" + firstCharUpperKey in style ||
		"Webkit" + firstCharUpperKey in style ||
		"O" + firstCharUpperKey in style ||
		"ms" + firstCharUpperKey in style
	);
}

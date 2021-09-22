const qs = require("querystring");
const fs = require("fs");

const fetch = require("node-fetch");

const trophyOptions = qs.stringify({
	username: "OiYouYeahYou",
	theme: "flat",
	"no-frame": true,
	column: 3,
});
const trophyURL = "https://github-profile-trophy.vercel.app/?" + trophyOptions;
const output = "src/images/trophy.svg";

fetch(trophyURL)
	.then((res) => res.buffer())
	.then((buffer) => fs.writeFileSync(output, buffer))
	.catch(console.err);

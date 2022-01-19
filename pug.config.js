const fs = require("fs");

const cats = ["pic01.jpg", "pic02.jpg", "pic03.jpg"];
const randomImage = () => "../" + cats[Math.floor(Math.random() * cats.length)];

const items = JSON.parse(fs.readFileSync("./items.json", "utf-8"));
items.projects.forEach(mapItems);
items.hosting.forEach(mapItems);
// items.games.forEach(mapItems);
items.contributions.forEach(mapItems);

const title = "Jason Allan - Developer";
const headshot = "../images/quokka-logo.png";
const description = "Developer, open source advocate &amp; tech enthusiast";
const headshotAlt = "Cute little hamster";

const skills = [
	{
		class: "solid fa-code",
		title: "Languages",
		skills: "JavaScript &amp; Node.js, Go, Python Bash and Bourne Shell",
	},
	{
		class: "solid fa-cubes",
		title: "Deployment",
		skills: "Docker, Linux, Netlify",
	},
	{
		class: "solid fa-code-branch",
		title: "Versioning",
		skills: "Git, Mercurial",
	},
	{
		class: "solid fa-database",
		title: "Databases",
		skills: "Sequelize, MySQL, MongoDB",
	},
	{
		class: "solid fa-book",
		title: "Libraries",
		skills: "React, Express",
	},
	{
		class: "solid fa-tools",
		title: "Tools",
		skills: "Nodemon, PM2, Prettier, Parcel, Observable Notebook",
	},
];

const opengraph = {
	title,
	url: "https://jasonallan.dev/",
	locale: "en_GB",
	description,
	site_name: title,
	image: headshot,
};

const twitter = {
	card: "summary",
	site: "@OiYouYeahYou",
	creator: "@OiYouYeahYou",
	title,
	description,
	image: headshot,
	"image:alt": headshotAlt,
};

const social = [
	{
		icon: { category: "brands", name: "github" },
		relMe: true,
		href: "https://github.com/oiyouyeahyou",
		title: "GitHub",
	},
	{
		icon: { category: "brands", name: "twitter" },
		relMe: true,
		href: "https://twiitter.com/oiyouyeahyou",
		title: "Twitter",
	},
	{
		icon: { category: "brands", name: "stack-overflow" },
		relMe: true,
		href: "https://stackoverflow.com/story/oiyouyeahyou",
		title: "Stack Overflow",
	},
	{
		icon: { category: "brands", name: "mastodon" },
		relMe: true,
		href: "https://mastodon.social/@oiyouyeahyou",
		title: "Matodon",
	},
	{
		icon: { category: "solid", name: "envelope" },
		href: "/#contact",
		title: "Email",
	},
];

module.exports = {
	locals: { items, skills, opengraph, twitter, social },
};

function mapItems(project) {
	// Actual
	if (project.actions) {
		for (const action of project.actions) {
			const className = [];
			if (action.type) {
				className.push(action.type);
			}
			if (action.icon) {
				const { category, name } = action.icon;
				className.push(`icon ${category} fa-${name}`);
			}
			action.class = className.join(" ");
		}
	}

	// TODO: Implement upstream
	project.imageHref = "#";
	project.image = project.image || [
		{
			src: randomImage(),
			alt: "",
		},
	];
	for (const image of project.image) {
		if (!/^http(s?):\/\//i.test(image.src)) {
			image.src = "../images/items/" + image.src;
		}
	}

	if (Array.isArray(project.tech)) {
		project.tech = project.tech.join(", ");
	}
}

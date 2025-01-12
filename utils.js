export const maxSceheme = 4;
const saveKey = "scheme";

export function GetCurrentURL(onResult) {
	GetCurrentTab((tab) => {
		onResult(tab.url);
	});
}

async function GetCurrentTab(onResult) {
	let queryOptions = { active: true, currentWindow: true };
	let [tab] = await chrome.tabs.query(queryOptions);
	onResult(tab);
}

export function GetCurrentScheme(onResult) {
	chrome.storage.sync.get(
		[saveKey], (obj) => {
			let currentScheme = 0;

			if (obj[saveKey] != null)
				currentScheme = JSON.parse(obj[saveKey]);
			else // save if we can't find any
				SaveScheme(0);

			onResult(currentScheme)
		}
	);
}

export function SaveScheme(scheme) {
	var json = {};
	json[saveKey] = JSON.stringify(scheme);
	chrome.storage.sync.set(json);
}

export function GetScemeName(scheme) {
	switch (scheme) {
		case 0:
			return "Dawn";
		case 1:
			return "Ocean";
		case 2:
			return "Forest";
		case 3:
			return "Skyfall";
	}
}

export function GetScemeColors(scheme, count) {
	switch (scheme) {
		case 0:
			return GetLerps("#842222", "#eaca4b", count);
		case 1:
			return GetLerps("#3c2d68", "#64d8e2", count);
		case 2:
			return GetLerps("#305f4a", "#acdb65", count);
		case 3:
			return GetLerps("#404572", "#c85a7d", count);
	}
}

function GetLerps(color1, color2, count) {
	const colors = [];

	for (let i = 0; i < count; i++) {
		const percent = i / count;
		colors.push(LerpColor(color1, color2, percent));
	}

	return colors;
}

function LerpColor(color1, color2, percent) {
	const trueColor1 = HexToRgb(color1);
	const trueColor2 = HexToRgb(color2);

	const r = LerpNumber(trueColor1.r, trueColor2.r, percent);
	const g = LerpNumber(trueColor1.g, trueColor2.g, percent);
	const b = LerpNumber(trueColor1.b, trueColor2.b, percent);

	return RgbToHex(r, g, b);
}

function LerpNumber(min, max, percent) {
	return min + (max - min) * percent;
}

function HexToRgb(hex) {
	// Remove the hash if it's present
	hex = hex.replace(/^#/, '');

	// Parse the hex values
	const r = parseInt(hex.slice(0, 2), 16) / 255;
	const g = parseInt(hex.slice(2, 4), 16) / 255;
	const b = parseInt(hex.slice(4, 6), 16) / 255;

	return { r, g, b };
}

function RgbToHex(r, g, b) {
	const toHex = (x) => {
		const hex = Math.round(x * 255).toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	};

	return '#' + toHex(r) + toHex(g) + toHex(b);
}
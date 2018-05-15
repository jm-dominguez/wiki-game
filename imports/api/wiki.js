import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";

Meteor.methods({
	"wiki.validate"(language, startPage, endPage) {
		let startPageQuery = startPage.replace(/\s/g, "%20");
		let endPageQuery = endPage.replace(/\s/g, "%20");
		let resStartPage = HTTP.get(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&titles=${startPageQuery}`);
		let startPagesObject = resStartPage.data.query.pages;
		if ("-1" in startPagesObject) {
			return {
				errorMessage: `${startPage} page does not exist.`
			};
		}
		let resEndPage = HTTP.get(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&titles=${endPageQuery}`);
		let endPagesObject= resEndPage.data.query.pages;
		if ("-1" in endPagesObject) {
			return {
				errorMessage: `${endPage} page does not exist.`
			};
		}
		let startPageNumber;
		for (let pageNumber in startPagesObject) {
			startPageNumber = pageNumber;
			break;
		}
		let endPageNumber;
		for (let pageNumber in endPagesObject) {
			endPageNumber = pageNumber;
			break;
		}

		return {
			startPage: startPagesObject[startPageNumber].title,
			endPage: endPagesObject[endPageNumber].title
		};
	},
	"wiki.getLinks"(language, page) {
		let res = HTTP.get(`https://${language}.wikipedia.org/w/api.php?action=query&format=json&generator=links&gpllimit=50&titles=${page}`);
		let linksObject = res.data.query.pages;
		let links = [];
		for (let page in linksObject) {
			if (page.includes("-")) continue;
			links.push(linksObject[page].title);
		}
		return links;
	}
});
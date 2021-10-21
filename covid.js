const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();

const welcome = [
	{
		title: 'Welcome to my COVID-19 News API',
		endpoint: '/news',
		cityam: '/news/cityam',
		the_guardian: '/news/guardian',
		the_telegraph: '/news/telegraph',
		the_new_york_times: '/news/nyt',
		los_angeles_times: '/news/latimes',
		bbc_uk: '/news/bbc',
		standard_uk: '/news/es',
		new_york_post: '/news/nyp',
		the_sun: '/news/sun',
		daily_mail: '/news/dm',
		united_nations: '/news/un',
		the_sydney_morning_herald: '/news/smh',
		usa_today: '/news/ut',
	},
];

const newspapers = [
	{
		name: 'cityam',
		address: 'https://www.cityam.com/latest-news/',
		base: '',
	},
	{
		name: 'guardian',
		address: 'https://www.theguardian.com/world/coronavirus-outbreak',
		base: '',
	},
	{
		name: 'telegraph',
		address: 'https://www.telegraph.co.uk/health/',
		base: 'https://www.telegraph.co.uk',
	},
	{
		name: 'nyt',
		address:
			'https://www.nytimes.com/section/health?module=SectionsNav&action=click&version=BrowseTree&region=TopBar&contentCollection=Health&pgtype=undefined',
		base: 'https://www.nytimes.com',
	},
	{
		name: 'latimes',
		address: 'https://www.latimes.com/topic/covid-19-pandemic',
		base: '',
	},
	{
		name: 'bbc',
		address: 'https://www.bbc.co.uk/news/coronavirus',
		base: 'https://www.bbc.co.uk',
	},
	{
		name: 'es',
		address: 'https://www.standard.co.uk/topic/coronavirus',
		base: 'https://www.standard.co.uk',
	},
	{
		name: 'nyp',
		address: 'https://nypost.com/search/covid/',
		base: '',
	},
	{
		name: 'sun',
		address: 'https://www.thesun.co.uk/?s=covidCovid',
		base: '',
	},
	{
		name: 'dm',
		address: 'https://www.dailymail.co.uk/news/coronavirus/index.html',
		base: 'https://www.dailymail.co.uk',
	},
	{
		name: 'un',
		address: 'https://www.un.org/en/coronavirus',
		base: 'https://www.un.org',
	},
	{
		name: 'smh',
		address: 'https://www.smh.com.au/search?text=Covid',
		base: 'https://www.smh.com.au',
	},
	{
		name: 'ut',
		address: 'https://eu.usatoday.com/news/coronavirus/',
		base: '',
	},
];

const articles = [];

newspapers.forEach((newspaper) => {
	axios.get(newspaper.address).then((response) => {
		const html = response.data;
		const $ = cheerio.load(html);

		$('a:contains("Covid")', html).each(function () {
			const title = $(this).text().trim().replace(/\n/g, '').replace(/\t/g, '');
			const url = $(this).attr('href');

			articles.push({
				title,
				url: newspaper.base + url,
				source: newspaper.name,
			});
		});
		$('a:contains("COVID")', html).each(function () {
			const title = $(this).text().trim().replace(/\n/g, '').replace(/\t/g, '');
			const url = $(this).attr('href');

			articles.push({
				title,
				url: newspaper.base + url,
				source: newspaper.name,
			});
		});
	});
});

app.get('/', (req, res) => {
	res.json(welcome);
});

app.get('/news', (req, res) => {
	res.json(articles);
});

app.get('/news/:newspaperId', (req, res) => {
	const newspaperId = req.params.newspaperId;
	// console.log(newspaperId);

	const newspaperAddress = newspapers.filter(
		(newspaper) => newspaper.name == newspaperId
	)[0].address;
	const newspaperBase = newspapers.filter(
		(newspaper) => newspaper.name == newspaperId
	)[0].base;
	// console.log(newspaperAddress);

	axios
		.get(newspaperAddress)
		.then((response) => {
			const html = response.data;
			const $ = cheerio.load(html);
			const specificArticles = [];

			$('a:contains("Covid")', html).each(function () {
				const title = $(this)
					.text()
					.trim()
					.replace(/\n/g, '')
					.replace(/\t/g, '');
				const url = $(this).attr('href');
				specificArticles.push({
					title,
					url: newspaperBase + url,
					source: newspaperId,
				});
			});
			$('a:contains("COVID")', html).each(function () {
				const title = $(this)
					.text()
					.trim()
					.replace(/\n/g, '')
					.replace(/\t/g, '');
				const url = $(this).attr('href');
				specificArticles.push({
					title,
					url: newspaperBase + url,
					source: newspaperId,
				});
			});
			res.json(specificArticles);
		})
		.catch((err) => console.log(err));
});

app.listen(PORT, console.log(`server running on PORT ${PORT}`));

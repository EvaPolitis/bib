const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  //const experience = $('#experience-section > ul > li:nth-child(2)').text();
  const adresse = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text();
  return {name, adresse};
};

/**
 * parsePage permet de recuperer tous les liens des restaurants d'une page michelin
 * @param  {String} data - html response
 * @return {Object} tableau des liens de chaque restaurant de la page
 */
const parsePage = data => {
  const $ = cheerio.load(data);
  let links = [];
    $('div.js-restaurant__list_item > a').each((i,element)=>{
    const link = $(element).attr('href');
    links.push("https://guide.michelin.com/"+link);
    });
  return links;
};


/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
module.exports.scrapeRestaurant = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};

/**
 * Scrape a given restaurant url
 * @param  {String}  page
 * @return {Object} restaurant
 */
module.exports.scrapeAllRestaurant = async page =>{
  const response=await axios(page);
  const {data, status} = response;

  if(status>=200 && status<300){
    return parsePage(data);
  }
  console.error(status);
  return null;
};

    
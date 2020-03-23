const axios = require('axios');
const cheerio = require('cheerio');
const querystring = require('querystring');
const fs = require('fs');

const parsePageM = data =>{
  let $ = cheerio.load(data);
  var restaurants = [];
  try{
      $('div.single_desc').each((i,element)=>{
      $ = cheerio.load(element);
      let nom = $('div.single_libel > a ').text().replace(/\r?\n|\r/g,"");
      let adresse = $('div.single_info3 > div:nth-child(2)').text().replace(/\r?\n|\r|\t/g,"");
      restaurants.push({
        name:nom,
        adress:adresse,
      })
      });

  }
  catch(error){
      console.log(error);
      return null;
  }

  return restaurants;
}

const parseNbRestoArray = data =>{
  const $ = cheerio.load(data);
  return $('.annuaire_single').length;
}

const parseNbTotalResto = data=>{
  const $ = cheerio.load(data);
  return parseInt($('#topbar_nb_persons').text().split('R')[0]);
}

module.exports.scrapeMaitre = async page => {
  let payload={
    'page':page,
    'request_id':'77c4da74460d7b02cff1e8415404ea3a'
  };
  let options={
    'url':'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
    'method':'POST',
    'headers':{'content-type':'application/x-www-form-urlencoded'},
    'data':querystring.stringify(payload)
  }
  let response = await axios(options);
  let {data,status}=response;
  
  if(status>=200 && status <300){
    const nbRestoArray=parseNbRestoArray(data);
    const nb_res=parseNbTotalResto(data);
    const restaurants = [];
    restaurants.push(parsePageM(data));

   for (let i=2; i<=(nb_res/nbRestoArray)+1;i++){
        //console.log(i);
        payload={
          'page':i,
          'request_id':'77c4da74460d7b02cff1e8415404ea3a'
        };
        options={
          'url':'https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult',
          'method':'POST',
          'headers':{'content-type':'application/x-www-form-urlencoded'},
          'data':querystring.stringify(payload)
        }
        response = await axios(options);
        let {data,status} = response;
  
        if(status>=200 && status<300){
          results = parsePageM(data);
          restaurants.push(results);
          for (let j=0; j<results.length;j++){
            restaurants.push(results[j]);
          }
        }
    }
    console.log(restaurants);
    listRestaurant = JSON.stringify(restaurants,null,3);
    fs.writeFileSync('maitre.json',listRestaurant),(err)=>{
        if(err){
        console.log(err);
        }
        console.log('File created');
    };
    return null;

  }
  else{
      console.error(status);
  }

  return null;
}

/*module.exports.scrapePage = async page =>{
  const payload = {
      'page': page,
      'request_id': '77c4da74460d7b02cff1e8415404ea3a'
  }
   .post('https://www.maitresrestaurateurs.fr/annuaire/ajax/loadresult')
   console.log("etape1");
  if(status>=200&&status<300){
    return parsePageM(data);
  }
  console.error(status);
  return null;
};*/

/*module.exports.scrapeAllRestaurant = async page =>{
    const response=await axios(page);
    const {data, status} = response;
    console.log("etape1");
    if(status>=200 && status<300){
      return parsePageM(data);
    }
    console.error(status);
    return null;
  };*/

/*module.exports.scrapePage = async pageM =>{
  const response=await axios(pageM);
  const {data, status} = response;

  if(status>=200 && status<300){
    return parsePage(data);
  }
  console.error(status);
  return null;
};*/

/**
 * Parse webpage restaurant
 * @param  {String} data - html response
 * @return {Object} restaurant
 */
/*const parse = data => {
  const $ = cheerio.load(data);
  const name = $('.section-main h2.restaurant-details__heading--title').text();
  const experience = $('#experience-section > ul > li:nth-child(2)').text();
  const adresse = $('body > main > div.restaurant-details > div.container > div > div.col-xl-4.order-xl-8.col-lg-5.order-lg-7.restaurant-details__aside > div.restaurant-details__heading.d-lg-none > ul > li:nth-child(1)').text();

  return {name, experience, adresse};
};*/

/**
 * Scrape a given restaurant url
 * @param  {String}  url
 * @return {Object} restaurant
 */
/*module.exports.scrapeRestaurant = async url => {
  const response = await axios(url);
  const {data, status} = response;

  if (status >= 200 && status < 300) {
    return parse(data);
  }

  console.error(status);

  return null;
};*/

/**
 * Get all France located Bib Gourmand restaurants
 * @return {Array} restaurants
 *//*
module.exports.get = () => {
  return [];
};*/

/**
 * parsePage permet de recuperer tous les liens des restaurants d'une page michelin
 * @param  {String} data - html response
 * @return {Object} tableau des liens de chaque restaurant de la page
 */
/*const parsePage = data => {
  const $ = cheerio.load(data);
  let restaurants = [];
  //#zoneAnnuaire_layout > div.row.annuaire_result > div.col-md-9 > div.annuaire_result_list > div.annuaire_single.row-5603 > div.single_desc > div.single_libel > a
  //#zoneAnnuaire_layout > div.row.annuaire_result > div.col-md-9 > div.annuaire_result_list > div.annuaire_single.row-152 > div.single_desc > div.single_details > div > div:nth-child(2) > div
    $('div.annuaire_result_list > a').each((i,element)=>{
    const link = $(element).attr('href');
    const name = $(element).text();
    restaurants.push(name+" ; "+"https://www.maitresrestaurateurs.fr"+link+" ; "+adress);
    });
  return links;
};*/



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

/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre');
const fs = require('fs');

async function sandbox (searchLink, page) {
  try {
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);
    let bib_list=[];
    let countResto=0;
    for(let numPage = 1; numPage<15; numPage++){
      console.log(numPage)
      const pageBib = await michelin.scrapeAllRestaurant("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/"+numPage);
      console.log(pageBib[0]);
      
      for(let numResto = 0; numResto < 40; numResto++){
        const restaurant = await michelin.scrapeRestaurant(pageBib[numResto]);
        countResto++;
        bib_list.push(restaurant);
        console.log(restaurant);
      }
    }
    console.log("Nombre de restaurant : "+countResto);   

    listBib = JSON.stringify(bib_list,null,3);
    fs.writeFileSync('bib.json',listBib),(err)=>{
        if(err){
        console.log(err);
        }
        console.log('File created');
    };
    console.log('done for bib');


    console.log(`🕵️‍♀️  browsing ${page} source`);
    await maitre.scrapeMaitre(0);
    console.log('done for maitre');


    let rawdata = fs.readFileSync('bib.json');
    let listBibR = JSON.parse(rawdata);

    let rawdata1 = fs.readFileSync('maitre.json');
    let listMaitreR = JSON.parse(rawdata1);
 
    console.log("Nombre de restaurant bib gourmand : " + listBibR.length);
    console.log("Nombre de restaurant maitre restaurateur : " + listMaitreR.length);
    list_bib_maitre = [];
    for(let i = 0; i < listMaitreR.length; i++){
      for(let k = 0; k < listBibR.length; k++){
        //console.log(listBibR[k].adresse);
        if((listBibR[k].adresse == listMaitreR[i].adresse)){
          list_bib_maitre.push(listBibR[k]);
        }
      }
    }
    listBibXMaitre = JSON.stringify(list_bib_maitre,null,3);
    fs.writeFileSync('bibXmaitre.json',listBibXMaitre),(err)=>{
        if(err){
        console.log(err);
        }
        console.log('File created');
    };
    console.log('done for the cross');
    console.log("Nombre de match bib et maitre : " + list_bib_maitre.length);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}
const [,, searchLink] = process.argv;

sandbox(searchLink,0);

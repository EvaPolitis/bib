/* eslint-disable no-console, no-process-exit */
const michelin = require('./michelin');
const maitre = require('./maitre');
const fs = require('fs');

async function sandbox (searchLink) {
  try {
    console.log(`🕵️‍♀️  browsing ${searchLink} source`);
    let bib_list=[];
    let countResto=0;
    for(let numPage = 1; numPage<15; numPage++){
      console.log(numPage)
      const page = await michelin.scrapeAllRestaurant("https://guide.michelin.com/fr/fr/restaurants/bib-gourmand/page/"+numPage);
      console.log(page[0]);
      
      for(let numResto = 0; numResto < 40; numResto++){
        const restaurant = await michelin.scrapeRestaurant(page[numResto]);
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
  
    console.log('done');
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function sandboxPost (page) {
  try {
    console.log(`🕵️‍♀️  browsing ${page} source`);
    const restaurant = await maitre.scrapeMaitre(0);
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

const [,, searchLink] = process.argv;

sandbox(searchLink);
//sandboxPost(0);
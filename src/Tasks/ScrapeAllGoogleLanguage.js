//___ Native Node Dependencies ___//
const fs = require('fs');

//___ Other Dependencies ___//
const webdriver = require('selenium-webdriver'); 
const chrome = require('chromedriver'); // the browser driver .. 

//___ Configuration For The Automation ___// 
const chromeOptions = require ('selenium-webdriver/chrome'); // package ( part of selenium ) for work in background ..
const By = webdriver.By ; // tool for choice the search method of the DOM objects .. 
const driver = new webdriver.Builder() // like provider - interaction with the hardare - .. 
.forBrowser('chrome') // your custom browser - you can use firefox or any other browser supported - ..
.setChromeOptions( new chromeOptions.Options().headless()) // selenium work in background ..
.build(); // Opening the browser ..

//___ Custom Global Data & Funtions ___// 
const { Pause , QuitDriver } = require('../helpers/functions');
const { 
  __NUMBER_OF_ALL_LANGUAGES__ ,
  __GOOGLE_TRANSLATE_LINK__ ,
  __SAVE_FILE_PATH__
 } = require ('../helpers/data');

//___ Get The Google Translate Page ___// 
driver.get(__GOOGLE_TRANSLATE_LINK__); 

//__ START AUTO-SCRAPE __// 
var counter = 2 , result =  {
          Language : [] ,
          Index : []
} , DATA = '' ;


// Open the language box after 4 seconds .. 
Pause(4,() => {
   driver.findElement(By.className('tl-more tlid-open-target-language-list')).click();
   Pause(4,GetId);
});


// Gets the language id then save it into result.Index
const GetId = () => {

  let ids = '' ;

  Pause(1, ()=>{
    if (counter != ( __NUMBER_OF_ALL_LANGUAGES__ + 2 ) ) {
          // script for get the languge id ..  
          driver.findElement(By.xpath('//div[@class="language-list-unfiltered-langs-tl_list"]/div[2]/div['+(counter)+']'))          
          .getAttribute('class')
          .then((id) => {
            // the class with id .. 
            console.log(id);
            // extract the id from the class .. 
            if ( typeof id.split('-')[1] != 'undefined' && typeof id.split('-')[2] != 'undefined'){
                    ids = id.split('-')[1] + "-" + id.split('-')[2]; // for language when we have tow '-' like chine lang .. 
            }else{
                    ids = id.split('-')[1]; // for all resultt languages ..      
            }

            // change the selected language with empty string .. 
            let finalID = ids.replace('item-selected','');
            console.log(finalID);

            result.Index.push(finalID);
            counter++;
            GetId(); 
          })
          .catch(err => console.log(err));
    }else{    
          counter = 0 ; 
          Pause(1,GetLangRelatedToId);
    }
  });

}



// Gets the language related to id that extract then save that lang into result.Language .. 
const GetLangRelatedToId = () => {

  if (counter != result.Index.length ) {
     Pause(1,() => {
          // find name .. 
          driver.findElement(By.xpath('//div[@class="language_list_item_wrapper language_list_item_wrapper-'+result.Index[counter]+'"]/div[2]'))
          .getText()
          .then(txt => {
              if (txt == ''){
                result.Language.push('English'); // the default selected language is English ..        
              }else{
                result.Language.push(txt); // result languages .. 
              }
              console.log(txt);
              counter++ ;
              GetLangRelatedToId();
          }).catch(err => console.log(err));  
     });
  }else {
    Pause(2,AppendToArray);
  }

}


// Appends the data to languages array then save that data to DATA (global var ) .. 
const AppendToArray = () => {

  let languages = {} , lang ='' , id= '';

  for(let i = 0; i < result.Index.length ; i++){
    lang = result.Language[i];
    id = result.Index[i];
    languages[lang.toLowerCase()] = id ;
  }
  DATA = "const languages = ["+JSON.stringify(languages)+"]; \n\n\n module.exports = languages ; ";

  Pause(1 , CheckFileExistance);

}

// Delete the file language.js file if it exists before .. 
const CheckFileExistance = () => {
  fs.stat(__SAVE_FILE_PATH__,(err,stats)=>{
    if(!err) {
      // delete the file if exit .. 
      fs.unlink(__SAVE_FILE_PATH__,err => {
        if(err) err; 
        console.log(" The file that exist 📋 , deleted and a new file has been created 📝 ... ");
        AppendToFile();
      });
    }else{
      AppendToFile();
    }
  })
}

// Appends to the lang scrape file .. 
const AppendToFile = () => {
  console.log(" Data Added to 'languages.js' file ... ");
  fs.appendFileSync(__SAVE_FILE_PATH__,''+DATA+'\n');
  QuitDriver(driver);
}

//___ Native Node Dependencies ___//
const fs = require('fs');

//___ Other Dependencies ___//
const webdriver = require('selenium-webdriver'); 
const chrome = require('chromedriver'); // the browser driver .. 
const parser = require('csv-parse');

//___ Configuration For The Automation ___// 
const chromeOptions = require ('selenium-webdriver/chrome'); // package ( part of selenium ) for work in background ..
const By = webdriver.By ; // tool for choice the search method of the DOM objects .. 
const driver = new webdriver.Builder() // like provider - interaction with the hardare - .. 
.forBrowser('chrome') // your custom browser - you can use firefox or any other browser supported - ..
.setChromeOptions( new chromeOptions.Options().headless()) // selenium work in background ..
.build(); // Opening the browser ..

//___ Custom Global Data & Funtions ___// 
const { 
   Pause ,
   QuitDriver ,
   CreateTheOutputFile ,
   GetRequestDelay ,
   GetResponseDelay
 } = require('../helpers/functions');
const { 
  __SAVE_FILE_PATH__,
  __GOOGLE_TRANSLATE_LINK__ ,
  __INPUT_CSV_FILE_PATH__ ,
  __OUTPUT_CSV_FILE_PATH__
 } = require ('../helpers/data');


//___ Get The Google Translate Page ___// 
driver.get(__GOOGLE_TRANSLATE_LINK__); 

//__ START AUTO-TRANSLATE __// 

// 
const languages = require(__SAVE_FILE_PATH__);

// INIT SOME GLOBALE VAR .. 

// init the container of csv data ..  
var __CSV_DATA__ = {
  text: [],
  language: []      
} ,
// init the counter .. 
counter = 0 ,
// init the index .. 
index = 0 ,
// init the DATA ( output ) ..
DATA = [] ;


// Read the data from input.csv file then save all data in to my custom csv container ..  
Pause(1,()=>{

   console.log("-> Reading CSV file .. ");
   fs
     .createReadStream(__INPUT_CSV_FILE_PATH__)
     .pipe(parser({delimiter:','},(error , data)=>{
         data.forEach(data => {
            __CSV_DATA__.text.push(data[0]);
            __CSV_DATA__.language.push(data[1]);  
         });       
      })
     );
       
   Pause(3,AutoTranslate);

});




// Translate all data into the csv container .. 
const AutoTranslate = () => {

      console.log("-> Runnig the google translate scraping ⚙️ .. ");
          
      Pause(2,()=>{
         if( counter != __CSV_DATA__.text.length ){

            // fix the max char can you enter ..  
            if (__CSV_DATA__.text[counter].length <= 5000 ){

               driver.findElement(By.id('source')).sendKeys(__CSV_DATA__.text[counter]);
               console.log(__CSV_DATA__.text[counter].length);
               driver.findElement(By.className('tl-more tlid-open-target-language-list')).click();
               console.log(' Time required in seconds for My Internet Connection ( I\'m Imed Jaberi .. ) '+GetRequestDelay(__CSV_DATA__.text[counter].length));
               // prepare the request .. 
               Pause(GetRequestDelay(__CSV_DATA__.text[counter]),()=>{
                  // return the language with id ( languages[0][__CSV_DATA__.language[counter].toLowerCase()] ) ... 
                  
                  if(languages[0][__CSV_DATA__.language[counter].toLowerCase()]){
                        console.log('--> Language Exists ... ');
                        // the first part is the ids ( languages[0][__CSV_DATA__.language[counter].toLowerCase()] ) .. 
                        let targetLanguageId = languages[0][__CSV_DATA__.language[counter].toLowerCase()].trim();
                        console.log(targetLanguageId);

                        /**
					          *  Some cases dispatch a exceptions ... 
					          * 1st case: we are selecting new language ..
					          * 2nd case: language is selected and present in the top menu in same time .. 
					          * 3rd case: language is present in the top menu ..
                         * 4rd case : language is selected .. 
					          */

                        // 1st case 
                        driver.findElement(By.xpath('//div[@class="language_list_item_wrapper language_list_item_wrapper-'+(targetLanguageId)+'"]'))
                        .click()
                        .catch(Exception => console.log(" Exception : case 1 "));

                        // 2nd case
                        driver.findElement(By.xpath('//div[@class="language_list_item_wrapper language_list_item_wrapper-'+(targetLanguageId)+'item-selected item-emhasized"]'))
                        .click()
                        .catch(Exception => console.log(" Exception : case 2 "));

                        // 3rd case
                        driver.findElement(By.xpath('//div[@class="item-emhasized"]'))
                        .click()
                        .catch(Exception =>console.log(" Exception : case 3 "));

                        // 4rd case
                        driver.findElement(By.xpath('//div[@class="item-selected"]'))
                        .click()
                        .catch(Exception => console.log(" Exception : case 4 "));


                        // prepare the response ... 
                        Pause(GetResponseDelay(__CSV_DATA__.text[counter]),()=>{
                          driver.findElement(By.xpath('//span[@class="tlid-translation translation"]'))
                          .getText()
                          .then((translatedText)=>{
                              
                           console.log(translatedText);
                              
                              DATA.push({
                                 text: __CSV_DATA__.text[counter],
                                 languageToTranslateText: __CSV_DATA__.language[counter],
                                 translatedText
                              });

                              CreateTheOutputFile( __OUTPUT_CSV_FILE_PATH__ , index , DATA);
                              // re-init .. 
                              index++;

                              driver.findElement(By.id('source')).clear();
                              counter++;
                              AutoTranslate();
                          }).catch(err => console.log(err));

                        });
                  }else{
                        console.log('-> Language Not Found On Google TN ..');
                        driver.findElement(By.className('tl-more tlid-open-target-language-list')).click();
                        
                        DATA.push({
                              text: __CSV_DATA__.text[counter],
                              languageToTranslateText: __CSV_DATA__.language[counter],
                              translatedText: 'Language Not Found ..'
                        });

                        CreateTheOutputFile(__OUTPUT_CSV_FILE_PATH__ , index , DATA);
                        // re-init .. 
                        index++;

                        driver.findElement(By.id('source')).clear();

                        counter++;
                        AutoTranslate();
                  }
               });
            }else {
                    console.log('-> The text that need to be translated limit to 5000 chars only ...');
                    
                    DATA.push({
                     text: __CSV_DATA__.text[counter],
                     languageToTranslateText: __CSV_DATA__.language[counter],
                     translatedText: 'The text that need to be translated limit to 5000 chars only ...'
                    });

                    CreateTheOutputFile(__OUTPUT_CSV_FILE_PATH__ , index , DATA);
                     // re-init .. 
                     index++;

                    driver.findElement(By.id('source')).clear();
                    counter++;
                    AutoTranslate();
            }
         }else{
            console.log("-> All data has been parsed ...");
            QuitDriver(driver);
         }
      });
}

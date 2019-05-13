
// Custom Pause using setTimeout ...
const Pause = (Time , call_back_func ) => {
   setTimeout(call_back_func , Time * 1000 ) ;
}

// Stop the automation .. 
const QuitDriver = (driver) =>{
   driver.close();
   driver.quit();
}


// Appends the results to the file ( if not exit create ) .. 
const CreateTheOutputFile = (output_path , index , all_data ) => {

   const fs = require('fs');

   fs.appendFileSync(output_path,''
   + all_data[index].text + ','
   + all_data[index].languageToTranslateText + ','
   + all_data[index].translatedText 
   + '\n');
   all_data = [] ;
}

// custom google request - my net -  
const GetRequestDelay = (piece)=>{

   if ( piece.length >= 300 && piece.length <= 500 ) {
      return  6 ; 
   } else if (piece.length >= 301 && piece.length <= 1000 ) {
      return 8 ; 
   }else if (piece.length >= 1001 && piece.length <= 2000 ) {
      return 12 ; 
   }else if (piece.length >= 2001 && piece.length <= 3000 ) {
      return 15 ; 
   }else if (piece.length >= 3001 && piece.length <= 4000 ) {
      return 18 ; 
   }else if (piece.length >= 4001 && piece.length <= 5000 ) {
      return 22 ; 
   }else {
      return 4
   }

}

// custom google response - my net -  
const GetResponseDelay = (piece) => ( piece.length >= 2500 && piece.length <= 5000 ) ? 8 : 4 ;

// run any commande line script .. 
const RunCmdScript = (script) => {
   const exec = require('child_process').exec ;

      exec(script,
    function (error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
             console.log('exec error: ' + error);
        }
});
}

module.exports = { 
   Pause ,
   QuitDriver , 
   CreateTheOutputFile , 
   GetRequestDelay , 
   GetResponseDelay , 
   RunCmdScript 
};
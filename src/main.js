const { __RUN_SCRAPE_SCRIPT__ , __RUN_TRANSLATE_SCRIPT__ } = require('./helpers/data');
const { Pause , RunCmdScript } = require('./helpers/functions');


const ___RUN__THE__AUTOMATION__PROECT___ = () => {
   
  console.log("--> Now Run The Auto-Scrape .. ");  
                
  try {
    const cluster = require('./data/cluster/languages'); 
    console.log("--> Exist The Languages Files ... \n ");
    
    console.log("--> Now Run The Auto-Translate .. ");                
    RunCmdScript(__RUN_TRANSLATE_SCRIPT__);
  }catch (error) {
     RunCmdScript(__RUN_SCRAPE_SCRIPT__);
     Pause(70 , () => {
      console.log("--> Now Run The Auto-Translate .. ");                
      RunCmdScript(__RUN_TRANSLATE_SCRIPT__); 
     });
  }
  
};

module.exports = ___RUN__THE__AUTOMATION__PROECT___ ; 

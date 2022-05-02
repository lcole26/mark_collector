
var try_analysis = function (formatted_data) {
  let analysis = null;
  let current_api_key = null;
  let index = 0;
  console.log(`number of keys: ${list_of_keys.length}`);
  for (index; index < list_of_keys.length; index++) {
    current_api_key = list_of_keys[index];
    console.log(`index: ${index} | key: ${current_api_key}`);
    // const element = list_of_keys[index];
    // if (index === 1) {
    //   console.log(`valid key found at : ${current_api_key} at index ${index}`);
    //   return { index, current_api_key, analysis };
    // }
    analysis = tryAnalysisWithKey(formatted_data, current_api_key);
    if (analysis) {
      console.log(`valid key found at : ${current_api_key} at index ${index}`);
      // analysis = try_analysis;
      // break;
      return { index, current_api_key, analysis };
    }
  }


  // for (const [index, api_key] of list_of_keys.entries()) {
  //   console.log(`index: ${index} | key: ${api_key}`);
  //   // analysis = tryAnalysisWithKey(formatted_data, api_key);
  //   // if (analysis) {
  //   //   // break;
  //   //   return { index, api_key, analysis };
  //   // }

  //   if (index === 1) {
  //     return { index, api_key, analysis };
  //   }
  // }


  // // would be null/undefined here
  // return analysis;
  return { index, current_api_key, analysis };
};
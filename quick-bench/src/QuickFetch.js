import Fetch from 'components/Fetch.js'

function fetchResults(obj, callback){ 
 return Fetch.fetchResults('quick', obj, 60, callback);
}


function fetchContent(id, callback) {
    return Fetch.fetchContent('quick', id, callback);
}

export default {
    fetchResults: fetchResults,
    fetchContent: fetchContent
}
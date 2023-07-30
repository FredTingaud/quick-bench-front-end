import Fetch from 'components/Fetch.js'

function fetchResults(obj, timeout, callback, progressCallback){ 
    return Fetch.fetchResults('quick', obj, timeout, callback, progressCallback);
}

function fetchId(id, callback) {
    return Fetch.fetchId('quick', id, callback);
}

function fetchEnv(callback) {
    return Fetch.fetch('quick-env', callback)
}

const QuickFetch = {
    fetchResults: fetchResults,
    fetchId: fetchId,
    fetchEnv: fetchEnv
};

export default QuickFetch
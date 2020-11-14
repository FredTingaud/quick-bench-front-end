import Fetch from 'components/Fetch.js'

function fetchResults(obj, timeout, callback, progressCallback){ 
    return Fetch.fetchResults('build', obj, timeout, callback, progressCallback);
}

function fetchId(id, callback) {
    return Fetch.fetchId('build', id, callback);
}

function fetchEnv(callback) {
    return Fetch.fetch('build-env', callback)
}
export default {
    fetchResults: fetchResults,
    fetchId: fetchId,
    fetchEnv: fetchEnv
}

const url = process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : window.location.origin;

let waitingForContainers = false;

async function fetchResults(route, obj, timeout, callback, progressCallback) {
    let progress = 0;
    let interval = setInterval(() => {
        progress = progress + 100 / timeout;
        progressCallback(progress);
    }, 1000);
    try {
        const res = await fetch(url + '/' + route + '/'
            , {
                method: "POST"
                , json: true
                , headers: {
                    "content-type": "application/json"
                }
                , body: JSON.stringify(obj)
            });
        clearInterval(interval);
        if (res.ok) {
            callback(await res.json(), null);
        } else {
            callback(null, await res.text());
        }
    } catch (err) {
        clearInterval(interval);
        callback(null, err.message);
    }
}

async function waitForContainers() {
    while (waitingForContainers) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
}

async function fetchId(route, id, callback) {
    try {
        await waitForContainers();
        const result = await fetch(url + '/' + route + '/' + id);
        if (result.ok) {
            callback(await result.json());
        } else {
            callback(null);
        }
    } catch (_) {
        callback(null);
    }
}

async function fetchRoute(route, callback) {
    try {
        const result = await fetch(url + '/' + route);
        if (result.ok) {
            callback(await result.json());
        } else {
            callback(null);
        }
    } catch (_) {
        callback(null);
    }
}

async function fetchPossibleContainers(callback) {
    waitingForContainers = true;
    try {
        const result = await fetch(url + '/containers/');
        if (result.ok) {
            callback((await result.json()).tags);
        } else {
            callback(null);
        }
    } catch (_) {
        callback(null);
    }
    waitingForContainers = false;
}

async function pullContainers(list, callback) {
    try {
        const result = await fetch(url + '/containers/'
            , {
                method: "POST"
                , json: true
                , headers: {
                    "content-type": "application/json"
                }
                , body: JSON.stringify({ tags: list })
            });
        if (result.ok) {
            callback((await result.json()).containers);
        } else {
            callback(null);
        }
    } catch (_) {
        callback(null);
    }
}

async function deleteContainers(list, callback) {
    try {
        const result = await fetch(
            url + '/containers/'
            , {
                method: "DELETE"
                , json: true
                , headers: {
                    "content-type": "application/json"
                }
                , body: JSON.stringify({ tags: list })
            });
        if (result.ok) {
            callback((await result.json()).containers);
        } else {
            callback(null);
        }
    } catch (_) {
        callback(null);
    }
}

export default {
    fetchResults: fetchResults,
    fetchId: fetchId,
    fetch: fetchRoute,
    fetchPossibleContainers: fetchPossibleContainers,
    pullContainers: pullContainers,
    deleteContainers: deleteContainers
};

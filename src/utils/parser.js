const simpleStringify = (object) => {
    const simpleObject = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in object) {
        // eslint-disable-next-line no-prototype-builtins
        if (!object.hasOwnProperty(prop)) {
            // eslint-disable-next-line no-continue
            continue;
        }
        if (typeof (object[prop]) === 'object') {
            // eslint-disable-next-line no-continue
            continue;
        }
        if (typeof (object[prop]) === 'function') {
            // eslint-disable-next-line no-continue
            continue;
        }
        simpleObject[prop] = object[prop];
    }
    return JSON.stringify(simpleObject); // returns cleaned up JSON
};

export {
    simpleStringify
};

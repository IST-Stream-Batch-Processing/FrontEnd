const reportWebVitals = (onPerfEntry) => {
    if (onPerfEntry) {
        if (onPerfEntry instanceof Function) {
            import('web-vitals').then(({
                                           getCLS, getFID, getFCP, getLCP, getTTFB,
                                       }) => {
                getCLS(onPerfEntry);
                getFID(onPerfEntry);
                getFCP(onPerfEntry);
                getLCP(onPerfEntry);
                getTTFB(onPerfEntry);
            });
        }
    }
};

export default reportWebVitals;

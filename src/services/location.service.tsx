const getLocationAsync = (): Promise<{latitude: number, longitude: number}> => new Promise((resolve, reject) => {
    const geo = navigator.geolocation;
    if (!geo) {
         reject();
    }
    geo.getCurrentPosition(({coords}: Position) => {
       resolve(coords)
    }, () => { reject()},{enableHighAccuracy: false, timeout: 10000})
})

export {getLocationAsync}
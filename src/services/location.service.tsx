const getLocationAsync = (): Promise<{ latitude: number; longitude: number }> =>
  new Promise((resolve, reject) => {
    console.log('asdsad');
    const geo = navigator.geolocation;
    if (!geo) {
      reject();
    }
    geo.getCurrentPosition(
      ({ coords }: Position) => {
        console.log(coords, '1234');
        resolve(coords);
      },
      () => {
        console.log('asd1111');
        reject();
      },
      { maximumAge: 60000, timeout: 5000, enableHighAccuracy: false },
    );
  });

export { getLocationAsync };

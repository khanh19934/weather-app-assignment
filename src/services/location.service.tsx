const getLocationAsync = (): Promise<{ latitude: number; longitude: number }> =>
  new Promise((resolve, reject) => {
    const geo = navigator.geolocation;
    if (!geo) {
      reject();
    }
    geo.getCurrentPosition(
      ({ coords }: Position) => {
        resolve(coords);
      },
      () => {
        reject();
      },
      { maximumAge: 60000, timeout: 5000, enableHighAccuracy: false },
    );
  });

export { getLocationAsync };

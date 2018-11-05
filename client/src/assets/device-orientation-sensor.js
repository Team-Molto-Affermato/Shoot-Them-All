import {AbsoluteOrientationSensor} from "./motion-sensors";

export function createSensor(updateOrientation, handleError) {

  if (navigator.permissions) {
    // https://w3c.github.io/orientation-sensor/#model
    Promise.all([navigator.permissions.query({ name: "accelerometer" }),
      navigator.permissions.query({ name: "magnetometer" }),
      navigator.permissions.query({ name: "gyroscope" })])
      .then(results => {
        if (results.every(result => result.state === "granted")) {
          initSensor(updateOrientation, handleError);
        } else {
          handleError("Permission to use sensor was denied.");
        }
      }).catch(err => {
      console.log("Integration with Permissions API is not enabled, still try to start app.");
      initSensor(updateOrientation, handleError);
    });
  } else {
    console.log("No Permissions API, still try to start app.");
    initSensor(updateOrientation, handleError);
  }
}

function initSensor(updateOrientation, handleError) {
  const options = { frequency: 60 };
  var sensor = new AbsoluteOrientationSensor(options);

  sensor.onreading = () => {
    const q = {
      x: sensor.quaternion[0],
      y: sensor.quaternion[1],
      z: sensor.quaternion[2],
      w: sensor.quaternion[3],
    };
    updateOrientation(q);
  };

  sensor.onerror = (event) => {
    if (event.error.name === 'NotReadableError') {
      handleError("Sensor is not available.");
    }
  };
  sensor.start();
}

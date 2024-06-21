const fs = require("fs");
const Leap = require("leapjs");

let framesTotales = 0;
let framesConDatos = 0;
let primerIDDatos = -1;
let ultimoIDConDatos = -1;
const datos = [];

Leap.loop({ enableGestures: true }, (fotograma) => {
  framesTotales++;
  if (fotograma.hands.length > 0) {
    if (primerIDDatos === -1) {
      primerIDDatos = fotograma.id;
    }
    const mano = fotograma.hands.find((hand) => hand.type === "right");
    if (mano) {
      const datosMano = extraerDatosMano(fotograma.id, mano);
      datos.push(datosMano);
      framesConDatos++;
      ultimoIDConDatos = fotograma.id;
    }
  } else if (framesConDatos > 0) {
    Leap.loopController.disconnect();
    guardarDatos();
  }
});

const extraerDatosMano = (id, mano) => ({
  id,
  dedos: mano.fingers.map((finger) => ({
    posicion: finger.distal.nextJoint.map((valor, i) =>
      parseFloat((valor - mano.palmPosition[i]).toFixed(1))
    ),
    direccion: finger.direction.map((valor) => parseFloat(valor.toFixed(3))),
  })),
  muneca: mano.arm
    ? mano.arm.nextJoint.map((valor, i) =>
        parseFloat((valor - mano.palmPosition[i]).toFixed(1))
      )
    : [0, 0, 0],
});

const guardarDatos = () => {
  const datosAGuardar = {
    primerIDDatos,
    ultimoIDConDatos,
    framesTotales,
    framesConDatos,
    datos,
  };
  fs.writeFileSync("data.json", JSON.stringify(datosAGuardar, null, 2));
  console.log("Datos guardados en data.json");
  process.exit();
};

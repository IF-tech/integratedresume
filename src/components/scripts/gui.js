let params = {
    colorparams : { background: 0x121212 },
    lightparams : {
      hemi: { position: { x: 0, y: 0, z: 0 }, intensity: 0.67 },
      dir: { position: { x: 0, y: 0, z: 0 }, intensity: 0.91 },
    },
}
function importGUI(backgroundColor){
const gui = new GUI();

const maincolor = gui.addColor(params.colorparams, "background").listen();

  maincolor.onChange(function (newValue) {
    backgroundColor = newValue;
  });

//   const lightfolder = gui.addFolder("Lighting");
//   const hemilightfolder = lightfolder.addFolder("Hemisphere");

//   const hemiIntensity = hemilightfolder.add(lightparams.hemi, "intensity", 0, 2);

//   hemiIntensity.onChange(function (modifier) {
//     hemiLight.intensity = 1;
//     hemiLight.intensity = hemiLight.intensity * modifier;
//   });

//   const dirIntensity = lightfolder.add(lightparams.dir, "intensity", 0, 2);

//   dirIntensity.onChange(function (modifier) {
//     dirLight.intensity = 1;
//     dirLight.intensity = dirLight.intensity * modifier;
//   });
}
  export {params, importGUI}
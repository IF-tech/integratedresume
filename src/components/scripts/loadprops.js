function loadRock(loader, scene) {
const ROCK2_PATH = "../assets/3d/Rocks2.glb";
let model;
loader.load(
    ROCK2_PATH,
    function (gltf) {
      // A lot is going to happen here
      model = gltf.scene;
      

      model.scale.set(5, 5, 5);
      model.position.y = -12;
      model.position.x = -20;
      model.position.z = -6;
      model.rotation.y = 90;

    scene.add(model);
    },
    undefined, // We don't need this function
    function (error) {
      console.error(error);
    }
  );
}
function loadStump(loader, scene) {
    const STUMP_PATH = "../assets/3d/stumpandlaptop.glb";
    let model;
    loader.load(
        STUMP_PATH,
        function (gltf) {
          // A lot is going to happen here
          model = gltf.scene;
          
    
          model.scale.set(5, 5, 5);
          model.position.y = -11;
          model.position.x = 9;
          model.position.z = 3;
          model.rotation.y = 180.2;
          model.castShadow = true;
          model.recieveShadow = true;
          scene.add(model);
        },
        undefined, // We don't need this function
        function (error) {
          console.error(error);
        }
      );
    }
function loadTree(loader, scene) {
    let model;
    let TREE_PATH = "./assets/3d/generictree.glb";
    loader.load(
      TREE_PATH,
      function (gltf) {
        // A lot is going to happen here
        model = gltf.scene;
        model.castShadow = true;
        model.recieveShadow = true;
        model.scale.set(50, 50, 50);
        model.position.y = -3;
        model.position.x = 2;
        model.position.z = -3;

        scene.add(model);
      },
      undefined, // We don't need this function
      function (error) {
        console.error(error);
      }
    );
    }

export  { loadRock, loadStump, loadTree }

    import * as THREE from "three";
    
    let d = 10.25;
    let pointd = 18.25
    // Add lights
    // Add hemisphere light to scene
    let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, .4);
    hemiLight.position.set(100, 100, 100);

    let ambientLight = new THREE.AmbientLight(0xffffff, .25);

    let dirLight = new THREE.DirectionalLight(0xffffff, .6);
    dirLight.color.setHSL(0., .5, 0.95);
    dirLight.position.set(-50, 50, 30);
    dirLight.castShadow = false;
    dirLight.shadow.radius = 2;
    dirLight.shadow.mapSize = new THREE.Vector2(500, 500);
    dirLight.shadow.camera.near = 0.1;
    dirLight.shadow.camera.far = 1500;
    dirLight.shadow.camera.left = d * -1;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = d * -1;

    let pointLight = new THREE.PointLight(0xffbc12, 1, 0, 2);
    pointLight.position.set(-8, 0.8, 27)
    pointLight.castShadow = true; 
    pointLight.shadow.radius = 5;
    pointLight.shadow.mapSize = new THREE.Vector2(500, 500);
    pointLight.shadow.camera.near = 0.1;
    pointLight.shadow.camera.far = 1500;
    pointLight.shadow.camera.left = pointd * -1;
    pointLight.shadow.camera.right = pointd;
    pointLight.shadow.camera.top = pointd;
    pointLight.shadow.camera.bottom = pointd * -1;
    
    
    
    

    export { hemiLight, ambientLight, pointLight, dirLight}
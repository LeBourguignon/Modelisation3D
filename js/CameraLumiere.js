 var xDir=0;
 var yDir=0;
 var zDir=0.25;
  
 function cameraLumiere(scene,camera){   // creation de la camera 
  camera.up = new THREE.Vector3( 0, 0, 1 );
  let xPos=3;
  let yPos=3;
  let zPos=3;
  camera.position.set(xPos, yPos, zPos);
  camera.lookAt(xDir, yDir, zDir);
  camera.updateProjectionMatrix();
  actuaPosCameraHTML(camera);
} // fin fonction cameraLumiere

 function actuaPosCameraHTML(camera){
  document.forms["controle"].PosX.value=camera.position.x;
  document.forms["controle"].PosY.value=camera.position.y;
  document.forms["controle"].PosZ.value=camera.position.z;
  document.forms["controle"].DirX.value=xDir;
  document.forms["controle"].DirY.value=yDir;
  document.forms["controle"].DirZ.value=zDir;
 }
 
//*************************************************************
//* 
//        F I N     C A M E R A
//
//*************************************************************

 function lumiere(scene){
    let lumPt = new THREE.PointLight(0xff55ff);
    lumPt.position.set(3,3,-3);
    lumPt.intensity = 1;
    lumPt.shadow.camera.far=2000;
    lumPt.shadow.camera.near=0;
    scene.add(lumPt);
    let lumPt1 = new THREE.PointLight(0xffffff);
    lumPt1.castShadow = true;
    lumPt1.shadow.camera.far=2000;
    lumPt1.shadow.camera.near=0;
    lumPt1.position.set(5,-15,15);
    lumPt1.intensity = 1;
    scene.add(lumPt1);
}// fin fonction lumiere
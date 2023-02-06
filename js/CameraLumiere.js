const xDir=0;
const yDir=0;
const zDir=0;

const xPos=10;
const yPos=10;
const zPos=10;

const borneVuePos = 50;
const borneVueDir = 20;
  
function cameraLumiere(scene,camera){   // creation de la camera 
	camera.up = new THREE.Vector3( 0, 0, 1 );
	camera.position.set(xPos, yPos, zPos);
	camera.lookAt(xDir, yDir, zDir);
	camera.updateProjectionMatrix();
} // fin fonction cameraLumiere

function ajoutCameraGui(gui, menuGUI, camera) {
	let guiCamera = gui.addFolder("Camera");
	guiCamera.add(menuGUI, "cameraxPos", -borneVuePos, borneVuePos).onChange(function () {
		camera.position.set(
			menuGUI.cameraxPos, 
			menuGUI.camerayPos, 
			menuGUI.camerazPos
		);
		camera.lookAt(menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir);
	});

	guiCamera.add(menuGUI, "camerayPos", -borneVuePos, borneVuePos).onChange(function () {
		camera.position.set(
			menuGUI.cameraxPos, 
			menuGUI.camerayPos, 
			menuGUI.camerazPos
		);
		camera.lookAt(menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir);
	});

	guiCamera.add(menuGUI, "camerazPos", -borneVuePos, borneVuePos).onChange(function () {
		camera.position.set(
			menuGUI.cameraxPos, 
			menuGUI.camerayPos, 
			menuGUI.camerazPos
		);
		camera.lookAt(menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir);
	});

	guiCamera.add(menuGUI, "cameraxDir", -borneVueDir, borneVueDir).onChange(function () {
		camera.lookAt(menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir);
	});

	guiCamera.add(menuGUI, "camerayDir", -borneVueDir, borneVueDir).onChange(function () {
		camera.lookAt(menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir);
	});

	guiCamera.add(menuGUI, "camerazDir", -borneVueDir, borneVueDir).onChange(function () {
		camera.lookAt(menuGUI.cameraxDir, menuGUI.camerayDir, menuGUI.camerazDir);
	});
}

function lumiere(scene){
	let lumPt = new THREE.PointLight(0xff55ff);
	lumPt.position.set(3,3,-3);
	lumPt.intensity = 1;
	lumPt.shadow.camera.far=2000;
	lumPt.shadow.camera.near=0;
	scene.add(lumPt);

	let lumPt1 = new THREE.PointLight(0xffffff);
	lumPt1.position.set(5,-15,15);
	lumPt1.intensity = 1;
	lumPt1.shadow.camera.far=2000;
	lumPt1.shadow.camera.near=0;
	lumPt1.castShadow = true;
	scene.add(lumPt1);
}// fin fonction lumiere
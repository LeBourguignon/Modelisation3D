function init(){
	var stats = initStats();
    
	// creation de rendu et de la taille
	let rendu = new THREE.WebGLRenderer({ antialias: true });
	rendu.shadowMap.enabled = true;
	rendu.setClearColor(new THREE.Color(0xFFFFFF));
	rendu.setSize(window.innerWidth*.9, window.innerHeight*.9);

	let scene = new THREE.Scene();   
	let camera = new THREE.PerspectiveCamera(
		75, 
		window.innerWidth / window.innerHeight, 
		1, 
		1000
		);
	
	cameraLumiere(scene,camera);
	lumiere(scene);
	repere(scene);
 
	var axes = new THREE.AxesHelper(1);
	scene.add(axes);
	repere(scene);

	//********************************************************
	//
	//  P A R T I E     G E O M E T R I Q U E
	//
	//********************************************************
 
	// Création de la sphère S : centre O, rayon 5
	var sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
	var sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
	sphereMaterial.transparent = true;
	sphereMaterial.opacity = 0.5;
	var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
	scene.add(sphere);

	// Création de la sphère S0 : centre 1, rayon 1
	var smallSphereGeometry = new THREE.SphereGeometry(1, 32, 32);
	var smallSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	var smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
	smallSphere.position.set(sphere.position.x + 5, sphere.position.y, sphere.position.z);
	scene.add(smallSphere);

 
	//********************************************************
	//
	// F I N      P A R T I E     G E O M E T R I Q U E
	//
	//********************************************************

	//********************************************************
	//
	//  D E B U T     M E N U     G U I
	//
	//********************************************************

	let gui = new dat.GUI();
	let menuGUI = new function () {
		this.cameraxPos = camera.position.x;
		this.camerayPos = camera.position.y;
		this.camerazPos = camera.position.z;
		this.cameraZoom = 0.01;
		this.cameraxDir = 0;
		this.camerayDir = 0;
		this.camerazDir = 0;

		this.actualisation = function () {
			posCamera();
			reAffichage();
		};
	};

	ajoutCameraGui(gui, menuGUI, camera);

	//********************************************************
	//
	//  F I N     M E N U     G U I
	//
	//********************************************************
 	renduAnim();
 
 
	// ajoute le rendu dans l'element HTML
	document.getElementById("webgl").appendChild(rendu.domElement);
	
	// affichage de la scene
	rendu.render(scene, camera);
	
	
	function reAffichage() {
		setTimeout(function () { 
		
		}, 200);// fin setTimeout(function ()
		// render avec requestAnimationFrame
		rendu.render(scene, camera);
	}// fin fonction reAffichage()
	
	
	function renduAnim() {
		stats.update();
		// render avec requestAnimationFrame
		requestAnimationFrame(renduAnim);
		// ajoute le rendu dans l'element HTML
		rendu.render(scene, camera);
	}
	
} // fin fonction init()

function vecteur(MaScene, A, B, CoulHexa, longCone, RayonCone) {
	// MaScene : objet de type THREE.Scene
	// A, B : objets de type THREE.Vector3
	// CoulHexa : couleur du vecteur en hexadécimal
	// longCone : longueur du cone
	// RayonCone : rayon maximal du cone
	// Création du vecteur AB
	let AB = new THREE.Vector3();
	AB.subVectors(B, A);
	// Création de la flèche du vecteur AB
	let flecheAB = new THREE.ArrowHelper(AB.clone().normalize(), A, AB.length(), CoulHexa, longCone, RayonCone);
	// Ajout de la flèche du vecteur AB à la scène
	MaScene.add(flecheAB);
}// fin function vecteur()
  
function repere(MaScene) {
	// MaScene : objet de type THREE.Scene
	// Création des axes du repère
	vecteur(MaScene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(1, 0, 0), 0xFF0000, 0.1, 0.05);
	vecteur(MaScene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1, 0), 0x00FF00, 0.1, 0.05);
	vecteur(MaScene, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1), 0x0000FF, 0.1, 0.05);
}// fin function repere()
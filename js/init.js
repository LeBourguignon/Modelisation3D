function init(){
	let stats = initStats();
    
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
 
	let axes = new THREE.AxesHelper(1);
	scene.add(axes);
	repere(scene);

	//********************************************************
	//
	//  P A R T I E     G E O M E T R I Q U E
	//
	//********************************************************

	let sphere, smallSphere, poleNord, courbeBezier;
	let rayon = {radius: 5}, smallRayon = {radius: 1};
	let p0 = {x: 9, y: 7}, p1 = {x: -15, y: 0}, p2 = {x: 3, y: -9};
 
	function calculeGeometrique() {
		while(scene.children.length > 0) {
			scene.remove(scene.children[0]);
		}
		cameraLumiere(scene,camera);
		lumiere(scene);
		repere(scene);

		scene.add(axes);
		repere(scene);

		// Création de la sphère S : centre O
		let sphereGeometry = new THREE.SphereGeometry(rayon.radius, 32, 32);
		let sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000FF });
		sphereMaterial.transparent = true;
		sphereMaterial.opacity = 0.5;
		sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		scene.add(sphere);

		// Création de la sphère S0 : centre 1, rayon 1
		let smallSphereGeometry = new THREE.SphereGeometry(smallRayon.radius, 32, 32);
		let smallSphereMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
		smallSphereMaterial.transparent = true;
		smallSphereMaterial.opacity = 0.5;
		smallSphere = new THREE.Mesh(smallSphereGeometry, smallSphereMaterial);
		smallSphere.position.set(sphere.position.x + rayon.radius, sphere.position.y, sphere.position.z);
		scene.add(smallSphere);

		// Réalisation d'une projection stéréographique de S
		// Choix du pole de la projection stéréographique
		let longitudeNord = Math.PI/2;
		let latitudeNord = 0;

		poleNord = new THREE.Vector3(
			0, //rayon * Math.cos(longitudeNord) * Math.cos(latitudeNord),
			0, //rayon * Math.cos(longitudeNord) * Math.sin(latitudeNord),
			rayon.radius //rayon * Math.sin(longitudeNord)
		);
		let poleSud = poleNord.clone().multiplyScalar(-1);

		// Création d'un plan tangent au pole Sud de la sphère S
		let normalPlan = poleSud.clone().multiplyScalar(rayon.radius);
		let plan = new THREE.Plane(normalPlan, -rayon.radius);

		// Affichage du plan tangent
		let planTangentMesh = new THREE.PlaneHelper(plan, 50, 0x00FF00);
		scene.add(planTangentMesh);

		// Création d'une courbe aléatoire de Bézier de degré 2 appartenant au plan tangent
		courbeBezier = new THREE.QuadraticBezierCurve3(
			new THREE.Vector3(p0.x, p0.y, -rayon.radius),
			new THREE.Vector3(p1.x, p1.y, -rayon.radius),
			new THREE.Vector3(p2.x, p2.y, -rayon.radius)
		);

		// Affichage de la courbe de Bézier
		let courbeBezierGeometry = new THREE.Geometry();
		courbeBezierGeometry.vertices = courbeBezier.getPoints(50);
		let courbeBezierMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
		let courbeBezierMesh = new THREE.Line(courbeBezierGeometry, courbeBezierMaterial);
		scene.add(courbeBezierMesh);
		
		// Création d'une courbe de Bézier à partir d'un tableau de points
		let points = [];
		// Créer un raycaster
		let raycaster = new THREE.Raycaster();
		for (let i = 0; i < 100; i++) {
			// Définition du temps
			let t = ((i) % 100) / 100;

			// Définir le point de départ et la direction du rayon
			let origin = courbeBezier.getPoint(t);
			let direction = new THREE.Vector3().subVectors(poleNord, courbeBezier.getPoint(t));
			direction.normalize();

			// Mettre à jour le raycaster avec la position et la direction
			raycaster.set(origin, direction);

			// Trouver les points d'intersection entre le rayon et la sphère
			let intersects = raycaster.intersectObject(sphere);

			points.push(new THREE.Vector3(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z));
		}

		// Affichage de la courbe obtenue par projection stéréographique
		let courbeProjetee = new THREE.Geometry();
		courbeProjetee.vertices = points;
		let courbeProjeteeMaterial = new THREE.LineBasicMaterial({ color: 0xFF0000 });
		let courbeProjeteeMesh = new THREE.Line(courbeProjetee, courbeProjeteeMaterial);
		scene.add(courbeProjeteeMesh);
	}

	calculeGeometrique();

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

	// modification des parametres des spheres
	let menuSphereS = gui.addFolder('Sphère S');
	menuSphereS.add(sphere.material, 'transparent').name('transparent').onChange(reAffichage);
	menuSphereS.add(sphere.material, 'opacity', 0, 1).step(0.1).name('opacité').onChange(reAffichage);
	menuSphereS.add(rayon, 'radius', 1, 10).step(1).name('rayon').onChange(reAffichage);

	let menuSphereS0 = gui.addFolder('Sphère S0');
	menuSphereS0.add(smallSphere.material, 'transparent').name('transparent').onChange(reAffichage);
	menuSphereS0.add(smallSphere.material, 'opacity', 0, 1).step(0.1).name('opacité').onChange(reAffichage);
	menuSphereS0.add(smallRayon, 'radius', 1, 10).step(1).name('rayon').onChange(reAffichage);

    // modification des coordonnees des points de controle de la courbe de Bézier
    let menuCourbeBezier = gui.addFolder('Courbe de Bézier');
    menuCourbeBezier.add(p0, 'x', -50, 50).step(1).name('x0').onChange(reAffichage);
    menuCourbeBezier.add(p0, 'y', -50, 50).step(1).name('y0').onChange(reAffichage);
    menuCourbeBezier.add(p1, 'x', -50, 50).step(1).name('x1').onChange(reAffichage);
    menuCourbeBezier.add(p1, 'y', -50, 50).step(1).name('y1').onChange(reAffichage);
    menuCourbeBezier.add(p2, 'x', -50, 50).step(1).name('x2').onChange(reAffichage);
    menuCourbeBezier.add(p2, 'y', -50, 50).step(1).name('y2').onChange(reAffichage);

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

		calculeGeometrique();
		console.log(scene)

		// render avec requestAnimationFrame
		rendu.render(scene, camera);
	}// fin fonction reAffichage()
	
	function renduAnim() {
		stats.update();
		// render avec requestAnimationFrame
		requestAnimationFrame(renduAnim);

		// Définition du temps
		let t = ((Date.now() / 100) % 100) / 100;
		
		// Créer un raycaster
		var raycaster = new THREE.Raycaster();

		// Définir le point de départ et la direction du rayon
		var origin = courbeBezier.getPoint(t);
		var direction = new THREE.Vector3().subVectors(poleNord, courbeBezier.getPoint(t));
		direction.normalize();

		// Mettre à jour le raycaster avec la position et la direction
		raycaster.set(origin, direction);

		// Trouver les points d'intersection entre le rayon et la sphère
		var intersects = raycaster.intersectObject(sphere);

		// Déinition de la position de la sphère S0
		smallSphere.position.set(intersects[0].point.x, intersects[0].point.y, intersects[0].point.z);

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
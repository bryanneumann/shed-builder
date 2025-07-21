import * as THREE from 'three';

export interface ShedGeometry {
  length: number;
  width: number;
  height: number;
  wallHeight: number;
  roofType: 'gable' | 'gambrel' | 'lean-to';
}

export function createShedGeometry(config: ShedGeometry): THREE.Group {
  const shedGroup = new THREE.Group();
  
  // Materials
  const wallMaterial = new THREE.MeshLambertMaterial({ color: 0xDEB887 }); // Burlywood
  const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 }); // Saddle brown
  const frameMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 }); // Dark brown
  const foundationMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 }); // Gray
  
  // Foundation slab
  const foundationGeometry = new THREE.BoxGeometry(config.length, 0.33, config.width);
  const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
  foundation.position.y = -0.165; // Half thickness below ground
  shedGroup.add(foundation);
  
  // Floor frame (visible joists)
  const joistSpacing = 1.33; // 16" on center in feet
  const joistCount = Math.floor(config.width / joistSpacing) + 1;
  
  for (let i = 0; i < joistCount; i++) {
    const joistGeometry = new THREE.BoxGeometry(config.length, 0.625, 0.125); // 2x8 joist
    const joist = new THREE.Mesh(joistGeometry, frameMaterial);
    joist.position.y = 0.3125; // On top of foundation
    joist.position.z = (i * joistSpacing) - (config.width / 2) + (joistSpacing / 2);
    shedGroup.add(joist);
  }
  
  // Rim joists
  const rimJoistGeometry = new THREE.BoxGeometry(config.length, 0.625, 0.125);
  const frontRimJoist = new THREE.Mesh(rimJoistGeometry, frameMaterial);
  frontRimJoist.position.y = 0.3125;
  frontRimJoist.position.z = config.width / 2;
  shedGroup.add(frontRimJoist);
  
  const backRimJoist = new THREE.Mesh(rimJoistGeometry, frameMaterial);
  backRimJoist.position.y = 0.3125;
  backRimJoist.position.z = -config.width / 2;
  shedGroup.add(backRimJoist);
  
  // Side rim joists
  const sideRimJoistGeometry = new THREE.BoxGeometry(0.125, 0.625, config.width);
  const leftRimJoist = new THREE.Mesh(sideRimJoistGeometry, frameMaterial);
  leftRimJoist.position.y = 0.3125;
  leftRimJoist.position.x = -config.length / 2;
  shedGroup.add(leftRimJoist);
  
  const rightRimJoist = new THREE.Mesh(sideRimJoistGeometry, frameMaterial);
  rightRimJoist.position.y = 0.3125;
  rightRimJoist.position.x = config.length / 2;
  shedGroup.add(rightRimJoist);
  
  // Floor sheathing
  const floorGeometry = new THREE.BoxGeometry(config.length, 0.05, config.width);
  const floor = new THREE.Mesh(floorGeometry, wallMaterial);
  floor.position.y = 0.65; // On top of joists
  shedGroup.add(floor);
  
  // Wall frames
  createWallFraming(shedGroup, config, frameMaterial);
  
  // Walls (sheathing)
  createWalls(shedGroup, config, wallMaterial);
  
  // Roof
  createRoof(shedGroup, config, roofMaterial, frameMaterial);
  
  return shedGroup;
}

function createWallFraming(group: THREE.Group, config: ShedGeometry, material: THREE.Material) {
  const studSpacing = 1.33; // 16" on center
  const studHeight = config.wallHeight;
  
  // Front wall studs
  const frontStudCount = Math.floor(config.length / studSpacing) + 1;
  for (let i = 0; i < frontStudCount; i++) {
    const studGeometry = new THREE.BoxGeometry(0.292, studHeight, 0.125); // 2x4 stud
    const stud = new THREE.Mesh(studGeometry, material);
    stud.position.x = (i * studSpacing) - (config.length / 2) + (studSpacing / 2);
    stud.position.y = 0.65 + (studHeight / 2);
    stud.position.z = config.width / 2;
    group.add(stud);
  }
  
  // Back wall studs
  for (let i = 0; i < frontStudCount; i++) {
    const studGeometry = new THREE.BoxGeometry(0.292, studHeight, 0.125);
    const stud = new THREE.Mesh(studGeometry, material);
    stud.position.x = (i * studSpacing) - (config.length / 2) + (studSpacing / 2);
    stud.position.y = 0.65 + (studHeight / 2);
    stud.position.z = -config.width / 2;
    group.add(stud);
  }
  
  // Side wall studs
  const sideStudCount = Math.floor(config.width / studSpacing) + 1;
  for (let i = 0; i < sideStudCount; i++) {
    // Left wall
    const studGeometry = new THREE.BoxGeometry(0.125, studHeight, 0.292);
    const leftStud = new THREE.Mesh(studGeometry, material);
    leftStud.position.x = -config.length / 2;
    leftStud.position.y = 0.65 + (studHeight / 2);
    leftStud.position.z = (i * studSpacing) - (config.width / 2) + (studSpacing / 2);
    group.add(leftStud);
    
    // Right wall
    const rightStud = new THREE.Mesh(studGeometry, material);
    rightStud.position.x = config.length / 2;
    rightStud.position.y = 0.65 + (studHeight / 2);
    rightStud.position.z = (i * studSpacing) - (config.width / 2) + (studSpacing / 2);
    group.add(rightStud);
  }
  
  // Top plates
  const topPlateGeometry = new THREE.BoxGeometry(config.length, 0.292, 0.125);
  const frontTopPlate = new THREE.Mesh(topPlateGeometry, material);
  frontTopPlate.position.y = 0.65 + studHeight + 0.146;
  frontTopPlate.position.z = config.width / 2;
  group.add(frontTopPlate);
  
  const backTopPlate = new THREE.Mesh(topPlateGeometry, material);
  backTopPlate.position.y = 0.65 + studHeight + 0.146;
  backTopPlate.position.z = -config.width / 2;
  group.add(backTopPlate);
  
  // Side top plates
  const sideTopPlateGeometry = new THREE.BoxGeometry(0.125, 0.292, config.width);
  const leftTopPlate = new THREE.Mesh(sideTopPlateGeometry, material);
  leftTopPlate.position.x = -config.length / 2;
  leftTopPlate.position.y = 0.65 + studHeight + 0.146;
  group.add(leftTopPlate);
  
  const rightTopPlate = new THREE.Mesh(sideTopPlateGeometry, material);
  rightTopPlate.position.x = config.length / 2;
  rightTopPlate.position.y = 0.65 + studHeight + 0.146;
  group.add(rightTopPlate);
}

function createWalls(group: THREE.Group, config: ShedGeometry, material: THREE.Material) {
  const wallThickness = 0.05; // Sheathing thickness
  const wallHeight = config.wallHeight;
  
  // Front wall
  const frontWallGeometry = new THREE.BoxGeometry(config.length, wallHeight, wallThickness);
  const frontWall = new THREE.Mesh(frontWallGeometry, material);
  frontWall.position.y = 0.65 + (wallHeight / 2);
  frontWall.position.z = config.width / 2;
  group.add(frontWall);
  
  // Back wall
  const backWall = new THREE.Mesh(frontWallGeometry, material);
  backWall.position.y = 0.65 + (wallHeight / 2);
  backWall.position.z = -config.width / 2;
  group.add(backWall);
  
  // Side walls
  const sideWallGeometry = new THREE.BoxGeometry(wallThickness, wallHeight, config.width);
  const leftWall = new THREE.Mesh(sideWallGeometry, material);
  leftWall.position.x = -config.length / 2;
  leftWall.position.y = 0.65 + (wallHeight / 2);
  group.add(leftWall);
  
  const rightWall = new THREE.Mesh(sideWallGeometry, material);
  rightWall.position.x = config.length / 2;
  rightWall.position.y = 0.65 + (wallHeight / 2);
  group.add(rightWall);
}

function createRoof(group: THREE.Group, config: ShedGeometry, roofMaterial: THREE.Material, frameMaterial: THREE.Material) {
  const wallTop = 0.65 + config.wallHeight + 0.292;
  const roofPeak = wallTop + (config.width * 0.25); // 6/12 pitch
  
  if (config.roofType === 'gable') {
    // Rafters
    const rafterSpacing = 2; // 24" on center
    const rafterCount = Math.floor(config.length / rafterSpacing) + 1;
    
    for (let i = 0; i < rafterCount; i++) {
      const rafterLength = Math.sqrt(Math.pow(config.width / 2, 2) + Math.pow(roofPeak - wallTop, 2));
      const rafterAngle = Math.atan2(roofPeak - wallTop, config.width / 2);
      
      // Left rafter
      const leftRafterGeometry = new THREE.BoxGeometry(0.125, 0.458, rafterLength); // 2x6 rafter
      const leftRafter = new THREE.Mesh(leftRafterGeometry, frameMaterial);
      leftRafter.position.x = (i * rafterSpacing) - (config.length / 2) + (rafterSpacing / 2);
      leftRafter.position.y = wallTop + (rafterLength * Math.sin(rafterAngle) / 2);
      leftRafter.position.z = -(rafterLength * Math.cos(rafterAngle) / 2) / 2;
      leftRafter.rotation.x = -rafterAngle;
      group.add(leftRafter);
      
      // Right rafter
      const rightRafter = new THREE.Mesh(leftRafterGeometry, frameMaterial);
      rightRafter.position.x = (i * rafterSpacing) - (config.length / 2) + (rafterSpacing / 2);
      rightRafter.position.y = wallTop + (rafterLength * Math.sin(rafterAngle) / 2);
      rightRafter.position.z = (rafterLength * Math.cos(rafterAngle) / 2) / 2;
      rightRafter.rotation.x = rafterAngle;
      group.add(rightRafter);
    }
    
    // Ridge beam
    const ridgeGeometry = new THREE.BoxGeometry(config.length, 0.458, 0.125);
    const ridge = new THREE.Mesh(ridgeGeometry, frameMaterial);
    ridge.position.y = roofPeak;
    group.add(ridge);
    
    // Roof sheathing
    const roofLength = Math.sqrt(Math.pow(config.width / 2, 2) + Math.pow(roofPeak - wallTop, 2));
    const roofAngle = Math.atan2(roofPeak - wallTop, config.width / 2);
    
    // Left roof panel
    const leftRoofGeometry = new THREE.BoxGeometry(config.length, 0.05, roofLength);
    const leftRoof = new THREE.Mesh(leftRoofGeometry, roofMaterial);
    leftRoof.position.y = wallTop + (roofLength * Math.sin(roofAngle) / 2);
    leftRoof.position.z = -(roofLength * Math.cos(roofAngle) / 2) / 2;
    leftRoof.rotation.x = -roofAngle;
    group.add(leftRoof);
    
    // Right roof panel
    const rightRoof = new THREE.Mesh(leftRoofGeometry, roofMaterial);
    rightRoof.position.y = wallTop + (roofLength * Math.sin(roofAngle) / 2);
    rightRoof.position.z = (roofLength * Math.cos(roofAngle) / 2) / 2;
    rightRoof.rotation.x = roofAngle;
    group.add(rightRoof);
  }
}

export function setupScene(): { scene: THREE.Scene; camera: THREE.PerspectiveCamera; renderer: THREE.WebGLRenderer } {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf5f5f5);
  
  const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
  camera.position.set(15, 10, 15);
  camera.lookAt(0, 0, 0);
  
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(400, 400);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(20, 20, 0);
  directionalLight.castShadow = true;
  directionalLight.shadow.mapSize.width = 2048;
  directionalLight.shadow.mapSize.height = 2048;
  scene.add(directionalLight);
  
  return { scene, camera, renderer };
}

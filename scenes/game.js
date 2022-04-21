/*##############################################################################
# Game
##############################################################################*/

function updateGame(){
  if(!waveStarted){
    startWave();
  }
  spawnEnemies();
  updateActiveWeapon();
  for(var i = 0; i < enemies.length; i++){
    enemies[i].update();
  }
  drawGameScreen();
}

function drawGameScreen(){
  clearCanvas();
  drawUserInterface();
  for(var i = 0; i < enemies.length; i++){
    enemies[i].draw();
  }
}

function gameMouseDown(evt){
  fireActiveWeapon();
}

function gameMouseUp(evt){
  releaseActiveWeapon();
}

function startWave(){
  waveStarted = true;
  currentWave++;
  enemiesInWave = currentWave * currentWave + 5;
}

function resetGame(){
  waveStarted = false;
  currentWave = 0;
  nextEnemyId = 0;
  enemies = [];
  enemiesDestroyed = 0;
  enemiesInWave = 0;
}

/*##############################################################################
# User Interface
##############################################################################*/

function drawUserInterface(){
  drawReticle();
  drawHealthBar();
  drawAmmoBar();
}

function drawReticle(){
  var mousePos = getMousePosition();
  if(typeof mousePos === 'undefined'){
    return;
  }
  drawCircle(mousePos.x, mousePos.y, reticleSize);
}

function changeReticle(delta){
  reticleSize += delta;
  if(reticleSize < RETICLE_MIN_SIZE){
    reticleSize = RETICLE_MIN_SIZE;
  }
  if(reticleSize > RETICLE_MAX_SIZE){
    reticleSize = RETICLE_MAX_SIZE;
  }
}

function drawHealthBar(){
  var maxWidth = 90;
  drawText("Health", 310, 380);
  // Max Health
  drawBox(310, 380, maxWidth, 20);
  // Current Health
  drawBox(310, 380, maxWidth * (health/healthMax), 20);
}

function drawAmmoBar(){
  drawText(`${activeWeapon}: ${ammo}`, 0, 400);
}

function damagePlayer(damage){
  health -= damage;
  if(health < 1){
    activeScene = END_SCENE;
  }
}

/*##############################################################################
# Enemy Management
##############################################################################*/
const SPAWN_DELAY_MAX = 150, // 5 * 30
SPAWN_DELAY_MIN = 60; // 2 * 30
var currentSpawnDelay = 0,
nextEnemyId = 0,
enemies = [],
enemiesDestroyed = 0,
currentWave = 0,
enemiesInWave = 0,
waveStarted = false;


function spawnEnemies(){
  if(currentSpawnDelay <= 0){
    spawnRandomEnemy();
    currentSpawnDelay = randRange(SPAWN_DELAY_MIN, SPAWN_DELAY_MAX);
    enemiesInWave--;
  }
  else{
    currentSpawnDelay--;
  }
}

function spawnRandomEnemy(){
  var enemy = createEnemySphere();
  enemy.x = randRange(SCREEN_MIN, SCREEN_MAX);
  enemy.y = randRange(SCREEN_MIN, SCREEN_MAX);
  enemies.push(enemy);
}

function getEnemyId(){
  return nextEnemyId++;
}

function destroyEnemy(enemyId){
  var indexOfEnemy = enemies.findIndex(enemy => { return enemy.id === enemyId});
  if(indexOfEnemy != -1){
    enemies.splice(indexOfEnemy, 1);
  }
  if(enemies.length == 0 && enemiesInWave == 0){
    waveStarted = false;
    activeScene = NEXT_SCENE;
  }
}

function applyPinpointDamage(damage){
  var mousePos = getMousePosition();
  for(var i = 0; i < enemies.length; i++){
    if(enemies[i].isHit(mousePos.x, mousePos.y)){
      enemies[i].takeDamage(damage);
    }
  }
}

/*##############################################################################
# Enemy spheres
##############################################################################*/

function _sphereUpdate(){
  if(this.size < this.sizeMax){
    this.size += this.growthRate;
  }
  else{
    playSound(SFX_EXPLOSION);
    damagePlayer(1);
    destroyEnemy(this.id);
  }
}

function _sphereDraw(){
  drawCircle(this.x, this.y, this.size);
}

function _sphereIsHit(x, y){
  var a = this.x - x;
  var b = this.y - y;
  var c = Math.sqrt(a*a, b*b);
  return c <= this.size;
}

function _sphereTakeDamage(damage){
  this.hp -= damage;
  if(this.hp < 1){
    playSound(SFX_EXPLOSION);
    enemiesDestroyed++;
    destroyEnemy(this.id);
  }
  else{
    playSound(SFX_IMPACT);
  }
}

function createEnemySphere(){
  var sphere = {
    id: getEnemyId(),
    x: 0,
    y: 1,
    sizeMax: 50,
    size: 10,
    growthRate: 0.1,
    hp: 1
  };
  sphere.update = _sphereUpdate;
  sphere.isHit = _sphereIsHit;
  sphere.takeDamage = _sphereTakeDamage;
  sphere.draw = _sphereDraw;
  return sphere;
}

/*##############################################################################
# Shooter
##############################################################################*/
const BLASTER = "blaster",
AUTOBLASTER = "autoblaster";
const RETICLE_MIN_SIZE = 3,
RETICLE_MAX_SIZE = 50;
var health = 3,
healthMax = 3,
ammo = 9999,
activeWeapon = BLASTER,
reticleSize = RETICLE_MIN_SIZE,
activeWeaponFired = false,
activeWeaponReleased = true,
recoilDecay = -0.5;

function fireActiveWeapon(){
  switch(activeWeapon){
    case BLASTER:
    case AUTOBLASTER:
      fireBlaster();
      break;
  }
  activeWeaponFired = true;
  activeWeaponReleased = false;
}

function releaseActiveWeapon(){
  activeWeaponReleased = true;
  activeWeaponFired = false;
}

function decayRecoil(){
  changeReticle(recoilDecay);
}

function updateActiveWeapon(){
  decayRecoil();
  switch(activeWeapon){
    case AUTOBLASTER:
      updateAutoBlaster();
      break;
  }
}

/*##############################################################################
# Blaster
##############################################################################*/
const BLASTER_RECOIL = 10;

function updateBlaster(){}

function fireBlaster(){
  ammo--;
  changeReticle(AUTOBLASTER_RECOIL);
  playSound(SFX_PEW);
  applyPinpointDamage(1);
}

/*##############################################################################
# Auto Blaster
##############################################################################*/
var autoBlasterCycleTime = 10,
autoBlasterDelay = 0;
const AUTOBLASTER_RECOIL = 10;

function updateAutoBlaster(){
  if(!activeWeaponReleased){
    autoBlasterDelay++;
    if(autoBlasterDelay >= autoBlasterCycleTime){
      autoBlasterDelay = 0;
      fireBlaster();
    }
  }
}
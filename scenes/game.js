/*##############################################################################
# Game
##############################################################################*/
var game = {};

game.update = function(){
  if(!this.waveStarted){
    this.startWave();
  }
  this.spawnEnemies();
  this.updateActiveWeapon();
  for(var i = 0; i < this.enemies.length; i++){
    this.enemies[i].update();
  }
  this.drawGameScreen();
}

game.drawGameScreen = function(){
  clearCanvas();
  this.drawUserInterface();
  for(var i = 0; i < this.enemies.length; i++){
    this.enemies[i].draw();
  }
}

game.mouseDown = function(evt){
  this.fireActiveWeapon();
}

game.mouseUp = function(evt){
  this.releaseActiveWeapon();
}

game.startWave = function(){
  this.waveStarted = true;
  this.currentWave++;
  this.enemiesInWave = this.currentWave * this.currentWave + 5;
}

game.reset = function(){
  this.waveStarted = false;
  this.currentWave = 0;
  this.nextEnemyId = 0;
  this.enemies = [];
  this.enemiesDestroyed = 0;
  this.enemiesInWave = 0;
}

/*##############################################################################
# User Interface
##############################################################################*/

game.drawUserInterface = function(){
  this.drawReticle();
  this.drawHealthBar();
  this.drawAmmoBar();
}

game.drawReticle = function(){
  var mousePos = getMousePosition();
  if(typeof mousePos === 'undefined'){
    return;
  }
  drawCircle(mousePos.x, mousePos.y, this.reticleSize);
}

game.changeReticle = function(delta){
  this.reticleSize += delta;
  if(this.reticleSize < this.RETICLE_MIN_SIZE){
    this.reticleSize = this.RETICLE_MIN_SIZE;
  }
  if(this.reticleSize > this.RETICLE_MAX_SIZE){
    this.reticleSize = this.RETICLE_MAX_SIZE;
  }
}

game.drawHealthBar = function(){
  var maxWidth = 90;
  drawText("Health", 310, 380);
  // Max Health
  drawBox(310, 380, maxWidth, 20);
  // Current Health
  drawBox(310, 380, maxWidth * (this.health/this.healthMax), 20);
}

game.drawAmmoBar = function(){
  drawText(`${game.activeWeapon}: ${game.ammo}`, 0, 400);
}

game.damagePlayer = function(damage){
  this.health -= damage;
  if(this.health < 1){
    activeScene = END_SCENE;
  }
}

/*##############################################################################
# Enemy Management
##############################################################################*/
game.SPAWN_DELAY_MAX = 150; // 5 * 30
game.SPAWN_DELAY_MIN = 60; // 2 * 30
game.currentSpawnDelay = 0;
game.nextEnemyId = 0;
game.enemies = [];
game.enemiesDestroyed = 0;
game.currentWave = 0;
game.enemiesInWave = 0;
game.waveStarted = false;


game.spawnEnemies = function(){
  if(this.currentSpawnDelay <= 0){
    this.spawnRandomEnemy();
    this.currentSpawnDelay = randRange(this.SPAWN_DELAY_MIN, this.SPAWN_DELAY_MAX);
    this.enemiesInWave--;
  }
  else{
    this.currentSpawnDelay--;
  }
}

game.spawnRandomEnemy = function(){
  var enemy = this.createEnemySphere();
  enemy.x = randRange(SCREEN_MIN, SCREEN_MAX);
  enemy.y = randRange(SCREEN_MIN, SCREEN_MAX);
  this.enemies.push(enemy);
}

game.getEnemyId = function(){
  return this.nextEnemyId++;
}

game.destroyEnemy = function(enemyId){
  var indexOfEnemy = this.enemies.findIndex(enemy => { return enemy.id === enemyId});
  if(indexOfEnemy != -1){
    this.enemies.splice(indexOfEnemy, 1);
  }
  if(this.enemies.length == 0 && this.enemiesInWave == 0){
    this.waveStarted = false;
    activeScene = NEXT_SCENE;
  }
}

game.applyPinpointDamage = function(damage){
  var mousePos = getMousePosition();
  for(var i = 0; i < this.enemies.length; i++){
    if(this.enemies[i].isHit(mousePos.x, mousePos.y)){
      this.enemies[i].takeDamage(damage);
    }
  }
}

/*##############################################################################
# Enemy spheres
##############################################################################*/

game.createEnemySphere = function(){
  var sphere = {
    id: game.getEnemyId(),
    x: 0,
    y: 1,
    sizeMax: 50,
    size: 10,
    growthRate: 0.1,
    hp: 1
  };
  sphere.update = function(){
    if(this.size < this.sizeMax){
      this.size += this.growthRate;
    }
    else{
      playSound(SFX_EXPLOSION);
      game.damagePlayer(1);
      game.destroyEnemy(this.id);
    }
  }
  sphere.isHit = function(x, y){
    var a = this.x - x;
    var b = this.y - y;
    var c = Math.sqrt(a*a, b*b);
    return c <= this.size;
  }
  sphere.takeDamage = function(damage){
    this.hp -= damage;
    if(this.hp < 1){
      playSound(SFX_EXPLOSION);
      game.enemiesDestroyed++;
      game.destroyEnemy(this.id);
    }
    else{
      playSound(SFX_IMPACT);
    }
  }
  sphere.draw = function(){
    drawCircle(this.x, this.y, this.size);
  }
  return sphere;
}

/*##############################################################################
# Shooter
##############################################################################*/
game.BLASTER = "blaster";
game.AUTOBLASTER = "autoblaster";
game.RETICLE_MIN_SIZE = 3;
game.RETICLE_MAX_SIZE = 50;
game.health = 3;
game.healthMax = 3;
game.ammo = 9999;
game.activeWeapon = game.BLASTER;
game.reticleSize = game.RETICLE_MIN_SIZE;
game.activeWeaponFired = false;
game.activeWeaponReleased = true;
game.recoilDecay = -0.5;

game.fireActiveWeapon = function(){
  switch(this.activeWeapon){
    case this.BLASTER:
    case this.AUTOBLASTER:
      this.fireBlaster();
      break;
  }
  this.activeWeaponFired = true;
  this.activeWeaponReleased = false;
}

game.releaseActiveWeapon = function(){
  this.activeWeaponReleased = true;
  this.activeWeaponFired = false;
}

game.decayRecoil = function(){
  this.changeReticle(this.recoilDecay);
}

game.updateActiveWeapon = function(){
  this.decayRecoil();
  switch(this.activeWeapon){
    case this.AUTOBLASTER:
      this.updateAutoBlaster();
      break;
  }
}

/*##############################################################################
# Blaster
##############################################################################*/
game.BLASTER_RECOIL = 10;

game.updateBlaster = function(){}

game.fireBlaster = function(){
  this.ammo--;
  this.changeReticle(this.AUTOBLASTER_RECOIL);
  playSound(SFX_PEW);
  this.applyPinpointDamage(1);
}

/*##############################################################################
# Auto Blaster
##############################################################################*/
game.autoBlasterCycleTime = 10,
game.autoBlasterDelay = 0;
game.AUTOBLASTER_RECOIL = 10;

game.updateAutoBlaster = function(){
  if(!this.activeWeaponReleased){
    this.autoBlasterDelay++;
    if(this.autoBlasterDelay >= this.autoBlasterCycleTime){
      this.autoBlasterDelay = 0;
      this.fireBlaster();
    }
  }
}
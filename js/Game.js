
function Game(){

	this.level;
	this.actors = [];
	this.player = false;


	this.playerRace;
	this.playerClass;
	this.playerSkillPoints = 0;
	this.playerPowerPoints = 0;

	this.playerHealthLastTick = 0; //Used when resting to see if the player took damage

	this.selectedTile = false; //When examining or aiming, whate tile is selected
	//this.tilesBetween = []; //Tiles in between selectedTile and player.tile. Used for aiming info and graphics

	this.depth = 1; //How deep we are in the dungeon
	this.widthInit = 25; //Width of level 1. The levels will get bigger as we go
	this.heightInit = 25; //Height of level 1
	this.levelSizeGrowthRathe = 1.15;//How much bigger the width/height of each level is than the one before it.


	this.state = "MAINMENU"; //Options: Default, Aiming, Examining, Options, Menu.character, Menu.equipment, Menu.Powers
							//Opening, Closing, Activating

	this.selectedMenuItem = 0; //If we're in a menu, this is the index of the selectedItem

	this.ticks = 1; //How much time has elapsed since the start of the game

	this.lightingEmphasis = 1; //Default is one. Can be 0, 1, 2. corresponds to how clear the lighting on each tile is. 0 is no lighting shown.

	this.tookDamage = [];//All the units that took damage since the last view set
	this.explodedTiles = []; //The tiles that had an explosion on them
	this.killed = [];
	this.madeNoiseThisTick = []//All the tiles that made noise this tick. After the tick, the tick function will set them to 0 and clear the array.
	this.messageLogged = false;

	this.lastFootstepSoundPlayed = -1; //Index of the last footstep sound to play when taking a step. Used to prevent the same sound from playing twice in a row

	this.inTutorial = false;

	
	this.DEBUG = {
		allTilesVisible: false, //Can see every tile
		blankDungeon: false, //No walls in the dungeon except the outer ones
		enemiesInBlankDungeon: 10, //If the dungeon is blank, this is how many enemies will be in it
		dontShowLighting: false, //If true, all the tiles will have BRIGHT as their lighting
		playerInvincible: false,
		showEnemyVision: false, //WONT WORK RIGHT NOW. COMMENTED OUT CODE. Highlights all the tiles visible by an enemy
		showPathDistance: false, //Only works with one enemy. Shows the number representing the distance from the player for pathfinding
		keepViewCentered: false, //Keeps the view centered on the middle. Good for testing dungeon gen
		allMoveTimes1: false, //Makes the move time of all units equal to 1
		playerMoveTime1: false, //Makes the player move time 1
		playerSilent: false, //The player doesn't make any noise
		playerMoveNoise: false,
		playerVisibility: false, //Visibility always returns whatever is entered here
		setAllViewDistances: false, //Sets the view distance of all units to whatever is in here
		highlightLightSources: false, //Makes tiles witha light source yellow
		attackGraphicsOff: false, //If true, it doesn't activate the attack graphics
		playerViewAngle: false, //If not false, overides the player view angle and returns this number. Set it to a value in degrees
		playerStartingWeapon: false, //If false, the player doesn't start with a weapon. Else, the player starts with the weapon object contained here.
		showKnockBackPath: false, //WONT WORK RIGHT NOW. COMMENTED OUT CODE. If true, when you shoot at a unit with a gun with knockback, it shows the tiles used to calculate the path
		numberOfEnemies: false, //sets the number of enemies that will spawn
		showNoise: false, //Writes the noise value of each tile to the screen
	}
}


Game.prototype.changeState = function(state)
{
	var setView = true;
	if (this.state === 'AIMING')
	{
		this.player.tilesAimedAt = [];
		this.player.actorsAimedAt = [];
		this.player.wallsAimedAt = [];
	}

	if (state === "DEFAULT")
	{
		this.selectedTile = false;
		if (this.state === 'MENU.CHARACTER' || this.state === 'MENU.EQUIPMENT' || this.state === 'MENU.POWERS')
		{
			g.view.closeMenu();
			this.selectedMenuItem = false;
		}
		else if (this.state === "AIMING" || this.state === 'EXAMINING' || this.state === "AIMINGPOWER")
		{
			g.view.setEnemyDivMain();
			this.selectedTile = false;

			if (this.state === 'AIMINGPOWER')
			{
				g.view.unhighlightPower(this.selectedPower);
			}

			this.selectedPower = false;
		}
		else if (this.state === 'OPTIONS')
		{
			g.view.closeOptionsMenu();
			this.selectedMenuItem = false;
		}
		else if (this.state === 'MESSAGE')
		{
			g.view.eraseTutorialMessage();
		}
		this.state = 'DEFAULT';
		g.view.centerOnTile(this.player.tile);
	}
	else if (state === "AIMING")
	{
		g.view.canvases.select.style.opacity = g.view.canvasStyle.selectOpacity;
		
		if (this.selectedTile === false) //If we don't already have a tile selected (because we're coming fromt the exmaining state)
		{
			//select the closest enemy if there is one in view. else just set it to where the player is facing
			var enemy = this.player.getClosestVisibleEnemy();
			if (enemy)
			{
				this.selectedTile = enemy.tile;
			}
			else
			{
				this.selectedTile = this.player.tile.siblings[this.player.direction];
			}
		}
		//this.tilesBetween = this.player.getTilesBetween(this.selectedTile);
		this.player.setAim();
		g.view.centerOnTile(this.selectedTile);
		g.view.setEnemyDivMain();
		this.state = "AIMING";
	}
	else if (state === "AIMINGPOWER")
	{
		g.view.canvases.select.style.opacity = g.view.canvasStyle.selectOpacity;
		if (this.selectedTile === false)
		{
			this.selectedTile = this.player.tile.siblings[this.player.direction];
		}
		this.player.setPowerAim();
		g.view.centerOnTile(this.selectedTile);
		g.view.highlightPower(this.selectedPower);
		this.state = "AIMINGPOWER";
	}
	else if (state === "EXAMINING")
	{
		g.view.canvases.select.style.opacity = 1;
		if (this.selectedTile === false)
		{
			this.selectedTile = this.player.tile;
		}
		if (this.state === 'MESSAGE')
		{
			g.view.eraseTutorialMessage();
		}
		g.view.centerOnTile(this.selectedTile);
		this.state = "EXAMINING";
	}
	else if (state === 'MENU.CHARACTER')
	{
		this.state = 'MENU.CHARACTER';
		this.selectedMenuItem = 'LABEL';
		g.view.closeMenu();
		g.view.openMenu();
	}
	else if (state === 'MENU.EQUIPMENT')
	{
		this.state = 'MENU.EQUIPMENT';
		this.selectedMenuItem = 'LABEL';
		g.view.closeMenu();
		g.view.openMenu();
	}
	else if (state === 'MENU.POWERS')
	{
		this.state = 'MENU.POWERS';
		this.selectedMenuItem = 'LABEL';
		g.view.closeMenu();
		g.view.openMenu();
	}
	else if (state === 'OPTIONS')
	{
		this.state = "OPTIONS";
		this.selectedMenuItem = 0;
		g.view.openOptionsMenu();
		g.view.selectOption();
	}
	else if (state === "GAMEOVER")
	{
		this.state = "GAMEOVER";
		g.view.logAlert("You diiieeeed...");
		g.view.setCharacterMainDiv();
		g.view.set();
		setTimeout(function(){g.initialize(); g.game.changeState('MAINMENU');},  4000);
	}
	else if (state === 'VICTORY')
	{
		this.state = "VICTORY";
		g.view.logAlert("You win!");
	}
	else if (state === 'MAINMENU')
	{
		g.view.clearDOM();
		g.view.initializeMainMenu();
		this.selectedMenuItem = 0;
		g.view.selectMainMenuItem();
		this.state = "MAINMENU";
		setView = false;
	}
	else if (state === 'RACEMENU')
	{
		g.view.clearDOM();
		g.view.initializeRaceMenu();
		this.selectedMenuItem = 0;
		g.view.selectRaceMenuItem();
		this.state = 'RACEMENU';
		setView = false;
	}
	else if (state === 'CLASSMENU')
	{
		g.view.clearDOM();
		g.view.initializeClassMenu();
		this.selectedMenuItem = 0;
		g.view.selectClassMenuItem();
		this.state = 'CLASSMENU';
		setView = false;
	}
	else if (state === 'RESTING')
	{
		this.state = 'RESTING';
	}
	else if (state === 'MESSAGE')
	{
		this.state = 'MESSAGE';
	}
	else
	{
		console.log(state + " isn't a viable option for the game stat, ya doofus.");
	}

	if (setView)
	{
		g.view.set();
	}
}


Game.prototype.movePlayer = function(direction)
{
	var moveIndex = this.directionStringToIndex(direction);
	var timeTaken = this.player.move(moveIndex);
	if (timeTaken !== 0)
	{
		this.tick(timeTaken);
		g.view.setCharacterMainDiv();
	}
}


Game.prototype.turnPlayer = function(direction)
{
	var dIndex = this.directionStringToIndex(direction);
	if (dIndex === this.player.direction){
		return;
	}
	var timeTaken = this.player.turn(dIndex, true);
	this.tick(timeTaken);
	g.view.setCharacterMainDiv();
}


Game.prototype.shiftPlayer = function(direction)
{
	var dIndex = this.directionStringToIndex(direction);
	//If we try to shift in the direction we're facing, do a regular move.
	if (dIndex === this.player.direction)
	{
		this.movePlayer(direction);
	}
	else {
		var succesful = this.player.shift(dIndex);
		if (succesful)
		{
			var timeTaken = this.player.getShiftTime();
			this.tick(timeTaken);
		}
	}
	g.view.setCharacterMainDiv();
}





Game.prototype.playerWait = function()
{
	this.player.wait();
	this.tick(1);
}


//Rest until something happens
//Something happens = an enemy enters field of view, takes damage, health fully charged, energy fully charged
Game.prototype.playerRest = function()
{
	//See if it's safe to rest
	if (this.player.canSeeEnemy())
	{
		g.view.logAlert("There's an eney near you!");
		return;
	}


	//If we're here, it's safe to rest
	this.playerHealthLastTick = this.player.getHealth();
	var playerHealthFull = (this.player.getHealth() === this.player.getMaxHealth());
	var playerEnergyFull = (this.player.getEnergy() === this.player.getMaxEnergy());

	if (playerHealthFull && playerEnergyFull)
	{
		g.view.logAlert("You're already good to go.")
		return;
	}
	

	this.changeState('RESTING');
	var restInterval = 10;

	var restOneTick = function(healthFull, energyFull)
	{

		if (g.game.state !== 'RESTING')
		{
			g.game.changeState('DEFAULT');
			return;
		}
		g.game.playerWait();
		if (g.game.player.getHealth() < g.game.playerHealthLastTick)
		{
			g.game.changeState('DEFAULT');
			return;
		}

		if (healthFull === false && g.game.player.getHealth() === g.game.player.getMaxHealth())
		{
			g.game.changeState('DEFAULT');
			return;
		}

		if (energyFull === false && g.game.player.getEnergy() === g.game.player.getMaxEnergy())
		{
			g.game.changeState('DEFAULT');
			return;
		}

		if (g.game.player.canSeeEnemy())
		{
			g.game.changeState('DEFAULT');
			return;
		}

		g.game.playerHealthLastTick = g.game.player.getHealth();

		setTimeout(function(){restOneTick(healthFull, energyFull);}, restInterval);
	}


	restOneTick(playerHealthFull, playerEnergyFull);

}





Game.prototype.playerUseOrAimPower = function(powerNumber)
{

	var p = g.game.player.powers[powerNumber];
	if (p.atts.powerType === 'PASSIVE')
	{
		g.view.logAlert("That's a passive power.");
		return;
	}
	if (p.unlocked === false)
	{
		g.view.logAlert("You haven't unlocked <span class='powerMessage'>" + p.name + "</span> yet.");
		return;
	}
	if (p.atts.energyConsumption > this.player.get('energy') && p.atts.powerType !== 'SUSTAINED') //If the player doesn't have enough enery, and it's not a sustained power
	{
		g.view.logAlert("You don't have enough energy for <span class='powerMessage'>" + p.name + "</span>");
		return;
	}
	if (p.atts.aimed === false || (this.state === "AIMINGPOWER" && this.selectedPower === powerNumber))//If the power doesn't need to be aimed, or if we're already aiming a power and it's the one corresponding to powerNumber
	{
		this.playerUsePower(powerNumber);
	}
	else if (this.state === "AIMINGPOWER" && this.selectedPower !== powerNumber)//If we're aiming a different power already
	{
		return;
	}
	else{//We know we're not in the aiming power state here, because all the possibilities have been accounted for above
		this.selectedPower = powerNumber;
		this.changeState("AIMINGPOWER");
	}
}


Game.prototype.playerUsePower = function(powerNumber)
{
	var p = g.game.player.powers[powerNumber];
	/*
	if (p.unlocked === false)
	{
		g.view.logAlert("You haven't unlocked <span class='powerMessage'>" + p.name + "</span> yet.");
		return;
	}
	if (p.atts.energyConsumption > this.player.get('energy'))
	{
		g.view.logAlert("You don't have enough energy for <span class='powerMessage'>" + p.name + "</span>");
		return;
	}
	*/
	//If it's an on/off power, activate or deactivate it, which shouldn't take any energy or time
	if (p.atts.powerType === 'SUSTAINED')
	{
		p.activate();
		g.view.setEquipmentMainDiv();
		g.view.setPowersMainDiv();
		return;
	}

	//If it's an activated power
	var timeTaken = p.activate();
	if (timeTaken === "NOTILESELECTED")//If the power didn't work
	{
		g.view.logAlert("Select a tile to use <span class='powerMessage'>" + p.name + "</span> on.");
	}
	else if (timeTaken === false)//If the power can't be used here
	{
		g.view.logAlert("You can't use <span class='powerMessage'>" + p.name + "</span> here.");
	}
	else //Else if it was succesful
	{
		this.changeState('DEFAULT');
		this.player.reduceEnergy(p.atts.energyConsumption);
		this.player.noiseToPropogate = p.atts.noise;
		this.tick(timeTaken);
		g.view.setEquipmentMainDiv();
		g.view.setPowersMainDiv();
	}

}


Game.prototype.playerPickUp = function()
{

	if (this.player.equipment.length >= 20)
	{
		g.view.logAlert("You're inventory is full.")
		return;
	}
	//If there is an item there
	this.player.pickUp();
	this.player.tile.setItem(false);
	g.view.setEquipmentMainDiv();
	g.view.setCharacterMainDiv();
	g.view.set();
}


Game.prototype.playerFire = function()
{
	//If the player can't see selected tile, return
	var target = this.selectedTile;
	/*
	if (this.player.visibleTiles.indexOf(target) === -1)
	{
		g.view.logAlert("You can't see the target");
		return;
	}
	*/

	/*
	//If it's out of range
	if (this.player.tile.getDistance(target) > this.player.get('weaponRange'))
	{
		g.view.logAlert("The target is out of range.");
		return;
	}
	*/

	if (this.player.tilesAimedAt.length === 0)
	{
		g.view.logAlert("You can't shoot in that direction.");
		return;
	}

	//If we're out of ammo
	if (this.player.get('weaponLoadedAmmo') <= 0 && this.player.get('weaponType') === 'GUN')
	{
		g.view.logAlert("You need to reload.");
		return;
	}
	//else we can see the target
	this.player.attack(target);
	
	if (g.rand.next(0, 100) < this.player.getWeaponFreeShotChance())
	{
		this.tick(0);
	}
	else
	{
		this.tick(this.player.get('weaponAttackTime'));
	}

	
	
	//Activate sound
	//this.player.equipedWeapon.shootSound.load();
	//If the weapons has a clip
	if (this.player.get('weaponClipSize'))
	{
		g.view.updateClip();
	}
	g.view.setEnemyDivMain();
}



Game.prototype.playerReload = function()
{
	var weapon = this.player.equipedWeapon;
	if (this.player.get('weaponType') !== 'GUN')
	{
		g.view.logAlert("You can't reload that weapon.");
		return;
	}
	if (this.player.get('weaponLoadedAmmo') === this.player.get('weaponClipSize'))
	{
		g.view.logAlert('Your gun is fully loaded.');
		return;
	}
	//Else, reload
	this.player.equipedWeapon.reload();
	this.tick(this.player.get('weaponReloadTime'));
	g.view.updateClip();
	g.view.setEnemyDivMain();
}


//For aiming. Moves the aim
Game.prototype.moveAim = function(direction)
{
	var moveIndex = this.directionStringToIndex(direction);
	var newTile = this.selectedTile.siblings[moveIndex];
	if (newTile === false)
	{
		return;
	}
	
	//If we try to aim at ourselves
	if (newTile === this.player.tile)
	{
		g.view.logAlert("You have too much to live for.")
		return;
	}

	/*
	if (this.player.visibleTiles.indexOf(newTile) === -1)//If the tiles is out of our view
	{
		g.view.logAlert("You can't see that tile.");
		return;
	}
	*/
	
	this.selectedTile = newTile;
	//this.tilesBetween = this.player.getTilesBetween(this.selectedTile);
	if (this.state === 'AIMING')
	{
		this.player.setAim();
	}
	else if (this.state === 'AIMINGPOWER')
	{
		this.player.setPowerAim();
	}
	g.view.centerOnTile(this.selectedTile);
	g.view.set();
	g.view.setEnemyDivMain();
}


//For examining. Examines a different tile
Game.prototype.moveFocus = function(direction)
{
	var moveIndex = this.directionStringToIndex(direction);
	var newTile = this.selectedTile.siblings[moveIndex];
	if (newTile === false)
	{
		return;
	}
	this.selectedTile = newTile;
	g.view.centerOnTile(this.selectedTile);
	g.view.setEnemyDivMain();
	g.view.set();
}



Game.prototype.openManual = function()
{
	var win = window.open('manual.html', '_blank');
  	win.focus();
}


//Moves the selected options menu option up or down
//Only for the menu that lets you quit, restart, etc.
Game.prototype.moveOption = function(direction)
{
	
	this.selectedMenuItem = this.selectedMenuItem === 0 ? 1 : 0;
	g.view.selectOption();
}

Game.prototype.selectMenuOption = function()
{
	var s = this.selectedMenuItem;
	if (s === 0)
	{
		this.changeState('DEFAULT');
	}
	else if (s === 1)
	{
		g.view.closeOptionsMenu();
		this.player.die();
		g.view.set();
		this.changeState('GAMEOVER');
	}
}


//Changes meny selection from equipment, powers, character, etc.
Game.prototype.changeSelectedMenu = function(direction)
{
	if (direction === 'RIGHT'){
		if (this.state === 'MENU.CHARACTER')
		{
			this.changeState('MENU.EQUIPMENT');
		}
		else if (this.state === 'MENU.EQUIPMENT')
		{
			this.changeState('MENU.POWERS');
		}
		else if (this.state === 'MENU.POWERS')
		{
			this.changeState('MENU.CHARACTER');
		}
	}
	else if (direction === 'LEFT')
	{
		if (this.state === 'MENU.CHARACTER')
		{
			this.changeState('MENU.POWERS');
		}
		else if (this.state === 'MENU.EQUIPMENT')
		{
			this.changeState('MENU.CHARACTER');
		}
		else if (this.state === 'MENU.POWERS')
		{
			this.changeState('MENU.EQUIPMENT');
		}
	}
}



Game.prototype.upgradeAttribute = function()
{
	if (this.selectedMenuItem === 'LABEL')
	{
		return;
	}
	if (this.playerSkillPoints === 0)
	{
		return;
	}

	//If we don't have an upgradable attribute selected
	if (this.selectedMenuItem > 3)
	{
		return;
	}

	var att;
	switch (this.selectedMenuItem)
	{
		case 0:
			att = "strength";
			break;
		case 1:
			att = "dexterity";
			break;
		case 2:
			att = "intelligence";
			break;
		case 3:
			att = "perception";
			break;
	}

	g.game.player[att]++;
	this.playerSkillPoints--;
	g.view.setSkillPoints();
	g.view.closeMenu();
	g.view.openMenu();
	g.view.selectAttributeInMenu();
	g.view.setEquipmentMainDiv();
	g.view.setCharacterMainDiv();
}



//Upgrade the selected power if we have power points
Game.prototype.upgradePower = function()
{
	if (this.selectedMenuItem === 'LABEL')//If the label is selected, return
	{
		return;
	}

	if (this.playerPowerPoints === 0) //If the player doesn't have power points
	{
		return;
	}
	//Else, upgrade the power.
	var power = this.player.powers[this.selectedMenuItem];

	if (power.upgradesActivated === power.atts.maxUpgrades) //If there's no more upgrades to get for the selected power. 
	{
		return;
	}

	
	power.upgrade();


	this.playerPowerPoints--;
	g.view.setPowerPoints();
	g.view.selectPowerInMenu();
	g.view.setPowersMainDiv();
	g.view.setCharacterMainDiv();
	g.view.setEquipmentMainDiv();
}




Game.prototype.changeClassMenuSelection = function(direction)
{	
	
	if (direction === 'DOWN')
	{
		if (this.selectedMenuItem === 2)
		{
			this.selectedMenuItem = 0;
		}
		else
		{
			this.selectedMenuItem++;
		}
	}
	else//If direction is up
	{
		if (this.selectedMenuItem === 0)
		{
			this.selectedMenuItem = 2;
		}
		else
		{
			this.selectedMenuItem--;
		}
	}

	g.view.selectClassMenuItem();
	
}


Game.prototype.selectClassMenuSelection = function()
{
	var i = 0;
	for (var className in g.playerClasses)
	{
		if (i === this.selectedMenuItem)
		{
			this.playerClass = className;
		}
		i++;
	}

	this.initialize();
	g.view.clearDOM();
	g.view.initializeGameView();
	this.changeState("DEFAULT");
}



Game.prototype.selectRaceMenuSelection = function()
{
	var i = 0;
	for (var race in g.playerRaces)
	{
		if (i === this.selectedMenuItem)
		{
			this.playerRace = race;
		}
		i++
	}

	this.changeState('CLASSMENU');
}


Game.prototype.changeRaceMenuSelection = function(direction)
{
	if (direction === 'DOWN')
	{
		if (this.selectedMenuItem === 3)
		{
			this.selectedMenuItem = 0;
		}
		else
		{
			this.selectedMenuItem++;
		}
	}
	else//If direction is down
	{
		if (this.selectedMenuItem === 0)
		{
			this.selectedMenuItem = 3;
		}
		else
		{
			this.selectedMenuItem--;
		}
	}

	g.view.selectRaceMenuItem();
}



Game.prototype.selectMainMenuSelection = function()
{
	if (this.selectedMenuItem === 0) //If we're starting a new game
	{
		this.changeState('RACEMENU');
	}
	else if (this.selectedMenuItem === 1) //If it's the tutorial
	{
		this.inTutorial = true;
		g.view.clearDOM();
		this.selectedMenuItem = false;
		this.initialize();
		g.view.initializeGameView();
		this.changeState('DEFAULT');
	}
}




Game.prototype.changeMainMenuSelection = function(direction)
{
	if (direction === 'DOWN')
	{
		if (this.selectedMenuItem === 1)
		{
			this.selectedMenuItem = 0;
		}
		else
		{
			this.selectedMenuItem++;
		}
	}
	else//If direction is down
	{
		if (this.selectedMenuItem === 0)
		{
			this.selectedMenuItem = 1;
		}
		else
		{
			this.selectedMenuItem--;
		}
	}

	g.view.selectMainMenuItem();
}






Game.prototype.changePowersSelection = function(direction)
{
	if (this.selectedMenuItem === 'LABEL')
	{
		if (direction === 'LEFT')
		{
			this.changeState('MENU.EQUIPMENT');
		}
		else if (direction === 'RIGHT')
		{
			this.changeState('MENU.CHARACTER');
		}
		else if (direction === 'DOWN')
		{
			this.selectedMenuItem = 0;
			g.view.selectPowerInMenu();
			return;//Might not be necessary to return but it can't hurt
		}
		//No case for up
	}
	else
	{
		if (direction === 'UP')
		{
			if (this.selectedMenuItem === 0)
			{
			//Just close and reopen the menu
				this.selectedMenuItem = 'LABEL';
				g.view.closeMenu();
				g.view.openMenu();
			}
			else //We know it doesn't === 'LABEL' because that case was covered above
			{
				this.selectedMenuItem--;
				g.view.selectPowerInMenu();
			}
		}
		else if (direction === 'DOWN')
		{
			if (this.selectedMenuItem !== this.player.powers.length - 1)
			{
				this.selectedMenuItem++;
				g.view.selectPowerInMenu();
			}
		}
	}
}





Game.prototype.changeAttributeSelection = function(direction)
{
	if (this.selectedMenuItem === 'LABEL')
	{
		if (direction === 'LEFT')
		{
			this.changeState('MENU.POWERS');
		}
		else if (direction === 'RIGHT')
		{
			this.changeState('MENU.EQUIPMENT');
		}
		else if (direction === 'DOWN')
		{
			this.selectedMenuItem = 0;
			g.view.selectAttributeInMenu();
			return; //Might not be necessary to return but it can't hurt
		}
		//No case for up
	}
	else
	{
		if (direction === 'UP')
		{
			if (this.selectedMenuItem === 0)
			{
			//Just close and reopen the menu
				this.selectedMenuItem = 'LABEL';
				g.view.closeMenu();
				g.view.openMenu();
			}
			else //We know it doesn't === 'LABEL' because that case was covered above
			{
				this.selectedMenuItem--;
				g.view.selectAttributeInMenu();
			}
		}
		else if (direction === 'DOWN')
		{
			if (this.selectedMenuItem !== 15)
			{
				this.selectedMenuItem++;
				g.view.selectAttributeInMenu();
			}
		}
	}
}




//Move equipment selection
Game.prototype.changeEquipmentSelection = function(direction)
{
	//We know the state is MENU.EQUIPMENT

	//If the label is selected, and the direction is left or right, change the menu and state
	if (this.selectedMenuItem === 'LABEL')
	{
		if (direction === 'LEFT')
		{
			this.changeState('MENU.CHARACTER');
		}
		else if (direction === 'RIGHT')
		{
			this.changeState('MENU.POWERS');
		}
		else if (direction === 'DOWN')
		{
			if (this.player.equipment.length > 0){
				this.selectedMenuItem = 0;
				g.view.selectEquipmentItem();
			}
			return;//Might not be necessary to return but it can't hurt
		}
		//No case for up
	}
	//Else selected menu item corresponds to an equipment selection
	else {
		if (direction === 'UP'){
			//If selected item is 0, select the label
			if (this.selectedMenuItem === 0 || this.selectedMenuItem === 10)
			{
				//Just close and reopen the menu
				this.selectedMenuItem = 'LABEL';
				g.view.closeMenu();
				g.view.openMenu();
			}
			else
			{
				this.selectedMenuItem--;
				g.view.selectEquipmentItem();
			}
		}
		else if (direction === 'DOWN')
		{
			//If we have the last item selected already, or it equals 9 which means we're at the end of the first column, do nothing
			if (this.selectedMenuItem === this.player.equipment.length - 1 || this.selectedMenuItem === 9)
			{
				return;
			}
			else {
				this.selectedMenuItem++;
				g.view.selectEquipmentItem();
			}
		}
		else if (direction === 'RIGHT')
		{
			//If we're already in the second column, return
			if (this.selctedMenuItem >= 10)
			{
				return;
			}
			else {
				var newSelection = this.selectedMenuItem + 10;
				//If new selection is >= the amount of equipment, we know the corresponding column doesn't exist
				if (newSelection >= this.player.equipment.length)
				{
					return;
				}
				this.selectedMenuItem = newSelection;
				g.view.selectEquipmentItem();
			}
		}
		else if (direction === 'LEFT')
		{
			//If we're already in the left column
			if (this.selectedMenuItem < 10)
			{
				return;
			}
			else {
				//Don't have to vaidate this time. If we're in the right column, there's a corresponding item in the left column fo sho
				this.selectedMenuItem -= 10;
				g.view.selectEquipmentItem();
			}
		}
	}
}


Game.prototype.equipOrUnequipSelectedItem = function()
{
	if (this.selectedMenuItem === 'LABEL')
	{
		return;
	}
	this.player.equipOrUnequipItem(this.selectedMenuItem);
	g.view.closeMenu();
	g.view.openMenu();
	g.view.selectEquipmentItem();
	//Reset health and energy in case our max energy is now lower than our current energy
	this.player.resetHealthAndEnergy();
	g.view.setCharacterMainDiv();//Because max health and max energy can change
	g.view.setEquipmentMainDiv();
}


Game.prototype.destroySelectedItem = function()
{
	var index = this.selectedMenuItem;
	var item = this.player.equipment[index];
	this.player.equipment.splice(index, 1);
	delete item;
	g.view.closeMenu();
	g.view.openMenu();
	if (index >= this.player.equipment.length) //If the currently selected item is now out of range
	{
		if (index === 0)
		{
			this.selectedMenuItem = 'LABEL';
		}
		else
		{
			this.selectedMenuItem = index - 1;
		}
	}
	g.view.selectEquipmentItem();
}




Game.prototype.playerCollectOrb = function()
{
	var orbTile = this.player.tile;
	this.playerSkillPoints += 2;
	this.playerPowerPoints++;
	g.view.setSkillPoints();
	g.view.setPowerPoints();
	orbTile.setTerrain("OPEN");
	g.view.setOrb(true);
}


Game.prototype.changePlayerStance = function()
{
	if (this.player.stance === "WALKING")
	{
		this.player.stance = "RUNNING";
	}
	else if (this.player.stance === "RUNNING")
	{
		this.player.stance = "SNEAKING";
	}
	else if (this.player.stance === "SNEAKING")
	{
		this.player.stance = "WALKING";
	}
	g.view.setCharacterMainDiv();
}



//Moves the unit to the given tile. Doesn't take any time
//Used for knocking back and shit
Game.prototype.transportUnit = function(unit, tile)
{
	unit.tile.setUnit(false);
	tile.setUnit(unit);
	unit.tile = tile;

	//If it's a lava tile, kill the unit HAHAHA
	if (tile.terrain === 'LAVA')
	{
		unit.die();
		return;
	}

	unit.setVisibleTiles();


	if (unit.enemyType === 'LUMENDROID')
	{
		unit.setSurroundingLighting();
	}
}


Game.prototype.turnUnitInstant = function(unit, directionIndex)
{
	unit.direction = directionIndex;
	unit.setVisibleTiles();
	g.view.set();//IMPROVE: Could make this more efficient. Only need to set if we can see enemy line of sight or if we're in direction mode, but fuck it
}



//Sees if 'tile' being a pit changes anything
Game.prototype.reevaluateTerrain = function(tile)
{
	if (tile.elevation !== 0) return;

	var changed = false;
	for (var i in tile.siblings)
	{
		var sib = tile.siblings[i];
		if (sib.terrain === 'LAVA') 
		{
			changed = true;
			break;
		}
	}

	if (changed === false) return;

	var pits = this.level.floodFillPitsFromTile(tile);

	for (var i in pits)
	{
		pits[i].setTerrain('LAVA');
	}
}




Game.prototype.displayTutorialMessage = function(message)
{
	this.changeState("MESSAGE");
	g.view.displayTutorialMessage(message);
}



Game.prototype.getInfo = function()
{
	this.changeState("MESSAGE");
	var t = this.selectedTile;
	if (t.unit === false)
	{
		return;
	}
	if (t.unit === this.player)
	{
		return;
	}

	var message = "<h2>" + t.unit.name + "</h4>" + g.ENEMYDESCRIPTIONS[t.unit.enemyType];
	g.view.displayTutorialMessage(message);
}



Game.prototype.changeLightingEmphasis = function()
{
	if (this.lightingEmphasis === 2)
	{
		this.lightingEmphasis = 0;
	}
	else
	{
		this.lightingEmphasis++;
	}
	g.view.setLightingEmphasis();
}




Game.prototype.toggleShowDirections = function()
{
	g.view.showDirections = !g.view.showDirections;
	g.view.set();
}


Game.prototype.toggleShowStealthRadius = function()
{
	g.view.showStealthRadius = !g.view.showStealthRadius;
	g.view.set();
}



Game.prototype.tick = function(ticks)
{


	//"use strict";
	//Logg a message to represent the beginning of the ticks
	if (this.messageLogged)
	{
		g.view.logMessage("<hr/>");
	}

	var playerDied = false;

	for (var i = 0 ; i < ticks ; i++)
	{

		//Set all noise on tiles to 0
		var tiles = this.madeNoiseThisTick;
		g.endIndex = tiles.length;
		for (var j = 0 ; j < g.endIndex ; j++)
		{
			tiles[j].noise = 0;
			tiles[j].propogated = false;
		}
		
		var currActor;
		for (var a = 0 ; a < this.actors.length ; a++)
		{
			currActor = this.actors[a];
			currActor.elapseTime();
		}

		//remove all the dead actors (take out the trash)
		g.endIndex = this.killed.length;
		for (var j = g.endIndex - 1 ; j >= 0 ; j--)
		{
			if (this.killed[j] === this.player)//If the player died
			{
				playerDied = true;
				this.changeState('GAMEOVER');
				return;
			}
			this.removeUnitFromGame(this.killed[j]);
		}
		this.killed = [];

		
		
	}
	this.ticks += ticks;
	//If it's the aiming state, reset the tiles aimed at for the player so if units moved around the graphics will update
	if (this.state === "AIMING")
	{
		this.player.setAim();//Possibly could just be setUnitsAimedAt but whatevs
	}

	g.view.setCharacterMainDiv();
	g.view.setEquipmentMainDiv();
	g.view.set();
	this.messageLogged = false;
	//this.tookDamage = []; //This array gets cleared in the attack graphics method so it doesn't clear too early
	if (Math.round(this.player.get('health')) <= 0)
	{
		playerDied = true;
	}
	if (playerDied)
	{
		this.changeState('GAMEOVER');
	}

}





//Makes unit1 attempt to attack unit 2
Game.prototype.processAttack = function(attacker, targetTile)
{

	
	if (targetTile.unit)
	{
		var target = targetTile.unit;
		var acc = attacker.getWeaponAccuracy();
		var dodgeChance = target.getDodgeChance();
		var dam;
		var kB; //Knock back
		var message;
		if (g.rand.next(0, 100) > acc) //If it's a miss
		{
			if (attacker === this.player)
			{
				message = "You missed the " + target.enemyText + "'s attack.";
			}
			else if (target === this.player)
			{
				message = "The " + attacker.enemyText + " missed you!";
			}
			return;
		}

		if (g.rand.next(0, 100) < dodgeChance) //If the target dodges
		{
			if (attacker === this.player)
			{
				message = "The " + target.enemyText + " dodged your attack.";
			}
			else if (target === this.player)
			{
				message = "You dodged the " + attacker.enemyText + "'s attack!";
			}
			return;
		}
		//If it's a hit
		var dam = attacker.getWeaponDamage();

		//If the enemy is sleeping or wandering, double damage
		if (target.behavior === 'SLEEPING' || target.behavior === 'WANDERING')
		{
			dam *= 2;
		}

		//Do the flanking bonus
		var rightSib = targetTile.siblings[target.getTileIndexRight()];
		var leftSib = targetTile.siblings[target.getTileIndexLeft()];
		var backSib = targetTile.siblings[target.getTileIndexBack()];
		var frontSib = targetTile.siblings[target.direction];

		//See which sib the unit is closest to
		var distances = [
			attacker.tile.getDistance(frontSib),
			attacker.tile.getDistance(leftSib),
			attacker.tile.getDistance(rightSib),
			attacker.tile.getDistance(backSib)
		];

		var minDistance = Math.min(distances);
		var minIndex = distances.indexOf(minDistance);

		//If it's the front, don't do anything
		if (minIndex === 1 || minIndex === 2)
		{
			dam *= attacker.flankingBonuses.side;
		}
		else if (minIndex === 3)
		{
			dam *= attacker.flankingBonuses.back;
		}


		target.reduceHealth(dam);

		if (target.dead)
		{

			if (attacker === this.player)
			{
				message = "You killed the " + target.enemyText + "!";
			}
			else if (target === this.player)
			{
				message = "You died!";

				this.changeState('GAMEOVER');
			}
		}
		else
		{

			if (attacker === this.player)
			{
				message = "You damaged the " + target.enemyText + ".";
			}
			else if (target === this.player)
			{
				message = "The " + attacker.enemyText + " damaged you.";

			}

		}

		kB = attacker.getWeaponKnockBack();

		if (kB > 0 && target.dead === false)
		{
			for (var kBNum = 0 ; kBNum < kB ; kBNum++)
			{
				var succesful = attacker.knockBackUnit(target);
				if (succesful === false)
				{
					break;
				}
			}
		}

		g.view.logMessage(message);
	}
	else
	{
		if (targetTile.terrain === 'WALL')
		{
			var dam = attacker.getWeaponDamage();
			if (g.rand.next(0, 50) < dam)
			{
				targetTile.setTerrain('OPEN');
			}
		}
		else if (targetTile.terrain === 'OPEN' && targetTile.elevation === 1)
		{
			var dam = attacker.getWeaponDamage();
			if (g.rand.next(0, 50) < dam)
			{
				targetTile.setElevation(0);
				this.reevaluateTerrain(targetTile);
			}
		}

	}

}



Game.prototype.spawnUnit = function(unit, tile, state)
{
	unit.initialize(tile, state);
	if (unit === this.player)
	{
		this.actors.unshift(unit);
	}
	else
	{
		this.actors.push(unit);
	}
	
}

Game.prototype.killUnit = function(unit)
{
	unit.dead = true;
	this.killed.push(unit);
	if (unit === this.player)
	{
		this.changeState('GAMEOVER');
	}
}


Game.prototype.removeUnitFromGame = function(unit)
{
	//Tick is set up to simply go to the next unit in the array, not the next index, so we don't have to worry about removing things from the array
	var index = this.actors.indexOf(unit);
	this.actors.splice(index, 1);
	delete unit;
}


//Converst 'LEFT', 'RIGHT', etc. to 3, 1, etc.
Game.prototype.directionStringToIndex = function(direction)
{
	var moveIndex;
	if (direction === "UP")
	{
		moveIndex = 0;
	}
	else if (direction === "RIGHT")
	{
		moveIndex = 1;
	}
	else if (direction === "DOWN")
	{
		moveIndex = 2;
	}
	else if (direction === "LEFT")
	{
		moveIndex = 3;
	}

	return moveIndex;
}



Game.prototype.playerDescend = function()
{
	if (this.depth === g.NUMBEROFLEVELS)
	{
		this.changeState("VICTORY")
	}
	else
	{
		this.depth++;
		if (this.inTutorial)
		{
			this.generateNewTutorialLevel();
		}
		else
		{
			this.generateNewLevel();
		}
		this.transportUnit(this.player, this.level.spawnTile);
	}
	
}


Game.prototype.generateNewTutorialLevel = function()
{
	this.player.overrides.moveNoise = 0;
	this.inTutorial = true;
	this.level = new Level(50, 50, this.depth);
	this.level.initialize(); //Will query the game state and make a tutorial level
	g.view.setDepth();
	g.view.setOrb(false);
}


Game.prototype.generateNewLevel = function()
{
	//Get rid of all the actors except player
	for (var i = this.actors.length - 1 ; i >= 0 ; i--)
	{
		var actor = this.actors[i];
		if (actor === this.player)
		{
			continue;
		}
		this.removeUnitFromGame(actor);
	}
	var width = this.widthInit * Math.pow(this.levelSizeGrowthRathe, this.depth - 1);
	var height = this.heightInit * Math.pow(this.levelSizeGrowthRathe, this.depth - 1);
	width = Math.round(width);
	height = Math.round(height);
	if (width > 70)
	{
		width = 70;
	}
	if (height > 70)
	{
		height = 70;
	}
	this.level = new Level(width, height, this.depth);
	this.level.initialize();

	g.view.setDepth();
	g.view.setOrb(false);
}


Game.prototype.getRandomGun = function()
{
	var random = g.rand.nextInt(0, 4);
	if (random === 0)
	{
		return new Pistol();
	}
	else if (random === 1)
	{
		return new Shotgun();
	}
	else if (random === 2)
	{
		return new Rifle();
	}
	else if (random === 3)
	{
		return new AssaultRifle();
	}
}


Game.prototype.getRandomMeleeWeapon = function()
{
	var random = g.rand.nextInt(0, 5);
	switch (random)
	{
		case 0:
			return new SledgeHammer();
			break;
		case 1:
			return new Chain();
			break;
		case 2:
			return new SamuraiSword();
			break;
		case 3:
			return new BaseballBat();
			break;
		case 4:
			return new Lance();
			break;
	}
}



Game.prototype.getRandomWeapon = function()
{
	var random = g.rand.nextInt(0, 2);
	if (random === 0)
	{
		return this.getRandomGun();
	}
	else if (random === 1)
	{
		return this.getRandomMeleeWeapon();
	}
}





Game.prototype.initialize = function()
{
	this.player = new Player(this.playerRace, this.playerClass);
	if (this.inTutorial)
	{
		this.generateNewTutorialLevel();
	}
	else
	{
		this.generateNewLevel();
	}
	this.spawnUnit(this.player, this.level.spawnTile);
}


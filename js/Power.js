	
function Power(powerName)
{
	this.name;
	this.persistantName; //Doesn't change when we upgrade
	this.powerName = powerName; //the name of the power. Used to find it in the g.powers associative array
	this.unlocked = false;
	this.powerState; //Aiming or activatin
	this.possesor; //Unit who posseses the power

	this.atts; //The attributes of the power like time taken, energy consumption, etc.
	this.activate; //The function called to use the power
	this.currentlyActivated; //True if its an on/off power that's currently on

	this.upgradesActivated = 0;
}





Power.prototype.upgrade = function()
{
	if (this.upgradesActivated === this.atts.maxUpgrades)
	{
		return;
	}

	//If the power is locked, unlock it
	if (this.unlocked === false)
	{
		this.unlocked = true;
		if (this.atts.powerType === 'PASSIVE')
		{
			g.game.player.passivePowers[this.atts.persistantName] = true;
		}

		return;
	}

	this.upgradesActivated++;
	var upgrade = this.atts.upgrades[this.upgradesActivated]; //The upgrade object of the upgrade we're upgrading to
	this.name = this.atts.upgrades[this.upgradesActivated].name;
	if (upgrade.changeAimed) //If the upgrade changes the aimed status. Example: upgrading from blinking randomly to blinking to a tile aimed at
	{
		this.atts.aimed = !this.atts.aimed;
	}
	//If the upgrade changes the atts of the power. Example, upgrading to use less power
	if (typeof upgrade.changeAtts !== "undefined")
	{
		upgrade.changeAtts(this.atts);
	}
}




Power.prototype.initialize = function(possesor)
{
	this.possesor = possesor
	this.atts = g.powers[this.powerName];
	this.activate = this.atts.activate;
	this.name = this.atts.name;
	this.persistantName = this.atts.persistantName;
	if (this.atts.powerType === "SUSTAINED")
	{
		this.currentlyActivated = false;
	}
}























g.powers.blink = {
	name: 'Blink',
	powerType: "ACTIVATED",
	aimed: false,
	spreadAngle: 0,
	affectsEnemies: false, //If true, when you aim it, it'll make the enemies highlighted red
	affectsAllEnemiesAimedAt: false, //If true, it'll make all the enemies within the aim red. Else, just the first ones
	energyConsumption: 30,
	timeTaken: 1,
	noise: 0,
	//maxRange: 10, //Can blink 10 tiles away max
	//minRangeWhenRandom: 3, //When you're blinking randomly, it will be at least 3 tiles away
	description: "<h4>Blink</h4><p>Teleport to a random tile visible to you.</p>"
						+ "<h4>Stable Blink</h4><p>Teleport to a random tile within one tile of the tile you aim at.</p>"
						+ "<h4>Precise Blink</h4><p>Teleport to the tile aimed at. The energy cost is halved.</p>",

	upgrades: {
		1: {
			name: "Stable Blink",
			changeAimed: true,
		},
		2: {
			name: "Precise Blink",
			changeAimed: false,
			changeAtts: function(atts)
			{
				var newEnergyConsumption = atts.energyConsumption / 2;
				newEnergyConsumption = newEnergyConsumption < 1 ? 1 : newEnergyConsumption;
				atts.energyConsumption = newEnergyConsumption;
			},
		},
	},
	maxUpgrades: 2,
	
	activate: function()
	{
		var thisT = this.possesor.tile;
		var blinkTile; //The tile to blink to
		var atts = this.atts;
		if (this.upgradesActivated === 0)//Random Blink
		{
			var potentialTiles = []; //Tiles the unit could potentially blink to.
			//Get random tile between min and max
			for (var i = 0 ; i < this.possesor.visibleTiles.length ; i++)
			{
				var t = this.possesor.visibleTiles[i];
				if (t === false)//If there's no tile at (x, y)
				{
					continue;
				}
				if (t.blocksMovement)//If the tile blocks movement
				{
					continue;
				}
				if (this.possesor.visibleTiles.indexOf(t) === -1)//If the unit casting the power can't see the tile
				{
					continue;
				}

				//Else, add it to potential tiles
				potentialTiles.push(t);
				
			}
			//If there's no tile to blink to , return false
			if (potentialTiles.length === 0)
			{
				return false;
			}
			//Choose a random tile from potential tiles
			var randInd = g.rand.nextInt(0, potentialTiles.length);
			blinkTile = potentialTiles[randInd];
		}
		else if (this.upgradesActivated === 1)//Stable blink
		{
			//Blink within 2 tiles of where you choose
			if (g.game.selectedTile === false)
			{
				return "NOTILESELECTED";
			}
			//If there is a tile selected
			var selectedT = g.game.selectedTile;
			var distance = thisT.getRoundDistance(selectedT);
			if (distance > atts.maxRange) //If it's out of range
			{
				return false;
			}
			if (selectedT.blocksMovement) //If the target blocks movement
			{
				return false;
			}
			if (this.possesor.visibleTiles.indexOf(selectedT) === -1)//If the unit can't see the target
			{
				return false;
			}
			//Else, teleport to somewhere within 1 tile1 of where you selected
			var potentialTiles = [];
			for (var x = selectedT.x - 1 ; x <= selectedT.x + 1 ; x++)
			{
				for (var y = selectedT.y - 1 ; y <= selectedT.y + 1 ; y++)
				{
					var t = g.game.level.getTile(x, y);
					if (t === false)//If there's no tile at (x, y)
					{
						continue;
					}
					if (t.blocksMovement)//If the tile blocks movement
					{
						continue;
					}
					if (this.possesor.visibleTiles.indexOf(t) === -1)//If the unit casting the power can't see the tile
					{
						continue;
					}

					//Else, add it to potential tiles
					potentialTiles.push(t);
				}
			}
			//If there's no tile to blink to , return false
			if (potentialTiles.length === 0)
			{
				return false;
			}
			//Choose a random tile from potential tiles
			var randInd = g.rand.nextInt(0, potentialTiles.length);
			blinkTile = potentialTiles[randInd];
		}
		else if (this.upgradesActivated === 2)//Precise blink: Blink within 2 tiles of where you choose
		{
			
			if (g.game.selectedTile === false)
			{
				return "NOTILESELECTED";
			}
			//If there is a tile selected
			var selectedT = g.game.selectedTile;
			var distance = thisT.getRoundDistance(selectedT);
			if (distance > atts.maxRange) //If it's out of range
			{
				return false;
			}
			if (selectedT.blocksMovement) //If the target blocks movement
			{
				return false;
			}
			if (this.possesor.visibleTiles.indexOf(selectedT) === -1)//If the unit can't see the target
			{
				return false;
			}
			blinkTile = selectedT;	
		}
		g.game.transportUnit(this.possesor, blinkTile);
		return atts.timeTaken;
	},

		
}









//Turns the unit around. Can cast on any unit within field of vision
g.powers.turn = {
	name: 'Turn',
	powerType: "ACTIVATED",
	aimed: true,
	spreadAngle: 0, 
	affectsEnemies: true,
	energyConsumption: 25,
	timeTaken: 1,
	noise: 0,
	description: "<h4>Turn</h4><p>Randomly change the direction of an enemy.</p>"
			+ "<h4>Better Turn</h4><p>Turn an enemy so it's back is facing you.</p>"
			+ "<h4>Mass Turn</h4><p>All enemies visible to you are turned so their backs are facing you.</p>",

	upgrades: {
		1: {
			name: "Better Turn",
			changeAimed: false,
		},
		2: {
			name: "Mass Turn",
			changeAimed: true,
		}
	},
	maxUpgrades: 2,
	activate: function()
	{
		var selectedT = g.game.selectedTile;
		if (this.upgradesActivated === 0 || this.upgradesActivated === 1)
		{
			if (g.game.selectedTile === false)
			{
				return "NOTILESELECTED";
			}
			if (selectedT.unit === false)
			{
				return false;
			}
			if (this.possesor.visibleTiles.indexOf(selectedT) === -1)//If the unit can't see the target
			{
				return false;
			}
			if (g.game.selectedTile.unit === g.game.player)
			{
				return false;
			}
		}
		var unit = g.game.selectedTile.unit;
		var units = [];//The units that will be turned
		var turnDirections = []; //The direction to turn those units
		var thisT = this.possesor.tile;
		var turnDirection;
		//If we have a unit selected
		if (this.upgradesActivated === 0)
		{
			//Get a random direction that isn't the direction the unit is facing
			var currentDirection = unit.direction;
			var potentialDirections = [];
			for (var i = 0 ; i < 4 ; i++)
			{
				if (i === currentDirection)
				{
					continue;
				}
				potentialDirections.push(i);
			}
			turnDirections = [potentialDirections[g.rand.nextInt(0, 3)]]; //We know there will be 3 directions in there
			units = [unit];
		}
		else if (this.upgradesActivated === 1)
		{
			//Find what index the unit is closest to, then turn it in that direction
			var startInd = g.rand.nextInt(4, 8);
			var endInd = startInd + 4;
			var minDistance = false;
			var minDistanceInd;
			for (var ind = startInd ; ind < endInd ; ind++)
			{
				var i = ind % 4;
				var sib = thisT.siblings[i];
				var dist = sib.getDistance(unit.tile);
				if (minDistance === false || dist < minDistance)
				{
					minDistance = dist;
					minDistanceInd = i;
				}
			}
			turnDirections = [minDistanceInd];
			units = [unit];
		}
		else if (this.upgradesActivated === 2) //Mass turn: turn all enemies in view
		{
			//For each visible tile
			for (var tInd = 0 ; tInd < this.possesor.visibleTiles.length ; tInd++)
			{
				var visibleTile = this.possesor.visibleTiles[tInd];
				if (visibleTile.unit === false)
				{
					continue;
				}
				if (visibleTile.unit === this.possesor)
				{
					continue;
				}
				//If there is a unit that's not the possesor
				//Find what index the unit is closest to, then turn it in that direction
				var currUnit = visibleTile.unit;
				units.push(currUnit);
				var minDistance = false;
				var minDistanceInd;
				for (var i = 0 ; i < 4 ; i++)
				{	
					var sib = thisT.siblings[i];
					var dist = sib.getDistance(currUnit.tile);
					if (minDistance === false || dist < minDistance)
					{
						minDistance = dist;
						minDistanceInd = i;
					}
				}
				turnDirections.push(minDistanceInd)
			}
		}

		for (var i = 0 ; i < units.length ; i++)
		{
			g.game.turnUnitInstant(units[i], turnDirections[i]);
		}
		return this.atts.timeTaken;
	}


}





g.powers.trackMovement = {
	name: 'Track Movement',
	persistantName: 'Track_Movement',
	powerType: "SUSTAINED",
	drainsDuring: ["ATTACK"],
	aimed: false,
	energyConsumption: 50,
	timeTaken: 0,
	noise: 0,
	description: "<h4>Track Movement</h4><p><b>Sustained Ability. Only drains energy when you attack.</b> "
			+ "When turned on, you never miss the enemies you shoot at.</p>"
			+ "<h4>Effecient Tracker</h4><p><b>Sustained Ability. Only drains energy when you attack.</b> "
			+ "The energy cost of the tracker is reduced by half.</p>",

	upgrades: {
		1: {
			name: "Effecient Tracker",
			changeAimed: false,
			changeAtts: function(atts)
			{
				var newEnergyConsumption = atts.energyConsumption / 2;
				newEnergyConsumption = newEnergyConsumption < 1 ? 1 : newEnergyConsumption;
				atts.energyConsumption = newEnergyConsumption;
			}
		},
	},
	maxUpgrades: 1,

	
	activate: function()
	{
		//Toggle on or off
		this.possesor.powerModes.trackMovement = !this.possesor.powerModes.trackMovement;
		this.currentlyActivated = !this.currentlyActivated;
		g.view.setPowersMainDiv();
		g.view.setEquipmentMainDiv();
		return 0;
	}
	
}





g.powers.slowTime = {//All enemy actions take twice as long
	name: 'Slow Time',
	persistantName: 'Slow_Time',
	powerType: "SUSTAINED",
	drainsDuring: "ALLWAYS",
	aimed: false,
	energyConsumption: 70,
	timeTaken: 0,
	noise: 0,
	description: "<h4>Slow Time</h4><p><b>Sustained Ability. Drains energy after each tick.</b> "
			+ "While activated, time passes at half speed for everything except you.</p>"
			+ "<h4>Subdue Time</h4><p><b>Sustained Ability. Drains energy after each tick.</b> "
			+ "While activated, time passes at 1/4 speed for everything except you.</p>"
			+ "<h4>Stop Time</h4><p><b>Sustained Ability. Drains energy after each tick.</b> "
			+ "While activated, time stops completely for everything except you.</p>",

	upgrades: {
		1: {//All enemy actions take four times as long
			name: "Subdue Time",
			changeAimed: false,
		},
		2: {
			name: "Stop Time", //Enemy's are frozen
			changeAimed: false,
		}
	},
	maxUpgrades: 2,

	activate: function()
	{
		//Toggle on or off
		this.possesor.powerModes.slowTime = !this.possesor.powerModes.slowTime;
		this.currentlyActivated = !this.currentlyActivated;
		g.view.setPowersMainDiv();
		return 0;
	}
}



//Conjures a zombie or multiple zombies in adjacent tiles. Fails if no adjacent tiles open
g.powers.conjureZombie = {
	name: 'Conjure Zombie',
	powerType: "ACTIVATED",
	aimed: false,
	energyConsumption: 100,
	timeTaken: 3,
	noise: 10,
	description: "<span class='powerSmall'><h4>Conjure Zombie</h4><p>Summons a zombie to fight by your side.<br/><b>Lifespan:</b> 50 ticks&nbsp;&nbsp;&nbsp;<b>Max Health:</b> 100</p>"
			+ "<h4>Conjure Powerful Zombie</h4><p>Summons a stronger, longer lasting zombie.<br/><b>Lifespan:</b> 200 ticks&nbsp;&nbsp;&nbsp;<b>Max Health:</b> 300</p>"
			+ "<h4>Conjure Persistant Zombie</h4><p>Summons a stronger zombie with no life span.<br/><b>Max Health:</b> 300</p>"
			+ "<h4>Zombie Congregation</h4><p>Summons 3 powerful zombies.<br/><b>Max Health:</b> 300</p>"
			+ "<h4>Horde</h4><p>Summons 8 powerful zombies.<br/><b>Max Health:</b> 300</p></span>",

	upgrades: {
		1: {
			name: "Conjure Powerful Zombie",
			changeAimed: false,
		},
		2: {
			name: "Conjure Persistant Zombie",
			changeAimed: false,
		},
		3: {
			name: "Zombie Congregation", //Summon 3 zombies
			changeAimed: false,
		},
		4: {
			name: "Horde", //Summon 8 Zombies
			changeAimed: false,
		}
	},
	maxUpgrades: 4,

	activate: function()
	{
		var thisT = this.possesor.tile;
		//Get open adjacent tiles
		var potentialSpawnPoints = [];
		for (var y = thisT.y - 1 ; y <= thisT.y + 1 ; y++)
		{
			for (var x = thisT.x - 1 ; x <= thisT.x + 1 ; x++)
			{
				var t = g.game.level.getTile(x, y);
				if (t === false)
				{
					continue;
				}
				if (t.terrain === 'OPEN' && t.unit === false)
				{
					potentialSpawnPoints.push(t);
				}
			}
		}

		if (potentialSpawnPoints.length === 0) //If there were no open tiles to spawn the zombies
		{
			return false;
		}

		var numberOfZombies;
		if (this.upgradesActivated === 4)
		{
			numberOfZombies = 8;
		}
		else if (this.upgradesActivated === 3)
		{
			numberOfZombies = 3;
		}
		else 
		{
			numberOfZombies = 1;
		}

		var spawnPoints = getRandomElements(potentialSpawnPoints, numberOfZombies);

		for (var i = 0 ; i < spawnPoints.length ; i++)
		{
			var currSpawnPoint = spawnPoints[i];
			var zombie = new g.constructors.Zombie();
			var lifespan;
			var maxHealth;
			switch (this.upgradesActivated)
			{
				case 0:
					lifespan = 50;
					maxHealth = 100;
					break;
				case 1:
					lifespan = 200;
					maxHealth = 300;
					break;
				case 2:
					lifespan = false;
					maxHealth = 300;
					break;
				case 3:
					lifespan = false;
					maxHealth = 300;
					break;
				case 4:
					lifespan = false;
					maxHealth = 300;
			}
			zombie.lifespan = lifespan;
			zombie.overrides.maxHealth = maxHealth;

			g.game.spawnUnit(zombie, currSpawnPoint, 'ALLY');
			zombie.direction = this.possesor.direction;
		}

	}
}




g.powers.cloak = { //Cuts visibility in half
	name: 'Cloak',
	persistantName: 'Cloak',
	powerType: 'SUSTAINED',
	drainsDuring: 'ALWAYS',
	aimed: false,
	energyConsumption: 20,
	timeTaken: 0,
	noise: 0,
	description: '<h4>Cloak</h4><p><b>Sustained Ability. Drains energy after each tick.</b> '
			+ 'Cuts your visibility in half.</p>'
			+ '<h4>Efficient Cloak</h4><p><b>Sustained Ability. Drains energy after each tick.</b> '
			+ 'Reduces energy consumption by 50%.</p>'
			+ '<h4>Ghostly Cloak</h4><p><b>Sustained Ability. Drains energy after each tick.</b> '
			+ 'Reduces your visibility by 75%.</p>'
			+ '<h4>Efficient Cloak</h4><p><b>Sustained Ability. Drains energy after each tick.</b> '
			+ 'Reduces your visibility by 90%.</p>',

	maxUpgrades: 3,
	upgrades: 
	{
		1: 
		{ //Halves energy consumption
			name: "Efficient Cloak",  
			changeAimed: false,
			changeAtts: function(atts)
			{
				var newEnergyConsumption = atts.energyConsumption / 2;
				newEnergyConsumption = newEnergyConsumption < 1 ? 1 : newEnergyConsumption;
				atts.energyConsumption = newEnergyConsumption;
			},
		},
		2: 
		{ //Cuts visibility by 75%
			name: "Ghostly Cloak",
			changeAimed: false,
		},
		3: 
		{ //Reduces visibility by 90%
			name: "Phantom Cloak",
			changeAimed: false,
		},
	},

	activate: function()
	{
		//Toggle on or off
		this.possesor.powerModes.cloak = !this.possesor.powerModes.cloak;
		this.currentlyActivated = !this.currentlyActivated;
		g.view.setPowersMainDiv();
		g.view.setCharacterMainDiv();
		return 0;
	}
}





g.powers.adrenalineMeter = {//Double damage if you have three enemies next to you
	name: 'Adrenaline Meter',
	persistantName: 'Adrenaline_Meter',
	powerType: 'PASSIVE',
	description: '<h4>Adrenaline Meter</h4><p><b>Passive ability.</b> '
			+ 'If you have three or more enemies immediately adjacent to you, you do double damage.<p>'
			+ '<h4>Adrenaline Rush</h4><p><b>Passive ability.</b> '
			+ 'You do triple damage instead of double.<p>'
			+ '<h4>Liberal Rush</h4><p><b>Passive ability.</b> '
			+ 'You only need to have two enemies immediately adjacent to you.<p>',

	maxUpgrades: 2,
	upgrades: { 
		1: { //triple damage
			name: 'Adrenaline Rush',
			changeAimed: false,
		},
		2: {//Only need two enemies
			name: 'Liberal Rush',
			changeAimed: false,
		}
	},

	activate: function()
	{
		return;
	}
}






g.powers.focus = { //Dodge chance doubled when you're bellow 50% health
	name: "Focus",
	persistantName: 'Focus',
	powerType: 'PASSIVE',
	description: '<h4>Focus</h4><p><b>Passive ability.</b> '
			+ 'If your health gets bellow 50%, your dodge chance is doubled.</p>'
			+ '<h4>Hyper Focus</h4><p><b>Passive ability.</b> '
			+ 'In addition to the other effects, if your health gets bellow 50%, you reload instantly.</p>'
			+ '<h4>Desperation</h4><p><b>Passive ability.</b> '
			+ 'In addition to the other effects, if your health gets bellow 25%, your move time is 1.</p>'
			+ '<h4>Last Stand</h4><p><b>Passive ability.</b> '
			+ 'In addition to the other effects, if your health gets bellow 10%, your energy recharges fully after every tick.</p>',

	maxUpgrades: 3,
	upgrades: {
		1: {//Reload time is set to 0 if you're bellow 50% health
			name: 'Hyper Focus',
			changeAimed: false,
		},
		2: { //In addition to the other effects, if your health is bellow 25%, your move time is always 1
			name: 'Desperation',
			changeAimed: false,
		},
		3: 
		{ //In addition, if your health is bellow 10%, your energy fully recharges after every tick
			name: 'Last Stand',
			changeAimed: false,
		}
	}
}






g.powers.heal = { //Gain 25 health
	name: 'Heal',
	persistantName: 'Heal',
	powerType: 'ACTIVATED',
	aimed: false,
	energyConsumption: 50,
	timeTaken: 4,
	noise: 0,
	description: '<h4>Heal</h4><p>Gain 25 health.</p>'
			+ '<h4>Instant Heal</h4><p>Healing no longer takes any time.</p>'
			+ '<h4>Greater Heal</h4><p>Gain 50 health.</p>'
			+ '<h4>Prayer</h4><p> 50% chance of fully healing. The probability increase by 2% for every point of intelligence you have. If it fails, you still gain 50 health.</p>',

	maxUpgrades: 3,
	upgrades: {
		1: //Instant heal
		{
			name: 'Instant Heal',
			changeAimed: false,
			changeAtts: function(atts)
			{
				atts.timeTaken = 0;
			}
		},

		2: 
		{ //Gain 50 
			name: 'Greater Heal',
			changeAimed: false,
		},

		3: { //In addition to healing for 50, there's a (50 + 2*int)% chance you will be fully healed
			name: 'Prayer',
			changeAimed: false,
		}
	},

	activate: function()
	{
		var p = this.possesor;
		if (this.upgradesActivated === 0 || this.upgradesActivated === 1)
		{
			p.increaseHealth(25);
		}
		else if (this.upgradesActivated === 2)
		{
			p.increaseHealth(50);
		}
		else if (this.upgradesActivated === 3)
		{
			p.increaseHealth(50);

			var rand = g.rand.next(0, 1);
			if (rand < (.5 + p.getIntelligence() / 50))
			{
				p.increaseHealth(p.getMaxHealth());
			}
		}
	}
}




g.powers.shock = {
	name: 'Shock',
	persistantName: 'Shock',
	powerType: 'ACTIVATED',
	aimed: true,
	affectsEnemies: true,
	affectsAllEnemiesAimedAt: false,
	energyConsumption: 20,
	timeTaken: 4,
	noise: 10,
	spreadAngle: 0,
	description: "<h4>Shock</h4><p>Damage an enemy for 40 + 10 * [intelligence].</p>"
				+ "<h4>Powerful Shock</h4>Damage an enemy for 40 + 15 * [intelligence].</p>"
				+ "<h4>Shock Field</h4>The shock spreads to all the enemies adjacent to the targeted enemy, all enemies adjacent to those enemies, etc etc.</p>",

	upgrades: {
		1: {
			name: "Powerful Shock",
			changeAimed: false,
		},
		2: {
			name: "Shock Field",
			changeAimed: false,
		},
	},
	maxUpgrades: 2,

	activate: function(){
		var thisT = this.possesor.tile;
		var atts = this.atts;
		var damage = 40 + (10 * this.possesor.getIntelligence());

		if (this.upgradesActivated > 0)
		{
			damage += (5 * this.possesor.getIntelligence());
		}

		if (this.upgradesActivated < 2) //IF it only affects one enemy
		{
			var target = this.possesor.actorsAimedAtPower[0];
			target.reduceHealth(damage);
		}
		else
		{
			for (var i = 0 ; i < this.possesor.actorsAimedAtPower.length ; i++)
			{
				var target = this.possesor.actorsAimedAtPower[i];
				target.reduceHealth(damage);
			}
		}
		return this.atts.timeTaken;
	}
}




g.powers.push = {
	name: "Push",
	persistantName: "Push",
	powerType: 'ACTIVATED',
	aimed: true,
	affectsEnemies: true,
	affectsAllEnemiesAimedAt: false,
	spreadAngle: 0,
	timeTaken: 2,
	noise: 15,
	energyConsumption: 20,
	description: "<h4>Push</h4><p>Push an enemy back one tile.</p>"
			+ "<h4>Heave</h4><p>Push an enemy back<br/>([intelligence] / 2) + 1 tiles (rounded up).</p>"
			+ "<h4>Great Heave</h4><p>Push back enemies in a 90&deg; cone.</p>"
			+ "<h4>Brutal Heave</h4><p>Enemies pushed back also take [intelligence] x 2 damage.</p>",

	upgrades: 
	{
		1: {
			name: "Heave", //Pushes an enemy back 1 + [your intelligence] / 2 rounded up
			changeAimed: false,
		},
		2: {//Pushes back a cone of enemies
			name: "Great Heave",
			changeAimed: false,
			changeAtts: function(atts)
			{
				atts.spreadAngle = 90;
				atts.affectsAllEnemiesAimedAt = true;
			}
		},
		3: {//Also does 2 * intelligence damage
			name: "Brutal Heave",
			changeAimed: false,
		}
	},
	maxUpgrades: 3,

	activate: function()
	{
		var thisT = this.possesor.tile;

		for (var i = 0 ; i < this.possesor.actorsAimedAtPower.length ; i++)
		{
			var a = this.possesor.actorsAimedAtPower[i];
			var kB = this.upgradesActivated === 0 ? 1 : 1 + Math.floor(this.possesor.getIntelligence() / 2);
			for (var kBNum = 0 ; kBNum < kB ; kBNum++)
			{
				var succesful = this.possesor.knockBackUnit(a);
				if (succesful === false)
				{
					break;
				}
			}

			if (this.upgradesActivated >= 3)
			{
				a.reduceHealth(2 * this.possesor.getIntelligence());
			}
		}
		return this.atts.timeTaken;
	}
}




















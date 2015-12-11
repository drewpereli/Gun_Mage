

g.constructors.Zombie = function Zombie()
{

	this.tile;
	
	this.name = 'Zombie';
	this.enemyType = 'ZOMBIE';
	this.enemyText = 'Zombie';

	this.strength = 10;
	this.dexterity = 0;
	this.intelligence = 0;
	this.perception = 10;

	this.speed = "SLOW";

	this.overrides = { //Will return these values instead of the values based on attributes
		maxHealth: 150,
		weaponDamage: 40, 
	}

}

g.constructors.Zombie.prototype = new Enemy();









g.constructors.UndeadSoldier = function UndeadSoldier()
{
	this.name = 'Undead Soldier';
	this.enemyType = 'UNDEADSOLDIER';
	this.enemyText = 'Undead Soldier';

	this.strength = 10;
	this.dexterity = 5;
	this.intelligence = 0;
	this.perception = 15;

	this.speed = "SLOW";

	this.overrides = {
		maxHealth: 200,
		viewAngle: 90,
		viewRange: 20,
	}

	this.equipedWeapon = new Rifle();
}

g.constructors.UndeadSoldier.prototype = new Enemy();









g.constructors.Hive = function Hive(type)
{
	this.name = type + " Hive";
	this.enemyType = "HIVE";
	this.enemyText = type + " Hive";


	this.unitProduced = type;


	this.overrides = {
		maxHealth: 300,
		viewDistance: 10,
	}

}

g.constructors.Hive.prototype = new Enemy();



g.constructors.Hive.prototype.act = function()
{
	if (this.behavior === 'SLEEPING')
	{
		if (this.isInLineOfSight(g.game.player.tile))
		{
			this.hostileBehave();
			this.changeBehavior('HOSTILE');
		}
	}
	else if (this.behavior === 'HOSTILE')
	{
		if (this.isInLineOfSight(g.game.player.tile))
		{
			this.hostileBehave();
		}
		else
		{
			this.changeBehavior("SLEEPING");
		}
	}
}


g.constructors.Hive.prototype.hostileBehave = function()
{
	var openTile = false;
	var startingIndex = g.rand.nextInt(0, 4);
	for (var ind = startingIndex ; ind < startingIndex + 4 ; ind++)
	{
		var i = ind % 4;
		var sib = this.tile.siblings[i];
		if (sib.terrain !== 'OPEN' || sib.unit !== false)
		{
			continue;
		}
		openTile = sib;
		break;
	}

	if (openTile === false)
	{
		return;
	}

	//If we're producing a unit
	if (g.rand.next(0, 1) < g.HIVESPAWNCHANCE)
	{
		var unit = new g.constructors[this.unitProduced]();
		g.game.spawnUnit(unit, openTile, "WANDERING");
	}

	this.timeUntilNextAction = 0;
}







g.constructors.Scarab = function Scarab()
{
	this.enemyType = 'SCARAB';
	this.enemyText = 'Scarab';

	this.speed = "FAST";

	this.overrides = {
		maxHealth: 1,
		weaponDamage: 30,
		weaponRange: 1.5,
		viewDistance: 20,
		viewAngle: 180,
	}
}

g.constructors.Scarab.prototype = new Enemy();


//Damages all enemies in a 3 by 3 square
g.constructors.Scarab.prototype.selfDestruct = function()
{
	if (this.dead)
	{
		return;
	}
	for (var x = this.tile.x - 1 ; x <= this.tile.x + 1 ; x++)
	{
		for (var y = this.tile.y - 1 ; y <= this.tile.y + 1 ; y++)
		{
			var t = g.game.level.getTile(x, y);
			if (t === false)
			{
				continue;
			}
			//Add it to exploded tiles
			if (g.game.explodedTiles.indexOf(t) === -1)
			{
				g.game.explodedTiles.push(t);
			}

			if (t.unit === false)
			{
				continue;
			}
			if (t.unit === this)
			{
				continue;
			}
			if (t.unit.dead)
			{
				continue;
			}
			//If there is a unit, damage it
			g.game.processAttack(this, t);
		}
	}

	this.die();
}


g.constructors.Scarab.prototype.attack = function()
{
	this.selfDestruct();
}


g.constructors.Scarab.prototype.takeDamage = function()
{
	this.selfDestruct();
}










g.constructors.Colossus = function Colossus()
{
	this.enemyType = 'COLOSSUS';
	this.enemyText = 'Colossus';

	this.speed = "VERYSLOW";

	this.overrides = {
		maxHealth: 1000,
		weaponDamage: 100,
		weaponRange: 1,
		viewDistance: 10,
		viewAngle: 180,
		weaponAttackTime: 30,
	}
}

g.constructors.Colossus.prototype = new Enemy();

g.constructors.Colossus.prototype.receiveAttack = function(damage, direction)
{
	return this.takeDamage(0, false);
}









g.constructors.SpiderMother = function SpiderMother()
{
	this.enemyType = "SPIDERMOTHER";
	this.enemyText = 'Spider Mother';


	this.overrides = {
		weaponDamage: 10,
		maxHealth: 10,
		viewDistance: 15,
		moveTime: 4,
	}
}


g.constructors.SpiderMother.prototype = new Enemy();

g.constructors.SpiderMother.prototype.die = function()
{
	//Get all the tiles in a radius of 3
	var radius = 3;
	for (var x = this.tile.x - radius ; x <= this.tile.x + radius ; x++)
	{
		for (var y = this.tile.y - radius ; y <= this.tile.y + radius ; y++)
		{
			var tile = g.game.level.getTile(x, y);
			if (tile === false)
			{
				continue;
			}
			if (tile.blocksMovement)
			{
				continue;
			}
			var distance = tile.getRoundDistance(this.tile);
			if (distance > radius)
			{
				continue;
			}

			//Else, spawn a new spider maybe 
			if (g.rand.next(0, 1) < .5)
			{
				g.game.spawnUnit(new g.constructors.Spider(), tile, 'CURIOUS');
			}
		}
	}
	this.dead = true;
	this.tile.setUnit(false);
	this.tile = false;
	g.game.killUnit(this);
}




g.constructors.Spider = function Spider()
{
	this.enemyType = 'SPIDER';
	this.enemyText = 'Spider';

	this.speed = "VERYFAST";

	this.overrides = {
		weaponDamage: 20,
		weaponAttackTime: 4,
		maxHealth: 50,
		viewDistance: 10,
	}
}

g.constructors.Spider.prototype = new Enemy();





g.constructors.SecurityDrone = function SecurityDrone()
{
	this.enemyType = 'SECURITYDRONE';
	this.enemyText = 'Security Drone';

	this.chanceToRunWhenCloseToEnemy = 1; //The likelihood that the drone will run from the player if they're close. Else they will shoot the player. Leads to run and gun behavior

	this.speed = "FAST";

	this.overrides = {
		weaponDamage: 50,
		weaponRange: 5,
		weaponAttackTime: 8,
		maxHealth: 100,
		viewDistance: 20,
		viewAngle: 360,

	}
}

g.constructors.SecurityDrone.prototype = new Enemy();







g.constructors.LumenDroid = function LumenDroid()
{
	this.enemyType = 'LUMENDROID';
	this.enemyText = 'LUMENDROID';

	this.tilesLit = []; //The tiles it is currently articifically lighting
	this.actualLightingOfTilesLit = []; //What the tile lighint will be returned to when thing moves or is damaged
	this.lightRadiusInitial = 3; //The radius around itself that it lights up

	this.overrides = {
		weaponDamage: 60,
		weaponRange: 5,
		weaponAttackTime: 12,
		viewDistance: 20,
		viewAngle: 180,
		maxHealth: 100,
	}
}

g.constructors.LumenDroid.prototype = new Enemy();



g.constructors.LumenDroid.prototype.setSurroundingLighting = function()
{
	//Go through the previously lit tiles and set them to their initial lighting
	for (var i = 0 ; i < this.tilesLit.length ; i++)
	{
		var previouslyLitTile = this.tilesLit[i];
		var previousLighting = this.actualLightingOfTilesLit[i];
		previouslyLitTile.setLight(previousLighting);
	}

	//Light up all the tiles within the radius and wthin line of sight
	this.tilesLit = [];
	this.actualLightingOfTilesLit = [];
	var radius = this.getLightRadius();
	
	if (radius === 0)
	{
		return;
	}

	for (var x = this.tile.x - radius ; x <= this.tile.x + radius ; x++)
	{
		for (var y = this.tile.y - radius ; y <= this.tile.y + radius ; y++)
		{
			var tile = g.game.level.getTile(x, y);

			if (tile === false)
			{
				continue;
			}
			var distance = tile.getRoundDistance(this.tile);
			if (distance > radius)
			{
				continue;
			}
			if (this.isInLineOfSight(tile) === false && tile !== this.tile)
			{
				continue;
			}

			//set the lighting to bright
			this.tilesLit.push(tile);
			this.actualLightingOfTilesLit.push(tile.light);
			tile.setLight('BRIGHT');
			
		}
	}
}



g.constructors.LumenDroid.prototype.getLightRadius = function()
{
	var maxHealth = this.getMaxHealth();
	var health = this.get('health');
	var radius = Math.round(this.lightRadiusInitial * health/maxHealth);
	return radius;
}








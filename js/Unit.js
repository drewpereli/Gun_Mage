
function Unit()
{
	this.race;
	this.class;

	this.level;

	this.behavior;

	//Attribute default values
	this.strength = 0;
	this.dexterity = 0;
	this.intelligence = 0;
	this.perception = 0;

	//this.baseMaxHealth = 100;
	this.health;
	this.creatureMaxHealthEffect = 0;//Added to the creatures max health
	//this.baseMaxEnergyInit = 100;
	this.energy;


	this.speed = "NORMAL"; //Very fast, fast, normal, slow, very slow.

	this.flankingBonuses = {//Multipliers for flanking bonuses
		side: 2,
		back: 3,
	}



	this.overrides = false;//Default is false. 

	this.direction; //0, 1, 2, 3. Initialized as random

	this.stance = "WALKING"; //Walking, running, sneaking

	this.alignment; //Ally, enemy, neutral (for beserking)

	this.equipment = [];
	this.equipedWeapon = false;
	this.equipedHelmet = false;
	this.equipedArmor = false;
	this.powers = [];

	this.timeUntilNextAction = 1; 

	this.visibleTiles = [];

	this.powerModes = {
		trackMovement: false,
		slowTime: false,
		cloak: false,
	}

	this.passivePowers = {
		Adrenaline_Meter: false,
		Focus: false,
	}

	this.tile;


	this.lifespan = false; //Will be a number for conjured units. False for non-conjured units
	this.timeSpentAlive = 0;

	this.dead = false;//Set to true when the unit dies
}



Unit.prototype.elapseTime = function()
{
	
	//If it's dead, kill it
	if (this.dead)
	{
		return;
	}

	if (this.lifespan !== false)
	{
		this.timeSpentAlive++;
		if (this.timeSpentAlive > this.lifespan)
		{
			this.die();
			return;
		}
	}

	if (g.game.player.powerModes.slowTime)//If slow time is activated
	{//Figure out which upgrade it is
		var power = g.game.player.getPowerObject('slowTime');
		var upgrade = power.upgradesActivated;

		switch (upgrade)
		{
			case 0:
				this.timeUntilNextAction -= .5;
				break;
			case 1:
				this.timeUntilNextAction -= .25;
				break;
			//case 2, nothing should happen beacuse time is frozen!
		}
	}
	else
	{
		this.timeUntilNextAction--;
	}

	
	//If it's time to act, act
	if (this.timeUntilNextAction <= 0)
	{
		if (this.alignment === 'ALLY')
		{
			this.allyAct();
		}
		else
		{
			this.act();
		}
	}
	
}




Unit.prototype.allyAct = function()
{
	var closestEnemy = this.getClosestVisibleEnemy();
	if (closestEnemy !== false) //If there was a visible enemy
	{
		if (this.unitWithinAttackRange(closestEnemy))
		{
			this.attack(closestEnemy.tile);
		}
		else
		{
			this.moveTowards(closestEnemy.tile);
		}
	}
	else
	{
		this.moveTowards(g.game.player.tile);
	}
}





Unit.prototype.move = function(directionIndex)
{
	var movingTo = this.tile.siblings[directionIndex];
	//FIX THIS
	if (typeof movingTo === 'undefined')
	{
		return;
	}
	//FIX THIS
	if (movingTo === false || movingTo.blocksMovement){
		return false;
	}
	this.turn(directionIndex);
	this.tile.setUnit(false);
	this.tile = movingTo;
	this.tile.setUnit(this);
	//this.tile.propogateNoise(this.get('moveNoise'));
	//this.direction = directionIndex; Unit will be turned
	this.setVisibleTiles();
	this.timeUntilNextAction += this.get('moveTime'); //+= in case the unit turned as well.

	//If it's a lumen droid, reset the lighting
	if (this.enemyType === "LUMENDROID")
	{
		this.setSurroundingLighting();
	}
}


Unit.prototype.turn = function(directionIndex)
{
	var d = this.direction;
	var timeTakenMultiplierInit = Math.abs(directionIndex - this.direction);
	var timeTakenMultiplier = timeTakenMultiplierInit === 3 ? 1 : timeTakenMultiplierInit;
	var timeTaken = timeTakenMultiplier * this.get("turnTime");
	this.direction = directionIndex;
	this.setVisibleTiles();
	this.timeUntilNextAction = timeTaken;
}


/*
Unit.prototype.attack = function(targetTile)
{
	//Assumes target is in range and we're not out of ammo
	if (this.get('weaponClipSize') !== false)
	{
		this.equipedWeapon.loadedAmmo--;
	}
	//See if it's a miss
	if (targetTile.unit)
	{
		var targetUnit = targetTile.unit;
		var targetText = targetTile === g.game.player.tile ? 'you' : 'the ' + targetTile.unit.enemyText;
		var targetTextUC = targetTile === g.game.player.tile ? 'You' : 'The ' + targetTile.unit.enemyText;
		if (g.rand.next(0, 100) <= this.get('weaponAccuracy')) //If it's a hit
		{
			
			var message;
			//See which side was hit based on what sibling tile of the target this unit is closest to
			var front = targetTile.siblings[targetTile.unit.getTileIndexFront()];
			var right = targetTile.siblings[targetTile.unit.getTileIndexRight()];
			var left = targetTile.siblings[targetTile.unit.getTileIndexLeft()];
			var back = targetTile.siblings[targetTile.unit.getTileIndexBack()];
			var directions = [front, right, left, back]; //This order matters. Whichever the first one to be the closest one is will win. 
			var directionStrings = ['FRONT', 'RIGHT', 'LEFT', 'BACK'];
			var minDistance = this.tile.getDistance(front);
			var minDistanceIndex;
			for (var dirInd = 0 ; dirInd < directions.length ; dirInd++)
			{
				var d = this.tile.getDistance(directions[dirInd]);
				if (d < minDistance)
				{
					minDistance = d;
					minDistanceIndex = dirInd;
				}
			}

			var result = targetTile.unit.receiveAttack(this.get('weaponDamage'), directionStrings[minDistanceIndex]);
			if (result === 'HIT')
			{
				//If the gun has knockback, knock them back
				if (this.get('weaponKnockBack') !== 0)
				{

					var kB = this.get('weaponKnockBack')
					for (var kBNum = 0 ; kBNum < kB ; kBNum++)
					{
						var succesful = this.knockBackUnit(targetTile.unit);
						if (succesful === false)
						{
							break;
						}
					}
				}

				message = 'The ' + this.enemyText + ' inflicts ' + this.get('weaponDamage') + ' damage on ' + targetText + '.';
			}
			else if (result === 'MISS')
			{
				message = targetTextUC + ' dodged the ' + this.enemyText + "'s attack."; 
			}
			else if (result === 'KILL')
			{
				message = targetText + ' died.'

				if (targetUnit === g.game.player)
				{
					g.game.changeState('GAMEOVER');
				}
			}
			g.view.logMessage(message);
		}
		else //if it's a miss
		{
			g.view.logMessage('You miss the ' + targetText + '.');
		}
	}

	this.timeUntilNextAction = this.get('weaponAttackTime');

	if (targetTile === g.game.player.tile)
	{
		g.view.setCharacterMainDiv();
	}
}
*/



Unit.prototype.attack = function(target)
{
	this.timeUntilNextAction = this.getWeaponAttackTime();
	g.game.processAttack(this, target);
}



Unit.prototype.moveTowards = function(target)
{

	var moveIndex = this.getTileOnPathTo(target);
	if (moveIndex === false) //If the path is blocked, see if it's blocked by a unit by trying to get a path that ignores units
	{
		moveIndex = this.getTileOnPathToIgnoreUnits(target);
		if (moveIndex === false)//If it's blocked by a terrain feature, not a unit, try to move closer to the player
		{
			var distanceToPlayer = this.tile.getDistance(target);
			var shortestDistance = distanceToPlayer;
			var startingIndex = g.rand.nextInt(4, 8);
			var E = this.tile.siblings.length + startingIndex;
			for (var ind = startingIndex ; ind < E ; ind++)//Cycle through the sibilngs randomly, see which one minimizes the distance to the player
			{																					  //Do it randomly because the first tile that minimizes the distance will be selected
				var i = ind % 4;
				var sib = this.tile.siblings[i];
				if (sib.blocksMovement)
				{
					continue;
				}
				var sibDistance = sib.getDistance(target);
				if (sibDistance < shortestDistance)
				{
					shortestDistance = sibDistance;
					moveIndex = i;
				}
			}
		}
	}
	
	this.move(moveIndex);
}




//Returns false if can't move
Unit.prototype.moveTowardsPlayer = function()
{
	this.moveTowards(g.game.player.tile);
}



//Returns the index of the sibling closest to player. 
Unit.prototype.getOpenSiblingClosestToPlayer = function()
{
	var minDistance = false;
	var t = this.tile;
	var distances = [];
	var indeces = [];
	for (var i = 0 ; i < 4 ; i++)
	{
		var s = t.siblings[i];
		if (s.blocksMovement)
		{
			continue;
		}
		var d = s.getDistance(g.game.player.tile);
		distances.push(d);
		if (minDistance === false || d < minDistance)
		{
			minDistance = d;
		}
	}
	//Get the tiles that fit min distance
	var E = distances.length;
	for (var i = 0 ; i < E ; i++)
	{
		var d = distances[i];
		if (d === minDistance)
		{
			indeces.push(i);
		}
	}
	//Return indeces[0] if the length is 1
	if (indeces.length === 1)
	{
		return indeces[0];
	}
	else if (indeces.length === 0)//If all the tiles are occupied
	{
		return false;
	}
	//Else choose randomly
	var randomSelector = g.rand.nextInt(0, indeces.length);
	return indeces[randomSelector];
}



/*
Unit.prototype.receiveAttack = function(damage, direction)
{
	//If we dodge it
	if (g.rand.next(0, 100) < this.dodgeChance)
	{
		return 'MISS';
	}
	return this.takeDamage(damage, direction);
}
*/

/*
Unit.prototype.takeDamage = function(damage, direction)
{
	if (g.game.DEBUG.playerInvincible && this === g.game.player)
	{
		g.game.tookDamage.push(this);
		return 'HIT';
	}
	var initialDamage = damage;
	if (this.behavior === 'SLEEPING')
	{
		initialDamage *= 3;
	}
	if (direction === "RIGHT" || direction === "LEFT")
	{
		initialDamage *= 2;
	}
	else if (direction === "BACK")
	{
		initialDamage *= 3;
	}
	var realDamage = initialDamage - this.get('damageReduction');
	realDamage = realDamage < 0 ? 0 : Math.round(realDamage);
	this.health -= realDamage;

	//If it's a lumen droid, reset the lighting
	if (this.enemyType === "LUMENDROID")
	{
		this.setSurroundingLighting();
	}

	if (this.get('health') <= 0)
	{
		this.die();
		return 'KILL'
	}
	if (this.type !== "PLAYER" && this.behavior !== 'HOSTILE' && this.behavior !== 'CURIOUS')
	{
		this.changeBehavior('CURIOUS');
	}
	g.game.tookDamage.push(this);
	return 'HIT';
}
*/

Unit.prototype.die = function()
{
	this.dead = true;
	this.tile.setUnit(false);
	this.tile = false;
	g.game.killUnit(this);
}



//Knocks back 'unit' by 1 relative to this
Unit.prototype.knockBackUnit = function(unit)
{
	//If the unit was knockedback into laval, it'll be dead!!!
	if (unit.dead)
	{
		return false;
	}
	//Get the farthest sibling tile(s) of unit.tile from this
	var maxDistance = 0;
	var maxDistanceIndeces = [];
	for (var i = 0 ; i < 4 ; i++)
	{
		var sib = unit.tile.siblings[i];
		var distance = this.tile.getDistance(sib);
		if (distance > maxDistance)
		{
			maxDistance = distance;
			maxDistanceIndeces = [i];
		}
		else if (distance === maxDistance)
		{
			maxDistanceIndeces.push(i);
		}
	}


	//Get random element from maxDistanceIndeces
	var tileToPushBackTo = false;
	var startInd = g.rand.nextInt(0, maxDistanceIndeces.length);
	for (var ind = startInd ; ind < maxDistanceIndeces.length + startInd ; ind++)
	{
		var i = ind % maxDistanceIndeces.length;
		var index = maxDistanceIndeces[i];
		var tile = unit.tile.siblings[index];
		if (tile.blocksMovement === false)
		{
			tileToPushBackTo = tile;
		}
	}
	if (tileToPushBackTo === false)
	{
		return false;
	}
	g.game.transportUnit(unit, tileToPushBackTo);
	return true;
}



Unit.prototype.equipOrUnequipItem = function(equipmentIndex)
{
	var equipment = this.equipment[equipmentIndex]; //The currently selected piece of equpment
	if (equipment === this.equipedWeapon)
	{
		this.unequipWeapon();
	}
	else if (equipment === this.equipedHelmet)
	{
		this.unequipHelmet();
	}
	else if (equipment === this.equipedArmor)
	{
		this.unequipArmor();
	}
	else if (equipment.type === 'GUN' || equipment.type === 'MELEE')
	{
		this.equipedWeapon = equipment;
	}
	else if (equipment.type === 'HELMET')
	{
		this.equipedHelmet = equipment;
	}
	else if (equipment.type === 'ARMOR')
	{
		this.equipedArmor = equipment;
	}
}

Unit.prototype.unequipWeapon = function()
{
	this.equipedWeapon = false;
}

Unit.prototype.unequipHelmet = function()
{
	this.equipedHelmet = false;
}

Unit.prototype.unequipArmor = function()
{
	this.equipedArmor = false;
}


Unit.prototype.moveRandomly = function()
{
	var openIndeces = [];
	for (var i = 0 ; i < 4 ; i++)
	{
		var sib = this.tile.siblings[i];
		if (sib.blocksMovement === false)
		{
			openIndeces.push(i);
		}
	}
	if (openIndeces.length === 0)//If there isn't anything open, return
	{
		return;
	}
	var randomSelector = g.rand.nextInt(0, openIndeces.length);
	this.move(openIndeces[randomSelector]);
}









Unit.prototype.canSeeHostileUnit = function()
{
	if (this.alignment === 'ENEMY')
	{
		return this.canSeePlayerOrAlly();
	}
	else if (this.alignment === 'ALLY')
	{
		return this.canSeeEnemy();
	}
}





Unit.prototype.getClosestHostileUnitInView = function()
{
	if (this.alignment === 'ENEMY')
	{
		return this.getClosestVisibleAlly();
	}
	else if (this.alignment === 'ALLY')
	{
		return this.getClosestVisibleEnemy();
	}
}




//Returns the closest visible enemy-aligned unit. Selects randomly betwen enemy units equally close.
Unit.prototype.getClosestVisibleEnemy = function()
{
	var potentialEnemies = [];
	var minDistance = false;
	for (var i = 0 ; i < this.visibleTiles.length ; i++)
	{
		var t = this.visibleTiles[i];
		if (t.unit === false)
		{
			continue;
		}
		if (t.unit.alignment !== "ENEMY")
		{
			continue;
		}
		var distance = this.tile.getDistance(t);
		if (minDistance === false || distance < minDistance)
		{
			minDistance = distance;
			potentialEnemies = [t.unit];
		}
		else if (distance === minDistance)
		{
			potentialEnemies.push(t.unit);
		}
	}

	//Return a random unit from potential enemies, if any are visible
	if (potentialEnemies.length === 0)
	{
		return false;
	}

	return potentialEnemies[g.rand.nextInt(0, potentialEnemies.length)];
}




//Gets the closest unit aligned as an ally to the player
Unit.prototype.getClosestVisibleAlly = function()
{
	var potentialEnemies = [];
	var minDistance = false;
	for (var i = 0 ; i < this.visibleTiles.length ; i++)
	{
		var t = this.visibleTiles[i];
		if (t.unit === false)
		{
			continue;
		}
		if (t.unit !== g.game.player && t.unit.alignment !== "ALLY") //If the unit isn't the player and their alignment isn't "ally"
		{
			continue;
		}
		var distance = this.tile.getDistance(t.unit);
		if (minDistance === false || distance < minDistance)
		{
			minDistance = distance;
			potentialEnemies = [t.unit];
		}
		else if (distance === minDistance)
		{
			potentialEnemies.push(t.unit);
		}
	}

	//Return a random unit from potential enemies, if any are visible
	if (potentialEnemies.length === 0)
	{
		return false;
	}

	return potentialEnemies[g.rand.nextInt(0, potentialEnemies.length)];
}




//Returns true if the unit can see the player or one of their allies
Unit.prototype.canSeePlayerOrAlly = function()
{
	if (this.canSeePlayer()) //Return true if we can see the player;
	{
		return true;
	}

	for (var i = 0 ; i < this.visibleTiles.length ; i++) //For each visible tile, see if there's an actor there, then see if it's an ally
	{
		var t = this.visibleTiles[i];
		if (t.unit === false)
		{
			continue;
		}
		if (t.unit.alignment === "ALLY")
		{
			return true;
		}
	}

	return false; //If the player wasn't visible and there weren't any allies in visible tiles, return false.
}



Unit.prototype.canSeePlayer = function()
{
	if (this.visibleTiles.indexOf(g.game.player.tile) === -1) //If the player isn't in line of sight, return false
	{
		return false;
	}
	
	//else, we if we're within the player's stealth radius
	var distance = this.tile.getRoundDistance(g.game.player.tile);
	var playerVis = g.game.player.getVisibility();

	return distance <= playerVis;
}




Unit.prototype.unitWithinAttackRange = function(unit)
{
	var range = this.get('weaponRange');
	var distance = this.tile.getDistance(unit.tile);
	return (range >= distance);
}




//Weather or not the unit can attack the player. Assumes the unit can see the player
Unit.prototype.canAttackPlayerAssumesCanSee = function()
{
	var attackRange = this.get('weaponRange');
	var distance = this.tile.getRoundDistance(g.game.player.tile);
	return (attackRange >= distance);
}

//Returns false if there are no allies to attack. Returns the closest ally if there are
Unit.prototype.canAttackAllyAssumesCanSee = function()
{
	var allies = [];
	for (var i = 0 ; i < this.visibleTiles.length ; i++)
	{
		var t = this.visibleTiles[i];
		if (t.unit === false)
		{
			return;
		}
		if (t.unit.alignment === "ALLY")
		{
			allies.push(t.unit);
		}
	}

	//Get the closest ally
	var minDistance = false;
	var minIndeces = [];
	for (var i = 0 ; i < allies.length ; i++)
	{
		var ally = allies[i];
		var distance = this.tile.getDistance(ally.tile);
		if (minDistance === false || distance < minDistance)
		{
			minDistance = distance;
			minIndeces = [i];
		}
		else if (distance === minDistance)
		{
			minIndeces.push(i);
		}
	}

	//Choose randomly from minIndeces
	var randActorIndex = minIndeces[g.rand.nextInt(0, minIndeces.length)];
	return allies[randActorIndex];
}




Unit.prototype.changeBehavior = function(behavior)
{
	var setVisibleTiles = false;
	if (this.behavior === 'SLEEPING') //If we're waking up, set visible tiles
	{
		setVisibleTiles = true;
	}

	if (behavior === 'CURIOUS')
	{
		this.resetCuriousTimer();
	}
	else if (behavior === 'WANDERING')
	{
		this.lastSawPlayer = false;
		this.lastHeardPlayer = false;
		this.lastHeardRadius = 0;
	}

	this.behavior = behavior;
	
	if (setVisibleTiles)
	{
		this.setVisibleTiles();
	}
}





/*
Unit.prototype.getWeaponInfo = function()
{
	var w = this.equipedWeapon;

	var name;
	var type;
	var damage;
	var range;
	var chance;
	var noise;
	var attackTime;
	var reloadTime;
	var armorPiercing;
	var clipSize;
	var loadedAmmo;
	var spreadAngle;
	var followThrough;
	var knockBack;


	if (w === false)
	{
		name = 'Unarmed';
		type = 'MELEE';
		damage = typeof this.overrides.damage === 'undefined' ? this.strength + this.dexterity : this.overrides.damage;
		range = typeof this.overrides.range === 'undefined' ? 1 : this.overrides.range;
		chance = typeof this.overrides.chance === 'undefined' ? 100 : this.overrides.chance;
		noise = typeof this.overrides.noise === 'undefined' ? 0 : this.overrides.noise;
		attackTime = 3;
		relaodTime = false;
		armorPiercing = false;
		clipSize = false;
		loadedAmmo = false;
		spreadAngle = 0;
		followThrough = 0;
		knockBack = 0;

		return {
			name: 'Unarmed',
			type: 'MELEE',
			damage: damage,
			range: range,
			chance: chance,
			noise: noise,
			attackTime: attackTime,
			reloadTime: reloadTime,
			armorPiercing: armorPiercing,
			clipSize: clipSize,
			loadedAmmo: loadedAmmo,
			spreadAngle: spreadAngle,
			followThrough: followThrough,
			knockBack: knockBack,
		}
	}
	//else if we have a weapon equiped
	var name = w.name;
	var type = w.type;
	var damage = w.damageB + w.damageM * this[w.damageP];
	var range = w.rangeB + w.rangeM * this[w.rangeP];
	var chance;
	if (this.powerModes.trackMovement)
	{
		chance = 100;
	}
	else
	{
		chance = w.chanceB + w.chanceM * this[w.chanceP];
		if (chance > 100)
		{
			chance = 100;
		}
	}
	var noise = w.noiseB - w.noiseM * this[w.noiseP];
	noise = noise < 0 ? 0 : noise;
	var attackTime = w.shootTime;
	var reloadTime = w.reloadTime;
	var armorPiercing = w.armorPiercing;
	var statusEffect = w.statusEffect;
	var statusEffectChance = w.statusEffectChance;
	var clipSize = w.clipSize;
	var loadedAmmo = w.loadedAmmo;
	var spreadAngle = w.spreadAngle;
	var followThrough = w.followThrough;

	return {
		name: name,
		type: type,
		damage: damage,
		range: range,
		chance: chance,
		noise: noise,
		attackTime: attackTime,
		reloadTime: reloadTime,
		armorPiercing: armorPiercing,
		clipSize: clipSize,
		loadedAmmo: loadedAmmo,
		spreadAngle: spreadAngle,
		followThrough: followThrough,
		knockBack: w.knockBack
	}
}
*/


//Returns whether or not this unit can shoot the target tile. Assumes the target tile is within the weapon and view range 
Unit.prototype.canShootTileAssumesInRange = function(targetTile, followThrough)
{
	var inBetweenTiles = this.tile.getTilesBetween(targetTile);
	var l  = inBetweenTiles.length;
	var enemiesGoneThrough = 0; //The number of enemies the line has gone through so far. 
	for (var i = 0 ; i < l ; i++)
	{
		var t = inBetweenTiles[i];
		if (t === this.tile || t === targetTile)
		{
			continue;
		}
		//If there's a wall return false;
		if (t.terrain === "WALL")
		{
			return false;
		}
		if (t.unit)
		{
			if (enemiesGoneThrough >= followThrough)
			{
				return false;
			}
			enemiesGoneThrough++;
		}
	}
	return true;
}





Unit.prototype.canSee = function(tile)
{
	return this.visibleTiles.indexOf(tile) !== -1;
}


/*
//Returns true if the tile is within the line of sight of the unit. Doesn't factor in range
Unit.prototype.isInLineOfSight = function(tile)
{
	var betweenArray = this.getTilesBetween(tile);
	var E = betweenArray.length;
	for (var i = 0 ; i < E ; i++)
	{
		var currTile = betweenArray[i];
		if (currTile === this.tile || currTile === tile){
			continue;
		}
		if (currTile.blocksVision === true)
		{
			return false;
		}
	}
	return true;
}
*/

	

Unit.prototype.isInLineOfSight = function(tile)
{
	var range = this.tile.getRoundDistance(tile);

	for (var j = 0 ; j <= 0 ; j++)
	{
		var betweenArray;
		switch (j)
		{
			case 0:
				betweenArray = this.tile.getTilesBetween(tile);
				//betweenArray = tile.getTilesBetween(this.tile);
				//betweenArray = betweenArray.reverse();
				break;
			/*
			case 1:
				betweenArray = this.tile.getTilesBetweenXY(tile.x + .5, tile.y + .5, range);
				break;
			case 2:
				betweenArray = this.tile.getTilesBetweenXY(tile.x - .5, tile.y + .5, range);
				break;
			case 3:
				betweenArray = this.tile.getTilesBetweenXY(tile.x + .5, tile.y - .5, range);
				break;
			case 4:
				betweenArray = this.tile.getTilesBetweenXY(tile.x - .5, tile.y - .5, range);
				break;
			
			
			case 5:
				betweenArray = this.tile.getTilesBetweenXY(tile.x, tile.y - .5, range);
				break;
			case 6:
				betweenArray = this.tile.getTilesBetweenXY(tile.x, tile.y + .5, range);
				break;
			case 7:
				betweenArray = this.tile.getTilesBetweenXY(tile.x + .5, tile.y, range);
				break;
			case 8:
				betweenArray = this.tile.getTilesBetweenXY(tile.x - .5, tile.y, range);
				break;
				*/
		}
		var canSeeThisArray = true;
		for (var i = 0 ; i < betweenArray.length ; i++)
		{
			var currTile = betweenArray[i];
			if (currTile === tile){
				break;
			}
			if (currTile === this.tile)
			{
				continue;
			}
			if (currTile.blocksVision === true)
			{
				canSeeThisArray = false;
				return false;
				break;
			}

		}

		if (canSeeThisArray)
		{
			return true;
		}
	}

	return false;
	//return canSee;
}







//Returns an array of the tiles between the unit tile and the tile passed as a paramater
Unit.prototype.getTilesBetween = function(tile)
{
	return this.tile.getTilesBetween(tile);
}







Unit.prototype.setVisibleTiles = function()
{
	if (this.state === "SLEEPING")
	{
		this.visibleTiles = [this.tile];
		return;
	}
	//Start by getting all tiles in the circle 
	var circle = [];
	var outerTilesArray;
	var rotationAngle;
	switch (this.direction)
	{
		case 0:
			rotationAngle = "UP";
			break;
		case 1:
			rotationAngle = "RIGHT";
			break;
		case 2:
			rotationAngle = "DOWN";
			break;
		case 3:
			rotationAngle = "LEFT";
			break;
	}
	
	outerTilesArray = this.tile.getTilesWithinCone(rotationAngle, degreesToRadians(this.get('viewAngle')), this.get('viewDistance') + .5);
	//outerTilesArray = this.tile.getCoordsOnConeEdge(rotationAngle, degreesToRadians(this.getViewAngle()), this.getViewDistance());

	//Get all the tiles between
	var visibleTiles = [];
	var E = outerTilesArray.length;
	for (var i = 0 ; i < E ; i++)
	{
		var outerTile = outerTilesArray[i];
		/*
		var outerCoord = outerTilesArray[i];
		var tilesBetween = this.tile.getTilesBetweenXY(outerCoord.x, outerCoord.y, this.getViewDistance());
		for (var j = 0 ; j < tilesBetween.length ; j++)
		{
			var tileBetween = tilesBetween[j];
			if (visibleTiles.indexOf(tileBetween) === -1)
			{
				visibleTiles.push(tileBetween);
			}

			
			if (tileBetween.blocksVision)
			{
				break;
			}
			
		}
		*/
		
		
		if (visibleTiles.indexOf(outerTile) !== -1)
		{
			continue;
		}
		/*
		var tilesInBetween = this.tile.getTilesBetween(outerTile);
		for (var j = 0 ; j < tilesInBetween.length ; j++)
		{
			var tileBetween = tilesInBetween[j];
			if (visibleTiles.indexOf(tileBetween) === -1)
			{
				visibleTiles.push(tileBetween);
			}
			if (tileBetween.blocksVision)
			{
				break;
			}
		}
		*/
		
		if (this.isInLineOfSight(outerTile))
		{
			visibleTiles.push(outerTile);
		}
		
		

	}
	/*
	//Do the surrounding tie thing
	var newVisibleTiles = []; //Tiles to add to visible tiles
	var tilesChecked = [];
	for (var i = 0 ; i < visibleTiles.length ; i++)
	{
		var currTile = visibleTiles[i];
		//Go through the siblings, see if they're not visible. If they have three visible sibs, ste them to visible
		for (var j = 0 ; j < 4 ; j++)
		{
			var sib = currTile.siblings[j];
			if (sib.checked || sib === false)
			{
				continue;
			}
			if (visibleTiles.indexOf(j) !== -1)
			{
				continue;
			}
			//Check sib's siblings to see how many are in visible tiles
			var sibsVisible = 0;
			for (var k = 0 ; k < 4 ; k++)
			{
				var otherSib = sib.siblings[k];
				if (visibleTiles.indexOf(otherSib) !== -1)
				{
					sibsVisible++;
				}
			}
			if (sibsVisible >= 3)
			{
				newVisibleTiles.push(sib);
			}
			sib.checked = true;
			tilesChecked.push(sib);
		}
	}
	visibleTiles = visibleTiles.concat(newVisibleTiles);
	//Uncheck the tile
	for (var i = 0 ; i < tilesChecked.length ; i++)
	{
		tilesChecked[i].checked = false;
	}
	*/
	//Add ourself
	visibleTiles.push(this.tile);
	//Add the tiles to our left and right if they're not added already
	var right = this.tile.siblings[this.getTileIndexRight()];
	var left = this.tile.siblings[this.getTileIndexLeft()];

	if (visibleTiles.indexOf(right) === -1)
	{
		visibleTiles.push(right);
	}
	if (visibleTiles.indexOf(left) === -1)
	{
		visibleTiles.push(left);
	}
	/*
	//Set all tiles in this.visible tiles to true for changed before we change it
	l = this.visibleTiles.length;
	for (var i = 0 ; i < l ; i++)
	{
		this.visibleTiles[i].changed = true;
	}
	*/

	this.visibleTiles = visibleTiles;

	//If it's the player, set the visible tiles to seenbyplayer= true
	if (this === g.game.player)
	{
		var E = this.visibleTiles.length;
		for (var i = 0 ; i < E ; i++)
		{
			//this.visibleTiles[i].changed = true;
			//Set seen by player to true if this unit is the player
			var visT = this.visibleTiles[i];
			visT.seenByPlayer = true;
				
		}
	}
}


Unit.prototype.getTileIndexFront = function()
{
	return this.direction;
}


//Returns the tile to the right of the player
Unit.prototype.getTileIndexRight = function()
{
	var right = this.direction !== 3 ? this.direction + 1 : 0;
	return right;

}

//Returns the tile to the left of the player
Unit.prototype.getTileIndexLeft = function()
{
	var left = this.direction !== 0 ? this.direction - 1 : 3;
	return left;
}

//Returns the tile behind the player
Unit.prototype.getTileIndexBack = function()
{
	if (this.direction > 1)
	{
		return this.direction - 2;
	}
	return this.direction + 2;
}




//Assumes amoutn is >= unit energy
Unit.prototype.reduceEnergy = function(amount)
{
	this.energy -= amount;
}


Unit.prototype.increaseEnergy = function(amount)
{
	this.energy += amount;

	if (this.energy > this.getMaxEnergy())
	{
		this.energy = this.getMaxEnergy();
	}
}


Unit.prototype.increaseHealth = function(amount)
{
	this.health += amount;

	if (this.health > this.getMaxHealth())
	{
		this.health = this.getMaxHealth();
	}
}

//Reduces the unit's health. Doesn't actually process death though
Unit.prototype.reduceHealth = function(amount)
{
	if (g.game.DEBUG.playerInvincible && this===g.game.player){return;}
	this.health -= amount;
	if (this.health < 0.001)
	{
		this.health = 0;
		this.die();
	}
	else
	{
		g.game.tookDamage.push(this);
	}
}


Unit.prototype.get = function(trait)
{
	if (trait === 'strength')
	{
		return this.strength;
	}
	else if (trait === 'dexterity')
	{
		return this.dexterity;
	}
	else if (trait === 'intelligence')
	{
		return this.intelligence;
	}
	else if (trait === 'perception')
	{
		return this.perception;
	}
	else if (trait === 'health')
	{
		return this.getHealth();
	}
	else if (trait === 'maxHealth')
	{
		return this.getMaxHealth();
	}
	else if (trait === 'healthRechargeRate')
	{
		return this.getHealthRechargeRate();
	}
	else if (trait === 'energy')
	{
		return this.getEnergy();
	}
	else if (trait === 'maxEnergy')
	{
		return this.getMaxEnergy();
	}
	else if (trait === 'energyRechargeRate')
	{
		return this.getEnergyRechargeRate();
	}
	else if (trait === 'dodgeChance')
	{
		return this.getDodgeChance();
	}
	else if (trait === 'damageReduction')
	{
		return this.getDamageReduction();
	}
	else if (trait === 'moveNoise')
	{
		return this.getMoveNoise();
	}
	else if (trait === 'moveTime')
	{
		return this.getMoveTime();
	}
	else if (trait === 'visibility')
	{
		return this.getVisibility();
	}
	else if (trait == 'chanceToBeSeen')
	{
		return this.getChanceToBeSeen();
	}
	else if (trait === 'turnTime')
	{
		return this.getTurnTime();
	}
	else if (trait === 'shiftTime')
	{
		return this.getShiftTime();
	}
	else if (trait === 'viewDistance')
	{
		return this.getViewDistance();
	}
	else if (trait === 'viewAngle')
	{
		return this.getViewAngle();
	}
	else if (trait === 'direction')
	{
		return this.direction;
	}
	else if (trait === 'pickUpTime')
	{
		return this.getPickUpTime();
	}
	else if (trait === 'weaponName')
	{
		return this.getWeaponName();
	}
	else if (trait === 'weaponType')
	{
		return this.getWeaponType();
	}
	else if (trait === 'weaponDamage')
	{
		return this.getWeaponDamage();
	}
	else if (trait === 'weaponRange')
	{
		return this.getWeaponRange();
	}
	else if (trait === 'weaponAccuracy')
	{
		return this.getWeaponAccuracy();
	}
	else if (trait === 'weaponNoise')
	{
		return this.getWeaponNoise();
	}
	else if (trait === 'weaponAttackTime')
	{
		return this.getWeaponAttackTime();
	}
	else if (trait === 'weaponReloadTime')
	{
		return this.getWeaponReloadTime();
	}
	else if (trait === 'weaponArmorPiercing')
	{
		return this.getWeaponArmorPiercing();
	}
	else if (trait === 'weaponClipSize')
	{
		return this.getWeaponClipSize();
	}
	else if (trait === 'weaponLoadedAmmo')
	{
		return this.getWeaponLoadedAmmo();
	}
	else if (trait === 'weaponSpreadAngle')
	{
		return this.getWeaponSpreadAngle();
	}
	else if (trait === 'weaponFollowThrough')
	{
		return this.getWeaponFollowThrough();
	}
	else if (trait === 'weaponKnockBack')
	{
		return this.getWeaponKnockBack();
	}
}




Unit.prototype.getStrength = function()
{
	return this.strength;
}

Unit.prototype.getDexterity = function()
{
	return this.dexterity;
}

Unit.prototype.getIntelligence = function()
{
	return this.intelligence;
}

Unit.prototype.getPerception = function()
{
	return this.perception;
}



Unit.prototype.getPickUpTime = function()
{
	return 0;
}


//How visible you are in low light
Unit.prototype.getVisibility = function()
{
	if (g.game.DEBUG.playerVisibility !== false)
	{
		return g.game.DEBUG.playerVisibility;
	}
	var vis = 15 - this.getDexterity(); //Default visibility
	if (this.equipedHelmet)
	{
		vis += this.equipedHelmet.visibilityEffect;
	}
	if (this.equipedArmor)
	{
		vis += this.equipedArmor.visibilityEffect;
	}

	//do the lighting thing if we're not a stalker
	
	
	if (this.tile.light === 'BRIGHT')
	{
		vis *= 2;
	}
	else if (this.tile.light === 'DARK')
	{
		vis /= 2;
		if (this === g.game.player && this.playerRace === 'STALKER')
		{
			vis /= 2;
		}
	}
	

	if (this.powerModes.cloak) //If the cloak is on
	{
		//Get the cloak power
		var power;
		for (var i = 0 ; i < this.powers.length ; i++)
		{
			var currPower = this.powers[i];
			if (currPower.persistantName === 'Cloak')
			{
				power = currPower;
				break;
			}
		}

		var upgrades = power.upgradesActivated;

		switch (upgrades)
		{
			case 0:
				vis /= 2;
				break;
			case 1:
				vis /= 2;
				break;
			case 2:
				vis /= 4;
				break;
			case 3:
				vis /= 10;
				break;
		}
	}
	vis = vis < 1 ? 1 : vis;
	vis = Math.round(vis);
	return vis;
}

/*
//The chance that the player will be seen based on the lighting of the occupied tile and it's visibility
Unit.prototype.getChanceToBeSeen = function()
{
	var vis = this.getVisibility();
	if (this === g.game.player && this.playerRace === 'STALKER')
	{
		vis = vis > 100 ? 100 : vis;
		return vis;
	}
	if (this.tile.light === 'MEDIUM')
	{
		vis *= 2;
	}
	else if (this.tile.light === 'BRIGHT')
	{
		vis *= 3;
	}
	vis = vis > 100 ? 100 : vis;
	return vis;
}
*/


//Returns view angle IN DEGREES
Unit.prototype.getViewAngle = function()
{
	if (this === g.game.player && g.game.DEBUG.playerViewAngle)
	{
		return g.game.DEBUG.playerViewAngle;
	}

	if (typeof this.overrides.viewAngle !== 'undefined')
	{
		return this.overrides.viewAngle;
	}

	var angle = 90 + 10 * this.get('perception');
	if (this.equipedHelmet)
	{
		angle += this.equipedHelmet.viewAngleEffect;
	}

	angle = angle < 90 ? 90 : angle;
	angle = angle > 360 ? 360 : angle;

	return angle;
}


Unit.prototype.getViewDistance = function()
{
	var dist = 10 + this.get('perception');

	if (g.game.DEBUG.setAllViewDistances !== false)
	{
		return g.game.DEBUG.setAllViewDistances;
	}

	if (typeof this.overrides.viewDistance !== 'undefined')
	{
		return this.overrides.viewDistance;
	}

	if (this.equipedHelmet)
	{
		dist += this.equipedHelmet.viewDistanceEffect;
	}

	dist = dist < 1 ? 1 : dist;

	return dist;
}




Unit.prototype.getShiftTime = function()
{
	return Math.round(this.getMoveTime() * 2)
}




//Time it takes to turn 90 degrees
Unit.prototype.getTurnTime = function()
{
	if (g.game.DEBUG.allMoveTimes1)
	{
		return 0;
	}
	return Math.ceil(this.getMoveTime() / 2);
}





Unit.prototype.getMoveTime = function()
{
	if (g.game.DEBUG.allMoveTimes1)
	{
		return 1;
	}
	if (g.game.DEBUG.playerMoveTime1 && this === g.game.player)
	{
		return 1;
	}
	if (this.overrides)
	{
		if (this.overrides.moveTime)
		{
			return this.overrides.moveTime;
		}
	}
	

	var time = g.moveTimes[this.speed];

	if (this.passivePowers.Focus)
	{
		var upgrades = this.getPowerObject('Focus').upgradesActivated;
		if (this.getHealth() < this.getMaxHealth() / 4)
		{
			return 1;
		}
	}

	if (this.stance === "RUNNING")
	{
		time /= 2;
	}
	else if (this.stance === "SNEAKING")
	{
		time *= 2;
	}
	if (this === g.game.player && this.playerRace === 'ADEPT')
	{
		time /= 2;
	}

	time = time < 1 ? 1 : time;

	time = Math.round(time);
	
	return time;
	
}




Unit.prototype.getMoveNoise = function()
{
	if (g.game.DEBUG.playerMoveNoise)
	{
		return g.game.DEBUG.playerMoveNoise;
	}

	if (this.overrides.moveNoise !== false)
	{
		return this.overrides.moveNoise;
	}

	var noise = 20 - 2 * this.get('dexterity');
	if(this.equipedHelmet)
	{
		noise += this.equipedHelmet.moveNoiseEffect;
	}
	if (this.equipedArmor)
	{
		noise += this.equipedArmor.moveNoiseEffect;
	}
	if (this.stance === "RUNNING")
	{
		noise *= 2;
	}
	else if (this.stance === "SNEAKING")
	{
		noise /= 2;
	}
	
	noise = noise < 0 ? 0 : noise;

	return noise;
}


Unit.prototype.getHealth = function()
{
	var health = this.health;
	health = health < 0 ? 0 : health;

	return health;
}

Unit.prototype.getEnergy = function()
{
	var energy = this.energy;
	energy = energy < 0 ? 0 : energy;

	return energy;
}




Unit.prototype.getDodgeChance = function()
{
	//If the player has track movement activated and this isn't the player
	if (g.game.player.powerModes.trackMovement && this !== g.game.player)
	{
		return 0;
	}
	var chance = this.get('dexterity');
	chance *= chance;
	chance /= 3;
	if(this.equipedHelmet)
	{
		chance += this.equipedHelmet.dodgeChanceEffect;
	}
	if (this.equipedArmor)
	{
		chance += this.equipedArmor.dodgeChanceEffect;
	}

	if (this.passivePowers.Focus)
	{
		if (this.getHealth() < this.getMaxHealth() / 2)
		{
			chance *= 2;
		}
	}
	
	chance = chance < 0 ? 0 : chance;
	chance = chance > 99 ? 99 : chance;

	return chance;
}




Unit.prototype.getDamageReduction = function()
{
	var damReduction = 0;
	if (this.equipedHelmet)
	{
		damReduction += this.equipedHelmet.damageReduction;
	}
	if (this.equipedArmor)
	{
		damReduction += this.equipedArmor.damageReduction;
	}
	return damReduction;
}





Unit.prototype.getHealthRechargeRate = function()
{
	var rate = this.get('intelligence') / 10;
	if (this.equipedHelmet)
	{
		rate += this.equipedHelmet.healthRechargeEffect;
	}
	if (this.equipedArmor)
	{
		rate += this.equipedArmor.healthRechargeEffect;
	}
	rate = rate < .1 ? .1 : rate;
	return rate;
}



Unit.prototype.getEnergyRechargeRate = function()
{
	if (this.passivePowers.Focus)
	{
		var upgrades = this.getPowerObject('Focus').upgradesActivated;
		if (this.getHealth() < this.getMaxHealth() / 10)
		{
			return this.getMaxEnergy();
		}
	}

	var rate = (this.get('intelligence')) / 20 + (this.get('perception')) / 20;
	if (this.equipedHelmet)
	{
		rate += this.equipedHelmet.energyRechargeEffect;
	}
	if (this.equipedArmor)
	{
		rate += this.equipedArmor.energyRechargeEffect;
	}
	if (this === g.game.player && this.playerRace === 'HIGHBROW')
	{
		rate *= 2;
	}
	rate = rate < .01 ? .01 : rate;
	return rate;
}





Unit.prototype.getMaxEnergy = function()
{
	var maxEnergy = g.constants.maxEnergyBase + g.constants.maxEnergyMultiplier * this.intelligence;
	if (this.equipedHelmet)
	{
		maxEnergy += this.equipedHelmet.maxEnergyEffect;
	}
	if (this.equipedArmor)
	{
		maxEnergy += this.equipedArmor.maxEnergyEffect;
	}

	return maxEnergy;
}



Unit.prototype.getMaxHealth = function()
{
	if (this.overrides)
	{
		if (this.overrides.maxHealth)
		{
			return this.overrides.maxHealth;
		}
	}
	var maxHealth = g.constants.maxHealthBase + g.constants.maxHealthMultiplier * this.strength;
	if (this.equipedHelmet)
	{
		maxHealth += this.equipedHelmet.maxHealthEffect;
	}
	if (this.equipedArmor)
	{
		maxHealth += this.equipedArmor.maxHealthEffect;
	}
	if (this === g.game.player && this.playerRace === 'BRUTE')
	{
		maxHealth += 100;
	}
	return maxHealth;
}



Unit.prototype.getWeaponName = function()
{
	if (this.equipedWeapon === false)
	{
		return 'Unarmed';
	}

	return this.equipedWeapon.name;
}



Unit.prototype.getWeaponType = function()
{
	if (this.equipedWeapon === false)
	{
		return 'MELEE';
	}

	return this.equipedWeapon.type;
}


Unit.prototype.getWeaponDamage = function()
{
	if (this.overrides.weaponDamage)
	{
		return this.overrides.weaponDamage;
	}

	var damage;

	if (this.equipedWeapon === false)
	{
		 damage = this.get('strength') + this.get('dexterity');
	}
	else
	{
		var w = this.equipedWeapon;
		damage = w.damageB + w.damageM * this[w.damageP];
	}

	if (this.passivePowers.Adrenaline_Meter) //If adrenaline meter is activated
	{
		var power;
		//Get the power
		for (var name in this.powers)
		{
			var currPower = this.powers[name];
			if (currPower.persistantName === 'Adrenaline_Meter')
			{
				power = currPower;
				break;
			}
		}

		var upgrades = power.upgradesActivated;
		var necessaryEnemies = upgrades < 2 ? 3 : 2;
		var surroundingEnemies = 0;
		var sufficientEnemies = false;
		for (var i = 0 ; i < 4 ; i++)
		{
			var sib = this.tile.siblings[i];
			if (sib === false)
			{
				continue;
			}
			if (sib.unit && sib.unit.alignment === 'ENEMY')
			{
				surroundingEnemies++;
			}

			if (surroundingEnemies >= necessaryEnemies)
			{
				sufficientEnemies = true;
				break;
			}
		}

		if (sufficientEnemies)
		{
			var damageMultiplier = upgrades < 1 ? 2 : 3;
			damage *= damageMultiplier;
		}
	}
	
	return damage;
}


Unit.prototype.getWeaponAverageDamagePerTick = function()
{
	var acc = this.getWeaponAccuracy() / 100;
	var dam = this.getWeaponDamage();
	var t = this.getWeaponAttackTime();
	var avg = Math.round(1000 * acc * dam / t) / 1000;

	return avg;
}


Unit.prototype.getWeaponRange = function()
{
	if (this.overrides.weaponRange)
	{
		return this.overrides.weaponRange;
	}

	if (this.equipedWeapon === false)
	{
		return 1;
	}

	var w = this.equipedWeapon;
	var range = w.range;

	return range;
}


Unit.prototype.getWeaponAccuracy = function()
{
	if (this.overrides.weaponAccuracy)
	{
		return this.overrides.weaponAccuracy;
	}

	if (this.equipedWeapon === false)
	{
		return 100;
	}

	var w = this.equipedWeapon;
	var chance;
	if (this.powerModes.trackMovement)
	{
		chance = 100;
	}
	else if (w.type === 'MELEE')
	{
		chance = 100;
	}
	else
	{
		chance = w.chanceB + w.chanceM * this[w.chanceP];
		if (chance > 100)
		{
			chance = 100;
		}
	}

	return chance;
}


Unit.prototype.getWeaponNoise = function()
{
	if (this.overrides.weaponNoise)
	{
		return this.overrides.weaponNoise;
	}

	if (this.equipedWeapon === false)
	{
		return 0;
	}

	var w = this.equipedWeapon;
	var noise = w.noise;
	return noise;
}


Unit.prototype.getWeaponAttackTime = function()
{
	if (this.overrides.weaponAttackTime)
	{
		return this.overrides.weaponAttackTime;
	}

	if (this.equipedWeapon === false)
	{
		return g.moveTimes[this.speed];
	}

	var w = this.equipedWeapon;
	return w.attackTime;
}


Unit.prototype.getWeaponReloadTime = function()
{
	if (this.overrides.weaponReloadTime)
	{
		return this.overrides.weaponReloadTime;
	}

	if (this.equipedWeapon === false || this.equipedWeapon.type === 'MELEE')
	{
		return false;
	}


	if (this.passivePowers.Focus)
	{
		if (this.getHealth() < this.getMaxHealth() / 2)
		{
			var upgrades = this.getPowerObject('Focus').upgradesActivated;
			if (upgrades >= 1)
			{
				return 0;
			}
		}
	}

	return this.equipedWeapon.reloadTime;
}



Unit.prototype.getWeaponArmorPiercing = function()
{
	if (this.overrides.weaponArmorPiercing)
	{
		return this.overrides.weaponArmorPiercing;
	}

	if (this.equipedWeapon === false)
	{
		return 0;
	}

	return this.equipedWeapon.armorPiercing;
}


Unit.prototype.getWeaponClipSize = function()
{
	if (this.overrides.getWeaponClipSize)
	{
		return this.overrides.weaponClipSize;
	}

	if (this.equipedWeapon === false || this.equipedWeapon.type === 'MELEE')
	{
		return false;
	}

	return this.equipedWeapon.clipSize;
}


Unit.prototype.getWeaponLoadedAmmo = function()
{
	if (this.overrides.getWeaponLoadedAmmo)
	{
		return this.overrides.weaponLoadedAmmo;
	}

	if (this.equipedWeapon === false)
	{
		return false;
	}

	return this.equipedWeapon.loadedAmmo;
}


Unit.prototype.getWeaponSpreadAngle = function()
{
	if (this.overrides.weaponSpreadAngle)
	{
		return this.overrides.weaponSpreadAngle;
	}

	if (this.equipedWeapon === false)
	{
		return 0;
	}

	return this.equipedWeapon.spreadAngle;
}


Unit.prototype.getWeaponFollowThrough = function()
{
	if (this.overrides.weaponFollowThrough)
	{
		return this.overrides.weaponFollowThrough;
	}

	if (this.equipedWeapon === false)
	{
		return 0;
	}

	return this.equipedWeapon.followThrough;
}


Unit.prototype.getWeaponFreeShotChance = function()
{
	if (this.equipedWeapon === false || this.equipedWeapon.type === 'MELEE')
	{
		return 0;
	}

	return this.equipedWeapon.freeShotChance;
}


Unit.prototype.getWeaponKnockBack = function()
{
	if (this.overrides.weaponKnockBack)
	{
		return this.overrides.weaponKnockBack;
	}

	if (this.equipedWeapon === false)
	{
		return 0;
	}

	return this.equipedWeapon.knockBack;
}







//Gets the index of the sibling tile representing the first step on the shortest path to the givein target. Treats tiles occupied by units as empty. 
Unit.prototype.getTileOnPathToIgnoreUnits = function(target)
{
	if (target === this.tile)
	{
		return false;
	}
	if (this.tile.siblings.indexOf(target) !== -1) //If the target is right next to this unit
	{
		if ((target.blocksMovement || target.forbidsMovement) && target.unit === false)//Return false if it blocks movement for a reason other than being occupied
		{
			return false;
		}
		
		return this.tile.siblings.indexOf(target); //Else return the index	
	}

	target.pathDistance = 0;
	target.pathFound = true;
	var pathFindingQueue = [target];//The tiles that need to be checked
	var pathFoundTiles = [target]; //The tiles that have been checked
	var reachedUnit = false; //True when the pathfinding thing has reached this unit's tile

	while (reachedUnit === false && pathFindingQueue.length > 0)
	{
		var tile = pathFindingQueue[0];
		var distance = tile.pathDistance;
		//Cycle through the tiles in random order
		var startingIndex = g.rand.nextInt(4, 8);
		var E = tile.siblings.length + startingIndex;
		for (var i = startingIndex ; i < E ; i++)
		{
			var index = i % 4;
			var sib = tile.siblings[index];
			
			if (sib == this.tile)
			{
				reachedUnit = true;
				continue;
			}
			
			if ((sib.blocksMovement || sib.forbidsMovement) && sib.unit === false)
			{
				continue;
			}
			if (sib.pathFound)//If the sibling has been pathFound 
			{
				if (sib.pathDistance > distance + 1)//the distance is greater than the distance of tile + 1
				{
					sib.pathDistance = distance + 1;
					pathFindingQueue.push(sib);
				}
			}
			else
			{
				sib.pathDistance = distance + 1;
				sib.pathFound = true;
				pathFoundTiles.push(sib);
				pathFindingQueue.push(sib);
			}
		}
		if (reachedUnit)
		{
			break;
		}
		//Pop the tile
		pathFindingQueue.splice(0, 1);
	}
	//Get the index of the best sibling
	var shortestDistance = false;
	var shortestDistanceIndex = false; //Will return false if it's not set
	//Cycle through randomly, because the first one with the shortest distance will be selected
	var startIndex = g.rand.nextInt(4, 8);
	var E = this.tile.siblings.length + startIndex;
	for (var ind = startIndex ; ind < E ; ind++)
	{
		var i = ind % 4;
		var sib = this.tile.siblings[i];
		if (sib.pathFound === false)
		{
			continue;
		}
		if (shortestDistance === false || sib.pathDistance < shortestDistance)
		{
			shortestDistance = sib.pathDistance;
			shortestDistanceIndex = i;
		}
	}


	//Clear the path finding array
	if (g.game.DEBUG.showPathDistance === false)
	{
		var E = pathFoundTiles.length;
		for (var i = 0 ; i < E ; i++)
		{
			var t = pathFoundTiles[i];
			t.pathFound = false;
			t.pathDistance = false;
		}
	}

	return shortestDistanceIndex;
}




//Returns the INDEX of the sibling tile representing the first step on the shortest path to the given target
Unit.prototype.getTileOnPathTo = function(target)
{
	if (target === false)
	{
		//console.log(arguments.callee.caller.toString());
	}

	if (target === this.tile)
	{
		return false;
	}
	if (this.tile.siblings.indexOf(target) !== -1) //If the target is right next to this unit
	{
		if (target.blocksMovement || target.forbidsMovement)//Return false if it blocks movement
		{
			return false;
		}
		
		return this.tile.siblings.indexOf(target);; //Else return the index	
	}

	target.pathDistance = 0;
	target.pathFound = true;
	var pathFindingQueue = [target];//The tiles that need to be checked
	var pathFoundTiles = [target]; //The tiles that have been checked
	var reachedUnit = false; //True when the pathfinding thing has reached this unit's tile

	while (reachedUnit === false && pathFindingQueue.length > 0)
	{
		var tile = pathFindingQueue[0];
		/*
		if (tile === this.tile)
		{
			break;
		}
		*/
		//DEBUG TEST
		if (typeof tile === 'undefined')
		{
			console.log('broken: ' + target);
			g.view.set();
		}
		//DEBUG TEST
		var distance = tile.pathDistance;
		//Cycle through the tiles in random order
		var startingIndex = g.rand.nextInt(4, 8);
		var E = tile.siblings.length + startingIndex;
		for (var i = startingIndex ; i < E ; i++)
		{
			var index = i % 4;
			var sib = tile.siblings[index];
			
			if (sib == this.tile)
			{
				reachedUnit = true;
				continue;
			}
			
			if (sib.blocksMovement || sib.forbidsMovement)
			{
				continue;
			}
			if (sib.pathFound)//If the sibling has been pathFound 
			{
				if (sib.pathDistance > distance + 1)//the distance is greater than the distance of tile + 1
				{
					sib.pathDistance = distance + 1;
					pathFindingQueue.push(sib);
				}
			}
			else
			{
				sib.pathDistance = distance + 1;
				sib.pathFound = true;
				pathFoundTiles.push(sib);
				pathFindingQueue.push(sib);
			}
		}
		if (reachedUnit)
		{
			break;
		}
		//Pop the tile
		pathFindingQueue.splice(0, 1);
	}
	//Get the index of the best sibling
	var shortestDistance = false;
	var shortestDistanceIndex = false; //Will return false if it's not set
	//Cycle through randomly, because the first one with the shortest distance will be selected
	var startIndex = g.rand.nextInt(4, 8);
	var cutoff = this.tile.siblings.length + startIndex;
	for (var ind = startIndex ; ind < cutoff ; ind++)
	{
		var i = ind % 4;
		var sib = this.tile.siblings[i];
		if (sib.pathFound === false)
		{
			continue;
		}
		if (shortestDistance === false || sib.pathDistance < shortestDistance)
		{
			shortestDistance = sib.pathDistance;
			shortestDistanceIndex = i;
		}
	}


	//Clear the path finding array
	if (g.game.DEBUG.showPathDistance === false)
	{
		var l = pathFoundTiles.length;
		for (var i = 0 ; i < l ; i++)
		{
			var t = pathFoundTiles[i];
			t.pathFound = false;
			t.pathDistance = false;
		}
	}


	return shortestDistanceIndex;
}






Unit.prototype.initialize = function(tile, behavior)
{
	this.tile = tile;
	this.tile.setUnit(this);
	this.direction = g.rand.nextInt(0, 4);
	this.behavior = behavior;
	if (behavior === 'ALLY')
	{
		this.alignment = 'ALLY';
	}

	this.health = this.get('maxHealth');
	this.energy = this.get('maxEnergy');

	this.setVisibleTiles();

	if (this.equipedWeapon !== false)
	{
		this.equipedWeapon.initialize(false);
	}

	if (this.powers.length > 0)
	{
		for (var i = 0 ; i < this.powers.length ; i++)
		{
			this.powers[i].initialize(this);
			//this.powers[i].upgrade();
			//this.powers[i].upgrade();
		}
	}

	//If it's a lumen droid, reset the lighting
	if (this.enemyType === "LUMENDROID")
	{
		this.setSurroundingLighting();
	}
}



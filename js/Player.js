
function Player(playerRace, playerClass)
{

	this.overrides = {
		//viewDistance: 10,
	}


	this.type = "PLAYER";

	this.playerRace = playerRace;
	this.playerClass = playerClass;


	this.strength = 0;
	this.dexterity = 0;
	this.intelligence = 0;
	this.perception = 0;

	this.noiseToPropogate = 0; //This noise gets propogated every iteration. So when the player moves, if it takes ten turns to move, it gets propogated all ten turns.


	this.equipedWeapon;
	this.equipment = [];

	if (g.game.DEBUG.playerStartingWeapon)
	{
		this.equipedWeapon = g.game.DEBUG.playerStartingWeapon;

		this.equipment[0] = this.equipedWeapon;
	}
	

	this.powers = [new Power('blink'), new Power('push'), new Power('shock'), 
				new Power('slowTime'), new Power('conjureZombie'), new Power('cloak'), 
				new Power('adrenalineMeter'), new Power('focus'), new Power('heal')]; //Array of power objects

	this.stance = "WALKING"; //Walking, running, sneaking

	this.tilesAimedAt = []; //The cone or line of tiles currently aimed at
	this.actorsAimedAt = [];//The actors that will be hit if the player attacks
	this.wallsAimedAt = [];

	this.tilesAimedAtPower = []; //The tiles aimed at when aiming a power
	this.actorsAimedAtPower = []; //The actors that a power will affect
	this.wallsAimedAtPower = [];

	this.alignment = 'PLAYER';
	/*
	this.timers = {//Object representing how long certain powers will last for, like freeze time
		freezeTime: 0,
	}
	*/
}

Player.prototype = new Unit();



Player.prototype.move = function(directionIndex)
{
	var timeTaken = 0;
	var movingTo = this.tile.siblings[directionIndex];
	var canMoveTo = true;;
	if (movingTo === false)//If the tile doesn't have a sibling
	{
		canMoveTo = false;
	}
	else if ((movingTo.blocksMovement || movingTo.forbidsMovement)&& movingTo.unit.alignment !== "ALLY") //If the tile blocks movement and it's not an ally tile
	{
		canMoveTo = false;
	}

	if (directionIndex !== this.direction)//If we have to turn to move
	{
		timeTaken += this.turn(directionIndex, !canMoveTo); //Only reset visible tiles if we're just turning and not moving
	}
	if (canMoveTo === false){
		return timeTaken;
	}


	//If we're switching places with an ally, move the ally to our old spot
	if (movingTo.unit.alignment === "ALLY")
	{
		g.game.transportUnit(movingTo.unit, this.tile);
		this.tile = movingTo;
		this.tile.setUnit(this);
	}
	else
	{
		this.tile.setUnit(false);
		this.tile = movingTo;
		this.tile.setUnit(this);
	}


	//this.tile.propogateNoise(this.get('moveNoise'));
	this.noiseToPropogate = this.get('moveNoise');

	//this.direction = directionIndex;
	//Player will be turned
	this.setVisibleTiles();
	timeTaken += this.getMoveTime();
	if (this.tile.terrain === 'STAIRSDOWN')
	{
		g.game.playerDescend();
	}
	else if (this.tile.terrain === 'ORB')
	{
		g.game.playerCollectOrb();
	}

	if (this.tile.item)
	{
		g.game.playerPickUp();
	}

	if (this.tile.message)
	{
		g.game.displayTutorialMessage(this.tile.message);
	}

	return timeTaken;
}


//Returns the amount of time it took to turn
Player.prototype.turn = function(directionIndex, setVisibleTiles)
{

	var timeTakenM = Math.abs(Number(directionIndex) - Number(this.direction));
	timeTakenM = timeTakenM === 3 ? 1 : timeTakenM;
	var timeTaken = timeTakenM * this.getTurnTime();
	this.direction = directionIndex;

	if (setVisibleTiles) //Visible tiles won't be set if we're moving because they'll be set after we move
	{
		this.setVisibleTiles();
	}

	return timeTaken;
}


Player.prototype.shift = function(directionIndex)
{
	var movingTo = this.tile.siblings[directionIndex];
	if (movingTo === false || movingTo.blocksMovement)
	{
		return false;
	}
	this.tile.setUnit(false);
	this.tile = movingTo;
	this.tile.setUnit(this);
	//this.tile.propogateNoise(this.moveNoise);	
	this.noiseToPropogate = this.get('moveNoise');
	this.setVisibleTiles();
	return true;
}



Player.prototype.pickUp = function()
{
	var item = this.tile.item;
	this.equipment.push(item);
	this.noiseToPropogate = 0;
}




//Makes the player attack any actors in the actorsAimedAt array
/*
Player.prototype.attack = function()
{

	for (pName in this.powers)
	{
		if (pName === 'getRandomElement' || pName === 'getRandomElements')
		{
			continue;
		}
		var power = this.powers[pName];
		if (power.atts.powerType === "SUSTAINED" && power.atts.drainsDuring.indexOf("ATTACK") !== -1) //If it's an on off power, and it drains energy during each time unit
		{
			if (power.currentlyActivated)
			{
				var energyToDrain = power.atts.energyConsumption;
				if (energyToDrain > this.get('energy')) //If we don't have enough energy
				{
					power.activate();
				}
				else
				{
					this.reduceEnergy(energyToDrain);
				}
			}
		}
	}

	this.noiseToPropogate = this.get('weaponNoise');
	//Assumes target is in range and we're not out of ammo
	if (this.get('weaponClipSize'))
	{
		this.equipedWeapon.loadedAmmo--;
	}
	
	for (var i = 0 ; i < this.actorsAimedAt.length ; i++)
	{
		var unit = this.actorsAimedAt[i];
		var targetTile = unit.tile;
		var enemyText = unit.enemyText;
		if (g.rand.next(0, 100) <= this.get('weaponAccuracy'))
		{

			var message;
			//See which side was hit based on what sibling tile of the target this unit is closest to
			var front = targetTile.siblings[unit.getTileIndexFront()];
			var right = targetTile.siblings[unit.getTileIndexRight()];
			var left = targetTile.siblings[unit.getTileIndexLeft()];
			var back = targetTile.siblings[unit.getTileIndexBack()];
			var directions = [front, right, left, back]; //This order matters. Whichever the first one to be the closest one is will win. 
			var directionStrings = ['FRONT', 'RIGHT', 'LEFT', 'BACK'];
			var minDistance = this.tile.getDistance(front); //Default to distance from front
			var minDistanceIndex = 0; //Default to front
			for (var dirInd = 0 ; dirInd < directions.length ; dirInd++)
			{
				var d = this.tile.getDistance(directions[dirInd]);
				if (d < minDistance)
				{
					minDistance = d;
					minDistanceIndex = dirInd;
				}
			}
			var result = unit.receiveAttack(this.get('weaponDamage'), directionStrings[minDistanceIndex]);
			if (result === 'HIT')
			{
				if (this.get('weaponKnockBack') !== 0)
				{
					var kB = this.get('weaponKnockBack')
					for (var kBNum = 0 ; kBNum < kB ; kBNum++)
					{
						var succesful = this.knockBackUnit(unit);
						if (succesful === false)
						{
							break;
						}
					}
				}

				message = 'You inflict ' + this.get('weaponDamage') + ' damage on the ' + enemyText + '.';

			}
			else if (result === 'MISS')
			{
				message = 'The ' + enemyText + ' dodged your attack.'; 
			}
			else if (result === 'KILL')
			{
				message = 'You kill the ' + enemyText + '.';
				unit.dead = true;
			}
			g.view.logMessage(message);
		}
		else //if it's a miss
		{
			g.view.logMessage('You miss the ' + enemyText + '.');
		}
	}
	//Attack all the walls
	var wallsWereDestroyed = false; //If true, it will reset visible tiles.
	for (var i = 0 ; i < this.wallsAimedAt.length ; i++)
	{
		var wall = this.wallsAimedAt[i];
		//Get chance to hit
		var dam = this.get('weaponDamage');
		if (g.rand.next(0, 100) < dam)//If random is less than damage, destroy the wall
		{
			wall.setTerrain('OPEN');
			wallsWereDestroyed = true;
		}
	}

	//If walls were destroyed, reset visible tiles
	if (wallsWereDestroyed)
	{
		this.setVisibleTiles();
	}

	g.view.setEnemyDivMain();
}
*/


Player.prototype.attack = function()
{

	if (this.getWeaponLoadedAmmo() === 0)
	{
		g.view.logAlert('You need to reload.');
		return;
	}
	//Reduce ammo
	if (this.getWeaponClipSize() !== false)
	{
		this.equipedWeapon.loadedAmmo--;
	}

	for (pName in this.powers)
	{
		var power = this.powers[pName];
		if (power.atts.powerType === "SUSTAINED" && power.atts.drainsDuring.indexOf("ATTACK") !== -1) //If it's an on off power, and it drains energy during each time unit
		{
			if (power.currentlyActivated)
			{
				var energyToDrain = power.atts.energyConsumption;
				if (energyToDrain > this.get('energy')) //If we don't have enough energy
				{
					power.activate();
				}
				else
				{
					this.reduceEnergy(energyToDrain);
				}
			}
		}
	}



	for (var i = 0 ; i < this.actorsAimedAt.length ; i++)
	{
		var actor = this.actorsAimedAt[i];
		g.game.processAttack(this, actor.tile);
	}

	for (var i = 0 ; i < this.wallsAimedAt.length ; i++)
	{
		var w = this.wallsAimedAt[i];
		g.game.processAttack(this, w);
	}

}






Player.prototype.wait = function()
{
	this.noiseToPropogate = 0;
}




Player.prototype.resetHealthAndEnergy = function()
{
	if (this.health > this.getMaxHealth())
	{
		this.health = this.getMaxHealth();
	}
	if (this.energy > this.getMaxEnergy())
	{
		this.energy = this.getMaxEnergy();
	}
}



/*
Player.prototype.isInLineOfSight = function(tile)
{
	var range = this.tile.getRoundDistance(tile);

	for (var j = 0 ; j < 8 ; j++)
	{
		var betweenArray;
		switch (j)
		{
			case 0:
				betweenArray = this.tile.getTilesBetween(tile);
				break;
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
		}
		var canSeeThisArray = true;
		for (var i = 0 ; i < betweenArray.length ; i++)
		{
			var currTile = betweenArray[i];
			if (currTile === this.tile || currTile === tile){
				continue;
			}
			if (currTile.blocksVision === true)
			{
				canSeeThisArray = false;
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
*/




Player.prototype.canSeeEnemy = function()
{
	for (var i = 0 ; i < this.visibleTiles.length ; i++)
	{
		var t = this.visibleTiles[i];
		if (t.unit === false)
		{
			continue;
		}		
		if (t.unit.alignment === 'ENEMY')
		{
			return true;
		}
	}

	return false;
}




Player.prototype.elapseTime = function()
{
	//TEST
	/*
	for (var i = 0 ; i < 4 ; i++)
	{
		var sib = this.tile.siblings[i];
		console.log(sib.noise);
	}
	*/
	//TEST

	if (this.dead)
	{
		return;
	}	
	//For all the powers, see if any are currentlyActivated. If so, drain your energy, or deactivate them if you don't have enough energy
	for (pName in this.powers)
	{
		var power = this.powers[pName];
		if (typeof power.currentlyActivated !== 'undefined' && power.atts.drainsDuring === 'ALWAYS') //If it's an on off power, and it drains energy during each time unit
		{
			if (power.currentlyActivated)
			{
				var energyToDrain = power.atts.energyConsumption;
				if (energyToDrain > this.get('energy')) //If we don't have enough energy
				{
					power.activate();
					g.view.setEquipmentMainDiv();
					g.view.setPowersMainDiv();
				}
				else{
					this.reduceEnergy(energyToDrain);
				}
			}
		}
	}

	//recharge health and rechard energy
	if (this.get('health') < this.get('maxHealth'))
	{
		this.health += this.get('healthRechargeRate');
		if (this.health > this.get('maxHealth'))
		{
			this.health = this.get('maxHealth');
		}
	}
	if (this.get('energy') < this.get('maxEnergy'))
	{
		this.energy += this.get('energyRechargeRate');
		if (this.energy > this.get('maxEnergy'))
		{
			this.energy = this.get('maxEnergy');
		}
	}
	//Propogate noise
	if (g.game.DEBUG.playerSilent)//Don't propogate any noise if the playerSilent debug feature is on
	{
		return;
	}
	this.tile.propogateNoise(this.noiseToPropogate);
}




Player.prototype.setPowerAim = function()
{
	var p = this.powers[g.game.selectedPower];
	this.setTilesAimedAtPower();
	if (p.atts.affectsEnemies)
	{
		this.setActorsAimedAtPower();
	}
}



Player.prototype.setTilesAimedAtPower = function()
{
	var power = this.powers[g.game.selectedPower];
	var directionAngle = this.tile.getAngleFromTile(g.game.selectedTile);
	var spreadAngle = degreesToRadians(power.atts.spreadAngle);
	var distance = this.tile.getDistance(g.game.selectedTile);
	var tilesInBetween = this.tile.getTilesWithinCone(directionAngle, spreadAngle, distance);
	/*
	if (tilesInBetween.indexOf(g.game.selectedTile) === -1)
	{
		tilesInBetween.push(g.game.selectedTile);
	}
	*/
	this.tilesAimedAtPower = tilesInBetween;

}


Player.prototype.setActorsAimedAtPower = function()
{
	var power = this.powers[g.game.selectedPower];
	var spreadAngle = degreesToRadians(power.atts.spreadAngle);
	if (spreadAngle === 0)
	{
		if (g.game.selectedTile.unit !== false)
		{
			if (!(power.persistantName === 'Shock' && power.upgradesActivated >= 2))
			{
				this.actorsAimedAtPower = [g.game.selectedTile.unit];
			}
			else //If it is shock, add all the enemies
			{
				this.actorsAimedAtPower = [];
				var aimedAtQueue = [g.game.selectedTile.unit];

				while (aimedAtQueue.length > 0)
				{
					var currActor = aimedAtQueue[0];
					this.actorsAimedAtPower.push(currActor);
					this.tilesAimedAtPower.push(currActor.tile);

					for (var i = 0 ; i < 4 ; i++)
					{
						var sib = currActor.tile.siblings[i];
						if (sib.unit === false)
						{
							continue;
						}
						if (sib.unit === this) //Shock doesn't affect the player
						{
							continue;
						}
						//If the sib has already been processed
						if (this.actorsAimedAtPower.indexOf(sib.unit) !== -1 || aimedAtQueue.indexOf(sib.unit) !== -1)
						{
							continue;
						}

						aimedAtQueue.push(sib.unit);
					}

					//Pop curr actor
					aimedAtQueue.splice(0, 1);
				}
			}
		}
		else
		{
			this.actorsAimedAtPower = [];
		}
	}
	else if (power.atts.affectsAllEnemiesAimedAt) //If it affects all the actors aimed at in the cone
	{
		var actorsAimedAt = []
		for (var i = 0 ; i < this.tilesAimedAtPower.length ; i++)
		{
			var t = this.tilesAimedAtPower[i];
			if (t.unit !== false && t.unit !== this)
			{
				actorsAimedAt.push(t.unit);
			}
		}
		this.actorsAimedAtPower = actorsAimedAt;
	}
	else //If it only affects the single actor aimed at
	{
		var t = g.game.selectedTile;
		if (t.unit !== false)
		{
			this.actorsAimedAt = [t.unit];
		}
	}
}


Player.prototype.setAim = function()
{
	this.setTilesAimedAt();
	this.setActorsAndWallsAimedAt();
}




//Sets all the tiles in the cone that the player is aiming at
//Will set a line if the weapon doesn't have spread
Player.prototype.setTilesAimedAt = function()
{

	var directionAngle = this.tile.getAngleFromTile(g.game.selectedTile);
	var spreadAngle = degreesToRadians(this.get('weaponSpreadAngle'));
	var tilesInBetween = this.tile.getTilesWithinCone(directionAngle, spreadAngle, this.getWeaponRange());
	var tilesAimedAt = [];
	
	if (spreadAngle === 0)
	{
		var followThrough = this.getWeaponFollowThrough();
		var enemiesGoneThrough = 0;

		for (var i = 0 ; i < tilesInBetween.length ; i++)
		{

			if (enemiesGoneThrough > followThrough)
			{
				break;
			}

			var tile = tilesInBetween[i];
			if (tile === this.tile)
			{
				continue;
			}
			if (this.canSee(tile) === false)
			{
				continue;
			}

			tilesAimedAt.push(tile);

			if (tile.terrain === 'WALL')
			{
				break;
			}
			if (tile.unit)
			{
				enemiesGoneThrough++;
			}
		}
	}
	else
	{
		for (var i = 0 ; i < tilesInBetween.length ; i++)
		{
			var tile = tilesInBetween[i];
			if (tile === this.tile)
			{
				continue;
			}
			if (this.canSee(tile) === false)
			{
				continue;
			}


			if (this.canShootTileAssumesInRange(tile, this.getWeaponFollowThrough()))
			{
				tilesAimedAt.push(tile);
			}
		}
	}

	this.tilesAimedAt = tilesAimedAt;
	//this.tilesAimedAt = tilesInBetween;
}


//Sets the actors aimed at array with all the actors the player could hit right now.
Player.prototype.setActorsAndWallsAimedAt = function()
{
	this.actorsAimedAt = [];
	this.wallsAimedAt = [];
	var spreadAngle = this.getWeaponSpreadAngle();
	var followThrough = this.getWeaponFollowThrough();

	if (spreadAngle === 0)
	{
		var enemiesGoneThrough = 0;
		for (var i = 0 ; i < this.tilesAimedAt.length ; i++)
		{
			if (enemiesGoneThrough > followThrough)
			{
				break;
			}
			var tile = this.tilesAimedAt[i];
			if (tile.unit === false && tile.terrain !== "WALL") //If there's no unit and now wall at the tile
			{
				continue;
			}
			if (tile.unit === this)
			{
				continue;
			}
			if (tile.terrain === 'WALL' && tile.destructable)
			{
				this.wallsAimedAt.push(tile);
				break;
			}
			if (tile.unit)
			{
				this.actorsAimedAt.push(tile.unit);
				enemiesGoneThrough++;
			}
		}
	}
	else
	{
		for (var i = 0 ; i < this.tilesAimedAt.length ; i++)
		{
			var tile = this.tilesAimedAt[i];
			if (tile.unit === false && tile.terrain !== "WALL") //If there's no unit and now wall at the tile
			{
				continue;
			}
			if (tile.unit === this)
			{
				continue;
			}
			if (tile.unit && this.canShootTileAssumesInRange(tile, this.get('weaponFollowThrough')))//If theres an actor there and tile isn't blocked by another actor
			{
				this.actorsAimedAt.push(tile.unit);
			}
			if (tile.terrain === "WALL" && this.canShootTileAssumesInRange(tile, this.get('weaponFollowThrough')) && tile.destructable)//If it's a wall that we can shoot, and it's not indestructable
			{
				this.wallsAimedAt.push(tile);
			}
		}
	}
} 






//REturns true if an enemy standing at 'tile' could see the player
Player.prototype.isVisibleFromTile = function(tile)
{
	//If the tile isn't in line of sight, return false
	if (this.isInLineOfSight(tile) === false)
	{
		return false;
	}

	var distance = this.tile.getRoundDistance(tile);

	return distance <= this.getVisibility();
}



//Returns false if the player doesn't have that power
Player.prototype.getPowerObject = function(powerName)
{
	for (var pName in this.powers)
	{
		var power = this.powers[pName];
		if (power.name === powerName || power.persistantName === powerName)
		{
			return power;
		}
	}
	return false;
}





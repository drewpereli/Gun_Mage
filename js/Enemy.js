

function Enemy()
{
	//this.listeners = [0, 0, 0, 0]; //Corresponds to up, right, down, left. Each number represent how many times that tile was the loudest during a listen()
	//this.lastSawPlayer = false;
	//this.lastSawRadius = 1; //Hard coded. If we're within this distance, we can see the tile where we last saw the player and the player isn't there, use a different strategy
	this.lastHeardPlayerAt = false; //The tile that the unit last heard the player.
	this.lastHeardRadius = false; //The radius of the general area that the enemy last heard the player. The closer the sound was, the smaller the radius is. 
	this.timeSpentCurious = 0;//How many iterations this unit has spent curious
	this.minTimeSpentCurious = 30; // Default val. the minimum amount of time the unit needs to be curious before it has a chance to wander


	this.chanceToSleepWhenWandering = .001; //Default value
	this.chanceToWanderWhenCurious = .01; //Defualt value

	this.alignment = 'ENEMY';

	this.sawPlayerLastTick = false;

	this.overrides = {
		viewAngle: 180,
	}

}

Enemy.prototype = new Unit();





//Returns true if heard loud noise, else returns false
Enemy.prototype.listen = function()
{
	var n = this.tile.noise;
	//Each level of noise is an additional 1% chance to wake up
	if (n > 0)//If the unit heard the noise
	{
		this.lastHeardPlayerAt = g.game.player.tile;
		this.lastHeardRadius = Math.round(Math.sqrt(this.tile.getDistance(g.game.player.tile)));
		/*
		//Time spent curious is reset in changeBehavior
		if (this.behavior !== 'HOSTILE')
		{
			this.changeBehavior('CURIOUS');
		}
		*/
		return true;
	}

	return false;
}






Enemy.prototype.moveTowardsLastHeard = function()
{
	this.moveTowards(this.lastHeardPlayer);
}




Enemy.prototype.moveRandomlyWithinLastHeardRadius = function()
{
	//Cycle through each sibling. Move to any one that's within the noise radius
	var startingIndex = g.rand.nextInt(4, 8);
	for (var ind = startingIndex ; ind < this.tile.siblings.length + startingIndex ; ind++)
	{
		var i = ind % 4;
		var sib = this.tile.siblings[i];
		if (sib.blocksMovement === false) //If the sibling doesn't block movement
		{
			var distanceToLastHeard = sib.getDistance(this.lastHeardPlayer);
			if (distanceToLastHeard <= this.lastHeardRadius) //If it's within the last heard radius
			{
				this.move(i); //Move to the sibling
				return;
			}
		}
	}
}




//Returns true if the player is in the range of attack
Enemy.prototype.playerInAttackRange = function()
{
	var range = this.get('weaponRange');
	var distanceToPlayer = this.tile.getDistance(g.game.player.tile);
	return range >= distanceToPlayer;
}






Enemy.prototype.heardPlayer = function()
{
	if (this.lastHeardPlayer !== false)
	{
		return true;
	}
	return false;
}





Enemy.prototype.withinLastHeardRadius = function()
{
	var distanceFromLastHeard = this.tile.getDistance(this.lastHeardPlayer);

	return distanceFromLastHeard <= this.lastHeardRadius;
}





Enemy.prototype.resetCuriousTimer = function()
{
	this.timeSpentCurious = 0;
}







Enemy.prototype.act = function()
{
	if (this.behavior === 'SLEEPING')
	{
		var heardLoudNoise = this.listen();
		if (heardLoudNoise)
		{
			this.changeBehavior('CURIOUS');
		}
	}
	else
	{
		if (this.canSeeHostileUnit())
		{
			if (this.canSeePlayer())
			{
				this.sawPlayerLastTick = true;
			}
			else
			{
				this.sawPlayerLastTick = false;
			}

			this.changeBehavior('HOSTILE');
			var closestHostileUnit = this.getClosestHostileUnitInView();
			var distanceToHostileUnit;
			if (this.enemyType === 'SECURITYDRONE')
			{
				distanceToHostileUnit = this.tile.getRoundDistance(closestHostileUnit.tile); 
			}

			if (this.enemyType === 'SECURITYDRONE' && distanceToHostileUnit < this.get('weaponRange'))
			{
				if (g.rand.next(0, 1) < this.chanceToRunWhenCloseToEnemy) //If if we're running
				{
					//Find the sibling tile that maximizes the distance from the player
					var maxDistance = false;
					var maxDistanceIndex;
					var startingIndex = g.rand.nextInt(0, 4);
					for (var ind = startingIndex ; ind < startingIndex + 4 ; ind++)
					{
						var i = ind % 4;
						var sib = this.tile.siblings[i];
						if (sib.terrain !== "OPEN" || sib.blocksMovement)
						{
							continue;
						}
						var currDistance = sib.getDistance(closestHostileUnit.tile);
						if (maxDistance === false || currDistance > maxDistance)
						{
							maxDistance = currDistance;
							maxDistanceIndex = i;
						}
					}
					//Move to the tile corresponding to max index
					this.move(maxDistanceIndex);
				}
				else //else attack
				{
					this.attack(closestHostileUnit.tile)
				}
			}
			else if (this.unitWithinAttackRange(closestHostileUnit))
			{
				this.attack(closestHostileUnit.tile);
			}
			else
			{
				this.moveTowards(closestHostileUnit.tile);
			}
		}
		else //If we can't see any hostile units
		{
			if (this.behavior === 'HOSTILE')
			{
				this.changeBehavior('CURIOUS');
			}
			var heardLoudNoise = this.listen();
			if (heardLoudNoise)
			{
				this.changeBehavior('CURIOUS');

				var distanceFromNoise = this.tile.getDistance(this.lastHeardPlayerAt);
				if (distanceFromNoise <= this.lastHeardRadius)
				{
					this.moveRandomly();
				}
				else
				{
					this.moveTowards(this.lastHeardPlayerAt);
				}
			}
			else //If we haven't heard a noise recently
			{
				if (this.behavior === 'CURIOUS')
				{
					this.timeSpentCurious++;
					if (this.lastHeardPlayerAt !== false)
					{	
						var distanceFromNoise = this.tile.getDistance(this.lastHeardPlayerAt);
						if (distanceFromNoise <= this.lastHeardRadius)
						{
							this.moveRandomly();
						}
						else
						{
							this.moveTowards(this.lastHeardPlayerAt);
						}
					}
					else //Else if we haven't heard the player but we've seen them recently
					{
						this.moveRandomly();
					}
					if (this.timeSpentCurious >= this.minTimeSpentCurious)
					{
						if (g.rand.next(0, 1) < this.chanceToWanderWhenCurious)
						{
							this.changeBehavior('WANDERING')
						}
					}
				}
				else //Else, we're wandering
				{
					this.moveRandomly();
					if (g.rand.next(0, 1) < this.chanceToSleepWhenWandering)
					{
						this.changeBehavior('SLEEPING');
					}
				}
			}
		}
	}
}













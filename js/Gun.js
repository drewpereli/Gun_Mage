

function Gun()
{
	this.type = "GUN";

	this.name;
	this.clipSize;
	this.reloadTime;
	this.followThrough = 0;
	this.knockBack = 0;
	this.spreadAngle = 0;

	this.freeShotChance = 0;

	this.loadedAmmo;

	this.shootSound;

}

Gun.prototype = new Item();


Gun.prototype.reload = function()
{
	this.loadedAmmo = this.clipSize;
}

Gun.prototype.initialize = function(tile)
{
	//Get level of exceptionalness
	var rand = g.rand.next(0, 1);
	var rarity;
	var originalName = this.name;
	for (var i = 0 ; i < g.itemRarityProbabilities.length ; i++)
	{
		var prob = g.itemRarityProbabilities[i];
		if (rand >= prob.min && rand < prob.max)
		{
			rarity = g.itemRarityNames[i];
		}
	}
	if (rarity !== 'REGULAR')
	{
		
		//Get bonus
		var bonus;
		do
		{
			bonus = getRandomElement(g.possibleGunBonuses);
		}
		while ((this.subtype === 'PISTOL' || this.subtype === 'ASSUALTRIFLE') && bonus === 'Quickness') //Don't want a pistol or assault rifle of quickness, because those are already quick weapons 
		
		var multiplier = g.itemBonusMultipliers[rarity];
		this.name = originalName + ' of ' + rarity + ' ' + bonus;

		if (bonus === 'Damage')
		{
			this.damageM = Math.round(this.damageM * multiplier);
		}
		else if (bonus === 'Accuracy')
		{
			this.chanceM = Math.round(this.chanceM * multiplier);
		}
		else if (bonus === 'Quickness')
		{
			this.attackTime = Math.ceil(this.attackTime / multiplier);
		}
		else if (bonus === 'Range')
		{
			this.range = Math.round(this.range * multiplier);
		}
		else if (bonus === 'Capacity')
		{
			this.clipSize = Math.round(multiplier * this.clipSize);
		}
		else if (bonus = 'Quietness')
		{
			this.noise = Math.ceil(this.noise / multiplier);
		}
	}
	else
	{
		this.name = 'Mundane ' + this.name;
	}


	this.loadedAmmo = this.clipSize;
	this.tile = tile;
	if (this.tile) //Tile would be false if the player is starting with a weapon
	{
		tile.setItem(this);
	}

}




function Shotgun()
{
	this.name = "Shotgun";
	this.subtype = 'SHOTGUN';
	this.attackTime = 12;
	this.reloadTime = 12;
	this.damageB = g.rand.nextInt(2, 8);
	this.damageM = g.rand.nextInt(30, 100) / 5;
	this.damageP = 'strength';
	this.range = g.rand.nextInt(4, 7);
	this.chanceB = 70;
	this.chanceM = g.rand.nextInt(1, 4) / 2;
	this.chanceP = 'perception';
	this.noise = g.rand.nextInt(40, 60);
	this.clipSize = 5;
	//this.loadedAmmo = this.clipSize;
	this.armorPiercing = 0;
	this.spreadAngle = g.rand.nextInt(30, 70);
	this.followThrough = 0;
	this.knockBack = 0;
}

Shotgun.prototype = new Gun();


function AssaultRifle()
{
	this.name = "Assault Rifle";
	this.subtype = 'ASSUALTRIFLE';
	this.damageB = 1;
	this.damageM = g.rand.nextInt(8, 20) / 2;
	this.damageP = 'strength';
	this.attackTime = 1;
	this.clipSize = 50;
	this.reloadTime = 16;
	this.range = 15;
	this.chanceB = 80;
	this.chanceM = g.rand.nextInt(1, 2);
	this.chanceP = 'perception';
	this.noise = 40;
	this.freeShotChance = 25; //Percentage
	//Give certain chance for an attack to take 0 time
}

AssaultRifle.prototype = new Gun();


function Pistol()
{
	this.name = "Pistol";
	this.subtype = 'PISTOL';
	this.attackTime = 2;
	this.reloadTime = 1;
	this.damageB = g.rand.nextInt(1, 5);
	this.damageM = g.rand.nextInt(6, 12) / 2;
	this.damageP = 'dexterity';
	this.range = g.rand.nextInt(7, 10);
	this.chanceB = 90;
	this.chanceM = g.rand.nextInt(1, 2);
	this.chanceP = 'perception';
	this.noise = g.rand.nextInt(1, 5);
	this.clipSize = 10;

	/*
	this.shootSound = document.createElement('audio');
	this.shootSound.innerHTML = "<source src='sounds/PISTOL_SHOT.mp3' type='audio/mpeg' />";
	document.body.appendChild(this.shootSound);
	this.shootSound.autoplay = true;
	this.shootSound.pause();
	*/
}

Pistol.prototype = new Gun();


function Rifle()
{
	this.name = "Rifle";
	this.subtype = 'RIFLE';
	this.attackTime = 8;
	this.reloadTime = 8;
	this.damageB = g.rand.nextInt(3, 6);
	this.damageM = g.rand.nextInt(20, 100) / 5 ;
	this.damageP = 'dexterity';
	this.range = g.rand.nextInt(10, 20);
	this.chanceB = 90;
	this.chanceM = g.rand.nextInt(0, 10) / 5;
	this.chanceP = 'perception';
	this.noise = g.rand.nextInt(15, 25);
	this.clipSize = 7;
	this.armorPiercing = 0;
	this.spreadAngle = 0;
	this.followThrough = 0;
	this.knockBack = g.rand.nextInt(1, 3);

	//this.loadedAmmo = this.clipSize;
}

Rifle.prototype = new Gun();


function TutorialPistol()
{
	this.name = "Pistol";
	this.subtype = 'PISTOL';
	this.attackTime = 2;
	this.reloadTime = 1;
	this.damageB = 3;
	this.damageM = 5;
	this.damageP = 'dexterity';
	this.range = 8;
	this.chanceB = 90;
	this.chanceM = 2;
	this.chanceP = 'perception';
	this.noise = 5;
	this.clipSize = 10;
}

TutorialPistol.prototype = new Gun();

TutorialPistol.prototype.initialize = function(tile)
{
	this.loadedAmmo = this.clipSize;
	this.tile = tile;
	if (this.tile) //Tile would be false if the player is starting with a weapon
	{
		tile.setItem(this);
	}

}


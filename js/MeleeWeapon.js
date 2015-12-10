

function MeleeWeapon()
{
	this.type = 'MELEE';

	this.range = 1;
	this.noise = 0;
	this.chance = 1;
	this.spreadAngle = 0;//Default values
	this.knockBack = 0;
	this.followThrough = 0;
}

MeleeWeapon.prototype = new Item();


MeleeWeapon.prototype.initialize = function(tile)
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
			bonus = g.possibleMeleeWeaponBonuses.getRandomElement();
		}
		while ((this.subtype === 'SAMURAISWORD') && bonus === 'Quickness')

		var multiplier = g.itemBonusMultipliers[rarity];
		this.name = originalName + ' of ' + rarity + ' ' + bonus;

		if (bonus === 'DAMAGE')
		{
			this.damageM = Math.round(this.damageM * multiplier);
		}
		else if (bonus === 'QUICKNESS')
		{
			this.attackTime = Math.ceil(this.attackTime / multiplier);
		}
		else if (bonus === 'FORCE')
		{
			this.knockBack += Math.floor(multiplier);
		}
	}
	else
	{
		this.name = "Mundane " + this.name;
	}


	this.tile = tile;
	if (this.tile) //Tile would be false if the player is starting with a weapon
	{
		tile.setItem(this);
	}
}



function SledgeHammer()
{
	this.name = "Sledge Hammer";
	this.subtype = 'SLEDGEHAMMER';
	this.attackTime = 12;

	this.damageB = g.rand.nextInt(10, 20);
	this.damageM = g.rand.nextInt(50, 150) / 5;
	//this.damageB = 100;
	//this.damageM = 0;
	this.damageP = 'strength';
	this.spreadAngle = 0;
	this.followThrough = 0;
	this.knockBack = g.rand.nextInt(3, 5);
}

SledgeHammer.prototype = new MeleeWeapon();


function Chain()
{
	this.name = "Chain";
	this.subtype = 'CHAIN';
	this.attackTime = 4;
	this.range = 1.5;
	this.damageB = g.rand.nextInt(5, 15);
	this.damageM = g.rand.nextInt(5, 20);
	this.damageP = 'dexterity';
	this.spreadAngle = 360;
}

Chain.prototype = new MeleeWeapon();


function SamuraiSword()
{
	this.name = "Samurai Sword";
	this.subtype = 'SAMURAISWORD';
	this.attackTime = 2;
	this.range = 1.5;
	this.damageB = g.rand.nextInt(5, 10);
	this.damageM = g.rand.nextInt(4, 12);
	this.damageP = 'dexterity';
	this.spreadAngle = 60;
}

SamuraiSword.prototype = new MeleeWeapon();


function BaseballBat()
{
	this.name = 'Baseball Bat';
	this.subtype = 'BASEBALLBAT';
	this.attackTime = 4;

	this.damageB = g.rand.nextInt(5, 20);
	this.damageM = g.rand.nextInt(5, 15);
	this.damageP = 'dexterity';
}

BaseballBat.prototype = new MeleeWeapon();


function Lance()
{
	this.name = 'Lance';
	this.subtype = 'LANCE';
	this.attackTime = 8;
	this.damageB = g.rand.nextInt(10, 20);
	this.damageM = g.rand.nextInt(5, 20);
	this.damageP = 'strength';
	this.range = g.rand.nextInt(2, 4);
	this.followThrough = this.range - 1;
}

Lance.prototype = new MeleeWeapon();


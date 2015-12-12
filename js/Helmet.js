

function Helmet()
{
	this.type = "HELMET";
	this.name = "Helmet";


	this.damageReduction = g.rand.nextInt(0, 10); //always positive
	this.dodgeChanceEffect = Math.round(g.rand.nextInt(-150, 150) / 5);
	this.moveNoiseEffect = g.rand.nextInt(-20, 20);
	//this.moveTimeEffect = -4;
	this.visibilityEffect = g.rand.nextInt(-20, 20);
	this.viewDistanceEffect = g.rand.nextInt(-4, 10);
	this.viewAngleEffect = Math.round(g.rand.nextInt(-150, 450) / 5);
	this.maxHealthEffect = g.rand.nextInt(0, 30);
	this.healthRechargeEffect = g.rand.nextInt(0, 20) / 100;
	this.maxEnergyEffect = g.rand.nextInt(0, 30);
	this.energyRechargeEffect = g.rand.nextInt(0, 20) / 100;

	this.bonusValues = { //If the item isn't mundane, these are the values that the multiplier will be used on
		damageReduction: g.rand.nextInt(5, 10),
		dodgeChanceEffect: Math.round(g.rand.nextInt(50, 100)) / 5,
		moveNoiseEffect: g.rand.nextInt(5, -5),
		visibilityEffect: g.rand.nextInt(5, -5),
		viewDistanceEffect: g.rand.nextInt(2, 7),
		viewAngleEffect: Math.round(g.rand.nextInt(50, 450) / 5),
		maxHealthEffect: g.rand.nextInt(10, 30),
		healthRechargeEffect: g.rand.nextInt(5, 20) / 100,
		maxEnergyEffect: g.rand.nextInt(10, 30),
		energyRechargeEffect: g.rand.nextInt(5, 20) / 100,
	}
}

Helmet.prototype = new Item();



Helmet.prototype.initialize = function(tile)
{

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
		var multiplier = g.itemBonusMultipliers[rarity];
		var bonus = getRandomElement(g.possibleHelmetBonuses);

		this.name = this.name + ' of ' + rarity + ' ' + bonus;

		if (bonus === 'Defense')
		{
			this.damageReduction = Math.round(this.bonusValues.damageReduction * multiplier);
		}
		else if (bonus === 'Agility')
		{
			this.dodgeChanceEffect = Math.round(this.bonusValues.dodgeChanceEffect * multiplier);
		}
		else if (bonus === 'Stealth')
		{
			this.visibilityEffect = Math.round(this.bonusValues.visibilityEffect * multiplier);
			this.moveNoiseEffect = Math.round(this.bonusValues.moveNoiseEffect * multiplier);
		}
		else if (bonus === 'Awareness')
		{
			this.viewAngleEffect = Math.round(this.bonusValues.viewAngleEffect * multiplier);
			this.viewDistanceEffect = Math.round(this.bonusValues.viewDistanceEffect * multiplier);
		}
		else if (bonus === 'Vitality')
		{
			this.maxHealthEffect = Math.round(this.bonusValues.maxHealthEffect * multiplier);
			this.healthRechargeEffect = round(this.bonusValues.healthRechargeEffect * multiplier, 2);
		}
		else if (bonus === 'Power')
		{
			this.maxEnergyEffect = Math.round(this.bonusValues.maxEnergyEffect * multiplier);
			this.energyRechargeEffect = round(this.bonusValues.energyRechargeEffect * multiplier, 2);
		}
	}
	else
	{
		this.name = 'Mundane ' + this.name;
	}

	this.tile = tile;
	if (this.tile)
	{
		tile.setItem(this);
	}
}
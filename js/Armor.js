
function Armor()
{
	this.type = "ARMOR";
	this.name = "Armor";


	
	this.damageReduction = g.rand.nextInt(0, 20); //always positive
	this.dodgeChanceEffect = 0;//g.rand.nextInt(-10, 10);
	this.moveNoiseEffect = g.rand.nextInt(-20, 20);
	//this.moveTimeEffect = g.rand.nextInt(-10, 10);
	this.visibilityEffect = g.rand.nextInt(-20, 20);
	this.viewDistanceEffect = 0
	this.viewAngleEffect = 0
	this.maxHealthEffect = g.rand.nextInt(0, 30); //Always positive
	this.healthRechargeEffect = g.rand.nextInt(0, 20) / 100; 
	this.maxEnergyEffect = g.rand.nextInt(0, 30); //Always positive
	this.energyRechargeEffect = g.rand.nextInt(0, 20) / 100;
	
	
}

Armor.prototype = new Item();


Armor.prototype.initialize = function(tile)
{
	this.tile = tile;
	tile.setItem(this);
}
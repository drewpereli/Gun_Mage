

function getRandomElement(array)
{
	var index = g.rand.nextInt(0, array.length);
	return array[index];
}


function getRandomElements(array, number)
{
	var tempArray = [];
	for (var i = 0 ; i < array.length ; i++)
	{
		tempArray.push(array[i]);
	}
	var returnArray = [];

	for (var i = 0 ; i < number ; i++)
	{
		if (tempArray.length === 0)
		{
			break;
		}
		var randIndex = g.rand.nextInt(0, tempArray.length);
		returnArray.push(tempArray[randIndex]);
		tempArray.splice(randIndex, 1);
	}

	return returnArray;

}
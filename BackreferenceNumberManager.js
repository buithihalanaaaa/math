var BackreferenceNumberManager = function()
{
	var self = {};

	var used = [0];

	self.allocate = function()
	{
		var n = 1;
		for(var i=1; i===used[i]; i++)
		{
			n = i+1;
		}
		used.splice(n, 0, n);
		return n;
	};

	self.free = function(n)
	{
		if(used.indexOf(n) === -1) throw new Error('free BackreferenceNumber');
		used.splice(n, 1);
		return;
	};

	return self;
};
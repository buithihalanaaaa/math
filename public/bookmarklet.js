
javascript:
/** http://d.hatena.ne.jp/zariganitosh/20140811/load_script_on_bookmarklet*/
(function(f)
{
	var urls = ["//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js",
				"//raw.githubusercontent.com/padolsey-archive/jquery.fn/master/cross-domain-ajax/jquery.xdomainajax.js"];
	for(var i=0; i<urls.length; i++)
	{
		var s = document.createElement("script");
		s.src = urls[i];
		if(i === urls.length-1)/* this if is for trigger main function f with onload and make onload's callback (i.e. f) called once.*/
		{
			s.onload = function()
			{
				f(jQuery.noConflict(true))
			};
		}
		document.body.appendChild(s);
	};
})
(function($)
{/* open new window */
	var wSub = window.open('http://127.0.0.1:8000/bookmarkletSubWindow.html', '', 'width=650,height=500');
})



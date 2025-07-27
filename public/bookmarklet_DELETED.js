javascript:

/*
* http://d.hatena.ne.jp/zariganitosh/20140811/load_script_on_bookmarklet
*/
(function(f){
	var urls = [
		"//ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js",
		"//raw.githubusercontent.com/padolsey-archive/jquery.fn/master/cross-domain-ajax/jquery.xdomainajax.js"
	];
	for(var i=0; i<urls.length; i++)
	{
		var s = document.createElement("script");
		s.src = urls[i];
		if(i === urls.length-1)/* this if is for trigger main function f with onload and make onload's callback (i.e. f) called once.*/
		{
			s.onload=function(){f(jQuery.noConflict(true))};
		}
		document.body.appendChild(s);
	};
})(function($){
	/* open new window */
	var wSub = window.open('', '_blank', 'width=800,height=600');


	/*var eHtml = document.createElement('html');*/
	var eBody = document.createElement('body');
	var eP = document.createElement('p');
	var eText = document.createTextNode('test');
	/*wSub.document.appendChild(eHtml);*/
	wSub.document.write('<html></html>');
	wSub.document.getElementsByTagName('html')[0].appendChild(eBody);
	eBody.appendChild(eP);
	eP.appendChild(eText);

	/*
    $.ajax({
        type: 'GET',
        url:  'http://twatabe.com/public_html/cgi-bin/mregui/mregui.html',
        async: false,
        dataType: 'html',
        success: function(data){
			alert('wow');
			var teststr = '';
			for(var p in $(data.responseText).find('html'))
			{
				teststr += p.toString() + ' ';
			}
			alert(teststr);
			alert($(data.responseText).find('body').text());
            $(wSub.document.getElementsByTagName('html')[0]).append(data);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            alert(
                'XMLHttpRequest : ' + XMLHttpRequest.status + '\n' +
                'textStatus : '     + textStatus + '\n' +
                'errorThrown : '    + errorThrown.message
            );
        },
    });
	*/

  /*var url = 'http://twatabe.com/public_html/cgi-bin/mregui/mregui.html';*/
  var url = 'http://ficc-workbook.tumblr.com/';
  $.get(url, function(data){
    alert($(data.responseText).find('.title')[0]);
  });



})




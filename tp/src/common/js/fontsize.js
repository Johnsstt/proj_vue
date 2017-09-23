(function(){
	var flag;
	var deviceWidth, dWidth;
    // // var deviceWidth = document.documentElement.clientWidth;
    // deviceWidth = document.documentElement.clientWidth;
    // if(deviceWidth > 414) {
    // 	// document.documentElement.style.fontSize = 110.4 + 'px';
    // 	deviceWidth = 640;
    // }else {
    // 	deviceWidth = document.documentElement.clientWidth;    	
    // 	// document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px';
    // }


    // document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px';
    if(!flag) {
    	// console.log('也进来了啊');
    	deviceWidth = document.documentElement.clientWidth;
	    if(deviceWidth > 414) {
	    	deviceWidth = 640;
	    }else {
	    	deviceWidth = document.documentElement.clientWidth;    	
	    }
    	document.documentElement.style.fontSize = deviceWidth / 3.75 + 'px';
    }

    window.onresize = function () {
    	dWidth = document.documentElement.clientWidth;
        console.log('刷新页面');
    	// console.log('浏览器窗口的宽度', dWidth);
        location.reload();   
	    if(deviceWidth > 414) {
	    	dWidth = 640;
	    }else {
	    	dWidth = document.documentElement.clientWidth;    	
	    }
    	document.documentElement.style.fontSize = dWidth / 3.75 + 'px';	

    }

    // 页面宽度发生变化时动态生成根字体尺寸
    // window.onresize = function () {
    // 	var dWidth = document.documentElement.clientWidth;
    // 	flag = true;
	   //  if(deviceWidth > 414) {
	   //  	dWidth = 640;
	   //  }else {
	   //  	dWidth = document.documentElement.clientWidth;    	
	   //  }
    // 	document.documentElement.style.fontSize = dWidth / 3.75 + 'px';
              
    // }
})()



window.onload = function () {
	var video = document.querySelector("#video_wrap > video");
	var control = document.querySelector("#video_wrap > .control");
	var progress = document.querySelector("#video_wrap > .control > .progress ")
	var inner = document.querySelector("#video_wrap > .control > .progress > .wrap > .inner ");
	var deeppink = document.querySelector("#video_wrap > .control > .progress > .deeppink ");
	var start = document.querySelector("#video_wrap  .btns .start");
	var allSpan = document.querySelector("#video_wrap > .control >.others .all");
	var nowSpan = document.querySelector("#video_wrap > .control >.others .now");

	var switchNode = document.querySelector("#video_wrap > .control >.others >.sound .switch");
	var switchSpan = document.querySelector("#video_wrap > .control >.others >.sound .switch > span");

	var progress2 = document.querySelector("#video_wrap > .control >.others  .progress ")
	// var inner2 = document.querySelector("#video_wrap > .control >.others .progress > .wrap > .inner ");
	var deeppink2 = document.querySelector("#video_wrap > .control >.others .progress > .deeppink ");

	var fullScreen = document.querySelector("#video_wrap > .control >.others .full-screen ");
	var fullScreenSpan = document.querySelector("#video_wrap > .control >.others .full-screen > span");


	video.width = document.documentElement.clientWidth;
	// video.height = document.documentElement.clientHeight - control.offsetHeight;

	window.onresize = function () {
		if (document.documentElement.clientWidth >= 600) {
			video.width = document.documentElement.clientWidth;
			video.height = document.documentElement.clientHeight - control.offsetHeight;
		}
	}

	//功能
	var timer = 0;
	//同步音量
	var flag = 0;
	//全屏标志
	var isFullScreen = false;
	player();
	function player() {

		//全屏
		fullScreen.onclick = function () {
			if (isFullScreen) {
				// 全屏 ---> 不是全屏 --> remove
				removeClass(fullScreenSpan, "active")
				isFullScreen = false
				if (document.exitFullscreen) {
					document.exitFullscreen();
				}
				else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				}
				else if (document.webkitCancelFullScreen) {
					document.webkitCancelFullScreen();
				}
				else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				}
			} else {
				addClass(fullScreenSpan, "active")
				isFullScreen = true
				var docElm = document.documentElement;
				//W3C  
				if (docElm.requestFullscreen) {
					docElm.requestFullscreen();
				}
				//FireFox  
				else if (docElm.mozRequestFullScreen) {
					docElm.mozRequestFullScreen();
				}
				//Chrome等  
				else if (docElm.webkitRequestFullScreen) {
					docElm.webkitRequestFullScreen();
				}
				//IE11
				else if (docElm.msRequestFullscreen) {
					docElm.msRequestFullscreen();
				}
			}
		}


		//音量的控制
		/* inner2.style.left = deeppink2.style.width = progress2.clientWidth - inner2.offsetWidth + "px";
		switchNode.onclick = function () {
			if (video.muted) {
				//静音 ---> 不静音 ---> 没有x的那个
				video.muted = false;
				video.volume = 1;
				removeClass(switchSpan, "active")

				flag = flag == 0 ? 1 : flag;
				inner2.style.left = deeppink2.style.width = (progress2.clientWidth - inner2.offsetWidth) * flag + "px";
			} else {
				video.muted = true;
				video.volume = 0;
				addClass(switchSpan, "active")
				inner2.style.left = deeppink2.style.width = 0 + "px";
			}
		} */

		//时间显示
		video.addEventListener("loadeddata", function () {
			allSpan.innerHTML = changeTime(video.duration);
		})


		//进度条
		progress.onclick = function (ev) {
			ev = ev || event;
			addClass(start, "active");
			video.play();
			timer = setInterval(move, 100);

			video.currentTime = video.duration * ((ev.clientX - this.offsetLeft) / (progress.clientWidth - inner.offsetWidth))
		}

		//按钮排
		// stop.onclick = function () {
		// 	removeClass(start, "active");
		// 	video.pause();
		// 	clearInterval(timer);

		// 	inner.style.left = deeppink.style.width = 0 + "px";
		// 	video.currentTime = 0;
		// }
		start.onclick = function () {
			if (video.paused) {
				//暂停 ---> 播放  ---> 显示暂停按钮
				// addClass(this, "active");
				this.innerHTML = '&#xe62b;'
				video.play();
				timer = setInterval(move, 100)
			} else {
				// removeClass(this, "active");
				this.innerHTML = '&#xe627;'
				video.pause();
				clearInterval(timer);
			}
		}
		function move() {
			inner.style.left = deeppink.style.width = (video.currentTime / video.duration) * (progress.clientWidth - inner.offsetWidth) + "px";
			nowSpan.innerHTML = changeTime(video.currentTime);
		}
	}



	//进度条小滑块拖拽时的逻辑
	var callback = {
		move: function () {
			deeppink.style.width = this.offsetLeft + "px";
			var scale = this.offsetLeft / (progress.clientWidth - inner.offsetWidth);
			video.currentTime = video.duration * scale;
			nowSpan.innerHTML = changeTime(video.currentTime);
		}
	}
	//音量条小滑块拖拽时的逻辑
	var callback2 = {
		move: function () {
			deeppink2.style.width = this.offsetLeft + "px";
			var scale = this.offsetLeft / (progress2.clientWidth - inner2.offsetWidth);
			flag = scale;
			video.volume = scale;
			if (video.volume == 0) {
				video.muted = true;
				addClass(switchSpan, "active")
			} else {
				removeClass(switchSpan, "active")
				video.muted = false;
			}
		}
	}
	zm.drag(inner, callback);
	zm.drag(inner2, callback2);

	//工具类
	function changeTime(time) {
		time = parseInt(time);

		var h = toZero(Math.floor(time / 3600));
		var m = toZero(Math.floor(time % 3600 / 60));
		var s = toZero(Math.round(time % 3600));

		return h + ":" + m + ":" + s;
	}

	function toZero(num) {
		var val = "";
		if (num < 10) {
			val = "0" + num;
		} else {
			val = val + num;
		}
		return val;
	}

	function addClass(node, className) {
		var reg = new RegExp("\\b" + className + "\\b");
		if (!reg.test(node.className)) {
			node.className += (" " + className);
		}
	}
	function removeClass(node, className) {
		if (node.className) {
			var reg = new RegExp("\\b" + className + "\\b");
			var classes = node.className;
			node.className = classes.replace(reg, "");
			if (/^\s*$/g.test(node.className)) {
				node.removeAttribute("class");
			}
		} else {
			node.removeAttribute("class");
		}
	}
}




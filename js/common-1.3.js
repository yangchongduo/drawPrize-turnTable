/**
 * Updated by liujian on 16/6/13.
 */

/**
 * 在body中插入loading页面元素
 * @type {String}
 */
jQuery("body").prepend('<div class="common-spin">' +
	'<div class="common-spin-content">' +
	'<span class="common-spin-text common-spin-dot-1">L</span>' +
	'<span class="common-spin-text common-spin-dot-2">O</span>' +
	'<span class="common-spin-text common-spin-dot-3">A</span>' +
	'<span class="common-spin-text common-spin-dot-4">D</span>' +
	'<span class="common-spin-text common-spin-dot-5">I</span>' +
	'<span class="common-spin-text common-spin-dot-6">N</span>' +
	'<span class="common-spin-text common-spin-dot-7">G</span>' +
	'<span class="common-spin-dot common-spin-dot-8"></span>' +
	'<span class="common-spin-dot common-spin-dot-9"></span>' +
	'<span class="common-spin-dot common-spin-dot-10"></span>' +
	'</div></div>');

/**
 * 解决le.com及letv.com的双域名代换
 * @param url
 * @returns { string }返回代换之后的url
 */
function correctAPIDomain(url) {
	try {
		if (/le.com/.test(window.location.href)) {
			return url.replace('letv.com', 'le.com');
		} else if (/letv.com/.test(window.location.href)) {
			return url.replace('le.com', 'letv.com');
		} else {
			return url;
		}
	} catch (e) {
		console.log(e.name + ';' + e.message);
	}
}

/**
 * 添加cookie鉴权参数
 */
function generateMixed() {
	var chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
	var dateStr = '' + new Date().getTime();
	var res = dateStr.substr(dateStr.length - 9);
	var id = Math.floor(Math.random() * 26);
	res += chars[id];
	var domain = correctAPIDomain('le.com');
	jQuery.cookie('vipcsrf', res, {
		domain: domain,
		path: '/'
	});
}

/**
 * 隐藏loading效果
 * @return {}
 */
function hideLoading() {
	jQuery(".common-spin").hide();
}

/**
 * 显示loading效果
 * @return {}
 */
function showLoading() {
	jQuery(".common-spin").show();
}

/**
 * 通用jsonp数据请求
 * @param options
 * {
 * 	url : 链接,
 * 	data : 参数,
 * 	callback : 回调,
 * 	success : 成功回调,
 * 	load : loading标记 默认或为true调用，否则不调用
 * }
 */
function ajaxRequestJsonP(options) {
	var completeFn;
	var load = options.load;
	if (load == undefined ||
		load == true) {
		showLoading();
		completeFn = function() {
			hideLoading();
		}
	} else {
		completeFn = function() {};
	}
	jQuery.ajax({
		type: 'get',
		async: false,
		url: options.url,
		dataType: "json",
		data: options.data || '',
		jsonp: options.callback || '_callback',
		success: options.success,
		error: function(err) {
			console.log(err)
		},
		complete: completeFn
	});
}

/**
 * 校验手机号
 * @param num
 * @returns {string} 0:为空 1:正确 2:非法
 */
function validUserPhoneNum(num) {
	if (!num) {
		return '0';
	}
	var phone = /^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/;
	if (!phone.test(num)) {
		return '2';
	}
	return '1';
}

/**
 * 校验字符串是否非空
 * @param value
 * @returns {boolean} true字符串且非空/false
 */
function validStr(value) {
	return (value != undefined && value != null && typeof(value) == "string" && value != "");
}

/**
 * 校验数组是否非空
 * @param value
 * @returns {boolean} true数组且非空/false
 */
function validArray(value) {
	return (value != undefined && value != null && typeof(value) == "object" && value.length > 0);
}

/**
 * 通过乐视sso js-SDK（letv/le.com http://wiki.letv.cn/pages/viewpage.action?pageId=53416732）
 * 处理用户登录相关逻辑
 * @param callback :用户通过SDK成功登录后的处理逻辑
 * @returns {boolean}
 */
function verifyUserLoginStatus(callback) {
	if (LEPass && LEPass.isLogin()) {
		return true;
	} else {

		//pc端打开登录 暂时以域（yuanxian.le.com）区分,可能需要改
		if (/yuanxian.le.com/.test(window.location.href)) {
			LEPass.openLoginDialog(function(res) {
				typeof callback == 'function' ? callback() : '';
			}, function() {
				// 取消登录回调
			}, {
				plat: 'yuanxian', //登陆注册 plat 参数对应表 (该参数必传)
				isForce: false //true: 切换账号登录  false：正常登录   默认正常登录
			});

			//M站打开登录 暂时以域（'minisite.le.com'）区分,可能需要改
		} else if (/minisite.le.com/.test(window.location.href)) {
			LEPass.openLoginPage(window.location.href, '', {
				plat: ' ', //登陆注册 plat 参数对应表 (该参数必传)
				isForce: false, //true: 切换账号登录  false：正常登录   默认正常登录
				vertical: true, //true :竖屏  不传代表横屏   默认横屏 (该参数仅限pc大陆)
				isGlobal: false, //true：海外登录页面，false：大陆登录页面   （海外必传）
				language: '' //香港：‘zh-HK’ ， 美国:  'en-US'    (海外必传)
			});
		}
		return false;
	}
}

/**
 * 判断当前是否为移动设备 
 * 返回：true为移动设备 false不是移动设备
 * @returns {boolean}
 */
function isMobileDevice() {
	var ConcertUtilBrowser = {
		versions: (function() {
			var u = navigator.userAgent,
				app = navigator.appVersion;
			return { //移动终端浏览器版本信息
				ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
				android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
				iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
				iPad: u.indexOf('iPad') > -1 //是否iPad
			};
		})()
	}
	if (((ConcertUtilBrowser.versions.ios && !ConcertUtilBrowser.versions.iPad) || ConcertUtilBrowser.versions.android)) {
		return true;
	} else {
		return false;
	}
}

/**
 * 根据当前屏幕分辨率设置rem
 * 屏宽640px及以上 1rem=100px
 * 屏宽640px以下 1rem=当前屏宽/640*100px
 */
function setRem() {
	if (isMobileDevice()) {
		document.documentElement.style.fontSize = (document.documentElement.clientWidth > 640 ? 100 : document.documentElement.clientWidth * 100 / 640) + 'px';
	}
}

/**
 * 添加监听以实现rem的实时更新
 */
function resetRem() {
	setRem();

	document.addEventListener('DOMContentLoaded', function() {
		setRem();
	});

	window.addEventListener('load', function() {
		setTimeout(setRem, 300);
	});

	window.addEventListener('resize', function() {
		setTimeout(setRem, 300);
	});
}

/**
 * 初始化操作
 * 添加touchstart监听,解决移动端active伪类无效问题
 * 根据当前屏幕分辨率设置rem 屏宽640px及以上 1rem=100px 屏宽640px以下 1rem=当前屏宽/640*100px
 * 生成cookie鉴权参数
 */
//if (isMobileDevice()) {
//	document.body.addEventListener('touchstart', function() {});
//}
//resetRem();
generateMixed();
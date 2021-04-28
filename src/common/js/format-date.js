import Vue from 'vue'

//时间格式化1
Date.prototype.format = function (format) {
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
}
//设置更元素字号
//全局路由分配
/**
 * YDUI 可伸缩布局方案
 * rem计算方式：设计图尺寸px / 100 = 实际rem  例: 100px = 1rem
 */
function accMul(arg1, arg2) {
    var m = 0,
        s1 = arg1.toString(),
        s2 = arg2.toString();
    try {
        m += s1.split(".")[1].length
    } catch (e) {
    }
    try {
        m += s2.split(".")[1].length
    } catch (e) {
    }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
}
function setSize() {
    var sizes = 5;
    /* 设计图文档宽度 */
    var docWidth = 750;
    var doc = window.document,
        docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var recalc = (function refreshRem() {
        var clientWidth = docEl.getBoundingClientRect().width;
        /* 8.55：小于320px不再缩小，11.2：大于420px不再放大 */
        docEl.style.fontSize = Math.max(Math.min(20 * (clientWidth / docWidth), 20), 8.55) * sizes + 'px';
        return refreshRem;
    })();
    /* 添加倍屏标识，安卓倍屏为1 */
    docEl.setAttribute('data-dpr', window.navigator.appVersion.match(/iphone/gi) ? window.devicePixelRatio : 1);
    if (/iP(hone|od|ad)/.test(window.navigator.userAgent)) {
        /* 添加IOS标识 */
        doc.documentElement.classList.add('ios');
        /* IOS8以上给html添加hairline样式，以便特殊处理 */
        if (parseInt(window.navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/)[1], 10) >= 8)
            doc.documentElement.classList.add('hairline');
    }
    if (!doc.addEventListener) return;
    window.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
}
setSize();

//Vue注册公共过滤器
var backJson = {
    'ICBC': "工商银行",
    'ABC': "农业银行",
    'BOC': "中国银行",
    'CCB': "建设银行",
    'CMBCHINA': "招商银行",
    'POST': "邮政储蓄",
    'ECITIC': "中信银行",
    'CEB': "光大银行",
    'BOCO': "交通银行",
    'CIB': "兴业银行",
    'CMBC': "民生银行",
    'PINGAN': "平安银行",
    'CGB': "广发银行",
    'HXB': "华夏银行",
    'SPDB': "浦发银行",
    'SHB': "上海银行",
    'CBHB': "渤海银行",
    'JSB': "江苏银行"
}
console.log("backJson",backJson)

Vue.filter('backName', (back) => { //匹配银行名称
    var req = backJson[back];
    if (req) {
        return req
    } else {
        return '其他银行'
    }
})
Vue.filter('fmtBankimsrc', (imgsrc) => { //匹配银行Logo
    if (imgsrc) {
        imgsrc = imgsrc.toUpperCase()
        if (imgsrc != 'ICBC' && imgsrc != 'ABC' && imgsrc != 'BOC' && imgsrc != 'CCB' && imgsrc != 'CMBCHINA' && imgsrc != 'POST' && imgsrc != 'ECITIC' && imgsrc != 'CEB'
            && imgsrc != 'BOCO' && imgsrc != 'CIB' && imgsrc != 'CMBC' && imgsrc != 'PINGAN' && imgsrc != 'CGB' && imgsrc != 'HXB' && imgsrc != 'SPDB' && imgsrc != 'SHB' &&
            imgsrc != 'CBHB' && imgsrc != 'JSB' && imgsrc != 'BCCB') {
            imgsrc = 'other'
        }
        return 'http://hstatic.1818pay.cn/image/banklogo/62*62/' + imgsrc + ".png";
    } else {
        return '123' //返回123为了让图片访问一个没有的图片路径以便于出发onerror
    }
})
Vue.filter('backOrder', (val) => { //处理银行卡尾号
    if (val) {
        val = val.toString();
        return val.substring(val.length - 4, val.length);
    } else {
        return "";
    }
})
Vue.filter('moneYuan', (val) => { //金额从分转化为元并且保留两位小数
    if(!val){ //防止为空的时候报错
        return "0.00"
    }
    var number = accMul(val,0.01); //防止出现精度丢失的问题
    var num = number * 1;
    return num.toFixed('2');
})
Vue.filter('accMul100', (val) => {
    if(!val){
        return '0'
    }
    var number = accMul(val.toString(),100); //防止出现精度丢失的问题
    return number
})
Vue.filter('numFix2', (val) => { //保留两位小数
    var num = val * 1;
    return num.toFixed('2');
})
Vue.filter('handlePhone', (val) => { //处理手机号
    if (val) {
        val = val.toString();
        return val.substring(0, 3) + '****' + val.substring(val.length - 4, val.length);
    } else {
        return "";
    }
})
Vue.filter('timeFormat', (value) => {
    var date = value;
    var m = date.getMonth() + 1;
    var d = date.getDate();
    if (m >= 1 && m <= 9) {
        m = "0" + m;
    }
    if (d >= 0 && d <= 9) {
        d = "0" + d;
    }
    var timer = date.getFullYear() + "-" + m + "-" + d;
    return timer;
})
//身份数据词典
Vue.filter('enterpriseFlag', (val) => {
    switch (val) {
        case "1":
            return "企业";
        case "2":
            return "生态服务商";
        case "3":
            return "专家";
        case "4":
            return "普通用户";
        case "5":
            return "区域会员";
        case "6":
            return "组织会员";
        case "7":
            return "科技局政府会员";
        case "8":
            return "招商局政府会员";
    }
})


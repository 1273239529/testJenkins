import { Toast } from 'vant';
import axios from 'axios'
import qs from 'qs'
import $ from 'jquery'
import router from '../../router'
import store from '../../store'

let localHref = "";
let ToastBox = ""; //加载框弹出
let windowSrc = window.location.host;
if (windowSrc.indexOf("community.1818pay") == -1) {  //正式环境
    localHref = "http://192.168.1.187:80";
    localHref = "https://community.1818pay.cn";

} else { //测试环境
    localHref = "https://community.1818pay.cn";
}

const vueExtend = {  //Vue方法拓展
    install: function (Vue) {
        Vue.prototype.commonConfig = { //公共配置文件
            errorImg: "this.src='./images/img404.jpg'", //错误图片
            errorImg2: "./images/img404.jpg", //错误图片
            errorHeadPortrait: "this.src='./images/morentouxiang.png'", //头像错误图片
            errorHeaderImg: "./images/morentouxiang.png",//头像错误图
            qualifications: "http://47.104.4.155:1172",//资质审核 接口路径
        },
        Vue.prototype.parameterSplicing =(val)=> { //参数拼接方式
            var str = "";
            $.each(val,(k,v)=>{
                str+='&'+k+'='+v
            })
            return str;
        },
        Vue.prototype.$fmthkdate = function (statementDate,repaymentDate){ //计算距离账单日有多长时间 statementDate:账单日 repaymentDate：还款日
			var myDate = new Date().getDate();
			var date = new Date();
			var year = date.getFullYear();
			var month = date.getMonth() + 1;
			var d = new Date(year, month, 0);
			var s = d.getDate();
			// console.log('本月'+s)
			// console.log('今天'+myDate)
			//statementDate:账单日  repaymentDate:还款日 myDate:当前是几号 s:这个月有几天
			
			if (parseInt(statementDate) < parseInt(repaymentDate)) {

				if(statementDate<myDate&&repaymentDate>myDate){ //当前日期 再 还款日与当前日期之前
					var datt = parseInt(repaymentDate) - parseInt(myDate)
				}else{
					var datt = parseInt(repaymentDate) - parseInt(statementDate)
				}
				return datt
			} else if(parseInt(statementDate) > parseInt(repaymentDate)){
				if(statementDate > myDate && repaymentDate > myDate) {
					return repaymentDate * 1 - myDate;
				} else {
					return s * 1 - statementDate * 1 + repaymentDate * 1
				}
			}
		},
            Vue.prototype.jumPage = (url) => { //页面跳转
                router.push(url);
            },
            Vue.prototype.PrefixInteger = function (num,n){ //数字补零
                return (Array(n).join(0) + num).slice(-n);
            },
            Vue.prototype.accMul = (arg1, arg2) => { //精准乘法
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
            },
            Vue.prototype.accSub = (arg1, arg2) => { //精准减法
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split(".")[1].length
                } catch (e) {
                    r1 = 0
                }
                try {
                    r2 = arg2.toString().split(".")[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2));
                n = (r1 >= r2) ? r1 : r2;
                return ((arg1 * m - arg2 * m) / m);
            },
            Vue.prototype.accMul = (arg1, arg2) => { //精准加法
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split(".")[1].length;
                } catch (e) {
                    r1 = 0;
                }
                try {
                    r2 = arg2.toString().split(".")[1].length;
                } catch (e) {
                    r2 = 0;
                }
                m = Math.pow(10, Math.max(r1, r2));
                return (arg1 * m + arg2 * m) / m;
            },
            Vue.prototype.getUrl = function (name) { //获取地址参数
                if (window.location.search) { //判断是否hash模式
                    var parameter = window.location.search;
                } else {
                    var parameter = "?" + window.location.hash.slice(2).split("?")[1];

                }
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                var r = parameter.substr(1).match(reg);
                if (r != null) {
                    return decodeURI(r[2]);
                } else {
                    return null;
                }
            },
            //请求接口数据
            Vue.prototype.$axios = function (href, data, type) {
                return new Promise((resolve, reject) => {
                    //处理为空的数据
                    $.each(data, function (k, v) {
                        if (v == '' || v == null) {
                            delete data[k]
                        }
                    })
                    //显示加载框
                    clearTimeout(ToastBox);
                    ToastBox = setTimeout(() => {
                        Toast.loading({
                            message: '加载中...',
                            forbidClick: true,
                            duration: 0
                        });
                    }, 300)
                    axios({
                        url: href,
                        method: type,
                        params: type === 'get' ? data : null,
                        data: type === 'post' ? qs.stringify(data) : null,
                        // data: type === 'post' ? data: null,
                        // headers: {
                        //     'token': store.state.token
                        // },
                    }).then(res => {
                        clearTimeout(ToastBox);
                        if (res.data.respCode == '0005') { //登录超时
                            // Toast("请重新登录");
                            setTimeout(() => {
                                router.push("/login");
                            }, 800)
                            return
                        }
                        Toast.clear();
                        resolve(res.data);
                    }).catch(res => {
                        clearTimeout(ToastBox);
                        resolve(res.data);
                        Toast('服务器异常');
                        setTimeout(() => {
                            Toast.clear();
                        }, 1500);
                    })
                })
            },
            //上传资质文件
            Vue.prototype.$upInformationFile = function (href, data, type) {
                return new Promise((resolve, reject) => {
                    //处理为空的数据
                    //显示加载框
                    clearTimeout(ToastBox);
                    ToastBox = setTimeout(() => {
                        Toast.loading({
                            message: '加载中...',
                            forbidClick: true,
                            duration: 0
                        });
                    }, 300)
                    axios({
                        url: href,
                        method: type,
                        data:data,
                        // data: type === 'post' ? data: null,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                    }).then(res => {
                        clearTimeout(ToastBox);
                        if (res.data.respCode == '0005') { //登录超时
                            Toast("请重新登录");
                            setTimeout(() => {
                                router.push("/");
                            }, 800)
                            return
                        }
                        Toast.clear();
                        resolve(res.data);
                    }).catch(res => {
                        clearTimeout(ToastBox);
                        resolve(res.data);
                        Toast('服务器异常');
                        setTimeout(() => {
                            Toast.clear();
                        }, 1500);
                    })
                })
            }
    }
}
export default vueExtend;
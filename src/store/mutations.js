const mutations = {
    sletest(state, items) { //选择的底部
		state.test = items;
	},
	memoryLoginData(state, items) { //登录数据存储
		for(var i in items){
			state[i] = items[i]
		}
	},
}

export default mutations;
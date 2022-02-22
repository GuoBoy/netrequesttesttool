<template>
	<div class="request">
		<div class="tabs" v-for="(item, index) in tabs" :key="index">
			<div class="tabs-pane">面板+{{ item.projectname }}</div>
		</div>
		<div class="tabs">
			<div class="tabs-pane">添加</div>
		</div>
	</div>
</template>

<script>
import { ref } from "vue";
export default {
	setup() {
		const defaultTab = ref({
			projectname: "未定义请求",
			projectname: "未定义",
		});
		const tabs = ref([
			{
				projectname: "未定义请求",
				projectname: "未定义",
			},
			{
				projectname: "未定义请求1",
				projectname: "未定义",
			},
			{
				projectname: "未定义请求1",
				projectname: "未定义",
			},
		]);

		const currentTab = ref(tabs.value[0]);

		const onTabsEdit = (targetName, action) => {
			console.log("触发请求", targetName, action);
			// 添加请求
			if (action === "add") {
				var temp = new Set(tabs.value);
				temp.add(defaultTab.value);
				tabs.value = temp;
				currentTab.value = defaultTab.value;
			}
			// 删除请求
			if (action === "remove") {
				var temptabs = tabs.value;
				for (let index = 0; index < temptabs.length; index++) {
					const tab = temptabs[index];
					if (targetName === tab.name) {
						// 当只剩一个时，新建空的请求
						if (temptabs.length === 1) {
							currentTab.value = defaultTab.value;
							tabs.value = [defaultTab.value];
						} else {
							currentTab.value =
								temptabs[index + 1] || temptabs[index - 1];
							tabs.value = temptabs.filter(
								(t) => t.name !== targetName
							);
							// console.log(tabs.value);
						}
					} else {
						// console.log("meiyou");
					}
				}
			}
		};

		const requestMethods = ref(["GET", "POST"]);
		const currentRequestMethod = ref("GET");
		const requestUrl = ref("");
		const requestTabActive = ref("1");
		const responseTabActive = ref("0");
		const responseData = ref("<h1>hello world</h1>");

		const params = ref([
			{
				name: "~参数名",
				value: "~参数值",
				description: "~参数说明",
			},
		]);

		const headers = ref([
			{
				name: "~参数名",
				value: "~参数值",
				description: "~参数说明",
			},
		]);

		const responesHeaders = ref([
			{
				name: "~参数名",
				value: "~参数值",
				description: "~参数说明",
			},
		]);

		return {
			currentTab,
			tabs,
			onTabsEdit,
			requestMethods,
			currentRequestMethod,
			requestUrl,
			requestTabActive,
			responseTabActive,
			params,
			headers,
			responesHeaders,
			responseData,
		};
	},
};
</script>

<style lang="less" scoped>
.request {
	display: flex;
	.tabs {
		// border-bottom: 0.1rem solid rgb(143, 120, 120);
		margin-right: 1rem;
	}
}
</style>

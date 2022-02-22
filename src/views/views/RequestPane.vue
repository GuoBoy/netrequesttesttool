<template>
	<!-- 输入链接区域 -->
	<div class="request">
		<el-select v-model="currentMethod" class="method" size="small">
			<el-option v-for="m in methods" :key="m.label" :label="m.label" :value="m" />
		</el-select>
		<el-input placeholder="输入地址" v-model="requestUrl" size="small" />
		<el-button @click="onRequest" size="small">发送</el-button>
	</div>
	<!-- 设置区域 -->
	<el-tabs v-model="requestTabActive">
		<el-tab-pane label="params" name="1">
			<!-- params区域 -->
			<el-table :data="params">
				<el-table-column label="name">
					<template #default="scope">
						<input type="text" v-model="scope.row.name" placeholder="输入参数名称" />
					</template>
				</el-table-column>
				<el-table-column label="value">
					<template #default="scope">
						<input type="text" v-model="scope.row.value" placeholder="输入参数值" />
					</template>
				</el-table-column>
				<el-table-column label="description">
					<template #default="scope">
						<input type="text" v-model="scope.row.description" placeholder="参数描述" />
					</template>
				</el-table-column>
				<el-table-column label="del">
					<template #default="scope">
						<el-button type="danger" size="mini" @click="delParams(scope.row.name)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-button class="add-btn" icon="el-icon-plus" @click="addParams" />
		</el-tab-pane>
		<!-- headers区域 -->
		<el-tab-pane label="headers" name="2">
			<el-table :data="headers" border>
				<el-table-column label="name">
					<template #default="scope">
						<input type="text" v-model="scope.row.name" placeholder="请求头名称" />
					</template>
				</el-table-column>
				<el-table-column label="value">
					<template #default="scope">
						<input type="text" v-model="scope.row.value" placeholder="值" />
					</template>
				</el-table-column>
				<el-table-column label="description">
					<template #default="scope">
						<input type="text" v-model="scope.row.description" placeholder="描述" />
					</template>
				</el-table-column>
				<el-table-column label="del">
					<template #default="scope">
						<el-button type="danger" size="mini" @click="delHeaders(scope.row.name)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<el-button class="add-btn" icon="el-icon-plus" @click="addHeaders" />
		</el-tab-pane>
	</el-tabs>
	<!-- 响应区域 -->
	<el-tabs v-model="responseTabActive" class="response">
		<!-- 响应文本 -->
		<el-tab-pane label="text" name="0">
			<textarea class="response-html" v-model="responseData"></textarea>
		</el-tab-pane>
		<!-- 响应json -->
		<el-tab-pane label="json" name="2">
			<json-viewer :value="responseJson" />
		</el-tab-pane>
		<!-- 响应头 -->
		<el-tab-pane label="headers" name="3">
			<el-table :data="responesHeaders" border>
				<el-table-column label="name">
					<template #default="scope">
						<input type="text" v-model="scope.row.name" />
					</template>
				</el-table-column>
				<el-table-column label="value">
					<template #default="scope">
						<input type="text" v-model="scope.row.value" />
					</template>
				</el-table-column>
			</el-table>
		</el-tab-pane>
	</el-tabs>
</template>
<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { ElMessage } from "element-plus";
import axios from "axios";
// import JsonViewer from "vue3-json-viewer";
const defaultTab = ref({
	name: "0",
	requestname: "未定义请求",
	projectname: "未定义",
});
const tabs = ref([defaultTab.value]);

// 格式化tabsname
const setTabsName = () => {
	var length = tabs.value.length;
	for (let index = 0; index < length; index++) {
		tabs.value[index].name = `${index}`;
	}
}

const props = defineProps<{ self: TabItem }>()
const methods = ref<Method[]>([])
console.log(props);

const currentMethod = ref<Method>(props.self.request?.method as Method)
// 监听切换请求方法
watch(currentMethod, (v, o) => {
	console.log(v, o);

})

const requestUrl = ref("");
const requestTabActive = ref("1");
const responseTabActive = ref("0");
const responseData = ref("");
const responseJson = computed(() => {
	try {
		return JSON.parse(responseData.value);
	} catch (error) {
		ElMessage.error(`获取json结果出错了, ${error}`);
		return {};
	}
});
const isLoading = ref(false);

const params = ref([
	{
		name: "",
		value: "",
		description: "",
	},
]);

const addParams = () => {
	params.value.push({
		name: "",
		value: "",
		description: "",
	});
};

const delParams = (name: string) => {
	params.value = params.value.filter((p) => p.name !== name);
};

const headers = ref([
	{
		name: "",
		value: "",
		description: "",
	},
]);

const delHeaders = (name: string) => {
	headers.value = headers.value.filter((p) => p.name !== name);
};

const addHeaders = () => {
	headers.value.push({
		name: "",
		value: "",
		description: "",
	});
};

const responesHeaders = ref([
	{
		name: "",
		value: "",
	},
]);

const checkUrl = (url: string) => {
	if (url === "") return false;
	if (/https?:\/\/[a-zA-Z0-9./&=_]+/g.test(url)) return true;
	return false;
};

const Formater = (d: any[]) => {
	var result = {};
	d.forEach((element: { name: string | number; value: any; }) => {
		return element
	});
	return result;
};

const onRequest = () => {
	console.log("发送请求");
	if (!checkUrl(requestUrl.value)) {
		ElMessage({
			message: "请输入正确地址",
			type: "error",
		});
		return;
	}
	isLoading.value = true;
	// switch (currentRequestMethod.value) {
	// 	case requestMethods.value[0]:
	// 		axios
	// 			.get(
	// 				requestUrl.value,
	// 				Formater(headers.value),
	// 				Formater(params.value)
	// 			)
	// 			.then((res) => {
	// 				ElMessage({
	// 					message: "请求成功",
	// 					type: "success",
	// 				});
	// 				responseData.value = res.data;
	// 			})
	// 			.catch((err) => {
	// 				ElMessage({
	// 					message: "请求失败" + err,
	// 					type: "error",
	// 				});
	// 			});
	// 		break;

	// 	case requestMethods.value[1]:
	// 		axios
	// 			.post(
	// 				requestUrl.value,
	// 				Formater(headers.value),
	// 				Formater(params.value)
	// 			)
	// 			.then((res) => {
	// 				ElMessage({
	// 					message: "请求成功",
	// 					type: "success",
	// 				});
	// 				responseData.value = res.data;
	// 			})
	// 			.catch((err) => {
	// 				ElMessage({
	// 					message: "请求失败" + err,
	// 					type: "error",
	// 				});
	// 			});
	// 		break;

	// 	default:
	// 		ElMessage({
	// 			message: "错误的请求类型",
	// 			type: "error",
	// 		});
	// }
	isLoading.value = false;
};
</script>

<style lang="less" scoped>
.request {
	display: flex;
	align-items: center;
}
.setting {
	.add-btn {
		width: 100%;
		margin: 1rem 0;
	}
}
.response {
	.response-html {
		width: 99%;
		height: 100px;
	}
}
</style>

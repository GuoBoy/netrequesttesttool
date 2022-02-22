<template>
  <div class="list-header">
    <span>项目列表</span>
    <!-- 添加项目按钮 -->
    <el-icon class="el-icon-folder-add" @click="NewPDialogVisiable = true" />
  </div>
  <!-- 项目列表渲染 -->
  <div v-for="(obj, index) in projects" :key="index" class="project-root">
    <span @click.right="onRightMenu($event, obj)">
      <item :item="obj" />
    </span>
  </div>
  <!-- 没有项目时显示 -->
  <el-empty description="还没有项目，点击新建~" v-if="projects.length === 0" />
  <!-- new project dialog -->
  <el-dialog title="新建项目" v-model="NewPDialogVisiable">
    <el-form :model="newPForm">
      <el-form-item label="项目名称">
        <el-input v-model="newPForm.name" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="NewPDialogVisiable = false">取 消</el-button>
        <el-button type="primary" @click="onSaveProject">确 定</el-button>
      </span>
    </template>
  </el-dialog>
  <!-- 右键菜单 -->
  <ul class="right-menu" :style="{ left: `${left}px`, top: `${top}px` }" v-show="RightMenuVisiable">
    <li @click="addRequest">添加请求</li>
    <li @click="delProject">删除</li>
    <li>重命名</li>
  </ul>
</template>

<script>
import { ref, reactive, onMounted } from 'vue'
import Item from './Item.vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { addRecord, getRecord, delRecord } from '@/database'
import md5 from 'js-md5'
export default {
  components: {
    Item
  },
  setup() {
    // 初始化项目列表
    const projects = ref([])
    const initProjects = () => {
      getRecord(undefined, (v) => {
        projects.value = v
      })
    }
    initProjects()

    // 添加项目
    const NewPDialogVisiable = ref(false)
    const newPForm = reactive({
      id: '',
      name: '',
      isFolder: true,
      children: []
    })

    const clearNewPForm = () => {
      newPForm.id = ''
      newPForm.name = ''
    }

    const onSaveProject = () => {
      var form = Object.assign({}, newPForm)
      if (form.name !== '') {
        form.id = md5(form.name)
        addRecord(form, () => { })
        projects.value.push(form)
        clearNewPForm()
      }
      NewPDialogVisiable.value = false
    }

    // 右键菜单
    const left = ref(0)
    const top = ref(0)
    const RightMenuVisiable = ref(false)
    const currentProjectId = ref('')
    const onRightMenu = (e, project) => {
      left.value = e.clientX
      top.value = e.clientY
      RightMenuVisiable.value = true
      currentProjectId.value = project.id
    }
    // 监听点击事件，关闭右键菜单
    onMounted(() => {
      document.body.addEventListener('click', () => {
        RightMenuVisiable.value = false
      })
    })
    // 删除项目
    const delProject = () => {
      var name
      var id = currentProjectId.value
      projects.value.forEach((e) => {
        if (e.id === id) {
          name = e.name
        }
      })
      ElMessageBox.confirm(`确定要删除项目：${name} ？`, '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRecord(id)
          initProjects()
          ElMessage({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
    // 添加请求
    const addRequest = () => {
      console.log('添加请求')
      var id = currentProjectId.value
      projects.value.forEach((p) => {
        if (p.id === id) {
          p.children.push({
            name: 'New Request',
            data: ''
          })
        }
      })
    }

    return {
      projects,
      NewPDialogVisiable,
      newPForm,
      onSaveProject,
      delProject,
      left,
      top,
      RightMenuVisiable,
      onRightMenu,
      addRequest
    }
  }
}
</script>

<style lang="less" scoped>
.list-header {
  border-bottom: 0.1rem solid #000000;
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.project-root {
  cursor: pointer;
  margin: 0.5rem 0;
}

.selected-project {
  background-color: #409eff;
}
.right-menu {
  position: absolute;
  list-style: none;
  margin: 0;
  padding: 0;
  box-shadow: 1rem 0.1rem 0.5rem 0.1rem rgba(0, 0, 0, 0.3);
  li {
    cursor: pointer;
    padding: 0.3rem;
  }
  li:hover {
    background: #eee;
  }
}
</style>

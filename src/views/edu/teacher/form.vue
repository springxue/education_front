<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" />
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <!--数据类型一定要和取出的json中的一致，否则没法回填因此，这里value使用动态绑定的值，保证其数据类型是number-->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!--讲师头像 :TODO      -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/teacher'
export default {
  data() {
    return {
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: ''
      },
      saveBtnDisabled: false // 保存按钮是否禁用,

    }
  },
  created() {
    //在页面加载钱，判断路由里是否有id值
    //如果有id值，调用方法根据id查询
    //从路由里面取值
    if(this.$route.params && this.$route.params.id){
      const id=this.$route.params.id;
      this.getTeacherInfoById(id)
    }
  },
  methods: {
    // 添加和修改都使用同一个表单
    saveOrUpdate() {
      this.saveBtnDisabled = true
      console.log("saveOrUpdate")
      //判断点击保存，执行添加操作还是修改操作
      if(!this.teacher.id){
        this.saveTeacher()
      }else {
        console.log("====updateTeacher====")
        console.log(this.teacher)
        this.updateTeacher(this.teacher)
      }
    },
    // 添加讲师的方法
    saveTeacher() {
      teacher.saveTeacher(this.teacher)
        .then(response => {
          // 请求之后，添加之后，提示用户
         this.$message({
            showClose: true,
            message: '添加成功',
            type: 'success'
          })
        }).then(response => {
        // 回到列表页面，通过路由跳转回到列表页面
        this.$router.push({path: '/teacher'})
      })
        .catch(reason => {
          this.$message({
            showClose: true,
            message: '添加失败',
            type: 'error'
          })
        })
    },
    //修改讲师信息
    updateTeacher(aaaa){
      this.saveBtnDisabled = true
      teacher.updateTeacherInfo(aaaa).then(response => {
        return this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).then(resposne => {
        this.$router.push({ path: '/edu/teacher' })
      }).catch((response) => {
        // console.log(response)
        this.$message({
          type: 'error',
          message: '保存失败'
        })
      })
    },
    //根据id获取教师信息
    getTeacherInfoById(id){
      teacher.getTeacherInfoById(id)
             .then(response=>{
               console.log(response)
             this.teacher=response.data.eduTeacher
             }).catch(response=>{
                console.log("555")
      })
    }
  }
}

</script>

<style scoped>

</style>

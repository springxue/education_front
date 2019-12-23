<template>
  <div class="app-container">
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择"/>
          <!--数据类型一定要和取出的json中的一致，否则没法回填因此，这里value使用动态绑定的值，保证其数据类型是number-->
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="1" label="首席讲师"/>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.info" :rows="100" type="texearea"/>
      </el-form-item>
      <!--讲师头像 :TODO      -->
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import teacher from "@/api/teacher";
    export default {
        data(){
          return{
            teacher:{
               name:'',
               sort:0,
               level:'',
               career:'',
               intro:'',
               avatar:''
            }

          }
        },
      created() {

      },
      methods:{
          //添加和修改都使用同一个表单
        saveOrUpdate(){
          this.saveTeacher()
        },
        //添加讲师的方法
        saveTeacher(){
          teacher.saveTeacher(this.teacher)
                 .then(response=>{
                  //请求之后，添加之后，提示用户
                   this.$message({
                     showClose: true,
                     message: '添加成功',
                     type:'success'
                   });
                 })
                 .catch(reason => {

                 })
        },
        //修改讲师的方法
        updateTeacher(){

        }
      }
    }

</script>

<style scoped>

</style>

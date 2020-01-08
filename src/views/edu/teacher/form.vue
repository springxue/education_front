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

      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">

        <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>

        <!--
    v-show：是否显示上传组件
    :key：类似于id，如果一个页面多个图片上传控件，可以做区分
    :url：后台上传的url地址
    @close：关闭上传组件
    @crop-upload-success：上传成功后的回调 -->
        <image-cropper
          v-show="imagecropperShow"
          :width="300"
          :height="300"
          :key="imagecropperKey"
          :url="BASE_API+'/eduService/oss/upload'"
          field="file"
          @close="close"
          @crop-upload-success="cropSuccess"/>

      </el-form-item>

      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacher from '@/api/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

const defaultFrom={
  name: '',
  sort: 0,
  level: '',
  career: '',
  intro: '',
  avatar: ''
};

export default {
  //声明使用的额外组件
  components: { ImageCropper, PanThumb },
  data() {
    return {
      BASE_API:process.env.BASE_API,//接口API地址
      imagecropperShow:false,
      imagecropperKey:0,
      teacher:defaultFrom,
      saveBtnDisabled : false // 保存按钮是否禁用,
      }
  },
  watch:{
      $route(to,from){
        console.log('watch $route')
        this.init()
      }
  },
  created() {
      this.init()
  },
  methods: {
    init(){
      //在页面加载钱，判断路由里是否有id值
      //如果有id值，调用方法根据id查询
      //从路由里面取值
      if(this.$route.params && this.$route.params.id){//修改数据回显
        const id=this.$route.params.id;
        this.getTeacherInfoById(id)
      }else {//添加
        //表单数据清空
        this.teacher={...defaultFrom}//把defaultForm的值复制给this.teacher
      }
    },
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
        this.updateTeacher()
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
    updateTeacher(){
      this.saveBtnDisabled = true
      teacher.updateTeacherInfo(this.teacher)
        .then(response => {
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
      }).then(resposne => {
        this.$router.push({ path: '/teacher' })
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
               console.log(response);
             this.teacher=response.data.eduTeacher
             }).catch(response=>{
                console.log("555")
      })
    },
    //关闭上传组件
    close(){
        //点击x，关闭弹框
      this.imagecropperShow=false;
      //重新加载上传组件
      this.imagecropperKey=this.imagecropperKey+1
    },
    cropSuccess(data){
      console.log(data);
    //获取后台返回图片的地址，显示到页面中去
      this.teacher.avatar=data.imgUrl;
      this.imagecropperShow=false;
      //重新加载上传组件
      this.imagecropperKey=this.imagecropperKey+1

    }

  }
}

</script>

<style scoped>

</style>

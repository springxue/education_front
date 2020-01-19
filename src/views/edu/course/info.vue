<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">


        <el-form-item label="课程标题">
          <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>

      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="请选择" @change="renderSecondSubject">
          <el-option
            v-for="subject in topLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="请选择">
          <el-option
            v-for="subject in secondLevelSubjectList"
            :key="subject.value"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择" >
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>

        <el-form-item label="总课时">
          <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>

        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
        <el-input v-model="courseInfo.description" placeholder=" 示例：简介"/>
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">

        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/eduService/oss/upload?type=cover'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>

      </el-form-item>

        <el-form-item label="课程价格">
          <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>

        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="next">保存并下一步</el-button>
        </el-form-item>
      </el-form>


  </div>
</template>

<script>
  import course from '@/api/course'
  import teacher from '@/api/teacher'
  import subject from '@/api/subject'
  const defaultFrom={
    title:'',
    lessonNum:0,
    price:0,
    subjectId:'',
    teacherId:'',
    description:'',
    subjectParentId:'',
    cover:'/static/cover.jpg'
  };

    export default {
        data(){
          return{
            saveBtnDisabled:false,//保存按钮是否禁用
            courseInfo:{
              title:'',
              lessonNum:0,
              price:0,
              subjectId:'',
              subjectParentId:'',
              teacherId:'',
              description:'',
              cover:''
            },
            teacherList:[],//存储所有的讲师信息（集合 ）
            topLevelSubjectList:[],//一级分类集合
            secondLevelSubjectList:[],//二级分类集合
            BASE_API: process.env.BASE_API // 接口API地址
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
      methods:{
          //判断路由是否有id值
        init() {
          if(this.$route.params && this.$route.params.id){
            const id=this.$route.params.id;
            this.getCourseInfoById(id)
            this.getTeacherInfoById(this.courseInfo.teacherId)
          }else {
            this.courseInfo={...defaultFrom}
            this.getTeacherList()
            this.getTopLevelSubjectList()
          }
        },

          //保存课程信息
          next(){
          if(!this.courseInfo.id){
            course.addCourseInfo(this.courseInfo)
              .then(response=>{
                console.log(response);
                //路由跳转，到编写大纲页面
                this.$router.push({path:'/course/chapter/'+response.data.courseId})
              })
              .catch(response=>{

              })
          }else {
            course.modifyCourseInfo(this.courseInfo)
              .then(response=>{
                console.log(response);
                //路由跳转，到编写大纲页面
                this.$router.push({path:'/course/chapter/'+response.data.courseId})
              })
              .catch(response=>{

              })
          }
          },
        //获取所有讲师
        getTeacherList(){
            teacher.getAllTeachers()
          .then(response=>{
            this.teacherList=response.data.items
          })
          .catch(response=>{

          })
        },
        //根据课程id查询课程信息
        getCourseInfoById(id){
          course.getCourseInfoById(id)
          .then(response=>{
            console.log(response.data)
            this.courseInfo=response.data.items
            //1、查询所有一级分类
            subject.getNestedTreeList()
            .then(response=>{
                  this.topLevelSubjectList=response.data.items
              for(let i=0;i<this.topLevelSubjectList.length;i++){
                let topLevelSubject=this.topLevelSubjectList[i]
                if(topLevelSubject.id===this.courseInfo.subjectParentId){
                    this.secondLevelSubjectList=topLevelSubject.children
                }
              }
            })
          })
          .catch(response=>{

          })
        },
        //获取所有一级分类
        getTopLevelSubjectList(){
            subject.getNestedTreeList()
              .then(response=>{
                console.log(response.data)
                this.topLevelSubjectList=response.data.items
              })
          .catch(resopnse=>{

          })
        },
        //触发change事件，渲染二级分类
        renderSecondSubject(value){
            //获取到选择的以及分类的id值
          //根据一级分类id值，获取下面所有二级分类
          //1、遍历所有一级分类集合
          //2、获取每个一级分类
          //3、判断value值和遍历出来的每个一级分类id值是否一样，如果一样，获取下面的二级分类，即child

          for(let i=0; i<this.topLevelSubjectList.length; i++){
            let topLevelSubject=this.topLevelSubjectList[i]
            if(topLevelSubject.id===value){
              this.secondLevelSubjectList=topLevelSubject.children
              this.courseInfo.subjectId = ''
            }
          }
        },
        //上传封面之前的方法
        beforeAvatarUpload(file){
          //设置允许上传图片的格式，上传图片的大小
          const isJPG = file.type === 'image/jpeg'
          const isLt2M = file.size / 1024 / 1024 < 2

          if (!isJPG) {
            this.$message.error('上传头像图片只能是 JPG 格式!')
          }
          if (!isLt2M) {
            this.$message.error('上传头像图片大小不能超过 2MB!')
          }
          return isJPG && isLt2M
        },
        //上传封面之后的方法
        handleAvatarSuccess(res,file){
        //上传成功之后，获取上传图片的oss路径，赋值给课程封面字段
          this.courseInfo.cover=res.data.imgUrl
        },
        //根据id获取教师信息
        getTeacherInfoById(id){
         teacher.getAllTeachers()
          .then(response=>{
            this.teacherList=response.data.items

          })
        }
      }
    }
</script>

<style scoped>

</style>

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
          placeholder="请选择">
          <el-option
            v-for="subject in topLevelSubjectList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
      </el-form-item>

      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
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
        <!-- 课程封面 TODO -->

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

  const defaultFrom={
    title:'',
    lessonNum:0,
    price:0,
    subjectId:'',
    teacherId:'',
    description:'',
    subjectParentId:'',
    cover:''
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
              teacherId:'',
              description:'',
              cover:''
            },
            teacherList:[],//存储所有的讲师信息（集合 ）
            topLevelSubjectList:[],//一级分类集合
            secondLevelSubjectList:[]//二级分类集合
          }
        },
      watch:{
        $route(to,from){
          console.log('watch $route')
          this.init()
        }
      },
      created() {
        this.getTeacherList()
        this.getTopLevelSubjectList()
        this.init()
      },
      methods:{
          //判断路由是否有id值
        init() {
          if(this.$route.params && this.$route.params.id){
            const id=this.$route.params.id;
            this.getCourseInfoById(id)
          }else {
            this.courseInfo={...defaultFrom}
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
        getCourseInfoById(id){

          course.getCourseInfoById(id)
          .then(response=>{

            this.courseInfo=response.data.items
          })
          .catch(response=>{

          })
        },
        //获取所有一级分类
        getTopLevelSubjectList(){

        }
      }
    }
</script>

<style scoped>

</style>

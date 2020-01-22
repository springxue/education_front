<template>
<div class="app-container">
  <!--查询表单-->
  <el-form :inline="true" class="demo-form-inline">

    <!-- 所属分类：级联下拉列表 -->
    <!-- 一级分类 -->
    <el-form-item label="课程类别">
      <el-select
        v-model="searchObj.subjectParentId"
        placeholder="请选择"
        @change="subjectLevelOneChanged">
        <el-option
          v-for="subject in subjectNestedList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
      </el-select>

      <!-- 二级分类 -->
      <el-select v-model="searchObj.subjectId" placeholder="请选择">
        <el-option
          v-for="subject in subSubjectList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
      </el-select>
    </el-form-item>

    <!-- 标题 -->
    <el-form-item>
      <el-input v-model="searchObj.title" placeholder="课程标题"/>
    </el-form-item>
    <!-- 讲师 -->
    <el-form-item>
      <el-select
        v-model="searchObj.teacherId"
        placeholder="请选择讲师">
        <el-option
          v-for="teacher in teacherList"
          :key="teacher.id"
          :label="teacher.name"
          :value="teacher.id"/>
      </el-select>
    </el-form-item>

    <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
    <el-button type="default" @click="resetData()">清空</el-button>
  </el-form>


  <!-- 表格 -->
  <el-table
    v-loading="listLoading"
    :data="list"
    element-loading-text="数据加载中"
    border
    fit
    highlight-current-row
    row-class-name="myClassList">

    <el-table-column
      label="序号"
      width="70"
      align="center">
      <template slot-scope="scope">
        {{ (page - 1) * limit + scope.$index + 1 }}
      </template>
    </el-table-column>

    <el-table-column label="课程信息" width="470" align="center">
      <template slot-scope="scope">
        <div class="info">
          <div class="pic">
            <img :src="scope.row.cover" alt="scope.row.title" width="150px">
          </div>
          <div class="title">
            <a href="">{{ scope.row.title }}</a>
            <p>{{ scope.row.lessonNum }}课时</p>
          </div>
        </div>

      </template>
    </el-table-column>

    <el-table-column label="创建时间" align="center">
      <template slot-scope="scope">
        {{ scope.row.gmtCreate.substr(0, 10) }}
      </template>
    </el-table-column>
    <el-table-column label="发布时间" align="center">
      <template slot-scope="scope">
        {{ scope.row.gmtModified.substr(0, 10) }}
      </template>
    </el-table-column>
    <el-table-column label="价格" width="100" align="center" >
      <template slot-scope="scope">
        {{ Number(scope.row.price) === 0 ? '免费' :
        '¥' + scope.row.price.toFixed(2) }}
      </template>
    </el-table-column>
    <el-table-column prop="buyCount" label="付费学员" width="100" align="center" >
      <template slot-scope="scope">
        {{ scope.row.buyCount }}人
      </template>
    </el-table-column>

    <el-table-column label="操作" width="150" align="center">
      <template slot-scope="scope">
        <router-link :to="'/edu/course/info/'+scope.row.id">
          <el-button type="text" size="mini" icon="el-icon-edit">编辑课程信息</el-button>
        </router-link>
        <router-link :to="'/edu/course/chapter/'+scope.row.id">
          <el-button type="text" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
        </router-link>
        <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteCourse(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
  <el-pagination
    :current-page="page"
    :page-size="limit"
    :total="total"
    style="padding: 30px 0; text-align: center;"
    layout="total, prev, pager, next, jumper"
    @current-change="getPageList"
  />
</div>
</template>

<script>
  import course from '@/api/course'
  import subject from '@/api/subject'
  import teacher from '@/api/teacher'
    export default {
        data(){
          return{
            listLoading: false, // 是否显示loading信息
            list: null, // 每页数据list集合
            total: 0, // 总记录数
            page: 1, // 当前页
            limit: 10, // 每页显示几行
            searchObj:{
              subjectParentId:'',
              title:'',
              subjectId:'',
              teacherId:'',
            },
            eduCourse:{},
            subjectNestedList:{},
            subSubjectList:{},
            teacherList:{}

          }
        },
      created() {
          this.init()
      },
      methods:{
          init(){
            this.getPageList()
            this.getSubjectInfo()
            this.getAllTeacher()
          },

          //获取分页列表信息
          getPageList(page=1){
            course.getEduCoursePageList(page,this.limit,this.eduCourse)
            .then(response=>{
              this.list=response.data.items
              this.total=response.data.total
            })
          },
        //获取课程类别
        getSubjectInfo(){
            subject.getNestedTreeList()
          .then(response=>{
            console.log(response.data)
              this.subjectNestedList=response.data.items
          }).catch(response=>{
            console.log(response)
            })
        },
        //一级分类变化时触发渲染二级分类
        subjectLevelOneChanged(id){
          console.log(id)
          for(let i=0;i<this.subjectNestedList.length;i++){
            const topLevelSubject=this.subjectNestedList[i]
            if(topLevelSubject.id===id){
                  this.subSubjectList=topLevelSubject.children
              this.searchObj.subjectId=''
            }
          }
        },
        //获取查询条件中讲师下拉
        getAllTeacher(){
            teacher.getAllTeachers()
          .then(response=>{
            console.log(response.data)
            this.teacherList=response.data.items
          })
        },
        //清空查询条件
        resetData(){
            this.searchObj={}
        },
        //条件查询
        fetchData(){
            console.log(this.searchObj)
            course.getEduCoursePageList(this.page,this.limit,this.searchObj)
            .then(response=>{
              console.log(response.data.items)
              this.list=response.data.items
              this.total=response.data.total
            })
        },
        //删除课程
        deleteCourse(id){
            this.$confirm('此操作将会永久删除该课程，是否继续？','提示',{
              confirmButtonText:'确定',
              cancelButtonText:'取消',
              type:"warning"
            }).then(()=>{
              //调用方法进行删除
              //return表示后面then还会执行
              course.deleteCourseById(id)
              .then(response=>{

              })
            })
        }
      }
    }
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="讲师姓名">
        <el-input v-model="searchObj.name" placeholder="讲师姓名"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="searchObj.level" clearable placeholder="讲师头衔">
          <el-option label="高级讲师" value="1"/>
          <el-option label="首席讲师" value="2"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="searchObj.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchObj.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="primary" icon="el-icon-search" @click="getListTeacher()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>

    </el-form>
    <el-table v-loading="listLoading" :data="list" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column prop="date" label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{ (page-1)*limit+scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="80"/>
      <el-table-column label="头衔" width="80">
        <template slot-scope="scope">
          {{ scope.row.level===1?'高级讲师':'首席讲师' }}
        </template>
      </el-table-column>
      <el-table-column prop="intro" label="资历" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
      <el-table-column prop="sort" label="排序" width="60"/>
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除</el-button>
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
      @current-change="getListTeacher"
    />
  </div>

</template>

<script>
import teacher from '@/api/teacher'

export default {
  // 定义变量和初始值
  data() {
    return {
      listLoading: true, // 是否显示loading信息
      list: null, // 每页数据list集合
      total: 0, // 总记录数
      page: 1, // 当前页
      limit: 10, // 每页显示几行
      searchObj: {}// 条件封装对象
    }
  },
  // 在页面渲染之前进行调用,调用具体的某个方法
  created() {
    this.getListTeacher()
  },
  // 写具体的方法调用(页面展示完成后调用)
  methods: {
    // fetchData(page = 1) { // 调用api层获取数据库中的数据
    //   this.page = page
    //   console.log(this.page)
    //   this.listLoading = true
    //   teacher.getTeacherPageList(this.page, this.limit, this.searchObj).then(response => {
    //     if (response.success === true) {
    //       this.list = response.data.items
    //       this.total = response.data.total
    //     }
    //     this.listLoading = false
    //   })
    // },
    getListTeacher(page = 1) {
      teacher.getTeacherPageList(page, this.limit, this.searchObj)
        .then(response => {
          console.log(response.data.items);
          this.list = response.data.items;
          console.log(response.data.total);
          this.total = response.data.total;
          this.listLoading = false
        })// 如果请求成功，返回状态码20000，执行then里面的操作
        .catch(response => {

        })// 请求失败执行这里面的操作
    },
    //清空查询条件
    resetData() {
      this.searchObj = {};
      this.getListTeacher()
    },
    removeDataById(id){
      console.log(id);
      this.$confirm('此操作将删除该教师信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        //调用方法进行删除
        return teacher.deleteTeacherById(id);//return表示后面then还会执行

        }).then(()=>{
        this.getListTeacher();
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(response => {
        if(response==='cancel'){
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        }else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }

      });
      // teacher.deleteTeacherById(id)
      //        .then(response=>{
      //           console.log(response)
      //        })
      //        .catch(reason => {
      //
      //        })
    },
    open() {

    }
  }


}
</script>

<style scoped>

</style>

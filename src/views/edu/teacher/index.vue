<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="tableData" element-loading-text="数据加载中" border fit highlight-current-row>
      <el-table-column prop="date" label="序号" width="70" align="center">
        <template slot-scope="scope">
          {{(page-1)*limit+scope.$index+1}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
    </el-table>
  </div>

</template>


<script>
    import teacher from '@/api/teacher'

    export default {
      //定义变量和初始值
      data(){
        return{
          listLoading:true,//是否显示loading信息
          list:null,//每页数据list集合
          total:0,//总记录数
          page:1,//当前页
          limit:10, //每页显示几行
          searchObj:{}//条件封装对象
        }
      },
      //在页面渲染之前进行调用,调用具体的某个方法
      created() {
        this.getListTeacher()
      },
      //写具体的方法调用(页面展示完成后调用)
      methods:{
          getListTeacher(){
            teacher.getTeacherPageList(this.page,this.limit,this.searchObj)
                   .then(response =>{
                        console.log(response.data.items);
                        this.list=response.data.items;
                     console.log(response.data.total);
                        this.total=response.data.total;
                        this.listLoading=false;
                   })//如果请求成功，返回状态码20000，执行then里面的操作
                   .catch(response =>{

                   })//请求失败执行这里面的操作
        }
      }
    }
</script>

<style scoped>

</style>

<template>
  <div class="app-container">
<!--    <el-input v-model="filterText" placeholder="Filter keyword" style="margin-bottom:30px;" />-->

    <el-button type="text" @click="showTopLevelDialog">添加一级分类</el-button>
    <el-tree
      ref="subjectTree"
      :data="subjectList"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      class="filter-tree"
      default-expand-all
      node-key="id">

      <span slot-scope="{ node, data }" class="custom-tree-node">
        <span>{{ node.label }}</span>
        <span>
          <!-- 使用Chrome的Vue插件调试
          @click="() => {dialogFormVisible=true;subject.parentId=data.id}">添加二级分类</el-button>
          -->
          <el-button
            v-if="node.level == 1"
            type="text"
            size="mini"
            @click="() => {dialogFormVisible=true;subject.parentId=data.id;subject.title=''}">添加二级分类</el-button>
          <el-button
            v-if="node.level == 2 || node.level == 1"
            type="text"
            size="mini"
            @click="() => remove(node, data)">删除</el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :visible.sync="dialogFormVisible" title="添加分类">
      <el-form :model="subject" label-width="120px">
        <el-form-item label="分类标题">
          <el-input v-model="subject.title"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addSubject()">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import subject from "@/api/subject";
  const defaultSubject={
   tile:'',
    parentId:''
  };

    export default {
        data(){
          return{
            dialogFormVisible:false,//弹框默认false，不显示
            filterText:'',
            subjectList:[],
            subject:{
              title:'',
              parentId:''
            },
            defaultProps:{
              children:'children',
              label:'title'
            }
          }
        },
      watch:{
        filterText(val) {
          this.$refs.subjectTree.filter(val)
        }
      },
      created() {
          this.getAllSubject()
      },
      methods:{
          //删除分类的方法
        remove(node,data){
          console.log(data.id);
          this.$confirm('此操作将删除该分类, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            //调用方法进行删除
            return subject.removeSubjectById(data.id);//return表示后面then还会执行

          }).then(()=>{
            // this.getAllSubject();
            this.$refs.subjectTree.remove(node)//删除节点
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          }).catch(response => {
            // this.$message({
            //   type: 'error',
            //   message: '该分类下有二级分类不能删除或者该分类已被删除'
            // })
            console.log(111)
            console.log(response);
            if(response==='cancel'){
              this.$message({
                type: 'info',
                message: '已取消删除'
              })
            }

          });

        },
        getAllSubject(){
          subject.getNestedTreeList()
                .then(response=>{
                  if(response.success===true){
                    this.subjectList=response.data.items
                  }
                })
        },
        filterNode(value,data){
          console.log(data)
          if(!value) return true;
          return data.title.toLowerCase().indexOf(value) !==-1
        },
        //点击以及分类弹出添加框
        showTopLevelDialog(){
          this.dialogFormVisible=true
        },
        //添加分类方法
        addSubject(){
          //判断添加的是一级分类还是二级分类
          //根据subject里面parentId判断，有parentid就是二级分类
          this.dialogFormVisible=false;
          if(this.subject.parentId==''){
            this.subject.parentId='0'
          }
          console.log(this.subject)
          subject.addSubject(this.subject)
                .then(response=>{
                  console.log(response)
                  if(response.success==true){
                    this.$message({
                      type: 'success',
                      message: '添加分类成功'
                    })
                    this.getAllSubject();
                    this.subject={...defaultSubject}
                  }
                })
                .catch(response=>{
                  this.$message({
                    type: 'error',
                    message: '添加分类失败'
                  })
                })
  }
      }
    }
</script>

<style scoped>

</style>

import request from '@/utils/request'// 模板提供的组件，axios的封装

export default {

  //获取课程分类树
  getNestedTreeList(){
    return request({
      url:'/eduService/eduSubject',
      method:'get'
    })
  },
    removeSubjectById(id){
      return request({
        url:'/eduService/eduSubject/'+id,
        method:'delete'
      })
    },
  addSubject(eduSubject){
    return request({
      url:'/eduService/eduSubject/add',
      method:'post',
      data:eduSubject
    })
  },
  getAllTopLevelSubjects(){
    return request({
      url:'/eduService/eduSubject/getAllTopLevelSubjects',
      method:'get',
    })
  },
  getSecondLevelSubjectByParentId(id){
    return request({
      url:'/eduService/eduSubject/getSecondLevelSubjectByParentId/'+id,
      method:'get',
    })
  }
}

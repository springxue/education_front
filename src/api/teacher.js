import request from '@/utils/request'// 模板提供的组件，axios的封装

export default {

  // 分页条件查询的方法
  // 三个参数：当前页，每页条数，查询条件
  getTeacherPageList(page, limit, searchObj) {
    return request({
      // 后端controller的路径
      url: '/eduService/teacher/multiConditionPageList/' + page + '/' + limit,
      // 提交方式
      method: 'post',
      // 传递条件对象，如果传递json数据，使用data。如果不是json，使用params
      data: searchObj
    })
  },
  //删除教师
  deleteTeacherById(id){
    return request({
      url: '/eduService/teacher/'+id,
      method:'delete',
    })
  }
}

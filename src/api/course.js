import request from '@/utils/request'// 模板提供的组件，axios的封装

export default {
  addCourseInfo(courseInfo){
    return request({
      url:'/eduService/eduCourse',
      method:'post',
      data:courseInfo
    })
  },
  getCourseInfoById(id) {
    return request({
      url:'/eduService/eduCourse/getCourseInfoById/'+id,
      method:'get'
    })
  },
  modifyCourseInfo(courseInfo){
    return request({
      url:'/eduService/eduCourse/modifyCourseInfo',
      method:'post',
      data:courseInfo
    })
  },
  getEduCoursePageList(page,limit,eduCourse){
    return request({
      url:'/eduService/eduCourse/pageList/'+page+'/'+limit,
      method:'post',
      data:eduCourse
    })
  },
  //根据id删除课程
  deleteCourseById(id){
    return request({
      url:'/eduService/eduCourse/deleteCourseById/'+id,
      method:'get'
    })
  }
}

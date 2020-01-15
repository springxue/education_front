import request from '@/utils/request'// 模板提供的组件，axios的封装

export default {
  addCourseInfo(courseInfo){
    return request({
      url:'/eduService/eduCourse',
      method:'post',
      data:courseInfo
    })
  }
}

// 适配 Nginx 反向代理
const baseUrl = process.env.VUE_APP_BASE_API === '/' ? '' : process.env.VUE_APP_BASE_API
const api = {
  state: {
    // 部署包上传
    deployUploadApi: baseUrl + '/platform/deploy/upload',
    // SQL脚本上传
    databaseUploadApi: baseUrl + '/platform/database/upload',
    // 图片上传
    imagesUploadApi: baseUrl + '/platform/localStorage/pictures',
    // 修改头像
    updateAvatarApi: baseUrl + '/platform/users/updateAvatar',
    // 上传文件到七牛云
    s3UploadApi: baseUrl + '/platform/s3Storage',
    // Sql 监控
    sqlApi: baseUrl + '/druid/index.html',
    // swagger
    swaggerApi: baseUrl + '/doc.html',
    // 文件上传
    fileUploadApi: baseUrl + '/platform/localStorage',
    // baseUrl，
    baseApi: baseUrl
  }
}

export default api

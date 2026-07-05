import request from '@/utils/request'

export default {
  BASE_URL: 'api/pay/merchant',

  add: function(data) {
    return request({
      url: this.BASE_URL,
      method: 'post',
      data
    })
  },

  del: function(ids) {
    return request({
      url: this.BASE_URL,
      method: 'delete',
      data: ids
    })
  },

  edit: function(data) {
    return request({
      url: this.BASE_URL,
      method: 'put',
      data
    })
  }
}


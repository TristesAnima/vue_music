<template>
  <div class="private-container">
    <div class="items">
      <h2>私信列表</h2>
      <el-table :data="privatemsgs" class="tableBox" style="width: 100%">
        <el-table-column label="" width="100">
          <template slot-scope="scope">
            <el-image style="width: 50px; height: 50px; border-radius: 50%;" :src="scope.row.fromUser.avatarUrl" fit="cover" lazy></el-image>
          </template>
        </el-table-column>
        <el-table-column label="用户名" width="180">
          <template slot-scope="scope">
            {{ scope.row.fromUser.nickname }}
          </template>
        </el-table-column>
        <el-table-column prop="lastMsgTime" label="发送时间" width="180">
          <template slot-scope="scope">
            {{ $dayjs(scope.row.lastMsgTime).format('YYYY-MM-DD HH:mm:ss') }}
          </template>
        </el-table-column>
        <el-table-column label="信息">
          <template slot-scope="scope">
            <el-link @click="tosendmsg(scope.row.fromUser.userId)" :type="JSON.parse(scope.row.lastMsg).msg === null ? 'info' : 'danger'">点击查看信息 {{ JSON.parse(scope.row.lastMsg).msg ?  JSON.parse(scope.row.lastMsg).msg: '暂无消息' }}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      privatemsgs: []
    }
  },
  created () {
    this.getPrivsteMsg()
  },
  methods: {
    async getPrivsteMsg () {
      const { data: res } = await this.$axios.get('/api/msg/private', {
        limit: 30
      })
      if (res.code === 200) {
        this.privatemsgs = res.msgs
        this.$message.success('获取私信成功')
      } else {
        this.$message.success('服务器打瞌睡了!请稍后重试')
      }
    },
    tosendmsg (id) {
      this.$router.push(`/home/sendmsg?q=${id}`)
    }
  }
}
</script>

<style>
</style>

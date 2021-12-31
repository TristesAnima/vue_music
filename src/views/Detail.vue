<template>
  <div class="detail-container">
    <el-button class="editUserDetail" size="mini" type="primary" plain icon="el-icon-edit" @click="editUserDetail">修改用户信息</el-button>
    <el-button class="editUserDetail" size="mini" type="primary" plain icon="el-icon-picture-outline" @click="UploadPhotoDialogVisible = true">修改头像</el-button>
    <!-- 个人信息 -->
    <div class="userDetail">
      <img :src="userDetail.avatarUrl" alt="" />
      <div class="familyname">昵称：{{ userDetail.nickname }}</div>
      <div class="gender">性别：{{ userDetail.gender }}</div>
      <div class="gender">生日：{{ userDetail.birthday }}</div>
      <div class="level">等级：Lv {{ level }}</div>
      <el-progress class="progress" :percentage="userexe.progress" :format="format"></el-progress>
      <div class="shengji">
        <div class="left">
          <el-progress class="music" color="#f56c6c" type="circle" :percentage="userexe.musicflPer"></el-progress>
          <div class="description">距离下一等级 Lv {{ level + 1 }} 还需听 {{ userexe.musicfl }} 首歌</div>
        </div>
        <div class="right">
          <el-progress class="music" color="#f56c6c" type="circle" :percentage="userexe.loginDayPer"></el-progress>
          <div class="description">距离下一等级 Lv {{ level + 1 }} 还需登录 {{ userexe.loginDay }} 天</div>
        </div>
      </div>
      <div class="province">省份：{{ userDetail.province }}</div>
      <div class="uid">UID：{{ userDetail.userId }}</div>
      <div class="city">城市：{{ userDetail.city }}</div>
      <div class="phone">手机号：{{ userDetail.shortUserName }}</div>
      <div class="lastTimeLogin">最后登陆时间：{{ userDetail.lastLoginTime }}</div>
      <div class="createtime">注册时间：{{ userDetail.createTime }}</div>
      <div class="signature">个性签名：{{ userDetail.signature ? userDetail.signature : '这位用户暂时没有签名' }}</div>
    </div>

    <div class="follows">
      <!-- 关注列表 -->
      <el-collapse>
        <el-collapse-item :title="'我的关注 (' + total1 + ')'" name="1">
          <el-table :data="follows" class="tableBox" style="width: 100%" stripe>
            <el-table-column label="头像">
              <template slot-scope="scope">
                <el-image :src="scope.row.avatarUrl"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="昵称" prop="nickname"> </el-table-column>
            <el-table-column label="关注" prop="follows"> </el-table-column>
            <el-table-column label="粉丝" prop="followeds"> </el-table-column>
            <el-table-column label="个性签名" prop="signature"> </el-table-column>
          </el-table>
          <el-pagination @current-change="handleCurrentChange" :background="true" layout="prev, pager, next" :current-page="page" :total="total1" :limit="limit"> </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="followed">
      <!-- 粉丝列表 -->
      <el-collapse>
        <el-collapse-item :title="'粉丝列表 (' + followeds.length + ')'" name="2">
          <el-table :data="followeds" style="width: 100%" stripe>
            <el-table-column label="头像">
              <template slot-scope="scope">
                <el-image style="width: 65px" :src="scope.row.avatarUrl"></el-image>
              </template>
            </el-table-column>
            <el-table-column label="昵称" prop="nickname"> </el-table-column>
            <el-table-column label="关注" prop="follows"> </el-table-column>
            <el-table-column label="粉丝" prop="followeds"> </el-table-column>
            <el-table-column label="个性签名" prop="signature"> </el-table-column>
          </el-table>
          <el-pagination @current-change="handleCurrentChange" :background="true" layout="prev, pager, next" :current-page="page" :total="followeds.length" :limit="limit"> </el-pagination>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 用户动态 -->
    <div class="event">
      <el-collapse>
        <el-collapse-item :title="'我的动态 (' + event.length + ')'" name="3">
          <el-card class="box-card" v-for="item in event" :key="item.id" width="500">
            <div slot="header" class="clearfix">
              <img :src="item.user.avatarUrl" />
              <span>{{ item.user.nickname }}</span>
              <el-button style="float: right; padding: 3px 0" type="text">删除动态</el-button>
            </div>
            <div class="text item">
              <div class="headTitle">
                <a href="javascript:;">{{ JSON.parse(item.json).msg }}</a>
              </div>
              <div class="imgs" v-if="item.pics[0]"><img :src="item.pics[0].originUrl" /></div>
            </div>
          </el-card>
        </el-collapse-item>
      </el-collapse>
    </div>

    <!-- 修改用户信息对话框 -->
    <el-dialog title="修改用户信息" :visible.sync="editUserDialogVisible" width="50%" style="margin-top: -40px;">
      <el-form class="userform" ref="editForm" :model="editDetail" :rules="addFormRules" label-width="140px">
        <el-form-item label="昵称" prop="nickname">
            <el-input class="input" v-model="editDetail.nickname"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="gender">
          <el-input class="input" v-model="editDetail.gender"></el-input>
        </el-form-item>
        <el-form-item label="生日">
          <el-input class="input" v-model="editDetail.birthday" disabled></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input class="input" v-model="editDetail.province" disabled></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input class="input" v-model="editDetail.city" disabled></el-input>
        </el-form-item>
        <el-form-item label="用户签名" prop="signature">
          <el-input class="input" v-model="editDetail.signature"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editUserDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 用户上传头像的dialog -->
    <el-dialog title="修改头像" :visible.sync="UploadPhotoDialogVisible" width="50%" center>
      <el-upload action="/api/avatar/upload" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="1" :auto-upload="upload">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="UploadPhotoDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="upload = true">确 定</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/jpeg/png文件，且不超过4M</div>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      upload: false,
      dialogImageUrl: '',
      dialogVisible: false,

      UploadPhotoDialogVisible: false,
      editUserDialogVisible: false,
      // 时间戳
      timestamp: new Date().getTime(),
      userDetail: {},
      // 关注
      follows: [],
      // 粉丝
      followeds: [],
      // 动态
      event: [],
      // 页码
      page: 1,
      // 总条数
      total1: 0,
      // 页容量
      limit: 8,
      // 等级
      level: '',
      // 经验信息
      userexe: {
        progress: 0,
        // 差的歌曲
        musicflPer: 0,
        musicfl: 0,
        // 差的天数
        loginDayPer: 0,
        loginDay: 0
      },
      editDetail: {
        nickname: '',
        gender: '',
        signature: '',
        birthday: '',
        province: '',
        city: ''
      },
      // 验证规则
      addFormRules: {
        nickname: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '昵称的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        gender: [
          { required: true, message: '请输入性别', trigger: 'blur' },
          {
            min: 1,
            max: 2,
            message: '只可输入 男 女 保密',
            trigger: 'blur'
          }
        ],
        signature: [
          { required: true, message: '请输入文本', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '只可输入 男 女 保密',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  mounted () {
    this.detail()
    this.watchs()
    this.watch()
  },
  methods: {
    // 个人信息
    async detail () {
      const { data: res } = await this.$axios.get('/api/user/account')
      if (res.code !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      switch (res.profile.gender) {
        case 0:
          res.profile.gender = '保密'
          break
        case 1:
          res.profile.gender = '男'
          break
        case 2:
          res.profile.gender = '女'
          break
      }
      this.userDetail = res.profile
      // 签名
      this.userDetail.signature = res.profile.signature
      // 生日
      this.userDetail.birthday = this.$dayjs(res.profile.birthday).format('YYYY-MM-DD HH:mm:ss')
      // 格式化账号创建时间
      this.userDetail.createTime = this.$dayjs(res.profile.createTime).format('YYYY-MM-DD HH:mm:ss')
      // 格式化用户最后登录时间
      this.userDetail.lastLoginTime = this.$dayjs(res.profile.lastLoginTime).format('YYYY-MM-DD HH:mm:ss')

      // 等级api接口
      const { data: reslevel } = await this.$axios.get('/api/user/level')
      this.level = reslevel.data.level
      /* 听歌经验条 还差多少经验升级 */
      this.userexe.progress = Number(parseFloat(reslevel.data.progress).toFixed(2) * 100) /* 保留小数点后两位四舍五入 */
      // 还差多少首歌升级
      this.userexe.musicflPer = Number(parseFloat(reslevel.data.nowPlayCount / reslevel.data.nextPlayCount).toFixed(2) * 100) /* 百分比 */
      this.userexe.musicfl = reslevel.data.nextPlayCount - reslevel.data.nowPlayCount
      // 还差登录多少天升级
      this.userexe.loginDay = reslevel.data.nextLoginCount - reslevel.data.nowLoginCount
      this.userexe.loginDayPer = Number(parseFloat(reslevel.data.nextLoginCount / reslevel.data.nowLoginCount).toFixed(2) * 100) /* 百分比 */
    },
    async watchs () {
      const { data: resfour } = await this.$axios.get('/api/login/status')
      const { data: res1 } = await this.$axios.get('/api/user/follows', {
        params: {
          uid: resfour.data.profile.userId
        }
      })
      // 没有接口 在获取一遍总的条数
      this.total1 = res1.follow.length
    },
    // 关注 粉丝 动态
    async watch () {
      const { data: resfour } = await this.$axios.get('/api/login/status')
      const { data: res } = await this.$axios.get('/api/user/follows', {
        params: {
          uid: resfour.data.profile.userId,
          limit: this.limit,
          offset: (this.page - 1) * this.limit
        }
      })
      this.follows = res.follow

      const { data: resone } = await this.$axios.get('/api/user/followeds', {
        params: {
          uid: resfour.data.profile.userId,
          limit: 99
        }
      })
      this.followeds = resone.followeds

      const { data: res3 } = await this.$axios.get('/api/user/event', {
        params: {
          uid: resfour.data.profile.userId,
          limit: 99
        }
      })
      this.event = res3.events
    },
    // 页码改变的回调函数
    handleCurrentChange (val) {
      // console.log(`当前页: ${val}`)
      this.page = val
      this.watch()
    },
    // 听歌经验条
    format (percentage) {
      return percentage === 100 ? '以达到' : `${percentage}%`
    },
    // 修改用户信息
    async editUserDetail () {
      const { data: res } = await this.$axios.get('/api/user/account')
      if (res.code !== 200) {
        return this.$message.error('获取用户信息失败')
      }
      switch (res.profile.gender) {
        case 0:
          res.profile.gender = '保密'
          break
        case 1:
          res.profile.gender = '男'
          break
        case 2:
          res.profile.gender = '女'
          break
      }
      this.editDetail = res.profile
      this.editUserDialogVisible = true
      this.$message.success('查询用户信息成功')
    },
    editUser () {
      this.$refs.editForm.validate(async valid => {
        if (!valid) return
        // 请求修改数据的接口
        const { data: res } = await this.$axios.get('/api/user/update', {
          params: {
            nickname: this.editDetail.nickname,
            gender: this.editDetail.gender === '男' ? 1 : this.editDetail.gender === '女' ? 2 : 0,
            signature: this.editDetail.signature,
            birthday: this.editDetail.birthday,
            province: this.editDetail.province,
            city: this.editDetail.city
          }
        })
        this.editUserDialogVisible = false
        if (res.code === 200) {
          this.$message.success('修改用户信息成功')
          this.detail()
        } else {
          this.$message.error('修改用户信息失败')
        }
      })
    },
    // 控制头像对话框的显示
    editUserAvatar () {
      this.UploadPhotoDialogVisible = true
    },

    handleRemove (file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/jpg' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 4

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPEG jpg png 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 4MB!')
      }
      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="css">
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 480px;
}

.detail-container .userform .el-input {
  width: 350px !important;
}
</style>

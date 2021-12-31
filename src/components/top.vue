<template>
  <div class="top-container">
    <!-- 移动端显示的图片 -->
    <div class="image">
      <img src="../assets/logo.png">
    </div>

    <!-- pc端显示 -->
    <div class="left-box">
      <div class="icon-wrapper">
        <span class="iconfont icon-home" @click="home"></span>
        <div class="icon">
          <img src="../assets/019-music.svg">
        </div>
      </div>
      <div class="history-wrapper">
        <span class="iconfont icon-arrow-lift" @click="back"></span>
        <span class="iconfont icon-arrow-right" @click="forward"></span>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="right-box">
      <div class="el-input el-input--small el-input--prefix">
        <input type="text" autocomplete="off" :placeholder="tip" class="el-input__inner" v-model="inputValue" @keyup.enter="toResult" @focus="searchVisible = true;hotSearch()" @blur="searchVisible = false" />
        <span class="el-input__prefix">
          <i class="el-input__icon el-icon-search"></i>
        </span>
      </div>
      <el-popover v-model="searchVisible">
        <!-- 热搜 -->
        <div v-if="inputValue==='' ? true:false" class="hotresult">
          <div style="font-size: 18px; color: #f9a179;">热搜</div>
          <div v-for="(item,index) in hotResult" :key="item.score" class="hover" @click="toresult(item.searchWord)">
            <span>{{index+=1}}. </span>
            <span>{{item.searchWord}}</span>
            <span style="float: right; color: red;">{{ item.score }}<i class="el-icon-sugar"></i></span>
          </div>
        </div>
        <!-- 搜索后的提示 -->
        <div v-else>
          <span>猜你想搜</span>
          <div class="info" v-show="showVisible">
            <div class="song">
              <div style="font-size: 18px; color: #f9a179;">单曲</div>
              <div class="item" v-for="item in suggestInfo.songs" :key="item.id" @click="playMusic(item.id)">
                <span>{{ item.name }}</span>
                <span>{{ item.artists[0].name }}</span>
              </div>
            </div>
            <div class="singer">
              <div style="font-size: 18px; color: #f9a179;">歌手</div>
              <div class="item" v-for="item in suggestInfo.artists" :key="item.id" @click="tosingerInfo(item.id)">
                <span>{{ item.name }}</span>
                <span>{{ item.trans }}</span>
              </div>
            </div>
            <div class="playlists">
              <div style="font-size: 18px; color: #f9a179;">歌单</div>
              <div class="item" v-for="item in suggestInfo.playlists" :key="item.id" @click="toPlaylist(item.id)">
                <span>{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-popover>
    </div>

    <!-- 登录按钮 -->
    <div class="loginBtn" @click="tologin" v-if="control">
      <div class="icon">
        <i class="el-icon-user-solid"></i>
      </div>
      <div class="ziti">登录</div>
    </div>

    <div class="login-wrap" v-else>
      <div class="img-wrap">
        <div class="avataurl" style="float: left;" @click="visible = !visible; detail()" v-if="loadData.profile">
          <el-avatar shape="square" fit="cover" :src="loadData.profile.avatarUrl"></el-avatar>
        </div>
        <div class="name" v-if="loadData.profile">{{ loadData.profile.nickname }}</div>
        <div class="privatemsg">
          <router-link to="/home/privatemsg">
            <el-badge :value="msg === 0 ? '' : msg" :max="99" class="item">
              <el-button class="share-button" icon="el-icon-message" size="mini"></el-button>
            </el-badge>
          </router-link>
        </div>
        <el-button type="danger" plain @click="loginout" size="mini" style="margin-left: 40px;">退出登录</el-button>

        <!-- 登录信息卡 -->
        <el-popover placement="bottom" title="" width="450" v-model="visible">
          <h3>个人资料</h3>
          <div class="movesense" @click="visible = false">
            <div>动态：</div>
            <router-link to="/home/detail">
              <p>{{ event }}</p>
            </router-link>
          </div>
          <div class="follows" @click="visible = false">
            <div>关注：</div>
            <router-link to="/home/detail">
              <p>{{ follows }}</p>
            </router-link>
          </div>
          <div class="followed" @click="visible = false">
            <div>粉丝：</div>
            <router-link to="/home/detail">
              <p>{{ followeds }}</p>
            </router-link>
          </div>
          <hr>
          <div class="familyname">昵称：{{ userDetail.nickname }}</div>
          <div class="gender">性别：{{ userDetail.gender }}</div>
          <div class="birthday">生日：{{ userDetail.birthday }}</div>
          <div class="level">等级：Lv {{ loadData.level }}</div>
          <div class="province">省份：{{ userDetail.province }}</div>
          <div class="uid">UID：{{ userDetail.userId }}</div>
          <div class="city">城市：{{ userDetail.city }}</div>
          <div class="phone">手机号：{{userDetail.shortUserName}}</div>
          <div class="lastTimeLogin">最后登陆时间：{{ userDetail.lastLoginTime }}</div>
          <div class="createtime">注册时间：{{ userDetail.createTime }}</div>
          <hr>
          <div class="signature" style="display: block; width: 100%;">个性签名：{{ userDetail.signature ? userDetail.signature : '这位用户暂时没有签名' }}</div>
          <div class="toUserDetail">
            <el-button class="checkUserDetail" type="primary" size="mini" plain @click="toUserDetail">点击进入用户详情页</el-button>
          </div>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'top',
  data () {
    return {
      // 输入的内容
      inputValue: '',
      // 控制登录头像是否显示
      control: true,
      // 个人身份信息卡片显示与隐藏
      visible: false,
      // 登录接口的数据
      loadData: {
        profile: {
          avatarUrl: ''
        }
      },
      // 点击头像后展现信息
      userDetail: {
        signature: ''
      },
      // 关注
      follows: '0',
      // 粉丝
      followeds: '0',
      // 动态
      event: '0',
      msg: 0,
      searchVisible: false,
      showVisible: false,
      // 默认搜索词
      tip: '',
      suggestInfo: {},
      hotResult: []
    }
  },
  async created () {
    // 用户部分信息
    this.getUserDetail()
    // 获取用户私信条数
    this.getPrivsteMsg()
    // 默认搜索关键词
    const { data: res } = await this.$axios.get('/api/search/default')
    this.tip = res.data.showKeyword
  },
  watch: {
    // 搜索提示建议
    async inputValue () {
      this.showVisible = true
      const { data: suggest } = await this.$axios.get('/api/search/suggest', {
        params: {
          keywords: this.inputValue
        }
      })
      this.suggestInfo = suggest.result
    }
  },
  methods: {
    // 热搜
    async hotSearch () {
      const { data: res } = await this.$axios.get('/api/search/hot/detail')
      this.hotResult = res.data
      // 音乐播放热度
      for (let i = 0; i < this.hotResult.length; i++) {
        this.hotResult[i].score = parseInt(this.hotResult[i].score / 10000) + '万'
      }
    },
    tologin () {
      this.$router.push('/tologin')
    },
    // 获取用户信息
    async getUserDetail () {
      const { data: resfour } = await this.$axios.get('/api/login/status')
      if (resfour.data.profile !== null) {
        this.$axios({
          url: '/api/user/detail',
          method: 'get',
          params: {
            uid: resfour.data.profile.userId
          }
        }).then(res => {
          this.loadData = res.data
        })
        this.control = false
      } else {
        this.control = true
        return false
      }
    },
    // 点击头像后展现信息的接口
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
      this.watch()
    },
    // 关注 粉丝 动态
    async watch () {
      const { data: resfour } = await this.$axios.get('/api/login/status')
      const { data: res } = await this.$axios.get('/api/user/follows', {
        params: {
          uid: resfour.data.profile.userId,
          limit: 99
        }
      })
      this.follows = res.follow.length

      const { data: resone } = await this.$axios.get('/api/user/followeds', {
        params: {
          uid: resfour.data.profile.userId,
          limit: 99
        }
      })
      this.followeds = resone.followeds.length

      const { data: restwo } = await this.$axios.get('/api/user/event', {
        params: {
          uid: resfour.data.profile.userId,
          limit: 99
        }
      })
      this.event = restwo.events.length
    },
    // 获取用户信息条数
    async getPrivsteMsg () {
      const { data: resfour } = await this.$axios.get('/api/login/status')
      if (resfour.data.profile !== null) {
        const { data: res } = await this.$axios.get('/api/msg/private', {
          limit: 30
        })
        this.msg = res.newMsgCount
      }
    },
    // 退出登录
    loginout () {
      sessionStorage.clear()
      this.control = true
      this.$axios({
        url: '/api/logout',
        method: 'get'
      })
      this.$message.warning('已退出')
    },
    toResult () {
      this.searchVisible = false
      if (this.inputValue === '') {
        this.$router.push('/home/result?q=' + this.tip)
      } else {
        this.$router.push('/home/result?q=' + this.inputValue)
      }
    },
    toresult (str) {
      this.$router.push('/home/result?q=' + str)
    },
    toUserDetail () {
      this.$router.push('/home/detail')
      this.visible = false
    },
    back () {
      window.history.go(-1)
    },
    forward () {
      window.history.go(1)
    },
    home () {
      this.$router.push('/home/discovery')
    },
    playMusic (id) {
      this.searchVisible = false
      this.$store.state.mid = id
      this.$store.commit('playMusic')
    },
    tosingerInfo (id) {
      this.searchVisible = false
      this.$router.push('/home/singerInfo?q=' + id)
    },
    toPlaylist (id) {
      this.searchVisible = false
      this.$router.push('/home/playlist?q=' + id)
    }
  }
}
</script>

<style lang="css" scoped>
.el-avatar {
  background: none;
}
</style>

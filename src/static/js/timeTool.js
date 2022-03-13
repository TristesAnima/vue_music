// 计算视频或者音乐播放时间
export const time = (duration) => {
  let min = parseInt(duration / 1000 / 60)
  min = min < 10 ? '0' + min : min
  let sec = parseInt((duration / 1000) % 60)
  sec = sec < 10 ? '0' + sec : sec
  // console.log(min + '|' + sec)
  const forTime = `${min}:${sec}`
  return forTime
}

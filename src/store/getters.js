const getters = {
  userInfo: state => state.user.userInfo,
  groups: state => state.group.groups,
  selfHeadImage: state => state.user.selfHeadImage,
  previewImgUrl: state => state.group.previewImgUrl,
  otherUsersHeadImage: state => state.user.otherUsersHeadImage,
  warningNum: state => state.group.warningNum,
  warningTime: state => state.user.warningTime,
  warningMaxNum: state => state.user.warningMaxNum
}

export default getters

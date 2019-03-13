const getters = {
  userInfo: state => state.user.userInfo,
  groups: state => state.group.groups,
  selfHeadImage: state => state.user.selfHeadImage,
  previewImgUrl: state => state.group.previewImgUrl,
  otherUsersHeadImage: state => state.user.otherUsersHeadImage,
  warningTime: state => state.user.warningTime,
  warningMaxNum: state => state.user.warningMaxNum,
  warningTipDuration: state => state.user.warningTipDuration,
  warningGroupId: state => state.group.warningGroupId
}

export default getters

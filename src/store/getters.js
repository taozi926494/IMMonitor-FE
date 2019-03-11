const getters = {
  userInfo: state => state.user.userInfo,
  groups: state => state.group.groups,
  selfHeadImage: state => state.user.selfHeadImage,
  previewImgUrl: state => state.group.previewImgUrl,
  otherUsersHeadImage: state => state.user.otherUsersHeadImage
}

export default getters

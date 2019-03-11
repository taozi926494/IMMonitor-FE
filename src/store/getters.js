const getters = {
  userInfo: state => state.user.userInfo,
  groups: state => state.group.groups,
  previewImgUrl: state => state.group.previewImgUrl,
}

export default getters
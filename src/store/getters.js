const getters = {
  userInfo: state => state.user.userInfo,
  groups: state => state.group.groups,
  msg_check_status: state => state.group.msg_check_status
}

export default getters
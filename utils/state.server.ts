interface State<T> {
  value: T
  get: () => T
  set: (newValue: T) => void
}

const login: State<boolean> = {
  value: false,
  get () {
    return this.value
  },
  set (newValue) {
    this.value = newValue
  },
}

const loginType: State<null | "admin" | "normal"> = {
  value: null,
  get () {
    return this.value
  },
  set (newValue) {
    this.value = newValue
  },
}

const username: State<null | string> = {
  value: null,
  get () { return this.value },
  set(newValue) {
      this.value = newValue
  },
}

export {login, loginType, username}

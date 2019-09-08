const { default: Exchanger } = require("./exchanger")

class LocalSchema extends Exchanger {
  static get schema() {
    return {
      id: {
        key: "id"
      },
      user: {
        key: "user",
        type: LocalUser
      },
      pets: {
        key: "pets",
        type: [LocalPet]
      }
    }
  }
}

class OtherSchema extends Exchanger {
  static get schema() {
    return {
      id: {
        key: "uuid"
      },
      user: {
        key: "userData",
        type: OtherUser
      },
      pets: {
        key: "childs",
        type: [OtherPet]
      }
    }
  }
}

class LocalUser extends Exchanger {
  static get schema() {
    return {
      id: {
        key: "id"
      },
      name: {
        key: "name"
      }
    }
  }
}

class OtherUser extends Exchanger {
  static get schema() {
    return {
      id: {
        key: "uuid"
      },
      name: {
        key: "title"
      }
    }
  }
}

class LocalPet extends Exchanger {
  static get schema() {
    return {
      name: {
        key: "name"
      }
    }
  }
}

class OtherPet extends Exchanger {
  static get schema() {
    return {
      name: {
        key: "nickname"
      }
    }
  }
}

const LocalData = {
  id: 123,
  user: {
    id: 123,
    name: "name"
  },
  pets: [
    {
      name: "Sparky"
    }
  ]
}

const OtherData = {
  uuid: 123,
  userData: {
    uuid: 123,
    title: "name"
  },
  childs: [
    {
      nickname: "Sparky"
    }
  ]
}

test("Schema to Schema", () => {
  const localObj = LocalSchema.fromJson(LocalData)
  const otherObj = OtherSchema.fromExchanger(localObj)

  expect(otherObj.toJSON()).toEqual(OtherData)
})

test("Schema to Schema and rollback to local", () => {
  const localObj = LocalSchema.fromJson(LocalData)
  const otherObj = OtherSchema.fromExchanger(localObj)
  const revertLcoalObj = LocalSchema.fromExchanger(otherObj)

  expect(localObj.toJSON()).toEqual(revertLcoalObj.toJSON())
  expect(LocalData).toEqual(revertLcoalObj.toJSON())
})

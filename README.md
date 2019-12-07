# schema-exchanger

The lib for moving some data scheme to another data scheme

example

```javascript
class LocalPet extends Exchanger {
  static get schema() {
    return {
      name: { key: "name" }
    }
  }
}

class OtherPet extends Exchanger {
  static get schema() {
    return {
      name: { key: "nickname" }
    }
  }
}

class LocalSchema extends Exchanger {
  static get schema() {
    return {
      id: { key: "id" },
      user: { key: "user", type: LocalUser },
      pets: { key: "pets", type: [LocalPet] }
    }
  }
}

class OtherSchema extends Exchanger {
  static get schema() {
    return {
      id: { key: "uuid" },
      user: { key: "userData", type: OtherUser },
      pets: { key: "childs", type: [OtherPet] }
    }
  }
}

const SomeData = {
  id: 123,
  user: { id: 123, name: "name" },
  pets: [{ name: "Sparky" }]
}

const localObj = LocalSchema.fromJson(LocalData)
const otherObj = OtherSchema.fromExchanger(localObj)

otherObj.toJSON()

/* 
expected output object
{
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
*/
```

import cloneDeep from "../utils/clondeDeep"

/**
 * Copy initailJson data to exchanger schema
 * @param {*} toData
 * @param {Object<string, SchemaProp>} schema
 * @param {*} data
 */
function dataToExchanger(toData, schema, data) {
  Object.entries(schema).forEach(([shemaKey, schemaProp]) => {
    if (schemaProp.key === undefined) {
      throw new Error("Schema prop must contains key prop")
    }
    toData[shemaKey] = data[schemaProp.key]

    if (schemaProp.type) {
      validatePropType(schemaProp)

      if (Array.isArray(schemaProp.type)) {
        toData[shemaKey] = toData[shemaKey].map(d =>
          schemaProp.type[0].fromJson(d)
        )
      } else {
        const exchanger = schemaProp.type.fromJson(toData[shemaKey])
        toData[shemaKey] = exchanger
      }
    }
  })
}

/**
 *
 * @param {Exchanger} targetExchanger
 * @param {Exchanger} sourceExchanger
 */
function exchangerToExchangerFactory(targetExchanger, sourceExchanger) {
  const targetSchema = targetExchanger.constructor.schema

  const targetData = targetExchanger._data
  const sourcedata = sourceExchanger._data

  Object.entries(targetSchema).forEach(
    ([targetSchameKey, targetSchemaProp]) => {
      const sourceValue = sourcedata[targetSchameKey]

      targetData[targetSchameKey] = sourceValue

      if (targetSchemaProp.type) {
        validatePropType(targetSchemaProp)

        if (Array.isArray(targetSchemaProp.type)) {
          const type = targetSchemaProp.type[0]
          targetData[targetSchameKey] = targetData[targetSchameKey].map(d => {
            return type.fromExchanger(d)
          })
        } else {
          targetData[targetSchameKey] = targetSchemaProp.type.fromExchanger(
            targetData[targetSchameKey]
          )
        }
      }
    }
  )
}

function validatePropType(prop) {
  const { type } = prop
  if (Array.isArray(type)) {
    if (prop.type.length !== 1) {
      throw new Error("Array type must contains only one item")
    }
    if (!(new type[0]() instanceof Exchanger)) {
      throw new Error("Type is not instance of Exchager")
    }
  } else {
    if (!(new type() instanceof Exchanger)) {
      throw new Error(`Type is not instance of Exchager`)
    }
  }
}

/**
 * @typedef {Object} SchemaProp
 * @property {String} key - out keys
 * @property {?String|Exchanger|Array<Exchanger>} type - data type
 * @property {Object<string, SchemaProp>} childrens
 */

class Exchanger {
  constructor(initialData) {
    this._data = {}
    this._initailData = initialData
  }
  /**
   * @returns {Object<string, SchemaProp>}
   */
  static get schema() {
    return {}
  }
  static fromJson(initialData) {
    const schema = this.schema
    const data = cloneDeep(initialData)
    const exchanger = new this(data)

    dataToExchanger(exchanger._data, schema, data)

    return exchanger
  }
  /**
   * @todo make cool
   * @param {*} sourceExchanger
   */
  static fromExchanger(sourceExchanger) {
    const exchanger = new this(sourceExchanger)

    exchangerToExchangerFactory(exchanger, sourceExchanger)

    return exchanger
  }
  /**
   *
   */
  toJSON() {
    const schema = this.constructor.schema
    let r = {}
    Object.entries(schema).forEach(([shemaKey, schemaProp]) => {
      const currValue = this._data[shemaKey]

      if (schemaProp.type) {
        if (Array.isArray(schemaProp.type)) {
          if (schemaProp.type.length !== 1) {
            throw new Error("Array type must contains only one item")
          }
          r[schemaProp.key] = currValue.map(d => d.toJSON())
        } else {
          r[schemaProp.key] = currValue.toJSON()
        }
      } else {
        r[schemaProp.key] = currValue
      }
    })

    return r
  }
}

export default Exchanger

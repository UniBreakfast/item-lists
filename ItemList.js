{
  // keys
  const ls = localStorage,  {stringify, parse} = JSON

  ItemList = class ItemList extends Array {
    constructor (name, templateObj={}, options={}) {
      super()
      this.name = name
      this.template = templateObj
      ItemList.dict[name] = this
    }

    add(...props) {
      const temp = this.template,
            keys = Object.keys(temp),
            item = props.length>keys.length? props.slice(keys.length) : {}
      keys.forEach((key, i) => item[key] = i<props.length? props[i] : temp[key])
      this.push(item)
      return item
    }

    async save() {
      ls['ItemList_'+this.name] =
        stringify({items: this, template: this.template})
    }

    async load() {
      const {items, template} = parse(ls['ItemList_'+this.name])
      this.splice(0, this.length, ...items)
      this.template = template
    }

    show() {}

    see() {}



  }

  const names = Object.keys(localStorage).map(key => /^ItemList_(.*)/.exec(key)).filter(Boolean).map(keyParts => keyParts[1])
  ItemList.dict = {}
}
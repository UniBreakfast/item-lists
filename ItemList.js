{
  // keys
  const ls = localStorage,  doc = document,  {stringify, parse} = JSON,
        {assign, keys, entries, fromEntries} = Object,
        $ = sel => doc.querySelector(sel),
        $$ = sel => doc.querySelectorAll(sel),
        compare =(a, b)=> stringify(a)==stringify(b)


  ItemList = class ItemList extends Array {
    constructor (name, templateObj={}, options={}) {
      super()
      this.name = name
      this.template = templateObj
      this.props = options
      if ('string' == typeof name) ItemList.dict[name] = this
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
      const {template, props} = this
      ls['ItemList_'+this.name] =
        stringify({items: this, template, props})
    }

    async load() {
      const {items, template, props} = parse(ls['ItemList_'+this.name])
      this.splice(0, this.length, ...items)
      this.template = template || {}
      this.props = props || {}
    }

    show() {
      entries(this.props?.views || {})
        .map(([selector, {show}])=> ({slots: $$(selector), show}))
        .filter(({slots, show})=> slots.length && show)
        .forEach(({slots, show}) => slots.forEach(slot => show(slot, this)))
    }

    see() {
      entries(this.props?.views || {})
        .map(([selector, {see}])=> ({slots: $$(selector), see}))
        .filter(({slots, see})=> slots.length && see)
        .flatMap(({slots, see}) => slots.map(slot => see(slot, this)))
        .filter(list => !compare(this, list))
        .forEach(list => list.change?.apply(this) ||
                          this.splice(0, this.length, ...list))
    }



  }

  ItemList.dict = {}

  const names = keys(localStorage).map(key => /^ItemList_(.*)/.exec(key))
                  .filter(Boolean).map(keyParts => keyParts[1])
  names.forEach(name => new ItemList(name).load())
}
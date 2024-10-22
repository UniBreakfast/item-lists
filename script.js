const doc = document,  {head, body} = doc,
      {assign, keys, entries, fromEntries} = Object,
      crEl =(tag,...props)=> doc.createElement(tag).change(...props),
      range =(from, to)=> [...Array(to).keys()].map(n => n+from),
      mapArr =(len, fn, thisArg)=> Array.from(range(0, len), fn, thisArg)
const [section, div] = body.children

assign(Element.prototype, {
  class: function (className, n) { const classes = className.split(' ')
    if (n===1) this.change({className})
    else if (n===-1) this.classList.remove(...classes)
    else if (n) this.classList.toggle(className)
    else this.classList.add(...classes)
    return this },
  htm: function (innerHTML='') { return this.change({innerHTML}) },
  txt: function (innerText='') { return this.change({innerText}) },
  val: function (value='') { return this.change({value}) },
  pre: function (el) { el.parent().insertBefore(this, el); return this },
  aft: function (el) { el.next()? this.pre(el.next()) :
         this.into(el.parent()); return this },
  into: function (el) { el.append(this); return el },
  host: function (arr) { return arr? (this.append(...arr), this) :
          el => this.appendChild(el) },
  mult: function (n=1) { return this.copy(n).map(el => el.aft(this)).reverse()},
  copy: function (n) { return this.clone(n) },
  clone: function (n) { return n? mapArr(n, ()=> this.clone()) :
           this.cloneNode(1) },
  change: function (...props) { for (let subj=this, i=0; i<props.length; ++i) {
      if (typeof props[i]=='string')  subj = typeof this[props[i]]=='function'?
        this[props[i]]() : this[props[i]]
      else assign(subj, props[i]) } return this },
  parent: function (sel) { return sel? this.closest(sel) : this.parentNode },
  child: function (sel) { return typeof sel!='number'? this.first(sel) :
           this.children[sel<0? this.all().length+sel : sel] },
  first: function (sel) { return typeof sel=='number'? this.all().slice(sel) :
           sel? this.querySelector(sel) : this.firstElementChild },
  last: function (sel) { return typeof sel=='number'? this.all().slice(-sel) :
          sel? this.all(sel).pop() : this.lastElementChild },
  prev: function (sel) { return sel? this.sibs(sel)[this.i(sel)-1] :
          this.previousElementSibling },
  next: function (sel) { return sel? this.sibs(sel)[this.i(sel)+1] :
          this.nextElementSibling },
  sib: function (sel) { return typeof sel=='number'? this.parent().child(sel) :
         sel? this.sibs(sel)[0] : this.parent().first() },
  sibs: function (sel) { return typeof sel!='number'? this.parent().subs(sel) :
          this.parent().subs().slice(0, sel) },
  subs: function (sel) { const subs = this.all(sel).filter(el =>
          el.parent()==this); return subs.length? subs : null },
  all: function (sel) {
         return [...sel? this.querySelectorAll(sel) : this.children] },
  i: function (sel) { return this.sibs(sel).indexOf(this) },
  arr: function (depth=Infinity) { return [this, ...depth? this.all()
         .map(el => el.arr(depth-1)) : []] },
  arrIn: function (depth=Infinity) { return depth && this.subs()? this.all()
           .map(el => el.arrIn(depth-1)).reverse().with({in: this}) : this },
  arrLike: function (depth) { const like = arr => {
             if (Array.isArray(arr)) arr.forEach(like), arr.__proto__ = null
             return arr }; return like(this.arr(depth)) },
  arrLikeIn: function (depth) { const like = arr => {
             if (Array.isArray(arr)) arr.forEach(like), arr.__proto__ = null
             return arr }; return like(this.arrIn(depth)) },
})


templateObj = {name: 'unnamed', age: null, gender: null}

options = {}

people = new ItemList('people', templateObj, options)

people.items = [
  {name: 'John', age: 30, gender: 'male'},
  {name: 'Jane', age: 25, gender: 'female'},
  {name: 'Mike', age: 40, gender: 'male'},
  {name: 'Mary', age: 35, gender: 'female'},
]

people = ItemList.dict.people
people.props.views = {
  section: {
    show(parent, list) {
      parent.htm().append(...list.map(item => crEl('p').txt(item.name)))
    }
  },
  div:  {
    show(parent, list) {
      parent.htm().append(...list.map(item => crEl('h1').txt(item.age)))
    }
  },
}

people.props.views.section.show(section, people.items)
people.props.views.div.show(div, people.items)

import ham from 'https://hamilsauce.github.io/hamhelper/hamhelper1.0.0.js';

class DOMinator {
  constructor(rootSelector = '') {
    this.root = typeof rootSelector === 'string' ? document.querySelector(rootSelector) : '';
    this.watches = []
    // this.DOM = this.eachNode(this.root, this)

    setTimeout(() => console.log('this.DOM', this.DOM), 200)
  }

  watchElement(el) {}
  mapDOM(element = this.root) {
    while (element.firstChild) {}
  }
}

function eachNode(rootNode, callback) {
  if (!callback) {
    const nodes = [];
    eachNode(rootNode, function(node) {
      nodes.push(node);
    })
    return nodes;
  }

  if (false === callback(rootNode)) {
    return false;
  }

  if (rootNode.hasChildNodes()) {
    const nodes = rootNode.childNodes
    for (let i = 0, l = nodes.length; i < l; ++i) {
      if (false === eachNode(nodes[i], callback)) {
        return
      }
    }
  }
}




function eachElement(rootElement, callback) {
  if (!callback) {
    const elements = [];
    eachElement(rootElement, function(elem) {
      elements.push(elem);
    })
    return elements;
  }

  if (false === callback(rootElement)) {
    return false;
  }

  if (rootElement.children.length > 0) {
    const elements = [...rootElement.children]
    for (let i = 0, l = elements.length; i < l; ++i) {
      if (false === eachElement(elements[i], callback)) {
        return
      }
    }
  }
}

const app = document.querySelector('.app');
const appChildren = eachElement(app)

console.log('appChildren', appChildren)


const appNodes = eachNode(app)
console.log('appNodes nefore shift', appNodes);
const poop = appNodes[0].children[1].children[1].children[6];
console.log('appNodes[0].childrwen', appNodes[0].children)



export default new DOMinator('.app')
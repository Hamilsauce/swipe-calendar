// DOMinator

export default class  {
  constructor(root) {
    this.root = root;
    this.mapOfDOM = new Map(); // maybe undefined and loop through arrau to create it
    this.arrayOfDOM = [];
    this.trackedElements = [
    // Array of   
    ]
  }

  trackChanges() {
    // add listener for
  }

  getNodeAttributes(attributes) { return [...attributes].map(attribute => { return { att: attribute.name, value: attribute.value } }) }

  createDOMMap(element, isSVG) {
    return [...element.childNodes].map(node => {
      const details = {
        content: node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
        atts: node.nodeType !== 1 ? [] : this.getNodeAttributes(node.attributes),
        type: node.nodeType === 3 ? 'text' : (node.nodeType === 8 ? 'comment' : node.tagName.toLowerCase()),
        nodeClass: node[Symbol.toStringTag],
        node: node,
      };
      details.isSVG = isSVG || details.type === 'svg';
      details.children = this.createDOMMap(node, details.isSVG);
      return details;
    });
  }
}

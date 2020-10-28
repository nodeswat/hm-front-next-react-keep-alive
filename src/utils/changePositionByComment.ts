enum NODE_TYPES {
  ELEMENT = 1,
  COMMENT = 8,
}

function findElementsBetweenComments(node: Node, identification: string): Node[] {
  const elements = [];
  const childNodes = node.childNodes as any;
  let startCommentExist = false;
  for (const child of childNodes) {
    if (
      child.nodeType === NODE_TYPES.COMMENT &&
      child.nodeValue.trim() === identification &&
      !startCommentExist
    ) {
      startCommentExist = true;
    } else if (startCommentExist && child.nodeType === NODE_TYPES.ELEMENT) {
      elements.push(child);
    } else if (child.nodeType === NODE_TYPES.COMMENT && startCommentExist) {
      return elements;
    }
  }
  return elements;
}

function findComment(node: Node, identification: string): Node | undefined {
  const childNodes = node.childNodes as any;
  for (const child of childNodes) {
    if (
      child.nodeType === NODE_TYPES.COMMENT &&
      child.nodeValue.trim() === identification
    ) {
      return child;
    }
  }
}

export default function changePositionByComment(identification: string, presentParentNode: Node, originalParentNode: Node) {
  if (!presentParentNode || !originalParentNode) {
    return;
  }
  const elementNodes = findElementsBetweenComments(originalParentNode, identification);
  const commentNode = findComment(presentParentNode, identification);
  if (!elementNodes.length || !commentNode) {
    return;
  }
  elementNodes.push(elementNodes[elementNodes.length - 1].nextSibling as Node);
  elementNodes.unshift(elementNodes[0].previousSibling as Node);
  // Deleting comment elements when using comment components will result in component uninstallation errors
  for (let i = elementNodes.length - 1; i >= 0; i--) {
    try {
      if (elementNodes[i] && elementNodes[i] instanceof Node) {
        console.error('2', elementNodes[i], commentNode)
        presentParentNode.insertBefore(elementNodes[i], commentNode);
      }
    } catch (err) {
      console.error('Try-Catched KeepAlive error', err)
    }
  }

  try {
    originalParentNode.appendChild(commentNode);
  } catch (err) {
    console.error('Try-Catched KeepAlive error', err)
  }
}

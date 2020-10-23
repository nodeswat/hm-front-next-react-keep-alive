import * as React from 'react';
import * as ReactDOM from 'react-dom';
import noop from '../utils/noop';

interface IReactCommentProps {
  onLoaded: () => void;
}

class ReactComment extends React.PureComponent<IReactCommentProps> {
  public static defaultProps = {
    onLoaded: noop,
  };

  private parentNode: Node;

  private currentNode: Element;

  private commentNode: Comment;

  private content: string;

  public componentDidMount() {
    const node = ReactDOM.findDOMNode(this) as Element;
    const commentNode = this.createComment();
    this.commentNode = commentNode;
    this.currentNode = node;
    this.parentNode = node.parentNode as Node;
    try {
      this.parentNode.replaceChild(commentNode, node);
    } catch (err) {
      console.error('Try-Catched KeepAlive error', err)
    }
    ReactDOM.unmountComponentAtNode(node);
    this.props.onLoaded();
  }

  public componentWillUnmount() {
    try {
      this.parentNode.replaceChild(this.currentNode, this.commentNode);
    } catch (err) {
      console.error('Try-Catched KeepAlive error', err)
    }
  }

  private createComment() {
    let content = this.props.children;
    if (typeof content !== 'string') {
      content = '';
    }
    this.content = (content as string).trim();
    return document.createComment(this.content);
  }

  public render() {
    return <div />;
  }
}

export default ReactComment;

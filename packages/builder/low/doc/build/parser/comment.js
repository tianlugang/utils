/**
 * Parse Comment
 * @namespace comment
 *
 * parse comment to tags.
 * @param {ASTNode} node - comment node.
 * @param {string} node.value - comment body.
 * @param {string} node.type - Block or Line.
 * @returns {Tag[]} parsed comment.
 * @example
 * for (let comment of node.leadingComments) {
 *   let tags = Comment.parse(comment);
 *   console.log(tags);
 * }
 */
function parse(node) {
  if(!isBlock(node)) {
    return [];
  }

  let comment = node.value;

  // TODO: refactor
  comment = comment.replace(/\r\n/gm, '\n'); // for windows
  comment = comment.replace(/^[\t ]*/gm, ''); // remove line head space
  comment = comment.replace(/^\*[\t ]?/, ''); // remove first '*'
  comment = comment.replace(/[\t ]$/, ''); // remove last space
  comment = comment.replace(/^\*[\t ]?/gm, ''); // remove line head '*'
  if(comment.charAt(0) !== '@') {
    // auto insert @desc
    comment = `@desc ${comment}`;
  }

  // remove tail space.
  comment = comment.replace(/[\t ]*$/, '');

  // escape code in descriptions
  comment = comment.replace(/```[\s\S]*?```/g, (match) => match.replace(/@/g, '\\ESCAPED_AT\\'));

  // auto insert tag text to non-text tag (e.g. @interface)
  comment = comment.replace(/^[\t ]*(@\w+)$/gm, '$1 \\TRUE');

  // insert separator (\\Z@tag\\Ztext)
  comment = comment.replace(/^[\t ]*(@\w+)[\t ](.*)/gm, '\\Z$1\\Z$2');
  const lines = comment.split('\\Z');

  let name = '';
  let value = '';
  const tags = [];
  for(let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if(line.charAt(0) === '@') {
      name = line;
      const nextLine = lines[i + 1];
      if(nextLine.charAt(0) === '@') {
        value = '';
      } else {
        value = nextLine;
        i++;
      }
      value = value.replace('\\TRUE', '')
        .replace(/\\ESCAPED_AT\\/g, '@')
        .replace(/^\n/, '')
        .replace(/\n*$/, '');
      tags.push({ name, value });
    }
  }
  
  return tags;
}

/**
 * parse node to tags.
 * @param {ASTNode} node - node.
 * @returns {{tags: Tag[], node: node}} parsed comment.
 */
function parseFromNode(node) {
  if(!node.leadingComments) {
    node.leadingComments = [{ type: 'Block', value: '' }];
  }
  node = node.leadingComments[node.leadingComments.length - 1];
  const tags = this.parse(node);

  return { tags, node };
}

/**
   * build comment from tags
   * @param {Tag[]} tags
   * @returns {string} block comment value.
   */
function build(tags) {
  return tags.reduce((comment, tag) => {
    const line = tag.value.replace(/\n/g, '\n * ');
    return `${comment} * ${tag.name} \n * ${line} \n`;
  }, '*\n');
}

/**
   * judge doc comment or not.
   * @param {ASTNode} node - comment node.
   * @returns {boolean} if true, this comment node is doc comment.
   */
function isBlock(node) {
  if(node.type !== 'Block') {
    return false;
  }
  return node.value.charAt(0) === '*';
}

module.exports = { parse, parseFromNode, build, isBlock };

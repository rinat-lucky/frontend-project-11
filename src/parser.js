import uniqueId from 'lodash/uniqueId.js';

const parser = new DOMParser();

export default (data) => {
  const xmlDoc = parser.parseFromString(data, 'application/xml');

  if (xmlDoc.querySelector('parsererror')) {
    throw new Error('invalid rss');
  }

  const feedTitle = xmlDoc.querySelector('title').textContent;
  const feedDescr = xmlDoc.querySelector('description').textContent;
  const id = uniqueId();

  const posts = [];

  const postsElems = xmlDoc.querySelectorAll('item');
  postsElems.forEach((post) => {
    const postTitle = post.querySelector('title').textContent;
    const postDescr = post.querySelector('description').textContent;
    const postLink = post.querySelector('link').textContent;
    const postID = uniqueId();
    const feedID = id;
    posts.push({
      postID, postTitle, postDescr, postLink, feedID,
    });
  });

  return {
    feed: {
      id, feedTitle, feedDescr,
    },
    posts,
  };
};

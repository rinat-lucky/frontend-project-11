import * as yup from 'yup';
import axios from 'axios';
import uniqueId from 'lodash/uniqueId.js';

export const validate = (link, collection) => {
  const schemaStr = yup.string().required().url().trim();
  const schemaMix = yup.mixed().notOneOf([collection]);
  return schemaStr.validate(link)
    .then((url) => schemaMix.validate(url));
};

export const getData = (url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`);

export const parse = (data) => {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(data, 'application/xml');

  if (xmlDoc.querySelector('parsererror')) throw new Error('invalid rss');

  const feedTitle = xmlDoc.querySelector('title').textContent;
  const feedDescr = xmlDoc.querySelector('description').textContent;
  const id = uniqueId();

  const posts = [];
  // const postsVisits = [];
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
    // postsVisits.push({
    //   postID, visited: false,
    // });
  });

  return {
    feed: {
      id, feedTitle, feedDescr,
    },
    posts,
    // postsVisits,
  };
};

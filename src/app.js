import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId.js';
import render from './render.js';
import { validate, getData, parse } from './utils.js';

const TIMER = 10000;

export default (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
  };

  const state = {
    formStatus: 'valid', contentStatus: 'valid', rssLinks: [], feeds: [], posts: [], postsVisits: [],
  };
  const watchedState = onChange(state, render(state, elements, i18n));

  const updateRss = () => {
    if (state.rssLinks.length < 1) return;
    const promises = state.rssLinks.forEach((url) => {
      getData(url)
        .then((rss) => {
          const updatingFeed = state.feeds.find((feed) => feed.feedLink === url);
          const { feed, posts } = parse(rss.data.contents);
          feed.id = updatingFeed.id;
          const newPosts = posts.filter((post) => {
            const collOfPostsLinks = state.posts.map((postInState) => postInState.postLink);
            return !collOfPostsLinks.includes(post.postLink);
          });

          if (newPosts.length === 0) return;
          newPosts.forEach((post) => {
            post.postID = uniqueId();
            post.feedID = feed.id;
            watchedState.postsVisits.push({
              postID: post.postID, visited: false,
            });
          });

          watchedState.posts = [...state.posts, ...newPosts];
          watchedState.formStatus = 'updated';
        })
        .catch((err) => err.message);
    });
    Promise.all(promises)
      .then(setTimeout(() => {
        watchedState.formStatus = 'valid';
        updateRss();
      }, TIMER))
      .catch((err) => err.message);
  };

  const addNewRss = (parsedRss, link) => {
    const { feed, posts } = parsedRss;
    feed.id = uniqueId();
    feed.feedLink = link;
    watchedState.feeds.push(feed);
    posts.forEach((post) => {
      const { postTitle, postDescr, postLink } = post;
      const postID = uniqueId();
      const feedID = feed.id;
      watchedState.posts.push({
        postTitle, postDescr, postLink, postID, feedID,
      });
      watchedState.postsVisits.push({
        postID, visited: false,
      });
    });
    return state;
  };

  const handleEnteredLink = (link) => {
    validate(link, state.rssLinks)
      .then((validURL) => getData(validURL))
      .then((rss) => {
        const parsedRss = parse(rss.data.contents);
        addNewRss(parsedRss, link);
        watchedState.rssLinks.push(link);
        watchedState.error = '';
        watchedState.formStatus = 'success';
      })
      .then(setTimeout(() => { updateRss(); }, TIMER))
      .catch((err) => {
        watchedState.error = err.type ?? err.message.toLowerCase();
        watchedState.formStatus = 'invalid';
        console.log('ОШИБКА', err);
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleEnteredLink(formData.get('url'));
  });
};

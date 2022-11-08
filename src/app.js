import onChange from 'on-change';
import render from './render.js';
import { validate, getData, parse } from './utils.js';

const TIMER = 7000;

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
    bootStatus: 'valid', rssLinks: [], feeds: [], posts: [], postsVisits: [],
  };
  const watchedState = onChange(state, render(state, elements, i18n));

  const updateRss = () => {
    if (state.rssLinks.length < 1) return;
    const promises = state.rssLinks.forEach((url) => {
      getData(url)
        .then((response) => {
          const { posts } = parse(response.data.contents);
          const newPosts = posts.filter((post) => {
            const collOfPostsLinks = state.posts.flat().map((postInState) => postInState.postLink);
            return !collOfPostsLinks.includes(post.postLink);
          });
          watchedState.posts.push(newPosts);
          watchedState.bootStatus = 'updated';
        })
        .catch((err) => err.message);
    });
    const promise = Promise.all(promises);
    promise.then(setTimeout(() => { updateRss(); }, TIMER))
      .catch((err) => err.message);
  };

  const handleEnteredLink = (link) => {
    validate(link, state.rssLinks)
      .then((validURL) => getData(validURL))
      .then((data) => {
        const { feed, posts, postsVisits } = parse(data.data.contents);
        watchedState.rssLinks.push(link);
        watchedState.feeds.push(feed);
        watchedState.posts.push(posts);
        watchedState.postsVisits.push(postsVisits);
        watchedState.error = '';
        watchedState.bootStatus = 'success';
      })
      .then(setTimeout(() => { updateRss(); }, TIMER))
      .catch((err) => {
        watchedState.error = err.type ?? err.message.toLowerCase();
        watchedState.bootStatus = 'invalid';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredLink = e.target[0].value;
    handleEnteredLink(enteredLink);
  });
};

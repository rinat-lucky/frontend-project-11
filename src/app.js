import onChange from 'on-change';
import render from './render.js';
import { validate, getData, parse } from './utils.js';

export default (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modalTitle: document.querySelector('.modal-title'),
    modalDescr: document.querySelector('.modal-descr'),
    modalReadBtn: document.querySelector('.modal-link'),
    modalCloseBtn: document.querySelector('.modal-close'),
  };

  const state = {
    formStatus: 'valid', rssLinks: [], feeds: [], posts: [],
  };
  const watchedState = onChange(state, render(i18n, state, elements));

  const updateRss = () => {
    if (state.rssLinks.length < 1) return state;
    state.rssLinks.forEach((url) => {
      getData(url)
        .then((response) => {
          const { posts } = parse(response.data.contents);
          const newPosts = posts.filter((post) => {
            const collOfPostsLinks = state.posts.flat().map((postInState) => postInState.postLink);
            return !collOfPostsLinks.includes(post.postLink);
          });

          watchedState.posts.push(newPosts);
          watchedState.formStatus = 'valid';
          watchedState.formStatus = 'updated';
        })
        .then(setTimeout(() => { updateRss(); }, 15000))
        .catch((err) => err.message);
    });
    return state;
  };

  const handleEnteredLink = (link) => {
    validate(link, state.rssLinks)
      .then((validURL) => getData(validURL))
      .then((data) => {
        const { feed, posts } = parse(data.data.contents);
        watchedState.rssLinks.push(link);
        watchedState.feeds.push(feed);
        watchedState.posts.push(posts);
        watchedState.error = '';
        watchedState.formStatus = 'success';
      })
      .then(setTimeout(() => { updateRss(); }, 15000))
      .catch((err) => {
        watchedState.error = err.type ?? err.message.toLowerCase();
        watchedState.formStatus = 'invalid';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredLink = e.target[0].value;
    handleEnteredLink(enteredLink);
  });
};

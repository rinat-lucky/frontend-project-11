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
    modal: document.querySelector('.modal'),
  };

  const state = {
    status: 'valid', rssLinks: [], feeds: [], posts: [], postsVisits: [],
  };
  const watchedState = onChange(state, render(state, elements, i18n));

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
          watchedState.status = 'valid';
          watchedState.status = 'updated';
        })
        .then(setTimeout(() => { updateRss(); }, 999000))
        .catch((err) => err.message);
    });
    return state;
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
        watchedState.status = 'success';
        watchedState.status = 'valid';
        watchedState.status = 'success';
      })
      .then(setTimeout(() => { updateRss(); }, 999000))
      .catch((err) => {
        watchedState.error = err.type ?? err.message.toLowerCase();
        watchedState.status = 'invalid';
        watchedState.status = 'valid';
        watchedState.status = 'invalid';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredLink = e.target[0].value;
    handleEnteredLink(enteredLink);
  });
};

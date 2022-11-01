import * as yup from 'yup';
import onChange from 'on-change';
import axios from 'axios';
import render from './render.js';
import parse from './parser.js';

export default (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };

  const state = {
    formStatus: 'valid', rssLinks: [], feeds: [], posts: [],
  };
  const watchedState = onChange(state, render(i18n, state, elements));
  const schemaStr = yup.string().required().url().trim();
  const schemaMix = yup.mixed().notOneOf([state.rssLinks]);

  elements.form.addEventListener('submit', (evt) => {
    evt.preventDefault();
    const rssLink = evt.target[0].value;

    schemaStr.validate(rssLink)
      .then((url) => schemaMix.validate(url))
      .then((url) => axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(url)}`))
      .then((response) => {
        const { feed, posts } = parse(response.data.contents);
        watchedState.rssLinks.push(rssLink);
        watchedState.feeds.push(feed);
        watchedState.posts.push(posts);
        watchedState.error = '';
        watchedState.formStatus = 'success';
        watchedState.formStatus = 'valid';
        watchedState.formStatus = 'success';
      })
      .catch((err) => {
        watchedState.error = err.type ?? err.message.toLowerCase();
        watchedState.formStatus = 'invalid';
        watchedState.formStatus = 'valid';
        watchedState.formStatus = 'invalid';
      });
  });
};

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

  const state = { formStatus: 'valid', urlList: [] };
  const watchedState = onChange(state, render(i18n, state, elements));

  const schemaStr = yup.string().required().url().trim();
  const schemaMix = yup.mixed().notOneOf([state.urlList]);

  const isValid = (url) => schemaStr.validate(url)
    .then((url1) => schemaMix.validate(url1))
    .then(() => true)
    .catch((e) => {
      watchedState.errorType = e.type;
      return false;
    });

  const routes = {
    rssPath: () => 'http://lorem-rss.herokuapp.com/feed',
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rssLink = e.target[0].value;

    if (isValid(rssLink)) {
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(routes.rssPath())}`)
        .then((response) => {
          const feed = parse(response.data.contents);
          console.log('ФИД', feed);
          watchedState.urlList.push(feed.feedTitle);
          watchedState.formStatus = 'success';
        })
        .catch((error) => {
          console.log(error.message);
          watchedState.formStatus = 'invalid';
        });
    } else {
      watchedState.formStatus = 'invalid';
    }
  });
};

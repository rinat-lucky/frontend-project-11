import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

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

  const validate = (url) => {
    schemaStr.validate(url)
      .then((url1) => schemaMix.validate(url1))
      .then((url2) => {
        watchedState.formStatus = 'success';
        watchedState.formStatus = 'valid';
        watchedState.formStatus = 'success';
        watchedState.urlList.push(url2);
      })
      .catch((e) => {
        watchedState.errorType = e.type;
        watchedState.formStatus = 'invalid';
        watchedState.formStatus = 'valid';
        watchedState.formStatus = 'invalid';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rssLink = e.target[0].value;
    validate(rssLink);
  });
};

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

  const isValid = (url) => schemaStr.validate(url)
    .then((url1) => schemaMix.validate(url1))
    .then(() => true)
    .catch((e) => {
      watchedState.errorType = e.type;
      console.log('rssLink is invalid', state);
      return false;
    });

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rssLink = e.target[0].value;

    console.log('ВАЛИДАЦИЯ', isValid(rssLink));

    // проверка не срабатывает, т.е. код никогда не уходит в блок ELSE
    // (например, если повторно введена имеющаяся ссылка) ?????
    if (isValid(rssLink)) {
      // axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(rssLink)}`)
      axios.get(`https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent('http://lorem-rss.herokuapp.com/feed?unit=second')}`)
        .then((response) => {
          const { feed, posts } = parse(response.data.contents);
          watchedState.rssLinks.push(rssLink);
          watchedState.feeds.push(feed);
          watchedState.posts.push(posts);
          watchedState.formStatus = 'success';
          watchedState.formStatus = 'valid';
          watchedState.formStatus = 'success';
          console.log('STATE after valid RSS', state);
        })
        .catch((error) => {
          console.log(error.message);
          watchedState.errorType = error.type;
          watchedState.formStatus = 'invalid';
          watchedState.formStatus = 'valid';
          watchedState.formStatus = 'invalid';
          console.log('STATE after invalid RSS', state);
        });
    } else {
      watchedState.formStatus = 'invalid';
      watchedState.formStatus = 'valid';
      watchedState.formStatus = 'invalid';
      console.log('STATE after invalid URL', state);
    }
  });
};

import './style.scss';
import 'bootstrap';
import * as yup from 'yup';
import onChange from 'on-change';
import render from './render.js';

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
  };

  const state = { formStatus: 'valid', urlList: [] };
  const watchedState = onChange(state, render(elements));

  const schema = yup.string().url().trim().required()
    .notOneOf(state.urlList);

  const validate = (url) => {
    schema.validate(url)
      .then((rss) => {
        watchedState.formStatus = 'success';
        // временный костыль (?), т.к. без него не обновляется форма
        //  при многократном успешном добавлении фидов
        watchedState.formStatus = 'valid';
        watchedState.formStatus = 'success';
        watchedState.urlList.push(rss);
        console.log('Валидный RSS', rss);
        console.log('STATE after add', state);
      })
      .catch((e) => {
        watchedState.formStatus = 'invalid';
        console.dir(e);
        console.log(e.message);
        console.log('STATE after error', state);
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rssLink = e.target[0].value;
    validate(rssLink);
  });
});

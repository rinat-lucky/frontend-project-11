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

  const state = onChange({
    urlForm: {
      state: 'valid',
    },
    urlList: [],
  }, render(elements));

  const schema = yup.string().url().trim().required()
    .notOneOf(state.urlList);

  const validate = (url) => {
    schema.validate(url)
      .then((rss) => {
        state.urlForm.state = 'success';
        state.urlList.push(rss);
        console.log('Валидный RSS', rss);
        console.log('STATE - success', state);
        return;
      })
      .catch((e) => {
        state.urlForm.state = 'invalid';
        console.log('Ошибка', e);
        console.log('Ошибка валидации', e.errors[0]);
        console.log('STATE - error', state);
        return;
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    validate(e.target[0].value);
  });
});

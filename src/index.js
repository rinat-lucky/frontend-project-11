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
      url: '',
    },
    urlList: [],
  }, render(elements));

  const schema = yup.string().url().trim().required()
    .notOneOf(state.urlList);

  const validate = (url) => {
    schema.validate(url).catch((e) => {
      console.log(e.errors[0]);
    });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    state.urlForm.url = e.target[0].value;

    // проверить настройки валидации !!!
    if (validate(state.urlForm.url)) {
      state.urlForm.state = 'valid';
      state.urlList.push(state.urlForm.url);
    } else {
      state.urlForm.state = 'invalid';
    }

    console.log('STATE after submit', state);
    console.log('VALIDATION', validate(state.urlForm.url));
  });
});

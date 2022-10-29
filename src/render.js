export default (i18n, state, elements) => (path, value) => {
  const {
    form, input, feedback, postsContainer, feedsContainer,
  } = elements;

  const renderFormError = () => {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    switch (state.errorType) {
      case 'url':
      case 'required':
        feedback.textContent = i18n.t('feedback.invalidUrl');
        break;
      case 'notOneOf':
        feedback.textContent = i18n.t('feedback.invalidNotOneOf');
        break;
      default:
        feedback.textContent = i18n.t('feedback.invalidUnknown');
    }
  };

  const renderFormSuccess = () => {
    input.classList.remove('is-invalid');
    feedback.classList.remove('text-danger');
    feedback.classList.add('text-success');
    feedback.textContent = i18n.t('feedback.success');
    form.reset();
    input.focus();
  };

  if (path === 'formStatus') {
    switch (value) {
      case 'valid':
        input.classList.remove('is-invalid');
        break;
      case 'invalid':
        return renderFormError();
      case 'success':
        return renderFormSuccess();
      default:
        throw new Error(`Unknown state: ${value}`);
    }
  }

  if (path === 'urlList') {
    postsContainer.replaceChildren();
    feedsContainer.replaceChildren();

    if (value.length === 0) return value;

    value.map((item) => {
      const postItem = document.createElement('li');
      // postItem.classList.add('list-group-item d-flex justify-content-between
      // align-items-start border-0 border-end-0');
      postItem.innerHTML = item;
      return postsContainer.append(postItem);
    });
  }
  return elements;
};

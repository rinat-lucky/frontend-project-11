export default (elements) => (path, value) => {
  const {
    input, feedback, postsContainer, feedsContainer,
  } = elements;

  if (path === 'urlForm.state') {
    switch (value) {
      case 'valid':
        input.classList.remove('is-invalid');
        break;
      case 'invalid':
        input.classList.add('is-invalid');
        feedback.classList.remove('text-success');
        feedback.classList.add('text-danger');
        feedback.textContent = 'Ссылка должна быть валидным URL';
        // feedback.textContent = 'RSS уже существует';
        break;
      case 'success':
        input.classList.remove('is-invalid');
        input.reset();
        feedback.classList.remove('text-dangers');
        feedback.classList.add('text-success');
        feedback.textContent = 'RSS успешно загружен';
        break;
      default:
        throw new Error(`Unknown state: ${value}`);
    }
  }

  if (path === 'urlList') {
    postsContainer.replaceChildren();
    feedsContainer.replaceChildren();
    // рендер списков постов и фидов
  }
};

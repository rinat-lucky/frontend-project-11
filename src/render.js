export default (elements) => (path, value) => {
  const {
    form, input, feedback, postsContainer, feedsContainer,
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
        // feedback.textContent = 'Ошибка сети';
        break;
      case 'success':
        input.classList.remove('is-invalid');
        form.reset();
        input.focus();
        feedback.classList.remove('text-danger');
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

    if (value.length === 0) return;
    
    value.map((item) => {
      const postItem = document.createElement('li');
      // postItem.classList.add('list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');
      postItem.innerHTML = item;
      postsContainer.append(postItem);
    })
  }
};

export default (i18n, state, elements) => (path, value) => {
  const {
    form, input, feedback, postsContainer, feedsContainer,
    modalTitle, modalDescr, modalReadBtn, modalCloseBtn,
  } = elements;

  const renderFormError = () => {
    input.classList.add('is-invalid');
    feedback.classList.remove('text-success');
    feedback.classList.add('text-danger');
    switch (state.error) {
      case 'url':
      case 'required':
        feedback.textContent = i18n.t('feedback.invalidUrl');
        break;
      case 'notOneOf':
        feedback.textContent = i18n.t('feedback.invalidNotOneOf');
        break;
      case 'network error':
        feedback.textContent = i18n.t('feedback.invalidNetwork');
        break;
      case 'invalid rss':
        feedback.textContent = i18n.t('feedback.invalidRSS');
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

  const renderContent = () => {
    postsContainer.replaceChildren();
    feedsContainer.replaceChildren();
    if (state.feeds.length === 0) return state.feeds;

    const feedsInnerContainer = document.createElement('div');
    feedsInnerContainer.setAttribute('class', 'card border-0');
    feedsInnerContainer.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18n.t('feeds')}</h2></div>`;
    const feedsList = document.createElement('ul');
    feedsList.setAttribute('class', 'list-group border-0 rounded-0');
    feedsInnerContainer.append(feedsList);
    feedsContainer.append(feedsInnerContainer);
    state.feeds.map((feed) => {
      const feedItem = document.createElement('li');
      feedItem.setAttribute('class', 'list-group-item border-0 border-end-0');
      feedItem.innerHTML = `<h3 class="h6 m-0">${feed.feedTitle}</h3><p class="m-0 small text-black-50">${feed.feedDescr}</p>`;
      return feedsList.prepend(feedItem);
    });

    const postsInnerContainer = document.createElement('div');
    postsInnerContainer.setAttribute('class', 'card border-0');
    postsInnerContainer.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18n.t('posts')}</h2></div>`;
    const postsList = document.createElement('ul');
    postsList.setAttribute('class', 'list-group border-0 rounded-0');
    postsInnerContainer.append(postsList);
    postsContainer.append(postsInnerContainer);
    state.posts.flat().map((post) => {
      const postItem = document.createElement('li');
      postItem.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');

      const postLink = document.createElement('a');
      postLink.setAttribute('href', `${post.postLink}`);

      if (post.hasBeenRead) {
        postLink.setAttribute('class', 'fw-normal');
      } else {
        postLink.setAttribute('class', 'fw-bold');
      }

      postLink.setAttribute('data-id', `${post.postID}`);
      postLink.setAttribute('target', '_blank');
      postLink.setAttribute('rel', 'noopener noreferrer');
      postLink.textContent = post.postTitle;

      const postButton = document.createElement('button');
      postButton.setAttribute('type', 'button');
      postButton.setAttribute('class', 'btn btn-outline-primary btn-sm');
      postButton.setAttribute('data-id', `${post.postID}`);
      postButton.setAttribute('data-bs-toggle', 'modal');
      postButton.setAttribute('data-bs-target', '#modal');
      postButton.textContent = i18n.t('buttonRead');
      postButton.addEventListener('click', (e) => {
        e.preventDefault();
        console.log('EVENT-TARGET (модалка)', e.target);
        // изменить статус (состояние) у кликнутой ссылки (id из дата-атрибута)

        modalTitle.textContent = post.postTitle;
        modalDescr.textContent = post.postDescr;
        modalReadBtn.setAttribute('href', `${post.postLink}`);
        modalReadBtn.textContent = i18n.t('modal.read');
        modalCloseBtn.textContent = i18n.t('modal.close');
      });
      postItem.append(postLink);
      postItem.append(postButton);
      return postsList.prepend(postItem);
    });

    return state;
  };

  if (path === 'formStatus') {
    switch (value) {
      case 'valid':
        input.classList.remove('is-invalid');
        break;
      case 'updated':
        renderContent();
        break;
      case 'invalid':
        renderFormError();
        break;
      case 'success':
        renderFormSuccess();
        renderContent();
        break;
      default:
        throw new Error(`Unknown state: ${value}`);
    }
  }

  return elements;
};

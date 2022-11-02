export default (i18n, state, elements) => (path, value) => {
  const {
    form, input, feedback, postsContainer, feedsContainer,
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
      postItem.innerHTML = `<a href="${post.postLink}" class="fw-bold" data-id="${post.postID}" target="_blank" rel="noopener noreferrer">${post.postTitle}</a><button type="button" class="btn btn-outline-primary btn-sm" data-id="504" data-bs-toggle="modal" data-bs-target="#modal">${i18n.t('buttonRead')}</button></li>`;
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

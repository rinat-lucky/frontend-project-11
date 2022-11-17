const createInnerContainer = (container, i18n) => {
  const innerContainer = document.createElement('div');
  innerContainer.setAttribute('class', 'card border-0');
  innerContainer.innerHTML = `<div class="card-body"><h2 class="card-title h4">${i18n.t(`${container.id}`)}</h2></div>`;
  const itemsList = document.createElement('ul');
  itemsList.setAttribute('class', 'list-group border-0 rounded-0');
  innerContainer.append(itemsList);
  return container.append(innerContainer);
};

const createFeedItem = (feed) => {
  const feedItem = document.createElement('li');
  feedItem.setAttribute('class', 'list-group-item border-0 border-end-0');
  const feedHeader = document.createElement('h3');
  feedHeader.textContent = feed.feedTitle;
  feedHeader.setAttribute('class', 'h6 m-0');
  feedItem.append(feedHeader);
  const feedBody = document.createElement('p');
  feedBody.textContent = feed.feedDescr;
  feedBody.setAttribute('class', 'm-0 small text-black-50');
  feedItem.append(feedBody);
  return feedItem;
};

const handleReadButton = (state, elements, i18n) => {
  const { modal } = elements;
  const modalTitle = modal.querySelector('.modal-title');
  const modalDescr = modal.querySelector('.modal-descr');
  const modalReadBtn = modal.querySelector('.modal-link');
  const modalCloseBtn = modal.querySelector('.modal-close');

  const currentPost = state.posts.find((post) => post.postID === state.currentVisitedPostID);
  modalTitle.textContent = currentPost.postTitle;
  modalDescr.textContent = currentPost.postDescr;
  modalReadBtn.setAttribute('href', `${currentPost.postLink}`);
  modalReadBtn.textContent = i18n.t('modal.read');
  modalCloseBtn.textContent = i18n.t('modal.close');
  const postElem = document.querySelector(`[data-id="${currentPost.postID}"]`);
  postElem.classList.remove('fw-bold');
  postElem.classList.add('fw-normal');
};

const createPostItem = (post, state, i18n) => {
  const postItem = document.createElement('li');
  postItem.setAttribute(
    'class',
    'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0',
  );

  const postLink = document.createElement('a');
  postLink.setAttribute('href', `${post.postLink}`);

  if (state.visitedPostsID.includes(post.postID)) {
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
  postButton.textContent = i18n.t('postButtonRead');
  postItem.append(postLink);
  postItem.append(postButton);
  return postItem;
};

const renderFormError = (state, elements, i18n) => {
  const { input, submit, feedback } = elements;
  submit.disabled = false;
  input.classList.add('is-invalid');
  feedback.classList.remove('text-success');
  feedback.classList.add('text-danger');
  switch (state.error) {
    case 'url':
      feedback.textContent = i18n.t('feedback.invalidUrl');
      break;
    case 'required':
      feedback.textContent = i18n.t('feedback.invalidRequired');
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

const renderFormSuccess = (elements, i18n) => {
  const {
    form, input, submit, feedback,
  } = elements;
  submit.disabled = false;
  input.classList.remove('is-invalid');
  feedback.classList.remove('text-danger');
  feedback.classList.add('text-success');
  feedback.textContent = i18n.t('feedback.success');
  form.reset();
  input.focus();
};

const renderContent = (state, elements, i18n) => {
  const {
    postsContainer, feedsContainer,
  } = elements;

  feedsContainer.replaceChildren();
  postsContainer.replaceChildren();
  if (state.feeds.length === 0) return state.feeds;

  createInnerContainer(feedsContainer, i18n);
  createInnerContainer(postsContainer, i18n);

  const feedsList = feedsContainer.querySelector('ul');
  const postsList = postsContainer.querySelector('ul');

  state.feeds.forEach((feed) => feedsList.prepend(createFeedItem(feed)));
  state.posts.flat().forEach((post) => {
    postsList.prepend(createPostItem(post, state, i18n));
  });
  return state;
};

const handleFormState = (state, elements, i18n) => {
  const { input, submit, feedback } = elements;
  switch (state.formState) {
    case 'filling':
      submit.disabled = false;
      input.classList.remove('is-invalid');
      feedback.textContent = '';
      break;
    case 'sending':
      submit.disabled = true;
      feedback.textContent = i18n.t('feedback.loading');
      break;
    case 'success':
      return renderFormSuccess(elements, i18n);
    case 'error':
      return renderFormError(state, elements, i18n);
    default:
      throw new Error(`Unknown state: ${state.formState}`);
  }
  return state;
};

export default (state, elements, i18n) => (path) => {
  switch (path) {
    case 'formState':
      return handleFormState(state, elements, i18n);
    case 'feeds':
    case 'posts':
      return renderContent(state, elements, i18n);
    case 'visitedPostsID':
      handleReadButton(state, elements, i18n);
      return renderContent(state, elements, i18n);
    default:
      throw new Error(`Unknown path: ${path}`);
  }
};

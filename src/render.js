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
  feedItem.innerHTML = `<h3 class="h6 m-0">${feed.feedTitle}</h3><p class="m-0 small text-black-50">${feed.feedDescr}</p>`;
  return feedItem;
};

const handleReadButton = (event, post, state, elements, i18n) => {
  const visitedPostID = event.target.dataset.id;
  const targetPostVisit = state.postsVisits
    .flat()
    .find((postVisit) => postVisit.postID === visitedPostID);
  targetPostVisit.visited = true;
  const { modal } = elements;
  const modalTitle = modal.querySelector('.modal-title');
  const modalDescr = modal.querySelector('.modal-descr');
  const modalReadBtn = modal.querySelector('.modal-link');
  const modalCloseBtn = modal.querySelector('.modal-close');
  modalTitle.textContent = post.postTitle;
  modalDescr.textContent = post.postDescr;
  modalReadBtn.setAttribute('href', `${post.postLink}`);
  modalReadBtn.textContent = i18n.t('modal.read');
  modalCloseBtn.textContent = i18n.t('modal.close');
  const link = event.target.previousElementSibling;
  link.classList.remove('fw-bold');
  link.classList.add('fw-normal');
};

const createPostItem = (post, state, elements, i18n) => {
  const postItem = document.createElement('li');
  postItem.setAttribute('class',
    'list-group-item d-flex justify-content-between align-items-start border-0 border-end-0');

  const postLink = document.createElement('a');
  postLink.setAttribute('href', `${post.postLink}`);
  const targetPostVisit = state.postsVisits
    .flat()
    .find((postVisit) => postVisit.postID === post.postID);

  if (targetPostVisit.visited) {
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
  postButton.addEventListener('click', (e) => {
    e.preventDefault();
    handleReadButton(e, post, state, elements, i18n);
  });
  postItem.append(postLink);
  postItem.append(postButton);
  return postItem;
};

const renderFormError = (state, elements, i18n) => {
  const { input, feedback } = elements;
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

const renderFormSuccess = (elements, i18n) => {
  const { form, input, feedback } = elements;
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

  state.feeds.map((feed) => feedsList.prepend(createFeedItem(feed)));
  state.posts.flat().map((post) => postsList.prepend(createPostItem(post, state, elements, i18n)));
  return state;
};

export default (state, elements, i18n) => (path, value) => {
  if (path === 'status') {
    switch (value) {
      case 'valid':
        elements.input.classList.remove('is-invalid');
        break;
      case 'updated':
        renderContent(state, elements, i18n);
        break;
      case 'invalid':
        renderFormError(state, elements, i18n);
        break;
      case 'success':
        renderFormSuccess(elements, i18n);
        renderContent(state, elements, i18n);
        break;
      default:
        throw new Error(`Unknown state: ${value}`);
    }
  }
  return state;
};

import onChange from 'on-change';
import uniqueId from 'lodash/uniqueId.js';
import render from './render.js';
import { validate, getData, parse } from './utils.js';

const TIMER = 10000;

export default (i18n) => {
  const elements = {
    form: document.querySelector('form'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('[type="submit"]'),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modal: document.querySelector('.modal'),
  };

  const state = {
    formState: 'filling',
    rssLinks: [],
    feeds: [],
    posts: [],
    visitedPostsID: [],
  };
  const watchedState = onChange(state, render(state, elements, i18n));

  const updateRss = () => {
    const promises = state.rssLinks.map((url) => {
      getData(url)
        .then((rss) => {
          const updatingFeed = state.feeds.find((feed) => feed.feedLink === url);
          const { feed, posts } = parse(rss.data.contents);
          feed.id = updatingFeed.id;
          const newPosts = posts.filter((post) => {
            const collOfPostsLinks = state.posts.map((postInState) => postInState.postLink);
            return !collOfPostsLinks.includes(post.postLink);
          });

          if (newPosts.length === 0) return;
          newPosts.forEach((post) => {
            post.postID = uniqueId();
            post.feedID = feed.id;
          });
          watchedState.posts = [...state.posts, ...newPosts];
        })
        .catch((error) => {
          throw new Error(`Ошибка при обновлении фида: ${url}`, error);
        });
      return state;
    });
    Promise.all(promises)
      .then(setTimeout(() => {
        updateRss();
      }, TIMER))
      .catch((error) => {
        throw new Error(error);
      });
  };

  const addNewRss = (parsedRss, link) => {
    const { feed, posts } = parsedRss;
    feed.id = uniqueId();
    feed.feedLink = link;
    watchedState.feeds.push(feed);
    posts.forEach((post) => {
      const { postTitle, postDescr, postLink } = post;
      const postID = uniqueId();
      const feedID = feed.id;
      watchedState.posts.push({
        postTitle, postDescr, postLink, postID, feedID,
      });
    });
  };

  const handleEnteredLink = (link) => {
    validate(link, state.rssLinks)
      .then((validURL) => {
        watchedState.formState = 'sending';
        return getData(validURL);
      })
      .then((rss) => {
        const parsedRss = parse(rss.data.contents);
        addNewRss(parsedRss, link);
        state.rssLinks.push(link);
        state.error = '';
        watchedState.formState = 'success';
      })
      .catch((err) => {
        state.error = err.type ?? err.message.toLowerCase();
        watchedState.formState = 'error';
      });
  };

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    handleEnteredLink(formData.get('url'));
  });

  elements.postsContainer.addEventListener('click', (e) => {
    e.preventDefault();
    state.currentVisitedPostID = e.target.dataset.id;
    watchedState.visitedPostsID.push(e.target.dataset.id);
  });

  updateRss();
};

const $button = document.querySelector('.js-submit');
const $form = document.querySelector('.js-form');
const $list = document.querySelector('.js-list');
const $inputs = document.querySelectorAll('.js-username');
const $spinner = document.querySelector('.js-spinner');

const startLoading = () => $spinner.classList.remove('js-hidden');
const stopLoading = () => $spinner.classList.add('js-hidden');
const showError = message => {
  $list.innerHTML = message;
  stopLoading();
};

const retrieveReposIdsFromList = list => list.map(repo => repo.id);
const retrieveUsernames = () => [...$inputs].map(input => input.value);

const fetchStarredReposForUser = username => {
  const promise = fetch(`https://api.github.com/users/${username}/starred?per_page=100`);
  return promise.then(response => response.json());
};

const buildStargazzers = usernames => {
  const promises = [];

  if (!usernames.length || !usernames[0] || !usernames[1]) {
    throw new Error('Sorry, you need to pass Github usernames first');
  }

  startLoading();

  usernames.forEach(username => promises.push(fetchStarredReposForUser(username)));

  // this could be much easier, and allow more usernames
  Promise.all(promises)
    .catch(function(err) {
        // log that I have an error, return the entire array;
        console.log('A promise failed to resolve', err);
        return arrayOfPromises;
    })
    .then(starredRepos => {
      try {
        const starredIds = starredRepos.map(repo => retrieveReposIdsFromList(repo));
        const stargazers = starredIds[0].filter(n => starredIds[1].indexOf(n) != -1);
        render(starredRepos[0].filter(repo => stargazers.indexOf(repo.id) != -1));
      } catch (error) {
          showError('Ooops, typo in username?');
      }
    }, reject => {
      showError('Ooops, cannot complete request ;<');
    });
};

const render = data => {
  stopLoading();
  const list = data.map(repo => template(repo));

  const $wrapper = document.createElement('div');
  $wrapper.innerHTML = list.join('');
  $list.innerHTML = '';
  $list.appendChild($wrapper);
};

const onSubmit = event => {
  const usernames = retrieveUsernames();
  try {
    buildStargazzers(usernames);
  } catch (error) {
    showError(error.message);
  }
};

$form.addEventListener('submit', e => event.preventDefault());
$button.addEventListener('click', onSubmit);

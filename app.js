const $button = document.querySelector('.js-submit');
const $list = document.querySelector('.js-list');
const $inputs = document.querySelectorAll('.js-username');

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

  usernames.forEach(username => promises.push(fetchStarredReposForUser(username)));

  // this could be much easier, and allow more usernames
  Promise.all(promises).then(starredRepos => {
    const starredIds = starredRepos.map(repo => retrieveReposIdsFromList(repo));
    const stargazers = starredIds[0].filter(n => starredIds[1].indexOf(n) != -1);
    render(starredRepos[0].filter(repo => stargazers.indexOf(repo.id) != -1));
  });
};

const render = data => {
  const list = data.map(repo => template(repo));

  const $wrapper = document.createElement('div');
  $wrapper.innerHTML = list.join('');
  $list.innerHTML = '';
  $list.appendChild($wrapper);
};

$button.addEventListener('click', event => {
  const usernames = retrieveUsernames();
  buildStargazzers(usernames);
});

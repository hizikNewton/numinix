const searchEl = document.querySelector('.searchInput');
const output = document.getElementById('userLists');

const result = document.querySelector('.result');

const renderData = (users, searchCriteria) => {
  output.innerHTML = '';
  if (users.length == 0 && searchCriteria) {
    const noUserFound = `
      <p> “no customer(s) found with the search criteria ${searchCriteria}.”</p>
    `;
    let outputString = document.createElement('div');
    outputString.innerHTML = noUserFound;
    output.appendChild(outputString);
  }
  users.map((result) => {
    const {
      name,
      username,
      pictureUrl,
      company: { name: companyName, catchPhrase, bs },
      email,
      phone,
      address: {
        geo: { lat, lng },
        ...addr
      },
      website,
    } = result;
    const userElement = `
        <div class="article-header">
        <figure>
          <img
            src=${pictureUrl}
            alt="Preview"
          />
        </figure>
        <div class="article-bio">
          <h2>${name}</h2>
          <p class="username">@${username}</p>
          <p class="catchphrase">${catchPhrase}</p>
        </div>
        </div>
        <div class="divider"></div>
        <div class="article-preview">
          <p><span><img src="./assets/mail.svg"/></span>${email}</p>
          <p><span class="address"><img src="./assets/location.svg"/></span>${Object.values(
            addr
          ).join(',')},${lat},${lng}
          <p><span><img src="./assets/phone.svg"/></span>${phone}</p>
          <p><span><img src="./assets/website.svg"/></span>${website}</p>
          <p><span><img src="./assets/company.svg"/></span>${companyName}</p>
          <p><span><img src="./assets/industrial.svg"/></span>${bs}</p>
        </div>`;
    let outputString = document.createElement('article');
    outputString.innerHTML = userElement;
    output.appendChild(outputString);
  });
};
let users = [];

window.addEventListener('load', () => {
  fetchUsers();
});

searchEl.addEventListener('input', (event) => {
  let searchQuery = event.target.value;
  let filtered = users.filter(({ name }) => {
    return name.toLowerCase().includes(searchQuery.toLowerCase());
  });
  renderData(filtered, searchQuery);
});

async function fetchUsers(query) {
  const response = await fetch('https://jsonplaceholder.typicode.com/users');
  let randomUserApi = await fetch('https://randomuser.me/api?results=10');
  randomUserApi = await randomUserApi.json();
  users = await response.json();
  users = users.map((i,idx)=>({...i,pictureUrl:randomUserApi.results[idx].picture.large}))
  renderData(users);
}

let dropdown = document.querySelector('.dropdown');
let listEl = document.querySelector('.menu');
let descEl = document.getElementById('asc');
let filterEl = document.querySelector('.icon');

dropdown.addEventListener('click', (e) => {
  if (dropdown.classList.contains('closed')) {
    dropdown.classList.remove('closed');
  } else {
    dropdown.classList.add('closed');
  }
});

window.addEventListener('click', function (e) {
  if (!dropdown.contains(e.target)) {
    dropdown.classList.add('closed');
  }
});

listEl.addEventListener('click', (e) => {
  if (e.target && e.target.matches('li.asc')) {
    users.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }
  if (e.target && e.target.matches('li.desc')) {
    users.sort(function (a, b) {
      if (a.name > b.name) {
        return -1;
      }
      if (a.name < b.name) {
        return 1;
      }
      return 0;
    });
  }
  filterEl.innerHTML = `Filter by ${e.target.textContent}`;
  renderData(users);
});

const APIURL = "https://api.github.com/users/";
const form = document.getElementById("form");
const main = document.getElementById("main");
const search = document.getElementById("search");
async function getUser(username) {
  const resp = await fetch(APIURL + username);
  const respData = await resp.json();
  if (resp.status == 404) {
    createErrorCard("No hay perfiles con este nombre de usuario");
    return;
  } else {
    createUserCard(respData);
    getRepos(username);
  }
}
async function getRepos(username) {
  const resp = await fetch(APIURL + username + "/repos?sort=created");
  const respData = await resp.json();
  addReposToCard(respData);
}
function createUserCard(user) {
    console.log(user);
    if (user.bio==null){
        user.bio=""
    }
  const cardHTML = `
    <div class="card">
        <div>
            <img class="avatar" src="${user.avatar_url}" alt="${user.name}">
        </div>
        <div class="user-info">
            <h2>${user.name}</h2>
            <p>${user.bio}</p>
            <ul class="info">
                <li>${user.followers} <strong>Seguidores</strong></li>
                <li>${user.following} <strong>Siguiendo</strong></li>
                <li>${user.public_repos} <strong>Repositorios</strong></li>
            </ul>
            <div id="repos"></div>
        </div>
    </div>
    `;
  main.innerHTML = cardHTML;
}
function createErrorCard(msg) {
  const cardHTML = `
    <div class="card">
        <h1>${msg}</h1>
    </div>
    `;
  main.innerHTML = cardHTML;
}
function addReposToCard(repos) {
  const reposEl = document.getElementById("repos");
  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement("a");
    repoEl.classList.add("repo");
    repoEl.href = repo.html_url;
    repoEl.target = "_blank";
    repoEl.innerText = repo.name;
    reposEl.appendChild(repoEl);
  });
}
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = search.value;
  if (user) {
    getUser(user);
    search.value = "";
  }
});

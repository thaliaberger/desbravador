const input = document.getElementById("user-search");
const btn = document.getElementById("search-btn");
const searchError = document.getElementById("error");

// DADOS DO USUÁRIO

const userDetails = document.getElementById("user-details");
const userImage = document.getElementById("user-img");
const userName = document.getElementById("user-name");
const seguidores = document.getElementById("seguidores");
const seguindo = document.getElementById("seguindo");
const email = document.getElementById("email");
const bio = document.getElementById("bio");
const lista = document.getElementById("lista");

//DADOS REPOSITÓRIO

const repoDetails = document.getElementById("repo-details");
const repoName = document.getElementById("repo-name");
const repoDescription = document.getElementById("repo-description");
const repoStars = document.getElementById("repo-stars");
const repoLanguage = document.getElementById("repo-language");
const repoGitHubLink = document.getElementById("repo-github-link");
const selection = document.getElementById("selection");
const voltarLink = document.getElementById("voltar-link");

// PESQUISA DE USUÁRIO

btn.onclick = function () {
  fetch(`https://api.github.com/users/${input.value}`)
    .then(function (response) {
      if (!response.ok) {
        searchError.setAttribute("style", "display: block");
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(function (data) {
      userDetails.setAttribute("style", "display: block");
      userName.innerText = data.name;
      userImage.setAttribute("src", `${data.avatar_url}`);
      seguidores.innerText = data.followers;
      seguindo.innerText = data.following;
      data.email === null
        ? (email.innerText = "Nenhum email cadastrado")
        : (email.innerText = data.email);
      data.bio === null
        ? (bio.innerText = "Nenhuma bio cadastrada")
        : (bio.innerText = data.bio);
    })
    .catch(function (error) {
      console.log(error);
    });

  // RENDERIZAR REPOSITÓRIOS

  fetch(`https://api.github.com/users/${input.value}/repos`)
    .then(function (response) {
      if (!response.ok) throw new Error(response.status);
      return response.json();
    })
    .then(function (data) {
      function repoInfo() {
        if (selection.value === "menos-estrelas") {
          data.sort((a, b) => {
            return a.stargazers_count - b.stargazers_count;
          });
        } else {
          data.sort((a, b) => {
            return b.stargazers_count - a.stargazers_count;
          });
        }

        data.map((repositorio) => {
          let li = document.createElement("li");
          let eachRepoLink = document.createElement("a");

          lista.appendChild(li);
          li.innerText = `${repositorio.name} - ${repositorio.stargazers_count} stars`;

          lista.appendChild(eachRepoLink);
          eachRepoLink.setAttribute("id", `${repositorio.name}`);
          eachRepoLink.setAttribute("href", `#${repositorio.name}`);
          eachRepoLink.innerText = "Ver mais";

          eachRepoLink.onclick = function () {
            userDetails.setAttribute("style", "display: none");
            repoDetails.setAttribute("style", "display: block");

            // RENDERIZAR DETALHES DE CADA REPOSITÓRIO

            fetch(
              `https://api.github.com/repos/${input.value}/${eachRepoLink.id}`
            )
              .then(function (response) {
                if (!response.ok) throw new Error(response);
                return response.json();
              })
              .then(function (data) {
                repoName.innerText = data.name;
                data.description === null
                  ? (repoDescription.innerText = "Nenhuma descrição")
                  : (repoDescription.innerText = data.description);

                repoStars.innerText = data.stargazers_count;
                repoLanguage.innerText = data.language;
                repoGitHubLink.setAttribute("href", `${data.owner.html_url}`);
              })
              .catch(function (error) {
                console.log(error.message);
              });
          };
        });
      }

      repoInfo();

      // ALTERAR ORDEM DA LISTA DE REPOSITÓRIOS

      selection.onchange = function () {
        lista.innerHTML = "";
        repoInfo();
      };
    })
    .catch(function (error) {
      console.log(error);
    });
};

// VOLTAR PARA O USUÁRIO

voltarLink.onclick = function () {
  userDetails.setAttribute("style", "display: block");
  repoDetails.setAttribute("style", "display: none");
};

// LIMPAR ERRO

input.onfocus = function () {
  searchError.setAttribute("style", "display: none");
};

var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
);
var sharedMemories = document.querySelector('#shared-memories');

async function openCreatePostModal() {
  createPostArea.style.display = 'block';

  if (defferedPrompt) {
    defferedPrompt.prompt();

    const choiceUser = await defferedPrompt.userChoice();
    console.log(choiceUser.outcome);

    if (choiceUser.outcome === 'dismissed') {
      console.log('User cancelled installed');
    } else {
      console.log('user added to home screen');
    }

    defferedPrompt = null;
  }
}

function closeCreatePostModal() {
  createPostArea.style.display = 'none';
}

shareImageButton.addEventListener('click', openCreatePostModal);

closeCreatePostModalButton.addEventListener('click', closeCreatePostModal);

function createCard() {
  const cardWrapper = document.createElement('div');
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

  const cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = 'url("/src/images/sf-boat.jpg")';
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);

  const cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.style.color = 'black';
  cardTitleTextElement.textContent = 'San Francisco Trips';
  cardTitle.appendChild(cardTitleTextElement);

  const cardSupportText = document.createElement('div');
  cardSupportText.className = 'mdl-card__supporting-text';
  cardSupportText.textContent = 'In San Francisco';
  cardSupportText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportText);

  componentHandler.upgradeElement(cardWrapper);
  sharedMemories.appendChild(cardWrapper);
}

fetch('http://httpbin.org/get')
  .then(res => res.json())
  .then(() => createCard())
  .catch(err => console.log(err));

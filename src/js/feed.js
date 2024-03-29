var shareImageButton = document.querySelector('#share-image-button');
var createPostArea = document.querySelector('#create-post');
var form = document.querySelector('#form');
var closeCreatePostModalButton = document.querySelector(
  '#close-create-post-modal-btn'
);
var sharedMemories = document.querySelector('#shared-memories');

// offline data
db.enablePersistence().catch(err => {
  if (err.code == 'faild-precondition') {
    console.log('presistence failed: probably multiple tabs open');
  }

  if (err.code == 'unimplemented') {
    console.log('presistence is not available : lack of browser support');
  }
});

// real-time listener
db.collection('posts').onSnapshot(snapshot => {
  snapshot.docChanges().forEach(change => {
    if (change.type === 'added') {
      // add the document to web page
      createCard(change.doc.data(), change.doc.id);
    }

    if (change.type === 'removed') {
      // remove the document from web page
    }
  });
});

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

function createCard(data, id) {
  const cardWrapper = document.createElement('div');
  cardWrapper.id = id;
  cardWrapper.className = 'shared-moment-card mdl-card mdl-shadow--2dp';

  const cardTitle = document.createElement('div');
  cardTitle.className = 'mdl-card__title';
  cardTitle.style.backgroundImage = `url(${data.image})`;
  cardTitle.style.backgroundSize = 'cover';
  cardTitle.style.height = '180px';
  cardWrapper.appendChild(cardTitle);

  const cardTitleTextElement = document.createElement('h2');
  cardTitleTextElement.className = 'mdl-card__title-text';
  cardTitleTextElement.style.color = 'black';
  cardTitleTextElement.textContent = data.title;
  cardTitle.appendChild(cardTitleTextElement);

  const cardSupportText = document.createElement('div');
  cardSupportText.className = 'mdl-card__supporting-text';
  cardSupportText.textContent = data.location;
  cardSupportText.style.textAlign = 'center';
  cardWrapper.appendChild(cardSupportText);

  componentHandler.upgradeElement(cardWrapper);
  sharedMemories.appendChild(cardWrapper);
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const post = {
    title: form.title.value,
    location: form.location.value,
    image: form.image.value
  };

  // add to firestore database

  db.collection('posts')
    .add(post)
    .catch(err => console.log('error in adding post to firestore', err));

  form.reset();
});

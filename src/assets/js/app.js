
const inputImage = document.getElementById('inputImage');
const btnUpload = document.getElementById('btnUpload');
const previewImg = document.querySelector('.uploaded');
const downloadImg = document.querySelector('.downloaded');
const btnSend = document.getElementById('sendRequest');
const uploaderContainer = document.getElementById('uploader');
const loadImageButton = document.getElementById('load-image');
const newGenImg = document.getElementById('newGenarate');

btnUpload.addEventListener('click', () => {
  inputImage.click();
});

const loader = document.querySelector('.loader');
const formData = new FormData();

inputImage.addEventListener('change', () => {
  const file = inputImage.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    previewImg.src = reader.result;
    formData.append('image', reader.result);
    uploaderContainer.classList.add('hidden');
    previewImg.classList.add('visible');
  });

  if (file) {
    reader.readAsDataURL(file);
  }
});


const checkboxes = document.querySelectorAll('input[type=checkbox]');
let values = [];

const sendImg = () => {
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked === true) {
      values.push(checkbox.value);
    }
  });

  if (values.length) {
    loader.classList.add('visible');
    formData.append('text', values);

    fetch('https://api.deepai.org/api/image-editor', {
        method: 'POST',
        body: formData,
        headers: {
          'api-key': 'f7cd0d24-d07c-4416-ac17-019b78cfc83b',
        }
      })
      .then(response => {
        return response.json();
      })
      .then(data => {
        if (data.output_url) {
          downloadImg.src = data.output_url;
          downloadImg.addEventListener('load', () => {
            downloadImg.classList.add('visible');
            loadImageButton.classList.add('visible');
          });
        } else {
          btnUpload.classList.remove('hidden');
        }
      })
      .catch(error => console.error(error))
      .finally(() => {
        loader.classList.remove('visible');
        btnSend.classList.add('hidden');
        newGenImg.classList.add('visible');
      });
    }
};

btnSend.addEventListener('click', sendImg);
loadImageButton.addEventListener('click', downloadImage);
newGenImg.addEventListener('click', resetState);

function downloadImage() {
  const imageUrl = document.getElementById('img-load').getAttribute('src');
  fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'image.png';
      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
}

function resetState() {
  const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  downloadImg.classList.remove('visible');
  previewImg.classList.remove('visible');
  loadImageButton.classList.remove('visible');
  uploaderContainer.classList.remove('hidden');
  values = [];
  for (let i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  newGenImg.classList.remove('visible')
  btnSend.classList.remove('hidden');
}

const btnDonate = document.getElementById('btnDonate');
const modalDonate = document.querySelector('.donate-modal');
const closeModal = document.querySelector('.close-modal');

btnDonate.addEventListener('click', openCloseModal);
function openCloseModal(event) {
  if (modalDonate.classList.contains('visible')) {
   modalDonate.classList.remove('visible');
  } else {
    modalDonate.classList.add('visible');
  }
}

closeModal.addEventListener('click', handlerCloseModal)
function handlerCloseModal() {
  modalDonate.classList.remove('visible');
}


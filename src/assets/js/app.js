const accordionEvent = () => {
  if (!document.querySelector('.js-accordion')) return;

  const accordionTitle = document.querySelectorAll('.js-accordion-title');

  accordionTitle.forEach((title) => {
    title.addEventListener('click', () => {
      if (!title.closest('.js-accordion')) return;

      const isActive = title.closest('.js-accordion-item').classList.contains('active');
      const accordionBody = title.nextElementSibling;

      const activeEl = title.closest('.js-accordion').querySelector('.active');

      if (activeEl) {
        activeEl.classList.remove('active');
        activeEl.querySelector('.js-accordion-body').style.maxHeight = null;
      }

      if (!isActive) {
        title.closest('.js-accordion-item').classList.add('active');
  
        if (accordionBody.style.maxHeight) {
          accordionBody.style.maxHeight = null;
        } else {
          accordionBody.style.maxHeight = accordionBody.scrollHeight + 'px';
        }
      }
    });
  });
};

const customSelect = () => {
  var x, i, j, l, ll, selElmnt, a, b, c;

  x = document.getElementsByClassName('js-select');
  l = x.length;

  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0];
    ll = selElmnt.length;
    
    a = document.createElement('DIV');
    a.setAttribute('class', 'select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    
    b = document.createElement('DIV');
    b.setAttribute('class', 'select-items select-hide');

    for (j = 1; j < ll; j++) {
      c = document.createElement('DIV');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function(e) {
          var y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName('select')[0];
          sl = s.length;
          h = this.parentNode.previousSibling;

          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName('same-as-selected');
              yl = y.length;
              for (k = 0; k < yl; k++) {
                y[k].removeAttribute('class');
              }
              this.setAttribute('class', 'same-as-selected');
              break;
            }
          }
          h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener('click', function(e) {
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle('select-hide');
        this.classList.toggle('select-arrow-active');
      });
  }
  function closeAllSelect(elmnt) {
    var x, y, i, xl, yl, arrNo = [];

    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected');
    xl = x.length;
    yl = y.length;

    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i)
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }

    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }

  document.addEventListener('click', closeAllSelect);
};

const mmenu = () => {
  const mmenuWrapper = document.querySelector('.mmenu');
  const openButton = document.querySelector('.js-open-menu');
  const closeButton = document.querySelector('.js-close-menu');

  openButton.addEventListener('click', () => {
    mmenuWrapper.classList.add('active');
  });

  closeButton.addEventListener('click', () => {
    mmenuWrapper.classList.remove('active');
  });
};

const lazy = () => {
  var lazyImages = [].slice.call(document.querySelectorAll('*[data-src]'));

  if ('IntersectionObserver' in window) {
    let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          lazyImage.classList.add('loaded');
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    }, {
      rootMargin: '0px 0px 500px 0px',
      threshold: 0
    });

    lazyImages.forEach(function(lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
}

const inputImage = document.getElementById('inputImage');
const btnUpload = document.getElementById('btnUpload');
const preview = document.getElementById('preview');
const btnSend = document.getElementById('sendRequest');
const uploaderContainer = document.getElementById('uploader');
const resultImage = document.getElementById('result-img');

btnUpload.addEventListener('click', () => {
  inputImage.click();
});

const loader = document.querySelector('.loader');
const formData = new FormData();

inputImage.addEventListener('change', () => {
  const file = inputImage.files[0];
  const reader = new FileReader();

  reader.addEventListener('load', () => {
    preview.innerHTML = `<img src="${reader.result}" alt="Изображение">`;
    formData.append('image', reader.result);
    uploaderContainer.classList.add('hidden');
    preview.classList.add('visible');
  });

  if (file) {
    reader.readAsDataURL(file);
  }
});

const sendImg = () => {
  const checkboxes = document.querySelectorAll('input[type=checkbox]:checked');
  const values = [];

  checkboxes.forEach((checkbox) => {
    values.push(checkbox.value);
  });

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
        const newImage = new Image();
        newImage.src = data.output_url;
        newImage.alt = 'Image';
        newImage.id = 'img-load';

        resultImage.classList.add('visible');
        preview.classList.add('hidden');
        resultImage.appendChild(newImage);
      } else {
        preview.classList.remove('visible');
        btnUpload.classList.remove('hidden');
      }
    })
    .catch(error => console.error(error))
    .finally(() => {
      loader.classList.remove('visible');
    });
};

btnSend.addEventListener('click', sendImg);

const loadImageButton = document.getElementById('load-image');

loadImageButton.addEventListener('click', downloadImage);

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

window.addEventListener('load', () => {
  lazy(); 
  mmenu();
  accordionEvent();
  customSelect();
});
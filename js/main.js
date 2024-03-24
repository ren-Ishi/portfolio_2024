class PortfolioBox {
  constructor(title, caption, imageUrl, link) {
    this.title = title;
    this.caption = caption;
    this.imageUrl = imageUrl;
    this.link = link;
  }

  generateHTML() {
    return `
      <div class="box" onclick="redirectToLink('../gallery/'+'${this.link}')">
        <img src="${this.imageUrl}">
        <h4>${this.title}</h4>
        <p>${this.caption}</p>
      </div>
    `;
  }
}

async function fetchJsonData() {
  try {
    const response = await fetch('../js/data.json');
    const jsonData = await response.json();
    return jsonData.map(item => new PortfolioBox(item.title, item.caption, item.imageUrl, item.link));
  } catch (error) {
    console.error('Error fetching JSON data:', error);
  }
}

window.redirectToLink = function(relativePath) {
  const newPath = new URL(relativePath, window.location.href).pathname;
  window.location.href = newPath;
};

window.addEventListener('DOMContentLoaded', async () => {
  const galleryTopSection = document.getElementById('galleryTop');
  const jsonData = await fetchJsonData();
  let currentPage = 1;
  let itemsPerPage = 12;

  function displayJsonData(startIndex, endIndex) {
    const htmlString = jsonData.slice(startIndex, endIndex).map(item => item.generateHTML()).join('');
    galleryTopSection.innerHTML = htmlString;

    // 空のボックスを追加
    for (let i = 0; i < 4; i++) {
      const emptyBoxHTML = '<div class="empty"></div>';
      galleryTopSection.innerHTML += emptyBoxHTML;
    }
  }

  function updatePageButtons() {
    const totalPages = Math.ceil(jsonData.length / itemsPerPage);
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.addEventListener('click', () => {
        currentPage = i;
        updatePageContent();
      });
      paginationContainer.appendChild(pageButton);
    }
  }

  function updatePageContent() {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    displayJsonData(startIndex, endIndex);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    updatePageButtons();
  }

  function updateItemsPerPage() {
    itemsPerPage = window.innerWidth >= 960 ? 12 : 6;
  }

  const prevButton = document.getElementById('prevButton');
  const nextButton = document.getElementById('nextButton');

  window.addEventListener('resize', () => {
    updateItemsPerPage();
    updatePageContent();
  });

  updateItemsPerPage();
  updatePageContent();
});

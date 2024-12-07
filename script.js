const startBtn = document.getElementById('startBtn');
        const searchBox = document.getElementById('searchBox');
        const searchBtn = document.getElementById('searchBtn');
        const wordInput = document.getElementById('wordInput');
        const loader = document.getElementById('loader');
        const result = document.getElementById('result');
        const imageContainer = document.getElementById('imageContainer');
        
        startBtn.addEventListener('click', () => {
            startBtn.style.display = 'none';
            searchBox.style.display = 'flex';
        });
        

        searchBtn.addEventListener('click', () => {
            const word = wordInput.value.trim();
            if (!word) {
                displayError('Please enter a word to search.');
                return;
            }
            fetchDefinition(word);
            fetchImage(word);
        });
        
        
        function fetchDefinition(word) {
            const apiURL = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
            loader.style.display = 'block'; 
            result.innerHTML = ''; 
        
            fetch(apiURL)
                .then(response => {
                    if (!response.ok) throw new Error('Word not found.');
                    return response.json();
                })
                .then(data => {
                    loader.style.display = 'none'; 
                    const wordData = data[0];
                    const meaning = wordData.meanings[0].definitions[0].definition;
                    const synonyms = wordData.meanings[0].definitions[0].synonyms || [];
                    result.innerHTML = `
                        <h2>${wordData.word}</h2>
                        <p><strong>Definition:</strong> ${meaning}</p>
                        ${synonyms.length > 0 ? `<p><strong>Synonyms:</strong> ${synonyms.join(', ')}</p>` : ''}
                    `;
                })
                .catch(error => {
                    loader.style.display = 'none'; 
                    displayError(`Definition not found: ${error.message}`);
                });
        }
        
        
        function fetchImage(word) {
            const imageURL = `https://api.unsplash.com/search/photos?query=${word}&client_id=Yqhk0SRq1lgDKFKGpNWow4Y6NTAWYfFDv5LQDmlunhg`;
            imageContainer.innerHTML = ''; 
        
            fetch(imageURL)
                .then(response => response.json())
                .then(data => {
                    const images = data.results;
                    if (images.length > 0) {
                        images.slice(0, 5).forEach(img => {
                            const imgElement = document.createElement('img');
                            imgElement.src = img.urls.regular;
                            imgElement.alt = word;
                            imgElement.style.cursor = 'pointer';
                            imgElement.onclick = () => window.open(img.urls.full, '_blank');
                            imageContainer.appendChild(imgElement);
                        });
                    } else {
                        displayError('No images found.');
                    }
                })
                .catch(error => {
                    console.error('Error fetching image:', error);
                    displayError('Error fetching image.');
                });
        }
        
        
        function displayError(message) {
            result.innerHTML = `<p>${message}</p>`;
            imageContainer.innerHTML = `<img src="error.jpg" alt="${message}" style="width: 100%; height: 30vh;" />`;
            loader.style.display = 'none';
        }
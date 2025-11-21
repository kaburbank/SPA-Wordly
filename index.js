//Define the DOM Elements and API Url
const searchForm = document.getElementById('search-form');
const wordInput = document.getElementById('word-input');
const resultsSection = document.getElementById('results');
const errorMessage = document.getElementById('error');
const wordDetails = document.getElementById('word-details');
const wordTitle = document.getElementById('word-title');
const audioButton = document.getElementById('audio-button');
const definitionsContainer = document.getElementById('definitions-container');
const synonymsContainer = document.getElementById('synonyms-container');
const synonymsList = document.getElementById('synonyms-list');

const API_BASE_URL = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

//Define async function to handle form submission
async function formSubmission(event) {
    event.preventDefault();
    
    const word = wordInput.value.trim().toLowerCase();
    if (!word) {
        showError('Please enter a word');
        return;
    };

    try {
        const data = await fetchWordData(word);
        displayResults(data);
    } catch (error) {
        showError(error.message);
    };
    
    wordInput.value = '';
};

//Define async function to fetch word data from API
async function fetchWordData(word) {
    try {
        const response = await fetch(`${API_BASE_URL}${word}`);
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`${word} is not found in the dictionary`);
            }
            throw new Error('Network response error');
        };

        const data = await response.json();
        return data[0];
        } catch (error) {
            throw new Error(error.message);
    };
};

//Define function to display results for audio, definitions, and synonyms
function displayResults(data) {
    clearResults();
    wordDetails.hidden = false; 
    wordTitle.textContent = data.word; 

    //Display audio data
    const audioUrl = data.phonetics.find(p => p.audio)?.audio;
    if (audioUrl) {
        audioButton.hidden = false;
        audioButton.dataset.audioUrl = audioUrl;
    } else {
        audioButton.hidden = true;
    };

    //Display definitions
    data.meanings.forEach(meaning => {
        const definitionItem = createDefinitionElement(meaning);
        definitionsContainer.appendChild(definitionItem);
    });

    //Display synonyms
    const allSynonyms = data.meanings
        .flatMap(meaning => meaning.synonyms)
        .filter((synonym, index, self) => self.indexOf(synonym) === index);

    if (allSynonyms.length > 0) {
        displaySynonyms(allSynonyms);
    };
};

//Define function to create the definition element
function createDefinitionElement(meaning) {
    const div = document.createElement('div');
    div.className = 'definition-item';

    //Add part of speech
    const partOfSpeech = document.createElement('div');
    partOfSpeech.className = 'part-of-speech';
    partOfSpeech.textContent = meaning.partOfSpeech;
    div.appendChild(partOfSpeech);

   //Add definitions
    meaning.definitions.forEach(def => {
        const definitionText = document.createElement('div');
        definitionText.className = 'definition-text';
        definitionText.textContent = def.definition;
        div.appendChild(definitionText);

        //Add example if available
        if (def.example) {
            const example = document.createElement('div');
            example.className = 'example';
            example.textContent = `example: ${def.example}`;
            div.appendChild(example);
        };
    });

    return div;
};

//Define function to display clickable synonyms list
function displaySynonyms(synonyms) {
    synonymsContainer.hidden = false;
    synonymsList.innerHTML = '';

    synonyms.forEach(synonym => {
        const tag = document.createElement('span');
        tag.className = 'synonym-tag';
        tag.textContent = synonym;
        tag.addEventListener('click', () => {
            wordInput.value = synonym;
            formSubmission(new Event('submit'));
        });
        synonymsList.appendChild(tag);
    });
};

// Play audio pronunciation
function playAudio() {
    const audio = new Audio(audioButton.dataset.audioUrl);
    audio.play().catch(error => {
        console.error('Error playing audio:', error);
        showError('Unable to play audio');
    });
};

// Show error message
function showError(message) {
    errorMessage.textContent = message;
    errorMessage.hidden = false;
    wordDetails.hidden = true;
    synonymsContainer.hidden = true;
};

//Create event Listeners for submit and playing audio
searchForm.addEventListener('submit', formSubmission);
audioButton.addEventListener('click', playAudio);

// Clear previous results
function clearResults() {
    errorMessage.hidden = true;
    definitionsContainer.innerHTML = '';
    synonymsContainer.hidden = true;
    synonymsList.innerHTML = '';
};


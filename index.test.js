const { fetchWordData, playAudio, clearResults, showError } = require('./index'); // Import the function

describe('fetchWordData', () => {
     it("fetch the word data", () => {
        const data = "hello";
        const result = fetchWord(data);
        expect(fetchWordData(data)).toBe(data[0]);
    });
     it("show an error message", () => {
        const data = "00";
        const result = fetchWord(data);
        expect(fetchWordData(data)).toBe("00 is not found in the dictionary");
    });

describe('playAudio', () => {
    it("play audio", () => {
        const audio = "hello";
        const result = playAudio();
        expect(fetchWordData(data)).toBe(audioButton.dataset.audioUrl);
    });
    it("play audio", () => {
        const audio = "00";
        const result = playAudio();
        expect(fetchWordData(data)).toBe('Unable to play audio');
    });

describe('clearResults', () => {
     it("clear results", () => {
        const data = "";
        const result = clearResults;
        expect(clearResults())).toBe("");
    });

describe('showError', () => {
     it("show error", () => {
        const message = errorMessage.textContent;
        const result = true;
        expect(showError(message))).toBe(errorMessage.textContent);
    });

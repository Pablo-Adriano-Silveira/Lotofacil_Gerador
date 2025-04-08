document.getElementById('analyzer-form').addEventListener('submit', function(event) {
    event.preventDefault();
    analyzeLotofacil();
});

// Alternar tema com o switch
document.getElementById('theme-toggle').addEventListener('change', function() {
    const isDarkMode = this.checked;
    document.body.classList.toggle('light-mode', !isDarkMode);
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.querySelector('.theme-label').textContent = isDarkMode ? 'Modo Escuro' : 'Modo Claro';
});

// Função para baixar o CSV do Google Drive automaticamente
document.getElementById('download-csv').addEventListener('click', function() {
    const fileId = '1WRo0NJ3-UdYepu0PHDy_J01YMdyixZrm';
    const csvUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;
    const fileName = 'Lotofacil_ATUAL.csv';

    const link = document.createElement('a');
    link.href = csvUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

function analyzeLotofacil() {
    const fileInput = document.getElementById('file-input');
    const elementsInput = document.getElementById('elements-input').value;
    const sequencesInput = document.getElementById('sequences-input').value;
    const chooseNumbersInput = document.getElementById('choose-numbers-input').value;

    if (!fileInput.files.length) {
        alert('Por favor, selecione um arquivo CSV.');
        return;
    }

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        const csvContent = event.target.result;
        const numbers = parseCSV(csvContent);

        if (numbers.length === 0) {
            alert('Não foi possível encontrar números válidos no arquivo.');
            return;
        }

        const numElements = parseInt(elementsInput) || 15;
        const numSequences = parseInt(sequencesInput) || 6;
        const chooseNumbers = parseInt(chooseNumbersInput) || 21;

        const mostDrawn = getMostDrawnNumbers(numbers, 25);
        const sequences = generateSequences(mostDrawn, numElements, numSequences, chooseNumbers);

        displayMostDrawn(mostDrawn);
        displaySequences(sequences);
    };

    reader.readAsText(file);
}

function parseCSV(csv) {
    const lines = csv.split('\n');
    const numbers = [];

    lines.forEach(line => {
        const value = line.trim();
        if (value) {
            const number = parseInt(value);
            if (!isNaN(number) && number >= 1 && number <= 25) {
                numbers.push(number);
            }
        }
    });

    return numbers;
}

function getMostDrawnNumbers(numbers, count) {
    const frequency = {};
    numbers.forEach(num => {
        frequency[num] = (frequency[num] || 0) + 1;
    });

    const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    return sorted.slice(0, count).map(entry => ({ number: parseInt(entry[0]), frequency: entry[1] }));
}

function generateSequences(mostDrawn, numElements, numSequences, chooseNumbers) {
    const selectedNumbers = mostDrawn.slice(0, chooseNumbers).map(item => item.number);
    const sequences = [];

    for (let i = 0; i < numSequences; i++) {
        const sequence = shuffle(selectedNumbers).slice(0, numElements);
        sequences.push(sequence.sort((a, b) => a - b));
    }

    return sequences;
}

function shuffle(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function displayMostDrawn(mostDrawn) {
    let resultsText = `Os 25 números mais sorteados na Lotofácil são:\n`;
    mostDrawn.forEach(item => {
        resultsText += `Número: ${item.number.toString().padStart(2, '0')}, Frequência: ${item.frequency}\n`;
    });
    document.getElementById('most-drawn-text').textContent = resultsText;
}

function displaySequences(sequences) {
    const sequencesDiv = document.getElementById('sequences');
    sequencesDiv.innerHTML = '<h6>Sequências geradas:</h6>';

    sequences.forEach((seq, index) => {
        const sequenceContainer = document.createElement('div');
        sequenceContainer.className = 'sequence-container';
        sequenceContainer.innerHTML = `<strong>Sequência ${index + 1}:</strong>`;

        seq.forEach(num => {
            const ball = document.createElement('span');
            ball.className = 'ball';
            ball.textContent = num.toString().padStart(2, '0');
            sequenceContainer.appendChild(ball);
        });

        sequencesDiv.appendChild(sequenceContainer);
    });
}
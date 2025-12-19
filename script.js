// words for practice

const words = [
  "then","you","make","between","give","so","let","current","different",
  "on","your","people","here","thing","action","the","but","that",
  "can","many","know","them","are","some","same","new","going","fun",
  "right","no","yes","more","feel","quite","soon","person","void",
  "call","object","prints","one",

  "run","walk","write","read","build","create","think","learn","try","work",
  "play","move","change","start","stop","open","close","bring","take","hold",

  "time","year","day","week","world","life","hand","eye","place","case",
  "point","group","number","part","system","problem","fact","idea","story",

  "good","bad","best","better","small","large","early","late","fast","slow",
  "simple","clear","strong","easy","hard","free","full","true","real",

  "code","data","value","array","string","logic","input","output","debug",
  "error","event","state","loop","return","class","method","function",

  "if","else","when","while","after","before","about","with","without",
  "from","into","over","under","again","still","often","always","never"
];

const leftHandWords = [
    "we","was","dad","tag","gas","fast","fate","ever","feed","weed",
    "rest","case","cave","dart","grass","sweet","great","waste","craft",
    "brass","stare","tread","treat","street","steward","car",
    "abracadabra","abstract","crabgrass","sassafras","attracts",
    "barrage","fastest","decade","referred","deceased","sweater",
    "average","vast","watercress","afterward","exaggerate","reverberate",
    "decreased","access","dessert","streetcar","extract","baggage",
    "gazetteer","adage","scarabs"
];

const rightHandWords = [
    "loop","only","junk","loom","pop","oil","hip","you","up","hulk","pony",
    "op","on","no","i","in","lily","pill",
    "minimum","opinion","poly","ply","knoll",
    "holy","monopoly","polyonymy","kinky","lollipop",
    "hokum","hypolimnion","polyphony",
    "illuminon","pilum","plum","nonunion","non",
    "union","kony","hony","polyol","oily","ok","hill"
];



// Application state
let currentText = '';
let currentIndex = 0;
let startTime = null;
let errors = 0;
let isCompleted = false;
let showKeyboard = true;
let currentTheme = 'dark';
let leftTypingMode = false;
let rightTypingMode = false;
let currentTypingMode = 'normal';
let selectedWordCount = 10;

// DOM elements
const textDisplay = document.getElementById('textDisplay');
const wpmValue = document.getElementById('wpmValue');
const accuracyValue = document.getElementById('accuracyValue');
const errorsValue = document.getElementById('errorsValue');
const timeValue = document.getElementById('timeValue');
const completionMessage = document.getElementById('completionMessage');
const instructionText = document.getElementById('instructionText');
const virtualKeyboard = document.getElementById('virtualKeyboard');
const settingsPanel = document.getElementById('settingsPanel');

// Control buttons
const keyboardToggle = document.getElementById('keyboardToggle');
const newTextBtn = document.getElementById('newTextBtn');
const settingsBtn = document.getElementById('settingsBtn');

// Start the application
document.addEventListener('DOMContentLoaded', init);

// Initialize the application
function init() {
    generateNewText();
    setupEventListeners();
    updateKeyboardVisibility();
    setTheme(currentTheme);
    typingMode(currentTypingMode);
}


// Generate new random text
function generateNewText() {
    const result = [];

    for (let i = 0; i < selectedWordCount; i++) {
        const randomIndex = Math.floor(Math.random() * words.length);
        result.push(words[randomIndex]);
    }

    currentText = result.join(" ");
    
    leftTypingMode = false;
    rightTypingMode = false;
    resetTypingState();
    renderText();
}

function lefthandtext(){
    const result = [];

    for (let i = 0; i < selectedWordCount; i++) {
        const randomIndex = Math.floor(Math.random() * leftHandWords.length);
        result.push(leftHandWords[randomIndex]);
    }

    currentText = result.join(" ");

    leftTypingMode = true;
    resetTypingState();
    renderText();
}

function righthandtext(){
    const result = [];

    for (let i = 0; i < selectedWordCount; i++) {
        const randomIndex = Math.floor(Math.random() * rightHandWords.length);
        result.push(rightHandWords[randomIndex]);
    }

    currentText = result.join(" ");

    rightTypingMode = true;
    resetTypingState();
    renderText();
}



// Reset typing state
function resetTypingState() {
    currentIndex = 0;
    startTime = null;
    errors = 0;
    isCompleted = false;
    completionMessage.classList.add('hidden');
    instructionText.textContent = 'Start typing · Backspace disabled · Accuracy matters';
    updateStats();
}

// Render text with character spans
function renderText(){
  textDisplay.innerHTML = '';

  for(let i = 0; i < currentText.length; i++){
    //createa a span element
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = currentText[i];

    if(i === 0){
      span.classList.add("current");
    }
    else{
      span.classList.add("pending");
    }
    
    textDisplay.appendChild(span);
  }
 
}

// Handle key press events
function handleKeyPress(event) {
    if (isCompleted) return;
    
    const key = event.key;


    if (event.key.length === 1 || event.key === ' ') {
        event.preventDefault();
    }


    if(key === 'Escape') {
        resetTypingState();
        renderText();
        return;
    } 

    if(key.length > 1) return;
   
    
    highlightKey(key);
    
    // Start timer on first keystroke
    if (!startTime) {
        startTime = Date.now();
        instructionText.textContent = 'Press Escape to restart';
    }
    
    const currentChar = currentText[currentIndex];
    const charSpans = textDisplay.querySelectorAll('.char');
    
    if (currentChar) {
        // Remove current class from current character
        charSpans[currentIndex].classList.remove('current');
        
        if (key === currentChar) {
            // Correct character
            charSpans[currentIndex].classList.add('correct');
        } else {
            // Incorrect character
            charSpans[currentIndex].classList.add('incorrect');
            errors++;
        }
        
        // Move to next character
        currentIndex++;
        
        if (currentIndex < currentText.length) {
            charSpans[currentIndex].classList.add('current');
        }         
        else {
            // Test completed
            isCompleted = true;
            completionMessage.classList.remove('hidden');
        }


        updateStats();
    }


}

// Highlight pressed key on virtual keyboard
function highlightKey(key) {
    // Remove previous highlights
    document.querySelectorAll('.key.pressed').forEach(k => {
        k.classList.remove('pressed');
    });
    
    // Find and highlight the pressed key
    const keyElements = document.querySelectorAll('.key');
    keyElements.forEach(keyElement => {
        const keyData = keyElement.getAttribute('data-key');
        if (keyData === key || 
            (key === ' ' && keyData === ' ') ||
            (keyData && keyData.toLowerCase() === key.toLowerCase())) {
            keyElement.classList.add('pressed');
            
            // Remove highlight after animation
            setTimeout(() => {
                keyElement.classList.remove('pressed');
            }, 100);
        }
    });
}

// Update statistics
function updateStats() {
    if (!startTime) {
        wpmValue.textContent = '0';
        accuracyValue.textContent = '100%';
        errorsValue.textContent = '0';
        timeValue.textContent = '0:00';
        return;
    }
    
    const currentTime = Date.now();
    const timeInMinutes = (currentTime - startTime) / 60000;
    const timeInSeconds = Math.round(timeInMinutes * 60);
    
    // Calculate WPM (words per minute)
    const correctChars = currentIndex - errors;
    const wpm = timeInMinutes > 0 ? Math.round((correctChars / 5) / timeInMinutes) : 0;
    
    // Calculate accuracy
    const accuracy = currentIndex > 0 ? Math.round((correctChars / currentIndex) * 100) : 100;
    
    // Format time
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update display
    wpmValue.textContent = wpm.toString();
    accuracyValue.textContent = `${accuracy}%`;
    errorsValue.textContent = errors.toString();
    timeValue.textContent = formattedTime;
}

// Toggle virtual keyboard visibility
function toggleKeyboard() {
    showKeyboard = !showKeyboard;
    updateKeyboardVisibility();
}

// Update keyboard visibility
function updateKeyboardVisibility() {
    if (showKeyboard) {
        virtualKeyboard.classList.remove('hidden');
        keyboardToggle.classList.add('active');
    } else {
        virtualKeyboard.classList.add('hidden');
        keyboardToggle.classList.remove('active');
    }
}



// Toggle settings panel
function toggleSettings() {
    settingsPanel.classList.toggle('hidden');
    settingsBtn.classList.toggle('active');
}

// Set theme
function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    // Update theme button states
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-theme') === theme) {
            btn.classList.add('active');
        }
    });
}

//typing mode toggle

function typingMode(mode){

    currentTypingMode = mode;

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
        if(btn.getAttribute('typing-mode') === mode){
            btn.classList.add('active');
        }
    })
}


// Setup event listeners
function setupEventListeners() {
    // Keyboard events
    document.addEventListener('keydown', handleKeyPress);
    
    // Control buttons
    keyboardToggle.addEventListener('click', toggleKeyboard);
    newTextBtn.addEventListener('click', ()=> {
        if(leftTypingMode){
            lefthandtext();
            return;
        }
        if(rightTypingMode){
            righthandtext();
            return;
        }
        
        generateNewText();
    });
    settingsBtn.addEventListener('click', toggleSettings);
    
    // Theme selection
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            setTheme(theme);
        });
    });

    //mode selection

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const mode = btn.getAttribute('typing-mode');
            typingMode(mode);
        })
    })

    document.querySelectorAll('.word-btn').forEach(btn => {
        btn.addEventListener('click', () => {


            //need to understand well here, why use dataset.count instead of using getattribute, why?. which is better?
            selectedWordCount = Number(btn.dataset.count);

            // UI active state
            document.querySelectorAll('.word-btn').forEach(b =>
                b.classList.remove('active')
            );
            btn.classList.add('active');

            if(leftTypingMode){
                lefthandtext();
                return;
            }
            if(rightTypingMode){
                righthandtext();
                return;
            }
        
            generateNewText();
        });
    });
    
    // Click on text to focus
    textDisplay.addEventListener('click', () => {
        textDisplay.focus();
    });
    
    // Prevent text selection
    textDisplay.addEventListener('selectstart', (e) => {
        e.preventDefault();
    });
}


// Update stats every second
setInterval(() => {
    if (startTime && !isCompleted) {
        updateStats();
    }
}, 1000);
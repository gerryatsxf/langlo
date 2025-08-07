class VocabularyCards {
    constructor() {
        this.vocabulary = [];
        this.filteredVocabulary = [];
        this.currentIndex = 0;
        this.isFlipped = false;
        this.currentLanguage = 'en';
        this.selectedCategories = new Set();
        this.availableCategories = [];
        this.cardDirection = 'jp-to-target'; // 'jp-to-target' or 'target-to-jp'
        
        // Tracking statistics
        this.wordStats = new Map(); // wordId -> {correct: boolean | null, skipped: boolean}
        // No longer loading stats from localStorage
        
        // Translations
        this.translations = {
            en: {
                'title': '🎌 Japanese Vocabulary Cards',
                'subtitle': 'Learn Japanese vocabulary with interactive flashcards',
                'click-to-flip': 'Click to flip',
                'previous': '← Previous',
                'flip-card': 'Flip Card',
                'show-front': 'Show Front',
                'next': 'Next →',
                'skip': 'Skip →',
                'shuffle': '🔀 Shuffle',
                'card': 'Card',
                'of': 'of',
                'cards-shuffled': 'Cards shuffled! 🔀',
                'loading': 'Loading...',
                // Category translations
                'categories': 'Categories',
                'select-all': 'All',
                'select-none': 'None',
                'countries': 'Countries',
                'general': 'General',
                'objects': 'Objects',
                'places': 'Places',
                'people': 'People',
                'colors': 'Colors',
                'animals': 'Animals',
                'food': 'Food',
                'drinks': 'Drinks',
                'furniture': 'Furniture',
                'technology': 'Technology',
                'weather': 'Weather',
                'education': 'Education',
                'quantity': 'Quantity',
                'sports': 'Sports',
                'entertainment': 'Entertainment',
                'health': 'Health',
                'clothing': 'Clothing',
                'transportation': 'Transportation',
                'time': 'Time',
                'emotions': 'Emotions',
                'correct': '✓ Correct',
                'incorrect': '✗ Incorrect',
                'statistics': 'Statistics',
                'total': 'Total',
                'answered': 'Answered',
                'remaining': 'Remaining',
                'skipped': 'Skipped',
                'progress': 'Progress',
                // Status markers
                'to-guess': 'To Guess',
                'status-correct': 'Correct',
                'status-incorrect': 'Incorrect',
                'status-skipped': 'Skipped',
                // Button translations
                'download-stats': '📥 Download Statistics',
                'downloaded': '✓ Downloaded!',
                'reset': '🔄 Reset',
                'reset-done': '✓ Reset!'
            },
            es: {
                'title': '🎌 Vocabulario Japonés',
                'subtitle': 'Aprende vocabulario japonés con tarjetas interactivas',
                'click-to-flip': 'Haz clic para voltear',
                'previous': '← Previo',
                'flip-card': 'Voltear',
                'show-front': 'Frente',
                'next': 'Siguiente →',
                'skip': 'Omitir →',
                'shuffle': '🔀 Mezclar',
                'card': 'Tarjeta',
                'of': 'de',
                'cards-shuffled': '¡Tarjetas mezcladas! 🔀',
                'loading': 'Cargando...',
                // Category translations
                'categories': 'Categorías',
                'select-all': 'Todas',
                'select-none': 'Ninguna',
                'countries': 'Países',
                'general': 'General',
                'objects': 'Objetos',
                'places': 'Lugares',
                'people': 'Personas',
                'colors': 'Colores',
                'animals': 'Animales',
                'food': 'Comida',
                'drinks': 'Bebidas',
                'furniture': 'Muebles',
                'technology': 'Tecnología',
                'weather': 'Clima',
                'education': 'Educación',
                'quantity': 'Cantidad',
                'sports': 'Deportes',
                'entertainment': 'Entretenimiento',
                'health': 'Salud',
                'clothing': 'Ropa',
                'transportation': 'Transporte',
                'time': 'Tiempo',
                'emotions': 'Emociones',
                'correct': '✓ Correcto',
                'incorrect': '✗ Incorrecto',
                'statistics': 'Estadísticas',
                'total': 'Total',
                'answered': 'Respondidas',
                'remaining': 'Restantes',
                'skipped': 'Omitidas',
                'progress': 'Progreso',
                // Status markers
                'to-guess': 'Por Adivinar',
                'status-correct': 'Correcto',
                'status-incorrect': 'Incorrecto',
                'status-skipped': 'Omitido',
                // Button translations
                'download-stats': '📥 Descargar Estadísticas',
                'downloaded': '✓ ¡Descargado!',
                'reset': '🔄 Reiniciar',
                'reset-done': '✓ ¡Reiniciado!'
            }
        };
        
        // DOM elements
        this.card = document.getElementById('flashcard');
        this.romajiElement = document.getElementById('romaji');
        this.hiraganaElement = document.getElementById('hiragana');
        this.englishElement = document.getElementById('english');
        this.currentCardElement = document.getElementById('currentCard');
        this.totalCardsElement = document.getElementById('totalCards');
        this.progressFill = document.getElementById('progressFill');
        this.categoryElement = document.getElementById('category');
        this.cardStatusMarker = document.getElementById('cardStatusMarker');
        
        // Buttons
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.flipBtn = document.getElementById('flipBtn');
        this.shuffleBtn = document.getElementById('shuffleBtn');
        this.languageToggle = document.getElementById('languageToggle');
        this.correctBtn = document.getElementById('correctBtn');
        this.incorrectBtn = document.getElementById('incorrectBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.flipDirectionBtn = document.getElementById('flipDirectionBtn');
        
        this.init();
    }
    
    async init() {
        try {
            await this.loadVocabulary();
            this.setupEventListeners();
            this.updateLanguage();
            this.updateFlipDirectionButton();
            this.setupStatsUI();
            this.displayCard();
            this.updateProgress();
            this.updateStats();
        } catch (error) {
            console.error('Failed to initialize vocabulary cards:', error);
            this.showError('Failed to load vocabulary data');
        }
    }
    
    async loadVocabulary() {
        try {
            // For GitHub Pages, we'll load vocabulary from the vocabulary.json file directly
            const response = await fetch('./vocabulary.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.vocabulary = await response.json();
            
            // Extract unique categories from vocabulary
            this.availableCategories = [...new Set(this.vocabulary.map(word => word.category))].sort();
            
            // Initialize all categories as selected
            this.selectedCategories = new Set(this.availableCategories);
            
            // Set up category UI
            this.setupCategoryUI();
            
            // Set filtered vocabulary to all initially
            this.updateFilteredVocabulary();
            
            this.totalCardsElement.textContent = this.filteredVocabulary.length;
        } catch (error) {
            console.error('Error loading vocabulary:', error);
            throw error;
        }
    }
    
    setupEventListeners() {
        // Card click to flip
        this.card.addEventListener('click', () => this.flipCard());
        
        // Button events
        this.prevBtn.addEventListener('click', () => this.previousCard());
        this.nextBtn.addEventListener('click', () => this.nextCard());
        this.flipBtn.addEventListener('click', () => this.flipCard());
        this.shuffleBtn.addEventListener('click', () => this.shuffleCards());
        this.languageToggle.addEventListener('click', () => this.toggleLanguage());
        this.correctBtn.addEventListener('click', () => this.markWord(true));
        this.incorrectBtn.addEventListener('click', () => this.markWord(false));
        this.resetBtn.addEventListener('click', () => this.resetStats());
        this.flipDirectionBtn.addEventListener('click', () => this.toggleFlipDirection());
        
        // Download stats button
        const downloadStatsBtn = document.getElementById('downloadStatsBtn');
        if (downloadStatsBtn) {
            downloadStatsBtn.addEventListener('click', () => this.downloadStatsCSV());
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousCard();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    this.nextCard();
                    break;
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    this.flipCard();
                    break;
                case 's':
                case 'S':
                    e.preventDefault();
                    this.shuffleCards();
                    break;
            }
        });
    }
    
    displayCard() {
        if (this.filteredVocabulary.length === 0) {
            // Show loading text in current language
            this.romajiElement.textContent = this.t('loading');
            this.hiraganaElement.textContent = '読み込み中...';
            this.englishElement.textContent = this.t('loading');
            return;
        }
        
        const currentWord = this.filteredVocabulary[this.currentIndex];
        
        // Get translation in current language
        const translation = this.currentLanguage === 'es' ? currentWord.spanish : currentWord.english;
        const translationText = translation || currentWord.english;
        
        // Display content based on card direction
        if (this.cardDirection === 'jp-to-target') {
            // Japanese on front, target language on back
            this.romajiElement.textContent = currentWord.romaji;
            this.hiraganaElement.textContent = currentWord.hiragana;
            this.englishElement.textContent = translationText;
        } else {
            // Target language on front, Japanese on back
            this.romajiElement.textContent = translationText;
            this.hiraganaElement.textContent = '';
            this.englishElement.textContent = `${currentWord.romaji}\n${currentWord.hiragana}`;
        }
        
        // Update category if element exists and category is provided
        if (this.categoryElement && currentWord.category) {
            this.categoryElement.textContent = this.t(currentWord.category) || currentWord.category;
        }
        
        // Reset flip state only when navigating to a new card
        this.isFlipped = false;
        this.card.classList.remove('flipped');
        this.flipBtn.textContent = this.t('flip-card');
        
        // Update navigation button states
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex === this.filteredVocabulary.length - 1;
        
        // Add entrance animation without interfering with transform
        this.card.style.opacity = '0.7';
        
        setTimeout(() => {
            this.card.style.opacity = '1';
        }, 100);
        
        // Update status marker
        this.updateCardStatus();
    }
    
    updateCardStatus() {
        if (!this.cardStatusMarker) return;
        
        if (this.filteredVocabulary.length === 0) {
            this.cardStatusMarker.textContent = this.t('loading').toUpperCase();
            this.cardStatusMarker.className = 'card-status-marker to-guess';
            return;
        }
        
        const currentWord = this.filteredVocabulary[this.currentIndex];
        const wordStat = this.wordStats.get(currentWord.id);
        
        // Remove all status classes
        this.cardStatusMarker.className = 'card-status-marker';
        
        if (!wordStat) {
            // New card, not processed yet
            this.cardStatusMarker.textContent = this.t('to-guess').toUpperCase();
            this.cardStatusMarker.classList.add('to-guess');
        } else if (wordStat.correct === true) {
            this.cardStatusMarker.textContent = this.t('status-correct').toUpperCase();
            this.cardStatusMarker.classList.add('correct');
        } else if (wordStat.correct === false) {
            this.cardStatusMarker.textContent = this.t('status-incorrect').toUpperCase();
            this.cardStatusMarker.classList.add('incorrect');
        } else if (wordStat.skipped) {
            this.cardStatusMarker.textContent = this.t('status-skipped').toUpperCase();
            this.cardStatusMarker.classList.add('skipped');
        } else {
            // Default state
            this.cardStatusMarker.textContent = this.t('to-guess').toUpperCase();
            this.cardStatusMarker.classList.add('to-guess');
        }
        
        // Update navigation button text based on card status
        this.updateNavigationButtons();
    }
    
    updateNavigationButtons() {
        if (!this.nextBtn || this.filteredVocabulary.length === 0) return;
        
        const currentWord = this.filteredVocabulary[this.currentIndex];
        const wordStat = this.wordStats.get(currentWord.id);
        
        // Remove all button style classes
        this.nextBtn.classList.remove('btn-secondary', 'btn-skip');
        
        if (!wordStat || (wordStat.correct === null && !wordStat.skipped)) {
            // Card is "TO GUESS" - show SKIP button
            this.nextBtn.textContent = this.t('skip');
            this.nextBtn.classList.add('btn-skip');
        } else {
            // Card has been answered - show NEXT button
            this.nextBtn.textContent = this.t('next');
            this.nextBtn.classList.add('btn-secondary');
        }
    }
    
    flipCard() {
        this.isFlipped = !this.isFlipped;
        this.card.classList.toggle('flipped');
        
        // Update flip button text
        const flipText = this.isFlipped ? this.t('show-front') : this.t('flip-card');
        this.flipBtn.textContent = flipText;
    }
    
    previousCard() {
        if (this.currentIndex > 0) {
            // Don't mark as skipped when going backward - only when going forward
            this.currentIndex--;
            this.displayCard();
            this.updateProgress();
            this.addCardTransition('slide-right');
        }
    }

    nextCard() {
        if (this.currentIndex < this.filteredVocabulary.length - 1) {
            // Mark current word as skipped if not already answered
            this.markAsSkippedIfUnanswered();
            
            this.currentIndex++;
            this.displayCard();
            this.updateProgress();
            this.addCardTransition('slide-left');
        }
    }    shuffleCards() {
        // Clear all word statistics
        this.wordStats.clear();
        
        // Select all categories
        this.selectedCategories = new Set(this.availableCategories);
        
        // Update category checkboxes to show all selected
        this.availableCategories.forEach(category => {
            const checkbox = document.querySelector(`input[value="${category}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Update filtered vocabulary to include all categories
        this.updateFilteredVocabulary();
        
        // Fisher-Yates shuffle algorithm
        for (let i = this.filteredVocabulary.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredVocabulary[i], this.filteredVocabulary[j]] = [this.filteredVocabulary[j], this.filteredVocabulary[i]];
        }
        
        this.currentIndex = 0;
        this.isFlipped = false;
        this.displayCard();
        this.updateProgress();
        this.updateStats();
        this.showNotification(this.t('cards-shuffled'));
    }
    
    updateProgress() {
        this.currentCardElement.textContent = this.currentIndex + 1;
        this.totalCardsElement.textContent = this.filteredVocabulary.length;
        const progressPercentage = ((this.currentIndex + 1) / this.filteredVocabulary.length) * 100;
        this.progressFill.style.width = `${progressPercentage}%`;
    }
    
    addCardTransition(direction) {
        // Temporarily disable flip transition for slide animation
        const originalTransition = this.card.style.transition;
        this.card.style.transition = 'opacity 0.3s ease';
        
        this.card.style.opacity = '0.7';
        
        setTimeout(() => {
            this.card.style.opacity = '1';
        }, 150);
        
        setTimeout(() => {
            this.card.style.transition = originalTransition || 'transform 0.6s ease';
        }, 300);
    }
    
    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #27ae60;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
    
    showError(message) {
        this.romajiElement.textContent = 'Error';
        this.hiraganaElement.textContent = 'エラー';
        this.englishElement.textContent = message;
    }
    
    // Translation methods
    t(key) {
        return this.translations[this.currentLanguage][key] || this.translations['en'][key] || key;
    }
    
    toggleLanguage() {
        this.currentLanguage = this.currentLanguage === 'en' ? 'es' : 'en';
        // No longer saving to localStorage
        this.updateLanguage();
        // Re-display the current card with the new language
        this.displayCard();
        // Update flip direction button
        this.updateFlipDirectionButton();
    }
    
    toggleFlipDirection() {
        this.cardDirection = this.cardDirection === 'jp-to-target' ? 'target-to-jp' : 'jp-to-target';
        this.updateFlipDirectionButton();
        // Reset card flip state and re-display
        this.isFlipped = false;
        this.card.classList.remove('flipped');
        this.displayCard();
    }
    
    updateFlipDirectionButton() {
        const targetFlag = this.currentLanguage === 'en' ? '🇺🇸' : '🇪🇸';
        if (this.cardDirection === 'jp-to-target') {
            this.flipDirectionBtn.textContent = `🇯🇵 → ${targetFlag}`;
        } else {
            this.flipDirectionBtn.textContent = `${targetFlag} → 🇯🇵`;
        }
    }
    
    updateLanguage() {
        // Update language toggle button - show the CURRENT language
        this.languageToggle.textContent = this.currentLanguage === 'en' ? '🇺🇸 EN' : '🇪🇸 ES';
        
        // Update all translatable elements
        this.updateTranslatableElements();
    }

    updateTranslatableElements() {
        // Update all elements with data-translate attribute
        const translatableElements = document.querySelectorAll('[data-translate]');
        translatableElements.forEach(element => {
            const translationKey = element.getAttribute('data-translate');
            element.textContent = this.t(translationKey);
        });
        
        // Update status marker
        this.updateCardStatus();
        
        // Update stats
        this.updateStats();
        
        // Update category UI
        this.updateCategoryUI();
    }

    setupCategoryUI() {
        const categoryList = document.getElementById('categoryList');
        const categoryHeader = document.querySelector('.category-header');
        const selectAllBtn = document.getElementById('selectAllBtn');
        const selectNoneBtn = document.getElementById('selectNoneBtn');
        
        if (!categoryList) return;
        
        // Update header text
        if (categoryHeader) {
            categoryHeader.textContent = this.t('categories');
        }
        
        // Update button texts
        if (selectAllBtn) {
            selectAllBtn.textContent = this.t('select-all');
        }
        if (selectNoneBtn) {
            selectNoneBtn.textContent = this.t('select-none');
        }
        
        // Clear existing categories
        categoryList.innerHTML = '';
        
        // Create category checkboxes
        this.availableCategories.forEach(category => {
            const categoryItem = document.createElement('div');
            categoryItem.className = 'category-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `category-${category}`;
            checkbox.value = category;
            checkbox.checked = this.selectedCategories.has(category);
            checkbox.addEventListener('change', () => this.onCategoryChange(category, checkbox.checked));
            
            const label = document.createElement('label');
            label.setAttribute('for', `category-${category}`);
            label.textContent = this.t(category) || category;
            
            categoryItem.appendChild(checkbox);
            categoryItem.appendChild(label);
            categoryList.appendChild(categoryItem);
        });
        
        // Set up control button event listeners
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => this.selectAllCategories());
        }
        if (selectNoneBtn) {
            selectNoneBtn.addEventListener('click', () => this.selectNoCategories());
        }
    }
    
    updateCategoryUI() {
        const categoryHeader = document.querySelector('.category-header');
        const selectAllBtn = document.getElementById('selectAllBtn');
        const selectNoneBtn = document.getElementById('selectNoneBtn');
        
        // Update header text
        if (categoryHeader) {
            categoryHeader.textContent = this.t('categories');
        }
        
        // Update button texts
        if (selectAllBtn) {
            selectAllBtn.textContent = this.t('select-all');
        }
        if (selectNoneBtn) {
            selectNoneBtn.textContent = this.t('select-none');
        }
        
        // Update category labels
        this.availableCategories.forEach(category => {
            const label = document.querySelector(`label[for="category-${category}"]`);
            if (label) {
                label.textContent = this.t(category) || category;
            }
        });
    }
    
    onCategoryChange(category, isSelected) {
        if (isSelected) {
            this.selectedCategories.add(category);
        } else {
            this.selectedCategories.delete(category);
        }
        
        // Clear all word statistics when categories change
        this.wordStats.clear();
        
        this.updateFilteredVocabulary();
        this.currentIndex = 0; // Reset to first card
        this.isFlipped = false; // Reset flip state
        this.displayCard();
        this.updateProgress();
        this.updateStats();
    }
    
    selectAllCategories() {
        this.selectedCategories = new Set(this.availableCategories);
        
        // Clear all word statistics when selecting all categories
        this.wordStats.clear();
        
        this.updateCategoryCheckboxes();
        this.updateFilteredVocabulary();
        this.currentIndex = 0;
        this.isFlipped = false; // Reset flip state
        this.displayCard();
        this.updateProgress();
        this.updateStats();
    }
    
    selectNoCategories() {
        this.selectedCategories.clear();
        
        // Clear all word statistics when deselecting all categories
        this.wordStats.clear();
        
        this.updateCategoryCheckboxes();
        this.updateFilteredVocabulary();
        this.currentIndex = 0;
        this.isFlipped = false; // Reset flip state
        this.displayCard();
        this.updateProgress();
        this.updateStats();
    }
    
    updateCategoryCheckboxes() {
        this.availableCategories.forEach(category => {
            const checkbox = document.getElementById(`category-${category}`);
            if (checkbox) {
                checkbox.checked = this.selectedCategories.has(category);
            }
        });
    }
    
    updateFilteredVocabulary() {
        if (this.selectedCategories.size === 0) {
            this.filteredVocabulary = [];
        } else {
            this.filteredVocabulary = this.vocabulary.filter(word => 
                this.selectedCategories.has(word.category)
            );
        }
        
        // Ensure current index is within bounds
        if (this.currentIndex >= this.filteredVocabulary.length) {
            this.currentIndex = Math.max(0, this.filteredVocabulary.length - 1);
        }
    }
    
    // Statistics functionality - removed localStorage
    loadStats() {
        // No longer loading from localStorage
        // Statistics will reset on page refresh
    }
    
    saveStats() {
        // No longer saving to localStorage
        // Statistics will not persist between sessions
    }
    
    markWord(isCorrect) {
        if (this.filteredVocabulary.length === 0) return;
        
        const currentWord = this.filteredVocabulary[this.currentIndex];
        this.wordStats.set(currentWord.id, { correct: isCorrect, skipped: false });
        // No longer saving to localStorage
        this.updateStats();
        this.updateCardStatus(); // Update status marker immediately
        this.updateNavigationButtons(); // Update button text immediately
        
        // Show notification
        const message = isCorrect ? '✓ Marked as correct!' : '✗ Marked as incorrect!';
        this.showNotification(message);
        
        // Auto-advance to next unanswered card after marking
        setTimeout(() => {
            this.goToNextUnansweredCard();
        }, 500);
    }
    
    goToNextUnansweredCard() {
        // Find the next card with "TO GUESS" status (unanswered)
        let nextIndex = this.currentIndex + 1;
        
        // Look for the next unanswered card
        while (nextIndex < this.filteredVocabulary.length) {
            const word = this.filteredVocabulary[nextIndex];
            const stat = this.wordStats.get(word.id);
            
            // If no stat exists or card is unanswered, go to this card
            if (!stat || (stat.correct === null && !stat.skipped)) {
                this.currentIndex = nextIndex;
                this.displayCard();
                this.updateProgress();
                this.addCardTransition('slide-left');
                return;
            }
            nextIndex++;
        }
        
        // If no unanswered cards found ahead, wrap around to the beginning
        nextIndex = 0;
        while (nextIndex < this.currentIndex) {
            const word = this.filteredVocabulary[nextIndex];
            const stat = this.wordStats.get(word.id);
            
            // If no stat exists or card is unanswered, go to this card
            if (!stat || (stat.correct === null && !stat.skipped)) {
                this.currentIndex = nextIndex;
                this.displayCard();
                this.updateProgress();
                this.addCardTransition('slide-left');
                return;
            }
            nextIndex++;
        }
        
        // If no unanswered cards found at all, just go to next card normally
        this.nextCard();
    }
    
    markAsSkippedIfUnanswered() {
        if (this.filteredVocabulary.length === 0) return;
        
        const currentWord = this.filteredVocabulary[this.currentIndex];
        const currentStat = this.wordStats.get(currentWord.id);
        
        // Only mark as skipped if the word hasn't been answered (correct/incorrect)
        if (!currentStat || (currentStat.correct === null && !currentStat.skipped)) {
            this.wordStats.set(currentWord.id, { correct: null, skipped: true });
            // No longer saving to localStorage
            this.updateStats();
            this.updateCardStatus(); // Update status marker when marked as skipped
        }
    }
    
    setupStatsUI() {
        const statsHeader = document.querySelector('.stats-header');
        if (statsHeader) {
            statsHeader.textContent = this.t('statistics');
        }
    }
    
    updateStats() {
        const statsList = document.getElementById('statsList');
        if (!statsList) return;
        
        // Clear existing stats
        statsList.innerHTML = '';
        
        // Calculate stats per category for selected categories only
        const categoryStats = {};
        
        this.availableCategories.forEach(category => {
            if (this.selectedCategories.has(category)) {
                const wordsInCategory = this.vocabulary.filter(word => word.category === category);
                const filteredWordsInCategory = wordsInCategory.filter(word => 
                    this.selectedCategories.has(word.category)
                );
                
                let correct = 0;
                let incorrect = 0;
                let skipped = 0;
                let unanswered = 0;
                
                filteredWordsInCategory.forEach(word => {
                    const stat = this.wordStats.get(word.id);
                    if (stat) {
                        if (stat.correct === true) {
                            correct++;
                        } else if (stat.correct === false) {
                            incorrect++;
                        } else if (stat.skipped === true) {
                            skipped++;
                        } else {
                            unanswered++;
                        }
                    } else {
                        unanswered++;
                    }
                });
                
                categoryStats[category] = {
                    total: filteredWordsInCategory.length,
                    correct,
                    incorrect,
                    skipped,
                    unanswered
                };
            }
        });
        
        // Create stats table for all selected categories
        if (Object.keys(categoryStats).length > 0) {
            // Create table structure
            const table = document.createElement('table');
            table.className = 'stats-table';
            
            // Create header
            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headerRow.innerHTML = `
                <th>${this.t('categories')}</th>
                <th>${this.t('total')}</th>
                <th>✓</th>
                <th>✗</th>
                <th>⏭</th>
                <th>${this.t('remaining')}</th>
                <th>${this.t('progress')}</th>
            `;
            thead.appendChild(headerRow);
            table.appendChild(thead);
            
            // Create body
            const tbody = document.createElement('tbody');
            
            Object.entries(categoryStats).forEach(([category, stats]) => {
                if (stats.total > 0) {
                    const row = document.createElement('tr');
                    
                    // Category name
                    const categoryCell = document.createElement('td');
                    categoryCell.textContent = this.t(category) || category;
                    categoryCell.className = 'category-name';
                    
                    // Total
                    const totalCell = document.createElement('td');
                    totalCell.textContent = stats.total;
                    totalCell.className = 'stat-number';
                    
                    // Correct
                    const correctCell = document.createElement('td');
                    correctCell.textContent = stats.correct;
                    correctCell.className = 'stat-number correct';
                    
                    // Incorrect
                    const incorrectCell = document.createElement('td');
                    incorrectCell.textContent = stats.incorrect;
                    incorrectCell.className = 'stat-number incorrect';
                    
                    // Skipped
                    const skippedCell = document.createElement('td');
                    skippedCell.textContent = stats.skipped;
                    skippedCell.className = 'stat-number skipped';
                    
                    // Remaining
                    const remainingCell = document.createElement('td');
                    remainingCell.textContent = stats.unanswered;
                    remainingCell.className = 'stat-number remaining';
                    
                    // Progress bar
                    const progressCell = document.createElement('td');
                    const progressBar = document.createElement('div');
                    progressBar.className = 'table-progress-bar';
                    
                    if (stats.total > 0) {
                        if (stats.correct > 0) {
                            const correctBar = document.createElement('div');
                            correctBar.className = 'progress-correct';
                            correctBar.style.width = `${(stats.correct / stats.total) * 100}%`;
                            progressBar.appendChild(correctBar);
                        }
                        
                        if (stats.incorrect > 0) {
                            const incorrectBar = document.createElement('div');
                            incorrectBar.className = 'progress-incorrect';
                            incorrectBar.style.width = `${(stats.incorrect / stats.total) * 100}%`;
                            progressBar.appendChild(incorrectBar);
                        }
                        
                        if (stats.skipped > 0) {
                            const skippedBar = document.createElement('div');
                            skippedBar.className = 'progress-skipped';
                            skippedBar.style.width = `${(stats.skipped / stats.total) * 100}%`;
                            progressBar.appendChild(skippedBar);
                        }
                        
                        if (stats.unanswered > 0) {
                            const unansweredBar = document.createElement('div');
                            unansweredBar.className = 'progress-unanswered';
                            unansweredBar.style.width = `${(stats.unanswered / stats.total) * 100}%`;
                            progressBar.appendChild(unansweredBar);
                        }
                    }
                    
                    progressCell.appendChild(progressBar);
                    
                    // Append all cells to row
                    row.appendChild(categoryCell);
                    row.appendChild(totalCell);
                    row.appendChild(correctCell);
                    row.appendChild(incorrectCell);
                    row.appendChild(skippedCell);
                    row.appendChild(remainingCell);
                    row.appendChild(progressCell);
                    
                    tbody.appendChild(row);
                }
            });
            
            table.appendChild(tbody);
            statsList.appendChild(table);
        }
    }

    resetStats() {
        // Clear all word statistics
        this.wordStats.clear();
        
        // Select all categories
        this.selectedCategories = new Set(this.availableCategories);
        
        // Update category checkboxes to show all selected
        this.availableCategories.forEach(category => {
            const checkbox = document.querySelector(`input[value="${category}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        
        // Update filtered vocabulary to include all categories
        this.updateFilteredVocabulary();
        
        // Reset to first card
        this.currentIndex = 0;
        this.isFlipped = false;
        
        // Update UI
        this.displayCard();
        this.updateProgress();
        this.updateStats();
        
        // Show confirmation message
        console.log('📊 Statistics reset! All categories selected, stats cleared.');
        
        // Optional: Show a brief visual feedback
        if (this.resetBtn) {
            const originalText = this.resetBtn.textContent;
            this.resetBtn.textContent = this.t('reset-done');
            this.resetBtn.style.backgroundColor = '#27ae60';
            setTimeout(() => {
                this.resetBtn.textContent = originalText;
                this.resetBtn.style.backgroundColor = '';
            }, 1000);
        }
    }

    downloadStatsCSV() {
        // Calculate stats per category for selected categories only
        const categoryStats = {};
        
        this.availableCategories.forEach(category => {
            if (this.selectedCategories.has(category)) {
                const wordsInCategory = this.vocabulary.filter(word => word.category === category);
                const filteredWordsInCategory = wordsInCategory.filter(word => 
                    this.selectedCategories.has(word.category)
                );
                
                let correct = 0;
                let incorrect = 0;
                let skipped = 0;
                let unanswered = 0;
                
                filteredWordsInCategory.forEach(word => {
                    const stat = this.wordStats.get(word.id);
                    if (stat) {
                        if (stat.correct === true) {
                            correct++;
                        } else if (stat.correct === false) {
                            incorrect++;
                        } else if (stat.skipped === true) {
                            skipped++;
                        } else {
                            unanswered++;
                        }
                    } else {
                        unanswered++;
                    }
                });
                
                if (filteredWordsInCategory.length > 0) {
                    categoryStats[category] = {
                        total: filteredWordsInCategory.length,
                        correct,
                        incorrect,
                        skipped,
                        unanswered,
                        correctPercentage: ((correct / filteredWordsInCategory.length) * 100).toFixed(1),
                        incorrectPercentage: ((incorrect / filteredWordsInCategory.length) * 100).toFixed(1),
                        skippedPercentage: ((skipped / filteredWordsInCategory.length) * 100).toFixed(1),
                        unansweredPercentage: ((unanswered / filteredWordsInCategory.length) * 100).toFixed(1)
                    };
                }
            }
        });

        // Generate CSV content
        let csvContent = 'Category,Total,Correct,Incorrect,Skipped,Remaining,Correct %,Incorrect %,Skipped %,Remaining %\n';
        
        Object.entries(categoryStats).forEach(([category, stats]) => {
            const categoryName = this.t(category) || category;
            csvContent += `"${categoryName}",${stats.total},${stats.correct},${stats.incorrect},${stats.skipped},${stats.unanswered},${stats.correctPercentage}%,${stats.incorrectPercentage}%,${stats.skippedPercentage}%,${stats.unansweredPercentage}%\n`;
        });

        // Calculate totals
        const totalStats = Object.values(categoryStats).reduce((acc, stats) => ({
            total: acc.total + stats.total,
            correct: acc.correct + stats.correct,
            incorrect: acc.incorrect + stats.incorrect,
            skipped: acc.skipped + stats.skipped,
            unanswered: acc.unanswered + stats.unanswered
        }), { total: 0, correct: 0, incorrect: 0, skipped: 0, unanswered: 0 });

        if (totalStats.total > 0) {
            const totalCorrectPercentage = ((totalStats.correct / totalStats.total) * 100).toFixed(1);
            const totalIncorrectPercentage = ((totalStats.incorrect / totalStats.total) * 100).toFixed(1);
            const totalSkippedPercentage = ((totalStats.skipped / totalStats.total) * 100).toFixed(1);
            const totalUnansweredPercentage = ((totalStats.unanswered / totalStats.total) * 100).toFixed(1);
            
            csvContent += `\n"TOTAL",${totalStats.total},${totalStats.correct},${totalStats.incorrect},${totalStats.skipped},${totalStats.unanswered},${totalCorrectPercentage}%,${totalIncorrectPercentage}%,${totalSkippedPercentage}%,${totalUnansweredPercentage}%\n`;
        }

        // Create and download the file
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            
            // Generate filename with current date
            const now = new Date();
            const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
            const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-'); // HH-MM-SS format
            link.setAttribute('download', `japanese-vocabulary-stats-${dateStr}-${timeStr}.csv`);
            
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Show feedback
            const downloadBtn = document.getElementById('downloadStatsBtn');
            if (downloadBtn) {
                const originalText = downloadBtn.textContent;
                downloadBtn.textContent = this.t('downloaded');
                downloadBtn.style.backgroundColor = 'rgba(39, 174, 96, 0.2)';
                setTimeout(() => {
                    downloadBtn.textContent = originalText;
                    downloadBtn.style.backgroundColor = '';
                }, 2000);
            }
        }
    }
}

// Initialize the vocabulary cards when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new VocabularyCards();
});

// Add some helpful console messages for developers
console.log('🎌 Japanese Vocabulary Cards loaded!');
console.log('Keyboard shortcuts:');
console.log('← → : Navigate cards');
console.log('Space/Enter : Flip card');
console.log('S : Shuffle cards');

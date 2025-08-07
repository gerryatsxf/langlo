# Japanese Vocabulary Cards 🎌

A beautiful, interactive flashcard system for learning Japanese vocabulary. This web application helps you memorize Japanese words across various categories with an intuitive card-flipping interface.

🌐 **[Live Demo on GitHub Pages](https://gerryatsxf.github.io/langlo)**

## Features

- **Interactive Flashcards**: Click or use keyboard shortcuts to flip cards
- **Flip Direction**: Toggle between Japanese→Target Language and Target Language→Japanese modes
- **Bilingual Support**: Toggle between English and Spanish UI/translations  
- **Category Filtering**: Select specific vocabulary categories to study
- **Progress Tracking**: Visual statistics showing correct/incorrect/skipped answers
- **Smooth Animations**: Beautiful glassmorphism design with card flip animations
- **Navigation Controls**: Previous/Next buttons and keyboard navigation
- **Shuffle Function**: Randomize card order for better learning
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Reset Functionality**: Reset all progress and statistics
- **Configurable Data**: Easy to add new vocabulary through JSON file

## Usage (GitHub Pages)

This app runs as a static website and can be accessed directly through GitHub Pages.

**Live URL**: `https://gerryatsxf.github.io/langlo`

## Local Development

1. **Clone the repository**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   npm start
   ```

3. **Open Your Browser**:
   Navigate to `http://localhost:3000`

## Usage

### Navigation
- **Mouse**: Click on cards to flip, use control buttons
- **Language Toggle**: Click the language button (🇪🇸 ES / 🇺🇸 EN) in top-right to switch between English and Spanish
- **Keyboard Shortcuts**:
  - `←` / `→` : Navigate between cards
  - `Space` / `Enter` : Flip current card
  - `S` : Shuffle cards

### Current Vocabulary
The system includes various Japanese vocabulary categories:

**Countries:**
- Amerika (アメリカ) - United States
- Igirisu (イギリス) - United Kingdom  
- Itaria (イタリア) - Italy

**General Words:**
- tabemono (たべもの) - food
- mizu (みず) - water

**Objects:**
- hon (ほん) - book
- kuruma (くるま) - car

**Places:**
- gakkou (がっこう) - school

**People:**
- sensei (せんせい) - teacher
- tomodachi (ともだち) - friend

**Colors:**
- akai (あかい) - red
- aoi (あおい) - blue

## Customization

### Adding New Vocabulary

Edit the `vocabulary.json` file to add new words:

```json
{
  "id": 13,
  "romaji": "inu",
  "hiragana": "いぬ", 
  "english": "dog",
  "spanish": "perro",
  "category": "animals"
}
```

### Vocabulary Data Format
Each vocabulary entry requires:
- `id`: Unique identifier
- `romaji`: Romanized Japanese pronunciation
- `hiragana`: Japanese characters (can be hiragana or katakana)
- `english`: English translation
- `spanish`: Spanish translation
- `category`: Optional category for organization (e.g., "animals", "food", "colors")

## File Structure

```
langlo/
├── index.html          # Main HTML interface
├── script.js           # Client-side JavaScript logic
├── server.js           # Express server
├── vocabulary.json     # Vocabulary data
├── package.json        # Node.js dependencies
└── README.md          # This file
```

## API Endpoints

- `GET /` - Serves the main application
- `GET /api/vocabulary` - Returns vocabulary data as JSON
- `POST /api/vocabulary` - Updates vocabulary data (for future features)

## Development

For development with auto-restart:
```bash
npm install -g nodemon
npm run dev
```

## Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Data**: JSON file storage
- **Styling**: CSS Grid, Flexbox, CSS Transitions

## Browser Support

- Chrome, Firefox, Safari, Edge (modern versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - feel free to modify and use for your own learning projects!

---

Happy learning! 頑張って！ (Ganbatte!)

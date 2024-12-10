// config/tracks.ts
export interface FlashCard {
    id: number;
    word: string;
    image: string; // path relative to /images/flashcards/track{id}/
  }
  
export interface Track {
    id: number;
    name: string;
    numFlashcards: number; // How many flashcards each track has
    cards: FlashCard[];
  }
  
  export const tracks: Track[] = [
    { id: 1, 
      name: "Unit 1 - It's a... It has ...", 
      numFlashcards: 7,
      cards: [
      { id: 1, word: "a camel", image: "card1.jpg" },
      { id: 2, word: "an alligator", image: "card2.jpg" },
      { id: 3, word: "a frog", image: "card3.jpg" },
      { id: 4, word: "a rhino", image: "card4.jpg" },
      { id: 5, word: "a gorilla", image: "card5.jpg" },
      { id: 6, word: "an ostrich", image: "card6.jpg" },
      { id: 7, word: "a snake", image: "card7.jpg" }

    ]
    },
    { id: 2, 
      name: "Where's the .....?", 
      numFlashcards: 6,
      cards: [
        { id: 1, word: "bakery", image: "card1.jpg"},
        { id: 2, word: "drugstore", image: "card2.jpg" },
      { id: 3, word: "library", image: "card3.jpg" },
      { id: 4, word: "movie theater", image: "card4.jpg" },
      { id: 5, word: "gas station", image: "card5.jpg" },
      { id: 6, word: "swimming pool", image: "card6.jpg" },
      ]
    },
    { id: 3, 
      name: "It's a.....", 
      numFlashcards: 8,
      cards: [
        { id: 1, word: "bear", image: "card1.jpg"},
        { id: 2, word: "panda", image: "card2.jpg" },
      { id: 3, word: "deer", image: "card3.jpg" },
      { id: 4, word: "zebra", image: "card4.jpg" },
      { id: 5, word: "kangaroo", image: "card5.jpg" },
      { id: 6, word: "giraffe", image: "card6.jpg" },
      { id: 7, word: "parrot", image: "card7.jpg" },
      { id: 8, word: "peacock", image: "card8.jpg" },
      ]
    },
  ]
  
  export const getTrackById = (id: number): Track | undefined => {
    return tracks.find(track => track.id === id)
  }
  
  export const getTrackByName = (name: string): Track | undefined => {
    return tracks.find(track => track.name === name)
  }

  export const getCardByTrackAndId = (trackId: number, cardId: number): FlashCard | undefined => {
    const track = getTrackById(trackId)
    return track?.cards.find(card => card.id === cardId)
  }
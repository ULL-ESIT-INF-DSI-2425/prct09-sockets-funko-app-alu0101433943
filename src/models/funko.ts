/**
 * Modelo de Funko
 */
export enum FunkoType {
  POP = "Pop!",
  POP_RIDES = "Pop! Rides",
  VYNIL_SODA = "Vynil Soda",
  VYNIL_GOLD = "Vynil Gold",
  POP_TOWN = "Pop! Town",
  POP_MOVIE = "Pop! Movie",
  POP_ANIMATION = "Pop! Animation",
  POP_MUSIC = "Pop! Music",
  POP_GAMES = "Pop! Games",
  POP_AD_ICON = "Pop! Ad Icon",
  POP_TELEVISION = "Pop! Television",
  POP_ROCKS = "Pop! Rocks",
  POP_HEROES = "Pop! Heroes",
  POP_MARVEL = "Pop! Marvel",
  POP_DC = "Pop! DC",
  POP_DISNEY = "Pop! Disney",
  POP_STAR_WARS = "Pop! Star Wars",
  POP_HARRY_POTTER = "Pop! Harry Potter",
  POP_ANIME = "Pop! Anime",
}

/**
 * Géneros de Funko
 */
export enum FunkoGenre {
  ANIMATION = "Animación",
  MOVIES_TV = "Películas y TV",
  GAMES = "Videojuegos",
  SPORTS = "Deportes",
  MUSIC = "Música",
  ANIME = "Ánime",
  AD_ICON = "Iconos de la publicidad",
  HEROES = "Héroes",
  MARVEL = "Marvel",
  DC = "DC",
  DISNEY = "Disney",
  STAR_WARS = "Star Wars",
  HARRY_POTTER = "Harry Potter",
}

/**
 * Modelo de Funko
 */
export interface Funko {
  id: number;
  name: string;
  description: string;
  type: FunkoType;
  genre: FunkoGenre;
  franchise: string;
  number: number;
  exclusive: boolean;
  specialFeatures: string;
  marketValue: number;
}

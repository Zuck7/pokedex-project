![Pokemon](https://github.com/user-attachments/assets/8ecad985-3347-441a-9085-abc8fb1cb20a)

Hi, this is my dynamic Pokedex Application - an application where users can search for Pokemon by name or ID, view their details in a styled card, open a modal to view more information, and add up to 6 Pokemon to a favourites list stored in localStoraage. It uses PokeAPI to fetch Pokemon data.

Features
1. Search Functionality
   - User enters Pokemon name or ID and clicks "Search Pokemon"
   - Fetches data from PokeAPI
   - While loading, a Pokeball spinner is shown
   - If the Pokemon is not found, an error message is displayed

2. Basic Info Display
   - Shows a styled card with:
     - Name
     - ID
     - Image
     - Types
     - Abilities
     - A "More Info" button
     - An "Add to Favourites" button

3. "More Info" Modal
   - Clicking "More info" opens a modal showing:
     - Height, weight, base stats
     - Modal can be closed with the X or by clicking outside the box

4. Favourites System
   - Clicking "Add to Favourites" saves the Pokemon to localStorage
   - Users can only favourite up to 6 Pokemon
   - Clicking "View Favourites" toggles between favourites and search

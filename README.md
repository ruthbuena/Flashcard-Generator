# Flashcard-Generator

Advanced JavaScript Assignment: Cloze Constructors

For this exercise, several JavaScript files will be created to generate Flashcards on the back end using Node.  There are two types of flashcards that will be created: Basic Flashcard and Cloze Flashcard.

Basic Flashcard (BasicCard.js): A basic flashcard has a front and a back. A basic flashcard is created through a constructor BasicFlashcard which takes two arguments: front and back, respectively. BasicFlashcard has a create function which uses fs to append the flashcard to the log.txt file.

Cloze Flashcard (ClozeCard.js): A cloze flashcard has a piece of text removed. A cloze flashcard is created through a constructor ClozeFlashcard which takes two arguments: text and cloze, respectively. The ClozeFlashcard has property clozeDeleted which takes the text and replaces the cloze portion with _____.ClozeFlashcard also has a create function which uses fs to append the flashcard to the log.txt file.

Using the flashcard.js file users will have the ability to use the following functions to interact with the Flashcards: Create, Use All, Random, Shuffle, Show All and Exit.

Index.html has been added to give users a front end option to interact with the Flashcards.

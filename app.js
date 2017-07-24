// Taken from Flashcard Generator.js, reduce HTTP request.
function BasicCard(front, back) {
    this.front = front;
    this.back = back;
}


// Runs validation on initiation.
function ClozeCard(fullText, cloze) {
    if (this instanceof ClozeCard) {
        this.fullText = fullText;
        this.cloze = cloze;
        this.partialText = "";
        this.validated = false;
        this.validateCloze();
    } else {
        return new ClozeCard(fullText, cloze);
    }
}
// To inherit, say fancyClozeCard = ClozeCard(blah blah)
// inside fancyClozeCard, this would refer to FCC not CC.
// To fix, direct the ClozeCard as a prototype of fancyClozeCard
// fancyClozeCard.prototype = new ClozeCard.

ClozeCard.prototype.validateCloze = function () {
    // If the Cloze exists in the Full text, case sensitive
    if (this.fullText.search(this.cloze) != -1) {
        // Call method to Create and assign partial text.
        this.createPartialText();
        this.validated = true;

    } else {
        console.log("The specified Cloze does not exist in the full text");
        this.fullText = "Invalid Cloze";
        this.cloze = "Invalid Cloze";
        this.validated = false;
    }
};

ClozeCard.prototype.createPartialText = function () {
    // Returns partial sentence.
    this.partialText = this.fullText.replace(this.cloze, "______");
};

// function to generate Flashcard to Dom
// Expects the flash card object
function generateFlashcardFromInput(flashcardObject) {
    var newRow = $("<div>").addClass("row");
    var newCard = $("<button>").addClass("flashcard u-full-width");
    var newFullText = $("<span>").addClass("flashcard-text").css("display", "none");
    var newPartialText = $("<span>").addClass("flashcard-text");
    newFullText.text(flashcardObject.fullText);
    newPartialText.text(flashcardObject.partialText);

    newCard.append(newFullText, newPartialText);
    newRow.append(newCard);

    $(".flashcard-container").append(newRow);
}


$(document).ready(function () {
    // On click event for submit button
    $(".submit-button").on("click", function () {
        // Check for non-blank input
        if ($("#full-text-input").val() == "" || $("#cloze-text-input").val() == "") {
            // Please fill in the inputs
            console.log("Missing input(s)");
        } else {
            var newFlashcard = new ClozeCard($("#full-text-input").val(), $("#cloze-text-input").val());
            // Check if Cloze Exists
            if (newFlashcard.validated) {
                // Clear inputs
                $("input").val("");
                generateFlashcardFromInput(newFlashcard);
            } else {
                console.log("Please input a valid cloze");
            }
        }

    });
    // On click event for generated Flash cards
    // Toggles the partial text with the full text.
    $(document).on("click", ".flashcard", function () {
        var cardText = $(this).children();
        cardText.toggle();
    });
});

class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // TODO: replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // TODO: use `key` to get the data object for the current story location
        if(key === "Gallery of Paintings" && this.engine.state.PaintingsFixed) {
            this.engine.show("You are in the Gallery of Paintings... the paintings are now perfectly aligned.");
        }else if(key === "Gallery of Artifacts" && this.engine.state.EntranceUnlocked) {
            //this.engine.show("");
        }
         else {
            this.engine.show(locationData.Body); // TODO: replace this text by the Body of the location data
        }

        if(locationData.Choices) { // TODO: check if the location has any Choices
            for(let choice of locationData.Choices) { // TODO: loop over the location's Choices
                if (this.engine.state.PaintingsFixed && choice.Target === "FixPaintings") continue;
                this.engine.addChoice(choice.Text, choice); // TODO: use the Text of the choice
                // TODO: add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if (choice.Target === "Take Glowing Artifact") {
            this.engine.gotoScene(TakeGlowingArtifact)
        }

        if(choice.Target === "FixPaintings" ) {
            this.engine.gotoScene(FixPaintings);
        } else if (choice.Target === "LockedEntrance") {
            this.engine.gotoScene(LockedEntrance);
        } else if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class TakeGlowingArtifact extends Scene {
    create() {
        if (!this.engine.state.EntranceUnlocked) {
            this.engine.show("You take the glowing artifact out of the trashcan... maybe its a key...");
            this.engine.state.EntranceUnlocked = true;
            this.engine.addChoice("Continue", {Text: "Return", Target: "Gallery of Artifacts"});
        } else {
            this.engine.show("You reach inside; spoiled yogurt covers your hand.");
            this.engine.addChoice("Continue", {Text: "Return", Target: "Gallery of Artifacts"});
        }
    }

    handleChoice(choice) {
        this.engine.show("&gt; " + choice.Text);
        this.engine.gotoScene(Location, choice.Target);
    }
}

class FixPaintings extends Scene {
    create() {
        if (!this.engine.state.PaintingsFixed) {
            this.engine.show("As you reach to straighten the painting all the paintings in the room slam in alignment!");
            this.engine.addChoice("Continue", { Text: "Return", Target: "Gallery of Paintings" });
            this.engine.state.PaintingsFixed = true; // Mark as fixed
        } else {
            this.engine.show("The paintings are already fixed... ");
            this.engine.gotoScene(Location, "Gallery of Paintings");
        }
    }

    handleChoice(choice) {
        this.engine.show("&gt; " + choice.Text);
        this.engine.gotoScene(Location, choice.Target);
    }
}

class LockedEntrance extends Scene {
    create() {
        if (!this.engine.state.EntranceUnlocked) {
            this.engine.show("The Entrance door seems to be locked!");
            this.engine.addChoice("Continue", {Text: "Return", Target: "Entrance"});
        } else {
            this.engine.show("You place the glowing artifact in the door. It opens.");
            this.engine.gotoScene(Location, "Beyond");
        }
    }

    handleChoice(choice) {
        this.engine.show("&gt; " + choice.Text);
        this.engine.gotoScene(Location,choice.Target);
    }

}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');
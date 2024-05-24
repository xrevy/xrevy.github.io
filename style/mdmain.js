import { initMusicVisualization } from "/music-js/music-visual.js";

//document.addEventListener('DOMContentLoaded', function () {
    const visualizationTypeSelect = document.getElementById("visualizationType");
    const drawExplanationDiv = document.getElementById("drawExplanation");
    const triangleExplanationDiv = document.getElementById("triangleExplanation");
    const squareExplanationDiv = document.getElementById("squareExplanation");

    const settingsContainer = document.getElementById("settingsContainer");
    const radioButtons = document.querySelectorAll('input[name="musicRadio"]');
    const customMusicInput = document.getElementById("customMusicFile");
    const clearButton = document.getElementById("clearMusicFile");

    const backgroundTypeSelect = document.getElementById("backgroundType");
    const dynamicExplanationDiv = document.getElementById("dynamicExplanation");
    const gradientExplanationDiv = document.getElementById("gradientExplanation");
    const gradientColors = document.getElementById("gradientColors");

    const simpleBackground = document.getElementById("simplColour");
    const simpleBackgroundExplanation = document.getElementById("colorExplanation");

    const extraSettings = document.getElementById("extraSettings");
    const extraSquare = document.getElementById("extraSquare");

    const configureButton = document.getElementById("configureButton");

    //file path to audio files
    const fileNames = ["../media/music-files/victory.mp3", 
    "../media/music-files/showreel.mp3", 
    "../media/music-files/Roxanne_The_Police_Remix_by_FVE.mp3",
    "../media/music-files/green-sky.mp3",
    "../media/music-files/guitar-mellow-beat.mp3"
    ];

    let selectedVisualization;
    
    // Listeners for the input elements
    visualizationTypeSelect.addEventListener('change', function () {
        selectedVisualization = visualizationTypeSelect.value;
        updateExplanationVisibility();
        handleBackgroundTypeVisibility();

        // Handle settings visibility based on selected visualization type
        if (selectedVisualization === "draw") {
            settingsContainer.style.display = "block";
            backgroundTypeSelect.style.display = "block";
            extraSettings.style.display = "block";
            extraSquare.style.display = "none";
            configureButton.style.display = "block";
            console.log("line");
        } else if (selectedVisualization ==="triangle") {
            settingsContainer.style.display = "block";
            backgroundTypeSelect.style.display = "block";
            extraSettings.style.display = "none";
            extraSquare.style.display = "none";
            configureButton.style.display = "block";
        } else if (selectedVisualization === "square") {
            settingsContainer.style.display = "block";
            backgroundTypeSelect.style.display = "none";
            extraSettings.style.display = "none";
            extraSquare.style.display = "block";
            configureButton.style.display = "block";
        }
    });

    backgroundTypeSelect.addEventListener('change', function () {
        const selectedBackgroundType = backgroundTypeSelect.value;
        updateExplanationVisibility();
        updateSaveButtonState();
        handleBackgroundTypeVisibility();

        // Handle gradient colors visibility based on selected background type
        gradientColors.style.display = selectedBackgroundType === 'gradient' ? 'block' : 'none';
    });

    radioButtons.forEach(input => input.addEventListener('change', updateSaveButtonState));
    customMusicInput.addEventListener('change', function() {
        updateSaveButtonState();
        handleFileChange();
    });
    clearButton.addEventListener('click', clearFileInput);

    configureButton.addEventListener('click', function () {
        // Additional logic to handle user choices and initiate canvas creation
        let selectedMusicFile;
        let selectedMusicPath;
        if (document.getElementById("customMusicFile").files.length > 0) {
            selectedMusicFile = document.getElementById("customMusicFile").files[0];
            console.log(selectedMusicFile);
        } else {
            selectedMusicPath = getMusicFile();
        }
        
        const selectedBackgroundType = backgroundTypeSelect.value;

        const gradientColor1 = document.getElementById('gradientColor1').value;
        const gradientColor2 = document.getElementById('gradientColor2').value;
        const simpleCol = document.getElementById("simpleBgColour").value;

        // Display overlay with selected choices
        displayOverlay(selectedVisualization, selectedMusicPath, selectedMusicFile, gradientColor1, gradientColor2, simpleCol, selectedBackgroundType);
    });

    // Additional logic to handle other settings and start/resume the song

    function displayOverlay(visualization, musicPath, musicFile, colour1, colour2, simpleCol, bgType) {
        // Create overlay element
        const overlay = document.createElement('div');
        const midTwist = document.getElementById("midTwist").checked;
        const squareBig = document.getElementById("squareBig").checked;
        overlay.id = 'overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'right';
        overlay.style.alignItems = 'top';

        // Create canvas element
        const closeCanvas = document.createElement('div');
        closeCanvas.width = 1100;
        closeCanvas.height = 1000;
        closeCanvas.style.position = "absolute";
        const displayX = window.innerWidth;
        const posX = displayX / 2 - 500;
        closeCanvas.style.top = "10px";
        closeCanvas.style.left = posX + "px";
        closeCanvas.style.transform = "scale(0.9)";
        overlay.appendChild(closeCanvas);

        // Add close button to the overlay
        const closeButton = document.createElement("button");
        closeButton.className = "btn-close";
        closeButton.style.position = "relative";
        closeButton.style.top = "0";
        closeButton.style.right = "-50px";
        closeCanvas.appendChild(closeButton);

        // add download button to download 
        const downloadButton = document.createElement("button");
        downloadButton.className = "btn btn-outline-info";
        downloadButton.textContent = "Download";
        downloadButton.style.position = "relative";
        downloadButton.style.top = "960px";
        downloadButton.style.right = "30px";
        closeCanvas.appendChild(downloadButton);

        // Append overlay to the body
        document.body.appendChild(overlay);
        let audioElement;
        if (musicFile) {
            // Create a new Audio element
            audioElement = new Audio();

            // Set the file as the source of the Audio element
            audioElement.src = URL.createObjectURL(musicFile);
        } else {
            audioElement = new Audio(musicPath);
        }
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const audioSource = audioContext.createMediaElementSource(audioElement);
        audioSource.connect(analyser);
        analyser.connect(audioContext.destination);

        const instance = initMusicVisualization(audioContext, analyser, closeCanvas, audioElement, bgType, colour1, colour2, simpleCol, midTwist, selectedVisualization, squareBig);
        
        // eventlistener for the close button
        closeButton.addEventListener('click', function () {
            instance.resetInst();
            instance.removeCanvas();
            overlay.removeChild(closeCanvas);
            document.body.removeChild(overlay);
            location.reload();
        });

        // eventlistener for the download button
        downloadButton.addEventListener('click', function () {
            instance.downloadPic();
        });

        // Return the instance for further use if needed
        return instance;
    }

    // function to update the state of the Save button
    function updateSaveButtonState() {
        // check if all required inputs are filled
        const isMusicFileSelected = customMusicInput.files.length > 0;
        const isMusicRadioSelected = Array.from(radioButtons).some(input => input.checked);
        const isAnyMusic = (isMusicFileSelected || isMusicRadioSelected);
        const isBackgroundSelected = backgroundTypeSelect.value !== "";
        
        if (selectedVisualization == "square") {
            configureButton.disabled = !isAnyMusic;
        } else {
            // enable or disable the Save button based on the conditions
            configureButton.disabled = !(isAnyMusic && isBackgroundSelected);
        }
    }

    // Function to handle visibility based on selected background type
    function handleBackgroundTypeVisibility() {
        const selectedBackgroundType = backgroundTypeSelect.value;
        const visualizationType = visualizationTypeSelect.value;

        // Hide all gradient colors divs
        gradientColors.style.display = "none";
        simpleBackground.style.display = "none";

        if (visualizationType !== "square") {
            // Show the appropriate explanation div and gradient colors div based on selected background type
            if (selectedBackgroundType === "gradient") {
                gradientColors.style.display = "block";
            }  else if (selectedBackgroundType === "simple") {
                simpleBackground.style.display = "block";
            }
        } else {
            simpleBackground.style.display = "block";
        }
    }

    // Function to clear the file input
    function clearFileInput() {
        customMusicInput.value = ''; // Clear the file input
        clearButton.disabled = true; // Disable the clear button after clearing the input
    }

    // Function to handle file change
    function handleFileChange() {
        const fileName = customMusicInput.value.split(/(\\|\/)/g).pop(); // Get only the file name
        clearButton.disabled = !fileName; // Disable the clear button if no file is selected
    }

    function getMusicFile() {
        for (const file of radioButtons) {
            if (file.checked) {
                return fileNames[file.value];
            }
        }
        return NaN;
    }

    // Function to update the visibility of explanation texts
    function updateExplanationVisibility() {
        // Hide all explanation texts
        drawExplanationDiv.style.display = "none";
        triangleExplanationDiv.style.display = "none";
        squareExplanationDiv.style.display = "none";
        dynamicExplanationDiv.style.display = "none";
        gradientExplanationDiv.style.display = "none";
        simpleBackgroundExplanation.style.display = "none";

        // Determine which explanation text to show based on the selected options
        const visualizationType = visualizationTypeSelect.value;
        const backgroundType = backgroundTypeSelect.value;

        if (visualizationType === "draw") {
            drawExplanationDiv.style.display = "block";
        } else if (visualizationType === "triangle") {
            triangleExplanationDiv.style.display = "block";
        } else if (visualizationType === "square") {
            squareExplanationDiv.style.display = "block";
        }

        if (backgroundType === "dynamic") {
            dynamicExplanationDiv.style.display = "block";
        } else if (backgroundType === "gradient") {
            gradientExplanationDiv.style.display = "block";
        } else if (backgroundType === "simple") {
            simpleBackgroundExplanation.style.display = "block";
        }

        // enable or disable the Save button based on whether both selections are made
        //configureButton.disabled = !(visualizationType && backgroundType);
    }

    /// this help function loads another script
    function loadScript(scriptSrc) {
        const script = document.createElement('script');
        script.type = 'module';
        script.src = scriptSrc;
        document.head.appendChild(script);
    }

    function removeOverlay(instance) {
        //instance.removeCanvas();
        // Remove the overlay when the close button is clicked
        overlay.removeChild(closeCanvas);
        document.body.removeChild(overlay);
    }

//});

document.addEventListener("DOMContentLoaded", () => {
    // Glyph category functionality
    const categoryButtons = document.querySelectorAll(".glyph-category")
    const keyboards = {
        lowercase: document.getElementById("lowercase-glyphs"),
        uppercase: document.getElementById("uppercase-glyphs"),
        numbers: document.getElementById("numbers-glyphs"),
        "common-latin": document.getElementById("common-latin-glyphs"),
        punctuation: document.getElementById("punctuation-glyphs"),
        marks: document.getElementById("marks-glyphs"),
    }

    categoryButtons.forEach((button) => {
        button.addEventListener("click", function() {
            categoryButtons.forEach((btn) => btn.classList.remove("active"))
            this.classList.add("active")

            const category = this.getAttribute("data-category")
            Object.keys(keyboards).forEach((key) => {
                keyboards[key].style.display = key === category ? "flex" : "none"
            })
        })
    })

    // Zoom functionality
    const zoomButtons = document.querySelectorAll(".mac-control.zoom")
    const imageModal = document.getElementById("image-modal")
    const zoomedImage = document.getElementById("zoomed-image")
    const closeModal = document.querySelector(".close-modal")

    zoomButtons.forEach((button) => {
        button.addEventListener("click", function() {
            const imageSrc = this.getAttribute("data-image")
            if (imageSrc) {
                zoomedImage.src = imageSrc
                imageModal.style.display = "flex"
            }
        })
    })

    closeModal.addEventListener("click", () => {
        imageModal.style.display = "none"
    })

    window.addEventListener("click", (event) => {
        if (event.target === imageModal) {
            imageModal.style.display = "none"
        }
    })

    // Interactive keyboard functionality
    const textDisplay = document.getElementById("text-display")
    const keys = document.querySelectorAll(".retro-keyboard .key")
    const fontStyleOptions = document.querySelectorAll('input[name="font-style"]')
    const italicOption = document.querySelector('input[name="italic-style"]')

    // Initialize text display
    let currentText = ""

    // Function to update the text display with current font style
    function updateTextDisplay() {
        if (currentText === "") {
            textDisplay.textContent = "Start typing..."
            textDisplay.classList.add("placeholder-text")
        } else {
            textDisplay.textContent = currentText
            textDisplay.classList.remove("placeholder-text")
        }

        // Apply selected font style
        const selectedStyle = document.querySelector('input[name="font-style"]:checked').value
        const isItalic = italicOption.checked

        // Reset all font classes first
        textDisplay.className = "text-display-area"

        // Add the base azert-font class
        textDisplay.classList.add("azert-font")

        // Apply the selected weight
        switch (selectedStyle) {
            case "thin":
                textDisplay.classList.add("azert-font-thin")
                break
            case "extralight":
                textDisplay.classList.add("azert-font-extralight")
                break
            case "light":
                textDisplay.classList.add("azert-font-light")
                break
            case "regular":
                textDisplay.classList.add("azert-font-regular")
                break
            case "medium":
                textDisplay.classList.add("azert-font-medium")
                break
            case "semibold":
                textDisplay.classList.add("azert-font-semibold")
                break
            case "bold":
                textDisplay.classList.add("azert-font-bold")
                break
            case "extrabold":
                textDisplay.classList.add("azert-font-extrabold")
                break
            case "black":
                textDisplay.classList.add("azert-font-black")
                break
            default:
                textDisplay.classList.add("azert-font-regular")
        }

        // Apply italic if checked
        if (isItalic) {
            textDisplay.classList.add("azert-font-italic")
        }
    }

    // Handle keyboard clicks
    keys.forEach((key) => {
        key.addEventListener("click", function() {
            const keyValue = this.getAttribute("data-key")

            // Add visual feedback for key press
            this.classList.add("key-pressed")
            setTimeout(() => {
                this.classList.remove("key-pressed")
            }, 150)

            // Play click sound if available
            const clickSound = document.getElementById("mac-click")
            if (clickSound) {
                clickSound.currentTime = 0
                clickSound.play().catch((e) => console.log("Audio play failed:", e))
            }

            // Handle special keys
            if (keyValue === "Backspace") {
                currentText = currentText.slice(0, -1)
            } else {
                currentText += keyValue
            }

            updateTextDisplay()
        })
    })

    // Handle font style changes
    fontStyleOptions.forEach((option) => {
        option.addEventListener("change", updateTextDisplay)
    })

    italicOption.addEventListener("change", updateTextDisplay)

    // Handle physical keyboard input
    document.addEventListener("keydown", (event) => {
        // Map physical keyboard keys to virtual keyboard
        const key = event.key

        // Only handle printable characters and backspace
        if (key.length === 1 || key === "Backspace" || key === "Space") {
            // Find the corresponding virtual key
            let keySelector = `.key[data-key="${key}"]`
            if (key === " ") {
                keySelector = `.key[data-key=" "]`
            }

            const virtualKey =
                document.querySelector(keySelector) || document.querySelector(`.key[data-key="${key.toLowerCase()}"]`)

            if (virtualKey) {
                // Simulate click on virtual key
                virtualKey.classList.add("key-pressed")
                setTimeout(() => {
                    virtualKey.classList.remove("key-pressed")
                }, 150)
            }

            // Update text
            if (key === "Backspace") {
                currentText = currentText.slice(0, -1)
            } else {
                currentText += key
            }

            updateTextDisplay()

            // Play click sound
            const clickSound = document.getElementById("mac-click")
            if (clickSound) {
                clickSound.currentTime = 0
                clickSound.play().catch((e) => console.log("Audio play failed:", e))
            }

            // Prevent default behavior for space and backspace to avoid page scrolling
            if (key === " " || key === "Backspace") {
                event.preventDefault()
            }
        }
    })

    // Add CSS for key press animation and text display styling
    const style = document.createElement("style")
    style.textContent = `
        .key-pressed {
            background-color: #aaa !important;
            transform: scale(0.95);
            transition: transform 0.1s, background-color 0.1s;
        }
        
        #text-display {
            font-family: "Azeret Mono", monospace;
            font-size: 1.5rem;
            line-height: 1.5;
            min-height: 100px;
            padding: 1rem;
            white-space: pre-wrap;
            word-break: break-word;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f9f9f9;
            transition: all 0.2s ease;
        }
        
        .placeholder-text {
            color: #888;
            font-style: italic;
        }
        
        .retro-keyboard .key {
            transition: transform 0.1s, background-color 0.1s;
            user-select: none;
            cursor: pointer;
        }
        
        .retro-keyboard .key:hover {
            background-color: #e0e0e0;
        }
    `
    document.head.appendChild(style)

    // Initialize with default style
    updateTextDisplay()

    // Clear "Start typing..." when user clicks in the text display area
    textDisplay.addEventListener("click", () => {
        if (currentText === "") {
            textDisplay.classList.remove("placeholder-text")
            textDisplay.textContent = ""

            // Set focus to capture keyboard input
            textDisplay.setAttribute("tabindex", "0")
            textDisplay.focus()
        }
    })

    // Make text display focusable to capture keyboard input
    textDisplay.setAttribute("tabindex", "0")
})
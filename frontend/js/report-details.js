document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // GET SAVED REPORT DATA
    // ==========================================

    const category =
        localStorage.getItem("reportCategory") || "Fire";

    const savedFireType =
        localStorage.getItem("reportFireType") || "";

    const savedSeverity =
        localStorage.getItem("reportSeverity") || "Low";

    const savedDescription =
        localStorage.getItem("reportDescription") || "";


    // ==========================================
    // ELEMENTS
    // ==========================================

    const heading =
        document.querySelector(".details-header h2");

    const fireTypeInput =
        document.getElementById("fireType");

    const descriptionInput =
        document.getElementById("description");

    const severityButtons =
        document.querySelectorAll(".sev");

    const continueButton =
        document.getElementById("continueToLocation");


    // ==========================================
    // EVIDENCE ELEMENTS
    // ==========================================

    const uploadBox =
        document.getElementById("uploadBox");

    const evidenceInput =
        document.getElementById("evidenceInput");

    const uploadBtn =
        document.getElementById("uploadBtn");

    const evidencePreview =
        document.getElementById("evidencePreview");

    const uploadError =
        document.getElementById("uploadError");


    // ==========================================
    // SELECTED EVIDENCE FILES
    // ==========================================

    let selectedFiles = [];


    // ==========================================
    // DISPLAY CATEGORY
    // ==========================================

    if (heading) {
        heading.textContent =
            `Report Details: ${category}`;
    }


    // ==========================================
    // RESTORE FIRE TYPE
    // ==========================================

    if (fireTypeInput && savedFireType) {
        fireTypeInput.value = savedFireType;
    }


    // ==========================================
    // RESTORE DESCRIPTION
    // ==========================================

    if (descriptionInput && savedDescription) {
        descriptionInput.value = savedDescription;
    }


    // ==========================================
    // RESTORE SEVERITY
    // ==========================================

    let selectedSeverity = savedSeverity;

    severityButtons.forEach(button => {

        const buttonSeverity =
            button.querySelector("strong")?.textContent
                .trim()
                .toLowerCase();

        if (
            buttonSeverity ===
            savedSeverity.toLowerCase()
        ) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }


        // Click severity
        button.addEventListener("click", () => {

            severityButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            selectedSeverity =
                button.querySelector("strong")
                    .textContent
                    .trim()
                    .toLowerCase();

            selectedSeverity =
                selectedSeverity.charAt(0).toUpperCase() +
                selectedSeverity.slice(1);

        });

    });


    // ==========================================
    // EVIDENCE UPLOAD
    // ==========================================

    if (
        uploadBox &&
        evidenceInput &&
        evidencePreview
    ) {

        // --------------------------------------
        // CLICK UPLOAD BUTTON
        // --------------------------------------

        if (uploadBtn) {

            uploadBtn.addEventListener("click", (event) => {

                event.stopPropagation();

                evidenceInput.click();

            });

        }


        // --------------------------------------
        // CLICK UPLOAD AREA
        // --------------------------------------

        uploadBox.addEventListener("click", () => {

            evidenceInput.click();

        });


        // --------------------------------------
        // FILE SELECTED
        // --------------------------------------

        evidenceInput.addEventListener("change", () => {

            const files =
                Array.from(evidenceInput.files);

            addEvidenceFiles(files);

        });


        // --------------------------------------
        // DRAG OVER
        // --------------------------------------

        uploadBox.addEventListener("dragover", (event) => {

            event.preventDefault();

            uploadBox.classList.add("dragging");

        });


        // --------------------------------------
        // DRAG LEAVE
        // --------------------------------------

        uploadBox.addEventListener("dragleave", () => {

            uploadBox.classList.remove("dragging");

        });


        // --------------------------------------
        // DROP FILES
        // --------------------------------------

        uploadBox.addEventListener("drop", (event) => {

            event.preventDefault();

            uploadBox.classList.remove("dragging");

            const files =
                Array.from(event.dataTransfer.files);

            addEvidenceFiles(files);

        });

    }


    // ==========================================
    // ADD EVIDENCE FILES
    // ==========================================

    function addEvidenceFiles(files) {

        if (uploadError) {
            uploadError.textContent = "";
        }


        files.forEach(file => {

            // ----------------------------------
            // MAX 4 FILES
            // ----------------------------------

            if (selectedFiles.length >= 4) {

                showUploadError(
                    "You can upload a maximum of 4 items."
                );

                return;

            }


            // ----------------------------------
            // MAX 20MB
            // ----------------------------------

            const maxSize =
                20 * 1024 * 1024;

            if (file.size > maxSize) {

                showUploadError(
                    `${file.name} is larger than 20MB.`
                );

                return;

            }


            // ----------------------------------
            // IMAGE OR VIDEO ONLY
            // ----------------------------------

            if (
                !file.type.startsWith("image/") &&
                !file.type.startsWith("video/")
            ) {

                showUploadError(
                    `${file.name} is not a supported image or video.`
                );

                return;

            }


            // ----------------------------------
            // PREVENT DUPLICATES
            // ----------------------------------

            const duplicate =
                selectedFiles.some(existingFile =>
                    existingFile.name === file.name &&
                    existingFile.size === file.size
                );

            if (duplicate) {
                return;
            }


            // ----------------------------------
            // ADD FILE
            // ----------------------------------

            selectedFiles.push(file);

        });


        renderEvidence();

        updateFileInput();

    }


    // ==========================================
    // SHOW UPLOAD ERROR
    // ==========================================

    function showUploadError(message) {

        if (uploadError) {
            uploadError.textContent = message;
        }

    }


    // ==========================================
    // DISPLAY FILE PREVIEWS
    // ==========================================

    function renderEvidence() {

        if (!evidencePreview) {
            return;
        }

        evidencePreview.innerHTML = "";


        selectedFiles.forEach((file, index) => {

            const evidenceItem =
                document.createElement("div");

            evidenceItem.className =
                "evidence-item";


            // ----------------------------------
            // IMAGE
            // ----------------------------------

            if (file.type.startsWith("image/")) {

                const image =
                    document.createElement("img");

                image.src =
                    URL.createObjectURL(file);

                image.alt =
                    file.name;

                evidenceItem.appendChild(image);

            }


            // ----------------------------------
            // VIDEO
            // ----------------------------------

            else if (file.type.startsWith("video/")) {

                const video =
                    document.createElement("video");

                video.src =
                    URL.createObjectURL(file);

                video.controls = true;

                evidenceItem.appendChild(video);

            }


            // ----------------------------------
            // REMOVE BUTTON
            // ----------------------------------

            const removeButton =
                document.createElement("button");

            removeButton.type = "button";

            removeButton.className =
                "remove-evidence";

            removeButton.innerHTML = "&times;";


            removeButton.addEventListener("click", (event) => {

                event.stopPropagation();

                selectedFiles.splice(index, 1);

                renderEvidence();

                updateFileInput();

            });


            evidenceItem.appendChild(removeButton);


            // ----------------------------------
            // FILE NAME
            // ----------------------------------

            const fileName =
                document.createElement("p");

            fileName.textContent =
                file.name;

            evidenceItem.appendChild(fileName);


            evidencePreview.appendChild(evidenceItem);

        });

    }


    // ==========================================
    // UPDATE FILE INPUT
    // ==========================================

    function updateFileInput() {

        if (!evidenceInput) {
            return;
        }

        const dataTransfer =
            new DataTransfer();

        selectedFiles.forEach(file => {

            dataTransfer.items.add(file);

        });

        evidenceInput.files =
            dataTransfer.files;

    }


    // ==========================================
    // CONTINUE TO LOCATION
    // ==========================================

    if (continueButton) {

        continueButton.addEventListener("click", (event) => {

            event.preventDefault();


            // ----------------------------------
            // GET CURRENT VALUES
            // ----------------------------------

            const fireType =
                fireTypeInput
                    ? fireTypeInput.value.trim()
                    : "";

            const description =
                descriptionInput
                    ? descriptionInput.value.trim()
                    : "";


            // ----------------------------------
            // VALIDATE FIRE TYPE
            // ----------------------------------

            if (
                category === "Fire" &&
                !fireType
            ) {

                alert(
                    "Please select the fire type."
                );

                if (fireTypeInput) {
                    fireTypeInput.focus();
                }

                return;

            }


            // ----------------------------------
            // VALIDATE DESCRIPTION
            // ----------------------------------

            if (!description) {

                alert(
                    "Please provide a description."
                );

                if (descriptionInput) {
                    descriptionInput.focus();
                }

                return;

            }


            // ==================================
            // SAVE REPORT DETAILS
            // ==================================

            localStorage.setItem(
                "reportCategory",
                category
            );

            localStorage.setItem(
                "reportFireType",
                fireType
            );

            localStorage.setItem(
                "reportSeverity",
                selectedSeverity
            );

            localStorage.setItem(
                "reportDescription",
                description
            );


            // ==================================
            // GO TO LOCATION
            // ==================================

            window.location.href =
                "report-location.html";

        });

    }

});
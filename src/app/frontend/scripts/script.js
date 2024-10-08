// Function to fetch the configuration
async function fetchConfig() {
    const response = await fetch('config.json');
    const config = await response.json();
    return config;
}

$(document).ready(function () {

    //getDocuments();
    main();

    $('#send-button').on('click', sendMessage);

    const screen = getQueryParam('screen');
    toggleDisplay(screen);

    // Add event listeners to navigation links
    $('#nav-container nav ul li a').on('click', function (event) {
        event.preventDefault();
        const screen = new URL(this.href).searchParams.get('screen');
        toggleDisplay(screen);
        history.pushState(null, '', this.href);
    });

    // Add event listener to the file input
    document.getElementById('file-input').addEventListener('change', function (event) {
        const fileList = document.getElementById('file-list');
        const noFilesPlaceholder = document.getElementById('num-files-selected-placeholder');
        const uploadButton = document.getElementById('upload-button');
        fileList.innerHTML = ''; // Clear the list

        updatePlaceholder();

        Array.from(event.target.files).forEach((file, index) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${file.name} (${(file.size / 1024).toFixed(2)} KB)`;

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent triggering the file input click event

                const filesArray = Array.from(document.getElementById('file-input').files);
                filesArray.splice(index, 1);

                const dataTransfer = new DataTransfer();
                filesArray.forEach(file => dataTransfer.items.add(file));
                document.getElementById('file-input').files = dataTransfer.files;

                listItem.remove();
                updatePlaceholder();
                updateFileCount(); // Update the file count whenever a file is removed

                // Clear the file input if no files are left
                if (filesArray.length === 0) {
                    document.getElementById('file-input').value = '';
                }
            });

            listItem.appendChild(removeButton);
            fileList.appendChild(listItem);
        });

        updatePlaceholder();
    });

    // Trigger file input click when custom button is clicked
    document.getElementById('choose-files-button').addEventListener('click', function (event) {
        event.preventDefault(); // Prevent default button behavior
        document.getElementById('file-input').click();
    });

    // Filter existing documents based on the name field
    document.getElementById('filter-input').addEventListener('input', function (event) {
        const filterValue = event.target.value.toLowerCase();
        const documentRows = document.querySelectorAll('#document-list .document-row:not(.header)');
        const clearFilterButton = document.getElementById('clear-filter-button');
        const filterButton = document.getElementById('filter-button');

        if (filterValue) {
            clearFilterButton.style.display = 'block';
            filterButton.style.display = 'none';
        } else {
            clearFilterButton.style.display = 'none';
            filterButton.style.display = 'block';
            documentRows.forEach(row => {
                if (!row.classList.contains('sample')) {
                    row.style.display = ''; // Reset the visibility of all rows except sample ones
                }
            });
        }

        documentRows.forEach(row => {
            if (row.style.display === 'none') {
                return; // Skip hidden rows
            }
            const nameCell = row.querySelector('.document-cell:nth-child(3)');
            if (nameCell.textContent.toLowerCase().includes(filterValue)) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    document.getElementById('clear-filter-button').addEventListener('click', function () {
        document.getElementById('filter-input').value = ''; // Clear the filter input
        const documentRows = document.querySelectorAll('#document-list .document-row:not(.header)');
        documentRows.forEach(row => {
            if (!row.classList.contains('sample')) {
                row.style.display = ''; // Reset the visibility of all rows except sample ones
            }
        });
        this.style.display = 'none'; // Hide the clear filter button
        document.getElementById('filter-button').style.display = 'block'; // Show the filter button
    });

    // Event listener for upload button
    document.getElementById('upload-button').addEventListener('click', function () {
        const files = document.getElementById('file-input').files;
        if (files.length > 0) {
            //uploadFilesToAzure(files);
            uploadFilesToAzureUsingLibrary(files);
        } else {
            console.log('No files selected for upload.');
        }
    });
});

// Main function to execute the logic
async function main() {
    const config = await fetchConfig();

    const accountName = config.AZURE_ACCOUNT_NAME;
    const azureStorageUrl = config.AZURE_STORAGE_URL;
    const containerName = config.AZURE_CONTAINER_NAME;
    const sasTokenConfig = config.SAS_TOKEN;
    const fileExtensions = config.FILE_EXTENSIONS;

    // Construct the SAS token from the individual components
    const sasToken = `sv=${sasTokenConfig.SV}&comp=${sasTokenConfig.COMP}&include=${sasTokenConfig.INCLUDE}&restype=${sasTokenConfig.RESTYPE}&ss=${sasTokenConfig.SS}&srt=${sasTokenConfig.SRT}&sp=${sasTokenConfig.SP}&se=${sasTokenConfig.SE}&st=${sasTokenConfig.ST}&spr=${sasTokenConfig.SPR}&sig=${sasTokenConfig.SIG}`;

    const storageUrl = `https://${accountName}.${azureStorageUrl}/${containerName}?${sasToken}`;

    fetch(`${storageUrl}`, {
        method: 'GET'
    })
        .then(response => response.text())
        .then(data => {
            // Parse the XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");
            const blobs = xmlDoc.getElementsByTagName("Blob");

            // Get the document list and sample rows
            const docList = document.getElementById('document-list');
            const sampleRows = document.querySelectorAll('.document-row.sample');

            // Clear existing document rows except the header
            const existingRows = docList.querySelectorAll('.document-row:not(.header)');
            existingRows.forEach(row => row.style.display = 'none');

            if (blobs.length === 0) {
                // Show sample rows if no results
                sampleRows.forEach(row => row.style.display = '');
            } else {
                // Hide sample rows if there are results
                sampleRows.forEach(row => row.style.display = 'none');

                // Iterate over the blobs and process them
                Array.from(blobs).forEach(blob => {
                    const blobName = blob.getElementsByTagName("Name")[0].textContent;
                    const lastModified = blob.getElementsByTagName("Last-Modified")[0].textContent;
                    const contentType = blob.getElementsByTagName("Content-Type")[0].textContent.replace('vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx').replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx');
                    const blobUrl = `https://${accountName}.${azureStorageUrl}/${containerName}/${blobName}?${sasToken}`;

                    // Create the document row
                    const documentRow = document.createElement('div');
                    documentRow.className = 'document-row';

                    // Create the document cells
                    const previewCell = document.createElement('div');
                    previewCell.className = 'document-cell';
                    const previewButton = document.createElement('button');
                    previewButton.textContent = 'Preview';
                    previewCell.appendChild(previewButton);

                    const statusCell = document.createElement('div');
                    statusCell.className = 'document-cell';
                    statusCell.textContent = 'Active';

                    const nameCell = document.createElement('div');
                    nameCell.className = 'document-cell';
                    const nameLink = document.createElement('a');
                    nameLink.href = blobUrl;
                    nameLink.textContent = blobName;
                    nameLink.target = '_blank'; // Open link in a new tab
                    nameCell.appendChild(nameLink);

                    const contentTypeCell = document.createElement('div');
                    contentTypeCell.className = 'document-cell content-type';
                    if (fileExtensions.PDF.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#E2E5E7;" d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"></path> <path style="fill:#B0B7BD;" d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"></path> <polygon style="fill:#CAD1D8;" points="480,224 384,128 480,128 "></polygon> <path style="fill:#F15642;" d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16 V416z"></path> <g> <path style="fill:#FFFFFF;" d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48 c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z"></path> <path style="fill:#FFFFFF;" d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296 c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z"></path> <path style="fill:#FFFFFF;" d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68 h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912 c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z"></path> </g> <path style="fill:#CAD1D8;" d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"></path> </g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.IMAGE.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 501.551 501.551" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#F2F2F2;" d="M480.653,0H20.898C9.404,0,0,9.404,0,20.898v459.755c0,11.494,9.404,20.898,20.898,20.898h459.755 c11.494,0,20.898-9.404,20.898-20.898V20.898C501.551,9.404,492.147,0,480.653,0z"></path> <rect x="36.571" y="36.571" style="fill:#84DBFF;" width="428.408" height="345.861"></rect> <path style="fill:#1bc546;" d="M261.224,382.433H36.571v-87.771c17.763-5.224,37.616-7.314,57.469-7.314 c25.078,0,50.155,4.18,71.053,12.539c6.269,2.09,11.494,4.18,16.718,7.314C218.384,323.918,246.596,350.041,261.224,382.433z"></path> <path style="fill:#40596B;" d="M464.98,271.673v110.759H127.478c9.404-29.257,29.257-55.38,55.38-76.278 c42.841-34.482,103.445-55.38,172.408-55.38C393.927,250.776,432.588,258.09,464.98,271.673z"></path> <g> <circle style="fill:#FFFFFF;" cx="122.253" cy="122.253" r="42.841"></circle> <path style="fill:#FFFFFF;" d="M433.633,101.355c1.045-3.135,1.045-6.269,1.045-9.404c0-16.718-13.584-31.347-31.347-31.347 c-11.494,0-21.943,6.269-27.167,15.673c-3.135-2.09-7.314-2.09-11.494-2.09c-14.629,0-26.122,10.449-28.212,24.033 c-8.359,2.09-14.629,9.404-14.629,17.763c0,10.449,8.359,18.808,18.808,18.808h82.547c10.449,0,18.808-8.359,18.808-18.808 C441.992,109.714,438.857,104.49,433.633,101.355z"></path> </g> </g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.DOC.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="8" y="2" width="24" height="28" rx="2" fill="url(#paint0_linear_87_7724)"></rect> <path d="M8 23H32V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V23Z" fill="url(#paint1_linear_87_7724)"></path> <rect x="8" y="16" width="24" height="7" fill="url(#paint2_linear_87_7724)"></rect> <rect x="8" y="9" width="24" height="7" fill="url(#paint3_linear_87_7724)"></rect> <path d="M8 12C8 10.3431 9.34315 9 11 9H17C18.6569 9 20 10.3431 20 12V24C20 25.6569 18.6569 27 17 27H8V12Z" fill="#000000" fill-opacity="0.3"></path> <rect y="7" width="18" height="18" rx="2" fill="url(#paint4_linear_87_7724)"></rect> <path d="M15 11.0142H13.0523L11.5229 17.539L9.84967 11H8.20261L6.51634 17.539L5 11.0142H3L5.60131 21H7.3268L9 14.6879L10.6732 21H12.3987L15 11.0142Z" fill="white"></path> <defs> <linearGradient id="paint0_linear_87_7724" x1="8" y1="6.66667" x2="32" y2="6.66667" gradientUnits="userSpaceOnUse"> <stop stop-color="#2B78B1"></stop> <stop offset="1" stop-color="#338ACD"></stop> </linearGradient> <linearGradient id="paint1_linear_87_7724" x1="8" y1="27.375" x2="32" y2="27.375" gradientUnits="userSpaceOnUse"> <stop stop-color="#1B366F"></stop> <stop offset="1" stop-color="#2657B0"></stop> </linearGradient> <linearGradient id="paint2_linear_87_7724" x1="18.5" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse"> <stop stop-color="#20478B"></stop> <stop offset="1" stop-color="#2D6FD1"></stop> </linearGradient> <linearGradient id="paint3_linear_87_7724" x1="18.5" y1="13" x2="32" y2="13" gradientUnits="userSpaceOnUse"> <stop stop-color="#215295"></stop> <stop offset="1" stop-color="#2E84D3"></stop> </linearGradient> <linearGradient id="paint4_linear_87_7724" x1="3.31137e-08" y1="17" x2="19" y2="17" gradientUnits="userSpaceOnUse"> <stop stop-color="#223E74"></stop> <stop offset="1" stop-color="#215091"></stop> </linearGradient> </defs> </g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.EXCEL.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><linearGradient id="a" x1="4.494" y1="-2092.086" x2="13.832" y2="-2075.914" gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"></stop><stop offset="0.5" stop-color="#117e43"></stop><stop offset="1" stop-color="#0b6631"></stop></linearGradient></defs><title>file_type_excel</title><path d="M19.581,15.35,8.512,13.4V27.809A1.192,1.192,0,0,0,9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5Z" style="fill:#185c37"></path><path d="M19.581,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5L19.581,16l5.861,1.95L30,16V9.5Z" style="fill:#21a366"></path><path d="M8.512,9.5H19.581V16H8.512Z" style="fill:#107c41"></path><path d="M16.434,8.2H8.512V24.45h7.922a1.2,1.2,0,0,0,1.194-1.191V9.391A1.2,1.2,0,0,0,16.434,8.2Z" style="opacity:0.10000000149011612;isolation:isolate"></path><path d="M15.783,8.85H8.512V25.1h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"></path><path d="M15.783,8.85H8.512V23.8h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"></path><path d="M15.132,8.85H8.512V23.8h6.62a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.132,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"></path><path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" style="fill:url(#a)"></path><path d="M5.7,19.873l2.511-3.884-2.3-3.862H7.758L9.013,14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359,3.84,2.419,3.905H10.821l-1.45-2.711A2.355,2.355,0,0,1,9.2,16.8H9.176a1.688,1.688,0,0,1-.168.351L7.515,19.873Z" style="fill:#fff"></path><path d="M28.806,3H19.581V9.5H30V4.191A1.192,1.192,0,0,0,28.806,3Z" style="fill:#33c481"></path><path d="M19.581,16H30v6.5H19.581Z" style="fill:#107c41"></path></g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.PPT.toLowerCase().endsWith('ppt') || blobName.toLowerCase().endsWith('pptx')) {
                        contentTypeCell.innerHTML = ``;
                    }
                    else {
                        //contentTypeCell.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 3.75H19.5L20.25 4.5V20.25H4.5L3.75 19.5V3.75ZM5.25 5.25V12.9166L7.90909 10.2575L13.3636 15.7121L16.7727 12.303L18.75 14.2802V5.25H5.25ZM18.75 16.4016L16.7727 14.4243L13.3636 17.8334L7.90909 12.3788L5.25 15.0379V18.75H18.75V16.4016ZM14.7273 7.97727C14.0118 7.97727 13.4318 8.55727 13.4318 9.27273C13.4318 9.98819 14.0118 10.5682 14.7273 10.5682C15.4427 10.5682 16.0227 9.98819 16.0227 9.27273C16.0227 8.55727 15.4427 7.97727 14.7273 7.97727ZM11.9318 9.27273C11.9318 7.72884 13.1834 6.47727 14.7273 6.47727C16.2712 6.47727 17.5227 7.72884 17.5227 9.27273C17.5227 10.8166 16.2712 12.0682 14.7273 12.0682C13.1834 12.0682 11.9318 10.8166 11.9318 9.27273Z" fill="#208113"></path> </g></svg> ${contentType}`;
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fxemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#F9E7C0" d="M437.567 512H88.004a8.182 8.182 0 0 1-8.182-8.182V8.182A8.182 8.182 0 0 1 88.004 0H288.79l156.96 156.96v346.858a8.183 8.183 0 0 1-8.183 8.182z"></path><path fill="#EAC083" d="M288.79 0l156.96 156.96H322.152c-18.426 0-33.363-14.937-33.363-33.363V0z"></path><path fill="#597B91" d="M235.078 92.401H126.453c-6.147 0-11.13-4.983-11.13-11.13s4.983-11.13 11.13-11.13h108.625c6.147 0 11.13 4.983 11.13 11.13s-4.983 11.13-11.13 11.13zm11.13 61.723c0-6.147-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h108.625c6.147 0 11.13-4.983 11.13-11.13zm0 72.854c0-6.147-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h108.625c6.147-.001 11.13-4.983 11.13-11.13zm94.038 72.853c0-6.146-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h202.663c6.147 0 11.13-4.983 11.13-11.13zm37.493-72.853c0-6.147-4.983-11.13-11.13-11.13h-74.985c-6.146 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h74.985c6.147-.001 11.13-4.983 11.13-11.13zM299.92 372.685c0-6.146-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13H288.79c6.147-.001 11.13-4.984 11.13-11.13zm66.21 72.853c0-6.146-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13H355c6.146 0 11.13-4.983 11.13-11.13z"></path></g></svg> ${contentType}`;
                        //contentTypeCell.textContent = contentType;
                    }

                    const lastModifiedCell = document.createElement('div');
                    lastModifiedCell.className = 'document-cell';
                    lastModifiedCell.textContent = lastModified;

                    // Append cells to the document row
                    documentRow.appendChild(previewCell);
                    documentRow.appendChild(statusCell);
                    documentRow.appendChild(nameCell);
                    documentRow.appendChild(contentTypeCell);
                    documentRow.appendChild(lastModifiedCell);

                    // Append the document row to the document list
                    docList.appendChild(documentRow);
                });
            }
        });
}

//code to get documents from Azure Storage
function getDocuments() {

    const accountName = "stdcdaiprodpoc001";
    const azureStorageUrl = "blob.core.windows.net";
    const containerName = "content";

    //https://stdcdaiprodpoc001.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-08T04:00:00Z&st=2024-10-08T04:00:00Z&spr=https&sig=sfSvKnCMycPfgT4y%2FpcMSsW3nXsVr8sLCrR7rAgDgZk%3D
    // Construct the SAS token from the individual components
    const sasToken = `sv=${sv}&comp=${comp}&include=${include}&restype=${restype}&ss=${ss}&srt=${srt}&sp=${sp}&se=${se}&st=${st}&spr=${spr}&sig=${sig}`;

    const storageUrl = `https://${accountName}.${azureStorageUrl}/${containerName}?${sasToken}`;

    fetch(`${storageUrl}`, {
        method: 'GET'
    })
        .then(response => response.text())
        .then(data => {
            // Parse the XML response
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(data, "application/xml");
            const blobs = xmlDoc.getElementsByTagName("Blob");

            // Get the document list and sample rows
            const docList = document.getElementById('document-list');
            const sampleRows = document.querySelectorAll('.document-row.sample');

            // Clear existing document rows except the header
            const existingRows = docList.querySelectorAll('.document-row:not(.header)');
            existingRows.forEach(row => row.style.display = 'none');

            if (blobs.length === 0) {
                // Show sample rows if no results
                sampleRows.forEach(row => row.style.display = '');
            } else {
                // Hide sample rows if there are results
                sampleRows.forEach(row => row.style.display = 'none');

                // Iterate over the blobs and process them
                Array.from(blobs).forEach(blob => {
                    const blobName = blob.getElementsByTagName("Name")[0].textContent;
                    const lastModified = blob.getElementsByTagName("Last-Modified")[0].textContent;
                    const contentType = blob.getElementsByTagName("Content-Type")[0].textContent.replace('vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'xlsx').replace('vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx');
                    const blobUrl = `https://{$accountName}.${azureStorageUrl}/${containerName}/${blobName}?${sasToken}`;

                    //https://stdcdaiprodpoc001.blob.core.windows.net/content/F11370_UNAX Certification 00749 - SIGNED (1).pdf

                    // Create the document row
                    const documentRow = document.createElement('div');
                    documentRow.className = 'document-row';

                    // Create the document cells
                    const previewCell = document.createElement('div');
                    previewCell.className = 'document-cell';
                    const previewButton = document.createElement('button');
                    previewButton.textContent = 'Preview';
                    previewCell.appendChild(previewButton);

                    const statusCell = document.createElement('div');
                    statusCell.className = 'document-cell';
                    statusCell.textContent = 'Active';

                    const nameCell = document.createElement('div');
                    nameCell.className = 'document-cell';
                    const nameLink = document.createElement('a');
                    nameLink.href = blobUrl;
                    nameLink.textContent = blobName;
                    nameLink.target = '_blank'; // Open link in a new tab
                    nameCell.appendChild(nameLink);

                    const contentTypeCell = document.createElement('div');
                    contentTypeCell.className = 'document-cell content-type';
                    if (fileExtensions.PDF.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#E2E5E7;" d="M128,0c-17.6,0-32,14.4-32,32v448c0,17.6,14.4,32,32,32h320c17.6,0,32-14.4,32-32V128L352,0H128z"></path> <path style="fill:#B0B7BD;" d="M384,128h96L352,0v96C352,113.6,366.4,128,384,128z"></path> <polygon style="fill:#CAD1D8;" points="480,224 384,128 480,128 "></polygon> <path style="fill:#F15642;" d="M416,416c0,8.8-7.2,16-16,16H48c-8.8,0-16-7.2-16-16V256c0-8.8,7.2-16,16-16h352c8.8,0,16,7.2,16,16 V416z"></path> <g> <path style="fill:#FFFFFF;" d="M101.744,303.152c0-4.224,3.328-8.832,8.688-8.832h29.552c16.64,0,31.616,11.136,31.616,32.48 c0,20.224-14.976,31.488-31.616,31.488h-21.36v16.896c0,5.632-3.584,8.816-8.192,8.816c-4.224,0-8.688-3.184-8.688-8.816V303.152z M118.624,310.432v31.872h21.36c8.576,0,15.36-7.568,15.36-15.504c0-8.944-6.784-16.368-15.36-16.368H118.624z"></path> <path style="fill:#FFFFFF;" d="M196.656,384c-4.224,0-8.832-2.304-8.832-7.92v-72.672c0-4.592,4.608-7.936,8.832-7.936h29.296 c58.464,0,57.184,88.528,1.152,88.528H196.656z M204.72,311.088V368.4h21.232c34.544,0,36.08-57.312,0-57.312H204.72z"></path> <path style="fill:#FFFFFF;" d="M303.872,312.112v20.336h32.624c4.608,0,9.216,4.608,9.216,9.072c0,4.224-4.608,7.68-9.216,7.68 h-32.624v26.864c0,4.48-3.184,7.92-7.664,7.92c-5.632,0-9.072-3.44-9.072-7.92v-72.672c0-4.592,3.456-7.936,9.072-7.936h44.912 c5.632,0,8.96,3.344,8.96,7.936c0,4.096-3.328,8.704-8.96,8.704h-37.248V312.112z"></path> </g> <path style="fill:#CAD1D8;" d="M400,432H96v16h304c8.8,0,16-7.2,16-16v-16C416,424.8,408.8,432,400,432z"></path> </g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.IMAGE.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 501.551 501.551" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path style="fill:#F2F2F2;" d="M480.653,0H20.898C9.404,0,0,9.404,0,20.898v459.755c0,11.494,9.404,20.898,20.898,20.898h459.755 c11.494,0,20.898-9.404,20.898-20.898V20.898C501.551,9.404,492.147,0,480.653,0z"></path> <rect x="36.571" y="36.571" style="fill:#84DBFF;" width="428.408" height="345.861"></rect> <path style="fill:#1bc546;" d="M261.224,382.433H36.571v-87.771c17.763-5.224,37.616-7.314,57.469-7.314 c25.078,0,50.155,4.18,71.053,12.539c6.269,2.09,11.494,4.18,16.718,7.314C218.384,323.918,246.596,350.041,261.224,382.433z"></path> <path style="fill:#40596B;" d="M464.98,271.673v110.759H127.478c9.404-29.257,29.257-55.38,55.38-76.278 c42.841-34.482,103.445-55.38,172.408-55.38C393.927,250.776,432.588,258.09,464.98,271.673z"></path> <g> <circle style="fill:#FFFFFF;" cx="122.253" cy="122.253" r="42.841"></circle> <path style="fill:#FFFFFF;" d="M433.633,101.355c1.045-3.135,1.045-6.269,1.045-9.404c0-16.718-13.584-31.347-31.347-31.347 c-11.494,0-21.943,6.269-27.167,15.673c-3.135-2.09-7.314-2.09-11.494-2.09c-14.629,0-26.122,10.449-28.212,24.033 c-8.359,2.09-14.629,9.404-14.629,17.763c0,10.449,8.359,18.808,18.808,18.808h82.547c10.449,0,18.808-8.359,18.808-18.808 C441.992,109.714,438.857,104.49,433.633,101.355z"></path> </g> </g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.DOC.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="none"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect x="8" y="2" width="24" height="28" rx="2" fill="url(#paint0_linear_87_7724)"></rect> <path d="M8 23H32V28C32 29.1046 31.1046 30 30 30H10C8.89543 30 8 29.1046 8 28V23Z" fill="url(#paint1_linear_87_7724)"></path> <rect x="8" y="16" width="24" height="7" fill="url(#paint2_linear_87_7724)"></rect> <rect x="8" y="9" width="24" height="7" fill="url(#paint3_linear_87_7724)"></rect> <path d="M8 12C8 10.3431 9.34315 9 11 9H17C18.6569 9 20 10.3431 20 12V24C20 25.6569 18.6569 27 17 27H8V12Z" fill="#000000" fill-opacity="0.3"></path> <rect y="7" width="18" height="18" rx="2" fill="url(#paint4_linear_87_7724)"></rect> <path d="M15 11.0142H13.0523L11.5229 17.539L9.84967 11H8.20261L6.51634 17.539L5 11.0142H3L5.60131 21H7.3268L9 14.6879L10.6732 21H12.3987L15 11.0142Z" fill="white"></path> <defs> <linearGradient id="paint0_linear_87_7724" x1="8" y1="6.66667" x2="32" y2="6.66667" gradientUnits="userSpaceOnUse"> <stop stop-color="#2B78B1"></stop> <stop offset="1" stop-color="#338ACD"></stop> </linearGradient> <linearGradient id="paint1_linear_87_7724" x1="8" y1="27.375" x2="32" y2="27.375" gradientUnits="userSpaceOnUse"> <stop stop-color="#1B366F"></stop> <stop offset="1" stop-color="#2657B0"></stop> </linearGradient> <linearGradient id="paint2_linear_87_7724" x1="18.5" y1="20" x2="32" y2="20" gradientUnits="userSpaceOnUse"> <stop stop-color="#20478B"></stop> <stop offset="1" stop-color="#2D6FD1"></stop> </linearGradient> <linearGradient id="paint3_linear_87_7724" x1="18.5" y1="13" x2="32" y2="13" gradientUnits="userSpaceOnUse"> <stop stop-color="#215295"></stop> <stop offset="1" stop-color="#2E84D3"></stop> </linearGradient> <linearGradient id="paint4_linear_87_7724" x1="3.31137e-08" y1="17" x2="19" y2="17" gradientUnits="userSpaceOnUse"> <stop stop-color="#223E74"></stop> <stop offset="1" stop-color="#215091"></stop> </linearGradient> </defs> </g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.EXCEL.some(ext => blobName.toLowerCase().endsWith(ext))) {
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><defs><linearGradient id="a" x1="4.494" y1="-2092.086" x2="13.832" y2="-2075.914" gradientTransform="translate(0 2100)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#18884f"></stop><stop offset="0.5" stop-color="#117e43"></stop><stop offset="1" stop-color="#0b6631"></stop></linearGradient></defs><title>file_type_excel</title><path d="M19.581,15.35,8.512,13.4V27.809A1.192,1.192,0,0,0,9.705,29h19.1A1.192,1.192,0,0,0,30,27.809h0V22.5Z" style="fill:#185c37"></path><path d="M19.581,3H9.705A1.192,1.192,0,0,0,8.512,4.191h0V9.5L19.581,16l5.861,1.95L30,16V9.5Z" style="fill:#21a366"></path><path d="M8.512,9.5H19.581V16H8.512Z" style="fill:#107c41"></path><path d="M16.434,8.2H8.512V24.45h7.922a1.2,1.2,0,0,0,1.194-1.191V9.391A1.2,1.2,0,0,0,16.434,8.2Z" style="opacity:0.10000000149011612;isolation:isolate"></path><path d="M15.783,8.85H8.512V25.1h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"></path><path d="M15.783,8.85H8.512V23.8h7.271a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.783,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"></path><path d="M15.132,8.85H8.512V23.8h6.62a1.2,1.2,0,0,0,1.194-1.191V10.041A1.2,1.2,0,0,0,15.132,8.85Z" style="opacity:0.20000000298023224;isolation:isolate"></path><path d="M3.194,8.85H15.132a1.193,1.193,0,0,1,1.194,1.191V21.959a1.193,1.193,0,0,1-1.194,1.191H3.194A1.192,1.192,0,0,1,2,21.959V10.041A1.192,1.192,0,0,1,3.194,8.85Z" style="fill:url(#a)"></path><path d="M5.7,19.873l2.511-3.884-2.3-3.862H7.758L9.013,14.6c.116.234.2.408.238.524h.017c.082-.188.169-.369.26-.546l1.342-2.447h1.7l-2.359,3.84,2.419,3.905H10.821l-1.45-2.711A2.355,2.355,0,0,1,9.2,16.8H9.176a1.688,1.688,0,0,1-.168.351L7.515,19.873Z" style="fill:#fff"></path><path d="M28.806,3H19.581V9.5H30V4.191A1.192,1.192,0,0,0,28.806,3Z" style="fill:#33c481"></path><path d="M19.581,16H30v6.5H19.581Z" style="fill:#107c41"></path></g></svg> ${contentType}`;
                    }
                    else if (fileExtensions.PPT.toLowerCase().endsWith('ppt') || blobName.toLowerCase().endsWith('pptx')) {
                        contentTypeCell.innerHTML = ``;
                    }
                    else {
                        //contentTypeCell.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 3.75H19.5L20.25 4.5V20.25H4.5L3.75 19.5V3.75ZM5.25 5.25V12.9166L7.90909 10.2575L13.3636 15.7121L16.7727 12.303L18.75 14.2802V5.25H5.25ZM18.75 16.4016L16.7727 14.4243L13.3636 17.8334L7.90909 12.3788L5.25 15.0379V18.75H18.75V16.4016ZM14.7273 7.97727C14.0118 7.97727 13.4318 8.55727 13.4318 9.27273C13.4318 9.98819 14.0118 10.5682 14.7273 10.5682C15.4427 10.5682 16.0227 9.98819 16.0227 9.27273C16.0227 8.55727 15.4427 7.97727 14.7273 7.97727ZM11.9318 9.27273C11.9318 7.72884 13.1834 6.47727 14.7273 6.47727C16.2712 6.47727 17.5227 7.72884 17.5227 9.27273C17.5227 10.8166 16.2712 12.0682 14.7273 12.0682C13.1834 12.0682 11.9318 10.8166 11.9318 9.27273Z" fill="#208113"></path> </g></svg> ${contentType}`;
                        contentTypeCell.innerHTML = `<svg width="24" version="1.1" id="Layer_1" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--fxemoji" preserveAspectRatio="xMidYMid meet" fill="#000000"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path fill="#F9E7C0" d="M437.567 512H88.004a8.182 8.182 0 0 1-8.182-8.182V8.182A8.182 8.182 0 0 1 88.004 0H288.79l156.96 156.96v346.858a8.183 8.183 0 0 1-8.183 8.182z"></path><path fill="#EAC083" d="M288.79 0l156.96 156.96H322.152c-18.426 0-33.363-14.937-33.363-33.363V0z"></path><path fill="#597B91" d="M235.078 92.401H126.453c-6.147 0-11.13-4.983-11.13-11.13s4.983-11.13 11.13-11.13h108.625c6.147 0 11.13 4.983 11.13 11.13s-4.983 11.13-11.13 11.13zm11.13 61.723c0-6.147-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h108.625c6.147 0 11.13-4.983 11.13-11.13zm0 72.854c0-6.147-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h108.625c6.147-.001 11.13-4.983 11.13-11.13zm94.038 72.853c0-6.146-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h202.663c6.147 0 11.13-4.983 11.13-11.13zm37.493-72.853c0-6.147-4.983-11.13-11.13-11.13h-74.985c-6.146 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13h74.985c6.147-.001 11.13-4.983 11.13-11.13zM299.92 372.685c0-6.146-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13H288.79c6.147-.001 11.13-4.984 11.13-11.13zm66.21 72.853c0-6.146-4.983-11.13-11.13-11.13H126.453c-6.147 0-11.13 4.983-11.13 11.13s4.983 11.13 11.13 11.13H355c6.146 0 11.13-4.983 11.13-11.13z"></path></g></svg> ${contentType}`;
                        //contentTypeCell.textContent = contentType;
                    }


                    const lastModifiedCell = document.createElement('div');
                    lastModifiedCell.className = 'document-cell';
                    const formattedDate = new Date(lastModified).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                    }).replace(',', '');
                    lastModifiedCell.textContent = formattedDate;

                    //test

                    // Append the cells to the document row
                    documentRow.appendChild(previewCell);
                    documentRow.appendChild(statusCell);
                    documentRow.appendChild(nameCell);
                    documentRow.appendChild(contentTypeCell);
                    documentRow.appendChild(lastModifiedCell);

                    // Append the document row to the document list
                    docList.appendChild(documentRow);
                });
            }
        })
        .catch(error => console.error('Error:', error));
}

//code to send chat message to Azure Copilot
async function sendMessage() {
    const userInput = $('#chat-input').val();
    if (!userInput) return;

    displayMessage('User', userInput);
    $('#user-input').val('');

    const apiKey = '';
    const apiVersion = '2024-02-15-preview';
    const deploymentId = 'gpt-4o';
    const region = 'eastus';
    const endpoint = `https://${region}.api.cognitive.microsoft.com/openai/deployments/${deploymentId}/chat/completions?api-version=${apiVersion}&api-key=${apiKey}`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    displayMessage('Azure Copilot', data.reply);
}

//code to display chat messages
function displayMessage(sender, message) {
    const chatDisplay = $('#chat-display');
    const messageElement = $('<div>').text(`${sender}: ${message}`);
    chatDisplay.append(messageElement);
    chatDisplay.scrollTop(chatDisplay[0].scrollHeight);
}

//code to toggle between chat and document screens
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

//code to toggle between chat and document screens
function toggleDisplay(screen) {
    const $chatContainer = $('#chat-container');
    const $documentContainer = $('#document-container');

    if (screen === 'chat') {
        $chatContainer.show();
        $documentContainer.hide();
    } else if (screen === 'documents') {
        $chatContainer.hide();
        $documentContainer.show();
    } else {
        $chatContainer.hide();
        $documentContainer.hide();
    }
}

// Function to update the file count
function updateFileCount() {
    const fileCount = document.getElementById('file-input').files.length;
    document.getElementById('file-count').textContent = `Files selected: ${fileCount}`;
}

//code to update placeholder text
function updatePlaceholder() {
    const noFilesPlaceholder = document.getElementById('num-files-selected-placeholder');
    const fileList = document.getElementById('file-list');
    const files = document.getElementById('file-input').files;
    const uploadButton = document.getElementById('upload-button');

    const fileCount = files.length;
    let totalSize = 0;

    for (let i = 0; i < fileCount; i++) {
        totalSize += files[i].size;
    }

    // Convert total size to KB
    const totalSizeKB = (totalSize / 1024).toFixed(2);
    if (fileCount === 0) {
        noFilesPlaceholder.textContent = 'No files selected';
        noFilesPlaceholder.style.display = 'block';
        uploadButton.disabled = true;
    } else {
        noFilesPlaceholder.textContent = `${fileCount} file(s) selected (${totalSizeKB} KB)`;
        noFilesPlaceholder.style.display = 'block';
        uploadButton.disabled = false;
    }
}

//code to upload files to Azure Storage
async function uploadFilesToAzure(files) {
    const accountName = "stdcdaiprodpoc001";
    const azureStorageUrl = "blob.core.windows.net";
    const containerName = "content";
    const accessKey = "7";

    const sv = "2022-11-02";
    const ss = "bfqt";
    const srt = "sco";
    const sp = "rwdlacupiytfx";
    const se = "2025-10-08T04:00:00Z";
    const st = "2024-10-08T04:00:00Z";
    const spr = "https";
    const sig = "sfSvKnCMycPfgT4y%2FpcMSsW3nXsVr8sLCrR7rAgDgZk%3D";
    const comp = "list";
    const include = "metadata";
    const restype = "container";

    //https://stdcdaiprodpoc001.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2025-10-08T04:00:00Z&st=2024-10-08T04:00:00Z&spr=https&sig=sfSvKnCMycPfgT4y%2FpcMSsW3nXsVr8sLCrR7rAgDgZk%3D
    // Construct the SAS token from the individual components
    const sasToken = `sv=${sv}&comp=${comp}&include=${include}&restype=${restype}&ss=${ss}&srt=${srt}&sp=${sp}&se=${se}&st=${st}&spr=${spr}&sig=${sig}`;

    const storageUrl = `https://${accountName}.${azureStorageUrl}/${containerName}`;

    async function uploadFiles(files) {
        for (const file of files) {
            const uploadUrl = `${storageUrl}/${file.name}`;
            const date = new Date().toUTCString();
            const stringToSign = `PUT\n\n${file.size}\n\n${file.type}\n\n\n\n\n\n\n\nx-ms-blob-type:BlockBlob\nx-ms-date:${date}\nx-ms-version:2020-10-02\n/${accountName}/${containerName}/${file.name}`;
            const signature = CryptoJS.HmacSHA256(stringToSign, CryptoJS.enc.Base64.parse(accessKey));
            const authorizationHeader = `SharedKey ${accountName}:${CryptoJS.enc.Base64.stringify(signature)}`;

            console.write(`Upload URL: ${uploadUrl}`);

            //const uploadUrl = `${storageUrl}/${file.name}?${sasToken}`;

            try {
                const response = await fetch(uploadUrl, {
                    method: 'PUT',
                    headers: {
                        'x-ms-blob-type': 'BlockBlob',
                        'Content-Type': file.type,
                        'Content-Length': file.size.toString(),
                        'x-ms-date': date,
                        'x-ms-version': '2020-10-02',
                        'Authorization': authorizationHeader
                    },
                    body: file
                });

                if (response.ok) {
                    console.log(`Upload successful for ${file.name}.`);
                } else {
                    const errorText = await response.text();
                    console.error(`Error uploading file ${file.name} to Azure Storage:`, errorText);
                }
            } catch (error) {
                console.error(`Error uploading file ${file.name} to Azure Storage:`, error.message);
            }
        }
    }
    // Clear the file input after successful upload
    clearFileInput();
}

//code to clear file input
function clearFileInput() {
    const fileInput = document.getElementById('file-input');
    fileInput.value = ''; // Clear the file input

    const selectedFilesDiv = document.getElementById('file-list');
    selectedFilesDiv.innerHTML = ''; // Clear the list of selected files
    updatePlaceholder(); // Update the placeholder text
}

async function getSasToken() {
    const sasFunctionAppUrl = config.AZURE_FUNCTION_APP_URL;
    const response = await fetch(`${sasFunctionAppUrl}`); // Assuming the Azure Function App endpoint is /api/getSasToken
    if (!response.ok) {
        throw new Error('Failed to fetch SAS token');
    }
    const data = await response.json();
    return data.sasToken;
}
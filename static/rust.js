function runDetection() {
    const fileInput = document.getElementById("imageInput");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select an image");
        return;
    }

    // Hide welcome section and show image grid
    const welcomeSection = document.getElementById("welcomeSection");
    const imageGrid = document.getElementById("imageGrid");
    
    if (welcomeSection) {
        welcomeSection.style.display = "none";
    }
    if (imageGrid) {
        imageGrid.style.display = "grid";
        imageGrid.style.animation = "fadeIn 0.6s ease-out";
    }

    // Get elements
    const originalImg = document.getElementById("originalImage");
    const resultImg = document.getElementById("resultImage");
    const downloadBtn = document.getElementById("downloadBtn");
    const resultWrapper = resultImg.closest(".image-wrapper");
    
    // Display original image immediately
    originalImg.src = URL.createObjectURL(file);
    originalImg.style.display = "block";
    originalImg.onload = function() {
        // Clean up object URL after image loads
        URL.revokeObjectURL(this.src);
    };
    
    // Clear result image and hide download button
    resultImg.src = "";
    resultImg.style.display = "none";
    downloadBtn.style.display = "none";
    
    // Show loading state in result card
    const existingLoading = resultWrapper.querySelector("#loadingMsg");
    if (existingLoading) {
        existingLoading.remove();
    }
    
    const loadingMsg = document.createElement("div");
    loadingMsg.id = "loadingMsg";
    loadingMsg.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 1rem;">
            <div style="width: 40px; height: 40px; border: 3px solid #E5DDD3; border-top-color: #C97D60; border-radius: 50%; animation: spin 0.8s linear infinite;"></div>
            <span>Processing image...</span>
        </div>
    `;
    
    // Add spin animation if not already in styles
    if (!document.getElementById('loading-spin-style')) {
        const style = document.createElement('style');
        style.id = 'loading-spin-style';
        style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
        document.head.appendChild(style);
    }
    
    resultWrapper.appendChild(loadingMsg);

    // Prepare form data
    const formData = new FormData();
    formData.append("image", file);

    // Disable button during processing
    const detectBtn = document.querySelector(".detect-btn");
    const originalBtnText = detectBtn.innerHTML;
    detectBtn.disabled = true;
    detectBtn.style.opacity = "0.6";
    detectBtn.style.cursor = "not-allowed";

    // Send request
    fetch("/detect/", {
        method: "POST",
        body: formData
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => Promise.reject(err));
        }
        return res.json();
    })
    .then(data => {
        // Remove loading message
        const loading = resultWrapper.querySelector("#loadingMsg");
        if (loading) {
            loading.remove();
        }
        
        // Display detected image
        resultImg.src = data.detected_image_url;
        resultImg.style.display = "block";
        downloadBtn.href = data.detected_image_url;
        downloadBtn.style.display = "flex";
        
        // Update original image URL if server returned it
        if (data.original_image_url) {
            originalImg.src = data.original_image_url;
        }
        
        // Re-enable button
        detectBtn.disabled = false;
        detectBtn.style.opacity = "1";
        detectBtn.style.cursor = "pointer";
    })
    .catch(err => {
        // Remove loading message
        const loading = resultWrapper.querySelector("#loadingMsg");
        if (loading) {
            loading.remove();
        }
        
        // Show error in placeholder
        const placeholder = resultWrapper.querySelector(".placeholder");
        if (placeholder) {
            placeholder.innerHTML = `
                <span class="placeholder-icon">⚠️</span>
                <span class="placeholder-text">${err.error || "Detection failed. Please try again."}</span>
            `;
            placeholder.style.display = "flex";
        }
        
        // Re-enable button
        detectBtn.disabled = false;
        detectBtn.style.opacity = "1";
        detectBtn.style.cursor = "pointer";
        
        console.error(err);
    });
}

// Update file input label when file is selected
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById("imageInput");
    const fileLabel = document.querySelector(".file-label .file-text");
    
    if (fileInput && fileLabel) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                fileLabel.textContent = e.target.files[0].name;
            } else {
                fileLabel.textContent = "Choose Image";
            }
        });
    }
});

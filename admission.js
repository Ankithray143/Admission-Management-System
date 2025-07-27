document.addEventListener('DOMContentLoaded', function() {
    // Check login status
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }

    const API_BASE_URL = 'http://localhost:8080/api/students';
    const form = document.getElementById('admissionForm');
    const formSteps = document.querySelectorAll('.form-step');
    const progressBar = document.querySelector('.progress-bar');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const submitBtn = document.getElementById('submitBtn');
    let currentStep = 1;

    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Next button click handler
    nextBtn.addEventListener('click', () => {
        if (validateCurrentStep()) {
            showStep(currentStep + 1);
        }
    });

    // Previous button click handler
    prevBtn.addEventListener('click', () => {
        showStep(currentStep - 1);
    });

    // Show step function
    function showStep(step) {
        formSteps.forEach(el => el.style.display = 'none');
        formSteps[step - 1].style.display = 'block';

        // Update buttons
        prevBtn.style.display = step > 1 ? 'inline-block' : 'none';
        nextBtn.style.display = step < 4 ? 'inline-block' : 'none';
        submitBtn.style.display = step === 4 ? 'inline-block' : 'none';

        // Update progress bar
        const progress = ((step - 1) / 3) * 100;
        progressBar.style.width = `${progress}%`;
        progressBar.setAttribute('aria-valuenow', progress);

        // Update step indicators
        document.querySelectorAll('.step').forEach((el, index) => {
            if (index + 1 < step) {
                el.classList.add('completed');
            } else {
                el.classList.remove('completed');
            }
            if (index + 1 === step) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        // If on review step, populate review content
        if (step === 4) {
            populateReview();
        }

        currentStep = step;
    }

    // Validate current step
    function validateCurrentStep() {
        const currentStepElement = formSteps[currentStep - 1];
        const inputs = currentStepElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        const errors = [];

        inputs.forEach(input => {
            const label = input.previousElementSibling?.textContent || 'This field';
            
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('is-invalid');
                errors.push(`${label} is required`);
            } else {
                // Additional validation based on input type
                if (input.type === 'email' && !validateEmail(input.value)) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    errors.push(`${label} must be a valid email address`);
                } else if (input.type === 'tel' && !validatePhone(input.value)) {
                    isValid = false;
                    input.classList.add('is-invalid');
                    errors.push(`${label} must be a valid phone number`);
                } else if (input.type === 'number') {
                    const val = parseFloat(input.value);
                    if (input.name === 'percentage' && (val < 0 || val > 100)) {
                        isValid = false;
                        input.classList.add('is-invalid');
                        errors.push(`${label} must be between 0 and 100`);
                    } else if (input.name === 'passingYear') {
                        const currentYear = new Date().getFullYear();
                        if (val < 1900 || val > currentYear) {
                            isValid = false;
                            input.classList.add('is-invalid');
                            errors.push(`${label} must be between 1900 and ${currentYear}`);
                        }
                    }
                } else if (input.type === 'file') {
                    const file = input.files[0];
                    if (file) {
                        if (input.name === 'profilePhoto') {
                            if (!validateImageFile(file)) {
                                isValid = false;
                                input.classList.add('is-invalid');
                                errors.push(`${label} must be a JPG or PNG file under 2MB`);
                            }
                        } else if (input.name === 'certificates') {
                            if (!validatePdfFile(file)) {
                                isValid = false;
                                input.classList.add('is-invalid');
                                errors.push(`${label} must be a PDF file under 5MB`);
                            }
                        }
                    }
                }
                
                if (isValid) {
                    input.classList.remove('is-invalid');
                }
            }
        });

        if (!isValid) {
            Swal.fire({
                icon: 'warning',
                title: 'Validation Errors',
                html: errors.join('<br>'),
                confirmButtonText: 'Ok, I\'ll fix it'
            });
        }

        return isValid;
    }

    // Helper validation functions
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function validatePhone(phone) {
        return /^\d{10}$/.test(phone.replace(/[^\d]/g, ''));
    }

    function validateImageFile(file) {
        const validTypes = ['image/jpeg', 'image/png'];
        const maxSize = 2 * 1024 * 1024; // 2MB
        return validTypes.includes(file.type) && file.size <= maxSize;
    }

    function validatePdfFile(file) {
        const validType = 'application/pdf';
        const maxSize = 5 * 1024 * 1024; // 5MB
        return file.type === validType && file.size <= maxSize;
    }

    // File upload preview
    const fileInputs = document.querySelectorAll('input[type="file"]');
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const maxSize = this.name === 'profilePhoto' ? 2 : 5; // MB
                if (file.size > maxSize * 1024 * 1024) {
                    this.value = '';
                    Swal.fire({
                        icon: 'error',
                        title: 'File Too Large',
                        text: `Maximum file size allowed is ${maxSize}MB`
                    });
                    return;
                }

                if (this.name === 'profilePhoto') {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        const preview = document.createElement('img');
                        preview.src = e.target.result;
                        preview.className = 'img-thumbnail mt-2';
                        preview.style.maxHeight = '200px';
                        
                        const previewContainer = input.parentElement;
                        const existingPreview = previewContainer.querySelector('img');
                        if (existingPreview) {
                            previewContainer.removeChild(existingPreview);
                        }
                        previewContainer.appendChild(preview);
                    };
                    reader.readAsDataURL(file);
                }
            }
        });
    });

    // Populate review step
    function populateReview() {
        const formData = new FormData(form);
        let reviewHTML = '';

        // Personal Information
        reviewHTML += `
            <div class="review-section mb-4">
                <h4 class="mb-3">Personal Information</h4>
                <div class="row g-3">
                    <div class="col-md-6">
                        <p><strong>Name:</strong> ${formData.get('studentName')}</p>
                        <p><strong>Email:</strong> ${formData.get('email')}</p>
                        <p><strong>Phone:</strong> ${formData.get('phone')}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Father's Name:</strong> ${formData.get('fatherName')}</p>
                        <p><strong>Mother's Name:</strong> ${formData.get('motherName')}</p>
                        <p><strong>Date of Birth:</strong> ${formData.get('dob')}</p>
                    </div>
                    <div class="col-12">
                        <p><strong>Address:</strong> ${formData.get('address')}</p>
                    </div>
                </div>
            </div>
        `;

        // Academic Details
        reviewHTML += `
            <div class="review-section mb-4">
                <h4 class="mb-3">Academic Details</h4>
                <div class="row g-3">
                    <div class="col-md-6">
                        <p><strong>Course:</strong> ${formData.get('course')}</p>
                        <p><strong>Category:</strong> ${formData.get('category')}</p>
                        <p><strong>Previous Institution:</strong> ${formData.get('previousInstitution')}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Board/University:</strong> ${formData.get('board')}</p>
                        <p><strong>Percentage/CGPA:</strong> ${formData.get('percentage')}</p>
                        <p><strong>Year of Passing:</strong> ${formData.get('passingYear')}</p>
                    </div>
                </div>
            </div>
        `;

        // Documents
        const profilePhoto = formData.get('profilePhoto');
        const certificates = formData.get('certificates');
        
        reviewHTML += `
            <div class="review-section">
                <h4 class="mb-3">Uploaded Documents</h4>
                <div class="row g-3">
                    <div class="col-md-6">
                        <p><strong>Profile Photo:</strong> ${profilePhoto ? profilePhoto.name : 'Not uploaded'}</p>
                    </div>
                    <div class="col-md-6">
                        <p><strong>Certificates:</strong> ${certificates ? certificates.name : 'Not uploaded'}</p>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('reviewContent').innerHTML = reviewHTML;
    }

    // Form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!validateCurrentStep()) {
            return;
        }

        // Show loading state
        const submitButton = document.getElementById('submitBtn');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Submitting...';

        try {
            const formData = new FormData(this);
            
            // Store in localStorage for demo
            const applicationData = {};
            formData.forEach((value, key) => {
                if (key === 'profilePhoto' || key === 'certificates') {
                    applicationData[key] = URL.createObjectURL(value);
                } else {
                    applicationData[key] = value;
                }
            });
            
            localStorage.setItem('applicationData', JSON.stringify(applicationData));

            // Show success message
            await Swal.fire({
                icon: 'success',
                title: 'Application Submitted!',
                text: 'Your application has been submitted successfully.',
                confirmButtonText: 'View Applications'
            });

            // Redirect to student applications page
            window.location.href = 'student-applications.html';
        } catch (error) {
            console.error('Submission error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'There was an error submitting your application. Please try again.',
                confirmButtonText: 'Ok'
            });
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });

    // Logout handler
    document.getElementById('logoutBtn').addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.clear();
        window.location.href = 'login.html';
    });

    // Initialize first step
    showStep(1);
});

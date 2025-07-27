document.addEventListener('DOMContentLoaded', function() {
    // Load application details from localStorage or session
    loadApplicationDetails();

    // Setup event listeners
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => openEditModal(btn.dataset.section));
    });

    document.getElementById('saveChanges').addEventListener('click', saveChanges);
    document.getElementById('printApplication').addEventListener('click', printApplication);
    document.getElementById('downloadPDF').addEventListener('click', downloadPDF);
    document.getElementById('logoutBtn').addEventListener('click', handleLogout);
});

function loadApplicationDetails() {
    // In a real application, this would fetch data from the server
    // For demo, we'll use mock data
    const applicationData = JSON.parse(localStorage.getItem('applicationData')) || {
        personalInfo: {
            fullName: 'John Doe',
            dob: '2000-01-01',
            gender: 'Male',
            email: 'john.doe@example.com',
            phone: '+91 9876543210',
            category: 'General'
        },
        academicInfo: {
            prevInstitution: 'ABC Higher Secondary School',
            board: 'State Board',
            percentage: '95%'
        }
    };

    // Update DOM with application data
    document.getElementById('fullName').textContent = applicationData.personalInfo.fullName;
    document.getElementById('dob').textContent = applicationData.personalInfo.dob;
    document.getElementById('gender').textContent = applicationData.personalInfo.gender;
    document.getElementById('email').textContent = applicationData.personalInfo.email;
    document.getElementById('phone').textContent = applicationData.personalInfo.phone;
    document.getElementById('category').textContent = applicationData.personalInfo.category;

    document.getElementById('prevInstitution').textContent = applicationData.academicInfo.prevInstitution;
    document.getElementById('board').textContent = applicationData.academicInfo.board;
    document.getElementById('percentage').textContent = applicationData.academicInfo.percentage;
}

function openEditModal(section) {
    const modal = new bootstrap.Modal(document.getElementById('editModal'));
    const form = document.getElementById('editForm');
    form.innerHTML = ''; // Clear previous form fields

    switch(section) {
        case 'personal':
            createPersonalInfoForm(form);
            break;
        case 'academic':
            createAcademicInfoForm(form);
            break;
        case 'documents':
            createDocumentsForm(form);
            break;
    }

    modal.show();
}

function createPersonalInfoForm(form) {
    const fields = [
        { label: 'Full Name', id: 'editFullName', type: 'text', value: document.getElementById('fullName').textContent },
        { label: 'Date of Birth', id: 'editDob', type: 'date', value: document.getElementById('dob').textContent },
        { label: 'Gender', id: 'editGender', type: 'select', options: ['Male', 'Female', 'Other'], value: document.getElementById('gender').textContent },
        { label: 'Email', id: 'editEmail', type: 'email', value: document.getElementById('email').textContent },
        { label: 'Phone', id: 'editPhone', type: 'tel', value: document.getElementById('phone').textContent },
        { label: 'Category', id: 'editCategory', type: 'select', options: ['General', 'OBC', 'SC', 'ST'], value: document.getElementById('category').textContent }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'mb-3';
        
        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = field.label;
        
        let input;
        if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(option => {
                const opt = document.createElement('option');
                opt.value = option;
                opt.textContent = option;
                opt.selected = option === field.value;
                input.appendChild(opt);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
            input.value = field.value;
        }
        
        input.className = 'form-control';
        input.id = field.id;
        
        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });
}

function createAcademicInfoForm(form) {
    const fields = [
        { label: 'Previous Institution', id: 'editPrevInstitution', type: 'text', value: document.getElementById('prevInstitution').textContent },
        { label: 'Board/University', id: 'editBoard', type: 'text', value: document.getElementById('board').textContent },
        { label: 'Percentage/CGPA', id: 'editPercentage', type: 'text', value: document.getElementById('percentage').textContent }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'mb-3';
        
        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = field.label;
        
        const input = document.createElement('input');
        input.type = field.type;
        input.className = 'form-control';
        input.id = field.id;
        input.value = field.value;
        
        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });
}

function createDocumentsForm(form) {
    const fields = [
        { label: 'Profile Photo', id: 'editProfilePhoto', type: 'file', accept: 'image/*' },
        { label: 'Academic Certificates', id: 'editCertificates', type: 'file', accept: '.pdf,.doc,.docx' }
    ];

    fields.forEach(field => {
        const div = document.createElement('div');
        div.className = 'mb-3';
        
        const label = document.createElement('label');
        label.className = 'form-label';
        label.textContent = field.label;
        
        const input = document.createElement('input');
        input.type = field.type;
        input.className = 'form-control';
        input.id = field.id;
        input.accept = field.accept;
        
        div.appendChild(label);
        div.appendChild(input);
        form.appendChild(div);
    });
}

function saveChanges() {
    Swal.fire({
        title: 'Saving Changes...',
        timer: 1000,
        timerProgressBar: true,
        didOpen: () => {
            Swal.showLoading();
        }
    }).then(() => {
        // Update the displayed information
        // In a real application, this would also send data to the server
        updateDisplayedInfo();

        Swal.fire({
            icon: 'success',
            title: 'Changes Saved Successfully',
            showConfirmButton: false,
            timer: 1500
        });

        // Close the modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'));
        modal.hide();
    });
}

function updateDisplayedInfo() {
    const form = document.getElementById('editForm');
    const inputs = form.querySelectorAll('input, select');
    
    inputs.forEach(input => {
        const displayElement = document.getElementById(input.id.replace('edit', '').toLowerCase());
        if (displayElement) {
            displayElement.textContent = input.value;
        }
    });
}

function printApplication() {
    window.print();
}

function downloadPDF() {
    const element = document.getElementById('applicationDetails');
    const opt = {
        margin: 1,
        filename: 'application-details.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
}

function handleLogout() {
    Swal.fire({
        title: 'Are you sure you want to logout?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, logout',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = 'login.html';
        }
    });
}

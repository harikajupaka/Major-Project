import { db } from './firebase-config.js';
import { 
    collection, 
    addDoc, 
    getDocs, 
    doc, 
    updateDoc, 
    deleteDoc,
    query,
    orderBy,
    serverTimestamp 
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js';

// DOM Elements
const registrationForm = document.getElementById('registrationForm');
const editForm = document.getElementById('editForm');
const resetBtn = document.getElementById('resetBtn');
const editModal = document.getElementById('editModal');
const closeModal = document.getElementById('closeModal');
const cancelEdit = document.getElementById('cancelEdit');
const customersList = document.getElementById('customersList');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');
const errorMessageText = document.getElementById('errorMessageText');
const themeToggle = document.getElementById('themeToggle');

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Validation Functions
const validators = {
    name: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.trim().length < 2) return 'Name must be at least 2 characters';
        if (!/^[a-zA-Z\s]+$/.test(value)) return 'Name can only contain letters and spaces';
        return '';
    },
    
    age: (value) => {
        if (!value) return 'Age is required';
        const age = parseInt(value);
        if (isNaN(age)) return 'Age must be a number';
        if (age < 1 || age > 150) return 'Age must be between 1 and 150';
        return '';
    },
    
    gender: (value) => {
        if (!value) return 'Please select a gender';
        return '';
    },
    
    email: (value) => {
        if (!value.trim()) return 'Email is required';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return 'Please enter a valid email address';
        return '';
    },
    
    phone: (value) => {
        if (!value.trim()) return 'Phone number is required';
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        if (!phoneRegex.test(value)) return 'Please enter a valid phone number';
        if (value.replace(/\D/g, '').length < 10) return 'Phone number must be at least 10 digits';
        return '';
    }
};

// Show/Hide Messages
function showSuccess(message) {
    successMessage.querySelector('span').textContent = message;
    successMessage.style.display = 'flex';
    setTimeout(() => {
        successMessage.style.display = 'none';
    }, 5000);
}

function showError(message) {
    errorMessageText.textContent = message;
    errorMessage.style.display = 'flex';
    setTimeout(() => {
        errorMessage.style.display = 'none';
    }, 5000);
}

// Validate Single Field
function validateField(fieldName, value) {
    const errorElement = document.getElementById(`${fieldName}Error`);
    const error = validators[fieldName] ? validators[fieldName](value) : '';
    
    if (errorElement) {
        errorElement.textContent = error;
    }
    
    return error === '';
}

// Validate Entire Form
function validateForm(formData) {
    let isValid = true;
    const errors = {};
    
    // Validate each field
    for (const [key, value] of Object.entries(formData)) {
        if (validators[key]) {
            const error = validators[key](value);
            if (error) {
                errors[key] = error;
                isValid = false;
                const errorElement = document.getElementById(`${key}Error`);
                if (errorElement) {
                    errorElement.textContent = error;
                }
            }
        }
    }
    
    return { isValid, errors };
}

// Clear Form Validation Errors
function clearValidationErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

// Get Form Data
function getFormData(form) {
    const formData = new FormData(form);
    return {
        name: formData.get('name'),
        age: formData.get('age'),
        gender: formData.get('gender') || formData.get('editGender'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address') || ''
    };
}

// Add Real-time Validation
function addRealtimeValidation() {
    // Name validation
    document.getElementById('name').addEventListener('input', (e) => {
        validateField('name', e.target.value);
    });
    
    // Age validation
    document.getElementById('age').addEventListener('input', (e) => {
        validateField('age', e.target.value);
    });
    
    // Email validation
    document.getElementById('email').addEventListener('input', (e) => {
        validateField('email', e.target.value);
    });
    
    // Phone validation
    document.getElementById('phone').addEventListener('input', (e) => {
        validateField('phone', e.target.value);
    });
    
    // Gender validation
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            validateField('gender', e.target.value);
        });
    });
}

// Register Customer (Create)
async function registerCustomer(customerData) {
    try {
        const customersRef = collection(db, 'customers');
        const docRef = await addDoc(customersRef, {
            ...customerData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        
        console.log('Customer registered with ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error registering customer:', error);
        return { success: false, error: error.message };
    }
}

// Load All Customers (Read)
async function loadCustomers() {
    try {
        const customersRef = collection(db, 'customers');
        const q = query(customersRef, orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        customersList.innerHTML = '';
        
        if (querySnapshot.empty) {
            customersList.innerHTML = `
                <div class="empty-state">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="9" cy="7" r="4"></circle>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <p>No customers registered yet. Register your first customer above!</p>
                </div>
            `;
            return;
        }
        
        querySnapshot.forEach((doc) => {
            const customer = doc.data();
            const customerId = doc.id;
            
            const card = document.createElement('div');
            card.className = 'customer-card';
            card.innerHTML = `
                <h4>${customer.name}</h4>
                <p><strong>Age:</strong> ${customer.age}</p>
                <p><strong>Gender:</strong> ${customer.gender.charAt(0).toUpperCase() + customer.gender.slice(1)}</p>
                <p><strong>Email:</strong> ${customer.email}</p>
                <p><strong>Phone:</strong> ${customer.phone}</p>
                ${customer.address ? `<p><strong>Address:</strong> ${customer.address}</p>` : ''}
                <div class="card-actions">
                    <button class="btn-edit" onclick="editCustomer('${customerId}')">Edit Profile</button>
                    <button class="btn-delete" onclick="deleteCustomer('${customerId}')">Delete</button>
                </div>
            `;
            
            customersList.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading customers:', error);
        showError('Failed to load customers. Please refresh the page.');
    }
}

// Edit Customer (Update)
window.editCustomer = async function(customerId) {
    try {
        const customersRef = collection(db, 'customers');
        const querySnapshot = await getDocs(customersRef);
        
        let customerData = null;
        querySnapshot.forEach((doc) => {
            if (doc.id === customerId) {
                customerData = { id: doc.id, ...doc.data() };
            }
        });
        
        if (customerData) {
            // Populate edit form
            document.getElementById('editCustomerId').value = customerData.id;
            document.getElementById('editName').value = customerData.name;
            document.getElementById('editAge').value = customerData.age;
            document.getElementById('editEmail').value = customerData.email;
            document.getElementById('editPhone').value = customerData.phone;
            document.getElementById('editAddress').value = customerData.address || '';
            
            // Set gender radio button
            const genderRadio = document.querySelector(`input[name="editGender"][value="${customerData.gender}"]`);
            if (genderRadio) {
                genderRadio.checked = true;
            }
            
            // Show modal
            editModal.style.display = 'flex';
        }
    } catch (error) {
        console.error('Error loading customer for edit:', error);
        showError('Failed to load customer data.');
    }
};

// Update Customer
async function updateCustomer(customerId, customerData) {
    try {
        const customerRef = doc(db, 'customers', customerId);
        await updateDoc(customerRef, {
            ...customerData,
            updatedAt: serverTimestamp()
        });
        
        return { success: true };
    } catch (error) {
        console.error('Error updating customer:', error);
        return { success: false, error: error.message };
    }
}

// Delete Customer
window.deleteCustomer = async function(customerId) {
    if (!confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
        return;
    }
    
    try {
        const customerRef = doc(db, 'customers', customerId);
        await deleteDoc(customerRef);
        
        showSuccess('Customer deleted successfully!');
        await loadCustomers();
    } catch (error) {
        console.error('Error deleting customer:', error);
        showError('Failed to delete customer. Please try again.');
    }
};

// Event Listeners
registrationForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    clearValidationErrors();
    const formData = getFormData(registrationForm);
    
    // Validate form
    const { isValid, errors } = validateForm(formData);
    
    if (!isValid) {
        showError('Please fix the errors in the form before submitting.');
        return;
    }
    
    // Disable submit button
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering...';
    
    // Register customer
    const result = await registerCustomer(formData);
    
    if (result.success) {
        showSuccess('Customer registered successfully!');
        registrationForm.reset();
        clearValidationErrors();
        await loadCustomers();
    } else {
        showError(`Failed to register customer: ${result.error}`);
    }
    
    // Re-enable submit button
    submitBtn.disabled = false;
    submitBtn.textContent = 'Register Customer';
});

// Edit Form Submit
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const customerId = document.getElementById('editCustomerId').value;
    const formData = getFormData(editForm);
    
    // Validate form
    const { isValid, errors } = validateForm(formData);
    
    if (!isValid) {
        showError('Please fix the errors in the form before updating.');
        return;
    }
    
    // Update customer
    const result = await updateCustomer(customerId, formData);
    
    if (result.success) {
        showSuccess('Customer profile updated successfully!');
        editModal.style.display = 'none';
        await loadCustomers();
    } else {
        showError(`Failed to update customer: ${result.error}`);
    }
});

// Reset Button
resetBtn.addEventListener('click', () => {
    registrationForm.reset();
    clearValidationErrors();
});

// Close Modal
closeModal.addEventListener('click', () => {
    editModal.style.display = 'none';
});

cancelEdit.addEventListener('click', () => {
    editModal.style.display = 'none';
});

// Close modal when clicking outside
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        editModal.style.display = 'none';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    addRealtimeValidation();
    loadCustomers();
});

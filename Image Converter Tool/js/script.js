// Free Image Converter Tool - Core Logic

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('imageInput');
    const previewArea = document.getElementById('preview-area');
    const imagePreview = document.getElementById('imagePreview');
    const formatSelect = document.getElementById('formatSelect');
    const convertBtn = document.getElementById('convertBtn');
    const statusArea = document.getElementById('status-area');
    const loader = document.getElementById('loader');
    const successMessage = document.getElementById('successMessage');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');

    let originalFileName = '';
    let originalImage = null;

    // Mobile Menu Toggle
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'white';
        navMenu.style.padding = '1rem';
        navMenu.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
    });

    // Upload Logic
    uploadArea.addEventListener('click', () => imageInput.click());

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
        uploadArea.style.background = '#eff6ff';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.background = 'transparent';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border-color)';
        uploadArea.style.background = 'transparent';
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFile(file);
        }
    });

    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    });

    function handleFile(file) {
        originalFileName = file.name.split('.').slice(0, -1).join('.');
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            originalImage = new Image();
            originalImage.src = e.target.result;

            originalImage.onload = () => {
                uploadArea.style.display = 'none';
                previewArea.style.display = 'block';
                statusArea.style.display = 'block';
                successMessage.style.display = 'none';
            };
        };
        reader.readAsDataURL(file);
    }

    // Conversion Logic
    convertBtn.addEventListener('click', () => {
        const format = formatSelect.value;
        const extension = format.split('/')[1].replace('jpeg', 'jpg');

        loader.style.display = 'block';
        convertBtn.disabled = true;
        successMessage.style.display = 'none';

        // Simulate transition for better UX
        setTimeout(() => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = originalImage.width;
            canvas.height = originalImage.height;

            // Handle transparency for JPG (white background)
            if (format === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            ctx.drawImage(originalImage, 0, 0);

            // Convert and Download
            canvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `${originalFileName}-converted.${extension}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);

                loader.style.display = 'none';
                convertBtn.disabled = false;
                successMessage.style.display = 'block';
            }, format, 0.9);
        }, 800);
    });

    // Reveal Animations
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
